export interface SoulColor {
  id: string;
  name: string;
  line1: string;
  line2: string;
  colorGradient: { from: string; to: string };
}

export const SOUL_COLORS: SoulColor[] = [
  {
    id: 'obsidian-violet',
    name: 'Obsidian Violet',
    line1: 'Quietly visionary.',
    line2: 'You think in long arcs and speak only when it matters.',
    colorGradient: { from: '#1a1628', to: '#7c3aed' },
  },
  {
    id: 'fog-blue',
    name: 'Fog Blue',
    line1: 'Curious and inward.',
    line2: 'You explore ideas softly, letting meaning unfold over time.',
    colorGradient: { from: '#9ca3af', to: '#60a5fa' },
  },
  {
    id: 'iron-crimson',
    name: 'Iron Crimson',
    line1: 'Clear and commanding.',
    line2: 'You bring direction and momentum into every conversation.',
    colorGradient: { from: '#4b5563', to: '#dc2626' },
  },
  {
    id: 'electric-gold',
    name: 'Electric Gold',
    line1: 'Playful and sharp.',
    line2: 'You ignite ideas and keep conversations alive with possibility.',
    colorGradient: { from: '#fbbf24', to: '#fde047' },
  },
  {
    id: 'deep-indigo',
    name: 'Deep Indigo',
    line1: 'Reflective and intuitive.',
    line2: 'You sense what\'s unspoken and respond with care.',
    colorGradient: { from: '#1e3a8a', to: '#4f46e5' },
  },
  {
    id: 'rose-quartz',
    name: 'Rose Quartz',
    line1: 'Gentle and sincere.',
    line2: 'You lead with feeling and value emotional truth.',
    colorGradient: { from: '#fbcfe8', to: '#ec4899' },
  },
  {
    id: 'sunlit-amber',
    name: 'Sunlit Amber',
    line1: 'Warm and encouraging.',
    line2: 'You help others feel seen and understood.',
    colorGradient: { from: '#fed7aa', to: '#f59e0b' },
  },
  {
    id: 'sunset-coral',
    name: 'Sunset Coral',
    line1: 'Open and expressive.',
    line2: 'You bring warmth, curiosity, and emotional color into the room.',
    colorGradient: { from: '#ff7f50', to: '#ff6b6b' },
  },
  {
    id: 'slate-gray',
    name: 'Slate Gray',
    line1: 'Grounded and steady.',
    line2: 'You offer clarity through consistency and calm.',
    colorGradient: { from: '#64748b', to: '#475569' },
  },
  {
    id: 'soft-sage',
    name: 'Soft Sage',
    line1: 'Protective and thoughtful.',
    line2: 'You create safety through quiet presence.',
    colorGradient: { from: '#a7f3d0', to: '#10b981' },
  },
  {
    id: 'stone-bronze',
    name: 'Stone Bronze',
    line1: 'Structured and reliable.',
    line2: 'You anchor conversations with clarity and purpose.',
    colorGradient: { from: '#cd7f32', to: '#8b6914' },
  },
  {
    id: 'blush-gold',
    name: 'Blush Gold',
    line1: 'Attentive and social.',
    line2: 'You tune into others and build connection with ease.',
    colorGradient: { from: '#fecdd3', to: '#f59e0b' },
  },
  {
    id: 'steel-blue',
    name: 'Steel Blue',
    line1: 'Calm and precise.',
    line2: 'You observe carefully and act with intention.',
    colorGradient: { from: '#7b8fa3', to: '#3b82f6' },
  },
  {
    id: 'lavender-mist',
    name: 'Lavender Mist',
    line1: 'Sensitive and present.',
    line2: 'You notice beauty and emotion in subtle moments.',
    colorGradient: { from: '#e9d5ff', to: '#a78bfa' },
  },
  {
    id: 'ember-red',
    name: 'Ember Red',
    line1: 'Bold and immediate.',
    line2: 'You bring energy and aliveness into the now.',
    colorGradient: { from: '#fca5a5', to: '#dc2626' },
  },
  {
    id: 'golden-peach',
    name: 'Golden Peach',
    line1: 'Warm and radiant.',
    line2: 'You invite joy, openness, and shared experience.',
    colorGradient: { from: '#ffdab9', to: '#ffb347' },
  },
];

export function isValidSoulColorId(id: string): boolean {
  return SOUL_COLORS.some(color => color.id === id);
}

export function getSoulColorById(id: string): SoulColor | undefined {
  return SOUL_COLORS.find(color => color.id === id);
}

export function getGradientFromId(id: string): { from: string; to: string } {
  const color = getSoulColorById(id);
  return color?.colorGradient || { from: '#E8C4B8', to: '#D4A89F' };
}
