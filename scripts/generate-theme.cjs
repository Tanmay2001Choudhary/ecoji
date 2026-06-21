const fs = require('fs')

function hexToHsl(hex) {
  let r = 0, g = 0, b = 0;
  if (hex.length == 4) {
    r = "0x" + hex[1] + hex[1];
    g = "0x" + hex[2] + hex[2];
    b = "0x" + hex[3] + hex[3];
  } else if (hex.length == 7) {
    r = "0x" + hex[1] + hex[2];
    g = "0x" + hex[3] + hex[4];
    b = "0x" + hex[5] + hex[6];
  }
  r /= 255; g /= 255; b /= 255;
  let cmin = Math.min(r,g,b),
      cmax = Math.max(r,g,b),
      delta = cmax - cmin,
      h = 0, s = 0, l = 0;
  if (delta == 0) h = 0;
  else if (cmax == r) h = ((g - b) / delta) % 6;
  else if (cmax == g) h = (b - r) / delta + 2;
  else h = (r - g) / delta + 4;
  h = Math.round(h * 60);
  if (h < 0) h += 360;
  l = (cmax + cmin) / 2;
  s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);
  return `${h} ${s}% ${l}%`;
}

const themes = {
  'premium-eco': {
    primary: '#2E7D32',
    secondary: '#DCC9A3',
    background: '#F8F5EE',
    foreground: '#2D2D2D',
    card: '#FFFFFF',
    border: '#E2E8F0',
  },
  'modern-eco': {
    primary: '#355E3B',
    secondary: '#D9C7A3',
    background: '#FAF9F6',
    foreground: '#2D2D2D',
    card: '#FFFFFF',
    border: '#E2E8F0',
  },
  'bamboo': {
    primary: '#4CAF50',
    secondary: '#E8D8B5',
    background: '#FFFFFF',
    foreground: '#6D4C41',
    card: '#F8F9FA',
    border: '#E2E8F0',
  },
  'luxury-eco': {
    primary: '#1B4332',
    secondary: '#C9A66B',
    background: '#FFF8E7',
    foreground: '#1A1A1A',
    card: '#FFFFFF',
    border: '#E2E8F0',
  }
}

let css = `@tailwind base;\n@tailwind components;\n@tailwind utilities;\n\n@layer base {\n`;

for (const [name, colors] of Object.entries(themes)) {
  const prefix = name === 'premium-eco' ? ':root, .theme-premium-eco' : `.theme-${name}`;
  css += `  ${prefix} {\n`;
  css += `    --background: ${hexToHsl(colors.background)};\n`;
  css += `    --foreground: ${hexToHsl(colors.foreground)};\n`;
  css += `    --card: ${hexToHsl(colors.card)};\n`;
  css += `    --card-foreground: ${hexToHsl(colors.foreground)};\n`;
  css += `    --popover: ${hexToHsl(colors.card)};\n`;
  css += `    --popover-foreground: ${hexToHsl(colors.foreground)};\n`;
  css += `    --primary: ${hexToHsl(colors.primary)};\n`;
  css += `    --primary-foreground: ${hexToHsl('#FFFFFF')};\n`;
  css += `    --secondary: ${hexToHsl(colors.secondary)};\n`;
  css += `    --secondary-foreground: ${hexToHsl(colors.foreground)};\n`;
  css += `    --muted: ${hexToHsl('#F1F5F9')};\n`;
  css += `    --muted-foreground: ${hexToHsl('#64748B')};\n`;
  css += `    --accent: ${hexToHsl(colors.secondary)};\n`;
  css += `    --accent-foreground: ${hexToHsl(colors.foreground)};\n`;
  css += `    --destructive: ${hexToHsl('#EF4444')};\n`;
  css += `    --destructive-foreground: ${hexToHsl('#FFFFFF')};\n`;
  css += `    --border: ${hexToHsl(colors.border)};\n`;
  css += `    --input: ${hexToHsl(colors.border)};\n`;
  css += `    --ring: ${hexToHsl(colors.primary)};\n`;
  css += `    --radius: 0.5rem;\n`;
  css += `  }\n\n`;
}

css += `}\n\n@layer base {\n  * {\n    @apply border-border;\n  }\n  body {\n    @apply bg-background text-foreground font-sans;\n  }\n}\n`;

fs.writeFileSync('src/index.css', css);
console.log('Generated index.css');
