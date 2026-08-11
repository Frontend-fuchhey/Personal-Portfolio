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
    { id: 'linkedin', title: 'LINKEDIN', label: 'LinkedIn', icon: Linkedin, color: '#0077B5', link: 'https://www.linkedin.com/in/shrawan-karki-187706428/' },
    { id: 'location', title: 'LOCATION', label: 'Morang, Nepal', icon: MapPin, color: '#EA4335', link: '#' },
  ];

  return (
    <div className="w-full max-w-[700px] h-full flex-1 mx-auto grid grid-cols-1 md:grid-cols-[220px_1fr] font-sans relative overflow-hidden rounded-[1rem] shadow-2xl border border-black/5 bg-white/10 backdrop-blur-[20px]">

      {/* Left Panel - Contact Info */}
      <div className="h-full py-5 px-4 min-w-[140px] flex flex-col justify-between order-2 md:order-1 border-t md:border-t-0 md:border-r border-black/10">
        <h2 className="text-[14px] font-extrabold text-[#1e293b] tracking-wider mb-2">CONTACT INFO</h2>

        <div className="bg-white/50 rounded-xl p-3 flex justify-center mb-3 shadow-sm">
          <div className="relative shrink-0">
            <div className="w-28 h-28 md:w-32 md:h-32 rounded-full border-[3px] border-white shadow-sm overflow-hidden antialiased">
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
            <div className="absolute bottom-0 right-1 w-[12px] h-[12px] bg-[#34C759] border-2 border-white rounded-full" />
          </div>
        </div>

        <div className="space-y-3.5">
          {contactNodes.map((item) => {
            const Icon = item.icon;

            if (item.id === 'github' || item.id === 'linkedin') {
              return (
                <div key={item.id} className="flex flex-col">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-0.5">{item.title}</span>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center flex-nowrap gap-2 cursor-pointer group hover:opacity-70 transition-all overflow-visible"
                  >
                    <Icon className="w-5 h-5 shrink-0" style={{ color: item.color }} />
                    <span className="text-[12px] font-semibold text-black group-hover:text-blue-600 transition-colors">{item.label}</span>
                  </a>
                </div>
              );
            }

            if (item.id === 'email') {
              return (
                <div key={item.id} className="flex flex-col">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-0.5">{item.title}</span>
                  <div className="flex items-center flex-nowrap gap-2 overflow-visible">
                    <div
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        window.open(item.link, '_self');
                      }}
                      className="flex items-center flex-nowrap gap-2 cursor-pointer hover:opacity-70 transition-all overflow-visible"
                    >
                      <Icon className="w-5 h-5 shrink-0" style={{ color: item.color }} />
                      <span className="text-[11px] font-normal text-gray-700 whitespace-nowrap overflow-visible leading-none tracking-tighter">
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
                      {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3 text-gray-400" />}
                    </button>
                  </div>
                </div>
              );
            }

            return (
              <div key={item.id} className="flex flex-col">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-0.5">{item.title}</span>
                <div
                  onClick={() => {
                    navigator.clipboard.writeText(item.label);
                  }}
                  className="flex items-center flex-nowrap gap-2 cursor-pointer hover:opacity-70 transition-all overflow-visible"
                >
                  <Icon className="w-5 h-5 shrink-0" style={{ color: item.color }} />
                  <span className="text-[12px] font-semibold text-black break-words">{item.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Panel - Message Form */}
      <div className="flex-1 flex flex-col p-5 h-full bg-white order-1 md:order-2 overflow-hidden">
        <div className="flex flex-col h-full justify-between">
          <h3 className="text-[11px] font-bold tracking-wider text-zinc-800 uppercase mb-2">
            MESSAGE
          </h3>

          {isSuccess ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-4 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 my-auto min-h-[220px] animate-in fade-in zoom-in-95 duration-300">
              <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mb-2">
                <Check className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-0.5">Message Sent!</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-[220px] mb-4 leading-relaxed">
                Thanks for reaching out! I will get back to you shortly.
              </p>
              <button
                onClick={() => setIsSuccess(false)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-[9px] tracking-wider uppercase rounded-md transition-all duration-200"
              >
                Send Another
              </button>
            </div>
          ) : (
            <form onSubmit={submissionHandler} className="flex-1 flex flex-col justify-between min-h-0">
              <div className="space-y-3">
                {/* Name Input */}
                <div className="relative border border-zinc-200 rounded-lg py-1.5 px-2.5 focus-within:border-zinc-400">
                  <label className="absolute -top-2 left-2.5 bg-white px-1 text-[9px] font-bold text-zinc-500">
                    NAME
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                    placeholder="Your name here"
                    className="w-full bg-transparent outline-none text-xs text-zinc-800 placeholder-zinc-300 pt-0.5"
                  />
                </div>

                {/* Email Input */}
                <div className="relative border border-zinc-200 rounded-lg py-1.5 px-2.5 focus-within:border-zinc-400">
                  <label className="absolute -top-2 left-2.5 bg-white px-1 text-[9px] font-bold text-zinc-500">
                    EMAIL
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                    placeholder="your.email@example.com"
                    className="w-full bg-transparent outline-none text-xs text-zinc-800 placeholder-zinc-300 pt-0.5"
                  />
                </div>

                {/* Message Input (Height optimized to prevent overflow) */}
                <div className="relative border border-zinc-200 rounded-lg py-1.5 px-2.5 focus-within:border-zinc-400">
                  <label className="absolute -top-2 left-2.5 bg-white px-1 text-[9px] font-bold text-zinc-500">
                    MESSAGE
                  </label>
                  <textarea
                    required
                    value={formData.message}
                    onChange={e => setFormData(p => ({ ...p, message: e.target.value }))}
                    placeholder="Tell me about your project..."
                    className="w-full h-16 md:h-20 bg-transparent outline-none text-xs text-zinc-800 placeholder-zinc-300 pt-0.5 resize-none"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full mt-3 active:scale-[0.98] text-white font-bold text-[10px] tracking-widest py-2.5 rounded-lg transition-all uppercase flex items-center justify-center gap-2 disabled:opacity-50 ${isFormReady
                  ? 'bg-blue-600 hover:bg-blue-700 shadow-[0_0_12px_rgba(37,99,235,0.4)]'
                  : 'bg-zinc-950 hover:bg-zinc-800'
                  }`}
              >
                {isSubmitting ? 'SENDING...' : (
                  <>
                    SEND MESSAGE <Send className="w-3.5 h-3.5 fill-current" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>

    </div>
  );
}