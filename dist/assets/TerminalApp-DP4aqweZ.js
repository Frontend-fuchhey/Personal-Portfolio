import{r as u,j as t}from"./vendor-motion-Bt8DPWy-.js";import{u as w}from"./index-BrHde6p-.js";import"./vendor-react-D3NDZS12.js";import"./vendor-icons-BGk8BIze.js";const x=[{keywords:["hello","hi","hey","greetings","sup","yo","namaste"],response:"Namaste! I'm Shrawan Karki's AI terminal assistant. Ask me anything about Shrawan's skills, education, projects, or background!"},{keywords:["who","about","bio","shrawan","pratyush","identity","yourself"],response:"Shrawan Karki (also known as Pratyush Karki) is a Frontend Developer & UI/UX Designer based in Nepal. He specializes in crafting interactive web environments, modern interfaces, and scalable React/Next.js applications."},{keywords:["study","college","education","degree","university","itahari"],response:"Shrawan is an IT undergraduate student pursuing his degree at Itahari International College in Nepal, focusing on modern web software engineering."},{keywords:["stack","tech","skills","technologies","tools","languages","react","tailwind"],response:"Shrawan's core tech stack includes React, Next.js, TypeScript, Tailwind CSS, JavaScript (ES6+), Schema.org JSON-LD, Cloudflare Workers, and modern UI/UX design tools like Figma."},{keywords:["resume","cv","builder","resume.io"],response:"Check out Resume.io! It's an automated resume builder built by Shrawan hosted on Cloudflare Workers. Live URL: [https://resumeio.pages.dev/](https://resumeio.pages.dev/)"},{keywords:["projects","work","built","portfolio","creations"],response:`Shrawan has built interactive web experiences including:
1. Shrawan OS (Portfolio)
2. Resume.io (Automatic Resume Builder)
3. Rato Topi Technical Support Operations
Type 'projects' or open the Projects app to explore more!`},{keywords:["contact","email","social","linkedin","github","instagram","reach","hire"],response:`You can connect with Shrawan across the web:
- LinkedIn: [https://www.linkedin.com/in/shrawan-karki-187706428/](https://www.linkedin.com/in/shrawan-karki-187706428/)
- GitHub: [https://github.com/frontend-fuchhey](https://github.com/frontend-fuchhey)
- Instagram: @prasar_7`},{keywords:["experience","work","job","role"],response:"Shrawan specializes in frontend engineering and UI/UX design, building highly responsive custom web applications, system dashboards, and interactive user experiences."}],O=i=>{const p=i.toLowerCase().trim();for(const a of x)if(a.keywords.some(o=>p.includes(o)))return a.response;return`I'm Shrawan's AI terminal assistant. I can answer questions about his tech stack, college, projects, or background! Try asking "What's your tech stack?" or type "help" for CLI commands.`},A={help:`AVAILABLE COMMANDS:
  ABOUT / BIO → LEARN ABOUT SHRAWAN
  SKILLS      → LIST TECHNICAL SKILLS & STACK
  PROJECTS    → SEE RECENT PROJECTS
  CONTACT     → GET CONTACT INFORMATION
  SOCIALS     → FIND SOCIAL MEDIA LINKS
  EXPERIENCE  → WORK HISTORY
  WHOAMI      → WHO IS SHRAWAN?
  LS          → LIST DIRECTORIES & APPS
  DATE        → SHOW CURRENT DATE & TIME
  CLEAR       → CLEAR THE TERMINAL
  ECHO [TEXT] → PRINT TEXT

💡 NATURAL LANGUAGE AI ASSISTANT:
  You can also type any question directly! E.g.:
  • "Who are you?"
  • "What is your tech stack?"
  • "Where do you study?"
  • "Tell me about your projects"`,bio:`HI! I'M SHRAWAN KARKI 👨‍💻
━━━━━━━━━━━━━━━━━━━━━━━━━
ROLE:     FRONTEND DEVELOPER & UI/UX DESIGNER
LOCATION: MORANG, NEPAL
STATUS:   OPEN TO OPPORTUNITIES
PASSION:  CRAFTING CLEAN, INTERACTIVE WEB EXPERIENCES`,about:`HI! I'M SHRAWAN KARKI 👨‍💻
━━━━━━━━━━━━━━━━━━━━━━━━━
ROLE:     FRONTEND DEVELOPER & UI/UX DESIGNER
LOCATION: MORANG, NEPAL
STATUS:   OPEN TO OPPORTUNITIES
PASSION:  CRAFTING CLEAN, INTERACTIVE WEB EXPERIENCES`,skills:`TECHNICAL SKILLS:
━━━━━━━━━━━━━━━━━━━━━━━━━
FRONTEND:  REACT, TYPESCRIPT, TAILWIND CSS, NEXT.JS
DESIGN:    FIGMA, FRAMER MOTION, THREE.JS
BACKEND:   CLOUDFLARE WORKERS, NODE.JS`,projects:`AVAILABLE PROJECTS:
1. GARMENT FLOW  -> SPECIALIZED ERP PLATFORM
2. SHRAWAN OS   -> MACOS-INSPIRED WEB PORTFOLIO
3. RESUME.IO    -> AUTOMATED RESUME BUILDER ON CLOUDFLARE
Type 'open projects' to view files.`,contact:`CONTACT INFO:
━━━━━━━━━━━━━━━━━━━━━━━━━
EMAIL:    pratyushkarki6@gmail.com
GITHUB:   github.com/frontend-fuchhey
LINKEDIN: linkedin.com/in/shrawan-karki-187706428/
TWITTER:  @shrawankarki
LOCATION: Morang, Nepal`,socials:`SOCIAL MEDIA:
━━━━━━━━━━━━━━━━━━━━━━━━━
🐙 GITHUB:    github.com/frontend-fuchhey
💼 LINKEDIN:  linkedin.com/in/shrawan-karki-187706428/
🐦 TWITTER:   @shrawankarki
📸 INSTAGRAM: @prasar_7`,experience:`WORK EXPERIENCE:
━━━━━━━━━━━━━━━━━━━━━━━━━
2026–NOW  SENIOR FRONTEND DEVELOPER @ Rato topi Inc.
2025–2026 FREELANCE DEVELOPER @ SELF-EMPLOYED`,whoami:`SHRAWAN KARKI — FRONTEND DEVELOPER 👨‍💻
UID=1000(SHRAWAN) GID=1000(DEVELOPERS)
GROUPS=DEVELOPERS,DESIGNERS,AI-ASSISTANTS`,ls:`about/       projects/    resume/
contact/     photos/      settings/
tictactoe/   README.md`,date:`${new Date().toLocaleString("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric",hour:"2-digit",minute:"2-digit",second:"2-digit"})}`};function y(i){const p=/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|(https?:\/\/[^\s)]+)/g,a=[];let o=0,n;for(;(n=p.exec(i))!==null;)n.index>o&&a.push(i.slice(o,n.index)),n[1]&&n[2]?a.push(t.jsx("a",{href:n[2],target:"_blank",rel:"noopener noreferrer",className:"text-cyan-400 hover:text-cyan-300 underline font-medium",onClick:d=>d.stopPropagation(),children:n[1]},n.index)):n[3]&&a.push(t.jsx("a",{href:n[3],target:"_blank",rel:"noopener noreferrer",className:"text-cyan-400 hover:text-cyan-300 underline font-medium",onClick:d=>d.stopPropagation(),children:n[3]},n.index)),o=p.lastIndex;return o<i.length&&a.push(i.slice(o)),a.length>0?a:i}function D({onOpenApp:i}){const[p,a]=u.useState([{type:"output",text:"SHRAWAN OS TERMINAL V8.0.0 — AI ASSISTANT ENABLED"},{type:"ai",text:"Namaste! I'm Shrawan's AI terminal assistant. Type 'help' for commands or ask me any question about Shrawan in natural language!"}]),[o,n]=u.useState([]),[d,N]=u.useState(-1),[R,I]=u.useState(""),l=u.useRef(null),S=u.useRef(null);u.useEffect(()=>{S.current?.scrollIntoView({behavior:"smooth"})},[p]),u.useEffect(()=>{l.current?.focus()},[]);const T=e=>{const s=e.trim();if(!s)return;const E=s.toLowerCase(),[h,...r]=E.split(" "),c=[{type:"input",text:`$ ${e}`}];if(h==="clear"){a([{type:"output",text:`SHRAWAN OS TERMINAL — TYPE 'HELP' FOR COMMANDS OR ASK ANY QUESTION.
`}]);return}else if(h==="echo")c.push({type:"output",text:r.join(" ")||""});else if(h==="date")c.push({type:"output",text:new Date().toLocaleString("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric",hour:"2-digit",minute:"2-digit",second:"2-digit"})});else if(h==="open")r[0]==="projects"?(c.push({type:"success",text:"Opening Projects File Explorer..."}),i?.("projects")):r[0]==="about"||r[0]==="contact"||r[0]==="photos"||r[0]==="resume"||r[0]==="settings"||r[0]==="terminal"||r[0]==="tictactoe"?(c.push({type:"success",text:`Opening ${r[0]} app...`}),i?.(r[0])):c.push({type:"error",text:"Usage: open [about|projects|contact|photos|resume|settings|tictactoe]"});else if(A[h])c.push({type:"output",text:A[h]});else{const m=O(s);c.push({type:"ai",text:m})}a(m=>[...m,...c]),n(m=>[s,...m]),N(-1)},f=e=>{if(e.stopPropagation(),!!l.current){if(e.key==="Enter"){const s=l.current.value;T(s),l.current.value="",I("")}else if(e.key==="ArrowUp"){e.preventDefault();const s=Math.min(d+1,o.length-1);if(s!==-1){N(s);const E=o[s]??"";l.current.value=E,I(E)}}else if(e.key==="ArrowDown"){e.preventDefault();const s=Math.max(d-1,-1);N(s);const E=s===-1?"":o[s];l.current.value=E,I(E)}}},g=w();return t.jsxs("div",{className:`h-full w-full max-w-full flex flex-col overflow-hidden cursor-text ${g?"mobile-content-shift":""}`,style:{background:"rgba(15, 15, 20, 0.97)"},onClick:()=>l.current?.focus(),children:[t.jsxs("div",{className:"flex-1 overflow-y-auto overflow-x-auto p-4 md:p-8 custom-scrollbar",children:[p.map((e,s)=>t.jsxs("div",{className:"terminal-text mb-2 break-words overflow-wrap-anywhere",children:[e.type==="input"&&t.jsx("span",{className:"text-green-400 font-bold",children:e.text}),e.type==="output"&&t.jsx("pre",{className:"text-gray-300 whitespace-pre-wrap font-mono font-normal break-words leading-relaxed",children:e.text}),e.type==="ai"&&t.jsxs("div",{className:"text-cyan-300 whitespace-pre-wrap font-mono leading-relaxed bg-cyan-950/20 border-l-2 border-cyan-500/50 pl-3 py-1 my-1",children:[t.jsx("span",{className:"text-purple-400 font-bold mr-2",children:"🤖 AI:"}),y(e.text)]}),e.type==="error"&&t.jsx("span",{className:"text-red-400 font-normal",children:e.text}),e.type==="success"&&t.jsx("span",{className:"text-green-400 font-normal",children:e.text})]},s)),t.jsx("div",{ref:S})]}),t.jsxs("div",{className:"relative flex items-center px-4 md:px-8 py-3 border-t border-gray-800 bg-black/20 overflow-hidden",onClick:()=>l.current?.focus(),children:[t.jsxs("div",{className:"flex items-center flex-wrap w-full pointer-events-none",children:[t.jsx("span",{className:"text-green-400 terminal-text font-bold whitespace-nowrap mr-2",children:"shrawan@portfolio:~$"}),t.jsx("span",{className:"text-gray-100 terminal-text font-normal whitespace-pre inline-block",children:R}),t.jsx("span",{className:"inline-block w-[7px] h-[15px] bg-green-400 opacity-80 animate-pulse ml-0.5"})]}),t.jsx("input",{ref:l,onKeyDown:f,onChange:e=>I(e.target.value),className:"absolute inset-0 w-full h-full bg-transparent text-transparent outline-none border-none caret-transparent cursor-text",autoComplete:"off",autoCorrect:"off",spellCheck:!1,autoCapitalize:"none",autoFocus:!0})]})]})}export{D as TerminalApp};
