// __tests__/design/antipatterns.test.ts
import * as fs from 'fs';
import * as path from 'path';

function readScreenFile(relativePath: string): string {
  return fs.readFileSync(path.join(__dirname, '../../', relativePath), 'utf8');
}

function readAllScreenFiles(): string {
  const targets = [
    'app/onboarding.tsx',
    'app/practice/[id].tsx',
    'app/post-session.tsx',
    'app/(tabs)/progress.tsx',
  ];
  return targets
    .filter(p => fs.existsSync(path.join(__dirname, '../../', p)))
    .map(readScreenFile)
    .join('\n');
}

describe('anti-patterns — banned colors', () => {
  test('no cream/sand background (#f5f0e8 or similar)', () => {
    const source = readAllScreenFiles();
    expect(source).not.toMatch(/#f5f0e8/i);
    expect(source).not.toMatch(/#e8d5b7/i);
  });

  test('no near-black without warmth (#0f0f0f, pure black)', () => {
    const source = readAllScreenFiles();
    expect(source).not.toMatch(/'#0f0f0f'/i);
    expect(source).not.toMatch(/'#000000'/i);
    expect(source).not.toMatch(/'black'/i);
  });

  test('no inline orange that is not coral (#ff8c42)', () => {
    const source = readAllScreenFiles();
    expect(source).not.toMatch(/#ff8c42/i);
  });
});

describe('anti-patterns — banned UI elements', () => {
  test('no streak display in progress or home screens', () => {
    const targets = ['app/(tabs)/progress.tsx', 'app/(tabs)/index.tsx'];
    const source = targets
      .filter(p => fs.existsSync(path.join(__dirname, '../../', p)))
      .map(readScreenFile)
      .join('\n');
    expect(source.toLowerCase()).not.toMatch(/streak/);
  });

  test('no leaderboard or ranking text', () => {
    const source = readAllScreenFiles();
    expect(source.toLowerCase()).not.toMatch(/leaderboard/);
    expect(source.toLowerCase()).not.toMatch(/ranking/);
  });

  test('session screen has no bandwidth or score display', () => {
    const session = readScreenFile('app/practice/[id].tsx');
    expect(session.toLowerCase()).not.toMatch(/bandwidth/);
    expect(session.toLowerCase()).not.toMatch(/focusscore|focus_score|sart/i);
  });
});

describe('anti-patterns — banned fonts', () => {
  test('no Inter font family', () => {
    const source = readAllScreenFiles();
    expect(source).not.toMatch(/fontFamily:\s*['"]Inter['"]/);
  });

  test('no Geist font family', () => {
    const source = readAllScreenFiles();
    expect(source).not.toMatch(/fontFamily:\s*['"]Geist['"]/);
  });
});

describe('design token usage', () => {
  test('screens import from constants/theme, not raw hex strings for primary colors', () => {
    const session = readScreenFile('app/practice/[id].tsx');
    expect(session).toMatch(/from ['"].*constants\/theme['"]/);
  });
});
