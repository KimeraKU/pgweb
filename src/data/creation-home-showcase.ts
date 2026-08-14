export type CreationHomeShowcaseSection = {
  title: string;
  description: string;
  previewSet: 'ads' | 'product' | 'creator';
};

export type CreationHomeShowcaseCategory = {
  id: string;
  title: string;
  sections: CreationHomeShowcaseSection[];
};

export const creationHomeShowcaseCategories: CreationHomeShowcaseCategory[] = [
  {
    id: 'popular',
    title: 'Popular',
    sections: [
      {
        title: 'Trending Photo Template',
        description: '',
        previewSet: 'product',
      },
      {
        title: 'Trending AI Video Templates',
        description: '',
        previewSet: 'ads',
      },
    ],
  },
  {
    id: 'creative-effects',
    title: 'Creative Effects',
    sections: [
      {
        title: 'AI Dance',
        description: 'Make anyone move with AI dance effects.',
        previewSet: 'creator',
      },
      {
        title: 'Anime',
        description: 'Turn photos into stunning anime art.',
        previewSet: 'product',
      },
      {
        title: 'Filters',
        description: 'Transform photos with AI-powered filters.',
        previewSet: 'product',
      },
      {
        title: 'Face Morph',
        description: 'Create fun and surprising face transformations.',
        previewSet: 'product',
      },
      {
        title: 'Art Styles',
        description: 'Turn photos into paintings and classic art.',
        previewSet: 'product',
      },
      {
        title: 'Photo to Video',
        description: 'Bring your photos to life with AI video.',
        previewSet: 'creator',
      },
    ],
  },
  {
    id: 'beauty',
    title: 'Beauty',
    sections: [
      {
        title: 'Portrait Effects',
        description: 'Transform portraits with AI effects.',
        previewSet: 'product',
      },
      {
        title: 'Idol Styles',
        description: '',
        previewSet: 'product',
      },
      {
        title: 'Fashion & Makeup',
        description: 'Highlight stylish outfits and makeup.',
        previewSet: 'product',
      },
      {
        title: 'Accessories',
        description: 'Try stylish outfits and accessories.',
        previewSet: 'product',
      },
    ],
  },
  {
    id: 'e-commerce',
    title: 'E-Commerce',
    sections: [
      {
        title: 'Product Reviews',
        description: 'Create authentic product review content.',
        previewSet: 'ads',
      },
      {
        title: 'Product Showcase',
        description: "Highlight your product's key features.",
        previewSet: 'ads',
      },
      {
        title: 'Before & After',
        description: 'Show clear product results and contrast.',
        previewSet: 'product',
      },
      {
        title: 'Product Photography',
        description: 'Create polished product photos with AI.',
        previewSet: 'product',
      },
      {
        title: 'E-Commerce Assets',
        description: 'Create visuals for stores and product listings.',
        previewSet: 'product',
      },
      {
        title: 'Platform Kits',
        description: 'Create ready-to-use visuals for online platforms.',
        previewSet: 'product',
      },
    ],
  },
  {
    id: 'lifestyle',
    title: 'Lifestyle',
    sections: [
      {
        title: 'Kids',
        description: 'Create warm and playful edits for kids.',
        previewSet: 'product',
      },
      {
        title: 'Pets',
        description: '',
        previewSet: 'product',
      },
      {
        title: 'Duo Interaction',
        description: 'Create fun AI moments made for two.',
        previewSet: 'creator',
      },
      {
        title: 'Travel & Wallpapers',
        description: 'Capture travel memories and HD wallpapers.',
        previewSet: 'product',
      },
      {
        title: 'Family Moments',
        description: 'Celebrate meaningful moments with family.',
        previewSet: 'product',
      },
    ],
  },
  {
    id: 'seasonal',
    title: 'Seasonal',
    sections: [
      {
        title: 'Back to School',
        description: 'Get ready for the new school season.',
        previewSet: 'product',
      },
      {
        title: 'Birthday',
        description: '',
        previewSet: 'product',
      },
      {
        title: 'Anniversary',
        description: '',
        previewSet: 'product',
      },
      {
        title: 'Halloween',
        description: '',
        previewSet: 'product',
      },
      {
        title: 'Christmas',
        description: '',
        previewSet: 'product',
      },
      {
        title: "Mother's Day",
        description: '',
        previewSet: 'product',
      },
    ],
  },
];
