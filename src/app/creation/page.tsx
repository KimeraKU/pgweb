'use client';

import { useEffect, useRef, useState, type ChangeEvent, type ReactNode } from 'react';
import Image from 'next/image';
import {
  AudioLines,
  BookOpen,
  Box,
  CalendarDays,
  Check,
  ChevronRight,
  Crown,
  Download,
  RefreshCw,
  X,
  Eraser,
  FolderKanban,
  Globe2,
  Home,
  Image as ImageIcon,
  Infinity as InfinityIcon,
  LayoutGrid,
  LayoutTemplate,
  LockKeyhole,
  LogOut,
  Maximize,
  MoreHorizontal,
  Newspaper,
  PenTool,
  Pause,
  Play,
  Plus,
  Search,
  Send,
  Settings,
  Share2,
  Scissors,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  Trash2,
  UserRound,
  Video,
  Wand2,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type SectionId = 'home' | 'tools' | 'templates' | 'projects';

type SectionNavItem = {
  id: SectionId;
  label: string;
  description: string;
  icon: LucideIcon;
};

type HubCard = {
  name: string;
  description: string;
  icon: LucideIcon;
  href: string;
  tone: string;
  iconTone: string;
  status?: string;
};

type PromoCard = {
  title: string;
  description: string;
  kicker: string;
  tone: string;
  icon: LucideIcon;
};

type TemplateShowcaseSection = {
  title: string;
  description: string;
  tabs: string[];
  cards: TemplatePreviewCard[];
};

type TemplatePreviewCard = {
  name: string;
  duration?: string;
  tone: string;
  icon: LucideIcon;
};

type TemplateLibraryCategoryId = 'ai-video' | 'ai-image' | 'ecommerce-video' | 'avatar' | 'ai-voice' | 'design';

type TemplateLibraryItem = {
  title: string;
  filter: string;
  image: string;
  duration?: string;
  label?: string;
};

type TemplateLibraryCategory = {
  id: TemplateLibraryCategoryId;
  label: string;
  resultLabel: string;
  icon: LucideIcon;
  filters: string[];
  aspectClass: string;
  items: TemplateLibraryItem[];
};

type VoiceTemplate = {
  name: string;
  language: 'English' | 'Spanish';
  accent: string;
  gender: 'Male' | 'Female';
  sample: string;
  hideGenderTag?: boolean;
};

type AgentModeCard = {
  id: string;
  name: string;
  icon: LucideIcon;
  tone: string;
};

type AgentTemplateField =
  | {
      type: 'input';
      label: string;
      value: string;
      placeholder: string;
      maxLength?: number;
    }
  | {
      type: 'select';
      label: string;
      value: string;
      options: string[];
    };

type AgentTemplateCard = AgentModeCard & {
  description: string;
  image: string;
  templateImages?: Array<{
    name: string;
    url: string;
  }>;
  prompt: string;
  fields: AgentTemplateField[];
};

type AgentGroupCard = AgentModeCard & {
  children: AgentTemplateCard[];
};

type ProjectTaskType = 'Image' | 'Video' | 'Audio' | 'Design' | 'Agent Sessions' | 'Avatar';
type UploadTaskType = Extract<ProjectTaskType, 'Image' | 'Video' | 'Audio'>;
type GalleryGrouping = 'date' | 'flat';

type ProjectToolCategory =
  | 'AI Agent'
  | 'AI Image'
  | 'AI Video'
  | 'AI Voice'
  | 'AI Photo Editor'
  | 'E-commerce Video'
  | 'AI Avatar'
  | 'Design'
  | 'Background Remover'
  | 'My Upload';

type ProjectGalleryItem = {
  title: string;
  description: string;
  taskType: ProjectTaskType;
  tool: ProjectToolCategory;
  updatedAt: string;
  fileSize: string;
};

const sectionNavItems: SectionNavItem[] = [
  {
    id: 'home',
    label: 'Home',
    description: 'Agent, updates, tools, and content',
    icon: Home,
  },
  {
    id: 'tools',
    label: 'Tools',
    description: 'Focused editing utilities',
    icon: LayoutGrid,
  },
  {
    id: 'templates',
    label: 'Templates',
    description: 'Reusable creative layouts',
    icon: LayoutTemplate,
  },
  {
    id: 'projects',
    label: 'Projects',
    description: 'Saved work and drafts',
    icon: FolderKanban,
  },
];

const featuredToolCards: HubCard[] = [
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

const agentToolCard: HubCard = {
  name: 'AI Agent',
  description: 'Understand requests, analyze assets, and guide image, video, or editing tasks.',
  icon: Sparkles,
  href: '#',
  tone: 'bg-white',
  iconTone: 'text-slate-600',
};

const toolCards: HubCard[] = [
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

const recommendedFeatureTools = featuredToolCards.slice(0, 2);
const recommendedGridTools = toolCards.slice(0, 7);

const recentToolCards = [agentToolCard, featuredToolCards[2], toolCards[0]];

const toolCategoryTabs = ['Image', 'Video', 'Utility'];

const toolLibrarySections: Array<{ title: string; cards: HubCard[] }> = [
  {
    title: 'Image Tools',
    cards: [featuredToolCards[0], featuredToolCards[2], toolCards[0], toolCards[1], toolCards[2], toolCards[8], toolCards[5], toolCards[4], toolCards[3]],
  },
  {
    title: 'Video Tools',
    cards: [featuredToolCards[1], toolCards[6], toolCards[7]],
  },
  {
    title: 'Creative Utilities',
    cards: [agentToolCard],
  },
];

const templateCards: HubCard[] = [
  {
    name: 'Templates',
    description: 'Reuse design structures for fast production.',
    icon: LayoutTemplate,
    href: '#',
    tone: 'bg-white',
    iconTone: 'text-slate-600',
  },
  {
    name: 'Social Templates',
    description: 'Start from layouts for posts, stories, and campaigns.',
    icon: ImageIcon,
    href: '#',
    tone: 'bg-white',
    iconTone: 'text-slate-600',
  },
  {
    name: 'Video Templates',
    description: 'Use reusable structures for short-form video creation.',
    icon: Video,
    href: '#',
    tone: 'bg-white',
    iconTone: 'text-slate-600',
  },
  {
    name: 'E-commerce Templates',
    description: 'Prepare product visuals, ads, and store assets faster.',
    icon: ShoppingBag,
    href: '#',
    tone: 'bg-white',
    iconTone: 'text-slate-600',
  },
];

const voiceTemplates: VoiceTemplate[] = [
  {
    name: 'Ethan',
    language: 'English',
    accent: 'American English accent',
    gender: 'Male',
    hideGenderTag: true,
    sample: 'Hi, I am Ethan. Let us turn your next idea into a clear and engaging story.',
  },
  {
    name: 'Diego',
    language: 'Spanish',
    accent: 'Chilean Spanish accent',
    gender: 'Male',
    sample: 'Hola, soy Diego. Estoy listo para darle una voz natural y cercana a tu proyecto.',
  },
  {
    name: 'Mariana',
    language: 'Spanish',
    accent: 'Mexican Spanish accent',
    gender: 'Female',
    sample: 'Hola, soy Mariana. Hagamos que tu mensaje suene claro, cálido y memorable.',
  },
  {
    name: 'Lucia',
    language: 'Spanish',
    accent: 'Latin American Spanish accent',
    gender: 'Female',
    sample: 'Hola, soy Lucia. Puedo ayudarte a crear una narración natural para cualquier audiencia.',
  },
  {
    name: 'Valeria',
    language: 'Spanish',
    accent: 'Latin American Spanish accent',
    gender: 'Female',
    sample: 'Hola, soy Valeria. Demos vida a tu contenido con una voz expresiva y profesional.',
  },
  {
    name: 'Camila',
    language: 'Spanish',
    accent: 'Mexican Spanish accent',
    gender: 'Female',
    sample: 'Hola, soy Camila. Tu próxima historia puede sonar fresca, auténtica y fácil de recordar.',
  },
  {
    name: 'Sophie',
    language: 'English',
    accent: 'American English accent',
    gender: 'Female',
    sample: 'Hi, I am Sophie. I can give your content a warm, confident, and polished voice.',
  },
];

const templateLibraryCategories: TemplateLibraryCategory[] = [
  {
    id: 'ai-video',
    label: 'AI Video',
    resultLabel: 'AI Video templates',
    icon: Video,
    filters: ['Trending', 'Romance', 'Sports', 'Fantasy', 'Celebration', 'Pets'],
    aspectClass: 'aspect-[4/5]',
    items: [
      ['Heart Drift', 'Romance', 1, '12s'],
      ['Love Booth', 'Romance', 2, '15s'],
      ['Match Day', 'Sports', 3, '10s'],
      ['Super Dad', 'Celebration', 4, '15s'],
      ['The Final Hug', 'Romance', 5, '12s'],
      ['Kiss Cam', 'Sports', 6, '9s'],
      ['Tiny Fairy', 'Fantasy', 7, '8s'],
      ['Wish Pets', 'Pets', 8, '12s'],
      ['Survival Game', 'Fantasy', 9, '15s'],
      ['Courtside Cam', 'Sports', 10, '10s'],
      ["Mother's Day Card", 'Celebration', 11, '12s'],
      ['Midnight Kiss', 'Romance', 12, '9s'],
    ].map(([title, filter, image, duration]) => ({
      title: String(title),
      filter: String(filter),
      image: `/assets/creation/template-${Number(image)}.jpg`,
      duration: String(duration),
      label: 'Video',
    })),
  },
  {
    id: 'ai-image',
    label: 'AI Image',
    resultLabel: 'AI Image styles',
    icon: ImageIcon,
    filters: ['E-commerce', 'Hot', 'AI Yearbook', 'AI Light', 'Portrait', 'Product'],
    aspectClass: 'aspect-square',
    items: [
      ['Botanical Care', 'E-commerce', 13],
      ['Geometric Beauty', 'Product', 14],
      ['Fresh Clean', 'E-commerce', 15],
      ['Pure Green', 'Product', 16],
      ['Sky Hold', 'Hot', 17],
      ['Shadow Touch', 'AI Light', 18],
      ['Luxury Reveal', 'Product', 1],
      ['Bloom Scene', 'AI Light', 2],
      ['Scale Contrast', 'Hot', 3],
      ['Chair Display', 'E-commerce', 4],
      ['Retro Yearbook', 'AI Yearbook', 5],
      ['Editorial Portrait', 'Portrait', 6],
    ].map(([title, filter, image]) => ({
      title: String(title),
      filter: String(filter),
      image: `/assets/creation/template-${Number(image)}.jpg`,
      label: 'Image',
    })),
  },
  {
    id: 'ecommerce-video',
    label: 'E-commerce Video',
    resultLabel: 'E-commerce video templates',
    icon: ShoppingBag,
    filters: ['UGC Review', 'Product Demo', 'Unboxing', 'Before & After', 'Lifestyle'],
    aspectClass: 'aspect-[4/5]',
    items: [
      ['Real Results, Real Glow', 'UGC Review', 1, '15s'],
      ["Why I Can't Live Without This", 'UGC Review', 2, '18s'],
      ['Game Changer for Daily Cleaning', 'Product Demo', 3, '15s'],
      ['Best Coffee at Home', 'Product Demo', 4, '20s'],
      ['Sneakers That Do It All', 'Lifestyle', 5, '15s'],
      ['Small Size, Big Performance', 'Product Demo', 6, '12s'],
      ['Derm Approved & Loved', 'UGC Review', 7, '17s'],
      ['First Look Unboxing', 'Unboxing', 8, '20s'],
      ['Instant Room Refresh', 'Before & After', 9, '12s'],
      ['Everyday Carry', 'Lifestyle', 10, '15s'],
      ['One Step Upgrade', 'Before & After', 11, '12s'],
      ['Made for Busy Mornings', 'Lifestyle', 12, '18s'],
    ].map(([title, filter, image, duration]) => ({
      title: String(title),
      filter: String(filter),
      image: `/assets/creation/tool-${Number(image)}.jpg`,
      duration: String(duration),
      label: 'Ad format',
    })),
  },
  {
    id: 'avatar',
    label: 'AI Avatar',
    resultLabel: 'AI Avatar templates',
    icon: UserRound,
    filters: ['Lifestyle', 'Business', 'Fashion', 'Sports', 'Young Adult', 'Mature'],
    aspectClass: 'aspect-[3/4]',
    items: [
      ['Karen', 'Business', 1],
      ['Griffin', 'Business', 2],
      ['Darius', 'Lifestyle', 3],
      ['Everett', 'Mature', 4],
      ['Yoko', 'Fashion', 5],
      ['Camille', 'Young Adult', 6],
      ['Natalie', 'Lifestyle', 7],
      ['Kenji', 'Sports', 8],
      ['Lucas', 'Young Adult', 9],
      ['Alexandra', 'Fashion', 10],
      ['Audrey', 'Business', 11],
      ['Claire', 'Sports', 12],
    ].map(([title, filter, image]) => ({
      title: String(title),
      filter: String(filter),
      image: `/assets/creation/project-${Number(image)}.jpg`,
      label: 'Avatar',
    })),
  },
  {
    id: 'ai-voice',
    label: 'AI Voice',
    resultLabel: 'AI Voice templates',
    icon: AudioLines,
    filters: [],
    aspectClass: 'aspect-auto',
    items: [],
  },
  {
    id: 'design',
    label: 'Design',
    resultLabel: 'Design templates',
    icon: LayoutTemplate,
    filters: ['Marketing', 'Social', 'Planner', 'Creative', 'Moments', 'Festivals'],
    aspectClass: 'aspect-[4/5]',
    items: [
      ['Back to School Poster', 'Marketing', 7],
      ['Missing Pet Notice', 'Marketing', 8],
      ['Instagram Story Collage', 'Social', 9],
      ['Photo Dump', 'Social', 10],
      ['Weekly Planner', 'Planner', 11],
      ['Memory Journal', 'Planner', 12],
      ['Keep Calm Poster', 'Creative', 13],
      ['Editorial Collage', 'Creative', 14],
      ['Birthday Memories', 'Moments', 15],
      ['Family Album', 'Moments', 16],
      ['New Year Collage', 'Festivals', 17],
      ['Holiday Greeting', 'Festivals', 18],
    ].map(([title, filter, image]) => ({
      title: String(title),
      filter: String(filter),
      image: `/assets/creation/template-${Number(image)}.jpg`,
      label: 'Design',
    })),
  },
];

const projectTaskTabs: Array<'All' | ProjectTaskType> = ['All', 'Image', 'Video', 'Audio', 'Design', 'Agent Sessions', 'Avatar'];
const uploadTaskTabs: Array<'All' | UploadTaskType> = ['All', 'Image', 'Video', 'Audio'];

const projectToolFilters: Array<'All' | ProjectToolCategory> = [
  'All',
  'AI Agent',
  'AI Image',
  'AI Video',
  'AI Voice',
  'AI Photo Editor',
  'E-commerce Video',
  'AI Avatar',
  'Design',
  'Background Remover',
];

const projectItems: ProjectGalleryItem[] = [
  {
    title: 'Product showcase draft',
    description: 'E-commerce video concept with product close-ups and selling points.',
    taskType: 'Video',
    tool: 'E-commerce Video',
    updatedAt: 'Jun 10, 14:32',
    fileSize: '48.2 MB',
  },
  {
    title: 'Avatar try-on concept',
    description: 'Avatar-led visual task for creator and outfit testing.',
    taskType: 'Avatar',
    tool: 'AI Avatar',
    updatedAt: 'Jun 09, 18:06',
    fileSize: '32.8 MB',
  },
  {
    title: 'Clean product portrait',
    description: 'Photo edit project with product cleanup and image enhancement.',
    taskType: 'Image',
    tool: 'AI Photo Editor',
    updatedAt: 'Jun 09, 16:44',
    fileSize: '8.6 MB',
  },
  {
    title: 'UGC creator frame',
    description: 'Short video task built around creator review angles.',
    taskType: 'Video',
    tool: 'AI Video',
    updatedAt: 'Jun 09, 11:20',
    fileSize: '64.1 MB',
  },
  {
    title: 'Listing hero image',
    description: 'AI image generation for marketplace hero visuals.',
    taskType: 'Image',
    tool: 'AI Image',
    updatedAt: 'Jun 05, 20:18',
    fileSize: '12.4 MB',
  },
  {
    title: 'Background cleanup',
    description: 'Subject cutout and clean background preparation.',
    taskType: 'Image',
    tool: 'Background Remover',
    updatedAt: 'Jun 05, 10:12',
    fileSize: '5.7 MB',
  },
  {
    title: 'Agent campaign brief',
    description: 'Agent session for planning a campaign content package.',
    taskType: 'Agent Sessions',
    tool: 'AI Agent',
    updatedAt: 'Jun 04, 19:30',
    fileSize: '2.1 MB',
  },
  {
    title: 'Summer sale poster',
    description: 'Editable campaign poster with product, offer, and call-to-action layout.',
    taskType: 'Design',
    tool: 'Design',
    updatedAt: 'Jun 04, 18:54',
    fileSize: '6.8 MB',
  },
  {
    title: 'Product launch story',
    description: 'Vertical social story design for a new product launch campaign.',
    taskType: 'Design',
    tool: 'Design',
    updatedAt: 'Jun 04, 18:12',
    fileSize: '5.4 MB',
  },
  {
    title: 'Weekly content planner',
    description: 'Reusable weekly planning layout for social publishing and approvals.',
    taskType: 'Design',
    tool: 'Design',
    updatedAt: 'Jun 04, 17:46',
    fileSize: '4.9 MB',
  },
  {
    title: 'Short drama ad shot',
    description: 'Scripted product ad sequence for social video.',
    taskType: 'Video',
    tool: 'E-commerce Video',
    updatedAt: 'Jun 04, 17:08',
    fileSize: '72.5 MB',
  },
  {
    title: 'Product variant render',
    description: 'AI image output for product color and scene variants.',
    taskType: 'Image',
    tool: 'AI Image',
    updatedAt: 'Jun 04, 13:26',
    fileSize: '14.8 MB',
  },
  {
    title: 'Creator video hook',
    description: 'Opening hook project for a product creator video.',
    taskType: 'Video',
    tool: 'AI Video',
    updatedAt: 'Jun 04, 12:10',
    fileSize: '39.6 MB',
  },
  {
    title: 'Voiceover music bed',
    description: 'American English accent',
    taskType: 'Audio',
    tool: 'AI Voice',
    updatedAt: 'Jun 04, 10:45',
    fileSize: '11.3 MB',
  },
  {
    title: 'Diego',
    description: 'Chilean Spanish accent',
    taskType: 'Audio',
    tool: 'AI Voice',
    updatedAt: 'Jun 04, 10:22',
    fileSize: '8.4 MB',
  },
  {
    title: 'Mariana',
    description: 'Mexican Spanish accent',
    taskType: 'Audio',
    tool: 'AI Voice',
    updatedAt: 'Jun 04, 09:58',
    fileSize: '7.9 MB',
  },
  {
    title: 'Lucia',
    description: 'Latin American Spanish accent',
    taskType: 'Audio',
    tool: 'AI Voice',
    updatedAt: 'Jun 03, 18:40',
    fileSize: '9.1 MB',
  },
  {
    title: 'Valeria',
    description: 'Latin American Spanish accent',
    taskType: 'Audio',
    tool: 'AI Voice',
    updatedAt: 'Jun 03, 17:12',
    fileSize: '9.6 MB',
  },
  {
    title: 'Camila',
    description: 'Mexican Spanish accent',
    taskType: 'Audio',
    tool: 'AI Voice',
    updatedAt: 'Jun 03, 15:28',
    fileSize: '8.8 MB',
  },
  {
    title: 'Avatar presenter',
    description: 'AI avatar presenter task for product introduction.',
    taskType: 'Avatar',
    tool: 'AI Avatar',
    updatedAt: 'Jun 04, 09:22',
    fileSize: '28.4 MB',
  },
];

const uploadItems: ProjectGalleryItem[] = [
  {
    title: 'Uploaded product pack',
    description: 'Original product photos uploaded for editing and campaign generation.',
    taskType: 'Image',
    tool: 'My Upload',
    updatedAt: 'Jun 05, 09:46',
    fileSize: '24.9 MB',
  },
  {
    title: 'Uploaded campaign clips',
    description: 'Reference video clips uploaded for brand direction and reusable assets.',
    taskType: 'Video',
    tool: 'My Upload',
    updatedAt: 'Jun 05, 09:18',
    fileSize: '38.2 MB',
  },
  {
    title: 'Uploaded podcast clip',
    description: 'Original uploaded audio',
    taskType: 'Audio',
    tool: 'My Upload',
    updatedAt: 'Jun 04, 10:38',
    fileSize: '13.6 MB',
  },
];

const resourceCards: HubCard[] = [
  {
    name: 'Blog',
    description: 'Read product updates and creation workflow notes.',
    icon: Newspaper,
    href: '#',
    tone: 'bg-white',
    iconTone: 'text-slate-600',
  },
  {
    name: 'Price',
    description: 'Review plans, credits, and upgrade options.',
    icon: LockKeyhole,
    href: '#',
    tone: 'bg-white',
    iconTone: 'text-slate-600',
  },
  {
    name: 'Language',
    description: 'Switch language preferences for the workspace.',
    icon: Globe2,
    href: '#',
    tone: 'bg-white',
    iconTone: 'text-slate-600',
  },
];

const promoCards: PromoCard[] = [
  {
    title: 'Nano Banana 2 Lite is here',
    description: '4-second product image generation at a lower credit cost.',
    kicker: 'New model',
    tone: 'from-[#e8fbff] via-white to-[#fff7d6]',
    icon: Sparkles,
  },
  {
    title: 'Seedance 2.0 Mini is live',
    description: 'Generate compact social clips from product shots and scripts.',
    kicker: 'Video',
    tone: 'from-[#eff6ff] via-white to-[#e9fff3]',
    icon: Video,
  },
  {
    title: 'Creative image enhancer',
    description: 'Polish visuals with clearer details, cleaner scenes, and ready-to-use styles.',
    kicker: 'Workflow',
    tone: 'from-[#fff1f7] via-white to-[#eefbff]',
    icon: ShoppingBag,
  },
  {
    title: 'Brand-ready templates',
    description: 'Start from layouts built for campaigns, stores, and social posts.',
    kicker: 'Templates',
    tone: 'from-[#f4f7ff] via-white to-[#fff3e8]',
    icon: LayoutTemplate,
  },
  {
    title: '4K video experiments',
    description: 'Test sharper product motion and richer campaign previews.',
    kicker: 'Preview',
    tone: 'from-[#ecfeff] via-white to-[#f7f0ff]',
    icon: ImageIcon,
  },
];

const promoImagePaths = Array.from({ length: 5 }, (_, index) => `/assets/creation/promo-${index + 1}.jpg`);
const templateImagePaths = Array.from({ length: 18 }, (_, index) => `/assets/creation/template-${index + 1}.jpg`);
const toolImagePaths = Array.from({ length: 12 }, (_, index) => `/assets/creation/tool-${index + 1}.jpg`);
const projectImagePaths = Array.from({ length: 16 }, (_, index) => `/assets/creation/project-${index + 1}.jpg`);

function getStableImage(paths: string[], key: string) {
  const hash = Array.from(key).reduce((total, char) => total + char.charCodeAt(0), 0);
  return paths[hash % paths.length];
}

const templateShowcaseSections: TemplateShowcaseSection[] = [
  {
    title: 'Popular Ad Formats',
    description: 'Start with proven video ad styles for your product.',
    tabs: ['UGC Review', 'Lifestyle', 'Business', 'Fashion', 'Sports', 'Arts'],
    cards: [
      {
        name: 'UGC Seeding',
        duration: '15s',
        tone: 'from-[#f8d7b5] via-[#d9f4ff] to-[#1f2937]',
        icon: UserRound,
      },
      {
        name: 'Product Spotlight',
        duration: '15s',
        tone: 'from-[#111827] via-[#334155] to-[#fef3c7]',
        icon: Sparkles,
      },
      {
        name: 'Unboxing Demo',
        duration: '15s',
        tone: 'from-[#f8fafc] via-[#e2e8f0] to-[#b08968]',
        icon: Box,
      },
      {
        name: 'How-to Review',
        duration: '15s',
        tone: 'from-[#c7d2fe] via-[#f5f3ff] to-[#f97316]',
        icon: Video,
      },
      {
        name: 'Outdoor Lifestyle',
        duration: '15s',
        tone: 'from-[#bbf7d0] via-[#fde68a] to-[#0f766e]',
        icon: ImageIcon,
      },
      {
        name: 'Product Close-up',
        duration: '15s',
        tone: 'from-[#e5e7eb] via-[#f8fafc] to-[#64748b]',
        icon: Maximize,
      },
      {
        name: 'Studio Demo',
        duration: '15s',
        tone: 'from-[#fef9c3] via-[#fff7ed] to-[#fb923c]',
        icon: Video,
      },
      {
        name: 'Founder Story',
        duration: '30s',
        tone: 'from-[#e0f2fe] via-white to-[#7dd3fc]',
        icon: UserRound,
      },
      {
        name: 'Before After Reel',
        duration: '12s',
        tone: 'from-[#fce7f3] via-white to-[#f0abfc]',
        icon: Wand2,
      },
      {
        name: 'Product Compare',
        duration: '18s',
        tone: 'from-[#dcfce7] via-white to-[#86efac]',
        icon: LayoutGrid,
      },
      {
        name: 'Street Interview',
        duration: '20s',
        tone: 'from-[#ede9fe] via-white to-[#a78bfa]',
        icon: UserRound,
      },
      {
        name: 'Holiday Promo',
        duration: '15s',
        tone: 'from-[#fee2e2] via-[#fff7ed] to-[#fca5a5]',
        icon: Sparkles,
      },
    ],
  },
  {
    title: 'Product Image Sets',
    description: 'Build complete product visuals from reusable layouts.',
    tabs: ['Listing', 'Hero', 'Detail', 'Bundle', 'Seasonal', 'Before/After'],
    cards: [
      {
        name: 'Amazon Listing',
        tone: 'from-[#ecfeff] via-white to-[#bae6fd]',
        icon: ShoppingBag,
      },
      {
        name: 'Hero Banner',
        tone: 'from-[#fff7ed] via-white to-[#fed7aa]',
        icon: ImageIcon,
      },
      {
        name: 'A+ Detail Page',
        tone: 'from-[#f5f3ff] via-white to-[#ddd6fe]',
        icon: Newspaper,
      },
      {
        name: 'Bundle Pack',
        tone: 'from-[#f0fdf4] via-white to-[#bbf7d0]',
        icon: Box,
      },
      {
        name: 'Sale Campaign',
        tone: 'from-[#fff1f2] via-white to-[#fecdd3]',
        icon: Sparkles,
      },
      {
        name: 'Before & After',
        tone: 'from-[#f8fafc] via-white to-[#cbd5e1]',
        icon: Wand2,
      },
      {
        name: 'Ingredient Callout',
        tone: 'from-[#ecfdf5] via-white to-[#a7f3d0]',
        icon: Sparkles,
      },
      {
        name: 'Comparison Grid',
        tone: 'from-[#eef2ff] via-white to-[#c7d2fe]',
        icon: LayoutGrid,
      },
      {
        name: 'Social Story',
        tone: 'from-[#fdf2f8] via-white to-[#fbcfe8]',
        icon: ImageIcon,
      },
      {
        name: 'Store Poster',
        tone: 'from-[#fffbeb] via-white to-[#fde68a]',
        icon: Newspaper,
      },
      {
        name: 'Launch Set',
        tone: 'from-[#f0f9ff] via-white to-[#bae6fd]',
        icon: Box,
      },
      {
        name: 'Retargeting Ad',
        tone: 'from-[#fff1f2] via-white to-[#fda4af]',
        icon: ShoppingBag,
      },
    ],
  },
  {
    title: 'Creator Video Starters',
    description: 'Use short-form structures for reviews, demos, and social ads.',
    tabs: ['Review', 'Demo', 'Hook', 'Tutorial', 'App Promo', 'Testimonial'],
    cards: [
      {
        name: 'Problem Hook',
        duration: '12s',
        tone: 'from-[#fee2e2] via-[#fef3c7] to-[#fca5a5]',
        icon: Video,
      },
      {
        name: 'Step-by-step',
        duration: '20s',
        tone: 'from-[#dbeafe] via-white to-[#93c5fd]',
        icon: BookOpen,
      },
      {
        name: 'Creator Review',
        duration: '15s',
        tone: 'from-[#fce7f3] via-white to-[#f9a8d4]',
        icon: UserRound,
      },
      {
        name: 'Feature Demo',
        duration: '18s',
        tone: 'from-[#dcfce7] via-white to-[#86efac]',
        icon: LayoutGrid,
      },
      {
        name: 'App Promo',
        duration: '15s',
        tone: 'from-[#e0e7ff] via-white to-[#a5b4fc]',
        icon: Maximize,
      },
      {
        name: 'UGC Testimonial',
        duration: '15s',
        tone: 'from-[#ffedd5] via-white to-[#fdba74]',
        icon: Sparkles,
      },
      {
        name: 'Fast Hook',
        duration: '8s',
        tone: 'from-[#fef2f2] via-white to-[#f87171]',
        icon: Video,
      },
      {
        name: 'Voiceover Demo',
        duration: '18s',
        tone: 'from-[#ecfeff] via-white to-[#67e8f9]',
        icon: UserRound,
      },
      {
        name: 'Split Screen',
        duration: '15s',
        tone: 'from-[#f5f3ff] via-white to-[#c4b5fd]',
        icon: LayoutGrid,
      },
      {
        name: 'Product Routine',
        duration: '25s',
        tone: 'from-[#f0fdf4] via-white to-[#86efac]',
        icon: ShoppingBag,
      },
      {
        name: 'Lifestyle Cut',
        duration: '15s',
        tone: 'from-[#fff7ed] via-white to-[#fdba74]',
        icon: ImageIcon,
      },
      {
        name: 'End Card CTA',
        duration: '6s',
        tone: 'from-[#f8fafc] via-white to-[#94a3b8]',
        icon: Maximize,
      },
    ],
  },
];

const sectionMeta: Record<SectionId, { eyebrow: string; title: string; description: string }> = {
  home: {
    eyebrow: 'Home',
    title: 'Create from one focused hub',
    description: 'Start with the agent, scan creative updates, then jump into the right standalone tool page.',
  },
  tools: {
    eyebrow: 'Tools',
    title: 'Open a focused editing tool',
    description: 'Utility tools stay discoverable here, while their actual workspaces remain independent pages.',
  },
  templates: {
    eyebrow: 'Templates',
    title: 'Start from a reusable layout',
    description: 'Template entries live separately from tools so creation utilities stay easier to scan.',
  },
  projects: {
    eyebrow: 'Projects',
    title: 'Manage saved work and drafts',
    description: 'Continue projects without mixing project management into the creation tool list.',
  },
};

export default function CreationPage() {
  const [activeSection, setActiveSection] = useState<SectionId>('home');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const activeMeta = sectionMeta[activeSection];

  return (
    <main className="min-h-screen bg-[#f6f8fb] text-slate-950">
      <div className="flex min-h-screen flex-col md:flex-row">
        <CreationSidebar
          activeSection={activeSection}
          isCollapsed={isSidebarCollapsed}
          onSectionChange={setActiveSection}
          onToggleCollapse={() => setIsSidebarCollapsed((value) => !value)}
        />

        <section
          className={`min-w-0 flex-1 bg-white px-4 py-3 transition-[margin] duration-300 sm:px-5 lg:px-6 ${
            isSidebarCollapsed ? 'md:ml-[84px]' : 'md:ml-[248px]'
          }`}
        >
          {activeSection === 'home' ? null : (
            <div className="mx-auto mb-3 flex w-full max-w-7xl items-center justify-between gap-3">
              {activeSection === 'projects' ? <span /> : <PageTitle title={activeMeta.eyebrow} />}
              <CreationAccountMenu />
            </div>
          )}

          <div className="mx-auto flex w-full min-w-0 max-w-7xl flex-col gap-4">
            {activeSection === 'home' ? (
              <HomePanel onSectionChange={setActiveSection} accountSlot={<CreationAccountMenu />} />
            ) : activeSection === 'tools' ? (
              <ToolsLibraryPanel />
            ) : activeSection === 'templates' ? (
              <TemplatesLibraryPanel />
            ) : activeSection === 'projects' ? (
              <ProjectsPanel onSectionChange={setActiveSection} />
            ) : (
              <>
                <SectionHeader eyebrow={activeMeta.eyebrow} title={activeMeta.title} description={activeMeta.description} />
                <SectionPanel activeSection={activeSection} />
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function CreationAccountMenu() {
  const [isCreditsOpen, setIsCreditsOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
        setIsAccountOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsAccountOpen(false);
    };

    document.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div ref={accountMenuRef} className="relative z-40 flex w-fit items-center justify-end gap-2.5">
      <div
        className="relative"
        onMouseEnter={() => {
          setIsAccountOpen(false);
          setIsCreditsOpen(true);
        }}
        onMouseLeave={() => setIsCreditsOpen(false)}
        onFocus={() => setIsCreditsOpen(true)}
        onBlur={(event) => {
          if (!(event.relatedTarget instanceof Node) || !event.currentTarget.contains(event.relatedTarget)) {
            setIsCreditsOpen(false);
          }
        }}
      >
        <button
          type="button"
          aria-label="6,234 credits. Add credits"
          aria-expanded={isCreditsOpen}
          className="group flex h-10 items-center gap-2 rounded-full bg-white py-1 pl-3 pr-1.5 text-slate-900 shadow-[0_6px_16px_rgba(15,23,42,0.04)] ring-1 ring-[#eceeef] transition hover:shadow-[0_9px_22px_rgba(15,23,42,0.09)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2fbfc7]"
        >
          <Sparkles className="h-5 w-5 shrink-0 fill-current text-[#ff9f17]" strokeWidth={2.4} />
          <span className="text-lg font-bold leading-none tracking-normal text-[#383d40] tabular-nums">6,234</span>
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#35bdc7] text-white transition group-hover:bg-[#2aafb8]">
            <Plus className="h-[18px] w-[18px]" strokeWidth={2} />
          </span>
        </button>

        <div
          data-testid="creation-account-hover-card"
          className={`absolute right-0 top-full w-[min(88vw,300px)] pt-3 transition duration-200 ${
            isCreditsOpen ? 'visible pointer-events-auto translate-y-0 opacity-100' : 'invisible pointer-events-none translate-y-2 opacity-0'
          }`}
        >
          <div className="overflow-hidden rounded-[20px] bg-white text-left shadow-[0_20px_54px_rgba(15,23,42,0.16)] ring-1 ring-slate-100">
            <div className="relative h-[112px] overflow-hidden bg-[radial-gradient(circle_at_64%_28%,#fff8d9_0%,#fff3c0_20%,transparent_43%),linear-gradient(110deg,#ffb494_0%,#fff9ec_48%,#ffba70_100%)] px-6 py-6">
              <span className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(255,255,255,0.72)_0%,transparent_32%),radial-gradient(circle_at_82%_76%,rgba(255,255,255,0.46)_0%,transparent_28%)] opacity-80" />
              <span className="absolute inset-0 opacity-[0.16] [background-image:linear-gradient(90deg,rgba(255,255,255,.5)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,.5)_1px,transparent_1px)] [background-size:3px_3px]" />
              <div className="relative">
                <p className="text-base font-semibold leading-none text-[#817b75]">Total purchased credits</p>
                <div className="mt-5 flex items-center gap-3">
                  <Sparkles className="h-8 w-8 shrink-0 fill-current text-[#ff9f17]" strokeWidth={2.5} />
                  <span className="text-[40px] font-bold leading-none tracking-normal text-[#464649] tabular-nums">6,234</span>
                </div>
              </div>
            </div>

            <div className="px-5 py-5">
              <a href="#" className="flex min-h-8 items-center justify-between gap-4 text-lg font-semibold text-[#50575a] transition hover:text-slate-950">
                <span>Usage details</span>
                <ChevronRight className="h-6 w-6 shrink-0" strokeWidth={2.6} />
              </a>
              <button
                type="button"
                className="mt-5 flex h-12 w-full items-center justify-center rounded-[14px] bg-[#191b1b] px-5 text-lg font-bold leading-none text-white transition hover:bg-slate-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb52f] focus-visible:ring-offset-2"
              >
                Get more credits
              </button>
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        aria-label="Open Feng Lin account"
        aria-haspopup="menu"
        aria-expanded={isAccountOpen}
        onClick={() => {
          setIsCreditsOpen(false);
          setIsAccountOpen((value) => !value);
        }}
        className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-[#fff0bd] ring-1 ring-[#f4e8bf] transition hover:shadow-[0_8px_18px_rgba(15,23,42,0.12)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2fbfc7]"
      >
        <img src="/login-hero-woman.png" alt="Feng Lin" className="h-full w-full scale-[1.85] object-cover object-[58%_42%]" />
      </button>

      <div
        role="menu"
        data-testid="creation-profile-menu"
        className={`absolute right-0 top-full w-[210px] pt-3 transition duration-150 ${
          isAccountOpen ? 'visible pointer-events-auto translate-y-0 opacity-100' : 'invisible pointer-events-none translate-y-1 opacity-0'
        }`}
      >
        <div className="rounded-[18px] bg-white p-4 text-left shadow-[0_18px_46px_rgba(15,23,42,0.15)] ring-1 ring-slate-100">
          <p className="truncate text-sm font-semibold text-[#9ca1a3]">demo@photogrid.com</p>
          <button
            type="button"
            role="menuitem"
            aria-label="Plan, current plan Free"
            className="mt-3 flex h-10 w-full items-center gap-3 rounded-[8px] px-1 text-base font-semibold text-[#505657] transition hover:bg-slate-50 hover:text-slate-950"
          >
            <Crown className="h-6 w-6 shrink-0" strokeWidth={2} />
            <span>Plan</span>
            <span className="ml-auto text-sm font-semibold text-[#9ca1a3]">Free</span>
          </button>
          <button type="button" role="menuitem" className="mt-1 flex h-10 w-full items-center gap-3 rounded-[8px] px-1 text-base font-semibold text-[#505657] transition hover:bg-slate-50 hover:text-slate-950">
            <Settings className="h-6 w-6 shrink-0" strokeWidth={2} />
            <span>Settings</span>
          </button>
          <button type="button" role="menuitem" className="mt-1 flex h-10 w-full items-center gap-3 rounded-[8px] px-1 text-base font-semibold text-[#505657] transition hover:bg-slate-50 hover:text-slate-950">
            <LogOut className="h-6 w-6 shrink-0" strokeWidth={2} />
            <span>Log out</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function PageTitle({ title }: { title: string }) {
  return (
    <header className="flex min-w-0 items-center">
      <h1 className="text-[15px] font-semibold tracking-tight text-slate-950">{title}</h1>
    </header>
  );
}

function SectionHeader({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div className="min-w-0 rounded-[18px] bg-slate-50 px-5 py-5 ring-1 ring-slate-200">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-600">{eyebrow}</p>
      <h1 className="mt-2 text-[28px] font-semibold leading-tight tracking-tight text-slate-950 sm:text-[38px]">{title}</h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">{description}</p>
    </div>
  );
}

function HomePanel({ onSectionChange, accountSlot }: { onSectionChange: (section: SectionId) => void; accountSlot?: ReactNode }) {
  return (
    <div className="grid min-w-0 gap-5">
      <div className="relative min-w-0">
        {accountSlot ? <div className="mb-4 flex justify-end 2xl:absolute 2xl:right-0 2xl:top-0 2xl:mb-0">{accountSlot}</div> : null}
        <AgentEntryPrototype />
      </div>
      <OperationsBlock />
      <HomeToolsBlock onSectionChange={onSectionChange} />
      <TemplateShowcaseBlocks />
    </div>
  );
}

function OperationsBlock() {
  return (
    <section aria-labelledby="operations-updates" className="min-w-0">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 id="operations-updates" className="text-xl font-semibold tracking-tight text-slate-950">
          What&apos;s new
        </h2>
      </div>

      <div className="flex min-w-0 gap-3 overflow-x-auto pb-1 scrollbar-hide">
        {promoCards.map((item, index) => {
          return (
            <a
              key={item.title}
              href="#"
              className="group relative h-[150px] w-[360px] shrink-0 overflow-hidden rounded-[14px] bg-slate-100 ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(15,23,42,0.08)]"
            >
              <img
                src={promoImagePaths[index % promoImagePaths.length]}
                alt=""
                className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-slate-950/72 via-slate-950/16 to-transparent" />
              <span className="absolute right-3 top-3 rounded-full bg-white/28 px-2.5 py-1 text-[11px] font-semibold text-white shadow-sm backdrop-blur-md ring-1 ring-white/25">
                {item.kicker}
              </span>
              <span className="absolute inset-x-3 bottom-3">
                <span className="line-clamp-2 text-[17px] font-semibold leading-5 text-white">{item.title}</span>
              </span>
            </a>
          );
        })}
      </div>
    </section>
  );
}

function HomeToolsBlock({ onSectionChange }: { onSectionChange: (section: SectionId) => void }) {
  return (
    <section aria-labelledby="home-tools" className="min-w-0">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 id="home-tools" className="text-xl font-semibold tracking-tight text-slate-950">
          Recommended tools
        </h2>
      </div>

      <div className="grid min-w-0 gap-2.5 xl:grid-cols-[240px_240px_minmax(0,1fr)]">
        {recommendedFeatureTools.map((tool, index) => (
          <RecommendedFeatureCard key={tool.name} tool={tool} index={index} />
        ))}
        <div className="grid min-w-0 overflow-hidden rounded-[18px] bg-slate-50 ring-1 ring-slate-200 sm:grid-cols-2 lg:grid-cols-4">
          {recommendedGridTools.map((tool) => (
            <RecommendedGridCell key={tool.name} tool={tool} />
          ))}
          <RecommendedMoreCell onClick={() => onSectionChange('tools')} />
        </div>
      </div>
    </section>
  );
}

function RecommendedFeatureCard({ tool, index }: { tool: HubCard; index: number }) {
  const Icon = tool.icon;
  const tones = ['bg-[linear-gradient(135deg,#ecfeff_0%,#ffffff_72%)]', 'bg-[linear-gradient(135deg,#f7fee7_0%,#ffffff_72%)]'];

  return (
    <a
      href={tool.href}
      className={`group flex min-h-[148px] min-w-0 flex-col justify-between rounded-[18px] ${tones[index] ?? 'bg-white'} p-5 ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(15,23,42,0.08)]`}
    >
      <span>
        <span className="flex items-center gap-2">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] bg-white/70 text-slate-800 ring-1 ring-slate-200 transition group-hover:text-[#2fbfc7]">
            <Icon className="h-4 w-4" />
          </span>
          <span className="block truncate text-lg font-semibold tracking-tight text-slate-950">{tool.name}</span>
        </span>
        <span className="mt-1 line-clamp-2 block text-xs leading-5 text-slate-500">{tool.description}</span>
      </span>
    </a>
  );
}

function RecommendedGridCell({ tool }: { tool: HubCard }) {
  const Icon = tool.icon;

  return (
    <a
      href={tool.href}
      className="group relative flex min-h-[68px] min-w-0 items-center gap-2.5 border-slate-200 bg-slate-50 px-4 text-left ring-0 transition hover:bg-white sm:border-r sm:border-b lg:[&:nth-child(4n)]:border-r-0 lg:[&:nth-child(n+5)]:border-b-0"
    >
      <Icon className="h-5 w-5 shrink-0 text-slate-800 transition group-hover:text-[#2fbfc7]" />
      <span className="truncate text-sm font-semibold text-slate-950">{tool.name}</span>
      {tool.status ? (
        <span className="absolute right-3 top-2.5 rounded-full bg-white px-1.5 py-0.5 text-[9px] font-semibold text-slate-400 ring-1 ring-slate-200">
          {tool.status}
        </span>
      ) : null}
    </a>
  );
}

function RecommendedMoreCell({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative flex min-h-[68px] min-w-0 items-center gap-2.5 border-slate-200 bg-slate-50 px-4 text-left ring-0 transition hover:bg-white sm:border-r sm:border-b lg:[&:nth-child(4n)]:border-r-0 lg:[&:nth-child(n+5)]:border-b-0"
    >
      <MoreHorizontal className="h-5 w-5 shrink-0 text-slate-800 transition group-hover:text-[#2fbfc7]" />
      <span className="truncate text-sm font-semibold text-slate-950">More</span>
    </button>
  );
}

function TemplateShowcaseBlocks() {
  const [activeTemplateIndex, setActiveTemplateIndex] = useState(0);
  const scrollToTemplateSection = (index: number) => {
    setActiveTemplateIndex(index);
    document.getElementById(`template-flow-${index}`)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  return (
    <section className="min-w-0" aria-labelledby="template-showcase">
      <div className="mb-3 flex gap-2 overflow-x-auto pb-1 scrollbar-hide" role="tablist" aria-label="Template categories">
        {templateShowcaseSections.map((section, index) => (
          <button
            key={section.title}
            type="button"
            role="tab"
            aria-selected={activeTemplateIndex === index}
            onClick={() => scrollToTemplateSection(index)}
            className={`h-9 shrink-0 rounded-full px-4 text-sm font-semibold transition ${
              activeTemplateIndex === index ? 'bg-[#2fbfc7] text-white shadow-[0_10px_22px_rgba(47,191,199,0.2)]' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {section.title}
          </button>
        ))}
      </div>

      <div className="grid min-w-0 gap-5">
        {templateShowcaseSections.map((section, index) => (
          <TemplateFlowBlock key={section.title} section={section} sectionIndex={index} />
        ))}
      </div>
    </section>
  );
}

function TemplateFlowBlock({ section, sectionIndex }: { section: TemplateShowcaseSection; sectionIndex: number }) {
  return (
    <div
      id={`template-flow-${sectionIndex}`}
      className="grid min-w-0 scroll-mt-4 gap-4 rounded-[22px] bg-slate-50 p-4 ring-1 ring-slate-100 lg:grid-cols-[220px_minmax(0,1fr)]"
    >
      <div className="flex min-h-[250px] flex-col justify-center px-3">
        <h2 id="template-showcase" className="text-2xl font-semibold tracking-tight text-slate-950">
          {section.title}
        </h2>
        <p className="mt-3 max-w-[180px] text-base font-semibold leading-6 text-slate-400">{section.description}</p>
        <div className="mt-9 flex gap-3">
          <button
            type="button"
            aria-label="Previous template set"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-400 ring-1 ring-slate-200 transition hover:text-slate-950"
          >
            <ChevronRight className="h-5 w-5 rotate-180" />
          </button>
          <button
            type="button"
            aria-label="Next template set"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-700 ring-1 ring-slate-200 transition hover:text-[#2fbfc7]"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="flex min-w-0 gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {section.cards.map((card, index) => (
          <TemplateFlowCard key={`${section.title}-${card.name}`} card={card} sectionIndex={sectionIndex} index={index} />
        ))}
      </div>
    </div>
  );
}

function TemplateFlowCard({
  card,
  sectionIndex,
  index,
}: {
  card: TemplatePreviewCard;
  sectionIndex: number;
  index: number;
}) {
  const widthClass = index % 5 === 0 ? 'w-[260px]' : index % 5 === 1 ? 'w-[255px]' : index % 5 === 2 ? 'w-[260px]' : index % 5 === 3 ? 'w-[260px]' : 'w-[250px]';
  const imageSrc = templateImagePaths[(sectionIndex * 6 + index) % templateImagePaths.length];

  return (
    <a
      href="#"
      className={`group relative h-[250px] ${widthClass} shrink-0 overflow-hidden rounded-[12px] bg-slate-100 ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(15,23,42,0.12)]`}
    >
      <img src={imageSrc} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />
      <span className="absolute inset-0 bg-gradient-to-t from-slate-950/64 via-slate-950/12 to-transparent" />
      <div className="absolute inset-0">
        <button
          type="button"
          className="absolute inset-x-6 bottom-12 h-11 rounded-[10px] bg-slate-950/48 text-sm font-semibold text-white opacity-0 backdrop-blur-sm transition group-hover:bg-[#2fbfc7] group-hover:opacity-100"
        >
          Use same style
        </button>
      </div>
      <div className="absolute inset-x-0 bottom-0 px-5 py-4">
        <p className="truncate text-base font-semibold text-white">{card.name}</p>
      </div>
    </a>
  );
}

function TemplatesLibraryPanel() {
  const [activeCategoryId, setActiveCategoryId] = useState<TemplateLibraryCategoryId>('ai-video');
  const [activeFilter, setActiveFilter] = useState('All');
  const [query, setQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<{ item: TemplateLibraryItem; category: TemplateLibraryCategory } | null>(null);
  const activeCategory = templateLibraryCategories.find((category) => category.id === activeCategoryId) ?? templateLibraryCategories[0];
  const normalizedQuery = query.trim().toLowerCase();
  const filteredItems = activeCategory.items.filter((item) => {
    const matchesFilter = activeFilter === 'All' || item.filter === activeFilter;
    const matchesQuery = !normalizedQuery || item.title.toLowerCase().includes(normalizedQuery) || item.filter.toLowerCase().includes(normalizedQuery);
    return matchesFilter && matchesQuery;
  });

  const selectCategory = (category: TemplateLibraryCategory) => {
    setActiveCategoryId(category.id);
    setActiveFilter('All');
    setQuery('');
    setSelectedTemplate(null);
  };

  return (
    <section className="min-w-0 pb-8" aria-label="Templates">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-6" role="tablist" aria-label="Template types">
        {templateLibraryCategories.map((category) => {
          const Icon = category.icon;
          const isActive = category.id === activeCategory.id;

          return (
            <button
              key={category.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => selectCategory(category)}
              className={`flex h-12 min-w-0 items-center gap-2.5 rounded-[10px] px-3 text-left transition ring-1 ${
                isActive
                  ? 'bg-[#eafcfd] text-slate-950 ring-[#72d8de]'
                  : 'bg-slate-50 text-slate-600 ring-slate-200 hover:bg-white hover:text-slate-950'
              }`}
            >
              <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] ${isActive ? 'bg-[#35c3cb] text-white' : 'bg-white text-slate-500 ring-1 ring-slate-200'}`}>
                <Icon className="h-4 w-4" />
              </span>
              <span className="truncate text-sm font-semibold">{category.label}</span>
            </button>
          );
        })}
      </div>

      {activeCategory.id === 'ai-voice' ? (
        <VoiceTemplateLibrary />
      ) : (
        <>
      <div className="mt-4 flex min-w-0 flex-col gap-3 border-b border-slate-200 pb-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 gap-1.5 overflow-x-auto pb-1 scrollbar-hide" role="tablist" aria-label={`${activeCategory.label} categories`}>
          {['All', ...activeCategory.filters].map((filter) => (
            <button
              key={filter}
              type="button"
              role="tab"
              aria-selected={activeFilter === filter}
              onClick={() => setActiveFilter(filter)}
              className={`h-8 shrink-0 rounded-full px-3 text-xs font-semibold transition ${
                activeFilter === filter ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-950'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <label className="relative block w-full shrink-0 lg:w-[280px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={`Search ${activeCategory.label}`}
            className="h-9 w-full rounded-[8px] bg-slate-50 pl-9 pr-3 text-sm text-slate-800 outline-none ring-1 ring-slate-200 transition placeholder:text-slate-400 focus:bg-white focus:ring-[#2fbfc7]"
          />
        </label>
      </div>

      {filteredItems.length ? (
        <div className="mt-5 min-w-0 columns-2 gap-3 sm:columns-3 lg:columns-4 xl:columns-5">
          {filteredItems.map((item, index) => (
            <TemplateLibraryCard
              key={`${activeCategory.id}-${item.title}`}
              item={item}
              category={activeCategory}
              index={index}
              onOpen={() => setSelectedTemplate({ item, category: activeCategory })}
            />
          ))}
        </div>
      ) : (
        <div className="mt-5 flex min-h-[280px] flex-col items-center justify-center rounded-[12px] bg-slate-50 text-center ring-1 ring-slate-200">
          <Search className="h-6 w-6 text-slate-300" />
          <p className="mt-3 text-sm font-semibold text-slate-700">No templates found</p>
          <button
            type="button"
            onClick={() => {
              setActiveFilter('All');
              setQuery('');
            }}
            className="mt-3 text-sm font-semibold text-[#2fbfc7]"
          >
            Clear filters
          </button>
        </div>
      )}
      {selectedTemplate ? (
        <TemplateDetailModal
          item={selectedTemplate.item}
          category={selectedTemplate.category}
          onClose={() => setSelectedTemplate(null)}
        />
      ) : null}
        </>
      )}
    </section>
  );
}

function VoiceTemplateLibrary() {
  const [language, setLanguage] = useState('All');
  const [accent, setAccent] = useState('All');
  const [gender, setGender] = useState('All');
  const [voiceQuery, setVoiceQuery] = useState('');
  const [selectedVoiceName, setSelectedVoiceName] = useState('Ethan');
  const [playingVoiceName, setPlayingVoiceName] = useState<string | null>(null);
  const accents = Array.from(new Set(voiceTemplates.map((voice) => voice.accent)));
  const normalizedVoiceQuery = voiceQuery.trim().toLowerCase();
  const filteredVoices = voiceTemplates.filter((voice) => {
    const matchesLanguage = language === 'All' || voice.language === language;
    const matchesAccent = accent === 'All' || voice.accent === accent;
    const matchesGender = gender === 'All' || voice.gender === gender;
    const matchesQuery = !normalizedVoiceQuery || `${voice.name} ${voice.language} ${voice.accent} ${voice.gender}`.toLowerCase().includes(normalizedVoiceQuery);
    return matchesLanguage && matchesAccent && matchesGender && matchesQuery;
  });

  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, []);

  const toggleVoicePlayback = (voice: VoiceTemplate) => {
    if (!('speechSynthesis' in window)) return;

    if (playingVoiceName === voice.name) {
      window.speechSynthesis.cancel();
      setPlayingVoiceName(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(voice.sample);
    utterance.lang = voice.language === 'Spanish' ? 'es-MX' : 'en-US';
    utterance.pitch = voice.gender === 'Female' ? 1.08 : 0.94;
    utterance.rate = 0.95;
    const languagePrefix = voice.language === 'Spanish' ? 'es' : 'en';
    const matchingVoice = window.speechSynthesis.getVoices().find((candidate) => candidate.lang.toLowerCase().startsWith(languagePrefix));
    if (matchingVoice) utterance.voice = matchingVoice;
    utterance.onend = () => setPlayingVoiceName((current) => (current === voice.name ? null : current));
    utterance.onerror = () => setPlayingVoiceName((current) => (current === voice.name ? null : current));
    setSelectedVoiceName(voice.name);
    setPlayingVoiceName(voice.name);
    window.speechSynthesis.speak(utterance);
  };

  const selectClassName = "h-10 w-full appearance-none rounded-[10px] bg-white px-3 pr-9 text-sm font-medium text-slate-600 outline-none ring-1 ring-slate-200 transition hover:ring-slate-300 focus:ring-2 focus:ring-[#35c3cb]";

  return (
    <div className="mt-4 min-w-0">
      <div className="grid min-w-0 gap-3 border-b border-slate-200 pb-4 sm:grid-cols-2 xl:grid-cols-[160px_160px_160px_minmax(220px,1fr)]">
        <label className="relative block">
          <span className="sr-only">Language</span>
          <select value={language} onChange={(event) => setLanguage(event.target.value)} className={selectClassName}>
            <option value="All">Language</option>
            <option value="English">English</option>
            <option value="Spanish">Spanish</option>
          </select>
          <ChevronRight className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 rotate-90 text-slate-400" />
        </label>

        <label className="relative block">
          <span className="sr-only">Accents</span>
          <select value={accent} onChange={(event) => setAccent(event.target.value)} className={selectClassName}>
            <option value="All">Accents</option>
            {accents.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <ChevronRight className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 rotate-90 text-slate-400" />
        </label>

        <label className="relative block">
          <span className="sr-only">Gender</span>
          <select value={gender} onChange={(event) => setGender(event.target.value)} className={selectClassName}>
            <option value="All">Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          <ChevronRight className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 rotate-90 text-slate-400" />
        </label>

        <label className="relative block sm:col-span-2 xl:col-span-1 xl:ml-auto xl:w-[320px]">
          <span className="sr-only">Search voices</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={voiceQuery}
            onChange={(event) => setVoiceQuery(event.target.value)}
            placeholder="Search voices..."
            className="h-10 w-full rounded-[10px] bg-white pl-9 pr-3 text-sm text-slate-800 outline-none ring-1 ring-slate-200 transition placeholder:text-slate-400 hover:ring-slate-300 focus:ring-2 focus:ring-[#35c3cb]"
          />
        </label>
      </div>

      {filteredVoices.length ? (
        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3" role="listbox" aria-label="AI voices">
          {filteredVoices.map((voice) => {
            const isSelected = selectedVoiceName === voice.name;
            const isPlaying = playingVoiceName === voice.name;
            return (
              <article
                key={voice.name}
                role="option"
                aria-selected={isSelected}
                tabIndex={0}
                onClick={() => setSelectedVoiceName(voice.name)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    setSelectedVoiceName(voice.name);
                  }
                }}
                className={`relative h-[130px] cursor-pointer rounded-[14px] p-4 outline-none transition ${
                  isSelected
                    ? 'bg-cyan-50 ring-2 ring-[#42c6d0] shadow-[0_8px_22px_rgba(47,191,199,0.08)]'
                    : 'bg-slate-50 ring-1 ring-slate-200 hover:bg-white hover:shadow-[0_8px_22px_rgba(15,23,42,0.06)] focus-visible:ring-2 focus-visible:ring-[#42c6d0]'
                }`}
              >
                <div className="flex min-w-0 items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate text-base font-semibold text-slate-950">{voice.name}</h3>
                    <div className="mt-2 flex min-w-0 flex-wrap gap-1">
                      <span className="max-w-full truncate rounded-[4px] bg-slate-200/70 px-1.5 py-0.5 text-[10px] font-medium text-slate-500">{voice.accent}</span>
                      {voice.hideGenderTag ? null : (
                        <span className="rounded-[4px] bg-slate-200/70 px-1.5 py-0.5 text-[10px] font-medium lowercase text-slate-500">{voice.gender}</span>
                      )}
                    </div>
                  </div>
                  {isSelected ? (
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#35c3cb] text-white">
                      <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                    </span>
                  ) : null}
                </div>

                <div className="absolute inset-x-4 bottom-4 flex items-center gap-4">
                  <button
                    type="button"
                    aria-label={`${isPlaying ? 'Pause' : 'Play'} ${voice.name} voice sample`}
                    aria-pressed={isPlaying}
                    onClick={(event) => {
                      event.stopPropagation();
                      toggleVoicePlayback(voice);
                    }}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#45c7d1] text-white transition hover:bg-[#31b7c1] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#35c3cb] focus-visible:ring-offset-2"
                  >
                    {isPlaying ? <Pause className="h-4 w-4 fill-current" /> : <Play className="ml-0.5 h-4 w-4 fill-current" />}
                  </button>
                  <div className="flex h-7 min-w-0 flex-1 items-center gap-[3px] overflow-hidden" aria-hidden="true">
                    {Array.from({ length: 24 }, (_, index) => {
                      const height = 6 + ((index * 7 + voice.name.length * 5) % 19);
                      return (
                        <span
                          key={index}
                          className={`w-0.5 shrink-0 rounded-full transition ${isPlaying ? 'animate-pulse bg-[#35c3cb]' : 'bg-slate-300'}`}
                          style={{ height }}
                        />
                      );
                    })}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="mt-5 flex min-h-[240px] flex-col items-center justify-center rounded-[14px] bg-slate-50 text-center ring-1 ring-slate-200">
          <AudioLines className="h-7 w-7 text-slate-300" />
          <p className="mt-3 text-sm font-semibold text-slate-700">No voices found</p>
          <button
            type="button"
            onClick={() => {
              setLanguage('All');
              setAccent('All');
              setGender('All');
              setVoiceQuery('');
            }}
            className="mt-3 text-sm font-semibold text-[#2fbfc7]"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}

const templateMasonryAspects: Record<TemplateLibraryCategoryId, string[]> = {
  'ai-video': ['aspect-[3/4]', 'aspect-[4/5]', 'aspect-[2/3]', 'aspect-[5/6]'],
  'ai-image': ['aspect-square', 'aspect-[4/5]', 'aspect-[3/4]', 'aspect-[5/4]', 'aspect-[2/3]'],
  'ecommerce-video': ['aspect-[4/5]', 'aspect-[3/4]', 'aspect-[2/3]', 'aspect-[5/6]'],
  avatar: ['aspect-[3/4]', 'aspect-[2/3]', 'aspect-[4/5]', 'aspect-[5/6]'],
  'ai-voice': ['aspect-square'],
  design: ['aspect-[4/5]', 'aspect-[3/4]', 'aspect-[2/3]', 'aspect-[5/4]'],
};

function TemplateLibraryCard({
  item,
  category,
  index,
  onOpen,
}: {
  item: TemplateLibraryItem;
  category: TemplateLibraryCategory;
  index: number;
  onOpen: () => void;
}) {
  const aspectClass = templateMasonryAspects[category.id][index % templateMasonryAspects[category.id].length];

  return (
    <article className="group mb-3 inline-block w-full break-inside-avoid align-top">
      <button
        type="button"
        onClick={onOpen}
        aria-label={`View ${item.title} details`}
        className={`relative block w-full ${aspectClass} overflow-hidden rounded-[10px] bg-slate-100 text-left ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(15,23,42,0.12)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2fbfc7]`}
      >
        <img src={item.image} alt={item.title} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <span className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent opacity-0 transition group-hover:opacity-100" />
        {item.duration ? (
          <span className="absolute right-2.5 top-2.5 rounded-full bg-slate-950/60 px-2 py-1 text-[10px] font-semibold text-white backdrop-blur-sm">
            {item.duration}
          </span>
        ) : null}
        <h3 className="absolute left-3 right-14 top-3 -translate-y-2 truncate text-sm font-semibold text-white opacity-0 drop-shadow-sm transition group-hover:translate-y-0 group-hover:opacity-100">
          {item.title}
        </h3>
        <div className="absolute inset-x-3 bottom-3 translate-y-3 opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">
          <span className="flex h-9 items-center justify-center rounded-[8px] bg-white text-xs font-semibold text-slate-950 shadow-lg">
            View details
          </span>
        </div>
      </button>
    </article>
  );
}

function TemplateDetailModal({
  item,
  category,
  onClose,
}: {
  item: TemplateLibraryItem;
  category: TemplateLibraryCategory;
  onClose: () => void;
}) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const relatedItems = category.items.filter((candidate) => candidate.title !== item.title).slice(0, 4);

  if (category.id === 'ecommerce-video') {
    return <EcommerceVideoTemplateDetailModal item={item} onClose={onClose} />;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/30 p-3 backdrop-blur-sm sm:p-5"
      role="dialog"
      aria-modal="true"
      aria-label={`${item.title} template details`}
      onClick={onClose}
    >
      <div
        className="max-h-[92vh] w-full max-w-6xl overflow-y-auto rounded-[18px] bg-white p-4 shadow-[0_28px_90px_rgba(15,23,42,0.24)] sm:p-5"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="mb-4 flex min-w-0 items-center gap-3 border-b border-slate-100 pb-4">
          <h2 className="min-w-0 flex-1 truncate text-lg font-semibold text-slate-950">{item.title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close template details"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-950"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        {category.id === 'ai-video' ? (
          <VideoTemplateDetail item={item} relatedItems={relatedItems} />
        ) : category.id === 'ai-image' ? (
          <ImageTemplateDetail item={item} relatedItems={relatedItems} />
        ) : category.id === 'avatar' ? (
          <AvatarTemplateDetail item={item} relatedItems={relatedItems} />
        ) : (
          <DesignTemplateDetail item={item} />
        )}
      </div>
    </div>
  );
}

function EcommerceVideoTemplateDetailModal({ item, onClose }: { item: TemplateLibraryItem; onClose: () => void }) {
  const videoDetails = [
    ['Video Type', item.filter === 'UGC Review' ? 'UGC Ad' : item.filter],
    ['Product Name', item.title],
    ['Spoken Language', 'Auto'],
    ['Target Audience', 'Auto'],
    ['Usage Scene', 'Auto'],
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/30 p-2 backdrop-blur-sm sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`${item.title} e-commerce video details`}
      onClick={onClose}
    >
      <div
        className="max-h-[96vh] w-full max-w-[1064px] overflow-y-auto rounded-[18px] bg-white p-4 text-slate-950 shadow-[0_28px_90px_rgba(15,23,42,0.24)] ring-1 ring-slate-200 sm:p-5"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="mb-4 flex min-w-0 items-center gap-3">
          <h2 className="min-w-0 flex-1 truncate text-base font-semibold text-slate-950">{item.title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close e-commerce video details"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4ac4ce]"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="grid min-w-0 gap-4 lg:h-[min(74vh,620px)] lg:grid-cols-[minmax(0,1fr)_280px]">
          <section className="flex min-h-[430px] items-center justify-center overflow-hidden rounded-[14px] bg-slate-100 ring-1 ring-slate-200">
            <div className="relative h-full max-h-[620px] w-auto max-w-full aspect-[9/16] overflow-hidden bg-white">
              <img src={item.image} alt={`${item.title} video preview`} className="h-full w-full object-cover" />
            </div>
          </section>

          <aside className="flex min-h-[430px] min-w-0 flex-col gap-4">
            <div className="overflow-hidden rounded-[12px] bg-slate-50 ring-1 ring-slate-200">
              <section className="p-3">
                <h3 className="text-[11px] font-medium text-slate-400">References</h3>
                <div className="mt-3 h-12 w-12 overflow-hidden rounded-[7px] bg-white ring-1 ring-slate-200">
                  <img src={item.image} alt={`${item.title} reference`} className="h-full w-full object-cover" />
                </div>
              </section>

              <div className="border-t border-slate-200 px-3 py-3">
                {videoDetails.map(([label, value]) => (
                  <div key={label} className="grid grid-cols-[100px_minmax(0,1fr)] gap-3 py-1.5 text-[12px] leading-4">
                    <span className="text-slate-400">{label}</span>
                    <span className="truncate text-right font-medium text-slate-700" title={value}>{value}</span>
                  </div>
                ))}
              </div>

              <section className="border-t border-slate-200 p-3">
                <h3 className="text-[12px] font-medium text-slate-400">Product Benefit</h3>
                <p className="mt-2 text-[12px] leading-[1.45] text-slate-600">
                  Present {item.title.toLowerCase()} with a clear product hook, relatable everyday context, and concise benefits that help viewers understand why it belongs in their routine.
                </p>
              </section>
            </div>

            <button
              type="button"
              className="mt-auto flex h-12 w-full items-center justify-center rounded-[10px] bg-[#49c2cc] text-sm font-semibold text-white transition hover:bg-[#3bb4be] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#35c3cb] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              Recreate
            </button>
          </aside>
        </div>
      </div>
    </div>
  );
}

function VideoTemplateDetail({
  item,
  relatedItems,
}: {
  item: TemplateLibraryItem;
  relatedItems: TemplateLibraryItem[];
}) {
  const setupDetails = [
    ['Style', item.filter],
    ['Duration', item.duration ?? '12s'],
    ['Motion', 'Dynamic'],
    ['Aspect ratio', '9:16'],
  ];

  return (
    <div className="grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1fr)_350px]">
      <section className="flex min-h-[500px] items-center justify-center overflow-hidden rounded-[14px] bg-slate-100 p-4 ring-1 ring-slate-200">
        <div className="group/preview relative aspect-video w-full overflow-hidden rounded-[12px] bg-white shadow-sm">
          <img src={item.image} alt={item.title} className="absolute inset-0 h-full w-full object-cover" />
          <span className="absolute inset-0 bg-slate-950/10" />
          <button
            type="button"
            aria-label={`Play ${item.title} preview`}
            className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/92 text-slate-950 shadow-[0_12px_30px_rgba(15,23,42,0.2)] transition hover:scale-105"
          >
            <Play className="ml-0.5 h-6 w-6 fill-current" />
          </button>
          <span className="absolute bottom-3 right-3 rounded-full bg-slate-950/60 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
            {item.duration ?? '15s'}
          </span>
        </div>
      </section>

      <aside className="flex min-h-0 min-w-0 flex-col rounded-[14px] bg-slate-50 p-3 ring-1 ring-slate-200">
        <h3 className="text-sm font-semibold text-slate-950">Prompt</h3>
        <div className="mt-3 flex gap-2">
          {[item, ...relatedItems.slice(0, 3)].map((reference) => (
            <span key={reference.title} className="h-10 w-10 overflow-hidden rounded-[8px] bg-white ring-1 ring-slate-200">
              <img src={reference.image} alt={reference.title} className="h-full w-full object-cover" />
            </span>
          ))}
        </div>

        <div className="mt-3 min-h-[230px] flex-1 overflow-y-auto rounded-[10px] bg-white p-3 text-sm leading-6 text-slate-700 ring-1 ring-slate-200">
          <p><span className="block font-semibold text-slate-950">[Duration]</span>{item.duration ?? '15s'}</p>
          <p className="mt-2"><span className="block font-semibold text-slate-950">[Video Style & Type]</span>{item.filter} creative video</p>
          <p className="mt-2"><span className="block font-semibold text-slate-950">[Structure]</span>Establish the scene, build the visual transformation, and finish with a strong reveal.</p>
          <p className="mt-2"><span className="block font-semibold text-slate-950">[Visual Direction]</span>Keep the subject clear, use controlled camera movement, and preserve the pacing shown in the preview.</p>
        </div>

        <div className="mt-3 rounded-[10px] bg-white p-3 ring-1 ring-slate-200">
          {setupDetails.map(([label, value]) => (
            <div key={label} className="grid grid-cols-[88px_minmax(0,1fr)] gap-2 py-1 text-xs">
              <span className="font-semibold text-slate-400">{label}</span>
              <span className="truncate font-medium text-slate-700">{value}</span>
            </div>
          ))}
        </div>

        <button type="button" className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-[9px] bg-[#35c3cb] text-sm font-semibold text-white transition hover:bg-[#29b7bf]">
          <Video className="h-4 w-4" />
          Use video template
        </button>
      </aside>
    </div>
  );
}

function ImageTemplateDetail({ item, relatedItems }: { item: TemplateLibraryItem; relatedItems: TemplateLibraryItem[] }) {
  return (
    <div className="grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
      <section className="flex min-h-[560px] items-center justify-center rounded-[14px] bg-slate-100 p-5 ring-1 ring-slate-200">
        <img src={item.image} alt={item.title} className="max-h-[650px] w-auto max-w-full rounded-[12px] object-contain shadow-[0_16px_38px_rgba(15,23,42,0.14)]" />
      </section>
      <aside className="flex min-h-0 min-w-0 flex-col rounded-[14px] bg-slate-50 p-3 ring-1 ring-slate-200">
        <h3 className="text-sm font-semibold text-slate-950">Prompt</h3>
        <div className="mt-3 flex gap-2">
          {[item, ...relatedItems.slice(0, 3)].map((reference) => (
            <span key={reference.title} className="h-10 w-10 overflow-hidden rounded-[8px] bg-white ring-1 ring-slate-200">
              <img src={reference.image} alt={reference.title} className="h-full w-full object-cover" />
            </span>
          ))}
        </div>

        <div className="mt-3 min-h-[250px] flex-1 overflow-y-auto rounded-[10px] bg-white p-3 text-sm leading-6 text-slate-700 ring-1 ring-slate-200">
          <p><span className="block font-semibold text-slate-950">[Style]</span>{item.filter}</p>
          <p className="mt-2"><span className="block font-semibold text-slate-950">[Composition]</span>Follow the subject placement, framing, negative space, and visual hierarchy shown in the reference.</p>
          <p className="mt-2"><span className="block font-semibold text-slate-950">[Lighting & Color]</span>Reuse the lighting direction, contrast, palette, and material treatment while preserving the new subject.</p>
          <p className="mt-2"><span className="block font-semibold text-slate-950">[Output]</span>Produce a clean, high-quality image suitable for further editing.</p>
        </div>

        <div className="mt-3 rounded-[10px] bg-white p-3 ring-1 ring-slate-200">
          {[
            ['Model', 'Auto'],
            ['Aspect', '1:1'],
            ['Quality', 'High'],
            ['Type', 'Image'],
          ].map(([label, value]) => (
            <div key={label} className="grid grid-cols-[76px_minmax(0,1fr)] gap-2 py-1 text-xs">
              <span className="font-semibold text-slate-400">{label}</span>
              <span className="truncate font-medium text-slate-700">{value}</span>
            </div>
          ))}
        </div>

        <button type="button" className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-[9px] bg-[#35c3cb] text-sm font-semibold text-white transition hover:bg-[#29b7bf]">
          <Sparkles className="h-4 w-4" />
          Use this style
        </button>
      </aside>
    </div>
  );
}

function AvatarTemplateDetail({ item, relatedItems }: { item: TemplateLibraryItem; relatedItems: TemplateLibraryItem[] }) {
  const viewImages = [item, ...relatedItems.slice(0, 3)];

  return (
    <div className="grid min-w-0 gap-5 lg:grid-cols-[380px_minmax(0,1fr)]">
      <section className="rounded-[14px] bg-slate-50 p-4 ring-1 ring-slate-200">
        <h3 className="mb-3 text-sm font-semibold text-slate-500">Base Image</h3>
        <div className="relative h-[520px] overflow-hidden rounded-[12px] bg-white">
          <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
        </div>
      </section>

      <div className="flex min-w-0 flex-col gap-4">
        <section className="rounded-[14px] bg-slate-50 p-4 ring-1 ring-slate-200">
          <h3 className="text-sm font-semibold text-slate-500">Body Three Views</h3>
          <div className="mt-3 overflow-hidden rounded-[12px] bg-white ring-1 ring-slate-200">
            <div className="grid h-[310px] grid-cols-4">
              {viewImages.map((view, index) => (
                <div key={`${view.title}-${index}`} className="relative overflow-hidden border-r border-slate-100 last:border-r-0">
                  <img src={view.image} alt={`${item.title} ${['portrait', 'front', 'side', 'back'][index]} view`} className="h-full w-full object-cover" />
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/45 to-transparent px-2 pb-2 pt-8 text-center text-[11px] font-semibold text-white">
                    {['Portrait', 'Front', 'Side', 'Back'][index]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-[14px] bg-slate-50 p-4 ring-1 ring-slate-200">
          <h3 className="text-sm font-semibold text-slate-500">Voice</h3>
          <div className="mt-3 flex items-center gap-3 rounded-[12px] bg-white p-3 ring-1 ring-slate-200">
            <button type="button" aria-label={`Play ${item.title} voice`} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#49ccd4] text-white">
              <Play className="ml-0.5 h-4 w-4 fill-current" />
            </button>
            <div className="flex h-8 min-w-0 flex-1 items-center gap-1 overflow-hidden">
              {[14, 23, 17, 28, 19, 31, 16, 25, 20, 29, 18, 24, 15, 27, 19, 30, 17, 22, 16, 26].map((height, index) => (
                <span key={`${height}-${index}`} className="w-1 shrink-0 rounded-full bg-slate-300" style={{ height }} />
              ))}
            </div>
            <span className="text-xs font-semibold text-slate-700">Natural</span>
          </div>
        </section>

        <div className="mt-auto grid gap-2 sm:grid-cols-2">
          <button type="button" className="flex h-11 items-center justify-center gap-2 rounded-[9px] bg-slate-100 text-sm font-semibold text-slate-700 transition hover:bg-slate-200">
            <UserRound className="h-4 w-4" />
            Use avatar
          </button>
          <button type="button" className="flex h-11 items-center justify-center gap-2 rounded-[9px] bg-[#35c3cb] text-sm font-semibold text-white transition hover:bg-[#29b7bf]">
            <Video className="h-4 w-4" />
            Generate video
          </button>
        </div>
      </div>
    </div>
  );
}

function DesignTemplateDetail({ item }: { item: TemplateLibraryItem }) {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const isSocial = item.filter === 'Social' || item.title.toLowerCase().includes('story');
  const canvasSize = isSocial ? '1080*1920' : item.filter === 'Planner' ? '2480*3508' : '2458*3072';
  const description = item.title === 'Back to School Poster'
    ? 'Bright and playful back-to-school poster design featuring bold typography and school supply illustrations. Perfect for creating announcements, classroom decorations, or social media posts.'
    : `A polished ${item.filter.toLowerCase()} design with an editable layout, clear visual hierarchy, and reusable creative elements for campaigns, social posts, and branded content.`;
  const categories = ['advertising', 'art', 'artwork', 'creativity', 'decoration', 'design', 'display', 'graphics', 'illustration', 'Ins posts', 'marketing'];

  return (
    <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
      <section className="flex min-h-[570px] items-center justify-center rounded-[14px] bg-slate-50 p-6 ring-1 ring-slate-200">
        <div className={`relative overflow-hidden bg-white shadow-[0_14px_34px_rgba(15,23,42,0.12)] ${isSocial ? 'aspect-[9/16] h-[520px]' : 'aspect-[4/5] h-[520px]'}`}>
          <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
        </div>
      </section>

      <aside className="flex min-w-0 flex-col pb-1">
        <p className={`text-sm leading-6 text-slate-600 ${isDescriptionExpanded ? '' : 'line-clamp-3'}`}>{description}</p>
        <button
          type="button"
          aria-expanded={isDescriptionExpanded}
          onClick={() => setIsDescriptionExpanded((value) => !value)}
          className="mt-2 flex w-fit items-center gap-1 text-sm font-semibold text-[#20b7c0] transition hover:text-[#169da5]"
        >
          {isDescriptionExpanded ? 'Less' : 'More'}
          <ChevronRight className={`h-4 w-4 transition ${isDescriptionExpanded ? '-rotate-90' : 'rotate-90'}`} />
        </button>

        <button
          type="button"
          onClick={() => {
            window.location.href = `/editor?template=${encodeURIComponent(item.title)}&source=creation-template`;
          }}
          className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-[9px] bg-[#35bec8] text-sm font-semibold text-white transition hover:bg-[#29afb8] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#35c3cb] focus-visible:ring-offset-2"
        >
          <PenTool className="h-4 w-4" />
          Edit now
        </button>

        <section className="mt-7">
          <h3 className="text-lg font-semibold text-slate-950">Template Details</h3>
          <dl className="mt-4 grid gap-3 text-sm">
            <div className="grid grid-cols-[72px_minmax(0,1fr)] gap-2">
              <dt className="font-semibold text-slate-400">Size:</dt>
              <dd className="font-medium text-slate-700">{canvasSize}</dd>
            </div>
            <div className="grid grid-cols-[72px_minmax(0,1fr)] gap-2">
              <dt className="font-semibold text-slate-400">Images:</dt>
              <dd className="font-medium text-slate-700">1</dd>
            </div>
          </dl>
        </section>

        <section className="mt-8">
          <h3 className="text-lg font-semibold text-slate-950">Relevant Categories</h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map((category) => (
              <span key={category} className="rounded-full bg-slate-100 px-3 py-2 text-xs font-medium text-slate-600">
                {category}
              </span>
            ))}
          </div>
        </section>
      </aside>
    </div>
  );
}

function ToolsLibraryPanel() {
  return (
    <section className="min-w-0 pb-8" aria-labelledby="tools-library">
      <div className="flex flex-col gap-5">
        <label className="relative block w-full max-w-[340px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            placeholder="Search tools"
            className="h-9 w-full rounded-[8px] bg-slate-50 pl-9 pr-3 text-sm text-slate-800 outline-none ring-1 ring-slate-200 transition placeholder:text-slate-400 focus:bg-white focus:ring-[#2fbfc7]"
          />
        </label>

        <section className="min-w-0" aria-labelledby="recent-tools">
          <h2 id="recent-tools" className="mb-3 text-base font-semibold tracking-tight text-slate-950">
            Recently used
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {recentToolCards.map((tool) => (
              <RecentToolCard key={`recent-${tool.name}`} tool={tool} />
            ))}
          </div>
        </section>

        <nav className="flex gap-5 overflow-x-auto border-b border-slate-200 pb-2 scrollbar-hide" aria-label="Tool categories">
          {toolCategoryTabs.map((tab, index) => (
            <button
              key={tab}
              type="button"
              className={`shrink-0 text-sm font-semibold transition ${
                index === 0 ? 'text-slate-950 underline decoration-slate-950 decoration-2 underline-offset-[10px]' : 'text-slate-500 hover:text-slate-950'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>

        <div className="grid min-w-0 gap-9">
          {toolLibrarySections.map((section) => (
            <section key={section.title} className="min-w-0" aria-labelledby={`tools-${section.title.replace(/\s+/g, '-').toLowerCase()}`}>
              <h2 id={`tools-${section.title.replace(/\s+/g, '-').toLowerCase()}`} className="mb-3 text-base font-semibold text-slate-500">
                {section.title}
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                {section.cards.map((tool, index) => (
                  <ToolLibraryCard key={`${section.title}-${tool.name}`} tool={tool} index={index} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}

function RecentToolCard({ tool }: { tool: HubCard }) {
  const Icon = tool.icon;

  return (
    <a
      href={tool.href}
      className="group flex min-h-[74px] items-center gap-3 rounded-[12px] bg-white px-5 ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-[0_12px_26px_rgba(15,23,42,0.06)]"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-slate-50 text-slate-700 ring-1 ring-slate-200 group-hover:text-[#2fbfc7]">
        <Icon className="h-5 w-5" />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-semibold text-slate-950">{tool.name}</span>
      </span>
    </a>
  );
}

function ToolLibraryCard({ tool, index }: { tool: HubCard; index: number }) {
  const Icon = tool.icon;
  const imageSrc = getStableImage(toolImagePaths, `${tool.name}-${index}`);

  return (
    <a
      href={tool.href}
      className="group overflow-hidden rounded-[14px] bg-white ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-[0_14px_32px_rgba(15,23,42,0.08)]"
    >
      <div className="relative h-[138px] bg-slate-100">
        <img src={imageSrc} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <span className="absolute inset-0 bg-gradient-to-t from-slate-950/18 to-transparent" />
        <span className="absolute bottom-3 left-3 flex h-9 w-9 items-center justify-center rounded-[10px] bg-white text-slate-800 shadow-sm ring-1 ring-slate-200 group-hover:text-[#2fbfc7]">
          <Icon className="h-5 w-5" />
        </span>
        {tool.status ? (
          <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-slate-500 ring-1 ring-white">
            {tool.status}
          </span>
        ) : null}
      </div>
      <div className="px-4 py-3">
        <h3 className="truncate text-sm font-semibold text-slate-950">{tool.name}</h3>
        <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">{tool.description}</p>
      </div>
    </a>
  );
}

function ProjectsPanel({ onSectionChange }: { onSectionChange: (section: SectionId) => void }) {
  const [activeProjectLibrary, setActiveProjectLibrary] = useState<'projects' | 'uploads'>('projects');
  const [activeTaskType, setActiveTaskType] = useState<'All' | ProjectTaskType>('All');
  const [activeTool, setActiveTool] = useState<'All' | ProjectToolCategory>('All');
  const [selectedProject, setSelectedProject] = useState<ProjectGalleryItem | null>(null);
  const [openProjectMenu, setOpenProjectMenu] = useState<string | null>(null);
  const [isProjectSelectionMode, setIsProjectSelectionMode] = useState(false);
  const [selectedProjectKeys, setSelectedProjectKeys] = useState<string[]>([]);
  const [projectGrouping, setProjectGrouping] = useState<GalleryGrouping>('date');
  const [activeUploadType, setActiveUploadType] = useState<'All' | UploadTaskType>('All');
  const [selectedUpload, setSelectedUpload] = useState<ProjectGalleryItem | null>(null);
  const [openUploadMenu, setOpenUploadMenu] = useState<string | null>(null);
  const [isUploadSelectionMode, setIsUploadSelectionMode] = useState(false);
  const [selectedUploadKeys, setSelectedUploadKeys] = useState<string[]>([]);
  const [uploadGrouping, setUploadGrouping] = useState<GalleryGrouping>('date');
  const shouldShowProjectToolFilters = activeTaskType !== 'Agent Sessions' && activeTaskType !== 'Avatar';
  const toggleProjectSelection = (project: ProjectGalleryItem) => {
    const key = getGalleryItemKey(project);
    setSelectedProjectKeys((current) => {
      const next = current.includes(key) ? current.filter((item) => item !== key) : [...current, key];
      setIsProjectSelectionMode(next.length > 0);
      return next;
    });
  };
  const clearProjectSelection = () => {
    setIsProjectSelectionMode(false);
    setSelectedProjectKeys([]);
  };
  const toggleUploadSelection = (project: ProjectGalleryItem) => {
    const key = getGalleryItemKey(project);
    setSelectedUploadKeys((current) => {
      const next = current.includes(key) ? current.filter((item) => item !== key) : [...current, key];
      setIsUploadSelectionMode(next.length > 0);
      return next;
    });
  };
  const clearUploadSelection = () => {
    setIsUploadSelectionMode(false);
    setSelectedUploadKeys([]);
  };
  const handleProjectOpen = (project: ProjectGalleryItem) => {
    setOpenProjectMenu(null);

    if (project.taskType === 'Audio') {
      return;
    }

    if (project.taskType === 'Agent Sessions') {
      onSectionChange('home');
      window.requestAnimationFrame(() => {
        document.getElementById('agent-entry')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      return;
    }

    if (project.taskType === 'Design') {
      window.location.href = `/editor?source=creation-project&project=${encodeURIComponent(project.title)}`;
      return;
    }

    if (project.tool === 'AI Photo Editor') {
      window.location.href = '/editor';
      return;
    }

    setSelectedProject(project);
  };
  const handleUploadOpen = (project: ProjectGalleryItem) => {
    setOpenUploadMenu(null);

    if (project.taskType === 'Audio') {
      return;
    }

    setSelectedUpload(project);
  };
  const visibleProjects = projectItems.filter((item) => {
    const matchesTask = activeTaskType === 'All' || item.taskType === activeTaskType;
    const matchesTool = !shouldShowProjectToolFilters || activeTool === 'All' || item.tool === activeTool;
    return matchesTask && matchesTool;
  });
  const availableToolFilters = projectToolFilters.filter((tool) => {
    if (tool === 'All') return true;
    return activeTaskType === 'All' ? projectItems.some((item) => item.tool === tool) : projectItems.some((item) => item.taskType === activeTaskType && item.tool === tool);
  });
  const projectSections = buildGallerySections(visibleProjects, projectGrouping, 'All projects');
  const visibleUploads = uploadItems.filter((item) => activeUploadType === 'All' || item.taskType === activeUploadType);
  const uploadSections = buildGallerySections(visibleUploads, uploadGrouping, 'All uploads');

  return (
    <section className="min-w-0 pb-8" aria-labelledby="projects-library">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div id="projects-library" className="flex items-center gap-4" aria-label="Project library switcher">
          {[
            { id: 'projects', label: 'Projects' },
            { id: 'uploads', label: 'My Upload' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setActiveProjectLibrary(item.id as 'projects' | 'uploads');
                setOpenProjectMenu(null);
                setSelectedProject(null);
                clearProjectSelection();
              }}
              className={`text-[15px] font-semibold tracking-tight transition ${
                activeProjectLibrary === item.id ? 'text-slate-950' : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="ml-auto flex min-w-0 flex-1 justify-end">
          {activeProjectLibrary === 'projects' ? (
            <SelectionActions
              isSelecting={isProjectSelectionMode}
              selectedCount={selectedProjectKeys.length}
              onCancel={clearProjectSelection}
              onAction={clearProjectSelection}
            />
          ) : (
            <SelectionActions
              isSelecting={isUploadSelectionMode}
              selectedCount={selectedUploadKeys.length}
              onCancel={clearUploadSelection}
              onAction={clearUploadSelection}
            />
          )}
        </div>
      </div>

      {activeProjectLibrary === 'uploads' ? (
        <>
          <MyUploadPanel
            activeUploadType={activeUploadType}
            uploadGrouping={uploadGrouping}
            uploadSections={uploadSections}
            openUploadMenu={openUploadMenu}
            isUploadSelectionMode={isUploadSelectionMode}
            selectedUploadKeys={selectedUploadKeys}
            onUploadGroupingChange={setUploadGrouping}
            onUploadTypeChange={(tab) => {
              setActiveUploadType(tab);
              setOpenUploadMenu(null);
              clearUploadSelection();
            }}
            onUploadOpen={handleUploadOpen}
            onToggleUploadMenu={(key) => setOpenUploadMenu((current) => (current === key ? null : key))}
            onCloseUploadMenu={() => setOpenUploadMenu(null)}
            onToggleUploadSelection={toggleUploadSelection}
          />
          {selectedUpload ? <ProjectDetailModal project={selectedUpload} onClose={() => setSelectedUpload(null)} /> : null}
        </>
      ) : (
        <>
          <div className="flex flex-col gap-5">
            <div className="flex items-start justify-between gap-3 border-b border-slate-200 pb-2">
              <nav className="flex min-w-0 flex-1 gap-5 overflow-x-auto pt-2 scrollbar-hide" aria-label="Project task types">
                {projectTaskTabs.map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => {
                      setActiveTaskType(tab);
                      setActiveTool('All');
                      setOpenProjectMenu(null);
                      clearProjectSelection();
                    }}
                    className={`shrink-0 text-sm font-semibold transition ${
                      activeTaskType === tab ? 'text-slate-950 underline decoration-slate-950 decoration-2 underline-offset-[10px]' : 'text-slate-500 hover:text-slate-950'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
              <GalleryListToolbar
                grouping={projectGrouping}
                onGroupingChange={setProjectGrouping}
                searchPlaceholder="Search projects..."
                filterLabel="Tool"
                filterOptions={shouldShowProjectToolFilters ? availableToolFilters.map((tool) => ({ label: tool, value: tool })) : undefined}
                activeFilter={activeTool}
                onFilterChange={(value) => {
                  setActiveTool(value as 'All' | ProjectToolCategory);
                  setOpenProjectMenu(null);
                  clearProjectSelection();
                }}
              />
            </div>

            <div className="grid min-w-0 gap-9">
              {projectSections.map((section) => (
                <section key={section.title} className="min-w-0" aria-labelledby={`projects-${section.title.replace(/\s+/g, '-').toLowerCase()}`}>
                  <h2 id={`projects-${section.title.replace(/\s+/g, '-').toLowerCase()}`} className="mb-3 text-base font-semibold text-slate-500">
                    {section.title}
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                    {section.items.map((project, index) => (
                      project.taskType === 'Audio' ? (
                        <AudioProjectCard
                          key={`${section.title}-${project.title}`}
                          project={project}
                          onPlay={() => handleProjectOpen(project)}
                          isMenuOpen={openProjectMenu === `${section.title}-${project.title}`}
                          onToggleMenu={() => setOpenProjectMenu((current) => (current === `${section.title}-${project.title}` ? null : `${section.title}-${project.title}`))}
                          onCloseMenu={() => setOpenProjectMenu(null)}
                          isSelecting={isProjectSelectionMode}
                          isSelected={selectedProjectKeys.includes(getGalleryItemKey(project))}
                          onToggleSelect={() => toggleProjectSelection(project)}
                        />
                      ) : (
                        <ProjectLibraryCard
                          key={`${section.title}-${project.title}`}
                          project={project}
                          index={index}
                          onOpen={() => handleProjectOpen(project)}
                          isMenuOpen={openProjectMenu === `${section.title}-${project.title}`}
                          onToggleMenu={() => setOpenProjectMenu((current) => (current === `${section.title}-${project.title}` ? null : `${section.title}-${project.title}`))}
                          onCloseMenu={() => setOpenProjectMenu(null)}
                          isSelecting={isProjectSelectionMode}
                          isSelected={selectedProjectKeys.includes(getGalleryItemKey(project))}
                          onToggleSelect={() => toggleProjectSelection(project)}
                        />
                      )
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
          {selectedProject ? (
            selectedProject.taskType === 'Avatar' ? (
              <AvatarDetailModal project={selectedProject} onClose={() => setSelectedProject(null)} />
            ) : (
              <ProjectDetailModal project={selectedProject} onClose={() => setSelectedProject(null)} />
            )
          ) : null}
        </>
      )}
    </section>
  );
}

function MyUploadPanel({
  activeUploadType,
  uploadGrouping,
  uploadSections,
  openUploadMenu,
  isUploadSelectionMode,
  selectedUploadKeys,
  onUploadGroupingChange,
  onUploadTypeChange,
  onUploadOpen,
  onToggleUploadMenu,
  onCloseUploadMenu,
  onToggleUploadSelection,
}: {
  activeUploadType: 'All' | UploadTaskType;
  uploadGrouping: GalleryGrouping;
  uploadSections: Array<{ title: string; items: ProjectGalleryItem[] }>;
  openUploadMenu: string | null;
  isUploadSelectionMode: boolean;
  selectedUploadKeys: string[];
  onUploadGroupingChange: (grouping: GalleryGrouping) => void;
  onUploadTypeChange: (tab: 'All' | UploadTaskType) => void;
  onUploadOpen: (project: ProjectGalleryItem) => void;
  onToggleUploadMenu: (key: string) => void;
  onCloseUploadMenu: () => void;
  onToggleUploadSelection: (project: ProjectGalleryItem) => void;
}) {
  return (
    <section className="min-w-0 pb-8" aria-labelledby="uploads-library">
      <h1 id="uploads-library" className="sr-only">
        My Upload
      </h1>

      <div className="flex flex-col gap-5">
        <div className="flex items-start justify-between gap-3 border-b border-slate-200 pb-2">
          <nav className="flex min-w-0 flex-1 gap-5 overflow-x-auto pt-2 scrollbar-hide" aria-label="Upload media types">
            {uploadTaskTabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => onUploadTypeChange(tab)}
                className={`shrink-0 text-sm font-semibold transition ${
                  activeUploadType === tab ? 'text-slate-950 underline decoration-slate-950 decoration-2 underline-offset-[10px]' : 'text-slate-500 hover:text-slate-950'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
          <GalleryListToolbar
            grouping={uploadGrouping}
            onGroupingChange={onUploadGroupingChange}
            showSearch={false}
          />
        </div>

        <div className="grid min-w-0 gap-9">
          {uploadSections.map((section) => (
            <section key={section.title} className="min-w-0" aria-labelledby={`uploads-${section.title.replace(/\s+/g, '-').toLowerCase()}`}>
              <h2 id={`uploads-${section.title.replace(/\s+/g, '-').toLowerCase()}`} className="mb-3 text-base font-semibold text-slate-500">
                {section.title}
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                {section.items.map((project, index) =>
                  project.taskType === 'Audio' ? (
                    <AudioProjectCard
                      key={`upload-${section.title}-${project.title}`}
                      project={project}
                      onPlay={() => onUploadOpen(project)}
                      isMenuOpen={openUploadMenu === `upload-${section.title}-${project.title}`}
                      onToggleMenu={() => onToggleUploadMenu(`upload-${section.title}-${project.title}`)}
                      onCloseMenu={onCloseUploadMenu}
                      isSelecting={isUploadSelectionMode}
                      isSelected={selectedUploadKeys.includes(getGalleryItemKey(project))}
                      onToggleSelect={() => onToggleUploadSelection(project)}
                    />
                  ) : (
                    <ProjectLibraryCard
                      key={`upload-${section.title}-${project.title}`}
                      project={project}
                      index={index}
                      onOpen={() => onUploadOpen(project)}
                      isMenuOpen={openUploadMenu === `upload-${section.title}-${project.title}`}
                      onToggleMenu={() => onToggleUploadMenu(`upload-${section.title}-${project.title}`)}
                      onCloseMenu={onCloseUploadMenu}
                      isSelecting={isUploadSelectionMode}
                      isSelected={selectedUploadKeys.includes(getGalleryItemKey(project))}
                      onToggleSelect={() => onToggleUploadSelection(project)}
                    />
                  ),
                )}
              </div>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}

function getGalleryItemKey(project: ProjectGalleryItem) {
  return `${project.taskType}-${project.tool}-${project.title}`;
}

function getGalleryItemDate(project: ProjectGalleryItem) {
  return project.updatedAt.split(',')[0] || project.updatedAt;
}

function groupGalleryItemsByDate(items: ProjectGalleryItem[]) {
  return items.reduce<Array<{ title: string; items: ProjectGalleryItem[] }>>((sections, item) => {
    const title = getGalleryItemDate(item);
    const existingSection = sections.find((section) => section.title === title);

    if (existingSection) {
      existingSection.items.push(item);
    } else {
      sections.push({ title, items: [item] });
    }

    return sections;
  }, []);
}

function buildGallerySections(items: ProjectGalleryItem[], grouping: GalleryGrouping, flatTitle: string) {
  if (grouping === 'flat') {
    return items.length > 0 ? [{ title: flatTitle, items }] : [];
  }

  return groupGalleryItemsByDate(items);
}

function GalleryListToolbar({
  grouping,
  onGroupingChange,
  searchPlaceholder,
  showSearch = true,
  filterLabel = 'Filter',
  filterOptions,
  activeFilter,
  onFilterChange,
}: {
  grouping: GalleryGrouping;
  onGroupingChange: (grouping: GalleryGrouping) => void;
  searchPlaceholder?: string;
  showSearch?: boolean;
  filterLabel?: string;
  filterOptions?: Array<{ label: string; value: string }>;
  activeFilter?: string;
  onFilterChange?: (value: string) => void;
}) {
  const [openPanel, setOpenPanel] = useState<'filter' | 'time' | 'view' | null>(null);
  const activeFilterLabel = filterOptions?.find((option) => option.value === activeFilter)?.label ?? 'All';

  return (
    <div className="flex shrink-0 items-start justify-end gap-2">
      <div className="flex shrink-0 gap-2">
        {filterOptions && activeFilter && onFilterChange ? (
          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenPanel((panel) => (panel === 'filter' ? null : 'filter'))}
              className={`flex h-9 items-center gap-1.5 rounded-[8px] px-2.5 text-xs font-semibold transition ${
                openPanel === 'filter' ? 'bg-white text-slate-950 shadow-sm ring-1 ring-slate-200' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
              <span>{filterLabel}</span>
              <span className="text-slate-400">/</span>
              <span>{activeFilterLabel}</span>
              <ChevronRight className={`h-4 w-4 rotate-90 text-slate-400 transition ${openPanel === 'filter' ? '-rotate-90' : ''}`} />
            </button>
            {openPanel === 'filter' ? (
              <FilterPopover
                label={filterLabel}
                options={filterOptions}
                activeValue={activeFilter}
                onSelect={(value) => {
                  onFilterChange(value);
                  setOpenPanel(null);
                }}
              />
            ) : null}
          </div>
        ) : null}

        <div className="relative">
          <button
            type="button"
            onClick={() => setOpenPanel((panel) => (panel === 'time' ? null : 'time'))}
              className={`flex h-9 items-center gap-1.5 rounded-[8px] px-2.5 text-xs font-semibold transition ${
              openPanel === 'time' ? 'bg-white text-slate-950 shadow-sm ring-1 ring-slate-200' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <CalendarDays className="h-4 w-4" />
            Time Range
          </button>
          {openPanel === 'time' ? <TimeRangePopover /> : null}
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setOpenPanel((panel) => (panel === 'view' ? null : 'view'))}
              className={`flex h-9 items-center gap-1.5 rounded-[8px] px-2.5 text-xs font-semibold transition ${
              openPanel === 'view' ? 'bg-white text-slate-950 shadow-sm ring-1 ring-slate-200' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <SlidersHorizontal className="h-4 w-4" />
            View Mode
          </button>
          {openPanel === 'view' ? (
            <ViewModePopover
              grouping={grouping}
              onGroupingChange={(value) => {
                onGroupingChange(value);
                setOpenPanel(null);
              }}
            />
          ) : null}
        </div>
      </div>

      {showSearch ? (
        <label className="relative block w-[220px] shrink-0">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            placeholder={searchPlaceholder}
            className="h-9 w-full rounded-[8px] bg-slate-50 pl-9 pr-3 text-sm text-slate-800 outline-none ring-1 ring-slate-200 transition placeholder:text-slate-400 focus:bg-white focus:ring-[#2fbfc7]"
          />
        </label>
      ) : null}
    </div>
  );
}

function TimeRangePopover() {
  const calendarCells = [...Array.from({ length: 3 }, (_, index) => `empty-${index}`), ...Array.from({ length: 31 }, (_, index) => String(index + 1))];

  return (
    <div className="absolute left-0 top-11 z-30 w-[320px] rounded-[14px] bg-white p-3 shadow-[0_18px_46px_rgba(15,23,42,0.18)] ring-1 ring-slate-200">
      <div className="grid grid-cols-2 rounded-[10px] bg-slate-100 p-1 text-sm font-medium text-slate-700">
        <button type="button" className="h-8 rounded-[8px] bg-white shadow-sm">
          All time
        </button>
        <button type="button" className="h-8 rounded-[8px] text-slate-600 transition hover:bg-white">
          Today
        </button>
      </div>

      <div className="mt-3 flex items-center justify-center gap-4 text-sm font-medium text-slate-700">
        <button type="button" className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-50 text-slate-500 ring-1 ring-slate-200">
          <ChevronRight className="h-4 w-4 rotate-180" />
        </button>
        <span>2026</span>
        <button type="button" className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-50 text-slate-500 ring-1 ring-slate-200">
          <ChevronRight className="h-4 w-4" />
        </button>
        <button type="button" className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-50 text-slate-500 ring-1 ring-slate-200">
          <ChevronRight className="h-4 w-4 rotate-180" />
        </button>
        <span>07</span>
        <button type="button" className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-50 text-slate-500 ring-1 ring-slate-200">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-y-3 text-center text-sm font-semibold text-slate-700">
        {calendarCells.map((day) =>
          day.startsWith('empty') ? (
            <span key={day} />
          ) : (
            <button
              key={day}
              type="button"
              className={`mx-auto flex h-7 w-7 items-center justify-center rounded-full transition ${
                day === '10' ? 'bg-cyan-50 text-[#2fbfc7] ring-1 ring-[#7de0e6]' : day === '3' ? 'text-[#2fbfc7]' : 'hover:bg-slate-100'
              }`}
            >
              {day}
            </button>
          ),
        )}
      </div>
    </div>
  );
}

function FilterPopover({
  label,
  options,
  activeValue,
  onSelect,
}: {
  label: string;
  options: Array<{ label: string; value: string }>;
  activeValue: string;
  onSelect: (value: string) => void;
}) {
  return (
    <div className="absolute left-0 top-11 z-30 w-52 rounded-[14px] bg-white p-2 shadow-[0_18px_46px_rgba(15,23,42,0.18)] ring-1 ring-slate-200">
      <p className="px-2 pb-2 pt-1 text-xs font-semibold text-slate-400">{label}</p>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onSelect(option.value)}
          className={`flex h-9 w-full items-center justify-between rounded-[8px] px-2 text-sm transition ${
            activeValue === option.value ? 'bg-slate-100 font-semibold text-slate-950' : 'text-slate-700 hover:bg-slate-50'
          }`}
        >
          {option.label}
          {activeValue === option.value ? <Check className="h-4 w-4 text-slate-500" /> : null}
        </button>
      ))}
    </div>
  );
}

function ViewModePopover({
  grouping,
  onGroupingChange,
}: {
  grouping: GalleryGrouping;
  onGroupingChange: (grouping: GalleryGrouping) => void;
}) {
  return (
    <div className="absolute left-0 top-11 z-30 w-56 rounded-[14px] bg-white p-2 shadow-[0_18px_46px_rgba(15,23,42,0.18)] ring-1 ring-slate-200">
      <p className="px-2 pb-2 pt-1 text-xs font-semibold text-slate-400">Grouping</p>
      {[
        { id: 'date', label: 'Group by date' },
        { id: 'flat', label: 'Flat list' },
      ].map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onGroupingChange(item.id as GalleryGrouping)}
          className={`flex h-9 w-full items-center justify-between rounded-[8px] px-2 text-sm transition ${
            grouping === item.id ? 'bg-slate-100 font-semibold text-slate-950' : 'text-slate-700 hover:bg-slate-50'
          }`}
        >
          {item.label}
          {grouping === item.id ? <Check className="h-4 w-4 text-slate-500" /> : null}
        </button>
      ))}

      <p className="px-2 pb-2 pt-4 text-xs font-semibold text-slate-400">Card size</p>
      <div className="grid grid-cols-2 gap-1 rounded-[10px] bg-slate-100 p-1">
        <button type="button" className="h-8 rounded-[8px] bg-white text-xs font-semibold text-slate-800 shadow-sm">
          Medium
        </button>
        <button type="button" className="h-8 rounded-[8px] text-xs font-semibold text-slate-500 transition hover:bg-white">
          Compact
        </button>
      </div>
    </div>
  );
}

function SelectionActions({
  isSelecting,
  selectedCount,
  onCancel,
  onAction,
}: {
  isSelecting: boolean;
  selectedCount: number;
  onCancel: () => void;
  onAction: () => void;
}) {
  if (!isSelecting) {
    return null;
  }

  return (
    <div className="ml-auto flex flex-wrap items-center gap-2">
      <span className="rounded-full bg-cyan-50 px-3 py-1.5 text-xs font-semibold text-[#18aeb8] ring-1 ring-cyan-100">{selectedCount} selected</span>
      <button
        type="button"
        onClick={onAction}
        disabled={selectedCount === 0}
        className="flex h-8 items-center gap-1.5 rounded-full bg-slate-100 px-3 text-xs font-semibold text-slate-600 transition hover:bg-slate-200 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-45"
      >
        <Download className="h-3.5 w-3.5" />
        Download
      </button>
      <button
        type="button"
        onClick={onAction}
        disabled={selectedCount === 0}
        className="flex h-8 items-center gap-1.5 rounded-full bg-slate-100 px-3 text-xs font-semibold text-slate-600 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-45"
      >
        <Trash2 className="h-3.5 w-3.5" />
        Delete
      </button>
      <button type="button" onClick={onCancel} className="h-8 rounded-full px-3 text-xs font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-950">
        Cancel
      </button>
    </div>
  );
}

function SelectionCheckbox({ isSelected, isSelecting, onToggle }: { isSelected: boolean; isSelecting: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      aria-label={isSelected ? 'Deselect item' : 'Select item'}
      onClick={(event) => {
        event.stopPropagation();
        onToggle();
      }}
      onKeyDown={(event) => event.stopPropagation()}
      className={`absolute left-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-[8px] shadow-sm ring-1 transition ${
        isSelected
          ? 'bg-[#2fbfc7] text-white opacity-100 ring-[#2fbfc7]'
          : `bg-white/95 text-transparent ring-white hover:text-slate-300 ${isSelecting ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 group-focus-within:opacity-100'}`
      }`}
    >
      <Check className="h-4 w-4" />
    </button>
  );
}

function AudioProjectCard({
  project,
  onPlay,
  isMenuOpen,
  onToggleMenu,
  onCloseMenu,
  isSelecting = false,
  isSelected = false,
  onToggleSelect,
}: {
  project: ProjectGalleryItem;
  onPlay: () => void;
  isMenuOpen: boolean;
  onToggleMenu: () => void;
  onCloseMenu: () => void;
  isSelecting?: boolean;
  isSelected?: boolean;
  onToggleSelect?: () => void;
}) {
  const waveHeights = [18, 26, 14, 31, 22, 36, 16, 28, 20, 34, 18, 25, 14, 30, 21, 33, 16, 24];

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => {
        if (isSelecting) {
          onToggleSelect?.();
          return;
        }
        onPlay();
      }}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          if (isSelecting) {
            onToggleSelect?.();
            return;
          }
          onPlay();
        }
      }}
      className="group cursor-pointer text-left transition hover:-translate-y-0.5"
    >
      <div
        className={`relative aspect-square overflow-hidden rounded-[14px] bg-[linear-gradient(135deg,#f8fafc_0%,#ecfeff_52%,#e0f2fe_100%)] transition group-hover:shadow-[0_14px_32px_rgba(15,23,42,0.08)] ${
          isSelected ? 'ring-2 ring-[#2fbfc7] ring-offset-2' : 'ring-1 ring-slate-200'
        }`}
      >
        {onToggleSelect ? <SelectionCheckbox isSelected={isSelected} isSelecting={isSelecting} onToggle={onToggleSelect} /> : null}
        <span className={`absolute left-3 top-3 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-slate-500 ring-1 ring-white transition ${isSelecting ? 'opacity-0' : 'opacity-100 group-hover:opacity-0 group-focus-within:opacity-0'}`}>Audio</span>
        {!isSelecting ? (
          <>
            <button
              type="button"
              aria-label="More audio actions"
              onClick={(event) => {
                event.stopPropagation();
                onToggleMenu();
              }}
              onKeyDown={(event) => event.stopPropagation()}
              className={`absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:text-[#2fbfc7] ${
                isMenuOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              }`}
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
            {isMenuOpen ? <ProjectMoreMenu onAction={onCloseMenu} /> : null}
          </>
        ) : null}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-5">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#4fd2dc] text-white shadow-sm">
            <Video className="h-6 w-6 fill-white" />
          </span>
          <span className="mt-5 flex h-10 items-end gap-1">
            {waveHeights.map((height, index) => (
              <span key={index} className="w-1 rounded-full bg-slate-300" style={{ height }} />
            ))}
          </span>
          <span className="mt-3 rounded-[5px] bg-white/80 px-2 py-0.5 text-[10px] font-semibold text-slate-500 ring-1 ring-white">{project.description}</span>
        </div>
      </div>

      <div className="pt-3">
        <h3 className="truncate text-base font-semibold text-slate-950">{project.title}</h3>
        <div className="mt-1 text-sm leading-5 text-slate-500">
          <span>{project.fileSize}</span>
          <span className="px-1.5">·</span>
          <span>{project.updatedAt}</span>
        </div>
      </div>
    </article>
  );
}

const projectTaskIcons: Record<ProjectTaskType, LucideIcon> = {
  Image: ImageIcon,
  Video,
  Audio: Sparkles,
  Design: LayoutTemplate,
  'Agent Sessions': Sparkles,
  Avatar: UserRound,
};

function ProjectLibraryCard({
  project,
  index,
  onOpen,
  isMenuOpen,
  onToggleMenu,
  onCloseMenu,
  isSelecting = false,
  isSelected = false,
  onToggleSelect,
}: {
  project: ProjectGalleryItem;
  index: number;
  onOpen: () => void;
  isMenuOpen: boolean;
  onToggleMenu: () => void;
  onCloseMenu: () => void;
  isSelecting?: boolean;
  isSelected?: boolean;
  onToggleSelect?: () => void;
}) {
  const imageSrc = getStableImage(projectImagePaths, `${project.title}-${index}`);
  const label = project.tool === 'AI Photo Editor' ? 'Project' : project.taskType;

  return (
    <article
      onClick={() => {
        if (isSelecting) {
          onToggleSelect?.();
          return;
        }
        onOpen();
      }}
      className="group cursor-pointer text-left transition hover:-translate-y-0.5"
    >
      <div
        className={`relative aspect-square overflow-hidden rounded-[14px] bg-slate-100 transition group-hover:shadow-[0_14px_32px_rgba(15,23,42,0.08)] ${
          isSelected ? 'ring-2 ring-[#2fbfc7] ring-offset-2' : 'ring-1 ring-slate-200'
        }`}
      >
        <img src={imageSrc} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <span className="absolute inset-0 bg-gradient-to-t from-slate-950/18 to-transparent" />
        {onToggleSelect ? <SelectionCheckbox isSelected={isSelected} isSelecting={isSelecting} onToggle={onToggleSelect} /> : null}
        <span className={`absolute left-3 top-3 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-slate-500 ring-1 ring-white transition ${isSelecting ? 'opacity-0' : 'opacity-100 group-hover:opacity-0 group-focus-within:opacity-0'}`}>
          {label}
        </span>
        {!isSelecting ? (
          <>
            <button
              type="button"
              aria-label="More project actions"
              onClick={(event) => {
                event.stopPropagation();
                onToggleMenu();
              }}
              onKeyDown={(event) => event.stopPropagation()}
              className={`absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:text-[#2fbfc7] ${
                isMenuOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              }`}
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
            {isMenuOpen ? <ProjectMoreMenu onAction={onCloseMenu} /> : null}
          </>
        ) : null}
      </div>
      <div className="pt-3">
        <div className="flex items-center gap-2">
          <input
            type="text"
            defaultValue={project.title}
            aria-label={`${project.title} title`}
            readOnly={isSelecting}
            onClick={(event) => {
              if (!isSelecting) {
                event.stopPropagation();
              }
            }}
            className="min-w-0 flex-1 truncate rounded-[6px] bg-transparent px-0 py-0.5 text-base font-semibold text-slate-950 outline-none transition focus:bg-slate-50 focus:px-2 focus:ring-1 focus:ring-[#2fbfc7]"
          />
          <PenTool className="h-3.5 w-3.5 shrink-0 text-slate-300 transition group-hover:text-[#2fbfc7]" />
        </div>
        <div className="mt-1 text-sm leading-5 text-slate-500">
          <span>{project.fileSize}</span>
          <span className="px-1.5">·</span>
          <span>{project.updatedAt}</span>
        </div>
      </div>
    </article>
  );
}

function ProjectMoreMenu({ onAction }: { onAction: () => void }) {
  const actions = [
    { label: 'Rename', icon: PenTool },
    { label: 'Download', icon: Download },
    { label: 'Delete', icon: Trash2 },
  ];

  return (
    <div
      onClick={(event) => event.stopPropagation()}
      onKeyDown={(event) => event.stopPropagation()}
      className="absolute right-3 top-12 z-20 w-36 overflow-hidden rounded-[12px] bg-white p-1.5 shadow-[0_14px_34px_rgba(15,23,42,0.16)] ring-1 ring-slate-200"
    >
      {actions.map(({ label, icon: Icon }) => (
        <button
          key={label}
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onAction();
          }}
          className="flex h-9 w-full items-center gap-2 rounded-[8px] px-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-[#2fbfc7]"
        >
          <Icon className="h-4 w-4 shrink-0" />
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}

function ProjectDetailModal({ project, onClose }: { project: ProjectGalleryItem; onClose: () => void }) {
  const imageSrc = getStableImage(projectImagePaths, project.title);
  const promptBlocks = [
    ['Task Type', project.taskType],
    ['Tool', project.tool],
    ['Goal', project.description],
    ['Style', project.taskType === 'Video' ? 'Natural UGC pacing with clear product focus.' : 'Clean commercial composition with reusable output.'],
    ['Output', project.taskType === 'Video' ? 'Preview video with editable scene structure.' : 'High quality creative asset with source task metadata.'],
  ];
  const details = [
    ['Model', project.tool],
    ['Type', project.taskType],
    ['Size', project.fileSize],
    ['Updated', project.updatedAt],
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={`${project.title} details`}>
      <div className="grid max-h-[88vh] w-full max-w-6xl grid-cols-1 gap-3 overflow-hidden rounded-[18px] bg-white p-3 shadow-[0_24px_80px_rgba(15,23,42,0.28)] lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="relative min-h-[420px] overflow-hidden rounded-[12px] bg-slate-950">
          <img src={imageSrc} alt="" className="absolute inset-0 h-full w-full object-contain" />
          <button
            type="button"
            className="absolute right-4 top-4 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white ring-1 ring-white/30 backdrop-blur-md"
          >
            Good
          </button>
        </div>

        <aside className="flex min-h-0 flex-col rounded-[12px] bg-slate-50 p-3 ring-1 ring-slate-200">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="min-w-0 truncate text-base font-semibold text-slate-950">{project.title}</h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close project details"
              className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition hover:bg-white hover:text-slate-950"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mb-3 flex gap-2">
            {[0, 1, 2, 3].map((item) => (
              <span key={item} className="h-10 w-10 overflow-hidden rounded-[8px] bg-white ring-1 ring-slate-200">
                <img src={getStableImage(projectImagePaths, `${project.title}-${item}`)} alt="" className="h-full w-full object-cover" />
              </span>
            ))}
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto rounded-[10px] bg-white p-3 text-sm leading-6 text-slate-700 ring-1 ring-slate-200">
            <h3 className="mb-2 text-sm font-semibold text-slate-950">Prompt</h3>
            {promptBlocks.map(([label, value]) => (
              <p key={label} className="mb-2">
                <span className="block font-semibold text-slate-950">[{label}]</span>
                <span>{value}</span>
              </p>
            ))}
          </div>

          <div className="mt-3 rounded-[10px] bg-white p-3 ring-1 ring-slate-200">
            {details.map(([label, value]) => (
              <div key={label} className="grid grid-cols-[76px_minmax(0,1fr)] gap-2 py-1 text-xs">
                <span className="font-semibold text-slate-400">{label}</span>
                <span className="truncate font-medium text-slate-700">{value}</span>
              </div>
            ))}
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <button type="button" className="flex h-10 items-center justify-center gap-2 rounded-[8px] bg-[#33c4cc] text-sm font-semibold text-white transition hover:bg-[#28b5bd]">
              <RefreshCw className="h-4 w-4" />
              Recreate
            </button>
            <button type="button" className="flex h-10 items-center justify-center gap-2 rounded-[8px] bg-[#33c4cc] text-sm font-semibold text-white transition hover:bg-[#28b5bd]">
              <Share2 className="h-4 w-4" />
              Edit
            </button>
            <button type="button" className="col-span-2 flex h-10 items-center justify-center gap-2 rounded-[8px] bg-[#33c4cc] text-sm font-semibold text-white transition hover:bg-[#28b5bd]">
              <Download className="h-4 w-4" />
              Download
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

function AvatarDetailModal({ project, onClose }: { project: ProjectGalleryItem; onClose: () => void }) {
  const baseImage = getStableImage(projectImagePaths, `${project.title}-base`);
  const viewImages = [0, 1, 2, 3].map((index) => getStableImage(projectImagePaths, `${project.title}-view-${index}`));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/30 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={`${project.title} avatar details`}>
      <div className="max-h-[90vh] w-full max-w-6xl overflow-hidden rounded-[18px] bg-white p-4 text-slate-950 shadow-[0_24px_80px_rgba(15,23,42,0.22)]">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex min-w-0 items-center gap-2">
            <h2 className="truncate text-base font-semibold">{project.title}</h2>
            <PenTool className="h-4 w-4 text-slate-400" />
          </div>
          <button type="button" onClick={onClose} aria-label="Close avatar details" className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-950">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-4 lg:grid-cols-[380px_minmax(0,1fr)]">
          <section className="rounded-[16px] bg-slate-50 p-4 ring-1 ring-slate-200">
            <h3 className="mb-4 text-sm font-semibold text-slate-500">Base Image</h3>
            <div className="relative h-[452px] overflow-hidden rounded-[12px] bg-slate-100">
              <img src={baseImage} alt="" className="h-full w-full object-cover" />
            </div>
          </section>

          <div className="grid min-w-0 gap-4">
            <section className="rounded-[16px] bg-slate-50 p-4 ring-1 ring-slate-200">
              <h3 className="mb-4 text-sm font-semibold text-slate-500">Body Three Views</h3>
              <div className="overflow-hidden rounded-[12px] bg-white ring-1 ring-slate-200">
                <div className="grid h-[270px] grid-cols-4 gap-0 bg-white">
                  {viewImages.map((image, index) => (
                    <div key={image} className="relative overflow-hidden border-r border-slate-100 last:border-r-0">
                      <img src={image} alt="" className="h-full w-full object-cover" />
                      {index > 0 ? <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/35 to-transparent p-2 text-center text-xs font-semibold text-white">{['Front', 'Side', 'Back'][index - 1]}</span> : null}
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="rounded-[16px] bg-slate-50 p-4 ring-1 ring-slate-200">
              <h3 className="mb-4 text-sm font-semibold text-slate-500">Voice</h3>
              <div className="flex items-center gap-4 rounded-[14px] bg-white p-3 ring-1 ring-slate-200">
                <button type="button" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#4fd2dc] text-white">
                  <Video className="h-4 w-4 fill-white" />
                </button>
                <div className="flex h-8 flex-1 items-center gap-1">
                  {[18, 24, 14, 29, 20, 34, 16, 26, 22, 30, 18, 25, 12, 28, 19, 32, 15, 23, 18, 26, 14, 30].map((height, index) => (
                    <span key={index} className="w-1 rounded-full bg-slate-300" style={{ height }} />
                  ))}
                </div>
                <span className="text-xs font-semibold text-slate-600">Diego</span>
                <button type="button" className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200">
                  Switch voice
                </button>
              </div>
            </section>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <button type="button" className="flex h-10 items-center gap-2 rounded-[8px] bg-slate-100 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-200">
            <RefreshCw className="h-4 w-4" />
            Recreate
          </button>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="flex h-10 items-center gap-2 rounded-[8px] bg-slate-100 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-200">
              <Share2 className="h-4 w-4" />
              Create Similar Avatar
            </button>
            <button type="button" className="h-10 rounded-[8px] bg-[#4fd2dc] px-5 text-sm font-semibold text-white transition hover:bg-[#39c7cf]">
              Generate Video
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionPanel({ activeSection }: { activeSection: SectionId }) {
  if (activeSection === 'tools') {
    return (
      <section className="mt-5 grid min-w-0 gap-5" aria-labelledby="tools-content">
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 id="tools-content" className="text-xl font-semibold tracking-tight text-slate-950">
              Featured tools
            </h2>
          </div>
          <div className="grid gap-3 lg:grid-cols-4">
            {featuredToolCards.map((card) => (
              <ShowcaseCard key={card.name} tool={card} />
            ))}
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xl font-semibold tracking-tight text-slate-950">Quick tools</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {toolCards.map((card) => (
              <UtilityToolCard key={card.name} tool={card} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-5 min-w-0" aria-labelledby={`${activeSection}-content`}>
      <h2 id={`${activeSection}-content`} className="sr-only">
        {sectionMeta[activeSection].eyebrow}
      </h2>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {templateCards.map((card) => (
          <UtilityToolCard key={card.name} tool={card} />
        ))}
      </div>
    </section>
  );
}

function AgentEntryPrototype() {
  const [activeAgentGroupId, setActiveAgentGroupId] = useState<string | null>(null);
  const [selectedAgentTemplateId, setSelectedAgentTemplateId] = useState<string | null>(null);
  const [agentPrompt, setAgentPrompt] = useState('');
  const [templateSelectionRevision, setTemplateSelectionRevision] = useState(0);
  const [uploadedAgentImages, setUploadedAgentImages] = useState<UploadedAgentImage[]>([]);
  const [mediaUploadError, setMediaUploadError] = useState<string | null>(null);
  const mediaInputRef = useRef<HTMLInputElement>(null);
  const mediaObjectUrlsRef = useRef(new Set<string>());
  const agentGroups: AgentGroupCard[] = [
    {
      id: 'ecommerce-poster',
      name: 'E-commerce Poster',
      icon: LayoutTemplate,
      tone: 'from-[#ff7a45] via-[#ff4fd8] to-[#8b5cf6]',
      children: [
        {
          id: 'product-poster',
          name: 'Product Poster',
          description: 'Showcase one product in a polished poster.',
          image: '/assets/creation/tool-9.jpg',
          prompt: 'Create a polished 3:4 product poster for a matte-black wireless speaker. Use a clean studio background, soft directional light, and the headline "Summer Essentials".',
          icon: LayoutTemplate,
          tone: 'from-[#ff7a45] via-[#ff4fd8] to-[#8b5cf6]',
          fields: [
            { type: 'input', label: 'Headline', value: 'Summer Essentials', placeholder: 'Please enter a short headline' },
            { type: 'select', label: 'Aspect Ratio', value: '3:4', options: ['3:4', '1:1', '4:5'] },
            { type: 'select', label: 'Quantity', value: '1', options: ['1', '2', '4'] },
          ],
        },
        {
          id: 'social-media-ad',
          name: 'Social Media Ad',
          description: 'Create a scroll-stopping social media ad.',
          image: '/assets/creation/template-18.jpg',
          prompt: 'Design a square social ad for Daily Glow vitamin C serum. Use warm morning light, fresh citrus accents, and a clear shop-now composition.',
          icon: ImageIcon,
          tone: 'from-[#f97316] via-[#ec4899] to-[#8b5cf6]',
          fields: [
            { type: 'input', label: 'Headline', value: 'Made for Your Routine', placeholder: 'Please enter a short headline' },
            { type: 'select', label: 'Aspect Ratio', value: '1:1', options: ['1:1', '4:5', '9:16'] },
            { type: 'select', label: 'Quantity', value: '1', options: ['1', '2', '4'] },
          ],
        },
        {
          id: 'ecommerce-banner',
          name: 'E-commerce Banner',
          description: 'Promote a store campaign in a wide banner.',
          image: '/assets/creation/template-17.jpg',
          prompt: 'Create a wide e-commerce banner for a mid-year home decor sale. Feature a modern living room, bold discount messaging, and clear space for a call to action.',
          icon: LayoutTemplate,
          tone: 'from-[#f59e0b] via-[#f97316] to-[#ef4444]',
          fields: [
            { type: 'input', label: 'Headline', value: 'Mid-Year Sale', placeholder: 'Please enter a campaign headline' },
            { type: 'select', label: 'Aspect Ratio', value: '16:9', options: ['16:9', '3:1', '1:1'] },
            { type: 'select', label: 'Quantity', value: '1', options: ['1', '2', '4'] },
          ],
        },
        {
          id: 'brand-campaign',
          name: 'Brand Campaign',
          description: 'Build a cohesive hero visual for a brand campaign.',
          image: '/assets/creation/promo-3.jpg',
          prompt: 'Build a premium brand campaign visual for a minimalist leather goods label. Use refined editorial lighting and the campaign line "Everyday, Elevated".',
          icon: ShoppingBag,
          tone: 'from-[#6366f1] via-[#8b5cf6] to-[#d946ef]',
          fields: [
            { type: 'input', label: 'Campaign Title', value: 'Everyday, Elevated', placeholder: 'Please enter a campaign title' },
            { type: 'select', label: 'Aspect Ratio', value: '3:4', options: ['3:4', '1:1', '16:9'] },
            { type: 'select', label: 'Quantity', value: '1', options: ['1', '2', '4'] },
          ],
        },
      ],
    },
    {
      id: 'amazon-detail-images',
      name: 'Amazon Detail Images',
      icon: ShoppingBag,
      tone: 'from-[#16c6d9] to-[#2f80ed]',
      children: [
        {
          id: 'conversion-a-plus-set',
          name: 'Conversion A+ Set',
          description: 'Turn product benefits into a conversion-focused A+ set.',
          image: '/assets/creation/template-14.jpg',
          prompt: 'Create a benefit-led Amazon A+ image set for AeroFit wireless earbuds. Highlight all-day comfort, clear calls, 30-hour battery life, and compact charging.',
          icon: ShoppingBag,
          tone: 'from-[#16c6d9] to-[#2f80ed]',
          fields: [
            { type: 'input', label: 'Product Name', value: 'AeroFit Earbuds', placeholder: 'Please enter the product name' },
            { type: 'select', label: 'Language', value: 'English', options: ['English', 'Spanish', 'German', 'Japanese'] },
            { type: 'select', label: 'A+ Format', value: 'Basic A+', options: ['Basic A+', 'Premium A+'] },
          ],
        },
        {
          id: 'brand-story-a-plus-set',
          name: 'Brand Story A+ Set',
          description: 'Tell the brand story through an Amazon A+ set.',
          image: '/assets/creation/tool-9.jpg',
          prompt: 'Create an Amazon A+ brand story for Northline Travel Mug. Show the design process, everyday commute moments, and the brand promise of durable simplicity.',
          icon: BookOpen,
          tone: 'from-[#0ea5e9] to-[#6366f1]',
          fields: [
            { type: 'input', label: 'Product Name', value: 'Northline Travel Mug', placeholder: 'Please enter the product name' },
            { type: 'select', label: 'Language', value: 'English', options: ['English', 'Spanish', 'German', 'Japanese'] },
            { type: 'select', label: 'A+ Format', value: 'Basic A+', options: ['Basic A+', 'Premium A+'] },
          ],
        },
        {
          id: 'features-specs-a-plus-set',
          name: 'Features & Specs A+ Set',
          description: 'Present key features and specs in an A+ set.',
          image: '/assets/creation/template-8.jpg',
          prompt: 'Create a feature and specification A+ layout for the LumaGlow Desk Lamp. Show adjustable color temperature, touch controls, USB-C charging, and dimensions.',
          icon: SlidersHorizontal,
          tone: 'from-[#14b8a6] to-[#22c55e]',
          fields: [
            { type: 'input', label: 'Product Name', value: 'LumaGlow Desk Lamp', placeholder: 'Please enter the product name' },
            { type: 'select', label: 'Language', value: 'English', options: ['English', 'Spanish', 'German', 'Japanese'] },
            { type: 'select', label: 'A+ Format', value: 'Basic A+', options: ['Basic A+', 'Premium A+'] },
          ],
        },
        {
          id: 'comparison-trust-a-plus-set',
          name: 'Comparison & Trust A+ Set',
          description: 'Compare products and add trust proof in an A+ set.',
          image: '/assets/creation/template-11.jpg',
          templateImages: [
            { name: 'Primary product image', url: '/assets/creation/template-11.jpg' },
            { name: 'Comparison product image', url: '/assets/creation/template-14.jpg' },
          ],
          prompt: 'Create an Amazon comparison and trust A+ set for CloudRest Pillow. Use the first image as the primary product and the second as the comparison product. Compare firmness options, show material certifications, and include a simple care guide.',
          icon: Check,
          tone: 'from-[#10b981] to-[#0ea5e9]',
          fields: [
            { type: 'input', label: 'Product Name', value: 'CloudRest Pillow', placeholder: 'Please enter the product name' },
            { type: 'select', label: 'Language', value: 'English', options: ['English', 'Spanish', 'German', 'Japanese'] },
            { type: 'select', label: 'A+ Format', value: 'Basic A+', options: ['Basic A+', 'Premium A+'] },
          ],
        },
      ],
    },
    {
      id: 'ecommerce-video',
      name: 'E-commerce Video',
      icon: Video,
      tone: 'from-[#f59e0b] via-[#f97316] to-[#ef4444]',
      children: [
        {
          id: 'ugc-product-ad',
          name: 'UGC Product Ad',
          description: 'Create a creator-led UGC ad for a product.',
          image: '/assets/creation/template-18.jpg',
          prompt: 'Create a natural UGC product ad for the HydraSip Bottle aimed at Gen Z. Open with a hydration problem, demonstrate the leakproof lid, and end with a casual recommendation.',
          icon: UserRound,
          tone: 'from-[#f59e0b] via-[#f97316] to-[#ef4444]',
          fields: [
            { type: 'input', label: 'Product Name', value: 'HydraSip Bottle', placeholder: 'Please enter the product name', maxLength: 50 },
            { type: 'select', label: 'Target Audience', value: 'Gen Z', options: ['Auto', 'Gen Z', 'Parents', 'Beauty shoppers', 'Tech buyers'] },
            { type: 'select', label: 'Usage Scene', value: 'Product demo', options: ['Auto', 'Product demo', 'Unboxing', 'Review', 'Problem solution'] },
            { type: 'select', label: 'Spoken Language', value: 'English', options: ['English', 'Chinese', 'Spanish'] },
            { type: 'select', label: 'Aspect Ratio', value: '9:16', options: ['9:16', '1:1', '16:9'] },
          ],
        },
        {
          id: 'product-showcase',
          name: 'Product Showcase',
          description: 'Showcase product details with premium motion.',
          image: '/assets/creation/template-14.jpg',
          prompt: 'Create a premium product showcase video for AeroFit Earbuds. Use macro close-ups, smooth rotations, and clean motion graphics to highlight fit, sound, and battery life.',
          icon: ShoppingBag,
          tone: 'from-[#10c957] to-[#2f80ed]',
          fields: [
            { type: 'input', label: 'Product Name', value: 'AeroFit Earbuds', placeholder: 'Please enter the product name' },
            { type: 'select', label: 'Target Audience', value: 'Tech buyers', options: ['Auto', 'Gen Z', 'Parents', 'Beauty shoppers', 'Tech buyers'] },
            { type: 'select', label: 'Usage Scene', value: 'Feature close-up', options: ['Auto', 'Product demo', 'Lifestyle', 'Feature close-up'] },
            { type: 'select', label: 'Emotional Tone', value: 'Premium', options: ['Auto', 'Excited', 'Premium', 'Calm'] },
            { type: 'select', label: 'Aspect Ratio', value: '9:16', options: ['9:16', '1:1', '16:9'] },
          ],
        },
        {
          id: 'before-after',
          name: 'Before & After',
          description: 'Animate a clear before-and-after transformation.',
          image: '/assets/creation/tool-9.jpg',
          templateImages: [
            { name: 'Before image', url: '/assets/creation/tool-9.jpg' },
            { name: 'After image', url: '/assets/creation/promo-2.jpg' },
          ],
          prompt: 'Create a believable before-and-after video for GlowLab Serum. Use the first image as the before state and the second as the after state. Show a consistent daily routine, realistic skin texture, and a gradual brighter-looking result.',
          icon: RefreshCw,
          tone: 'from-[#14b8a6] to-[#0ea5e9]',
          fields: [
            { type: 'input', label: 'Product Name', value: 'GlowLab Serum', placeholder: 'Please enter the product name' },
            { type: 'select', label: 'Target Audience', value: 'Beauty shoppers', options: ['Auto', 'Gen Z', 'Parents', 'Beauty shoppers', 'Tech buyers'] },
            { type: 'select', label: 'Usage Scene', value: 'Daily routine', options: ['Auto', 'Product demo', 'Problem solution', 'Daily routine'] },
            { type: 'select', label: 'Aspect Ratio', value: '9:16', options: ['9:16', '1:1', '16:9'] },
          ],
        },
        {
          id: 'vsl-conversion-ad',
          name: 'VSL Conversion Ad',
          description: 'Build a persuasive video sales letter that converts.',
          image: '/assets/creation/template-8.jpg',
          prompt: 'Create a conversion-focused VSL for PosturePro Back Support. Lead with everyday back discomfort, explain the support system, add proof points, and finish with a clear offer.',
          icon: Video,
          tone: 'from-[#6366f1] via-[#8b5cf6] to-[#d946ef]',
          fields: [
            { type: 'input', label: 'Product Name', value: 'PosturePro Support', placeholder: 'Please enter the product name' },
            { type: 'select', label: 'Target Audience', value: 'Parents', options: ['Auto', 'Gen Z', 'Parents', 'Beauty shoppers', 'Tech buyers'] },
            { type: 'select', label: 'Usage Scene', value: 'Problem solution', options: ['Auto', 'Problem solution', 'Testimonial', 'Founder story'] },
            { type: 'select', label: 'Spoken Language', value: 'English', options: ['English', 'Chinese', 'Spanish'] },
            { type: 'select', label: 'Aspect Ratio', value: '9:16', options: ['9:16', '1:1', '16:9'] },
          ],
        },
      ],
    },
    {
      id: 'trending-ai-videos',
      name: 'Trending AI Videos',
      icon: Sparkles,
      tone: 'from-[#14b8a6] to-[#22c55e]',
      children: [
        {
          id: 'kiss-cam',
          name: 'Kiss Cam',
          description: 'Bring two people into a stadium kiss-cam scene.',
          image: '/assets/creation/template-18.jpg',
          templateImages: [
            { name: 'Person one photo', url: '/assets/creation/template-18.jpg' },
            { name: 'Person two photo', url: '/assets/creation/project-16.jpg' },
          ],
          prompt: 'Combine the two portrait photos into a playful stadium kiss-cam moment. Keep both people recognizable, then add crowd reactions, arena lights, and natural camera movement.',
          icon: Video,
          tone: 'from-[#ec4899] to-[#f97316]',
          fields: [{ type: 'select', label: 'Aspect Ratio', value: '9:16', options: ['9:16', '1:1', '16:9'] }],
        },
        {
          id: 'the-final-hug',
          name: 'The Final Hug',
          description: 'Bring two people together for a final cinematic hug.',
          image: '/assets/creation/promo-1.jpg',
          templateImages: [
            { name: 'Person one photo', url: '/assets/creation/template-18.jpg' },
            { name: 'Person two photo', url: '/assets/creation/promo-1.jpg' },
          ],
          prompt: 'Bring the people from the two source photos together in a heartfelt cinematic hug. Keep both people recognizable, with gentle movement, warm sunset light, and a calm emotional finish.',
          icon: UserRound,
          tone: 'from-[#8b5cf6] to-[#ec4899]',
          fields: [{ type: 'select', label: 'Aspect Ratio', value: '9:16', options: ['9:16', '1:1', '16:9'] }],
        },
        {
          id: 'match-day',
          name: 'Match Day',
          description: 'Create a high-energy match-day celebration.',
          image: '/assets/creation/template-7.jpg',
          prompt: 'Transform a portrait into an energetic match-day celebration with stadium lights, team colors, crowd motion, and a triumphant finish.',
          icon: Video,
          tone: 'from-[#0ea5e9] to-[#22c55e]',
          fields: [{ type: 'select', label: 'Aspect Ratio', value: '9:16', options: ['9:16', '1:1', '16:9'] }],
        },
        {
          id: 'ai-dance',
          name: 'AI Dance',
          description: 'Animate a full-body photo into an AI dance video.',
          image: '/assets/creation/template-6.jpg',
          prompt: 'Turn a full-body photo into a social-ready AI dance video with smooth choreography, stable facial details, and an upbeat studio setting.',
          icon: Sparkles,
          tone: 'from-[#f59e0b] to-[#ec4899]',
          fields: [{ type: 'select', label: 'Aspect Ratio', value: '9:16', options: ['9:16', '1:1', '16:9'] }],
        },
      ],
    },
  ];
  const activeAgentGroup = agentGroups.find((group) => group.id === activeAgentGroupId) ?? null;
  const allAgentTemplates = agentGroups.flatMap((group) => group.children);
  const selectedAgentTemplate = allAgentTemplates.find((template) => template.id === selectedAgentTemplateId) ?? null;
  const visibleAgentModes: Array<AgentTemplateCard | AgentGroupCard> = activeAgentGroup ? activeAgentGroup.children : agentGroups;
  const selectAgentTemplate = (template: AgentTemplateCard) => {
    const templateImages = template.templateImages ?? [
      { name: 'Reference image', url: template.image },
    ];

    setSelectedAgentTemplateId(template.id);
    setAgentPrompt(template.prompt);
    setTemplateSelectionRevision((currentRevision) => currentRevision + 1);
    setUploadedAgentImages((currentImages) => [
      ...templateImages.map((image, index) => ({
        id: `template-${template.id}-${index}`,
        name: `${template.name}: ${image.name}`,
        url: image.url,
        source: 'template' as const,
      })),
      ...currentImages.filter((image) => image.source === 'user'),
    ]);
  };
  const selectAgentGroup = (group: AgentGroupCard) => {
    const firstTemplate = group.children[0];
    if (!firstTemplate) return;

    setActiveAgentGroupId(group.id);
    selectAgentTemplate(firstTemplate);
  };
  const clearSelectedAgentTemplate = () => {
    setSelectedAgentTemplateId(null);
    setActiveAgentGroupId(null);
    setUploadedAgentImages((currentImages) => currentImages.filter((image) => image.source === 'user'));
  };
  useEffect(() => {
    const objectUrls = mediaObjectUrlsRef.current;
    return () => {
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
      objectUrls.clear();
    };
  }, []);

  const handleMediaSelection = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files ?? []);
    const userImageCount = uploadedAgentImages.filter((image) => image.source === 'user').length;
    const remainingSlots = Math.max(10 - userImageCount, 0);
    const supportedTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);
    const validFiles = selectedFiles.filter((file) => supportedTypes.has(file.type) && file.size <= 20 * 1024 * 1024);
    const filesToAdd = validFiles.slice(0, remainingSlots);

    if (validFiles.length !== selectedFiles.length) {
      setMediaUploadError('Use JPG, PNG, or WebP images under 20 MB.');
    } else if (validFiles.length > remainingSlots) {
      setMediaUploadError('Add up to 10 images.');
    } else {
      setMediaUploadError(null);
    }

    const uploadedImages = filesToAdd.map((file) => {
      const url = URL.createObjectURL(file);
      mediaObjectUrlsRef.current.add(url);
      return {
        id: `${file.name}-${file.lastModified}-${file.size}-${crypto.randomUUID()}`,
        name: file.name,
        url,
        source: 'user' as const,
      };
    });

    if (uploadedImages.length > 0) {
      setUploadedAgentImages((currentImages) => [...currentImages, ...uploadedImages]);
    }
    event.target.value = '';
  };

  const removeUploadedAgentImage = (image: UploadedAgentImage) => {
    if (image.source === 'user') {
      URL.revokeObjectURL(image.url);
      mediaObjectUrlsRef.current.delete(image.url);
    }
    setUploadedAgentImages((currentImages) => currentImages.filter((currentImage) => currentImage.id !== image.id));
    setMediaUploadError(null);
  };

  return (
    <section id="agent-entry" className="min-w-0 scroll-mt-4">
      <div className="mx-auto max-w-5xl">
        <h1 className="mx-auto max-w-[680px] text-center text-[28px] font-semibold leading-tight tracking-tight text-slate-950 sm:text-[40px]">
          Create images, videos, posters, and brand assets with AI
        </h1>

        <div className="mt-6 rounded-[20px] bg-white p-4 shadow-[0_18px_60px_rgba(15,23,42,0.12)] ring-1 ring-slate-200">
          <div className="min-h-[150px]">
            {uploadedAgentImages.length > 0 ? (
              <div className={`flex flex-wrap items-center gap-2 ${selectedAgentTemplate ? 'mb-2' : 'mb-4'}`}>
                <AgentUploadedImageList images={uploadedAgentImages} onRemove={removeUploadedAgentImage} />
              </div>
            ) : null}
            {selectedAgentTemplate ? (
              <div className="mb-4 flex flex-wrap items-end gap-2">
                <AgentTemplateFields
                  key={`${selectedAgentTemplate.id}-${templateSelectionRevision}`}
                  fields={selectedAgentTemplate.fields}
                />
              </div>
            ) : null}
            <textarea
              aria-label="Prompt"
              value={agentPrompt}
              onChange={(event) => setAgentPrompt(event.target.value)}
              placeholder={
                selectedAgentTemplate
                  ? `Describe your ${selectedAgentTemplate.name.toLowerCase()} request...`
                  : 'Describe what you want to create -- images, videos, posters, brand visuals, and more...'
              }
              rows={3}
              className="min-h-[72px] w-full resize-none bg-transparent text-[18px] font-medium leading-7 text-slate-800 outline-none placeholder:text-slate-400"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                aria-label="Add media"
                onClick={() => mediaInputRef.current?.click()}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50"
              >
                <Plus className="h-5 w-5" />
              </button>
              <input
                ref={mediaInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                aria-label="Upload images"
                onChange={handleMediaSelection}
                className="sr-only"
              />
              <button
                type="button"
                className="flex h-10 items-center gap-2 rounded-full bg-white px-4 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50"
              >
                <InfinityIcon className="h-5 w-5" />
                Auto
              </button>
              <button
                type="button"
                aria-label="Open assets"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50"
              >
                <Box className="h-5 w-5" />
              </button>
              <button
                type="button"
                aria-label="Open prompt library"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50"
              >
                <BookOpen className="h-5 w-5" />
              </button>
              {selectedAgentTemplate ? (
                <AgentSelectedTemplatePill template={selectedAgentTemplate} onClear={clearSelectedAgentTemplate} />
              ) : null}
            </div>

            <button
              type="button"
              className="flex h-11 items-center gap-2 rounded-full bg-slate-950 px-5 text-base font-semibold text-white shadow-[0_14px_30px_rgba(15,23,42,0.2)] transition hover:bg-slate-800"
            >
              <Send className="h-5 w-5 fill-white" />
              Send
            </button>
          </div>
          {mediaUploadError ? (
            <p className="mt-2 text-xs font-medium text-red-600" role="status">
              {mediaUploadError}
            </p>
          ) : null}
        </div>

        <div
          className={`mx-auto mt-4 grid max-w-4xl gap-2.5 ${
            activeAgentGroup
              ? 'grid-flow-col auto-cols-[minmax(200px,1fr)] overflow-x-auto pb-2 scrollbar-hide'
              : 'grid-cols-2 lg:grid-cols-4'
          }`}
        >
          {visibleAgentModes.map((mode) => {
            const Icon = mode.icon;

            if ('children' in mode) {
              return (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => selectAgentGroup(mode)}
                  className="group flex min-h-[56px] items-center gap-2.5 rounded-[12px] bg-white px-3 text-left shadow-[0_8px_20px_rgba(15,23,42,0.05)] ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:ring-[#2fbfc7] hover:shadow-[0_12px_26px_rgba(15,23,42,0.08)]"
                >
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] bg-gradient-to-br ${mode.tone} text-white shadow-sm`}>
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 text-sm font-semibold leading-4 text-slate-950">{mode.name}</span>
                </button>
              );
            }

            return (
              <button
                key={mode.id}
                type="button"
                aria-label={`Select ${mode.name}`}
                onClick={() => selectAgentTemplate(mode)}
                className={`group flex h-[180px] min-w-0 flex-col overflow-hidden rounded-[14px] bg-[#f7f7f8] p-2.5 text-left shadow-[0_8px_20px_rgba(15,23,42,0.05)] ring-1 transition hover:-translate-y-0.5 hover:shadow-[0_12px_26px_rgba(15,23,42,0.08)] ${
                  selectedAgentTemplate?.id === mode.id ? 'ring-[#2fbfc7]' : 'ring-slate-200'
                }`}
              >
                <span className="line-clamp-2 min-h-10 text-sm font-medium leading-5 text-slate-800">
                  {mode.description}
                </span>
                <span className="relative mt-2 min-h-0 w-full flex-1 overflow-hidden rounded-[10px] bg-slate-100">
                  <Image
                    src={mode.image}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 200px, 220px"
                    className="object-cover transition duration-300 group-hover:scale-105"
                  />
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function AgentTemplateFields({
  fields,
}: {
  fields: AgentTemplateField[];
}) {
  return (
    <>
      {fields.map((field, index) => {
        if (field.type === 'input') {
          return (
            <input
              key={`${field.label}-${index}`}
              type="text"
              aria-label={field.label}
              placeholder={field.placeholder}
              title={field.placeholder}
              defaultValue={field.value}
              maxLength={field.maxLength ?? 80}
              className="h-12 min-w-[148px] rounded-[8px] bg-slate-100 px-3 text-sm font-semibold text-slate-800 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-[#78b7ff]"
            />
          );
        }

        return (
          <select
            key={`${field.label}-${index}`}
            aria-label={field.label}
            defaultValue={field.value}
            className="h-12 min-w-[132px] max-w-[220px] rounded-[8px] bg-slate-100 px-3 text-sm font-semibold text-slate-800 outline-none transition focus:bg-white focus:ring-2 focus:ring-[#78b7ff]"
          >
            <optgroup label={field.label}>
              {field.options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </optgroup>
          </select>
        );
      })}
    </>
  );
}

type UploadedAgentImage = {
  id: string;
  name: string;
  url: string;
  source: 'template' | 'user';
};

function AgentUploadedImageList({ images, onRemove }: { images: UploadedAgentImage[]; onRemove: (image: UploadedAgentImage) => void }) {
  return (
    <>
      {images.map((image) => (
        <span key={image.id} className="group/upload relative h-10 w-10 shrink-0 overflow-hidden rounded-[8px] bg-slate-100 ring-1 ring-slate-200">
          <Image src={image.url} alt={image.name} fill sizes="40px" unoptimized className="object-cover" />
          <button
            type="button"
            aria-label={`Remove ${image.name}`}
            onClick={() => onRemove(image)}
            className="absolute inset-0 flex items-center justify-center bg-slate-950/55 text-white opacity-0 transition group-hover/upload:opacity-100 focus:opacity-100"
          >
            <X className="h-4 w-4" />
          </button>
        </span>
      ))}
    </>
  );
}

function AgentSelectedTemplatePill({ template, onClear }: { template: AgentTemplateCard; onClear: () => void }) {
  const Icon = template.icon;

  return (
    <span className="flex h-10 items-center gap-2 rounded-full bg-[#eef6ff] px-3 text-sm font-semibold text-slate-800 ring-2 ring-[#78b7ff]">
      <span className={`flex h-6 w-6 items-center justify-center rounded-[7px] bg-gradient-to-br ${template.tone} text-white`}>
        <Icon className="h-3.5 w-3.5" />
      </span>
      <span className="max-w-[150px] truncate">{template.name}</span>
      <button
        type="button"
        aria-label="Clear selected template"
        onClick={onClear}
        className="flex h-5 w-5 items-center justify-center rounded-full text-slate-500 transition hover:bg-white hover:text-slate-900"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </span>
  );
}

function CreationSidebar({
  activeSection,
  isCollapsed,
  onSectionChange,
  onToggleCollapse,
}: {
  activeSection: SectionId;
  isCollapsed: boolean;
  onSectionChange: (section: SectionId) => void;
  onToggleCollapse: () => void;
}) {
  return (
    <aside
      className={`flex w-full shrink-0 flex-col border-b border-slate-200 bg-white transition-[width] duration-300 md:fixed md:inset-y-0 md:left-0 md:z-20 md:border-b-0 md:border-r ${
        isCollapsed ? 'md:w-[84px]' : 'md:w-[248px]'
      }`}
    >
      <div className={`group/logo flex items-center px-4 py-3 ${isCollapsed ? 'md:justify-center' : 'gap-2'}`}>
        {isCollapsed ? (
          <button
            type="button"
            aria-label="Expand sidebar"
            onClick={onToggleCollapse}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition md:hover:bg-slate-50"
          >
            <span className="block group-hover/logo:hidden">
              <Image src="/logo.svg" alt="PhotoGrid" width={28} height={28} priority />
            </span>
            <ChevronRight className="hidden h-4 w-4 text-slate-500 transition group-hover/logo:block" />
          </button>
        ) : (
          <>
            <span className="flex w-9 shrink-0 justify-center">
              <Image src="/logo.svg" alt="PhotoGrid" width={28} height={28} priority />
            </span>
            <span className="text-[19px] font-semibold tracking-tight text-slate-950">PhotoGrid</span>
            <button
              type="button"
              aria-label="Collapse sidebar"
              onClick={onToggleCollapse}
              className="ml-auto hidden h-7 w-7 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-50 hover:text-[#2fbfc7] md:flex"
            >
              <ChevronRight className="h-4 w-4 rotate-180" />
            </button>
          </>
        )}
      </div>

      <div className={`flex min-h-0 flex-1 flex-col overflow-y-auto pb-4 sidebar-scrollbar ${isCollapsed ? 'px-3 md:px-2' : 'px-4'}`}>
        <button
          type="button"
          onClick={() => onSectionChange('home')}
          className={`mb-4 flex h-11 w-full items-center justify-center rounded-full bg-[#39c7cf] text-[15px] font-semibold text-white shadow-[0_12px_26px_rgba(57,199,207,0.2)] transition hover:bg-[#30b9c1] ${
            isCollapsed ? 'md:mx-auto md:w-11' : ''
          }`}
        >
          <Plus className={`h-5 w-5 ${isCollapsed ? '' : 'mr-2'}`} />
          <span className={isCollapsed ? 'md:hidden' : ''}>Create New</span>
        </button>

        <nav className="flex flex-col gap-2" aria-label="Creation navigation">
          {sectionNavItems.map((item) => (
            <SidebarSectionButton
              key={item.id}
              item={item}
              isActive={activeSection === item.id}
              isCollapsed={isCollapsed}
              onClick={() => onSectionChange(item.id)}
            />
          ))}
        </nav>

        <div className="mt-auto pt-3">
          <div className="grid gap-1.5">
            {resourceCards.map((item) => (
              <SidebarResourceLink key={item.name} item={item} isCollapsed={isCollapsed} />
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}

function SidebarSectionButton({
  item,
  isActive,
  isCollapsed,
  onClick,
}: {
  item: SectionNavItem;
  isActive: boolean;
  isCollapsed: boolean;
  onClick: () => void;
}) {
  const Icon = item.icon;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex min-h-[44px] rounded-[8px] text-left transition ${
        isActive ? 'bg-cyan-50 text-[#2fbfc7]' : 'text-slate-700 hover:bg-slate-50 hover:text-[#2fbfc7]'
      } ${isCollapsed ? 'md:min-h-[58px] md:flex-col md:items-center md:justify-center md:gap-1 md:px-1' : 'items-center gap-3 pl-0 pr-3'}`}
      title={item.label}
    >
      <span className={`flex shrink-0 justify-center ${isCollapsed ? 'md:w-auto' : 'w-8'}`}>
        <Icon className={`${isCollapsed ? 'md:h-[19px] md:w-[19px]' : 'h-5 w-5'} ${isActive ? 'text-[#2fbfc7]' : 'text-current'}`} />
      </span>
      <span className={`min-w-0 flex-1 ${isCollapsed ? 'md:flex-none' : ''}`}>
        <span className={`block truncate font-semibold ${isCollapsed ? 'md:max-w-[64px] md:text-center md:text-[11px]' : 'text-[15px]'}`}>{item.label}</span>
      </span>
      <ChevronRight className={`h-4 w-4 shrink-0 ${isActive ? 'text-[#2fbfc7]' : 'text-slate-300'} ${isCollapsed ? 'md:hidden' : ''}`} />
    </button>
  );
}

function SidebarResourceLink({ item, isCollapsed }: { item: HubCard; isCollapsed: boolean }) {
  const Icon = item.icon;

  return (
    <a
      href={item.href}
      title={item.name}
      className={`group flex h-10 items-center gap-3 rounded-[8px] text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-[#2fbfc7] ${
        isCollapsed ? 'md:justify-center md:px-0' : 'pl-0 pr-2.5'
      }`}
    >
      <span className={`flex shrink-0 justify-center ${isCollapsed ? 'md:w-auto' : 'w-8'}`}>
        <Icon className="h-[18px] w-[18px] text-current" />
      </span>
      <span className={`min-w-0 flex-1 truncate ${isCollapsed ? 'md:hidden' : ''}`}>{item.name}</span>
      {item.name === 'Language' ? <ChevronRight className={`h-4 w-4 text-slate-300 group-hover:text-[#2fbfc7] ${isCollapsed ? 'md:hidden' : ''}`} /> : null}
    </a>
  );
}

function UtilityToolCard({ tool, compact = false }: { tool: HubCard; compact?: boolean }) {
  const Icon = tool.icon;

  return (
    <a
      href={tool.href}
      className={`${tool.tone} group relative flex min-w-0 ${compact ? 'min-h-[66px]' : 'min-h-[84px]'} items-center gap-3 rounded-[8px] p-3 text-left shadow-[0_10px_24px_rgba(15,23,42,0.04)] ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(15,23,42,0.07)]`}
    >
      {tool.status ? (
        <span className="absolute right-3 top-3 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
          {tool.status}
        </span>
      ) : null}
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] bg-slate-50">
        <Icon className={`h-5 w-5 ${tool.iconTone}`} />
      </span>
      <span className="min-w-0 pr-9">
        <span className="block truncate text-sm font-semibold text-slate-800">{tool.name}</span>
        <span className={`${compact ? 'line-clamp-1' : 'line-clamp-2'} mt-0.5 block text-xs leading-5 text-slate-500`}>
          {tool.description}
        </span>
      </span>
      <ChevronRight className="ml-auto h-4 w-4 shrink-0 text-slate-300 group-hover:text-[#2fbfc7]" />
    </a>
  );
}

function ShowcaseCard({ tool }: { tool: HubCard }) {
  const Icon = tool.icon;

  return (
    <a
      href={tool.href}
      className={`${tool.tone} group relative flex min-h-[170px] min-w-0 overflow-hidden rounded-[8px] p-4 shadow-[0_14px_32px_rgba(15,23,42,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(15,23,42,0.12)]`}
    >
      <div className="relative z-10 flex h-full min-w-0 flex-col justify-between">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/85 shadow-sm">
          <Icon className={`h-5 w-5 ${tool.iconTone === 'text-white' ? 'text-slate-800' : tool.iconTone}`} />
        </span>
        <span>
          <span className={`block text-lg font-semibold ${tool.iconTone}`}>{tool.name}</span>
          <span className={`mt-1 line-clamp-2 block text-xs leading-5 ${tool.iconTone === 'text-white' ? 'text-white/82' : 'text-slate-800/70'}`}>
            {tool.description}
          </span>
        </span>
      </div>
      <span className="absolute -right-8 bottom-4 h-28 w-24 rotate-6 rounded-[8px] bg-white/28 ring-1 ring-white/35 transition group-hover:rotate-3" />
      <span className="absolute right-7 top-5 h-10 w-10 rounded-full bg-white/18" />
    </a>
  );
}
