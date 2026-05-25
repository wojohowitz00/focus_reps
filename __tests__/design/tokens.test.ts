// __tests__/design/tokens.test.ts
import { colors, typography, spacing } from '../../constants/theme';

describe('design tokens — colors', () => {
  test('background matches OKLCH oklch(12% 0.027 248)', () => {
    expect(colors.background).toBe('#0c1220');
  });
  test('surface matches OKLCH oklch(16% 0.031 248)', () => {
    expect(colors.surface).toBe('#0d1929');
  });
  test('primary matches OKLCH oklch(74% 0.141 211)', () => {
    expect(colors.primary).toBe('#38bdf8');
  });
  test('coral matches OKLCH oklch(65% 0.187 30)', () => {
    expect(colors.coral).toBe('#ff7043');
  });
  test('textBody matches OKLCH oklch(96% 0.007 248)', () => {
    expect(colors.textBody).toBe('#f1f5f9');
  });
  test('textMuted is primary at 31% opacity', () => {
    expect(colors.textMuted).toBe('rgba(56,189,248,0.31)');
  });
  test('border is defined', () => {
    expect(colors.border).toBe('#1e3a5a');
  });
});

describe('design tokens — typography', () => {
  test('timer size is 48', () => {
    expect(typography.timerSize).toBe(48);
  });
  test('timer weight is 200', () => {
    expect(typography.timerWeight).toBe('200');
  });
  test('label size is 11', () => {
    expect(typography.labelSize).toBe(11);
  });
  test('label transform is uppercase', () => {
    expect(typography.labelTransform).toBe('uppercase');
  });
  test('label letter spacing is 1 (React Native uses number, not em)', () => {
    expect(typography.labelSpacing).toBe(1);
  });
});

describe('design tokens — spacing', () => {
  test('card radius is 8', () => {
    expect(spacing.cardRadius).toBe(8);
  });
  test('progress bar height is 2', () => {
    expect(spacing.progressBarHeight).toBe(2);
  });
  test('bandwidth bar height is 4', () => {
    expect(spacing.bandwidthBarHeight).toBe(4);
  });
});
