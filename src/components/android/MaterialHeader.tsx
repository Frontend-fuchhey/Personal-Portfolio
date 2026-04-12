import { ArrowLeft } from 'lucide-react';

interface MaterialHeaderProps {
  title: string;
  onBack: () => void;
}

export function MaterialHeader({ title, onBack }: MaterialHeaderProps) {
  return (
    <div className="h-16 bg-white border-b border-gray-100 flex items-center px-4 gap-6 fixed top-6 left-0 right-0 z-[1000] shadow-sm">
      <button 
        onClick={onBack}
        className="p-2 -ml-2 text-gray-700 hover:bg-gray-50 rounded-full transition-colors active:scale-90"
      >
        <ArrowLeft size={24} />
      </button>
      <h1 className="text-xl font-bold font-roboto text-gray-900 tracking-tight">
        {title}
      </h1>
    </div>
  );
}
