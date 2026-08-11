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
    category: 'React',
    description: 'GarmentFlow is a modern, high-performance Enterprise Resource Planning (ERP) platform custom-built for garment manufacturers and retail businesses. The system streamlines complex daily operations, tracking everything from raw material purchasing to sales revenue, inventory utilization, and payroll.||By replacing messy spreadsheets with automated, intuitive workflows, GarmentFlow gives business owners real-time financial clarity, effortless tax compliance, and seamless order management.||🚀 KEY FEATURES IMPLEMENTED||• Dynamic Tax Compliance (VAT vs. Non-VAT): Engineered a split-flow system allowing businesses to record and track VAT-inclusive and tax-exempt sales independently. Includes real-time automated tax calculators reducing manual entry errors.||• Smart "In-Place" Order Grouping: Built a sophisticated state-management feature allowing users to multi-select and merge multiple independent transactions into single, unified invoices directly within the main data table, preventing client mismatching.||• On-Demand Local Printing: Designed a clean, professional CSS-print engine that formats merged transaction data into beautifully structured physical invoices at the click of a button.||• Operational Control Center: Real-time dashboards monitoring daily registries, active shifts, material stock, waste metrics, and active sales revenue.||💡 CHALLENGES OVERCOME||• Challenge 1 (The "Messy Table" Rendering): Refactored the rendering pipeline using high-performance array reduction to collapse matching records into single, visually unified rows on the fly, keeping the UI clean while fully preserving database integrity.||• Challenge 2 (Multi-Client Merge Prevention): Designed a validation layer on the selection state that checks checked rows instantly, disabling the "Group" action and notifying the user with a clean warning if a cross-client merge is attempted.||📈 BUSINESS IMPACT||• 100% Tax Accuracy: Automated VAT math completely eliminated human calculation errors during fast-paced sales entry.||• 70% Faster Invoicing: Consolidated billing processes from a manual multi-step task into a single-click "Group & Print" workflow.',
    tech: ['React.js', 'TypeScript', 'Tailwind CSS', 'Next.js'],
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
    description: 'This portfolio! macOS-inspired interactive experience for Computers and Android for Mobiles to give experince of responsiveness',
    tech: ['React', 'TypeScript', 'Framer Motion', 'Tailwind CSS'],
    url: 'https://github.com/shrawan-karki/portfolio',
    iconType: 'emoji',
    iconValue: '💻',
    color: 'from-indigo-500 to-blue-600',
    subHeader: 'A macOS-inspired portfolio experience.',
    images: [lpPortfolio, mbPortfolio],
    coverImage: lpPortfolio
  },
];
