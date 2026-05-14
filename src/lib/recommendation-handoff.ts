export type RecommendationIntentType =
  | 'portrait_selfie'
  | 'product_ecommerce'
  | 'generic_fallback';

export type RecommendationHandoffPayload = {
  imageUrl: string;
  intentType: RecommendationIntentType;
  sourcePage: string;
  target?: string;
  handoffId?: string;
  experimentGroup?: string;
  recoSurface?: string;
  title?: string;
  category?: string;
  createdAt: number;
};

export const RECOMMENDATION_HANDOFF_KEY = 'recommendation-handoff-v1';

export function saveRecommendationHandoff(payload: RecommendationHandoffPayload) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(RECOMMENDATION_HANDOFF_KEY, JSON.stringify(payload));
  } catch {
    /* ignore */
  }
}

export function loadRecommendationHandoff(): RecommendationHandoffPayload | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(RECOMMENDATION_HANDOFF_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as RecommendationHandoffPayload;
    if (!parsed?.imageUrl || !parsed?.intentType || !parsed?.sourcePage) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearRecommendationHandoff() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(RECOMMENDATION_HANDOFF_KEY);
  } catch {
    /* ignore */
  }
}
