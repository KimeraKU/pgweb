import {
  Eraser,
  Image as ImageIcon,
  LayoutGrid,
  Maximize,
  PenTool,
  Scissors,
  ShoppingBag,
  Sparkles,
  UserRound,
  Video,
  Wand2,
  type LucideIcon,
} from 'lucide-react';

export type CreationToolCard = {
  name: string;
  description: string;
  icon: LucideIcon;
  href: string;
  tone: string;
  iconTone: string;
  status?: string;
};

export type CreationToolSection = {
  id: string;
  title: string;
  icon: LucideIcon;
  cards: CreationToolCard[];
};

export const featuredToolCards: CreationToolCard[] = [
  {
    name: 'AI Image',
    description: 'Generate and enhance images for daily creative work.',
    icon: ImageIcon,
    href: '/image-enhancer',
    tone: 'bg-[#10c957]',
    iconTone: 'text-white',
  },
  {
    name: 'AI Video',
    description: 'Create app, product, and social videos from assets.',
    icon: Video,
    href: '/ai-video',
    tone: 'bg-[#ffd51d]',
    iconTone: 'text-slate-950',
  },
  {
    name: 'Grid',
    description: 'Compose collage layouts and structured canvases.',
    icon: LayoutGrid,
    href: '/editor',
    tone: 'bg-[#2f80ed]',
    iconTone: 'text-white',
  },
];

export const agentToolCard: CreationToolCard = {
  name: 'AI Agent',
  description: 'Understand requests, analyze assets, and guide image, video, or editing tasks.',
  icon: Sparkles,
  href: '#',
  tone: 'bg-white',
  iconTone: 'text-slate-600',
};

export const toolCards: CreationToolCard[] = [
  {
    name: 'AI Photo Editor',
    description: 'Edit images with AI-powered adjustments.',
    icon: PenTool,
    href: '/editor',
    tone: 'bg-white',
    iconTone: 'text-slate-600',
  },
  {
    name: 'AI Filter',
    description: 'Apply reusable styles and visual presets.',
    icon: Sparkles,
    href: '#',
    tone: 'bg-white',
    iconTone: 'text-slate-600',
  },
  {
    name: 'Image Upscaler',
    description: 'Improve resolution and visual clarity.',
    icon: Maximize,
    href: '/image-enhancer',
    tone: 'bg-white',
    iconTone: 'text-slate-600',
  },
  {
    name: 'Watermark Remover',
    description: 'Clean unwanted marks from visual assets.',
    icon: Eraser,
    href: '#',
    tone: 'bg-white',
    iconTone: 'text-slate-600',
  },
  {
    name: 'Photo Restoration',
    description: 'Repair old, blurry, or damaged photos.',
    icon: Sparkles,
    href: '#',
    tone: 'bg-white',
    iconTone: 'text-slate-600',
  },
  {
    name: 'Object Remover',
    description: 'Remove distractions from photos and product shots.',
    icon: Wand2,
    href: '#',
    tone: 'bg-white',
    iconTone: 'text-slate-600',
  },
  {
    name: 'E-commerce Video',
    description: 'Turn product materials into conversion-ready videos.',
    icon: ShoppingBag,
    href: '/ugc-video-generator',
    tone: 'bg-white',
    iconTone: 'text-slate-600',
  },
  {
    name: 'AI Avatar',
    description: 'Create avatar-led content and visual presenters.',
    icon: UserRound,
    href: '#',
    tone: 'bg-white',
    iconTone: 'text-slate-600',
  },
  {
    name: 'Background Remover',
    description: 'Cut out subjects and prepare transparent assets.',
    icon: Scissors,
    href: '/background-remover',
    tone: 'bg-white',
    iconTone: 'text-slate-600',
  },
];

export const recommendedFeatureTools = featuredToolCards.slice(0, 2);
export const recommendedGridTools = toolCards.slice(0, 7);
export const recentToolCards = [agentToolCard, featuredToolCards[2], toolCards[0]];
export const toolCategoryTabs = ['Image', 'Video', 'Utility'];

export const toolLibrarySections: CreationToolSection[] = [
  {
    id: 'image',
    title: 'Image Tools',
    icon: ImageIcon,
    cards: [featuredToolCards[0], featuredToolCards[2], toolCards[0], toolCards[1], toolCards[2], toolCards[8], toolCards[5], toolCards[4], toolCards[3]],
  },
  {
    id: 'video',
    title: 'Video Tools',
    icon: Video,
    cards: [featuredToolCards[1], toolCards[6], toolCards[7]],
  },
  {
    id: 'utility',
    title: 'Creative Utilities',
    icon: Sparkles,
    cards: [agentToolCard],
  },
];
