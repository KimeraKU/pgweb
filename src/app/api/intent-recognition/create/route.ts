import { NextRequest, NextResponse } from 'next/server';

const DEFAULT_CREATE_URL = 'https://artface.linkv.live/api/v1/aigc/task/create';

const INTENT_PROMPT =
  '你是PhotoGridImageEnhancer的图片内容意图识别Agent。你的任务是根据用户上传的图片内容，判断用户最可能的后续创作意图，并匹配一个唯一的Agent意图key。你只负责识别和分类，不要生成营销文案，不要推荐工具，不要解释过程。可选意图key只能从以下列表中选择：1.portrait_headshot适用：单人头像、自拍、证件照、职业照、简历照、社交头像、近景人像、半身人像。用户意图：让人物更清晰、更适合头像、职业展示、社交资料或数字人生成。2.life_event_photo适用：婚礼、生日、亲子、旅行、聚会、毕业、节日、家庭合影、朋友合照、活动照片、老照片修复。用户意图：保留回忆、修清晰、去路人/杂物、用于分享或制作纪念内容。3.product_ecommerce适用：商品图、白底商品图、商品特写、菜单、海报、品牌图、logo、包装图、美妆、服饰、3C、食品、饮料、店铺营销素材。用户意图：让商品更清晰、更适合上架、发布、转发、生成营销图或商品视频。4.document_readability适用：文档、截图、票据、收据、银行截图、付款凭证、手写笔记、表格、证据截图、文字图片。用户意图：看清文字、保留证据、归档、转发、OCR或重新整理图片内容。5.listing_space_vehicle适用：房产、室内空间、卧室、客厅、浴室、户型图、建筑外观、车辆、汽车内饰、车辆展示图。用户意图：让租售、装修、民宿、车辆转卖素材更清晰可信，用于列表页、社媒或客户沟通。6.anime_game_fanart适用：二次元角色、动漫截图、游戏截图、插画、表情包、贴纸、3D模型、粉丝图、同人图、装饰图案。用户意图：修清晰后继续头像、壁纸、贴纸、分享、打印或二创。7.generic_fallback适用：无法明确判断、图片内容混杂、置信度不足、无法归入以上任一类型。用户意图：通用图片增强或继续编辑。判断规则：-如果图片中有明确商品主体，并且看起来像售卖、展示、上架或营销素材，优先判断为product_ecommerce。-如果图片主要是单人头像、自拍、职业形象，优先判断为portrait_headshot。-如果图片是多人、家庭、活动、旅行或纪念场景，优先判断为life_event_photo。-如果图片中文字、截图、票据、表格是主要信息，优先判断为document_readability。-如果图片主体是房间、建筑、户型、汽车或车辆内饰，优先判断为listing_space_vehicle。-如果图片是动漫、游戏、插画、表情包、贴纸或二次元内容，优先判断为anime_game_fanart。-如果多个类型同时存在，选择用户最可能继续创作或变现的主要意图。-如果置信度低于0.6，使用generic_fallback。输出要求：只输出JSON，不要输出Markdown，不要输出解释。JSON格式：{"intent_key":"product_ecommerce","confidence":0.86,"reason":"图片主体是商品展示图，适合继续生成电商营销素材"}字段要求：-intent_key：必须是7个可选key之一。';

function pickTaskId(payload: unknown): string {
  if (!payload || typeof payload !== 'object') return '';
  const obj = payload as Record<string, unknown>;
  const keys = ['id_task', 'task_id', 'taskId', 'id', 'request_id', 'job_id'];
  for (const key of keys) {
    const value = obj[key];
    if (typeof value === 'string' && value.trim()) return value.trim();
    if (typeof value === 'number' && !Number.isNaN(value)) return String(value);
  }
  for (const value of Object.values(obj)) {
    const found = pickTaskId(value);
    if (found) return found;
  }
  return '';
}

export async function POST(req: NextRequest) {
  let body: { image_url?: string };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'JSON 无效' }, { status: 400 });
  }

  const imageUrl = body.image_url?.trim();
  if (!imageUrl || !/^https?:\/\//i.test(imageUrl)) {
    return NextResponse.json({ error: 'image_url 必须是有效的 HTTP URL' }, { status: 400 });
  }

  const payload = {
    tenant_id: process.env.INTENT_TENANT_ID?.trim() || 'test',
    user_id: process.env.INTENT_USER_ID?.trim() || 'evan',
    app_id: process.env.INTENT_APP_ID?.trim() || '123',
    app_kind: 'imagent',
    aigc_category: 'text_to_text',
    callback_url: process.env.INTENT_CALLBACK_URL?.trim() || 'http://47.89.173.41:22356',
    watermark: 0,
    watermark_img:
      process.env.INTENT_WATERMARK_IMG?.trim() ||
      'https://ima.esxscloud.com/ima/images/ima_watermark_1.png',
    model_version_id: process.env.INTENT_MODEL_VERSION_ID?.trim() || 'gemini-3.5-flash',
    input_images: [imageUrl],
    parameters: {
      prompt: INTENT_PROMPT,
      temperature: 0.7,
      topP: 0.9,
    },
  };

  let res: Response;
  try {
    res = await fetch(process.env.INTENT_CREATE_URL?.trim() || DEFAULT_CREATE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '创建意图识别任务失败' },
      { status: 502 }
    );
  }

  const text = await res.text();
  let data: unknown = text;
  try {
    data = JSON.parse(text) as unknown;
  } catch {
    /* keep text response */
  }

  if (!res.ok) {
    const error =
      (data && typeof data === 'object' && 'message' in data && String((data as { message: string }).message)) ||
      (data && typeof data === 'object' && 'error' in data && String((data as { error: string }).error)) ||
      text ||
      res.statusText;
    return NextResponse.json({ error, raw: data }, { status: res.status >= 400 ? res.status : 502 });
  }

  return NextResponse.json({
    task_id: pickTaskId(data),
    raw: data,
  });
}
