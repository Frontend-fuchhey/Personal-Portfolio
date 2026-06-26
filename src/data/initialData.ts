import itahariLogo from '../assets/itahari-logo.png';
import arnikoLogo from '../assets/arniko-logo.png';
import garmentIcon from '../assets/garmentflow.png';
import gallery2 from '../assets/maingarment.png';
import mbPortfolio from '../assets/mb.png';
import lpPortfolio from '../assets/lp.png';

export const INITIAL_ABOUT_DATA = {
  experience: [
    {
      id: 'exp1',
      title: "Senior Frontend Developer",
      company: "Rato topi Inc.",
      range: "2026 – Now",
      achievement: "Architected modern frontend systems using React and TypeScript, optimizing performance and scalability."
    },
    {
      id: 'exp2',
      title: "Freelance Developer",
      company: "Self-Employed",
      range: "2025 – 2026",
      achievement: "Delivered high-quality web solutions for diverse clients globally."
    }
  ],
  education: [
    {
      id: 'edu1',
      degree: "Bachelors Degree",
      institution: "Itahari International College",
      detail: "BSc (Hons) Computing",
      year: "2081 - Present",
      status: "ongoing",
      logo: itahariLogo,
      link: "https://iic.edu.np/"
    },
    {
      id: 'edu2',
      degree: "+2 Science",
      institution: "Arniko College, Biratnagar",
      detail: "Computer Science",
      year: "2079 - 2081",
      status: "completed",
      logo: arnikoLogo,
      certId: "cert-class12",
      link: "https://arnikofoundation.edu.np/"
    },
    {
      id: 'edu3',
      degree: "SEE (Schooling)",
      institution: "Arniko Secondary School, Biratnagar",
      year: "Completed 2079",
      status: "completed",
      logo: arnikoLogo,
      certId: "cert-class10",
      link: "https://arnikofoundation.edu.np/"
    }
  ]
};

export const INITIAL_PROJECTS = [
  {
    id: 'garment_flow',
    name: 'Garment flow',
    category: 'React', // <--- Added Category
    description: 'A comprehensive Store Management System and ERP.',
    tech: ['React.js', 'TypeScript', 'Tailwind CSS'],
    stars: 342,
    forks: 89,
    url: 'https://github.com/Frontend-fuchhey/Garment-flow',
    demoUrl: 'https://garment-flow.app',
    iconType: 'image',
    iconValue: garmentIcon,
    color: 'from-blue-500 to-cyan-500',
    subHeader: 'A specialized ERP system for Garment Store management.',
    images: [gallery2],
    coverImage: gallery2
  },
  {
    id: 'portfolio',
    name: 'Shrawan OS',
    category: 'React', // <--- Added Category (or 'React' depending on your choice)
    description: 'This portfolio! macOS-inspired interactive experience',
    tech: ['React', 'TypeScript', 'Framer Motion', 'Tailwind CSS'],
    stars: 89,
    forks: 12,
    url: 'https://github.com/shrawan-karki/portfolio',
    iconType: 'emoji',
    iconValue: '💻',
    color: 'from-indigo-500 to-blue-600',
    subHeader: 'A macOS-inspired portfolio experience.',
    images: [lpPortfolio, mbPortfolio],
    coverImage: lpPortfolio
  },
];
