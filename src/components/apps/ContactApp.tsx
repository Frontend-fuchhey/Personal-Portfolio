import { useState } from 'react';
import { Mail, Linkedin, Github, MapPin, Send, ExternalLink } from 'lucide-react';

export function ContactApp() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    { id: 'email', label: 'pratyushkarki6@gmail.com', icon: Mail, color: '#EA4335', link: 'mailto:pratyushkarki6@gmail.com' },
    { id: 'linkedin', label: 'Shrawan Karki profile', icon: Linkedin, color: '#0077B5', link: 'https://www.linkedin.com/in/shrawan-karki/' },
    { id: 'github', label: 'shrawan-karki profile', icon: Github, color: '#181717', link: 'https://github.com/frontend-fuchhey' },
    { id: 'location', label: 'Morang, Nepal', icon: MapPin, color: '#4285F4', link: '#' },
  ];

  return (
    <div className="h-fit w-full flex flex-col bg-white/90 backdrop-blur-xl font-sans relative overflow-hidden rounded-[1rem] shadow-2xl border border-black/5 pb-[25px]">
      
      {/* 1. Header Section - Tightened */}
      <div className="p-[20px] pb-2 flex justify-between items-start">
        <div className="max-w-[70%]">
          <h1 className="text-2xl font-black text-black tracking-tight leading-tight">CONNECT WITH ME</h1>
          <p className="text-xs text-gray-500 mt-1 font-medium italic">Always open to discuss projects...</p>
        </div>
        <div className="relative shrink-0">
          <div className="w-12 h-12 rounded-full border-2 border-white shadow-lg overflow-hidden">
            <img src="/shrawan.jpg" className="w-full h-full object-cover" alt="avatar" />
          </div>
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full ring-2 ring-green-500/10" />
        </div>
      </div>

      <div className="px-[20px] flex flex-col flex-1">
        {/* 2. Contact Info Grid */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-2 pb-2">
          {contactNodes.map((item) => {
            const Icon = item.icon;
            return (
              <div 
                key={item.id}
                onClick={() => {
                  if(item.id !== 'email' && item.id !== 'location') window.open(item.link, '_blank');
                  else if(item.id === 'email') window.location.href = item.link;
                  navigator.clipboard.writeText(item.label);
                }}
                className="flex items-center gap-3 py-2 border-b border-black/5 cursor-pointer group transition-all"
              >
                <Icon className="w-5 h-5 shrink-0" style={{ color: item.color }} />
                <span className="text-[11px] font-bold text-black truncate flex-1 tracking-tight">{item.label}</span>
                <ExternalLink className="w-2.5 h-2.5 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            );
          })}
        </div>

        {/* 3. Message Form Section */}
        <div className="flex flex-col pt-2">
          <h2 className="text-[9px] font-black uppercase text-gray-400 tracking-[0.2em] mb-3">MESSAGE ME</h2>
          <form onSubmit={submissionHandler} className="space-y-4">
            <input 
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
              placeholder="Your Full Name"
              className="w-full bg-transparent border-b border-black py-2 text-[12px] placeholder:text-gray-300 focus:outline-none focus:border-blue-500 transition-colors"
            />
            <input 
              type="email"
              required
              value={formData.email}
              onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
              placeholder="email@address.com"
              className="w-full bg-transparent border-b border-black py-2 text-[12px] placeholder:text-gray-300 focus:outline-none focus:border-blue-500 transition-colors"
            />
            <textarea 
              required
              value={formData.message}
              onChange={e => setFormData(p => ({ ...p, message: e.target.value }))}
              placeholder="Message inquire..."
              className="w-full bg-transparent border-b border-black py-2 text-[12px] placeholder:text-gray-300 focus:outline-none focus:border-blue-500 transition-colors h-[70px] resize-none"
            />
            
            <div className="pt-4 flex justify-center pb-2">
              <button 
                type="submit"
                disabled={isSubmitting}
                className="flex items-center h-10 px-12 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs tracking-widest rounded-full shadow-xl shadow-blue-600/20 active:scale-95 transition-all gap-3 uppercase disabled:opacity-50"
              >
                {isSubmitting ? 'Sending...' : (
                  <>
                    SEND <Send className="w-4 h-4 fill-current" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
