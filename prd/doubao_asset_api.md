# Doubao Asset 接口文档

本文档覆盖 `/api/v1/doubao/asset` 组下全部接口，面向其他项目的研发和 AI 编程工具集成场景编写。文档内容以当前代码实现为准，重点说明请求格式、默认值、返回结构、状态流转以及接入注意事项。

## 1. 接口概览

统一前缀：

```text
/api/v1/doubao/asset
```

接口列表：

| 功能 | 方法 | 路径 |
| --- | --- | --- |
| 创建资产分组 | `POST` | `/group/create` |
| 创建资产 | `POST` | `/create` |
| 同步创建资产并返回状态 | `POST` | `/sync/create` |
| 查询资产列表 | `POST` | `/list` |
| 查询资产分组列表 | `POST` | `/group/list` |
| 获取单个资产 | `POST` | `/get` |
| 获取单个资产分组 | `POST` | `/group/get` |
| 更新资产分组 | `POST` | `/group/update` |
| 更新资产 | `POST` | `/update` |

## 2. 通用约定

### 2.1 请求方式

- 全部接口均为 `POST`
- `Content-Type` 必须为 `application/json`
- 即使是查询接口，也不能改成 `GET`
- 请求体必须是合法 JSON；没有筛选条件时请传 `{}`，不要传空 body

### 2.2 鉴权方式

所有接口都启用了 Bearer Token 鉴权：

```http
Authorization: Bearer <CREATE_ENDPOINT_TOKEN>
```

说明：

- Token 格式必须严格为 `Bearer ` 前缀加实际 token
- 建议由调用方通过环境变量或密钥管理系统注入，不要硬编码到业务仓库

鉴权失败时返回 `HTTP 401`，典型响应如下：

```json
{
  "code": 1097,
  "message": "token is invalid or expired"
}
```

可能出现的鉴权错误消息：

- `token is empty`
- `token format is invalid`
- `token is invalid or expired`

### 2.3 统一响应包装

业务接口成功或参数校验失败时，HTTP 状态码通常为 `200`，实际结果看响应体最外层 `code` 字段：

```json
{
  "code": 200,
  "message": "Success",
  "log_id": "20260319xxxxxxxx",
  "data": {
    "ResponseMetadata": {
      "RequestId": "0217423639xxxx",
      "Action": "CreateAsset",
      "Version": "2024-01-01",
      "Service": "ark",
      "Region": "cn-beijing"
    },
    "Result": {
      "Id": "asset-202603190001-xxxx"
    }
  }
}
```

### 2.4 响应结构分层

这组接口的响应有两层：

1. 平台统一外层：
   - `code`
   - `message`
   - `log_id`
   - `data`
2. Doubao Asset 上游透传层，位于 `data` 内：
   - `ResponseMetadata`
   - `Result`

### 2.5 请求字段与响应字段命名风格不同

这是最容易接错的地方：

- 请求 JSON 使用小写下划线风格，例如 `group_id`、`project_name`
- 响应 `data.Result` 使用大写驼峰风格，例如 `Id`、`GroupId`、`ProjectName`

不要自行把响应字段改写成 snake_case。

### 2.6 默认值与枚举

全局默认值：

| 字段 | 默认值 |
| --- | --- |
| `project_name` | `default` |
| `group_type` | `AIGC` |
| `asset_type` | `Image` |
| `page_number` | `1` |
| `page_size` | `20` |

枚举约束：

| 字段 | 可选值 |
| --- | --- |
| `group_type` | `AIGC` |
| `asset_type` | `Image` |
| `status` | `Active`、`Failed`、`Processing` |
| `sort_order` | `Asc`、`Desc` |
| 资产列表 `sort_by` | `CreateTime`、`UpdateTime`、`GroupId` |
| 分组列表 `sort_by` | `CreateTime`、`UpdateTime` |

### 2.7 资产状态说明

资产对象中的 `Status` 可能为：

- `Processing`：资产已创建，但上游仍在处理
- `Active`：资产可用
- `Failed`：资产处理失败，可查看 `Error.Code` 和 `Error.Message`

因此：

- `创建资产` 成功只表示创建请求成功，不代表该资产已经可被下游立即消费
- 接入方应通过 `获取资产` 或 `资产列表` 轮询，直到 `Status=Active`

## 3. 推荐集成流程

推荐按下面顺序接入：

1. 调用 `POST /group/create` 创建资产分组
2. 记录返回的 `group_id`
3. 调用 `POST /create` 创建资产，传入可公开访问的原始文件 URL
4. 记录返回的 `asset_id`
5. 轮询 `POST /get` 直到资产 `Status` 变成 `Active`
6. 在后续 AI 任务里引用该资产时，使用 `asset://<asset_id>`

引用示例：

```text
asset://asset-202603190001-xxxx
```

这类 `asset://` 引用适合在已支持资产引用的下游内容元素、素材引用字段中传递，不需要再把原始 URL 重复传给业务层。

## 4. 数据模型

### 4.1 ResponseMetadata

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `RequestId` | string | 上游请求 ID，排查问题时非常有用 |
| `Action` | string | 上游动作名，例如 `CreateAsset` |
| `Version` | string | 当前固定为 `2024-01-01` |
| `Service` | string | 当前固定为 `ark` |
| `Region` | string | 当前通常为 `cn-beijing` |

### 4.2 IDResult

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `Id` | string | 新建或更新后的主键 ID |

### 4.3 Asset

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `Id` | string | 资产 ID |
| `Name` | string | 资产名称 |
| `URL` | string | 原始来源 URL |
| `GroupId` | string | 所属资产分组 ID |
| `AssetType` | string | 当前固定为 `Image` |
| `Status` | string | `Active`、`Failed`、`Processing` |
| `Error` | object | 失败时的错误对象 |
| `ProjectName` | string | 项目名，默认 `default` |
| `CreateTime` | string | 创建时间字符串 |
| `UpdateTime` | string | 更新时间字符串 |

`Error` 结构：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `Code` | string | 上游错误码 |
| `Message` | string | 上游错误说明 |

### 4.4 AssetGroup

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `Id` | string | 分组 ID |
| `Name` | string | 分组名称 |
| `Title` | string | 上游返回字段，可能为空 |
| `Description` | string | 分组描述 |
| `GroupType` | string | 当前固定为 `AIGC` |
| `ProjectName` | string | 项目名，默认 `default` |
| `CreateTime` | string | 创建时间字符串 |
| `UpdateTime` | string | 更新时间字符串 |

## 5. 接口明细

### 5.1 创建资产分组

**接口**

```http
POST /api/v1/doubao/asset/group/create
```

**用途**

创建素材分组，后续资产必须归属于某个分组。

**请求参数**

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `name` | string | 是 | 无 | 分组名称，长度 `<= 64` |
| `description` | string | 否 | 空 | 分组描述，长度 `<= 300` |
| `group_type` | string | 否 | `AIGC` | 当前仅支持 `AIGC` |
| `project_name` | string | 否 | `default` | 项目标识 |

**请求示例**

```json
{
  "name": "joyme-image-assets",
  "description": "Joyme 项目图片资产分组"
}
```

**成功响应示例**

```json
{
  "code": 200,
  "message": "Success",
  "log_id": "20260319xxxx",
  "data": {
    "ResponseMetadata": {
      "RequestId": "02174236xxxx",
      "Action": "CreateAssetGroup",
      "Version": "2024-01-01",
      "Service": "ark",
      "Region": "cn-beijing"
    },
    "Result": {
      "Id": "group-202603190001-xxxx"
    }
  }
}
```

**失败示例**

```json
{
  "code": 403,
  "message": "name is required",
  "log_id": "20260319xxxx"
}
```

### 5.2 创建资产

**接口**

```http
POST /api/v1/doubao/asset/create
```

**用途**

向指定分组写入一个资产记录。当前资产类型仅支持图片。

**请求参数**

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `group_id` | string | 是 | 无 | 资产分组 ID |
| `url` | string | 是 | 无 | 原始素材 URL，必须为合法 `http://` 或 `https://` 地址 |
| `name` | string | 否 | 空 | 资产名称，长度 `<= 64` |
| `asset_type` | string | 否 | `Image` | 当前仅支持 `Image` |
| `project_name` | string | 否 | `default` | 项目标识 |

**重要说明**

- 这里上传的不是二进制文件，而是一个可访问的远程 URL
- 服务端只校验 URL 格式为 `http(s)`，但接入方仍应保证该 URL 对上游服务可访问
- 创建成功后建议立刻调用 `获取资产` 轮询状态

**请求示例**

```json
{
  "group_id": "group-202603190001-xxxx",
  "url": "https://cdn.example.com/assets/hero.png",
  "name": "hero-reference"
}
```

**成功响应示例**

```json
{
  "code": 200,
  "message": "Success",
  "log_id": "20260319xxxx",
  "data": {
    "ResponseMetadata": {
      "RequestId": "02174236xxxx",
      "Action": "CreateAsset",
      "Version": "2024-01-01",
      "Service": "ark",
      "Region": "cn-beijing"
    },
    "Result": {
      "Id": "asset-202603190002-xxxx"
    }
  }
}
```

### 5.2.1 同步创建资产并返回状态

**接口**

```http
POST /api/v1/doubao/asset/sync/create
```

**用途**

使用与 `创建资产` 相同的请求参数创建资产，并在单次 HTTP 请求内主动轮询上游状态，直接返回当前资产状态。

**请求参数**

与 `POST /api/v1/doubao/asset/create` 完全一致。

**行为说明**

- 接口会先创建资产，再立即查询一次上游状态
- 如果状态仍为 `Processing`，会在当前请求内继续轮询
- 当前同步等待窗口最长约 4 分 30 秒，以避免超出服务端 5 分钟 HTTP 写超时
- 若在同步等待窗口内变为 `Active` 或 `Failed`，接口直接返回最终状态
- 若窗口耗尽后仍为 `Processing`，接口返回当前资产对象，`Status` 仍为 `Processing`

**成功响应示例**

```json
{
  "code": 200,
  "message": "Success",
  "log_id": "20260319xxxx",
  "data": {
    "ResponseMetadata": {
      "Action": "CreateAssetSync",
      "Version": "2024-01-01",
      "Service": "ark",
      "Region": "cn-beijing"
    },
    "Result": {
      "Id": "asset-202603190002-xxxx",
      "Name": "hero-reference",
      "URL": "https://cdn.example.com/assets/hero.png",
      "GroupId": "group-202603190001-xxxx",
      "AssetType": "Image",
      "Status": "Active",
      "ProjectName": "default",
      "CreateTime": "2026-03-19T06:00:00Z",
      "UpdateTime": "2026-03-19T06:00:12Z"
    }
  }
}
```

### 5.3 查询资产列表

**接口**

```http
POST /api/v1/doubao/asset/list
```

**用途**

按分组、状态、名称等条件查询资产列表。

**请求参数**

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `filters` | object | 否 | 自动补齐 | 筛选条件 |
| `filters.group_ids` | string[] | 否 | 空 | 分组 ID 列表 |
| `filters.group_type` | string | 否 | `AIGC` | 当前仅支持 `AIGC` |
| `filters.statuses` | string[] | 否 | 空 | 资产状态列表 |
| `filters.name` | string | 否 | 空 | 资产名称模糊条件，长度 `<= 64` |
| `page_number` | int64 | 否 | `1` | 页码，最小 `1` |
| `page_size` | int64 | 否 | `20` | 每页条数，范围 `1~100` |
| `sort_by` | string | 否 | 空 | `CreateTime`、`UpdateTime`、`GroupId` |
| `sort_order` | string | 否 | 空 | `Asc`、`Desc` |
| `project_name` | string | 否 | `default` | 项目标识 |

**最小请求示例**

```json
{}
```

**筛选请求示例**

```json
{
  "filters": {
    "group_ids": [
      "group-202603190001-xxxx"
    ],
    "statuses": [
      "Active"
    ],
    "name": "hero"
  },
  "page_number": 1,
  "page_size": 20,
  "sort_by": "UpdateTime",
  "sort_order": "Desc"
}
```

**成功响应示例**

```json
{
  "code": 200,
  "message": "Success",
  "log_id": "20260319xxxx",
  "data": {
    "ResponseMetadata": {
      "RequestId": "02174236xxxx",
      "Action": "ListAssets",
      "Version": "2024-01-01",
      "Service": "ark",
      "Region": "cn-beijing"
    },
    "Result": {
      "Items": [
        {
          "Id": "asset-202603190002-xxxx",
          "Name": "hero-reference",
          "URL": "https://cdn.example.com/assets/hero.png",
          "GroupId": "group-202603190001-xxxx",
          "AssetType": "Image",
          "Status": "Active",
          "ProjectName": "default",
          "CreateTime": "2026-03-19T10:00:00+08:00",
          "UpdateTime": "2026-03-19T10:00:20+08:00"
        }
      ],
      "TotalCount": 1,
      "PageNumber": 1,
      "PageSize": 20
    }
  }
}
```

### 5.4 查询资产分组列表

**接口**

```http
POST /api/v1/doubao/asset/group/list
```

**用途**

查询资产分组列表。

**请求参数**

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `filters` | object | 否 | 自动补齐 | 筛选条件 |
| `filters.name` | string | 否 | 空 | 分组名称条件，长度 `<= 64` |
| `filters.group_ids` | string[] | 否 | 空 | 分组 ID 列表 |
| `filters.group_type` | string | 否 | `AIGC` | 当前仅支持 `AIGC` |
| `page_number` | int64 | 否 | `1` | 页码，最小 `1` |
| `page_size` | int64 | 否 | `20` | 每页条数，范围 `1~100` |
| `sort_by` | string | 否 | 空 | `CreateTime`、`UpdateTime` |
| `sort_order` | string | 否 | 空 | `Asc`、`Desc` |
| `project_name` | string | 否 | `default` | 项目标识 |

**请求示例**

```json
{
  "filters": {
    "name": "joyme"
  },
  "page_number": 1,
  "page_size": 10
}
```

**成功响应示例**

```json
{
  "code": 200,
  "message": "Success",
  "log_id": "20260319xxxx",
  "data": {
    "ResponseMetadata": {
      "RequestId": "02174236xxxx",
      "Action": "ListAssetGroups",
      "Version": "2024-01-01",
      "Service": "ark",
      "Region": "cn-beijing"
    },
    "Result": {
      "Items": [
        {
          "Id": "group-202603190001-xxxx",
          "Name": "joyme-image-assets",
          "Description": "Joyme 项目图片资产分组",
          "GroupType": "AIGC",
          "ProjectName": "default",
          "CreateTime": "2026-03-19T10:00:00+08:00",
          "UpdateTime": "2026-03-19T10:00:00+08:00"
        }
      ],
      "TotalCount": 1,
      "PageNumber": 1,
      "PageSize": 10
    }
  }
}
```

### 5.5 获取单个资产

**接口**

```http
POST /api/v1/doubao/asset/get
```

**用途**

按资产 ID 查询单条记录，推荐用于轮询资产状态。

**请求参数**

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `id` | string | 是 | 无 | 资产 ID |
| `project_name` | string | 否 | `default` | 项目标识 |

**请求示例**

```json
{
  "id": "asset-202603190002-xxxx"
}
```

**成功响应示例**

```json
{
  "code": 200,
  "message": "Success",
  "log_id": "20260319xxxx",
  "data": {
    "ResponseMetadata": {
      "RequestId": "02174236xxxx",
      "Action": "GetAsset",
      "Version": "2024-01-01",
      "Service": "ark",
      "Region": "cn-beijing"
    },
    "Result": {
      "Id": "asset-202603190002-xxxx",
      "Name": "hero-reference",
      "URL": "https://cdn.example.com/assets/hero.png",
      "GroupId": "group-202603190001-xxxx",
      "AssetType": "Image",
      "Status": "Processing",
      "ProjectName": "default",
      "CreateTime": "2026-03-19T10:00:00+08:00",
      "UpdateTime": "2026-03-19T10:00:05+08:00"
    }
  }
}
```

**失败态示例**

```json
{
  "code": 200,
  "message": "Success",
  "log_id": "20260319xxxx",
  "data": {
    "ResponseMetadata": {
      "RequestId": "02174236xxxx",
      "Action": "GetAsset",
      "Version": "2024-01-01",
      "Service": "ark",
      "Region": "cn-beijing"
    },
    "Result": {
      "Id": "asset-202603190002-xxxx",
      "Status": "Failed",
      "Error": {
        "Code": "InvalidImage",
        "Message": "image cannot be fetched"
      }
    }
  }
}
```

### 5.6 获取单个资产分组

**接口**

```http
POST /api/v1/doubao/asset/group/get
```

**用途**

按分组 ID 查询单条分组记录。

**请求参数**

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `id` | string | 是 | 无 | 分组 ID |
| `project_name` | string | 否 | `default` | 项目标识 |

**请求示例**

```json
{
  "id": "group-202603190001-xxxx"
}
```

**成功响应示例**

```json
{
  "code": 200,
  "message": "Success",
  "log_id": "20260319xxxx",
  "data": {
    "ResponseMetadata": {
      "RequestId": "02174236xxxx",
      "Action": "GetAssetGroup",
      "Version": "2024-01-01",
      "Service": "ark",
      "Region": "cn-beijing"
    },
    "Result": {
      "Id": "group-202603190001-xxxx",
      "Name": "joyme-image-assets",
      "Description": "Joyme 项目图片资产分组",
      "GroupType": "AIGC",
      "ProjectName": "default",
      "CreateTime": "2026-03-19T10:00:00+08:00",
      "UpdateTime": "2026-03-19T10:00:00+08:00"
    }
  }
}
```

### 5.7 更新资产分组

**接口**

```http
POST /api/v1/doubao/asset/group/update
```

**用途**

更新分组名称或描述。

**请求参数**

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `id` | string | 是 | 无 | 分组 ID |
| `name` | string | 否 | 空 | 分组名称，长度 `<= 64` |
| `description` | string | 否 | 空 | 分组描述，长度 `<= 300` |
| `project_name` | string | 否 | `default` | 项目标识 |

**约束**

- `name` 和 `description` 至少要传一个

**请求示例**

```json
{
  "id": "group-202603190001-xxxx",
  "description": "Joyme 项目主素材分组"
}
```

**成功响应示例**

```json
{
  "code": 200,
  "message": "Success",
  "log_id": "20260319xxxx",
  "data": {
    "ResponseMetadata": {
      "RequestId": "02174236xxxx",
      "Action": "UpdateAssetGroup",
      "Version": "2024-01-01",
      "Service": "ark",
      "Region": "cn-beijing"
    },
    "Result": {
      "Id": "group-202603190001-xxxx"
    }
  }
}
```

### 5.8 更新资产

**接口**

```http
POST /api/v1/doubao/asset/update
```

**用途**

更新资产名称。

**请求参数**

| 字段 | 类型 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| `id` | string | 是 | 无 | 资产 ID |
| `name` | string | 是 | 无 | 资产名称，长度 `<= 64` |
| `project_name` | string | 否 | `default` | 项目标识 |

**请求示例**

```json
{
  "id": "asset-202603190002-xxxx",
  "name": "hero-reference-v2"
}
```

**成功响应示例**

```json
{
  "code": 200,
  "message": "Success",
  "log_id": "20260319xxxx",
  "data": {
    "ResponseMetadata": {
      "RequestId": "02174236xxxx",
      "Action": "UpdateAsset",
      "Version": "2024-01-01",
      "Service": "ark",
      "Region": "cn-beijing"
    },
    "Result": {
      "Id": "asset-202603190002-xxxx"
    }
  }
}
```

## 6. 常见错误与处理建议

### 6.1 参数错误

外层 `code=403`，`message` 会直接返回具体校验失败原因，例如：

- `name is required`
- `id is required`
- `page_size must be between 1 and 100`
- `unsupported sort_by: xxx`
- `unsupported filters.statuses value: xxx`
- `url must be a valid public http(s) address`

建议调用方直接把 `message` 打到日志里。

### 6.2 JSON 反序列化失败

如果请求体不是合法 JSON，返回：

```json
{
  "code": 1001,
  "message": "Json Unmarshal failed.",
  "log_id": "20260319xxxx"
}
```

### 6.3 服务内部错误

如果上游调用失败或服务内部解码失败，通常返回：

```json
{
  "code": 500,
  "message": "internal error",
  "log_id": "20260319xxxx"
}
```

## 7. 给 AI 编程工具的集成提示

如果你是让 AI 工具自动生成调用代码，建议明确告诉它以下规则：

1. 所有接口都是 `POST`
2. 所有请求都必须带 `Authorization: Bearer <token>`
3. 所有请求体必须是 JSON 对象，哪怕无参数也传 `{}`，不要空 body
4. 请求字段是 snake_case，响应 `data.Result` 字段是 PascalCase
5. `创建资产` 返回 `Id` 后不能直接视为可用，应轮询 `获取资产`，直到 `Status=Active`
6. 后续任务引用资产时使用 `asset://<asset_id>`
7. 当前仅支持：
   - `group_type=AIGC`
   - `asset_type=Image`

可以直接把下面这段约束给 AI 工具：

```text
请按以下规则集成 Doubao Asset API：
1. Base path 是 /api/v1/doubao/asset
2. 所有接口都是 POST + application/json
3. 必须带 Authorization: Bearer <token>
4. 请求字段使用 snake_case
5. 响应外层结构为 code/message/log_id/data
6. data 内部结构为 ResponseMetadata + Result
7. 创建资产后要轮询 /get，直到 Result.Status == "Active"
8. 下游任务里引用资产时使用 asset://<asset_id>
```

## 8. 推荐接入示例

### 8.1 创建分组

```bash
curl -X POST "${BASE_URL}/api/v1/doubao/asset/group/create" \
  -H "Authorization: Bearer ${CREATE_ENDPOINT_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "joyme-image-assets",
    "description": "Joyme 项目图片资产分组"
  }'
```

### 8.2 创建资产

```bash
curl -X POST "${BASE_URL}/api/v1/doubao/asset/create" \
  -H "Authorization: Bearer ${CREATE_ENDPOINT_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "group_id": "group-202603190001-xxxx",
    "url": "https://cdn.example.com/assets/hero.png",
    "name": "hero-reference"
  }'
```

### 8.3 轮询资产状态

```bash
curl -X POST "${BASE_URL}/api/v1/doubao/asset/get" \
  -H "Authorization: Bearer ${CREATE_ENDPOINT_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "asset-202603190002-xxxx"
  }'
```

### 8.4 在下游任务里使用资产引用

```json
{
  "type": "image_url",
  "image_url": {
    "url": "asset://asset-202603190002-xxxx"
  }
}
```

## 9. 结论

这组接口本质上提供了一个受控的素材资产层，适合把外部图片先沉淀为平台内资产，再把 `asset://` 引用交给后续生成式任务使用。对接时重点关注四件事：

- Bearer Token 鉴权
- 请求必须传合法 JSON
- 创建资产后轮询状态
- 下游使用 `asset://<asset_id>` 而不是源 URL
