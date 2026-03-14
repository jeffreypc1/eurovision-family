// Country code to flag emoji mapping
export function getFlagEmoji(countryCode: string): string {
  const code = countryCode.toUpperCase();
  return String.fromCodePoint(
    ...Array.from(code).map((c) => c.charCodeAt(0) + 0x1F1A5)
  );
}

// Fun color palette for family members
export const MEMBER_COLORS = [
  '#E91E8C', // pink
  '#7B2FBE', // purple
  '#1B8FE3', // blue
  '#E8A317', // gold
  '#2ECC71', // green
  '#E74C3C', // red
  '#F39C12', // orange
  '#1ABC9C', // teal
  '#9B59B6', // violet
  '#3498DB', // sky blue
];

export const MEMBER_EMOJIS = [
  '🎤', '🎵', '🎶', '🌟', '✨', '🎸', '🎹', '🥁', '🎺', '💃',
  '🕺', '🎭', '🦄', '🌈', '🔥', '💎', '🦋', '🌸', '⭐', '🎪',
];
