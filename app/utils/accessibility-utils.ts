/**
 * Utility functions for accessibility features like color contrast validation
 */

/**
 * Convert hex color to RGB values
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Calculate relative luminance of a color
 * Based on WCAG 2.1 guidelines
 */
function getRelativeLuminance(rgb: {
  r: number;
  g: number;
  b: number;
}): number {
  const { r, g, b } = rgb;

  const rsRGB = r / 255;
  const gsRGB = g / 255;
  const bsRGB = b / 255;

  const rLinear =
    rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
  const gLinear =
    gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
  const bLinear =
    bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);

  return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
}

/**
 * Calculate contrast ratio between two colors
 * Returns a number between 1 and 21
 */
export function getContrastRatio(
  color1: string,
  color2: string,
): number | null {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  if (!rgb1 || !rgb2) {
    return null;
  }

  const lum1 = getRelativeLuminance(rgb1);
  const lum2 = getRelativeLuminance(rgb2);

  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);

  return (brightest + 0.05) / (darkest + 0.05);
}

/**
 * Check if color combination meets WCAG AA standards
 * AA: 4.5:1 for normal text, 3:1 for large text
 */
export function meetsWCAGAA(
  foreground: string,
  background: string,
  isLargeText = false,
): boolean {
  const ratio = getContrastRatio(foreground, background);
  if (ratio === null) return false;

  return isLargeText ? ratio >= 3 : ratio >= 4.5;
}

/**
 * Check if color combination meets WCAG AAA standards
 * AAA: 7:1 for normal text, 4.5:1 for large text
 */
export function meetsWCAGAAA(
  foreground: string,
  background: string,
  isLargeText = false,
): boolean {
  const ratio = getContrastRatio(foreground, background);
  if (ratio === null) return false;

  return isLargeText ? ratio >= 4.5 : ratio >= 7;
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Check if user prefers high contrast
 */
export function prefersHighContrast(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-contrast: high)").matches;
}

/**
 * Check if user prefers dark color scheme
 */
export function prefersDarkMode(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

/**
 * Validate color combinations used in the app
 */
export const COLOR_COMBINATIONS = {
  primary: {
    foreground: "#374151", // gray.700
    background: "#ffffff", // white
    name: "Primary text on white",
  },
  secondary: {
    foreground: "#6b7280", // gray.500
    background: "#ffffff", // white
    name: "Secondary text on white",
  },
  link: {
    foreground: "#2563eb", // blue.700 - darker for better contrast
    background: "#ffffff", // white
    name: "Link text on white",
  },
  button: {
    foreground: "#ffffff", // white
    background: "#2563eb", // blue.700 - darker for better contrast
    name: "Button text on blue",
  },
  error: {
    foreground: "#dc2626", // red.600
    background: "#ffffff", // white
    name: "Error text on white",
  },
} as const;

/**
 * Validate all color combinations in the app
 */
export function validateAllColorCombinations(): {
  name: string;
  ratio: number | null;
  meetsAA: boolean;
  meetsAAA: boolean;
}[] {
  return Object.values(COLOR_COMBINATIONS).map((combo) => {
    const ratio = getContrastRatio(combo.foreground, combo.background);
    return {
      name: combo.name,
      ratio,
      meetsAA: meetsWCAGAA(combo.foreground, combo.background),
      meetsAAA: meetsWCAGAAA(combo.foreground, combo.background),
    };
  });
}
