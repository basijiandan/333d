import * as THREE from 'three';

export interface ParticleData {
  position: [number, number, number];
  color: string;
  title: string;
  url: string;
}

const sites = [
  { title: "Google", url: "https://google.com" },
  { title: "Wikipedia", url: "https://wikipedia.org" },
  { title: "GitHub", url: "https://github.com" },
  { title: "NASA", url: "https://nasa.gov" },
  { title: "MDN Web Docs", url: "https://developer.mozilla.org" },
  { title: "Three.js", url: "https://threejs.org" },
  { title: "React", url: "https://react.dev" },
  { title: "Vercel", url: "https://vercel.com" },
  { title: "CodePen", url: "https://codepen.io" },
  { title: "CSS-Tricks", url: "https://css-tricks.com" }
];

const colors = [
  '#00e5ff', // cyan
  '#ff007f', // pink
  '#a900ff', // purple
  '#00ff33', // green
  '#ffd500', // yellow
  '#ff5e00', // orange
];

export const particlesData: ParticleData[] = Array.from({ length: 150 }).map((_, i) => {
  // Distribute particles randomly in a spherical volume
  const radius = 10 + Math.random() * 60;
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);

  const x = radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.sin(phi) * Math.sin(theta);
  const z = radius * Math.cos(phi);

  const site = sites[Math.floor(Math.random() * sites.length)];

  return {
    position: [x, y, z],
    color: colors[Math.floor(Math.random() * colors.length)],
    title: `${site.title} Node ${i}`,
    url: site.url
  };
});
