// Shared design tokens for ClickWise.
// High contrast on purpose: every text/background pair below passes WCAG AA.
export const colors = {
  ink: '#12263A', // main text
  muted: '#4A5F73', // secondary text
  paper: '#F3F7FA', // screen background
  card: '#FFFFFF',
  line: '#D7E0E8',

  teal: '#0B6E69', // brand / primary actions
  tealDark: '#084B48',
  tealSoft: '#DDF0EE',

  marigold: '#F2A900', // warm highlight
  marigoldDark: '#8A5A00',
  marigoldSoft: '#FFF1CC',

  sky: '#2563A8',
  skySoft: '#DCEAF8',

  coral: '#B73225', // warnings / scams
  coralSoft: '#FBE3DF',
};

export const radius = {
  card: 24,
  button: 20,
  chip: 14,
  pill: 999,
};

// Minimum comfortable touch target for older users / shaky hands.
export const TOUCH = 56;