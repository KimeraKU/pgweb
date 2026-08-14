import assert from 'node:assert/strict';
import { test } from 'node:test';
import { creationHomeShowcaseCategories } from '../src/data/creation-home-showcase';

test('Creation Home 模板推荐内容与产品表一致', () => {
  const visibleContent = creationHomeShowcaseCategories.map(({ title, sections }) => ({
    title,
    sections: sections.map(({ title: sectionTitle, description }) => ({
      title: sectionTitle,
      description,
    })),
  }));

  assert.deepEqual(visibleContent, [
    {
      title: 'Popular',
      sections: [
        { title: 'Trending Photo Template', description: '' },
        { title: 'Trending AI Video Templates', description: '' },
      ],
    },
    {
      title: 'Creative Effects',
      sections: [
        { title: 'AI Dance', description: 'Make anyone move with AI dance effects.' },
        { title: 'Anime', description: 'Turn photos into stunning anime art.' },
        { title: 'Filters', description: 'Transform photos with AI-powered filters.' },
        { title: 'Face Morph', description: 'Create fun and surprising face transformations.' },
        { title: 'Art Styles', description: 'Turn photos into paintings and classic art.' },
        { title: 'Photo to Video', description: 'Bring your photos to life with AI video.' },
      ],
    },
    {
      title: 'Beauty',
      sections: [
        { title: 'Portrait Effects', description: 'Transform portraits with AI effects.' },
        { title: 'Idol Styles', description: '' },
        { title: 'Fashion & Makeup', description: 'Highlight stylish outfits and makeup.' },
        { title: 'Accessories', description: 'Try stylish outfits and accessories.' },
      ],
    },
    {
      title: 'E-Commerce',
      sections: [
        { title: 'Product Reviews', description: 'Create authentic product review content.' },
        { title: 'Product Showcase', description: "Highlight your product's key features." },
        { title: 'Before & After', description: 'Show clear product results and contrast.' },
        { title: 'Product Photography', description: 'Create polished product photos with AI.' },
        { title: 'E-Commerce Assets', description: 'Create visuals for stores and product listings.' },
        { title: 'Platform Kits', description: 'Create ready-to-use visuals for online platforms.' },
      ],
    },
    {
      title: 'Lifestyle',
      sections: [
        { title: 'Kids', description: 'Create warm and playful edits for kids.' },
        { title: 'Pets', description: '' },
        { title: 'Duo Interaction', description: 'Create fun AI moments made for two.' },
        { title: 'Travel & Wallpapers', description: 'Capture travel memories and HD wallpapers.' },
        { title: 'Family Moments', description: 'Celebrate meaningful moments with family.' },
      ],
    },
    {
      title: 'Seasonal',
      sections: [
        { title: 'Back to School', description: 'Get ready for the new school season.' },
        { title: 'Birthday', description: '' },
        { title: 'Anniversary', description: '' },
        { title: 'Halloween', description: '' },
        { title: 'Christmas', description: '' },
        { title: "Mother's Day", description: '' },
      ],
    },
  ]);
});

test('Creation Home 模板推荐分类 ID 唯一且每组均有内容', () => {
  const categoryIds = creationHomeShowcaseCategories.map(({ id }) => id);

  assert.equal(new Set(categoryIds).size, categoryIds.length);
  assert.equal(creationHomeShowcaseCategories.every(({ sections }) => sections.length > 0), true);
});
