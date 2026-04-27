import { useState } from 'react';
import { Mail, Linkedin, Github, MapPin, Send } from 'lucide-react';
import { USER_CONFIG } from '../../data/userConfig';

export function ContactApp() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isFormReady = formData.name.trim() !== '' && formData.email.trim() !== '' && formData.message.trim() !== '';

  const submissionHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          access_key: '97d3105d-c0c0-488d-9f46-b4c76208352b',
          ...formData
        })
      });
      setFormData({ name: '', email: '', message: '' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactNodes = [
    { id: 'email', title: 'EMAIL', label: 'pratyushkarki6@gmail.com', icon: Mail, color: '#EA4335', link: 'mailto:pratyushkarki6@gmail.com' },
    { id: 'github', title: 'GITHUB', label: 'GitHub', icon: Github, color: '#181717', link: 'https://github.com/frontend-fuchhey' },
    { id: 'linkedin', title: 'LINKEDIN', label: 'LinkedIn', icon: Linkedin, color: '#0077B5', link: 'https://www.linkedin.com/in/shrawan-karki/' },
    { id: 'location', title: 'LOCATION', label: 'Morang, Nepal', icon: MapPin, color: '#EA4335', link: '#' },
  ];

  return (
    <div className="w-full max-w-[500px] min-h-[600px] max-h-[90vh] mx-auto grid grid-cols-1 md:grid-cols-[35%_65%] font-sans relative overflow-x-hidden overflow-y-auto rounded-[1rem] shadow-2xl border border-black/5 bg-white/10 backdrop-blur-[20px]">
      
      {/* Left Panel - Contact Info */}
      <div className="py-6 px-4 min-w-[140px] flex flex-col order-2 md:order-1 border-t md:border-t-0 md:border-r border-black/10">
        <h2 className="text-[15px] font-extrabold text-[#1e293b] tracking-wider mb-8">CONTACT INFO</h2>
        
        <div className="bg-white/50 rounded-xl p-6 flex justify-center mb-8 shadow-sm">
          <div className="relative shrink-0">
            <div className="w-[54px] h-[54px] rounded-full border-[3px] border-white shadow-sm overflow-hidden">
              <img src={USER_CONFIG.profilePic} className="w-full h-full object-cover" alt={USER_CONFIG.name} />
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

            return (
              <div key={item.id} className="flex flex-col">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">{item.title}</span>
                <div 
                  onClick={() => {
                    if(item.id === 'email') window.location.href = item.link;
                    navigator.clipboard.writeText(item.label);
                  }}
                  className="flex items-center flex-nowrap gap-2 cursor-pointer hover:opacity-70 transition-all overflow-visible"
                >
                  <Icon className="w-6 h-6 shrink-0" style={{ color: item.color }} />
                  <span className={`font-semibold text-black ${
                    item.id === 'email' ? 'text-[10px] sm:text-[11px] whitespace-nowrap overflow-visible leading-none tracking-tighter' : 'text-[13px] break-words'
                  }`}>{item.label}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Right Panel - Message Form */}
      <div className="bg-white p-6 flex flex-col flex-1 order-1 md:order-2">
        <h2 className="text-[15px] font-extrabold text-[#1e293b] tracking-wider mb-8">MESSAGE</h2>
        
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
              className={`w-full py-3.5 text-white font-bold text-[14px] rounded-md transition-all duration-500 flex items-center justify-center gap-3 tracking-widest disabled:opacity-50 ${
                isFormReady 
                  ? 'bg-blue-600 hover:bg-blue-700 animate-pulse brightness-110' 
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
      </div>

    </div>
  );
}
