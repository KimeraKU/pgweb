export type Language = 'zh' | 'en';

export interface Translations {
  // Header
  createNew: string;
  undo: string;
  redo: string;
  download: string;
  pro: string;
  language: string;
  
  // Sidebar Tabs
  apps: string;
  ratio: string;
  layout: string;
  templates: string;
  upload: string;
  text: string;
  image: string;
  assets: string;
  background: string;
    batch: string;
    aiImageGenerator: string;
    
    // Layer Toolbar - Image
  enhance: string;
  removeBg: string;
  aiReplace: string;
  replace: string;
  editElements: string;
  editText: string;
  expand: string;
  crop: string;
  copy: string;
  delete: string;
  erasePen: string;
  erase: string;
  flipRotate: string;
  flip: string;
  flipHorizontal: string;
  flipVertical: string;
  rotate: string;
  rotateRight90: string;
  rotateLeft90: string;
  align: string;
  alignObjects: string;
  alignTop: string;
  alignMiddle: string;
  alignBottom: string;
  alignLeft: string;
  alignCenter: string;
  alignRight: string;
  effect: string;
  adjust: string;
  brightness: string;
  contrast: string;
  saturation: string;
  hue: string;
  vignette: string;
  sharpen: string;

  // Layer Toolbar - Text
  aiWrite: string;
  font: string;
  fontSize: string;
  color: string;
  opacity: string;
  spacing: string;
  letterSpacing: string;
  lineSpacing: string;
  italic: string;
  bold: string;
  underline: string;
  strikethrough: string;
  vertical: string;
  effectDefault: string;
  effectShadow: string;
  effectStroke: string;
  effectBackground: string;
  
  // Layer Toolbar - Layout
  width: string;
  border: string;
  corner: string;
  
  // Layer Toolbar - Asset
  editAsset: string;
  
  // Layer Toolbar - Background
  changeColor: string;
  uploadBg: string;
  gradient: string;
  
  // Common
  more: string;
  locked: string;
  showLayer: string;
  hideLayer: string;
  unlockLayer: string;
  lockLayer: string;
  dragToReorder: string;
  expandLayers: string;
  collapseLayers: string;
  group: string;
  ungroup: string;
  
  // Right Sidebar
  layers: string;
  
  // Tab Content
  searchApps: string;
  searchText: string;
  searchImages: string;
  searchAssets: string;
  searchTemplates: string;
  searchBackgrounds: string;
  addText: string;
  recommendedTools: string;
    textTemplates: string;
    textStyles: string;
    myImages: string;
    myFonts: string;
    stockImages: string;
    uploadFont: string;
  elements: string;
  shape: string;
  stickers: string;
  pictureCount: string;
  customSize: string;
  customBackground: string;
  uploadImage: string;
  supportImagesAndVideos: string;
  supportAllFiles: string;
  supportImages: string;
  supportVideos: string;
  all: string;
  images: string;
  videos: string;
  fonts: string;
  noFilesUploaded: string;
  clickUploadToAddFiles: string;
  supportFonts: string;
  noAppsFound: string;
  tryDifferentSearch: string;
  selectLayoutTemplate: string;
  selectLayoutTemplateHint: string;
  starterTitle: string;
  starterBlank: string;
  starterBlankHint: string;
  starterOpenImage: string;
  starterOpenImageHint: string;
  starterCollage: string;
  starterCollageHint: string;
  starterTemplate: string;
  starterTemplateHint: string;
  cancel: string;
  changeImage: string;
  confirm: string;
  zoomOut: string;
  zoomIn: string;
  fullscreen: string;
  handTool: string;
  // Template Categories
  templateCategoryMarketing: string;
  templateCategorySocial: string;
  templateCategoryUtility: string;
  templateCategoryArt: string;
  templateCategoryAIFilter: string;
  templateCategoryAIVideo: string;
  templateCategoryMoments: string;
  templateCategoryFestivals: string;
  templateCategoryLayout: string;
    seeMore: string;
    showLess: string;
    describeYourImage: string;
    aiImageAdd: string;
    aiImageModel: string;
    aiImageRatio: string;
    aiImageAddStyleModel: string;
    aiImageGenerate: string;
    aiImageSelectStyles: string;
    aiImageResetStyles: string;
    aiImageSize: string;
    aiImageAspectRatio: string;
    aiImagePreset: string;
    aiImagePresetMore: string;
    aiImageGeneratedImages: string;
    aiImageRegenerate: string;
    aiImageLike: string;
    aiImageDislike: string;
    aiVideoGenerator: string;
    ugcVideoGenerator: string;
    aiVideoDragDrop: string;
    aiFilter: string;
    aiFilterDragDrop: string;
    aiFilterUploadLine1: string;
    aiFilterUploadLine2: string;
    aiFilterSelectFromArtboard: string;
    // Image Enhancer
    imageEnhancer: string;
    imageEnhancerModalTitle: string;
    removeBgModalTitle: string;
    imageEnhancerUploadImage: string;
    imageEnhancerSelectFromArtboard: string;
    imageEnhancerNoImageHint: string;
    imageEnhancerImagesOnArtboard: string;
    imageEnhancerBefore: string;
    imageEnhancerAfter: string;
    imageEnhancerLoadingImage: string;
    imageEnhancerStyle: string;
    imageEnhancerStandard: string;
    imageEnhancerVivid: string;
    imageEnhancerFresh: string;
    imageEnhancerBackgroundBlur: string;
    imageEnhancerDiscard: string;
    imageEnhancer4k: string;
    imageEnhancer4kSub: string;
    imageEnhancerProBadge: string;
    imageEnhancerEnhancing: string;
    imageEnhancerGenerating: string;
    imageEnhancerStepRemoveBlur: string;
    imageEnhancerStepEnhanceQuality: string;
    imageEnhancerStepUpscaleImage: string;
    imageEnhancerStepBoostDetails: string;
    // AI Removal
    aiRemoval: string;
    aiRemovalModalTitle: string;
    aiRemovalUploadImage: string;
    aiRemovalSelectFromArtboard: string;
    aiRemovalNoImageHint: string;
    aiRemovalImagesOnArtboard: string;
    aiRemovalHighQuality: string;
    aiRemovalFast: string;
    aiRemovalBrush: string;
    aiRemovalMagic: string;
    aiRemovalAutoSelect: string;
    aiRemovalSize: string;
    aiRemovalRemove: string;
    aiRemovalPaintHint: string;
    aiRemovalHot: string;
    aiRemovalProcessing: string;
    // UGC Video Generator
    ugcVideoBackToEditor: string;
    ugcVideoTitle: string;
    ugcVideoStepImage: string;
    ugcVideoStepVideo: string;
    ugcVideoUploadProductImage: string;
    ugcVideoUploadSupportFormats: string;
    ugcVideoModel: string;
    ugcVideoBackgroundLabel: string;
    ugcVideoGenerateCount: string;
    ugcVideoGenerateCountHint: string;
    ugcVideoAspectRatio: string;
    ugcVideoAspectRatioHint: string;
    ugcVideoCreativePrompt: string;
    ugcVideoCreativePromptPlaceholder: string;
    ugcVideoGenerateSceneImage: string;
    ugcVideoImageSkillRunning: string;
    ugcVideoImageSkillEta: string;
    ugcVideoCandidateFailed: string;
    ugcVideoCandidateFailedHint: string;
    ugcVideoVideoSkillRunning: string;
    ugcVideoVideoSkillEta: string;
    ugcVideoReviewingImage: string;
    ugcVideoReviewingImageHint: string;
    ugcVideoGeneratingVideo: string;
    ugcVideoGeneratingVideoHint: string;
    ugcVideoVideoTaskSubmitted: string;
    ugcVideoVideoTaskSubmittedHint: string;
    ugcVideoVideoFailed: string;
    ugcVideoVideoFailedHint: string;
    ugcVideoVideoPreview: string;
    ugcVideoVideoPreviewHint: string;
    ugcVideoViewPrompt: string;
    ugcVideoRegenerate: string;
    ugcVideoGenerate15sVideo: string;
    ugcVideoRegenerateVideo: string;
    ugcVideoTaskList: string;
    ugcVideoTaskListImageHint: string;
    ugcVideoTaskListVideoHint: string;
    ugcVideoTaskCountUnit: string;
    ugcVideoImageTab: string;
    ugcVideoVideoTab: string;
    ugcVideoNoVideoTasks: string;
    ugcVideoTaskPrefix: string;
    ugcVideoCandidatePrefix: string;
    ugcVideoStatusDone: string;
    ugcVideoStatusFailed: string;
    ugcVideoStatusProcessing: string;
    ugcVideoStatusSubmitted: string;
    ugcVideoStatusReviewing: string;
    ugcVideoStatusPrompting: string;
    ugcVideoImagePromptTitle: string;
    ugcVideoVideoPromptTitle: string;
    ugcVideoImagePromptDesc: string;
    ugcVideoVideoPromptDesc: string;
    ugcVideoClose: string;
    ugcVideoNoImagePrompt: string;
    ugcVideoNoVideoPrompt: string;
    ugcVideoSetNone: string;
    ugcVideoPickerModel: string;
    ugcVideoPickerScene: string;
    ugcVideoCustomization: string;
    ugcVideoCustomModel: string;
    ugcVideoCustomScene: string;
    ugcVideoNone: string;
  }

const translations: Record<Language, Translations> = {
  zh: {
    // Header
    createNew: '新建',
    undo: '撤销',
    redo: '重做',
    download: '下载',
    pro: '专业版',
    language: '语言',
    
    // Sidebar Tabs
    apps: '应用',
    ratio: '比例',
    layout: '布局',
    templates: '模板',
    upload: '上传',
    text: '文字',
    image: '图片',
    assets: '资源',
    background: '背景',
    batch: '批量',
    aiImageGenerator: 'AI生图',
    
    // Layer Toolbar - Image
    enhance: '画质增强',
    removeBg: '移除背景',
    aiReplace: 'AI替换',
    replace: '替换',
    editElements: '编辑元素',
    editText: '编辑文字',
    expand: '生成扩图',
    crop: '裁剪',
    copy: '复制',
    delete: '删除',
    erasePen: '消除笔',
    erase: '橡皮',
    flipRotate: '对称和旋转',
    flip: '翻转',
    flipHorizontal: '水平翻转',
    flipVertical: '垂直翻转',
    rotate: '旋转',
    rotateRight90: '向右旋转 90°',
    rotateLeft90: '向左旋转 90°',
    align: '对齐',
    alignObjects: '对齐对象',
    alignTop: '顶部',
    alignMiddle: '垂直居中',
    alignBottom: '底部',
    alignLeft: '左侧',
    alignCenter: '水平居中',
    alignRight: '右侧',
    effect: '特效',
    adjust: '调整',
    brightness: '亮度',
    contrast: '对比度',
    saturation: '饱和度',
    hue: '色相',
    vignette: '暗角',
    sharpen: '锐化',

    // Layer Toolbar - Text
    aiWrite: 'AI写作',
    font: '字体',
    fontSize: '字号',
    color: '颜色',
    opacity: '透明度',
    spacing: '间距',
    letterSpacing: '字间距',
    lineSpacing: '行间距',
    italic: '斜体',
    bold: '加粗',
    underline: '下划线',
    strikethrough: '删除线',
    vertical: '竖版',
    effectDefault: '默认',
    effectShadow: '阴影',
    effectStroke: '描边',
    effectBackground: '背景',
    
    // Layer Toolbar - Layout
    width: '宽度',
    border: '边框',
    corner: '圆角',
    
    // Layer Toolbar - Asset
    editAsset: '编辑元素',
    
    // Layer Toolbar - Background
    changeColor: '更换颜色',
    uploadBg: '上传背景',
    gradient: '渐变',
    
    // Common
    more: '更多',
    locked: '已锁定',
    showLayer: '显示图层',
    hideLayer: '隐藏图层',
    unlockLayer: '解锁图层',
    lockLayer: '锁定图层',
    dragToReorder: '拖拽排序',
    expandLayers: '展开图层',
    collapseLayers: '折叠图层',
    group: '分组',
    ungroup: '取消分组',
    
    // Right Sidebar
    layers: '图层',
    
    // Tab Content
    searchApps: '搜索应用...',
    searchText: '搜索文字样式...',
    searchImages: '搜索图片...',
    searchAssets: '搜索资源...',
    searchTemplates: '搜索模板...',
    searchBackgrounds: '搜索背景...',
    addText: '添加文字',
    recommendedTools: '推荐工具',
    textTemplates: '文字模板',
    textStyles: '文字样式',
    myImages: '我的图片',
    myFonts: '我的字体',
    stockImages: '素材图片',
    uploadFont: '上传字体',
    elements: '元素',
    shape: '形状',
    stickers: '贴纸',
    pictureCount: '图片数量',
    customSize: '自定义尺寸',
    customBackground: '自定义背景',
    uploadImage: '上传图片',
    supportImagesAndVideos: '支持图片和视频',
    supportAllFiles: '支持图片、视频和字体',
    supportImages: '支持 JPG, PNG, GIF, WEBP 格式',
    supportVideos: '支持 MP4, MOV, AVI 格式',
    all: '全部',
    images: '图片',
    videos: '视频',
    fonts: '字体',
    noFilesUploaded: '暂无上传文件',
    clickUploadToAddFiles: '点击上传添加文件',
    supportFonts: '支持 TTF, OTF, WOFF, WOFF2 格式',
    noAppsFound: '未找到应用',
    tryDifferentSearch: '尝试其他搜索词',
    selectLayoutTemplate: '选择布局模板',
    selectLayoutTemplateHint: '请在左侧 Layout 标签中选择一个布局模板来替换当前布局',
    starterTitle: '选择开始方式',
    starterBlank: '新建空白',
    starterBlankHint: '从空白开始',
    starterOpenImage: '打开图片',
    starterOpenImageHint: '导入图片',
    starterCollage: '新建拼图',
    starterCollageHint: '选择布局',
    starterTemplate: '打开模版',
    starterTemplateHint: '选择模板',
    cancel: '取消',
    changeImage: '更换图片',
    confirm: '确认',
    zoomOut: '缩小',
    zoomIn: '放大',
    fullscreen: '全屏',
    handTool: '手型工具',
    
    // Template Categories
    templateCategoryMarketing: '商业营销',
    templateCategorySocial: '社交媒体',
    templateCategoryUtility: '个人效率',
    templateCategoryArt: '视觉艺术',
    templateCategoryAIFilter: 'AI Filter',
    templateCategoryAIVideo: 'AI Video',
    templateCategoryMoments: '生命瞬间',
    templateCategoryFestivals: '全球节日',
    templateCategoryLayout: 'Layout',
    seeMore: '查看更多',
    showLess: '收起',
    describeYourImage: '输入图片生成的提示词，例如: 浩瀚的银河中一艘宇宙飞船驶过',
    aiImageAdd: '添加',
    aiImageModel: 'Seedream 4.5',
    aiImageRatio: '4:3 · 1张',
    aiImageAddStyleModel: '添加风格模型',
    aiImageGenerate: '生成',
    aiImageSelectStyles: '选择风格',
    aiImageResetStyles: '重置风格',
    aiImageSize: '尺寸',
    aiImageAspectRatio: '比例',
    aiImagePreset: '预设',
    aiImagePresetMore: '更多',
    aiImageGeneratedImages: '生成图',
    aiImageRegenerate: '重新生成',
    aiImageLike: '点赞',
    aiImageDislike: '点踩',
    aiVideoGenerator: 'AI 视频生成',
    ugcVideoGenerator: 'UGC 应用视频生成',
    aiVideoDragDrop: '将文件拖放到此处',
    aiFilter: 'AI Filter',
    aiFilterDragDrop: '将文件拖放到此处',
    aiFilterUploadLine1: '拖放图片，',
    aiFilterUploadLine2: '或从设备添加',
    aiFilterSelectFromArtboard: 'Select image from artboard',
    imageEnhancer: 'Image enhancer',
    imageEnhancerModalTitle: '添加要增强的图片',
    removeBgModalTitle: '添加要去背的图片',
    imageEnhancerUploadImage: '上传图片',
    imageEnhancerSelectFromArtboard: '从画板选择图片',
    imageEnhancerNoImageHint: '请上传或从画板选择一张图片',
    imageEnhancerImagesOnArtboard: '画板中的图片',
    imageEnhancerBefore: 'Before',
    imageEnhancerAfter: 'After',
    imageEnhancerLoadingImage: '加载图片中...',
    imageEnhancerStyle: '风格',
    imageEnhancerStandard: 'Standard',
    imageEnhancerVivid: 'Vivid',
    imageEnhancerFresh: 'Fresh',
    imageEnhancerBackgroundBlur: 'Background Blur',
    imageEnhancerDiscard: '放弃',
    imageEnhancer4k: '4K 超清',
    imageEnhancer4kSub: '最高 4096px',
    imageEnhancerProBadge: 'PRO',
    imageEnhancerEnhancing: '增强中...',
    imageEnhancerGenerating: '生成中',
    imageEnhancerStepRemoveBlur: '去除模糊',
    imageEnhancerStepEnhanceQuality: '提升画质',
    imageEnhancerStepUpscaleImage: '放大图片',
    imageEnhancerStepBoostDetails: '增强细节',
    aiRemoval: 'AI Removal',
    aiRemovalModalTitle: '添加要擦除的图片',
    aiRemovalUploadImage: '上传图片',
    aiRemovalSelectFromArtboard: '从画板选择图片',
    aiRemovalNoImageHint: '请上传或从画板选择一张图片',
    aiRemovalImagesOnArtboard: '画板中的图片',
    aiRemovalHighQuality: 'High Quality',
    aiRemovalFast: 'Fast',
    aiRemovalBrush: 'Brush',
    aiRemovalMagic: 'Magic',
    aiRemovalAutoSelect: 'Auto Select',
    aiRemovalSize: 'Size',
    aiRemovalRemove: 'Remove',
    aiRemovalPaintHint: 'Paint over the object to remove',
    aiRemovalHot: 'Hot',
    aiRemovalProcessing: '处理中...',
    ugcVideoBackToEditor: '返回编辑器',
    ugcVideoTitle: 'UGC 应用视频生成器',
    ugcVideoStepImage: '生成模特场景图',
    ugcVideoStepVideo: '生成商品展示视频',
    ugcVideoUploadProductImage: '上传商品图片',
    ugcVideoUploadSupportFormats: '支持 jpg / png / webp',
    ugcVideoModel: '模特',
    ugcVideoBackgroundLabel: '背景',
    ugcVideoGenerateCount: '生成数量',
    ugcVideoGenerateCountHint: '最多 4 张候选图',
    ugcVideoAspectRatio: '比例',
    ugcVideoAspectRatioHint: '用于控制商品图输出比例',
    ugcVideoCreativePrompt: '创意提示词',
    ugcVideoCreativePromptPlaceholder: '推荐填写：\n- App 名称\n- 核心卖点（1-3条）\n- 目标用户\n- 使用场景\n- 视频风格（口播/旁白）\n- 结尾引导语（CTA）',
    ugcVideoGenerateSceneImage: '生成模特场景图',
    ugcVideoImageSkillRunning: '正在调用virtual model identity skill',
    ugcVideoImageSkillEta: '预计需要3分钟',
    ugcVideoCandidateFailed: '候选图生成失败',
    ugcVideoCandidateFailedHint: '请切换到其他候选图，或重新生成图片。',
    ugcVideoVideoSkillRunning: '正在调用ugc app video generator_v2 skill',
    ugcVideoVideoSkillEta: '预计需要7分钟',
    ugcVideoReviewingImage: '图片审核中',
    ugcVideoReviewingImageHint: '当前选中的图片正在审核，审核通过后会自动继续生成视频。',
    ugcVideoGeneratingVideo: '商品视频生成中',
    ugcVideoGeneratingVideoHint: '当前选中的视频任务正在处理中，请稍候。',
    ugcVideoVideoTaskSubmitted: '视频任务已提交',
    ugcVideoVideoTaskSubmittedHint: '任务已提交到上游，当前查询还没有返回可播放视频。',
    ugcVideoVideoFailed: '商品视频生成失败',
    ugcVideoVideoFailedHint: '请重新发起视频生成，或切换其他视频任务查看。',
    ugcVideoVideoPreview: '商品视频展示区域',
    ugcVideoVideoPreviewHint: '点击生成 15s 视频后，这里会直接展示当前视频任务结果。',
    ugcVideoViewPrompt: '查看 Prompt',
    ugcVideoRegenerate: '重新生成',
    ugcVideoGenerate15sVideo: '生成 15s 视频',
    ugcVideoRegenerateVideo: '重新生成视频',
    ugcVideoTaskList: '任务列表',
    ugcVideoTaskListImageHint: '每张候选图都会作为单独任务保留在这里',
    ugcVideoTaskListVideoHint: '商品视频任务会保留在这里',
    ugcVideoTaskCountUnit: '条',
    ugcVideoImageTab: '商品场景图',
    ugcVideoVideoTab: '商品视频',
    ugcVideoNoVideoTasks: '生成视频后会在这里展示视频任务。',
    ugcVideoTaskPrefix: '视频任务',
    ugcVideoCandidatePrefix: '候选图',
    ugcVideoStatusDone: '已完成',
    ugcVideoStatusFailed: '失败',
    ugcVideoStatusProcessing: '处理中',
    ugcVideoStatusSubmitted: '已提交',
    ugcVideoStatusReviewing: '审核中',
    ugcVideoStatusPrompting: 'Prompt生成中',
    ugcVideoImagePromptTitle: '图片 Prompt',
    ugcVideoVideoPromptTitle: '视频 Prompt',
    ugcVideoImagePromptDesc: '当前选中图片对应的最终生图 Prompt',
    ugcVideoVideoPromptDesc: '当前视频流程使用的视频 Prompt',
    ugcVideoClose: '关闭',
    ugcVideoNoImagePrompt: '暂无图片 Prompt',
    ugcVideoNoVideoPrompt: '暂无视频 Prompt',
    ugcVideoSetNone: '设为无',
    ugcVideoPickerModel: 'Model',
    ugcVideoPickerScene: 'Scene',
    ugcVideoCustomization: 'Customization',
    ugcVideoCustomModel: '自定义模特',
    ugcVideoCustomScene: '自定义场景',
    ugcVideoNone: '无',
  },
  en: {
    // Header
    createNew: 'Create new',
    undo: 'Undo',
    redo: 'Redo',
    download: 'Download',
    pro: 'Pro',
    language: 'Language',
    
    // Sidebar Tabs
    apps: 'Apps',
    ratio: 'Ratio',
    layout: 'Layout',
    templates: 'Templates',
    upload: 'Upload',
    text: 'Text',
    image: 'Image',
    assets: 'Assets',
    background: 'Background',
    batch: 'Batch',
    aiImageGenerator: 'AI Image Generator',
    
    // Layer Toolbar - Image
    enhance: 'Enhance',
    removeBg: 'Remove BG',
    aiReplace: 'AI Replace',
    replace: 'Replace',
    editElements: 'Edit Elements',
    editText: 'Edit Text',
    expand: 'Expand',
    crop: 'Crop',
    copy: 'Copy',
    delete: 'Delete',
    erasePen: 'Erase Pen',
    erase: 'Eraser',
    flipRotate: 'Flip & Rotate',
    flip: 'Flip',
    flipHorizontal: 'Flip horizontal',
    flipVertical: 'Flip vertical',
    rotate: 'Rotate',
    rotateRight90: 'Rotate right 90°',
    rotateLeft90: 'Rotate left 90°',
    align: 'Align',
    alignObjects: 'Align objects',
    alignTop: 'Top',
    alignMiddle: 'Middle',
    alignBottom: 'Bottom',
    alignLeft: 'Left',
    alignCenter: 'Center',
    alignRight: 'Right',
    effect: 'Effect',
    adjust: 'Adjust',
    brightness: 'Brightness',
    contrast: 'Contrast',
    saturation: 'Saturation',
    hue: 'Hue',
    vignette: 'Vignette',
    sharpen: 'Sharpen',

    // Layer Toolbar - Text
    aiWrite: 'AI Write',
    font: 'Font',
    fontSize: 'Font Size',
    color: 'Color',
    opacity: 'Opacity',
    spacing: 'Spacing',
    letterSpacing: 'Letter Spacing',
    lineSpacing: 'Line Spacing',
    italic: 'Italic',
    bold: 'Bold',
    underline: 'Underline',
    strikethrough: 'Strikethrough',
    vertical: 'Vertical',
    effectDefault: 'Default',
    effectShadow: 'Shadow',
    effectStroke: 'Stroke',
    effectBackground: 'Background',
    
    // Layer Toolbar - Layout
    width: 'Width',
    border: 'Border',
    corner: 'Corner',
    
    // Layer Toolbar - Asset
    editAsset: 'Edit Asset',
    
    // Layer Toolbar - Background
    changeColor: 'Change Color',
    uploadBg: 'Upload BG',
    gradient: 'Gradient',
    
    // Common
    more: 'More',
    locked: 'Locked',
    showLayer: 'Show layer',
    hideLayer: 'Hide layer',
    unlockLayer: 'Unlock layer',
    lockLayer: 'Lock layer',
    dragToReorder: 'Drag to reorder',
    expandLayers: 'Expand Layers',
    collapseLayers: 'Collapse Layers',
    group: 'Group',
    ungroup: 'Ungroup',
    
    // Right Sidebar
    layers: 'Layers',
    
    // Tab Content
    searchApps: 'Search apps...',
    searchText: 'Search text styles...',
    searchImages: 'Search images...',
    searchAssets: 'Search assets...',
    searchTemplates: 'Search templates...',
    searchBackgrounds: 'Search backgrounds...',
    addText: 'Add Text',
    recommendedTools: 'Recommended Tools',
    textTemplates: 'Text Templates',
    textStyles: 'Text Styles',
    myImages: 'My Images',
    myFonts: 'My Fonts',
    stockImages: 'Stock Images',
    uploadFont: 'Upload Font',
    elements: 'Elements',
    shape: 'Shape',
    stickers: 'Stickers',
    pictureCount: 'Picture Count',
    customSize: 'Custom size',
    customBackground: 'Custom Background',
    uploadImage: 'Upload Image',
    supportImagesAndVideos: 'Support images and videos',
    supportAllFiles: 'Support images, videos and fonts',
    supportImages: 'Support JPG, PNG, GIF, WEBP formats',
    supportVideos: 'Support MP4, MOV, AVI formats',
    all: 'All',
    images: 'Images',
    videos: 'Videos',
    fonts: 'Fonts',
    noFilesUploaded: 'No files uploaded',
    clickUploadToAddFiles: 'Click upload to add files',
    supportFonts: 'Support TTF, OTF, WOFF, WOFF2 formats',
    noAppsFound: 'No apps found',
    tryDifferentSearch: 'Try a different search term',
    selectLayoutTemplate: 'Select Layout Template',
    selectLayoutTemplateHint: 'Please select a layout template from the Layout tab on the left to replace the current layout',
    starterTitle: 'Choose how to start',
    starterBlank: 'Blank canvas',
    starterBlankHint: 'Start from blank',
    starterOpenImage: 'Open image',
    starterOpenImageHint: 'Import image',
    starterCollage: 'Create collage',
    starterCollageHint: 'Choose a layout',
    starterTemplate: 'Open template',
    starterTemplateHint: 'Choose a template',
    cancel: 'Cancel',
    changeImage: 'Change image',
    confirm: 'Confirm',
    zoomOut: 'Zoom Out',
    zoomIn: 'Zoom In',
    fullscreen: 'Fullscreen',
    handTool: 'Hand Tool',
    
    // Template Categories
    templateCategoryMarketing: 'Marketing',
    templateCategorySocial: 'Social',
    templateCategoryUtility: 'Utility',
    templateCategoryArt: 'Art',
    templateCategoryAIFilter: 'AI Filter',
    templateCategoryAIVideo: 'AI Video',
    templateCategoryMoments: 'Moments',
    templateCategoryFestivals: 'Festivals',
    templateCategoryLayout: 'Layout',
    seeMore: 'See more',
    showLess: 'Show less',
    describeYourImage: 'Describe your image',
    aiImageAdd: 'Add',
    aiImageModel: 'Seedream 4.5',
    aiImageRatio: '4:3 · 1 image',
    aiImageAddStyleModel: 'Add style model',
    aiImageGenerate: 'Generate',
    aiImageSelectStyles: 'Select styles',
    aiImageResetStyles: 'Reset styles',
    aiImageSize: 'Size',
    aiImageAspectRatio: 'Aspect_ratio',
    aiImagePreset: 'Preset',
    aiImagePresetMore: 'More',
    aiImageGeneratedImages: 'Generated',
    aiImageRegenerate: 'Regenerate',
    aiImageLike: 'Like',
    aiImageDislike: 'Dislike',
    aiVideoGenerator: 'AI Video Generator',
    ugcVideoGenerator: 'UGC App Video Generator',
    aiVideoDragDrop: 'Drag and drop your files here',
    aiFilter: 'AI Filter',
    aiFilterDragDrop: 'Drag and drop your files here',
    aiFilterUploadLine1: 'Drag and drop images,',
    aiFilterUploadLine2: 'or add from your device',
    aiFilterSelectFromArtboard: 'Select image from artboard',
    imageEnhancer: 'Image enhancer',
    imageEnhancerModalTitle: 'Add image to enhance',
    removeBgModalTitle: 'Add image to remove background',
    imageEnhancerUploadImage: 'Upload image',
    imageEnhancerSelectFromArtboard: 'Select from artboard',
    imageEnhancerNoImageHint: 'Upload or select an image to enhance',
    imageEnhancerImagesOnArtboard: 'Images on artboard',
    imageEnhancerBefore: 'Before',
    imageEnhancerAfter: 'After',
    imageEnhancerLoadingImage: 'Loading image...',
    imageEnhancerStyle: 'Style',
    imageEnhancerStandard: 'Standard',
    imageEnhancerVivid: 'Vivid',
    imageEnhancerFresh: 'Fresh',
    imageEnhancerBackgroundBlur: 'Background Blur',
    imageEnhancerDiscard: 'Discard',
    imageEnhancer4k: '4K HD',
    imageEnhancer4kSub: 'Up to 4096px',
    imageEnhancerProBadge: 'PRO',
    imageEnhancerEnhancing: 'Enhancing...',
    imageEnhancerGenerating: 'Generating',
    imageEnhancerStepRemoveBlur: 'Remove Blur',
    imageEnhancerStepEnhanceQuality: 'Enhance Quality',
    imageEnhancerStepUpscaleImage: 'Upscale Image',
    imageEnhancerStepBoostDetails: 'Boost Details',
    aiRemoval: 'AI Removal',
    aiRemovalModalTitle: 'Add image to remove from',
    aiRemovalUploadImage: 'Upload image',
    aiRemovalSelectFromArtboard: 'Select from artboard',
    aiRemovalNoImageHint: 'Upload or select an image',
    aiRemovalImagesOnArtboard: 'Images on artboard',
    aiRemovalHighQuality: 'High Quality',
    aiRemovalFast: 'Fast',
    aiRemovalBrush: 'Brush',
    aiRemovalMagic: 'Magic',
    aiRemovalAutoSelect: 'Auto Select',
    aiRemovalSize: 'Size',
    aiRemovalRemove: 'Remove',
    aiRemovalPaintHint: 'Paint over the object to remove',
    aiRemovalHot: 'Hot',
    aiRemovalProcessing: 'Processing...',
    ugcVideoBackToEditor: 'Back to Editor',
    ugcVideoTitle: 'UGC App Video Generator',
    ugcVideoStepImage: 'Generate Model Scene Images',
    ugcVideoStepVideo: 'Generate Product Showcase Videos',
    ugcVideoUploadProductImage: 'Upload Product Image',
    ugcVideoUploadSupportFormats: 'Supports jpg / png / webp',
    ugcVideoModel: 'Model',
    ugcVideoBackgroundLabel: 'Background',
    ugcVideoGenerateCount: 'Generation Count',
    ugcVideoGenerateCountHint: 'Up to 4 candidate images',
    ugcVideoAspectRatio: 'Aspect Ratio',
    ugcVideoAspectRatioHint: 'Used to control product image output ratio',
    ugcVideoCreativePrompt: 'Creative Prompt',
    ugcVideoCreativePromptPlaceholder: 'Recommended inputs:\n- App name\n- Core selling points (1-3)\n- Target users\n- Use scenarios\n- Video style (talking head/voice-over)\n- Ending CTA',
    ugcVideoGenerateSceneImage: 'Generate Model Scene Images',
    ugcVideoImageSkillRunning: 'Running virtual model identity skill',
    ugcVideoImageSkillEta: 'Estimated time: 3 minutes',
    ugcVideoCandidateFailed: 'Candidate image generation failed',
    ugcVideoCandidateFailedHint: 'Please switch to another candidate image, or regenerate the image.',
    ugcVideoVideoSkillRunning: 'Running ugc app video generator_v2 skill',
    ugcVideoVideoSkillEta: 'Estimated time: 7 minutes',
    ugcVideoReviewingImage: 'Image Under Review',
    ugcVideoReviewingImageHint: 'The selected image is under review. Video generation will continue automatically after approval.',
    ugcVideoGeneratingVideo: 'Product Video Generating',
    ugcVideoGeneratingVideoHint: 'The selected video task is processing. Please wait.',
    ugcVideoVideoTaskSubmitted: 'Video Task Submitted',
    ugcVideoVideoTaskSubmittedHint: 'The task has been submitted upstream, but no playable video URL has returned yet.',
    ugcVideoVideoFailed: 'Product Video Generation Failed',
    ugcVideoVideoFailedHint: 'Please start video generation again, or switch to another video task.',
    ugcVideoVideoPreview: 'Product Video Preview Area',
    ugcVideoVideoPreviewHint: 'After clicking "Generate 15s Video", this area will show the current video task result.',
    ugcVideoViewPrompt: 'View Prompt',
    ugcVideoRegenerate: 'Regenerate',
    ugcVideoGenerate15sVideo: 'Generate 15s Video',
    ugcVideoRegenerateVideo: 'Regenerate Video',
    ugcVideoTaskList: 'Task List',
    ugcVideoTaskListImageHint: 'Each candidate image is kept here as an independent task',
    ugcVideoTaskListVideoHint: 'Product video tasks are kept here',
    ugcVideoTaskCountUnit: 'items',
    ugcVideoImageTab: 'Product Scene Images',
    ugcVideoVideoTab: 'Product Videos',
    ugcVideoNoVideoTasks: 'Video tasks will appear here after generation.',
    ugcVideoTaskPrefix: 'Video Task',
    ugcVideoCandidatePrefix: 'Candidate',
    ugcVideoStatusDone: 'Completed',
    ugcVideoStatusFailed: 'Failed',
    ugcVideoStatusProcessing: 'Processing',
    ugcVideoStatusSubmitted: 'Submitted',
    ugcVideoStatusReviewing: 'Reviewing',
    ugcVideoStatusPrompting: 'Prompt generating',
    ugcVideoImagePromptTitle: 'Image Prompt',
    ugcVideoVideoPromptTitle: 'Video Prompt',
    ugcVideoImagePromptDesc: 'Final image prompt for the selected image',
    ugcVideoVideoPromptDesc: 'Video prompt used by the current video flow',
    ugcVideoClose: 'Close',
    ugcVideoNoImagePrompt: 'No image prompt available',
    ugcVideoNoVideoPrompt: 'No video prompt available',
    ugcVideoSetNone: 'Set none',
    ugcVideoPickerModel: 'Model',
    ugcVideoPickerScene: 'Scene',
    ugcVideoCustomization: 'Customization',
    ugcVideoCustomModel: 'Custom Model',
    ugcVideoCustomScene: 'Custom Scene',
    ugcVideoNone: 'None',
  },
};

export function getTranslations(lang: Language): Translations {
  return translations[lang];
}

export function t(key: keyof Translations, lang: Language): string {
  return translations[lang][key];
}
