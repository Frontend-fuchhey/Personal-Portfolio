import React from 'react';

export const ResumeApp: React.FC = () => {
  const pdfPath = '/Shrawan_karki_CV.pdf';

  return (
    <div className="w-full h-full flex flex-col bg-zinc-900 text-white overflow-hidden">
      {/* Top PDF Action Bar */}
      <div className="shrink-0 h-10 bg-zinc-800 border-b border-zinc-700/80 px-4 flex items-center justify-between text-xs">
        <span className="font-semibold text-zinc-300 flex items-center gap-2">
          📄 <span>Shrawan_karki_CV.pdf</span>
        </span>
        <a
          href={pdfPath}
          download="Shrawan_karki_CV.pdf"
          className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition flex items-center gap-1"
        >
          <span>Download PDF</span> ⬇️
        </a>
      </div>

      {/* PDF Embedded Viewport */}
      <div className="flex-1 w-full h-full bg-zinc-950">
        <iframe
          src={`${pdfPath}#toolbar=0&navpanes=0&scrollbar=1`}
          title="Shrawan Karki CV"
          className="w-full h-full border-none"
        />
      </div>
    </div>
  );
};

export default ResumeApp;