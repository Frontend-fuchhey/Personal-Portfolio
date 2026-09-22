import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Smartphone, Check, Copy, QrCode, ShieldCheck, Share, ArrowRight, Settings, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';
import QRCode from 'qrcode';

interface DownloadInfo {
  android?: {
    url: string;
    filename?: string;
    version?: string;
    size?: string;
    label?: string;
  };
  ios?: {
    url?: string;
    profileUrl?: string;
    version?: string;
    label?: string;
  };
}

interface MobileDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectName?: string;
  downloads?: DownloadInfo;
}

export function MobileDownloadModal({
  isOpen,
  onClose,
  projectName = 'Shrawan OS',
  downloads
}: MobileDownloadModalProps) {
  const [activeTab, setActiveTab] = useState<'ios' | 'android' | 'qr'>('ios');
  const [copied, setCopied] = useState(false);
  const [iosDownloaded, setIosDownloaded] = useState(false);
  const [androidDownloaded, setAndroidDownloaded] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.origin : 'https://shrawankarki.com.np';
  const targetUrl = typeof window !== 'undefined' && !window.location.hostname.includes('localhost') && !window.location.hostname.includes('127.0.0.1')
    ? window.location.origin
    : 'https://shrawankarki.com.np';

  const apkUrl = downloads?.android?.url || '/downloads/ShrawanOS.apk';
  const apkFilename = downloads?.android?.filename || 'ShrawanOS.apk';
  const profileUrl = downloads?.ios?.profileUrl || '/downloads/ShrawanOS.mobileconfig';

  useEffect(() => {
    QRCode.toDataURL(targetUrl, {
      width: 240,
      margin: 1,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      },
      errorCorrectionLevel: 'M'
    })
      .then((url) => setQrDataUrl(url))
      .catch(() => {
        // Fallback to online QR API
        setQrDataUrl(`https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=10&data=${encodeURIComponent(targetUrl)}`);
      });
  }, [targetUrl]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleIosDownload = () => {
    setIosDownloaded(true);
    // Create download link and trigger
    const link = document.createElement('a');
    link.href = profileUrl;
    link.download = 'ShrawanOS.mobileconfig';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAndroidDownload = () => {
    setAndroidDownloaded(true);
    const link = document.createElement('a');
    link.href = apkUrl;
    link.download = apkFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-4 bg-slate-500/20 backdrop-blur-md">
        {/* Backdrop click to close */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0"
          onClick={onClose}
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          transition={{ type: 'spring', damping: 26, stiffness: 320 }}
          className="relative z-10 w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden flex flex-col h-[480px] max-h-[92vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative px-6 pt-6 pb-4 border-b border-slate-100 dark:border-slate-800/80 bg-gradient-to-b from-slate-50/70 to-white dark:from-slate-800/50 dark:to-slate-900 shrink-0">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                {/* App icon preview on white background */}
                <div className="w-12 h-12 rounded-2xl bg-white p-1 shadow-md shadow-slate-300/50 dark:shadow-black/40 border border-slate-200/80 dark:border-slate-700 flex items-center justify-center shrink-0">
                  <img
                    src="/apple-touch-icon.png"
                    alt="Shrawan OS Icon"
                    className="w-full h-full object-contain rounded-xl"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                    {projectName} Mobile
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Install with your custom icon on iPhone &amp; Android
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                aria-label="Close modal"
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Platform Selector Tabs */}
            <div className="flex items-center gap-2 mt-4 p-1 bg-slate-100 dark:bg-slate-800/70 rounded-xl">
              <button
                onClick={() => setActiveTab('ios')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'ios'
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.42c.62-.76 1.05-1.81.93-2.87-.9.04-2.01.6-2.66 1.36-.57.66-.99 1.74-.86 2.76 1.01.08 2.05-.53 2.59-1.25z" />
                </svg>
                iOS
              </button>

              <button
                onClick={() => setActiveTab('android')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'android'
                    ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.551 0 .9993.4482.9993.9993.0001.5511-.4483.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1521-.5676.416.416 0 00-.5676.1521l-2.0223 3.503C15.5902 8.4116 13.8533 8.125 12 8.125c-1.8535 0-3.5903.2866-5.1368.8247L4.8409 5.4467a.4161.4161 0 00-.5677-.1521.4157.4157 0 00-.1521.5676l1.9973 3.4592C2.6889 11.1867.3432 14.6589 0 18.761h24c-.3432-4.1021-2.6889-7.5743-6.1185-9.4396" />
                </svg>
                Android (APK)
              </button>

              <button
                onClick={() => setActiveTab('qr')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'qr'
                    ? 'bg-white dark:bg-slate-700 text-violet-600 dark:text-violet-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <QrCode className="w-4 h-4" />
                Scan QR
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 custom-scrollbar">
            {/* IOS TAB */}
            {activeTab === 'ios' && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                {/* Download / Post-download Instruction Area */}
                {!iosDownloaded ? (
                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={handleIosDownload}
                      className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-2xl bg-white hover:bg-purple-50/50 text-purple-600 font-bold text-sm tracking-wide border-2 border-purple-600/30 hover:border-purple-600 shadow-md shadow-purple-500/10 hover:shadow-purple-500/20 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                    >
                      <Download className="w-4 h-4 text-purple-600" />
                      Download for IOS
                    </button>
                    <p className="text-[11px] text-center text-slate-500 dark:text-slate-400">
                      Download Apple Web Profile
                    </p>
                  </div>
                ) : (
                  /* POST DOWNLOAD GUIDANCE: Exact steps to finish install in iOS Settings */
                  <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border-2 border-indigo-500/30 space-y-3.5"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-indigo-200/50 dark:border-indigo-800/50">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                        <span className="text-xs font-bold text-indigo-950 dark:text-indigo-200">
                          Profile Downloaded! Next: Finish Install
                        </span>
                      </div>
                      <button
                        onClick={handleIosDownload}
                        className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                      >
                        Re-download
                      </button>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                      Apple requires you to confirm profile installation in Settings to place the icon on your Home Screen:
                    </p>

                    <div className="space-y-2.5">
                      <div className="flex items-start gap-3 p-2.5 rounded-xl bg-white/90 dark:bg-slate-800/90 border border-indigo-100 dark:border-indigo-900/60 shadow-xs">
                        <div className="w-6 h-6 rounded-full bg-indigo-600 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                          1
                        </div>
                        <div className="text-xs leading-snug">
                          <span className="font-bold text-slate-900 dark:text-white">Open iPhone Settings</span>
                          <p className="text-slate-500 dark:text-slate-400 text-[11px]">Go to your iPhone home screen and open the <strong>Settings</strong> app ⚙️.</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-2.5 rounded-xl bg-white/90 dark:bg-slate-800/90 border border-indigo-100 dark:border-indigo-900/60 shadow-xs">
                        <div className="w-6 h-6 rounded-full bg-indigo-600 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                          2
                        </div>
                        <div className="text-xs leading-snug">
                          <span className="font-bold text-slate-900 dark:text-white">Tap "Profile Downloaded"</span>
                          <p className="text-slate-500 dark:text-slate-400 text-[11px]">It appears right near the top of Settings, directly under your name.</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-2.5 rounded-xl bg-white/90 dark:bg-slate-800/90 border border-indigo-100 dark:border-indigo-900/60 shadow-xs">
                        <div className="w-6 h-6 rounded-full bg-indigo-600 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                          3
                        </div>
                        <div className="text-xs leading-snug">
                          <span className="font-bold text-slate-900 dark:text-white">Tap "Install" at Top-Right</span>
                          <p className="text-slate-500 dark:text-slate-400 text-[11px]">Enter your passcode and confirm <strong>Install</strong>. Shrawan OS will instantly appear on your Home Screen!</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Alternative: Safari Add to Home Screen (Instant 1-Click) */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                      <Share className="w-3.5 h-3.5 text-indigo-500" />
                      Alternative: Safari "Add to Home Screen"
                    </span>
                    <span className="text-[10px] text-slate-400">No Settings Required</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2 leading-relaxed">
                    If you prefer not to use Settings:
                  </p>
                  <div className="flex items-center justify-between gap-1 text-[11px] text-slate-600 dark:text-slate-300 font-medium">
                    <span className="flex items-center gap-1">1. In Safari, tap Share (⎋)</span>
                    <ChevronRight className="w-3 h-3 text-slate-400" />
                    <span className="flex items-center gap-1">2. Tap "Add to Home Screen" ⊞</span>
                    <ChevronRight className="w-3 h-3 text-slate-400" />
                    <span className="flex items-center gap-1">3. Tap "Add"</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ANDROID TAB */}
            {activeTab === 'android' && (
              <motion.div
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={handleAndroidDownload}
                    className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-2xl bg-white hover:bg-emerald-50/50 text-emerald-600 font-bold text-sm tracking-wide border-2 border-emerald-600/30 hover:border-emerald-600 shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/20 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-emerald-600" />
                    Download APK
                  </button>

                  <div className="flex items-center justify-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
                    <span>Size: {downloads?.android?.size || '14.2 MB'}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                      <ShieldCheck className="w-3.5 h-3.5" /> Verified Clean Package
                    </span>
                  </div>
                </div>

                {androidDownloaded && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3.5 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-500/30 flex items-start gap-2.5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <div className="text-xs text-slate-600 dark:text-slate-300">
                      <span className="font-bold text-slate-900 dark:text-white">Download started!</span> Tap the downloaded APK in your notifications to install.
                    </div>
                  </motion.div>
                )}

                {/* Android Steps */}
                <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/50 p-4 border border-slate-200/60 dark:border-slate-700/50">
                  <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                    How to install on Android
                  </h5>
                  <ol className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 list-decimal list-inside leading-relaxed">
                    <li>Tap <strong>Download Android APK</strong> above.</li>
                    <li>Tap the completed file in your notifications or Downloads folder.</li>
                    <li>If prompted, tap <strong>Settings</strong> &amp; toggle <em>Allow from this source</em>.</li>
                    <li>Tap <strong>Install</strong> to add Shrawan OS to your phone.</li>
                  </ol>
                </div>
              </motion.div>
            )}

            {/* QR TAB */}
            {activeTab === 'qr' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-4 flex flex-col items-center text-center"
              >
                <div className="p-3 bg-white rounded-2xl shadow-md border border-slate-200 dark:border-slate-700 inline-block">
                  {qrDataUrl ? (
                    <img
                      src={qrDataUrl}
                      alt="Scan to open Shrawan OS on phone"
                      className="w-44 h-44 rounded-xl object-contain block"
                    />
                  ) : (
                    <div className="w-44 h-44 flex items-center justify-center text-xs text-slate-400">
                      Generating QR...
                    </div>
                  )}
                </div>

                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-white">
                    Scan with iPhone or Android Camera
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Opens the mobile OS directly on your device
                  </p>
                </div>

                <div className="flex items-center gap-2 w-full max-w-sm">
                  <input
                    type="text"
                    readOnly
                    value={currentUrl}
                    className="flex-1 px-3 py-2 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-600 dark:text-slate-300 select-all"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 transition-colors shadow-sm shrink-0 cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
