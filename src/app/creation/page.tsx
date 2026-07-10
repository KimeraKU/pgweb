'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  BookOpen,
  Box,
  CalendarDays,
  Check,
  ChevronRight,
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
  Maximize,
  MoreHorizontal,
  Newspaper,
  PenTool,
  Plus,
  Search,
  Send,
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

type AgentModeCard = {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  tone: string;
  fields?: AgentTemplateField[];
};

type AgentTemplateField =
  | {
      type: 'input';
      placeholder: string;
    }
  | {
      type: 'select';
      value: string;
      options: string[];
    };

type AgentTemplateCard = AgentModeCard & {
  fields: AgentTemplateField[];
};

type AgentGroupCard = AgentModeCard & {
  children: AgentTemplateCard[];
};

type ProjectTaskType = 'Image' | 'Video' | 'Audio' | 'Agent Sessions' | 'Avatar';
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
    cards: [toolCards[0], toolCards[1], toolCards[7], toolCards[4], toolCards[3], toolCards[2]],
  },
  {
    title: 'Video Tools',
    cards: [featuredToolCards[1], toolCards[5], toolCards[6]],
  },
  {
    title: 'Creative Utilities',
    cards: [agentToolCard, featuredToolCards[2], toolCards[0], toolCards[1], toolCards[7]],
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

const projectTaskTabs: Array<'All' | ProjectTaskType> = ['All', 'Image', 'Video', 'Audio', 'Agent Sessions', 'Avatar'];
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
          <div className="mx-auto flex w-full min-w-0 max-w-7xl flex-col gap-4">
            {activeSection === 'home' || activeSection === 'projects' ? null : <PageTitle title={activeMeta.eyebrow} />}

            {activeSection === 'home' ? (
              <HomePanel onSectionChange={setActiveSection} />
            ) : activeSection === 'tools' ? (
              <ToolsLibraryPanel />
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

function PageTitle({ title }: { title: string }) {
  return (
    <header className="-mb-1 flex items-center">
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

function HomePanel({ onSectionChange }: { onSectionChange: (section: SectionId) => void }) {
  return (
    <div className="grid min-w-0 gap-5">
      <AgentEntryPrototype />
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
    setSelectedProjectKeys((current) => (current.includes(key) ? current.filter((item) => item !== key) : [...current, key]));
  };
  const clearProjectSelection = () => {
    setIsProjectSelectionMode(false);
    setSelectedProjectKeys([]);
  };
  const toggleUploadSelection = (project: ProjectGalleryItem) => {
    const key = getGalleryItemKey(project);
    setSelectedUploadKeys((current) => (current.includes(key) ? current.filter((item) => item !== key) : [...current, key]));
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
              onStart={() => {
                setIsProjectSelectionMode(true);
                setOpenProjectMenu(null);
              }}
              onCancel={clearProjectSelection}
              onAction={clearProjectSelection}
            />
          ) : (
            <SelectionActions
              isSelecting={isUploadSelectionMode}
              selectedCount={selectedUploadKeys.length}
              onStart={() => {
                setIsUploadSelectionMode(true);
                setOpenUploadMenu(null);
              }}
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
  onStart,
  onCancel,
  onAction,
}: {
  isSelecting: boolean;
  selectedCount: number;
  onStart: () => void;
  onCancel: () => void;
  onAction: () => void;
}) {
  if (!isSelecting) {
    return (
      <button
        type="button"
        onClick={onStart}
        className="ml-auto h-8 rounded-full bg-slate-100 px-3 text-xs font-semibold text-slate-600 transition hover:bg-slate-200 hover:text-slate-950"
      >
        Select
      </button>
    );
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

function SelectionCheckbox({ isSelected, onToggle }: { isSelected: boolean; onToggle: () => void }) {
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
        isSelected ? 'bg-[#2fbfc7] text-white ring-[#2fbfc7]' : 'bg-white/90 text-transparent ring-white hover:text-slate-300'
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
        {isSelecting && onToggleSelect ? <SelectionCheckbox isSelected={isSelected} onToggle={onToggleSelect} /> : null}
        <span className={`absolute top-3 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-slate-500 ring-1 ring-white ${isSelecting ? 'left-12' : 'left-3'}`}>Audio</span>
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
        {isSelecting && onToggleSelect ? <SelectionCheckbox isSelected={isSelected} onToggle={onToggleSelect} /> : null}
        <span className={`absolute top-3 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-slate-500 ring-1 ring-white ${isSelecting ? 'left-12' : 'left-3'}`}>
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
  const agentGroups: AgentGroupCard[] = [
    {
      id: 'ecommerce-video',
      name: 'E-commerce Video',
      description: 'Product ad videos',
      icon: Video,
      tone: 'from-[#ff7a45] via-[#ff4fd8] to-[#8b5cf6]',
      children: [
        {
          id: 'short-drama-ad',
          name: 'Short Drama Ad',
          description: 'Story-driven ads',
          icon: Video,
          tone: 'from-[#ff7a45] via-[#ff4fd8] to-[#8b5cf6]',
          fields: [
            { type: 'input', placeholder: 'Product name' },
            { type: 'select', value: 'TikTok', options: ['TikTok', 'Amazon', 'Instagram'] },
            { type: 'select', value: '15s', options: ['15s', '30s', '45s'] },
            { type: 'select', value: 'English', options: ['English', 'Chinese', 'Spanish'] },
            { type: 'select', value: 'US', options: ['US', 'UK', 'EU'] },
          ],
        },
        {
          id: 'ugc-ad',
          name: 'UGC Ad',
          description: 'Creator style ads',
          icon: UserRound,
          tone: 'from-[#f59e0b] via-[#f97316] to-[#ef4444]',
          fields: [
            { type: 'input', placeholder: 'Product name' },
            { type: 'select', value: 'Creator', options: ['Creator', 'Founder', 'Customer'] },
            { type: 'select', value: '15s', options: ['15s', '30s', '60s'] },
            { type: 'select', value: 'English', options: ['English', 'Chinese', 'Spanish'] },
            { type: 'select', value: 'US', options: ['US', 'UK', 'AU'] },
          ],
        },
        {
          id: 'tvc-ad',
          name: 'TVC Ad',
          description: 'Polished campaign films',
          icon: Video,
          tone: 'from-[#6366f1] via-[#8b5cf6] to-[#d946ef]',
          fields: [
            { type: 'input', placeholder: 'Brand or product' },
            { type: 'select', value: 'Premium', options: ['Premium', 'Minimal', 'Bold'] },
            { type: 'select', value: '30s', options: ['15s', '30s', '60s'] },
            { type: 'select', value: 'English', options: ['English', 'Chinese', 'French'] },
            { type: 'select', value: 'Global', options: ['Global', 'US', 'EU'] },
          ],
        },
        {
          id: 'product-showcase',
          name: 'Product Showcase',
          description: 'Feature-led videos',
          icon: ShoppingBag,
          tone: 'from-[#10c957] to-[#2f80ed]',
          fields: [
            { type: 'input', placeholder: 'Product name' },
            { type: 'select', value: 'Amazon', options: ['Amazon', 'Shopify', 'TikTok'] },
            { type: 'select', value: '1:1', options: ['1:1', '9:16', '16:9'] },
            { type: 'select', value: 'English', options: ['English', 'Chinese', 'Japanese'] },
            { type: 'select', value: 'US', options: ['US', 'UK', 'JP'] },
          ],
        },
      ],
    },
    {
      id: 'ai-editor',
      name: 'AI Editor',
      description: 'Retouch and enhance',
      icon: PenTool,
      tone: 'from-[#16c6d9] to-[#2f80ed]',
      children: [
        {
          id: 'auto-removal',
          name: 'Auto Removal',
          description: 'Remove unwanted areas',
          icon: Eraser,
          tone: 'from-[#f5f3ff] via-[#fdf2f8] to-[#ddd6fe]',
          fields: [
            { type: 'input', placeholder: 'Object or area to remove' },
            { type: 'select', value: 'Auto detect', options: ['Auto detect', 'Brush area', 'Text area'] },
            { type: 'select', value: 'Medium', options: ['Low', 'Medium', 'High'] },
            { type: 'select', value: 'Keep layout', options: ['Keep layout', 'Fill background', 'Clean edge'] },
          ],
        },
        {
          id: 'image-enhance',
          name: 'Image Enhance',
          description: 'Improve clarity',
          icon: Maximize,
          tone: 'from-[#e0f2fe] via-[#f8fafc] to-[#bfdbfe]',
          fields: [
            { type: 'input', placeholder: 'Enhancement goal' },
            { type: 'select', value: 'HD', options: ['HD', '4K', 'Print'] },
            { type: 'select', value: 'Natural', options: ['Natural', 'Sharp', 'Soft'] },
            { type: 'select', value: '1:1', options: ['Original', '1:1', '4:5'] },
          ],
        },
        {
          id: 'background-removal',
          name: 'Background Removal',
          description: 'Cut out subjects',
          icon: Scissors,
          tone: 'from-[#ecfeff] via-white to-[#67e8f9]',
          fields: [
            { type: 'input', placeholder: 'Subject name' },
            { type: 'select', value: 'Transparent', options: ['Transparent', 'White', 'Custom'] },
            { type: 'select', value: 'Product', options: ['Product', 'Portrait', 'Object'] },
            { type: 'select', value: 'Clean edge', options: ['Clean edge', 'Soft edge', 'Keep shadow'] },
          ],
        },
      ],
    },
    {
      id: 'ai-filter',
      name: 'AI Filter',
      description: 'Styles and presets',
      icon: Sparkles,
      tone: 'from-[#14b8a6] to-[#22c55e]',
      children: [
        {
          id: 'product-filter',
          name: 'Product Filter',
          description: 'Commercial looks',
          icon: ShoppingBag,
          tone: 'from-[#f0fdf4] via-white to-[#bbf7d0]',
          fields: [
            { type: 'input', placeholder: 'Product or style keywords' },
            { type: 'select', value: 'Studio', options: ['Studio', 'Lifestyle', 'Luxury'] },
            { type: 'select', value: 'Natural', options: ['Natural', 'Warm', 'Cool'] },
            { type: 'select', value: '1:1', options: ['Original', '1:1', '4:5'] },
          ],
        },
        {
          id: 'portrait-filter',
          name: 'Portrait Filter',
          description: 'People-first styles',
          icon: UserRound,
          tone: 'from-[#fce7f3] via-white to-[#f9a8d4]',
          fields: [
            { type: 'input', placeholder: 'Portrait style' },
            { type: 'select', value: 'Clean', options: ['Clean', 'Cinematic', 'Editorial'] },
            { type: 'select', value: 'Soft', options: ['Soft', 'Detailed', 'High contrast'] },
            { type: 'select', value: 'Original', options: ['Original', '1:1', '3:4'] },
          ],
        },
        {
          id: 'style-filter',
          name: 'Style Filter',
          description: 'Reusable looks',
          icon: Wand2,
          tone: 'from-[#ede9fe] via-white to-[#a78bfa]',
          fields: [
            { type: 'input', placeholder: 'Style direction' },
            { type: 'select', value: 'Modern', options: ['Modern', 'Retro', 'Minimal'] },
            { type: 'select', value: 'Medium', options: ['Low', 'Medium', 'High'] },
            { type: 'select', value: 'Image', options: ['Image', 'Poster', 'Social'] },
          ],
        },
        {
          id: 'color-filter',
          name: 'Color Filter',
          description: 'Tone matching',
          icon: ImageIcon,
          tone: 'from-[#fff7ed] via-white to-[#fdba74]',
          fields: [
            { type: 'input', placeholder: 'Color mood' },
            { type: 'select', value: 'Warm', options: ['Warm', 'Cool', 'Neutral'] },
            { type: 'select', value: 'Balanced', options: ['Balanced', 'Bright', 'Muted'] },
            { type: 'select', value: 'Original', options: ['Original', '1:1', '16:9'] },
          ],
        },
      ],
    },
  ];
  const activeAgentGroup = agentGroups.find((group) => group.id === activeAgentGroupId) ?? null;
  const allAgentTemplates = agentGroups.flatMap((group) => group.children);
  const selectedAgentTemplate = allAgentTemplates.find((template) => template.id === selectedAgentTemplateId) ?? null;
  const visibleAgentModes: Array<AgentModeCard | AgentGroupCard> = activeAgentGroup ? activeAgentGroup.children : agentGroups;
  const agentGridColumns = visibleAgentModes.length === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2 lg:grid-cols-4';
  const agentGridWidth = visibleAgentModes.length === 3 ? 'max-w-2xl' : 'max-w-3xl';
  const selectAgentGroup = (group: AgentGroupCard) => {
    setActiveAgentGroupId(group.id);
    setSelectedAgentTemplateId(group.children[0]?.id ?? null);
  };
  const clearSelectedAgentTemplate = () => {
    setSelectedAgentTemplateId(null);
  };

  return (
    <section id="agent-entry" className="min-w-0 scroll-mt-4">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-center text-[28px] font-semibold leading-tight tracking-tight text-slate-950 sm:text-[40px]">
          Create images, videos, posters, and brand assets with AI
        </h1>

        <div className="mt-6 rounded-[20px] bg-white p-4 shadow-[0_18px_60px_rgba(15,23,42,0.12)] ring-1 ring-slate-200">
          <div className="min-h-[150px]">
            {selectedAgentTemplate ? (
              <AgentTemplateFields fields={selectedAgentTemplate.fields} template={selectedAgentTemplate} onClear={clearSelectedAgentTemplate} />
            ) : null}
            <div className="flex items-start gap-1 text-[20px] font-medium leading-8 text-slate-400">
              <span className="mt-1 h-8 w-px bg-slate-500" />
              <span className="min-w-0 break-words">
                {selectedAgentTemplate
                  ? `Describe your ${selectedAgentTemplate.name.toLowerCase()} request...`
                  : 'Describe what you want to create -- images, videos, posters, brand visuals, and more...'}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Add media"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50"
              >
                <Plus className="h-5 w-5" />
              </button>
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
            </div>

            <button
              type="button"
              className="flex h-11 items-center gap-2 rounded-full bg-slate-950 px-5 text-base font-semibold text-white shadow-[0_14px_30px_rgba(15,23,42,0.2)] transition hover:bg-slate-800"
            >
              <Send className="h-5 w-5 fill-white" />
              Send
            </button>
          </div>
        </div>

        {activeAgentGroup ? (
          <div className="mx-auto mt-5 flex max-w-3xl items-center justify-between px-1">
            <span className="text-sm font-semibold text-slate-500">{activeAgentGroup.name}</span>
            <button
              type="button"
              onClick={() => setActiveAgentGroupId(null)}
              className="text-sm font-semibold text-[#2fbfc7] transition hover:text-[#249aa1]"
            >
              Back
            </button>
          </div>
        ) : null}

        <div className={`mx-auto ${activeAgentGroup ? 'mt-2' : 'mt-5'} grid ${agentGridWidth} gap-3 ${agentGridColumns}`}>
          {visibleAgentModes.map((mode) => {
            const Icon = mode.icon;
            return (
              <button
                key={mode.name}
                type="button"
                onClick={'children' in mode ? () => selectAgentGroup(mode) : () => setSelectedAgentTemplateId(mode.id)}
                className={`group flex min-h-[72px] items-center gap-3 rounded-[18px] bg-white px-4 text-left shadow-[0_10px_26px_rgba(15,23,42,0.06)] ring-1 transition hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(15,23,42,0.1)] ${
                  selectedAgentTemplate?.id === mode.id || activeAgentGroupId === mode.id ? 'ring-[#2fbfc7]' : 'ring-slate-200'
                }`}
              >
                <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] bg-gradient-to-br ${mode.tone} text-white shadow-sm`}>
                  <Icon className="h-5 w-5" />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-base font-semibold text-slate-950">{mode.name}</span>
                  <span className="mt-0.5 block truncate text-sm text-slate-400">{mode.description}</span>
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
  template,
  onClear,
}: {
  fields: AgentTemplateField[];
  template: AgentTemplateCard;
  onClear: () => void;
}) {
  return (
    <div className="mb-5 flex flex-wrap gap-2">
      <AgentSelectedTemplatePill template={template} onClear={onClear} />
      {fields.map((field, index) => {
        if (field.type === 'input') {
          return (
            <input
              key={`${field.placeholder}-${index}`}
              type="text"
              placeholder={field.placeholder}
              className="h-10 min-w-[160px] rounded-[8px] bg-slate-100 px-3 text-sm font-semibold text-slate-800 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-[#78b7ff]"
            />
          );
        }

        return (
          <select
            key={`${field.value}-${index}`}
            defaultValue={field.value}
            className="h-10 rounded-[8px] bg-slate-100 px-3 text-sm font-semibold text-slate-800 outline-none transition focus:bg-white focus:ring-2 focus:ring-[#78b7ff]"
          >
            {field.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      })}
    </div>
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

        <div className="mt-auto pt-5">
          <p className={`mb-2 px-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400 ${isCollapsed ? 'md:hidden' : ''}`}>Resources</p>
          <div className="grid gap-1.5">
            {resourceCards.map((item) => (
              <SidebarResourceLink key={item.name} item={item} isCollapsed={isCollapsed} />
            ))}
          </div>
          <SidebarUserProfile isCollapsed={isCollapsed} />
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

function SidebarUserProfile({ isCollapsed }: { isCollapsed: boolean }) {
  return (
    <div
      title="Feng Lin"
      className={`mt-4 flex items-center border-t border-slate-100 pt-4 ${isCollapsed ? 'md:justify-center' : 'gap-3'}`}
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-700 ring-1 ring-slate-200">
        F
      </span>
      <span className={`min-w-0 ${isCollapsed ? 'md:hidden' : ''}`}>
        <span className="block truncate text-sm font-semibold text-slate-800">Feng Lin</span>
      </span>
    </div>
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
