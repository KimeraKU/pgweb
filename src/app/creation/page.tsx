'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  BookOpen,
  Box,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
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
  Scissors,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
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

type ProjectType =
  | 'AI Agent'
  | 'AI Image'
  | 'AI Video'
  | 'AI Photo Editor'
  | 'E-commerce Video'
  | 'AI Avatar'
  | 'Background Remover'
  | 'Templates';

type ProjectGalleryItem = {
  title: string;
  type: ProjectType;
  tone: string;
  size?: 'wide' | 'tall' | 'large' | 'small';
};

type ProjectDateGroup = {
  date: string;
  items: ProjectGalleryItem[];
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

const projectTypeOptions: Array<'All type' | ProjectType> = [
  'All type',
  'AI Agent',
  'AI Image',
  'AI Video',
  'AI Photo Editor',
  'E-commerce Video',
  'AI Avatar',
  'Background Remover',
  'Templates',
];

const projectDateGroups: ProjectDateGroup[] = [
  {
    date: 'Jun 10',
    items: [
      {
        title: 'Product showcase draft',
        type: 'E-commerce Video',
        tone: 'from-[#fed7aa] via-[#cbd5e1] to-[#475569]',
        size: 'wide',
      },
    ],
  },
  {
    date: 'Jun 09',
    items: [
      {
        title: 'Avatar try-on concept',
        type: 'AI Avatar',
        tone: 'from-[#e0f2fe] via-white to-[#64748b]',
        size: 'tall',
      },
      {
        title: 'Clean product portrait',
        type: 'AI Photo Editor',
        tone: 'from-[#f8fafc] via-[#e2e8f0] to-[#94a3b8]',
        size: 'tall',
      },
      {
        title: 'UGC creator frame',
        type: 'AI Video',
        tone: 'from-[#ede9fe] via-[#fce7f3] to-[#94a3b8]',
        size: 'tall',
      },
    ],
  },
  {
    date: 'Jun 05',
    items: [
      {
        title: 'Listing hero image',
        type: 'AI Image',
        tone: 'from-[#fff7ed] via-[#fde68a] to-[#f97316]',
        size: 'tall',
      },
      {
        title: 'Brand poster template',
        type: 'Templates',
        tone: 'from-[#fecdd3] via-white to-[#c4b5fd]',
        size: 'tall',
      },
      {
        title: 'Background cleanup',
        type: 'Background Remover',
        tone: 'from-[#dcfce7] via-white to-[#86efac]',
        size: 'tall',
      },
    ],
  },
  {
    date: 'Jun 04',
    items: [
      {
        title: 'Agent campaign brief',
        type: 'AI Agent',
        tone: 'from-[#dbeafe] via-white to-[#93c5fd]',
        size: 'tall',
      },
      {
        title: 'Short drama ad shot',
        type: 'E-commerce Video',
        tone: 'from-[#fee2e2] via-[#fed7aa] to-[#ef4444]',
        size: 'tall',
      },
      {
        title: 'Product variant render',
        type: 'AI Image',
        tone: 'from-[#f0fdf4] via-white to-[#22c55e]',
        size: 'tall',
      },
      {
        title: 'Creator video hook',
        type: 'AI Video',
        tone: 'from-[#cffafe] via-white to-[#0f766e]',
        size: 'small',
      },
      {
        title: 'A+ detail page banner',
        type: 'Templates',
        tone: 'from-[#e0e7ff] via-white to-[#6366f1]',
        size: 'wide',
      },
      {
        title: 'Studio product scene',
        type: 'AI Photo Editor',
        tone: 'from-[#fef3c7] via-white to-[#92400e]',
        size: 'small',
      },
      {
        title: 'Lifestyle background',
        type: 'Background Remover',
        tone: 'from-[#dcfce7] via-[#fefce8] to-[#166534]',
        size: 'wide',
      },
      {
        title: 'Avatar presenter',
        type: 'AI Avatar',
        tone: 'from-[#fce7f3] via-white to-[#be185d]',
        size: 'wide',
      },
    ],
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
  const activeMeta = sectionMeta[activeSection];

  return (
    <main className="min-h-screen bg-[#f6f8fb] text-slate-950">
      <div className="flex min-h-screen flex-col md:flex-row">
        <CreationSidebar activeSection={activeSection} onSectionChange={setActiveSection} />

        <section className="min-w-0 flex-1 bg-white px-4 py-3 sm:px-5 md:ml-[248px] lg:px-6">
          <div className="mx-auto flex w-full min-w-0 max-w-7xl flex-col gap-4">
            <TopBar activeLabel={activeMeta.eyebrow} />

            {activeSection === 'home' ? (
              <HomePanel onSectionChange={setActiveSection} />
            ) : activeSection === 'tools' ? (
              <ToolsLibraryPanel />
            ) : activeSection === 'projects' ? (
              <ProjectsPanel />
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

function TopBar({ activeLabel }: { activeLabel: string }) {
  return (
    <header className="flex h-10 items-center justify-between gap-4">
      <div className="flex min-w-0 items-center gap-3 text-sm font-semibold text-slate-700">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-slate-700">F</span>
        <span className="truncate">Feng Lin&apos;s workspace</span>
        <ChevronRight className="h-4 w-4 rotate-90 text-slate-400" />
        <span className="h-5 w-px bg-slate-200" />
        <span className="text-slate-950">{activeLabel}</span>
      </div>
      <div className="hidden items-center gap-2 sm:flex">
        <a href="#" className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
          Help
        </a>
        <a href="#" className="rounded-full bg-[#14d969] px-4 py-2 text-xs font-semibold text-slate-950 shadow-[0_10px_24px_rgba(20,217,105,0.18)]">
          Upgrade
        </a>
      </div>
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
        {promoCards.map((item) => {
          return (
            <a
              key={item.title}
              href="#"
              className={`group flex min-h-[132px] w-[250px] shrink-0 flex-col justify-between rounded-[14px] bg-gradient-to-br ${item.tone} p-4 ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(15,23,42,0.08)]`}
            >
              <span className="flex items-center justify-between gap-3">
                <span className="rounded-full bg-white/85 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500 ring-1 ring-white">
                  {item.kicker}
                </span>
              </span>
              <span>
                <span className="line-clamp-1 text-base font-semibold text-slate-950">{item.title}</span>
                <span className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">{item.description}</span>
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
  return (
    <div className="grid min-w-0 gap-7">
      {templateShowcaseSections.map((section) => (
        <TemplateShowcaseBlock key={section.title} section={section} />
      ))}
    </div>
  );
}

function TemplateShowcaseBlock({ section }: { section: TemplateShowcaseSection }) {
  return (
    <section className="min-w-0" aria-labelledby={`template-${section.title.replace(/\s+/g, '-').toLowerCase()}`}>
      <div className="mb-4 flex flex-wrap items-center gap-x-5 gap-y-2">
        <h2 id={`template-${section.title.replace(/\s+/g, '-').toLowerCase()}`} className="text-xl font-semibold tracking-tight text-slate-950">
          {section.title}
        </h2>
        <p className="text-sm text-slate-500">{section.description}</p>
        <a href="#" className="ml-auto hidden items-center gap-1 text-sm font-semibold text-slate-400 transition hover:text-[#2fbfc7] sm:flex">
          See All
          <ChevronRight className="h-4 w-4" />
        </a>
      </div>

      <div className="mb-4 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {section.tabs.map((tab, index) => (
          <button
            key={tab}
            type="button"
            className={`h-8 shrink-0 rounded-full px-4 text-sm font-semibold transition ${
              index === 0 ? 'bg-cyan-50 text-[#18aeb8]' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex min-w-0 gap-4 overflow-x-auto pb-1 scrollbar-hide">
        {section.cards.map((card, index) => (
          <TemplatePreviewCard key={`${section.title}-${card.name}`} card={card} highlight={index === 0} />
        ))}
      </div>
    </section>
  );
}

function TemplatePreviewCard({ card, highlight }: { card: TemplatePreviewCard; highlight: boolean }) {
  const Icon = card.icon;

  return (
    <a href="#" className="group w-[176px] shrink-0 overflow-hidden rounded-[14px] bg-slate-50 ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-[0_14px_32px_rgba(15,23,42,0.08)]">
      <div className={`relative h-[216px] overflow-hidden bg-gradient-to-br ${card.tone}`}>
        <div className="absolute left-3 top-3 rounded-[10px] bg-slate-950/65 px-2.5 py-1 text-xs font-semibold text-white">
          {card.duration ?? 'Template'}
        </div>
        <div className="absolute inset-x-5 top-16 h-28 rounded-[22px] bg-white/30 blur-[1px]" />
        <div className="absolute bottom-9 left-1/2 flex h-20 w-20 -translate-x-1/2 items-center justify-center rounded-full bg-white/80 text-slate-800 shadow-sm">
          <Icon className="h-9 w-9" />
        </div>
        {highlight ? (
          <button
            type="button"
            className="absolute inset-x-4 bottom-4 h-11 rounded-[12px] bg-[#39c7cf] text-sm font-semibold text-white shadow-[0_10px_22px_rgba(57,199,207,0.22)]"
          >
            Use Template
          </button>
        ) : null}
      </div>
      <div className="px-3 py-3 text-center">
        <p className="truncate text-sm font-semibold text-slate-800">{card.name}</p>
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
  const tones = [
    'from-[#fff7ed] via-[#fef3c7] to-[#fed7aa]',
    'from-[#e0f2fe] via-[#f8fafc] to-[#bfdbfe]',
    'from-[#f5f3ff] via-[#fdf2f8] to-[#ddd6fe]',
    'from-[#f0fdf4] via-[#f8fafc] to-[#bbf7d0]',
    'from-[#f8fafc] via-[#e2e8f0] to-[#cbd5e1]',
  ];

  return (
    <a
      href={tool.href}
      className="group overflow-hidden rounded-[14px] bg-white ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-[0_14px_32px_rgba(15,23,42,0.08)]"
    >
      <div className={`relative h-[138px] bg-gradient-to-br ${tones[index % tones.length]}`}>
        <div className="absolute inset-x-4 top-5 grid grid-cols-2 gap-3">
          <span className="h-20 rounded-[12px] bg-white/70 shadow-sm" />
          <span className="h-20 rounded-[12px] bg-white/45 shadow-sm" />
        </div>
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

function ProjectsPanel() {
  const [selectedType, setSelectedType] = useState<'All type' | ProjectType>('All type');
  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const visibleGroups = projectDateGroups
    .map((group) => ({
      ...group,
      items: selectedType === 'All type' ? group.items : group.items.filter((item) => item.type === selectedType),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <section className="min-w-0 pb-8" aria-labelledby="projects-gallery">
      <h1 id="projects-gallery" className="sr-only">
        Projects
      </h1>

      <div className="mb-5 flex flex-wrap items-center gap-3 border-b border-slate-100 pb-4">
        <button
          type="button"
          className="flex h-10 items-center gap-2 rounded-[8px] bg-slate-50 px-3 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 transition hover:bg-white"
        >
          <CalendarDays className="h-4 w-4" />
          Time Range
        </button>
        <button
          type="button"
          className="flex h-10 items-center gap-2 rounded-[8px] bg-slate-50 px-3 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 transition hover:bg-white"
        >
          <SlidersHorizontal className="h-4 w-4" />
          View Mode
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={() => setIsTypeOpen((value) => !value)}
            className={`flex h-10 min-w-[150px] items-center justify-between gap-3 rounded-[8px] bg-white px-3 text-sm font-semibold text-slate-800 ring-1 transition ${
              isTypeOpen ? 'ring-[#5b6cff]' : 'ring-slate-200 hover:ring-slate-300'
            }`}
          >
            <span>{selectedType}</span>
            <ChevronDown className={`h-4 w-4 text-slate-500 transition ${isTypeOpen ? 'rotate-180' : ''}`} />
          </button>
          {isTypeOpen ? (
            <div className="absolute left-0 top-12 z-20 w-[230px] overflow-hidden rounded-[14px] bg-white p-2 shadow-[0_18px_46px_rgba(15,23,42,0.14)] ring-1 ring-slate-200">
              {projectTypeOptions.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => {
                    setSelectedType(type);
                    setIsTypeOpen(false);
                  }}
                  className="flex h-11 w-full items-center gap-3 rounded-[10px] px-3 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  <span className="flex h-5 w-5 items-center justify-center">
                    {selectedType === type ? <Check className="h-4 w-4 text-[#2fbfc7]" /> : null}
                  </span>
                  {type}
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <label className="relative ml-auto block w-full min-w-[240px] sm:w-[420px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-300" />
          <input
            type="search"
            placeholder="Search projects..."
            className="h-10 w-full rounded-[10px] bg-slate-50 pl-10 pr-3 text-sm text-slate-800 outline-none ring-1 ring-slate-200 transition placeholder:text-slate-400 focus:bg-white focus:ring-[#2fbfc7]"
          />
        </label>
      </div>

      <div className="grid gap-7">
        {visibleGroups.map((group) => (
          <section key={group.date} className="min-w-0" aria-labelledby={`project-date-${group.date.replace(/\s+/g, '-').toLowerCase()}`}>
            <h2 id={`project-date-${group.date.replace(/\s+/g, '-').toLowerCase()}`} className="mb-3 text-base font-semibold text-slate-600">
              {group.date}
            </h2>
            <div className="flex flex-wrap items-start gap-3">
              {group.items.map((item) => (
                <ProjectGalleryCard key={`${group.date}-${item.title}`} item={item} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}

function ProjectGalleryCard({ item }: { item: ProjectGalleryItem }) {
  const sizeClass =
    item.size === 'wide'
      ? 'h-[190px] w-full sm:w-[390px]'
      : item.size === 'small'
        ? 'h-[190px] w-[160px]'
        : item.size === 'large'
          ? 'h-[280px] w-full sm:w-[460px]'
          : 'h-[260px] w-[170px]';

  return (
    <button
      type="button"
      className={`group relative overflow-hidden rounded-[12px] bg-gradient-to-br ${item.tone} ${sizeClass} text-left ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(15,23,42,0.1)]`}
    >
      <span className="absolute inset-x-4 top-4 h-10 rounded-[10px] bg-white/35 blur-[1px]" />
      <span className="absolute bottom-12 left-4 h-16 w-16 rounded-full bg-white/30" />
      <span className="absolute bottom-5 right-5 h-24 w-24 rounded-[18px] bg-white/35 shadow-sm ring-1 ring-white/40" />
      <span className="absolute left-3 top-3 rounded-full bg-white/85 px-2.5 py-1 text-[11px] font-semibold text-slate-600 ring-1 ring-white/80">
        {item.type}
      </span>
      <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/50 to-transparent p-3 pt-10">
        <span className="block truncate text-sm font-semibold text-white">{item.title}</span>
      </span>
    </button>
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
    <section className="min-w-0 rounded-[20px] bg-[linear-gradient(180deg,#f8fafc_0%,#ffffff_100%)] px-4 py-6 ring-1 ring-slate-200">
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
  onSectionChange,
}: {
  activeSection: SectionId;
  onSectionChange: (section: SectionId) => void;
}) {
  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-slate-200 bg-white md:fixed md:inset-y-0 md:left-0 md:z-20 md:w-[248px] md:border-b-0 md:border-r">
      <div className="flex items-center gap-2 px-4 py-3">
        <span className="flex w-8 shrink-0 justify-center">
          <Image src="/logo.svg" alt="PhotoGrid" width={24} height={24} priority />
        </span>
        <span className="text-[17px] font-semibold tracking-tight text-slate-950">PhotoGrid</span>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 pb-4 sidebar-scrollbar">
        <button
          type="button"
          onClick={() => onSectionChange('home')}
          className="mb-4 flex h-11 w-full items-center justify-center rounded-full bg-[#39c7cf] text-[15px] font-semibold text-white shadow-[0_12px_26px_rgba(57,199,207,0.2)] transition hover:bg-[#30b9c1]"
        >
          <Plus className="mr-2 h-5 w-5" />
          Create New
        </button>

        <nav className="flex flex-col gap-2" aria-label="Creation navigation">
          {sectionNavItems.map((item) => (
            <SidebarSectionButton
              key={item.id}
              item={item}
              isActive={activeSection === item.id}
              onClick={() => onSectionChange(item.id)}
            />
          ))}
        </nav>

        <div className="mt-auto pt-5">
          <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">Resources</p>
          <div className="grid gap-1.5">
            {resourceCards.map((item) => (
              <SidebarResourceLink key={item.name} item={item} />
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
  onClick,
}: {
  item: SectionNavItem;
  isActive: boolean;
  onClick: () => void;
}) {
  const Icon = item.icon;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex min-h-[44px] items-center gap-3 rounded-[8px] pl-0 pr-3 text-left transition ${
        isActive ? 'bg-cyan-50 text-[#2fbfc7]' : 'text-slate-700 hover:bg-slate-50 hover:text-[#2fbfc7]'
      }`}
    >
      <span className="flex w-8 shrink-0 justify-center">
        <Icon className={`h-5 w-5 ${isActive ? 'text-[#2fbfc7]' : 'text-current'}`} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[15px] font-semibold">{item.label}</span>
      </span>
      <ChevronRight className={`h-4 w-4 shrink-0 ${isActive ? 'text-[#2fbfc7]' : 'text-slate-300'}`} />
    </button>
  );
}

function SidebarResourceLink({ item }: { item: HubCard }) {
  const Icon = item.icon;

  return (
    <a href={item.href} className="group flex h-10 items-center gap-3 rounded-[8px] pl-0 pr-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-[#2fbfc7]">
      <span className="flex w-8 shrink-0 justify-center">
        <Icon className="h-[18px] w-[18px] text-current" />
      </span>
      <span className="min-w-0 flex-1 truncate">{item.name}</span>
      {item.name === 'Language' ? <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-[#2fbfc7]" /> : null}
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
