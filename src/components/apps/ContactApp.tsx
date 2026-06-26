import { useState } from 'react';
import { Mail, Linkedin, Github, MapPin, Send, Copy, Check } from 'lucide-react';
import { USER_CONFIG } from '../../data/userConfig';
import profilePic from '../../assets/shrawan.jpg';

export function ContactApp() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const isFormReady = formData.name.trim() !== '' && formData.email.trim() !== '' && formData.message.trim() !== '';

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const submissionHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSubmitting(true);
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          access_key: '97d3105d-c0c0-488d-9f46-b4c76208352b',
          ...formData
        })
      });
      if (response.ok) {
        setIsSuccess(true);
        setFormData({ name: '', email: '', message: '' });
      } else {
        console.error('API Error submitting contact form:', response.statusText);
      }
    } catch (error) {
      console.error('Network Error submitting contact form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactNodes = [
    { id: 'email', title: 'EMAIL', label: 'pratyushkarki6@gmail.com', icon: Mail, color: '#EA4335', link: 'mailto:pratyushkarki6@gmail.com' },
    { id: 'github', title: 'GITHUB', label: 'GitHub', icon: Github, color: '#181717', link: 'https://github.com/frontend-fuchhey' },
    { id: 'linkedin', title: 'LINKEDIN', label: 'LinkedIn', icon: Linkedin, color: '#0077B5', link: 'https://www.linkedin.com/in/shrawan-karki-59b0ba392/' },
    { id: 'location', title: 'LOCATION', label: 'Morang, Nepal', icon: MapPin, color: '#EA4335', link: '#' },
  ];

  return (
    <div className="w-full max-w-[700px] min-h-[600px] max-h-[90vh] mx-auto grid grid-cols-1 md:grid-cols-[220px_1fr] font-sans relative overflow-x-hidden overflow-y-auto rounded-[1rem] shadow-2xl border border-black/5 bg-white/10 backdrop-blur-[20px]">

      {/* Left Panel - Contact Info */}
      <div className="py-6 px-4 min-w-[140px] flex flex-col order-2 md:order-1 border-t md:border-t-0 md:border-r border-black/10">
        <h2 className="text-[15px] font-extrabold text-[#1e293b] tracking-wider mb-8">CONTACT INFO</h2>

        <div className="bg-white/50 rounded-xl p-6 flex justify-center mb-8 shadow-sm">
          <div className="relative shrink-0">
            <div className="w-36 h-36 rounded-full border-[3px] border-white shadow-sm overflow-hidden antialiased">
              <img
                src={profilePic}
                className="w-full h-full object-cover object-center image-render-crisp"
                style={{
                  // @ts-ignore
                  WebkitImageRendering: 'optimize-contrast',
                  imageRendering: 'crisp-edges',
                  transform: 'translateZ(0)',
                  backfaceVisibility: 'hidden'
                }}
                alt={USER_CONFIG.name}
              />
            </div>
            <div className="absolute bottom-0 right-0 w-[14px] h-[14px] bg-[#34C759] border-2 border-white rounded-full" />
          </div>
        </div>

        <div className="space-y-8">
          {contactNodes.map((item) => {
            const Icon = item.icon;

            if (item.id === 'github' || item.id === 'linkedin') {
              return (
                <div key={item.id} className="flex flex-col">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">{item.title}</span>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center flex-nowrap gap-2 cursor-pointer group hover:opacity-70 transition-all overflow-visible"
                  >
                    <Icon className="w-6 h-6 shrink-0" style={{ color: item.color }} />
                    <span className="text-[13px] font-semibold text-black group-hover:text-blue-600 transition-colors">{item.label}</span>
                  </a>
                </div>
              );
            }

            if (item.id === 'email') {
              return (
                <div key={item.id} className="flex flex-col">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">{item.title}</span>
                  <div className="flex items-center flex-nowrap gap-2 overflow-visible">
                    <div
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        window.open(item.link, '_self');
                      }}
                      className="flex items-center flex-nowrap gap-2 cursor-pointer hover:opacity-70 transition-all overflow-visible"
                    >
                      <Icon className="w-6 h-6 shrink-0" style={{ color: item.color }} />
                      <span className="text-[12px] font-normal text-gray-700 whitespace-nowrap overflow-visible leading-none tracking-tighter">
                        {item.label}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(item.label);
                      }}
                      className="p-1 hover:bg-black/5 rounded-md transition-colors"
                      title="Copy email"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5 text-gray-400" />}
                    </button>
                  </div>
                </div>
              );
            }

            return (
              <div key={item.id} className="flex flex-col">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">{item.title}</span>
                <div
                  onClick={() => {
                    navigator.clipboard.writeText(item.label);
                  }}
                  className="flex items-center flex-nowrap gap-2 cursor-pointer hover:opacity-70 transition-all overflow-visible"
                >
                  <Icon className="w-6 h-6 shrink-0" style={{ color: item.color }} />
                  <span className="text-[13px] font-semibold text-black break-words">{item.label}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Right Panel - Message Form */}
      <div className="bg-white p-6 flex flex-col flex-1 order-1 md:order-2">
        <h2 className="text-[15px] font-extrabold text-[#1e293b] tracking-wider mb-8">MESSAGE</h2>

        {isSuccess ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 my-auto min-h-[350px] animate-in fade-in zoom-in-95 duration-300">
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mb-3">
              <Check className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-1">Message Sent!</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-[240px] mb-6 leading-relaxed">
              Thanks for reaching out! I've received your message and will get back to you shortly.
            </p>
            <button
              onClick={() => setIsSuccess(false)}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-[10px] tracking-wider uppercase rounded-md transition-all duration-200"
            >
              Send Another
            </button>
          </div>
        ) : (
          <form onSubmit={submissionHandler} className="flex flex-col flex-1">
            <div className="flex flex-col flex-1 gap-y-3">
              <fieldset className="border border-gray-400 rounded-md px-5 focus-within:border-blue-500 transition-colors">
                <legend className="text-[10px] font-semibold px-1 text-black tracking-wide">NAME</legend>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                  className="w-full py-4 focus:outline-none text-[14px] bg-transparent placeholder-gray-500/40 text-black"
                  placeholder="Your name here"
                  style={{ filter: 'none', transition: 'background-color 5000s ease-in-out 0s' }}
                />
              </fieldset>

              <fieldset className="border border-gray-400 rounded-md px-5 focus-within:border-blue-500 transition-colors">
                <legend className="text-[10px] font-semibold px-1 text-black tracking-wide">EMAIL</legend>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                  className="w-full py-4 focus:outline-none text-[14px] bg-transparent placeholder-gray-500/40 text-black"
                  placeholder="your.email@example.com"
                  style={{ filter: 'none', transition: 'background-color 5000s ease-in-out 0s' }}
                />
              </fieldset>

              <fieldset className="border border-gray-400 rounded-md px-5 pb-2 focus-within:border-blue-500 transition-colors">
                <legend className="text-[10px] font-semibold px-1 text-black tracking-wide">MESSAGE</legend>
                <textarea
                  required
                  value={formData.message}
                  onChange={e => setFormData(p => ({ ...p, message: e.target.value }))}
                  className="w-full h-32 py-4 focus:outline-none text-[14px] bg-transparent placeholder-gray-500/40 text-black leading-[1.6] resize-none"
                  placeholder="Tell me about your project..."
                  style={{ filter: 'none', transition: 'background-color 5000s ease-in-out 0s' }}
                />
              </fieldset>
            </div>

            <div className="mt-auto pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3.5 text-white font-bold text-[14px] rounded-md transition-all duration-500 flex items-center justify-center gap-3 tracking-widest disabled:opacity-50 ${isFormReady
                    ? 'bg-blue-600 hover:bg-blue-700 animate-pulse brightness-110 drop-shadow-lg'
                    : 'bg-[#71A5D4] hover:bg-[#5C95C6]'
                  }`}
                style={isFormReady ? { boxShadow: '0 0 15px rgba(37, 99, 235, 0.6)' } : {}}
              >
                {isSubmitting ? 'SENDING...' : (
                  <>
                    SEND <Send className="w-4 h-4 fill-current" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>

    </div>
  );
}
