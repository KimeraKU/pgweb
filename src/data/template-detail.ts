// 模板详情页用到的数据结构（与 layout 模板可扩展关联）
export interface TemplateDetail {
  id: string;
  name: string;
  description: string;
  previewImage: string;
  size: string;
  imageCount: number;
  category: string;
  includedTools: { id: string; name: string; icon: string }[];
  relevantCategories: { id: string; name: string; icon?: string }[];
}

const defaultTemplate: TemplateDetail = {
  id: '',
  name: 'Template',
  description:
    'PhotoGrid provides an all-in-one photo editor to easily crop, resize, adjust brightness and darkness, etc. Our best photo editing tool makes your image colorful with stickers, text, effects, layout templates, etc. You can remove backgrounds in one click, add filters and frames, create collages, and export in high quality. Whether you are editing for social media, YouTube thumbnails, or personal albums, PhotoGrid helps you get it done quickly. Start with a template or a blank canvas—both are free to try.',
  previewImage: '',
  size: '1024×1024',
  imageCount: 3,
  category: 'Templates',
  includedTools: [
    { id: 'bg-remover', name: 'Background Remover', icon: 'UserMinus' },
    { id: 'object-remover', name: 'Object Remover', icon: 'Eraser' },
    { id: 'watermark', name: 'Watermark Remover', icon: 'Shield' },
    { id: 'layout', name: 'Layout', icon: 'Layout' },
  ],
  relevantCategories: [
    { id: 'youtube', name: 'Youtube cover' },
    { id: 'christmas', name: 'Christmas' },
    { id: 'halloween', name: 'Halloween' },
    { id: 'thanksgiving', name: 'Thanksgiving' },
    { id: 'instagram', name: 'Instagram' },
    { id: 'facebook', name: 'Facebook' },
    { id: 'valentine', name: 'Valentine' },
    { id: 'new-year', name: 'New Year' },
    { id: 'travel', name: 'Travel' },
    { id: 'wedding', name: 'Wedding' },
    { id: 'birthday', name: 'Birthday' },
    { id: 'baby', name: 'Baby' },
    { id: 'pet', name: 'Pet' },
    { id: 'food', name: 'Food' },
    { id: 'fashion', name: 'Fashion' },
    { id: 'sports', name: 'Sports' },
    { id: 'music', name: 'Music' },
    { id: 'summer', name: 'Summer' },
    { id: 'autumn', name: 'Autumn' },
    { id: 'spring', name: 'Spring' },
    { id: 'winter', name: 'Winter' },
  ],
};

// 模拟模板详情数据
export function getTemplateById(id: string): TemplateDetail | null {
  const templates: Record<string, TemplateDetail> = {
    'youtube-1': {
      ...defaultTemplate,
      id: 'youtube-1',
      name: 'Free Online Photo Editor for Everyone',
      category: 'YouTube',
    },
    t1: { ...defaultTemplate, id: 't1', name: 'Summer Vibe', category: 'Summer' },
    t2: { ...defaultTemplate, id: 't2', name: 'Christmas', category: 'Christmas' },
    t3: { ...defaultTemplate, id: 't3', name: 'OH WAIT SUMMER', category: 'Summer' },
    t4: { ...defaultTemplate, id: 't4', name: 'Nature', category: 'Nature' },
    t5: { ...defaultTemplate, id: 't5', name: 'Best friend forever', category: 'Friends' },
    t6: { ...defaultTemplate, id: 't6', name: 'NEW ITEM 30% OFF', category: 'Sale' },
    t7: { ...defaultTemplate, id: 't7', name: 'Thank you!', category: 'Greetings' },
    t8: { ...defaultTemplate, id: 't8', name: 'Happy BIRTHDAY', category: 'Birthday' },
    t9: { ...defaultTemplate, id: 't9', name: 'MOM MOM MOM', category: 'Family' },
    t10: { ...defaultTemplate, id: 't10', name: 'FALL IN LOVE IN PARIS', category: 'Travel' },
    t11: { ...defaultTemplate, id: 't11', name: 'Wish You the Best', category: 'Greetings' },
    t12: { ...defaultTemplate, id: 't12', name: 'Together', category: 'Family' },
    t13: { ...defaultTemplate, id: 't13', name: 'Family', category: 'Family' },
    t14: { ...defaultTemplate, id: 't14', name: 'Party', category: 'Party' },
    t15: { ...defaultTemplate, id: 't15', name: 'Sale', category: 'Sale' },
    t16: { ...defaultTemplate, id: 't16', name: 'Greetings', category: 'Greetings' },
  };
  const t = templates[id];
  if (t) return t;
  return { ...defaultTemplate, id, name: id, category: 'Templates' };
}

// “更多类似”模板列表（用于 More like this）
export function getMoreLikeThis(currentId: string, limit = 16): { id: string; name: string; preview: string }[] {
  const all = [
    { id: 't1', name: 'Summer Vibe', preview: '/placeholder-image.jpg' },
    { id: 't2', name: 'Christmas', preview: '/placeholder-image.jpg' },
    { id: 't3', name: 'OH WAIT SUMMER', preview: '/placeholder-image.jpg' },
    { id: 't4', name: 'Nature', preview: '/placeholder-image.jpg' },
    { id: 't5', name: 'Best friend forever', preview: '/placeholder-image.jpg' },
    { id: 't6', name: 'NEW ITEM 30% OFF', preview: '/placeholder-image.jpg' },
    { id: 't7', name: 'Thank you!', preview: '/placeholder-image.jpg' },
    { id: 't8', name: 'Happy BIRTHDAY', preview: '/placeholder-image.jpg' },
    { id: 't9', name: 'MOM MOM MOM', preview: '/placeholder-image.jpg' },
    { id: 't10', name: 'FALL IN LOVE IN PARIS', preview: '/placeholder-image.jpg' },
    { id: 't11', name: 'Wish You the Best', preview: '/placeholder-image.jpg' },
    { id: 't12', name: 'Together', preview: '/placeholder-image.jpg' },
    { id: 't13', name: 'Family', preview: '/placeholder-image.jpg' },
    { id: 't14', name: 'Party', preview: '/placeholder-image.jpg' },
    { id: 't15', name: 'Sale', preview: '/placeholder-image.jpg' },
    { id: 't16', name: 'Greetings', preview: '/placeholder-image.jpg' },
  ];
  return all.filter((t) => t.id !== currentId).slice(0, limit);
}
