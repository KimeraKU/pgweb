'use client';

import { useMemo, useRef, useState, type DragEvent, type ReactNode } from 'react';

type PageMode = 'categories' | 'templates' | 'edit';
type TemplateStatus = '上架' | '草稿' | '下架';
type VariableType = 'text' | 'select' | 'select_text';
type FormMode = 'create' | 'edit';
type TemplateCategoryFilter = 'all' | string;

type PromptCategory = {
  id: string;
  name: string;
  description: string;
  updatedAt: string;
};

type PromptVariable = {
  id: string;
  key: string;
  group: string;
  displayNames: {
    zh: string;
    en: string;
  };
  type: VariableType;
  placeholder: string;
  defaultValue: string;
  options: string[];
  required: boolean;
};

type PromptTemplate = {
  id: number;
  categoryId: string;
  name: string;
  key: string;
  status: TemplateStatus;
  prompt: string;
  variableGroups: string[];
  variables: PromptVariable[];
  updatedAt: string;
};

type VariableForm = {
  variableName: string;
  group: string;
  displayNameZh: string;
  displayNameEn: string;
  type: VariableType;
  placeholder: string;
  defaultValue: string;
  optionsText: string;
  required: boolean;
};

const navItems = [
  'AI聚合页管理',
  'Avatar模板管理',
  '文生图 Prompt Set',
  '文生图 Prompt Style',
  'AI风格化管理',
  '滤镜特效管理',
  'Looks妆容管理',
  'Makeup美妆管理',
  '商源模组管理',
  'AI Expression管理',
  '写真集管理',
  'AI Avatar CMS',
  'AI Prompt',
  'AI Replace管理',
  'AI换背景',
  '工作流',
  'AI Video prompt管理',
];

const initialCategories: PromptCategory[] = [
  {
    id: 'ai_filter',
    name: 'AI Filter',
    description: 'AI 滤镜、风格化、写真效果相关 Prompt',
    updatedAt: '2026-05-18 10:38:27',
  },
  {
    id: 'ai_image_generator',
    name: 'AI Image Generator',
    description: 'AI 生图、商品图、创意图生成相关 Prompt',
    updatedAt: '2026-05-17 18:12:09',
  },
  {
    id: 'ai_video',
    name: 'AI Video',
    description: 'AI 视频、UGC 视频、视频脚本相关 Prompt',
    updatedAt: '2026-05-16 15:20:44',
  },
  {
    id: 'ai_avatar',
    name: 'AI Avatar',
    description: 'AI Avatar、写真、人物风格化相关 Prompt',
    updatedAt: '2026-05-16 15:20:44',
  },
];

const productVariables: PromptVariable[] = [
  {
    id: 'var-product-name',
    key: 'product_name',
    group: '',
    displayNames: {
      zh: '商品名称',
      en: 'Product name',
    },
    type: 'text',
    placeholder: '例如：玻璃精华瓶',
    defaultValue: '玻璃精华瓶',
    options: [],
    required: true,
  },
  {
    id: 'var-style',
    key: 'style',
    group: '',
    displayNames: {
      zh: '视觉风格',
      en: 'Visual style',
    },
    type: 'select',
    placeholder: '选择视觉风格',
    defaultValue: 'luxury',
    options: ['luxury', 'minimal', 'cinematic', 'studio'],
    required: true,
  },
  {
    id: 'var-mood',
    key: 'mood',
    group: '',
    displayNames: {
      zh: '氛围',
      en: 'Mood',
    },
    type: 'select',
    placeholder: '选择氛围',
    defaultValue: 'fresh',
    options: ['fresh', 'premium', 'warm', 'futuristic'],
    required: false,
  },
];

const initialTemplates: PromptTemplate[] = [
  {
    id: 1,
    categoryId: 'ai_image_generator',
    name: '商品图生成 Prompt',
    key: 'product_image_prompt',
    status: '上架',
    variableGroups: [],
    prompt: `Create a {{style}} product image for {{product_name}}.

The scene should feel {{mood}}.

Use a clean composition, premium lighting, and keep the product recognizable.`,
    variables: productVariables,
    updatedAt: '2026-05-18 10:38:27',
  },
  {
    id: 2,
    categoryId: 'ai_video',
    name: 'UGC 视频脚本 Prompt',
    key: 'ugc_video_script',
    status: '草稿',
    variableGroups: [],
    prompt: 'Write a {{tone}} UGC video script for {{product_name}}. Mention {{selling_point}} in the first 3 seconds.',
    variables: [
      {
        id: 'var-tone',
        key: 'tone',
        group: '',
        displayNames: {
          zh: '语气',
          en: 'Tone',
        },
        type: 'select',
        placeholder: '选择语气',
        defaultValue: 'natural',
        options: ['natural', 'excited', 'professional'],
        required: true,
      },
      {
        id: 'var-selling-point',
        key: 'selling_point',
        group: '',
        displayNames: {
          zh: '卖点',
          en: 'Selling point',
        },
        type: 'text',
        placeholder: '请输入核心卖点',
        defaultValue: 'long-lasting hydration',
        options: [],
        required: true,
      },
    ],
    updatedAt: '2026-05-17 18:12:09',
  },
  {
    id: 3,
    categoryId: 'ai_avatar',
    name: 'AI Avatar 模特参数 Prompt',
    key: 'ai_avatar_model_prompt',
    status: '上架',
    variableGroups: ['Basic profile', 'Face', 'Body'],
    prompt: `Create a high-fashion AI avatar portrait.

Basic profile:
- Gender: {{gender}}
- Age: {{age}}
- Race / skin tone: {{race_skin_tone}}
- Hair color: {{hair_color}}
- Hairstyle: {{hairstyle}}
- Eye color: {{eye_color}}
- Temperament: {{temperament}}

Face:
- Face shape: {{face_shape}}
- Eye shape: {{eye_shape}}
- Nose shape: {{nose_shape}}
- Lip shape: {{lip_shape}}
- Eyebrows: {{eyebrows}}
- More facial details: {{facial_details}}

Body:
- Body type: {{body_type}}`,
    variables: [
      {
        id: 'var-avatar-gender',
        key: 'gender',
        group: 'Basic profile',
        displayNames: {
          zh: '性别',
          en: 'Gender',
        },
        type: 'select_text',
        placeholder: '选择或输入性别',
        defaultValue: '女',
        options: ['女', '男'],
        required: true,
      },
      {
        id: 'var-avatar-age',
        key: 'age',
        group: 'Basic profile',
        displayNames: {
          zh: '年龄',
          en: 'Age',
        },
        type: 'text',
        placeholder: '手动输入年龄',
        defaultValue: '36 岁',
        options: [],
        required: true,
      },
      {
        id: 'var-avatar-race-skin-tone',
        key: 'race_skin_tone',
        group: 'Basic profile',
        displayNames: {
          zh: '种族 / 肤色',
          en: 'Race / skin tone',
        },
        type: 'select',
        placeholder: '选择种族 / 肤色',
        defaultValue: '高加索 / 白',
        options: ['高加索 / 白', '亚洲 / 黄', '混血 / 棕', '黑人 / 黑'],
        required: true,
      },
      {
        id: 'var-avatar-hair-color',
        key: 'hair_color',
        group: 'Basic profile',
        displayNames: {
          zh: '发色',
          en: 'Hair color',
        },
        type: 'select_text',
        placeholder: '选择或输入发色',
        defaultValue: '棕色',
        options: ['金色', '黑色', '棕色', '浅棕色', '深棕色', '栗色', '红色', '红棕色', '灰色', '白色'],
        required: true,
      },
      {
        id: 'var-avatar-hairstyle',
        key: 'hairstyle',
        group: 'Basic profile',
        displayNames: {
          zh: '发型',
          en: 'Hairstyle',
        },
        type: 'select_text',
        placeholder: '选择或输入发型',
        defaultValue: '长直发',
        options: ['长直发', '长卷发', '中长发', '短发', '马尾', '丸子头', '辫子', '刘海', '中分', '侧分', '寸头', '背头'],
        required: true,
      },
      {
        id: 'var-avatar-eye-color',
        key: 'eye_color',
        group: 'Basic profile',
        displayNames: {
          zh: '眼睛颜色',
          en: 'Eye color',
        },
        type: 'select',
        placeholder: '选择眼睛颜色',
        defaultValue: '棕色',
        options: ['棕色', '黑色', '蓝色', '灰色', '榛色'],
        required: true,
      },
      {
        id: 'var-avatar-temperament',
        key: 'temperament',
        group: 'Basic profile',
        displayNames: {
          zh: '气质',
          en: 'Temperament',
        },
        type: 'select',
        placeholder: '选择气质',
        defaultValue: '高级时装',
        options: ['高级时装', '秀场', '超模感', 'IMG 模特'],
        required: true,
      },
      {
        id: 'var-avatar-face-shape',
        key: 'face_shape',
        group: 'Face',
        displayNames: {
          zh: '脸型',
          en: 'Face shape',
        },
        type: 'select',
        placeholder: '选择脸型',
        defaultValue: '鹅蛋脸',
        options: ['鹅蛋脸', '圆脸', '方脸', '长脸', '瓜子脸', '心形脸', '菱形脸'],
        required: true,
      },
      {
        id: 'var-avatar-eye-shape',
        key: 'eye_shape',
        group: 'Face',
        displayNames: {
          zh: '眼型',
          en: 'Eye shape',
        },
        type: 'select',
        placeholder: '选择眼型',
        defaultValue: '杏仁眼',
        options: ['杏仁眼', '细长眼', '圆眼', '桃花眼', '丹凤眼', '下垂眼', '上挑眼'],
        required: true,
      },
      {
        id: 'var-avatar-nose-shape',
        key: 'nose_shape',
        group: 'Face',
        displayNames: {
          zh: '鼻型',
          en: 'Nose shape',
        },
        type: 'select',
        placeholder: '选择鼻型',
        defaultValue: '直鼻梁',
        options: ['细窄鼻', '直鼻梁', '高鼻梁', '低鼻梁', '小巧鼻', '圆鼻头', '翘鼻', '鹰钩鼻'],
        required: true,
      },
      {
        id: 'var-avatar-lip-shape',
        key: 'lip_shape',
        group: 'Face',
        displayNames: {
          zh: '唇形',
          en: 'Lip shape',
        },
        type: 'select',
        placeholder: '选择唇形',
        defaultValue: '中饱满唇',
        options: ['大饱满唇', '中饱满唇', '薄唇', '上唇薄', '下唇厚'],
        required: true,
      },
      {
        id: 'var-avatar-eyebrows',
        key: 'eyebrows',
        group: 'Face',
        displayNames: {
          zh: '眉毛',
          en: 'Eyebrows',
        },
        type: 'select',
        placeholder: '选择眉毛',
        defaultValue: '弯眉',
        options: ['平眉', '弯眉', '挑眉', '浓眉', '细眉', '淡眉'],
        required: true,
      },
      {
        id: 'var-avatar-facial-details',
        key: 'facial_details',
        group: 'Face',
        displayNames: {
          zh: '面部更多',
          en: 'More facial details',
        },
        type: 'text',
        placeholder: '例如：面部毛发、下颌线、颧骨、脸颊形态、雀斑',
        defaultValue: '',
        options: [],
        required: false,
      },
      {
        id: 'var-avatar-body-type',
        key: 'body_type',
        group: 'Body',
        displayNames: {
          zh: '身体特征',
          en: 'Body type',
        },
        type: 'select',
        placeholder: '选择身体特征',
        defaultValue: '匀称',
        options: ['纤细', '匀称', '丰满', '肥胖'],
        required: false,
      },
    ],
    updatedAt: '2026-05-16 15:20:44',
  },
];

const emptyVariableForm: VariableForm = {
  variableName: '',
  group: '',
  displayNameZh: '',
  displayNameEn: '',
  type: 'text',
  placeholder: '',
  defaultValue: '',
  optionsText: '',
  required: true,
};

function cloneVariables(variables: PromptVariable[]) {
  return variables.map((variable) => ({ ...variable, options: [...variable.options] }));
}

function formatNow() {
  const pad = (value: number) => String(value).padStart(2, '0');
  const date = new Date();
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

function createKey(value: string) {
  return (
    value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '_')
      .replace(/^_+|_+$/g, '')
      .slice(0, 40) || `item_${Date.now().toString().slice(-4)}`
  );
}

function ensureUniqueKey(key: string, variables: PromptVariable[]) {
  let nextKey = key;
  let index = 2;
  while (variables.some((variable) => variable.key === nextKey)) {
    nextKey = `${key}_${index}`;
    index += 1;
  }
  return nextKey;
}

function getVariableTypeLabel(type: VariableType) {
  if (type === 'select') return '选项';
  if (type === 'select_text') return '选项+填空';
  return '填空';
}

function hasOptions(type: VariableType) {
  return type === 'select' || type === 'select_text';
}

function getVariableDisplayName(variable: PromptVariable) {
  return variable.displayNames.zh || variable.displayNames.en || variable.key;
}

function groupVariables(variables: PromptVariable[]) {
  return variables.reduce<Array<{ group: string; variables: PromptVariable[] }>>((groups, variable) => {
    const group = variable.group.trim();
    if (!group) return groups;
    const existing = groups.find((item) => item.group === group);
    if (existing) {
      existing.variables.push(variable);
    } else {
      groups.push({ group, variables: [variable] });
    }
    return groups;
  }, []);
}

function variableToForm(variable: PromptVariable): VariableForm {
  return {
    variableName: variable.key,
    group: variable.group || '',
    displayNameZh: variable.displayNames.zh,
    displayNameEn: variable.displayNames.en,
    type: variable.type,
    placeholder: variable.placeholder,
    defaultValue: variable.defaultValue,
    optionsText: variable.options.join('\n'),
    required: variable.required,
  };
}

function formToVariable(form: VariableForm, key: string, id?: string): PromptVariable {
  return {
    id: id || `var-${Date.now()}`,
    key,
    group: form.group.trim(),
    displayNames: {
      zh: form.displayNameZh || key,
      en: form.displayNameEn || form.displayNameZh || key,
    },
    type: form.type,
    placeholder: form.placeholder,
    defaultValue: form.defaultValue,
    options:
      hasOptions(form.type)
        ? form.optionsText
            .split('\n')
            .map((item) => item.trim())
            .filter(Boolean)
        : [],
    required: form.required,
  };
}

function renderPrompt(prompt: string, variables: PromptVariable[], values: Record<string, string>) {
  return prompt.replace(/\{\{(.*?)\}\}/g, (_, rawKey: string) => {
    const key = rawKey.trim();
    const variable = variables.find((item) => item.key === key);
    return values[key] || variable?.defaultValue || `[${key}]`;
  });
}

function Button({
  children,
  tone = 'default',
  onClick,
}: {
  children: ReactNode;
  tone?: 'default' | 'primary' | 'danger' | 'success';
  onClick?: () => void;
}) {
  const toneClass =
    tone === 'primary'
      ? 'border-[#008ccf] bg-[#00a0df] text-white hover:bg-[#008ccf]'
      : tone === 'danger'
        ? 'border-[#c9302c] bg-[#d9534f] text-white hover:bg-[#c9302c]'
        : tone === 'success'
          ? 'border-[#5d9d2f] bg-[#75ad35] text-white hover:bg-[#62952b]'
          : 'border-[#ccc] bg-[#f7f7f7] text-[#333] hover:bg-[#eee]';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-[30px] rounded border px-3 text-[12px] font-bold leading-[28px] ${toneClass}`}
    >
      {children}
    </button>
  );
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border border-[#ddd] bg-white">
      <div className="border-b border-[#ddd] bg-[#f8f8f8] px-[18px] py-[12px] text-[16px] font-bold">{title}</div>
      {children}
    </section>
  );
}

function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4">
      <div className="w-full max-w-[640px] border border-[#ddd] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.22)]">
        <div className="flex h-[48px] items-center justify-between border-b border-[#ddd] bg-[#f8f8f8] px-[18px]">
          <div className="text-[16px] font-bold">{title}</div>
          <button type="button" onClick={onClose} className="text-[20px] leading-none text-[#666]">
            ×
          </button>
        </div>
        <div className="p-[18px]">{children}</div>
      </div>
    </div>
  );
}

export default function PromptCmsPage() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [mode, setMode] = useState<PageMode>('categories');

  const [categories, setCategories] = useState<PromptCategory[]>(initialCategories);
  const [templates, setTemplates] = useState<PromptTemplate[]>(initialTemplates);
  const [activeCategoryId, setActiveCategoryId] = useState(initialCategories[0].id);
  const [templateCategoryFilter, setTemplateCategoryFilter] = useState<TemplateCategoryFilter>('all');

  const [categoryFormMode, setCategoryFormMode] = useState<FormMode>('create');
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  const [showCategoryForm, setShowCategoryForm] = useState(false);

  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState<'全部状态' | TemplateStatus>('全部状态');

  const [editingTemplateId, setEditingTemplateId] = useState<number | null>(null);
  const [draftCategoryId, setDraftCategoryId] = useState(initialCategories[0].id);
  const [draftName, setDraftName] = useState('');
  const [draftKey, setDraftKey] = useState('');
  const [draftStatus, setDraftStatus] = useState<TemplateStatus>('草稿');
  const [draftPrompt, setDraftPrompt] = useState('');
  const [draftVariableGroups, setDraftVariableGroups] = useState<string[]>([]);
  const [draftVariables, setDraftVariables] = useState<PromptVariable[]>([]);
  const [previewValues, setPreviewValues] = useState<Record<string, string>>({});

  const [variableFormMode, setVariableFormMode] = useState<FormMode>('create');
  const [selectedVariableId, setSelectedVariableId] = useState('');
  const [variableForm, setVariableForm] = useState<VariableForm>(emptyVariableForm);
  const [showVariableForm, setShowVariableForm] = useState(false);
  const [showVariableGroupForm, setShowVariableGroupForm] = useState(false);
  const [showVariableGroupEditor, setShowVariableGroupEditor] = useState(false);
  const [editingVariableGroup, setEditingVariableGroup] = useState<string | null>(null);
  const [variableGroupName, setVariableGroupName] = useState('');

  const activeCategory = categories.find((category) => category.id === activeCategoryId);
  const selectedVariable = draftVariables.find((variable) => variable.id === selectedVariableId);
  const categoryTemplates =
    templateCategoryFilter === 'all' ? templates : templates.filter((template) => template.categoryId === templateCategoryFilter);
  const filteredTemplates = categoryTemplates.filter((template) => {
    const matchesKeyword = `${template.name} ${template.key}`.toLowerCase().includes(keyword.trim().toLowerCase());
    const matchesStatus = statusFilter === '全部状态' || template.status === statusFilter;
    return matchesKeyword && matchesStatus;
  });
  const renderedPrompt = useMemo(
    () => renderPrompt(draftPrompt, draftVariables, previewValues),
    [draftPrompt, draftVariables, previewValues]
  );
  const availableVariableGroups = Array.from(
    new Set([...draftVariableGroups, ...draftVariables.map((variable) => variable.group.trim())])
  ).filter(Boolean);
  const ungroupedVariables = draftVariables.filter((variable) => !variable.group.trim());

  const openCategoryCreate = () => {
    setCategoryFormMode('create');
    setEditingCategoryId(null);
    setCategoryName('');
    setCategoryDescription('');
    setShowCategoryForm(true);
  };

  const openCategoryEdit = (category: PromptCategory) => {
    setCategoryFormMode('edit');
    setEditingCategoryId(category.id);
    setCategoryName(category.name);
    setCategoryDescription(category.description);
    setShowCategoryForm(true);
  };

  const saveCategory = () => {
    if (categoryFormMode === 'create') {
      const nextCategory: PromptCategory = {
        id: `category_${Date.now()}`,
        name: categoryName || '新分类',
        description: categoryDescription,
        updatedAt: formatNow(),
      };
      setCategories((prev) => [nextCategory, ...prev]);
      setActiveCategoryId(nextCategory.id);
    } else if (editingCategoryId) {
      setCategories((prev) =>
        prev.map((category) =>
          category.id === editingCategoryId
            ? { ...category, name: categoryName || category.name, description: categoryDescription, updatedAt: formatNow() }
            : category
        )
      );
    }
    setShowCategoryForm(false);
  };

  const deleteCategory = (id: string) => {
    const nextCategories = categories.filter((category) => category.id !== id);
    setCategories(nextCategories);
    setTemplates((prev) => prev.filter((template) => template.categoryId !== id));
    if (activeCategoryId === id && nextCategories[0]) {
      setActiveCategoryId(nextCategories[0].id);
    }
  };

  const openTemplateList = (categoryId: string) => {
    setActiveCategoryId(categoryId);
    setTemplateCategoryFilter(categoryId);
    setKeyword('');
    setStatusFilter('全部状态');
    setMode('templates');
  };

  const clearVariableForm = () => {
    setVariableFormMode('create');
    setSelectedVariableId('');
    setVariableForm(emptyVariableForm);
  };

  const openVariableCreate = () => {
    clearVariableForm();
    setShowVariableForm(true);
  };

  const closeVariableForm = () => {
    setShowVariableForm(false);
  };

  const openVariableGroupCreate = () => {
    setEditingVariableGroup(null);
    setVariableGroupName('');
    setShowVariableGroupEditor(true);
    setShowVariableGroupForm(true);
  };

  const openVariableGroupEdit = (group: string) => {
    setEditingVariableGroup(group);
    setVariableGroupName(group);
    setShowVariableGroupEditor(true);
    setShowVariableGroupForm(true);
  };

  const saveVariableGroup = () => {
    const nextName = variableGroupName.trim();
    if (!nextName) return;
    if (editingVariableGroup) {
      setDraftVariableGroups((prev) => Array.from(new Set(prev.map((group) => (group === editingVariableGroup ? nextName : group)))));
      setDraftVariables((prev) => prev.map((variable) => (variable.group === editingVariableGroup ? { ...variable, group: nextName } : variable)));
      setVariableForm((prev) => ({
        ...prev,
        group: prev.group === editingVariableGroup ? nextName : prev.group,
      }));
    } else {
      setDraftVariableGroups((prev) => Array.from(new Set([...prev, nextName])));
    }
    setShowVariableGroupEditor(false);
    setEditingVariableGroup(null);
    setVariableGroupName('');
  };

  const deleteVariableGroup = (group: string) => {
    setDraftVariableGroups((prev) => prev.filter((item) => item !== group));
    setDraftVariables((prev) => prev.map((variable) => (variable.group === group ? { ...variable, group: '' } : variable)));
    setVariableForm((prev) => ({
      ...prev,
      group: prev.group === group ? '' : prev.group,
    }));
  };

  const createTemplate = () => {
    const nextCategoryId = templateCategoryFilter === 'all' ? activeCategoryId : templateCategoryFilter;
    const variables: PromptVariable[] = [
      {
        id: `var-${Date.now()}`,
        key: 'subject',
        group: '',
        displayNames: {
          zh: '主体',
          en: 'Subject',
        },
        type: 'text',
        placeholder: '请输入主体',
        defaultValue: '',
        options: [],
        required: true,
      },
    ];

    setEditingTemplateId(null);
    setDraftCategoryId(nextCategoryId);
    setDraftName('新 Prompt 模版');
    setDraftKey('new_prompt_template');
    setDraftStatus('草稿');
    setDraftPrompt('Create an image for {{subject}}.');
    setDraftVariableGroups([]);
    setDraftVariables(variables);
    setPreviewValues({ subject: '' });
    clearVariableForm();
    setMode('edit');
  };

  const editTemplate = (template: PromptTemplate) => {
    setEditingTemplateId(template.id);
    setDraftCategoryId(template.categoryId);
    setDraftName(template.name);
    setDraftKey(template.key);
    setDraftStatus(template.status);
    setDraftPrompt(template.prompt);
    setDraftVariableGroups(template.variableGroups?.length ? template.variableGroups : groupVariables(template.variables).map((group) => group.group));
    setDraftVariables(cloneVariables(template.variables));
    setPreviewValues(Object.fromEntries(template.variables.map((variable) => [variable.key, variable.defaultValue])));
    clearVariableForm();
    setMode('edit');
  };

  const saveTemplate = () => {
    const payload: PromptTemplate = {
      id: editingTemplateId ?? Math.max(...templates.map((template) => template.id), 0) + 1,
      categoryId: draftCategoryId,
      name: draftName || '未命名 Prompt 模版',
      key: createKey(draftKey || draftName),
      status: draftStatus,
      prompt: draftPrompt,
      variableGroups: availableVariableGroups,
      variables: cloneVariables(draftVariables),
      updatedAt: formatNow(),
    };

    setTemplates((prev) =>
      editingTemplateId ? prev.map((template) => (template.id === editingTemplateId ? payload : template)) : [payload, ...prev]
    );
    setActiveCategoryId(payload.categoryId);
    setTemplateCategoryFilter(payload.categoryId);
    setMode('templates');
  };

  const deleteTemplate = (id: number) => {
    setTemplates((prev) => prev.filter((template) => template.id !== id));
  };

  const duplicateTemplate = (template: PromptTemplate) => {
    setTemplates((prev) => [
      {
        ...template,
        id: Math.max(...prev.map((item) => item.id), 0) + 1,
        name: `${template.name} Copy`,
        key: `${template.key}_copy`,
        status: '草稿',
        updatedAt: formatNow(),
        variables: cloneVariables(template.variables),
      },
      ...prev,
    ]);
  };

  const updateTemplateStatus = (id: number, status: TemplateStatus) => {
    setTemplates((prev) => prev.map((template) => (template.id === id ? { ...template, status, updatedAt: formatNow() } : template)));
  };

  const insertVariable = (variable: PromptVariable) => {
    const textarea = textareaRef.current;
    const token = `{{${variable.key}}}`;
    if (!textarea) {
      setDraftPrompt((current) => `${current}${token}`);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    setDraftPrompt((current) => `${current.slice(0, start)}${token}${current.slice(end)}`);
    requestAnimationFrame(() => {
      textarea.focus();
      const nextCaret = start + token.length;
      textarea.setSelectionRange(nextCaret, nextCaret);
    });
  };

  const selectVariable = (variable: PromptVariable) => {
    setVariableFormMode('edit');
    setSelectedVariableId(variable.id);
    setVariableForm(variableToForm(variable));
    setShowVariableForm(true);
  };

  const saveVariable = () => {
    const rawKey = createKey(variableForm.variableName || variableForm.displayNameEn || variableForm.displayNameZh);

    if (variableFormMode === 'edit' && selectedVariable) {
      const nextKey = ensureUniqueKey(rawKey, draftVariables.filter((variable) => variable.id !== selectedVariable.id));
      const nextVariable = formToVariable(variableForm, nextKey, selectedVariable.id);
      setDraftVariables((prev) => prev.map((variable) => (variable.id === selectedVariable.id ? nextVariable : variable)));
      setPreviewValues((prev) => {
        const next = { ...prev, [nextKey]: prev[selectedVariable.key] || nextVariable.defaultValue };
        if (nextKey !== selectedVariable.key) delete next[selectedVariable.key];
        return next;
      });
      if (nextKey !== selectedVariable.key) {
        setDraftPrompt((current) => current.replaceAll(`{{${selectedVariable.key}}}`, `{{${nextKey}}}`));
      }
      setShowVariableForm(false);
      return;
    }

    const nextKey = ensureUniqueKey(rawKey, draftVariables);
    const nextVariable = formToVariable(variableForm, nextKey);
    setDraftVariables((prev) => [...prev, nextVariable]);
    setPreviewValues((prev) => ({ ...prev, [nextKey]: nextVariable.defaultValue }));
    selectVariable(nextVariable);
    setShowVariableForm(false);
  };

  const deleteVariable = () => {
    if (!selectedVariable) return;
    deleteVariableById(selectedVariable.id);
  };

  const deleteVariableById = (id: string) => {
    const target = draftVariables.find((variable) => variable.id === id);
    if (!target) return;
    setDraftVariables((prev) => prev.filter((variable) => variable.id !== id));
    setDraftPrompt((current) => current.replaceAll(`{{${target.key}}}`, ''));
    setPreviewValues((prev) => {
      const next = { ...prev };
      delete next[target.key];
      return next;
    });
    setVariableFormMode('create');
    setSelectedVariableId('');
    setVariableForm(emptyVariableForm);
    setShowVariableForm(false);
  };

  const handleVariableDragStart = (event: DragEvent<HTMLButtonElement>, variable: PromptVariable) => {
    event.dataTransfer.setData('application/x-prompt-variable', variable.id);
    event.dataTransfer.effectAllowed = 'copy';
  };

  const handlePromptDrop = (event: DragEvent<HTMLTextAreaElement>) => {
    event.preventDefault();
    const variableId = event.dataTransfer.getData('application/x-prompt-variable');
    const variable = draftVariables.find((item) => item.id === variableId);
    if (variable) insertVariable(variable);
  };

  const renderCategoryPage = () => (
    <>
      <div className="mt-[20px] flex items-center justify-between border border-[#ddd] bg-white px-[20px] py-[18px]">
        <h1 className="text-[24px] font-bold">Prompt 分类管理</h1>
        <Button tone="success" onClick={openCategoryCreate}>
          + 新增分类
        </Button>
      </div>

      <div className="mt-[20px]">
        <table className="w-full border-collapse text-left text-[14px]">
          <thead>
            <tr className="border-b border-[#ddd]">
              <th className="w-[80px] px-[24px] py-[12px] font-bold">ID</th>
              <th className="px-[14px] py-[12px] font-bold">分类名称</th>
              <th className="px-[14px] py-[12px] font-bold">简述</th>
              <th className="px-[14px] py-[12px] font-bold">模版数</th>
              <th className="px-[14px] py-[12px] font-bold">更新时间</th>
              <th className="w-[260px] px-[14px] py-[12px] text-center font-bold">操作</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category, index) => (
              <tr key={category.id} className="border-b border-[#ddd] bg-[#f7f7f7]">
                <td className="px-[24px] py-[10px]">{index + 1}</td>
                <td className="px-[14px] py-[10px] font-bold">{category.name}</td>
                <td className="px-[14px] py-[10px]">{category.description}</td>
                <td className="px-[14px] py-[10px]">{templates.filter((template) => template.categoryId === category.id).length}</td>
                <td className="px-[14px] py-[10px]">{category.updatedAt}</td>
                <td className="px-[14px] py-[10px] text-center">
                  <Button tone="primary" onClick={() => openTemplateList(category.id)}>
                    进入
                  </Button>
                  <span className="mx-[3px]" />
                  <Button onClick={() => openCategoryEdit(category)}>编辑</Button>
                  <span className="mx-[3px]" />
                  <Button tone="danger" onClick={() => deleteCategory(category.id)}>
                    删除
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );

  const renderTemplatePage = () => (
    <>
      <div className="mt-[20px] border border-[#ddd] bg-white px-[18px] py-[18px]">
        <div className="flex items-end justify-between gap-[16px]">
          <div className="flex items-end gap-[12px] text-[14px]">
            <label>
              <div className="mb-[7px]">模版分类</div>
              <select
                value={templateCategoryFilter}
                onChange={(event) => {
                  const nextValue = event.target.value as TemplateCategoryFilter;
                  setTemplateCategoryFilter(nextValue);
                  if (nextValue !== 'all') setActiveCategoryId(nextValue);
                }}
                className="h-[30px] w-[180px] rounded border border-[#ccc] px-[8px]"
              >
                <option value="all">All</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <div className="mb-[7px]">关键词</div>
              <input
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                className="h-[30px] w-[220px] rounded border border-[#ccc] px-[8px]"
                placeholder="名称 / 模版id"
              />
            </label>
            <label>
              <div className="mb-[7px]">状态</div>
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value as '全部状态' | TemplateStatus)}
                className="h-[30px] w-[160px] rounded border border-[#ccc] px-[8px]"
              >
                <option>全部状态</option>
                <option>上架</option>
                <option>草稿</option>
                <option>下架</option>
              </select>
            </label>
            <Button tone="primary">搜索</Button>
            <Button
              onClick={() => {
                setKeyword('');
                setStatusFilter('全部状态');
                setTemplateCategoryFilter('all');
              }}
            >
              重置
            </Button>
          </div>
          <Button tone="success" onClick={createTemplate}>
            + 新增模版
          </Button>
        </div>
      </div>

      <div className="mt-[20px]">
        <table className="w-full border-collapse text-left text-[14px]">
          <thead>
            <tr className="border-b border-[#ddd]">
              <th className="w-[80px] px-[24px] py-[12px] font-bold">ID</th>
              <th className="px-[14px] py-[12px] font-bold">模版分类</th>
              <th className="px-[14px] py-[12px] font-bold">模版名称</th>
              <th className="px-[14px] py-[12px] font-bold">模版id</th>
              <th className="px-[14px] py-[12px] font-bold">变量数</th>
              <th className="px-[14px] py-[12px] font-bold">状态</th>
              <th className="px-[14px] py-[12px] font-bold">更新时间</th>
              <th className="w-[260px] px-[14px] py-[12px] text-center font-bold">操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredTemplates.map((template) => (
              <tr key={template.id} className="border-b border-[#ddd] bg-[#f7f7f7]">
                <td className="px-[24px] py-[10px]">{template.id}</td>
                <td className="px-[14px] py-[10px]">{categories.find((category) => category.id === template.categoryId)?.name || '-'}</td>
                <td className="px-[14px] py-[10px] font-bold">{template.name}</td>
                <td className="px-[14px] py-[10px] font-mono text-[13px]">{template.key}</td>
                <td className="px-[14px] py-[10px]">{template.variables.length}</td>
                <td className="px-[14px] py-[10px]">
                  <select
                    value={template.status}
                    onChange={(event) => updateTemplateStatus(template.id, event.target.value as TemplateStatus)}
                    className="h-[28px] rounded border border-[#ccc] bg-white px-[8px] text-[13px]"
                  >
                    <option>上架</option>
                    <option>草稿</option>
                    <option>下架</option>
                  </select>
                </td>
                <td className="px-[14px] py-[10px]">{template.updatedAt}</td>
                <td className="px-[14px] py-[10px] text-center">
                  <Button tone="primary" onClick={() => editTemplate(template)}>
                    编辑
                  </Button>
                  <span className="mx-[3px]" />
                  <Button onClick={() => duplicateTemplate(template)}>复制</Button>
                  <span className="mx-[3px]" />
                  <Button tone="danger" onClick={() => deleteTemplate(template.id)}>
                    删除
                  </Button>
                </td>
              </tr>
            ))}
            {filteredTemplates.length === 0 && (
              <tr>
                <td colSpan={8} className="px-[24px] py-[34px] text-center text-[#777]">
                  暂无模版
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );

  const renderVariablePanel = () => (
    <Panel title="变量">
      <div className="border-b border-[#ddd] p-[14px]">
        <div className="mb-[10px] flex items-center justify-between">
          <b className="text-[13px]">变量列表</b>
          <div className="flex gap-[6px]">
            <Button
              onClick={() => {
                setShowVariableGroupForm(true);
                setShowVariableGroupEditor(false);
                setEditingVariableGroup(null);
                setVariableGroupName('');
              }}
            >
              管理分类
            </Button>
            <Button onClick={openVariableCreate}>+ 新增变量</Button>
          </div>
        </div>
        <div className="max-h-[620px] overflow-y-auto border border-[#ddd]">
          {ungroupedVariables.length > 0 && (
            <div className="border-b border-[#ddd] last:border-b-0">
              {ungroupedVariables.map((variable) => (
                <div
                  key={variable.id}
                  className={`flex min-h-[44px] items-center gap-[6px] border-t border-[#eee] px-[10px] py-[6px] text-[13px] first:border-t-0 ${
                    selectedVariableId === variable.id ? 'bg-[#eaf7ff]' : 'bg-white'
                  }`}
                >
                  <button
                    type="button"
                    draggable
                    onDragStart={(event) => handleVariableDragStart(event, variable)}
                    onClick={() => insertVariable(variable)}
                    className="cursor-grab rounded border border-[#cfe9f5] bg-white px-[6px] py-[3px] font-mono text-[11px] text-[#0073aa]"
                  >
                    {'{{'}
                    {variable.key}
                    {'}}'}
                  </button>
                  <div className="min-w-0 flex-1 text-left">
                    <div className="truncate font-bold">{getVariableDisplayName(variable)}</div>
                    <div className="text-[11px] text-[#777]">
                      {getVariableTypeLabel(variable.type)} · {variable.displayNames.en}
                    </div>
                  </div>
                  <Button onClick={() => selectVariable(variable)}>编辑</Button>
                  <Button tone="danger" onClick={() => deleteVariableById(variable.id)}>
                    删除
                  </Button>
                </div>
              ))}
            </div>
          )}
          {availableVariableGroups.map((group) => {
            const variables = draftVariables.filter((variable) => variable.group === group);
            return (
              <div key={group} className="border-b border-[#ddd] last:border-b-0">
                <div className="flex items-center justify-between bg-[#f8f8f8] px-[10px] py-[7px] text-[12px] font-bold text-[#555]">
                  <span>{group}</span>
                  <span>{variables.length}</span>
                </div>
                {variables.length === 0 && <div className="px-[10px] py-[10px] text-[12px] text-[#999]">暂无变量</div>}
                {variables.map((variable) => (
                  <div
                    key={variable.id}
                    className={`flex min-h-[44px] items-center gap-[6px] border-t border-[#eee] px-[10px] py-[6px] text-[13px] ${
                      selectedVariableId === variable.id ? 'bg-[#eaf7ff]' : 'bg-white'
                    }`}
                  >
                    <button
                      type="button"
                      draggable
                      onDragStart={(event) => handleVariableDragStart(event, variable)}
                      onClick={() => insertVariable(variable)}
                      className="cursor-grab rounded border border-[#cfe9f5] bg-white px-[6px] py-[3px] font-mono text-[11px] text-[#0073aa]"
                    >
                      {'{{'}
                      {variable.key}
                      {'}}'}
                    </button>
                    <div className="min-w-0 flex-1 text-left">
                      <div className="truncate font-bold">{getVariableDisplayName(variable)}</div>
                      <div className="text-[11px] text-[#777]">
                        {getVariableTypeLabel(variable.type)} · {variable.displayNames.en}
                      </div>
                    </div>
                    <Button onClick={() => selectVariable(variable)}>编辑</Button>
                    <Button tone="danger" onClick={() => deleteVariableById(variable.id)}>
                      删除
                    </Button>
                  </div>
                ))}
              </div>
            );
          })}
          {draftVariables.length === 0 && <div className="px-[10px] py-[18px] text-center text-[12px] text-[#999]">暂无变量</div>}
        </div>
      </div>
    </Panel>
  );

  const renderEditPage = () => (
    <>
      <div className="mt-[20px] flex items-center justify-between border border-[#ddd] bg-white px-[20px] py-[18px]">
        <div className="flex items-center gap-[12px]">
          <Button onClick={() => setMode('templates')}>返回模版列表</Button>
          <h1 className="text-[24px] font-bold">{editingTemplateId ? '编辑 Prompt 模版' : '新增 Prompt 模版'}</h1>
        </div>
        <Button tone="success" onClick={saveTemplate}>
          保存
        </Button>
      </div>

      <div className="mt-[20px] border border-[#ddd] bg-white px-[18px] py-[18px]">
        <div className="grid grid-cols-[170px_1fr_220px_150px] gap-[12px] text-[14px]">
          <label>
            <div className="mb-[7px]">分类</div>
            <select
              value={draftCategoryId}
              onChange={(event) => setDraftCategoryId(event.target.value)}
              className="h-[30px] w-full rounded border border-[#ccc] px-[8px]"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            <div className="mb-[7px]">模版名称</div>
            <input
              value={draftName}
              onChange={(event) => setDraftName(event.target.value)}
              className="h-[30px] w-full rounded border border-[#ccc] px-[8px]"
            />
          </label>
          <label>
            <div className="mb-[7px]">模版id</div>
            <input
              value={draftKey}
              onChange={(event) => setDraftKey(event.target.value)}
              className="h-[30px] w-full rounded border border-[#ccc] px-[8px] font-mono"
            />
          </label>
          <label>
            <div className="mb-[7px]">状态</div>
            <select
              value={draftStatus}
              onChange={(event) => setDraftStatus(event.target.value as TemplateStatus)}
              className="h-[30px] w-full rounded border border-[#ccc] px-[8px]"
            >
              <option>上架</option>
              <option>草稿</option>
              <option>下架</option>
            </select>
          </label>
        </div>
      </div>

      <div className="mt-[20px] grid grid-cols-[minmax(0,1fr)_520px] gap-[20px]">
        <Panel title="Prompt 输入框">
          <textarea
            ref={textareaRef}
            value={draftPrompt}
            onChange={(event) => setDraftPrompt(event.target.value)}
            onDragOver={(event) => event.preventDefault()}
            onDrop={handlePromptDrop}
            spellCheck={false}
            className="h-[500px] w-full resize-none border-0 p-[18px] font-mono text-[13px] leading-[24px] outline-none"
          />
          <div className="border-t border-[#ddd] bg-[#fafafa] px-[18px] py-[14px]">
            <div className="mb-[8px] text-[13px] font-bold">渲染结果</div>
            <pre className="min-h-[120px] whitespace-pre-wrap font-mono text-[13px] leading-[23px]">{renderedPrompt}</pre>
          </div>
        </Panel>
        {renderVariablePanel()}
      </div>
    </>
  );

  const renderCategoryModal = () =>
    showCategoryForm && (
      <Modal title={categoryFormMode === 'create' ? '新增分类' : '编辑分类'} onClose={() => setShowCategoryForm(false)}>
        <div className="space-y-[12px] text-[14px]">
          <label className="block">
            <div className="mb-[7px]">分类名称</div>
            <input
              value={categoryName}
              onChange={(event) => setCategoryName(event.target.value)}
              className="h-[32px] w-full rounded border border-[#ccc] px-[8px]"
            />
          </label>
          <label className="block">
            <div className="mb-[7px]">分类简述</div>
            <textarea
              value={categoryDescription}
              onChange={(event) => setCategoryDescription(event.target.value)}
              className="h-[90px] w-full resize-none rounded border border-[#ccc] px-[8px] py-[6px]"
            />
          </label>
          <div className="flex justify-end gap-[8px] pt-[6px]">
            <Button onClick={() => setShowCategoryForm(false)}>取消</Button>
            <Button tone="primary" onClick={saveCategory}>
              保存
            </Button>
          </div>
        </div>
      </Modal>
    );

  const renderVariableModal = () =>
    showVariableForm && (
      <Modal title={variableFormMode === 'create' ? '新增变量' : '编辑变量'} onClose={closeVariableForm}>
        <div className="grid grid-cols-2 gap-[12px] text-[14px]">
          <label>
            <div className="mb-[7px]">变量名</div>
            <input
              value={variableForm.variableName}
              onChange={(event) => setVariableForm((prev) => ({ ...prev, variableName: event.target.value }))}
              className="h-[32px] w-full rounded border border-[#ccc] px-[8px] font-mono"
              placeholder="例如：product_name，会插入为 {{product_name}}"
            />
          </label>
          <label>
            <div className="mb-[7px]">变量分类</div>
            <select
              value={variableForm.group}
              onChange={(event) => setVariableForm((prev) => ({ ...prev, group: event.target.value }))}
              className="h-[32px] w-full rounded border border-[#ccc] px-[8px]"
            >
              <option value="">无分类</option>
              {availableVariableGroups.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
          </label>
          <label>
            <div className="mb-[7px]">前端显示名称（中文）</div>
            <input
              value={variableForm.displayNameZh}
              onChange={(event) =>
                setVariableForm((prev) => ({
                  ...prev,
                  displayNameZh: event.target.value,
                  variableName: variableFormMode === 'create' && !prev.variableName ? createKey(event.target.value) : prev.variableName,
                }))
              }
              className="h-[32px] w-full rounded border border-[#ccc] px-[8px]"
            />
          </label>
          <label>
            <div className="mb-[7px]">前端显示名称（English）</div>
            <input
              value={variableForm.displayNameEn}
              onChange={(event) => setVariableForm((prev) => ({ ...prev, displayNameEn: event.target.value }))}
              className="h-[32px] w-full rounded border border-[#ccc] px-[8px]"
            />
          </label>
          <label>
            <div className="mb-[7px]">类型</div>
            <select
              value={variableForm.type}
              onChange={(event) => setVariableForm((prev) => ({ ...prev, type: event.target.value as VariableType }))}
              className="h-[32px] w-full rounded border border-[#ccc] px-[8px]"
            >
              <option value="text">填空</option>
              <option value="select">选项</option>
              <option value="select_text">选项+填空</option>
            </select>
          </label>
          <label>
            <div className="mb-[7px]">默认值</div>
            <input
              value={variableForm.defaultValue}
              onChange={(event) => setVariableForm((prev) => ({ ...prev, defaultValue: event.target.value }))}
              className="h-[32px] w-full rounded border border-[#ccc] px-[8px]"
            />
          </label>
          <label className="col-span-2">
            <div className="mb-[7px]">占位提示</div>
            <input
              value={variableForm.placeholder}
              onChange={(event) => setVariableForm((prev) => ({ ...prev, placeholder: event.target.value }))}
              className="h-[32px] w-full rounded border border-[#ccc] px-[8px]"
            />
          </label>
          {hasOptions(variableForm.type) && (
            <label className="col-span-2">
              <div className="mb-[7px]">选项，每行一个</div>
              <textarea
                value={variableForm.optionsText}
                onChange={(event) => setVariableForm((prev) => ({ ...prev, optionsText: event.target.value }))}
                className="h-[96px] w-full resize-none rounded border border-[#ccc] px-[8px] py-[6px]"
              />
            </label>
          )}
          <label className="col-span-2 flex items-center gap-[6px]">
            <input
              type="checkbox"
              checked={variableForm.required}
              onChange={(event) => setVariableForm((prev) => ({ ...prev, required: event.target.checked }))}
            />
            必填
          </label>
          <div className="col-span-2 flex justify-end gap-[8px] pt-[4px]">
            {variableFormMode === 'edit' && (
              <Button tone="danger" onClick={deleteVariable}>
                删除变量
              </Button>
            )}
            <Button onClick={closeVariableForm}>取消</Button>
            <Button tone="primary" onClick={saveVariable}>
              保存
            </Button>
          </div>
        </div>
      </Modal>
    );

  const renderVariableGroupModal = () =>
    showVariableGroupForm && (
      <Modal title="管理变量分类" onClose={() => setShowVariableGroupForm(false)}>
        <div className="space-y-[14px] text-[14px]">
          <div className="flex justify-end">
            <Button tone="success" onClick={openVariableGroupCreate}>
              + 新增分类
            </Button>
          </div>
          {showVariableGroupEditor && (
            <div className="rounded border border-[#ddd] bg-[#fafafa] p-[12px]">
              <label className="block">
                <div className="mb-[7px]">分类名称</div>
                <input
                  value={variableGroupName}
                  onChange={(event) => setVariableGroupName(event.target.value)}
                  className="h-[32px] w-full rounded border border-[#ccc] px-[8px]"
                  placeholder="例如：Basic profile、Face、Body"
                />
              </label>
              <div className="mt-[10px] flex justify-end gap-[8px]">
                <Button
                  onClick={() => {
                    setShowVariableGroupEditor(false);
                    setEditingVariableGroup(null);
                    setVariableGroupName('');
                  }}
                >
                  取消
                </Button>
                <Button tone="primary" onClick={saveVariableGroup}>
                  保存
                </Button>
              </div>
            </div>
          )}
          <div className="border border-[#ddd]">
            {availableVariableGroups.map((group) => (
              <div key={group} className="flex items-center gap-[8px] border-b border-[#eee] px-[10px] py-[8px] text-[13px] last:border-b-0">
                <span className="min-w-0 flex-1 font-bold">{group}</span>
                <span className="text-[12px] text-[#777]">{draftVariables.filter((variable) => variable.group === group).length} 个变量</span>
                <Button onClick={() => openVariableGroupEdit(group)}>编辑</Button>
                <Button tone="danger" onClick={() => deleteVariableGroup(group)}>
                  删除
                </Button>
              </div>
            ))}
            {availableVariableGroups.length === 0 && <div className="px-[10px] py-[18px] text-center text-[12px] text-[#999]">暂无变量分类</div>}
          </div>
          <div className="flex justify-end gap-[8px]">
            <Button onClick={() => setShowVariableGroupForm(false)}>关闭</Button>
          </div>
        </div>
      </Modal>
    );

  const renderTopTabs = () => {
    const activeTab = mode === 'categories' ? 'category' : 'template';
    return (
      <nav className="border-b border-[#ddd] text-[14px]">
        <button
          type="button"
          onClick={() => setMode('categories')}
          className={`h-[38px] px-[14px] ${
            activeTab === 'category'
              ? 'border border-b-white border-[#ddd] bg-white text-[#333]'
              : 'text-[#06c]'
          }`}
        >
          Prompt 分类
        </button>
        <button
          type="button"
          onClick={() => {
            setKeyword('');
            setStatusFilter('全部状态');
            setTemplateCategoryFilter('all');
            setMode('templates');
          }}
          className={`h-[38px] px-[18px] ${
            activeTab === 'template'
              ? 'border border-b-white border-[#ddd] bg-white text-[#333]'
              : 'text-[#06c]'
          }`}
        >
          Prompt 模版
        </button>
      </nav>
    );
  };

  return (
    <>
      <main className="min-h-screen bg-white text-[#333]">
        <header className="h-[54px] bg-black px-[34px] text-[14px] text-white">
          <div className="flex h-full items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[13px]">⌂</span>
              <span className="font-bold text-[#00a0df]">管理系统</span>
              <span>/</span>
              <span>AI Avatar CMS</span>
              <span>/</span>
              <span>{mode === 'categories' ? 'Prompt 分类管理' : mode === 'templates' ? 'Prompt 模版管理' : 'Prompt 模版编辑'}</span>
            </div>
            <button className="text-[#00a0df]">登出</button>
          </div>
        </header>

        <div className="flex gap-[35px] px-[35px] py-[39px]">
          <aside className="w-[342px] shrink-0 rounded border border-[#ddd] bg-white px-[15px] py-[16px]">
            <div className="border-b border-[#ddd] pb-[16px] text-[18px]">Hi, Feng</div>
            <div className="mt-[10px]">
              {['推荐 及 EDM 工具', 'PG APK', '消除笔新包', '素材管理'].map((item) => (
                <div key={item} className="flex h-[40px] items-center justify-between border-b border-[#ddd] px-[14px] text-[14px]">
                  <span>{item}</span>
                  <span>‹</span>
                </div>
              ))}
              <div className="mt-[40px] bg-[#00a0df] px-[14px] py-[8px] text-[14px] text-white">AI 管理</div>
              <div className="px-[14px] py-[8px] text-[12px] leading-[21px] text-[#555]">
                {navItems.map((item) => (
                  <div key={item} className={item === 'AI Prompt' ? 'font-bold text-[#e3342f]' : ''}>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </aside>

          <section className="min-w-0 flex-1">
            {renderTopTabs()}
            {mode === 'categories' && renderCategoryPage()}
            {mode === 'templates' && renderTemplatePage()}
            {mode === 'edit' && renderEditPage()}
          </section>
        </div>
      </main>
      {renderCategoryModal()}
      {renderVariableModal()}
      {renderVariableGroupModal()}
    </>
  );
}
