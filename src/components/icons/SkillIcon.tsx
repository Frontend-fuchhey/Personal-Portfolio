import {
  Code2,
  Zap,
  MonitorSmartphone,
  Cpu,
  Braces,
  Maximize2,
  Compass,
  TrendingUp,
  Terminal,
  Database,
  Layers,
  Sparkles,
} from 'lucide-react';
import { SkillItem } from '../../data/initialData';

export const SKILL_PRESETS: Array<{ id: string; name: string }> = [
  { id: 'nextjs', name: 'Next.js' },
  { id: 'react', name: 'React' },
  { id: 'ts', name: 'TypeScript' },
  { id: 'js', name: 'JavaScript' },
  { id: 'tailwind', name: 'Tailwind CSS' },
  { id: 'varfonts', name: 'Variable Fonts' },
  { id: 'html5', name: 'HTML5' },
  { id: 'css3', name: 'CSS3' },
  { id: 'cloudflare', name: 'Cloudflare Workers' },
  { id: 'vercel', name: 'Vercel / Pages' },
  { id: 'github', name: 'Git / GitHub' },
  { id: 'figma', name: 'Figma' },
  { id: 'zap', name: 'Zap / Micro-interactions' },
  { id: 'responsive', name: 'Mobile / Responsive' },
  { id: 'gpu', name: 'GPU / Performance' },
  { id: 'schema', name: 'Schema / JSON-LD' },
  { id: 'screen', name: 'Screen / Display' },
  { id: 'browser', name: 'Browser / Web' },
  { id: 'seo', name: 'SEO / Analytics' },
  { id: 'database', name: 'Database' },
  { id: 'terminal', name: 'Terminal / CLI' },
  { id: 'layers', name: 'Architecture / Layers' },
  { id: 'code', name: 'Code / Development' },
];

export function renderPresetSvg(iconId: string, className = 'w-4.5 h-4.5') {
  switch (iconId?.toLowerCase()) {
    case 'nextjs':
      return (
        <svg className={`${className} text-zinc-900 dark:text-white fill-current`} viewBox="0 0 24 24">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.83 17.89l-6.8-9.43v9.43H9.41V6.11h1.62l6.8 9.43V6.11h1.62v11.78h-1.62z" />
        </svg>
      );
    case 'react':
      return (
        <svg className={`${className} text-[#00D8FF]`} viewBox="-11.5 -10.23174 23 20.46348" fill="none" stroke="currentColor" strokeWidth="1.2">
          <ellipse rx="11" ry="4.2" />
          <ellipse rx="11" ry="4.2" transform="rotate(60)" />
          <ellipse rx="11" ry="4.2" transform="rotate(120)" />
          <circle r="2" fill="currentColor" />
        </svg>
      );
    case 'ts':
    case 'typescript':
      return (
        <svg className={`${className} rounded`} viewBox="0 0 24 24" fill="none">
          <rect width="24" height="24" rx="4" fill="#3178C6" />
          <text x="4.5" y="17" fill="white" fontSize="13" fontWeight="bold" fontFamily="system-ui, -apple-system, sans-serif">TS</text>
        </svg>
      );
    case 'js':
    case 'javascript':
      return (
        <svg className={`${className} rounded`} viewBox="0 0 24 24" fill="none">
          <rect width="24" height="24" rx="4" fill="#F7DF1E" />
          <text x="5" y="17" fill="#000000" fontSize="13" fontWeight="bold" fontFamily="system-ui, -apple-system, sans-serif">JS</text>
        </svg>
      );
    case 'tailwind':
    case 'tailwindcss':
      return (
        <svg className={`${className} text-[#38BDF8] fill-current`} viewBox="0 0 24 24">
          <path d="M12 6.5c-2.8 0-4.9 1.4-6.3 4.2 2.1-2.1 4.2-2.8 6.3-2.1 1.2.4 2 1.3 3 2.3 1.5 1.5 3.3 3.3 6.6 3.3 2.8 0 4.9-1.4 6.3-4.2-2.1 2.1-4.2 2.8-6.3 2.1-1.2-.4-2-1.3-3-2.3-1.5-1.5-3.3-3.3-6.6-3.3zM5.4 13c-2.8 0-4.9 1.4-6.3 4.2 2.1-2.1 4.2-2.8 6.3-2.1 1.2.4 2 1.3 3 2.3 1.5 1.5 3.3 3.3 6.6 3.3 2.8 0 4.9-1.4 6.3-4.2-2.1 2.1-4.2 2.8-6.3 2.1-1.2-.4-2-1.3-3-2.3-1.5-1.5-3.3-3.3-6.6-3.3z" />
        </svg>
      );
    case 'varfonts':
      return (
        <svg className={`${className} text-indigo-500`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M3.5 19L8 5L12.5 19M5 14.5H11" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M13.5 19L17 9L20.5 19M14.5 15.5H19.5" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'html5':
      return (
        <svg className={`${className} text-[#E34F26] fill-current`} viewBox="0 0 24 24">
          <path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.565-2.438L1.5 0zm7.031 9.75l-.232-2.718 10.059.003.23-2.622L5.433 4.41l.707 7.962h10.457l-.372 4.156-4.225 1.15-4.225-1.15-.27-3.028H5.111l.465 5.568 6.424 1.781 6.425-1.781.859-9.338H8.531z" />
        </svg>
      );
    case 'css3':
      return (
        <svg className={`${className} text-[#1572B6] fill-current`} viewBox="0 0 24 24">
          <path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.565-2.438L1.5 0zm17.09 4.413L5.41 4.41l.245 2.625 10.635.003-.277 3.03H6.012l.245 2.625h9.873l-.48 5.253-3.65 1.01-3.65-1.01-.233-2.625H5.72l.417 4.838 5.863 1.625 5.863-1.625 1.144-12.89z" />
        </svg>
      );
    case 'cloudflare':
      return (
        <svg className={`${className} text-[#F38020] fill-current`} viewBox="0 0 24 24">
          <path d="M18.3 12.3c-.2-2.3-2.1-4.1-4.5-4.1-1.7 0-3.2.9-4 2.3-.4-.1-.8-.2-1.3-.2-2.2 0-4 1.8-4 4 0 .3 0 .5.1.8C2.9 15.6 1.5 17.2 1.5 19.1c0 2.2 1.8 3.9 4 3.9h12.8c2.6 0 4.7-2.1 4.7-4.7 0-2.3-1.6-4.2-3.7-4.6-.2-.7-.5-1-1-1.4z" />
        </svg>
      );
    case 'vercel':
      return (
        <svg className={`${className} text-zinc-900 dark:text-white fill-current`} viewBox="0 0 24 24">
          <path d="M12 1L24 22H0L12 1Z" />
        </svg>
      );
    case 'github':
    case 'git':
      return (
        <svg className={`${className} text-zinc-900 dark:text-white fill-current`} viewBox="0 0 24 24">
          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
        </svg>
      );
    case 'figma':
      return (
        <svg className={className} viewBox="0 0 38 57" fill="none">
          <path d="M19 0a9.5 9.5 0 0 0-9.5 9.5 9.5 9.5 0 0 0 9.5 9.5 9.5 9.5 0 0 0 9.5-9.5A9.5 9.5 0 0 0 19 0z" fill="#F24E1E" />
          <path d="M9.5 19a9.5 9.5 0 0 0 0 19h9.5V19H9.5z" fill="#A259FF" />
          <path d="M19 19h9.5a9.5 9.5 0 0 0 0-19H19v19z" fill="#FF7262" />
          <path d="M19 38h9.5a9.5 9.5 0 0 0 0-19H19v19z" fill="#1ABC9C" />
          <path d="M9.5 38a9.5 9.5 0 0 0 9.5 9.5V38H9.5z" fill="#18A0FB" />
        </svg>
      );
    case 'zap':
      return <Zap className={`${className} text-amber-500 fill-amber-500/20`} />;
    case 'responsive':
      return <MonitorSmartphone className={`${className} text-indigo-500`} />;
    case 'gpu':
      return <Cpu className={`${className} text-emerald-500`} />;
    case 'schema':
      return <Braces className={`${className} text-blue-500`} />;
    case 'screen':
      return <Maximize2 className={`${className} text-violet-500`} />;
    case 'browser':
      return <Compass className={`${className} text-rose-500`} />;
    case 'seo':
      return <TrendingUp className={`${className} text-teal-500`} />;
    case 'database':
      return <Database className={`${className} text-cyan-500`} />;
    case 'terminal':
      return <Terminal className={`${className} text-emerald-600`} />;
    case 'layers':
      return <Layers className={`${className} text-purple-500`} />;
    case 'sparkles':
      return <Sparkles className={`${className} text-amber-400`} />;
    default:
      return <Code2 className={`${className} text-blue-600 dark:text-blue-400`} />;
  }
}

export function SkillIcon({ skill, className = 'w-4.5 h-4.5' }: { skill: SkillItem; className?: string }) {
  const iconVal = (skill.icon || '').trim();
  const iconType = skill.iconType || (iconVal.startsWith('data:') || iconVal.startsWith('http') || iconVal.startsWith('/') ? 'image' : iconVal.length <= 4 && !/^[a-z0-9_-]+$/i.test(iconVal) ? 'emoji' : 'preset');

  if (iconType === 'image' && iconVal) {
    return (
      <img
        src={iconVal}
        alt={skill.title}
        className={`${className} object-contain rounded`}
        onError={(e) => {
          e.currentTarget.style.display = 'none';
        }}
      />
    );
  }

  if (iconType === 'emoji' && iconVal) {
    return <span className="text-base leading-none select-none">{iconVal}</span>;
  }

  return renderPresetSvg(iconVal, className);
}
