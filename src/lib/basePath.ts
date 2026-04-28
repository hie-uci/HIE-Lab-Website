// Base path for GitHub Pages deployment
export const BASE_PATH = '/HIE-Lab-Website';

// Helper to prefix image paths for static export
export function imgSrc(path: string): string {
  return `${BASE_PATH}${path}`;
}
