import React, { useState } from 'react';
import { X, ShieldAlert, Loader2 } from 'lucide-react';
import { authenticateAdmin } from '../../lib/adminAuth';

interface SecretAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SecretAdminModal({ isOpen, onClose }: SecretAdminModalProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);

    const result = await authenticateAdmin();

    setIsLoading(false);
    if (result.success) {
      setIsAuthenticated(true);
      setError(null);
    } else {
      setIsAuthenticated(false);
      setError(result.error || 'Access Denied: Authentication failed.');
    }
  };

  const handleClose = () => {
    setError(null);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-md bg-[#12131A] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Window Title Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/10 select-none">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block hover:opacity-80 cursor-pointer" onClick={handleClose} />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
            <span className="text-xs font-mono text-zinc-400 ml-2 tracking-wide">
              {isAuthenticated ? 'admin@shrawan-os:~' : 'sudo-gateway'}
            </span>
          </div>
          <button
            onClick={handleClose}
            className="text-zinc-400 hover:text-white transition-colors p-1 rounded-md hover:bg-white/10"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-8 flex flex-col items-center justify-center text-center">
          {isAuthenticated ? (
            /* Authenticated State: Displays a clean window with only the text "this is admin side" */
            <div className="py-12 px-6 flex flex-col items-center justify-center">
              <p className="text-xl md:text-2xl font-mono text-emerald-400 font-semibold tracking-wider">
                this is admin side
              </p>
            </div>
          ) : (
            /* Unauthenticated State */
            <div className="w-full flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
                <ShieldAlert className="w-7 h-7 text-red-400" />
              </div>

              <h3 className="text-lg font-bold text-white mb-1 tracking-tight">
                Root Access Required
              </h3>
              <p className="text-xs text-zinc-400 mb-6 max-w-xs font-mono">
                Verify administrator credentials to access root permissions.
              </p>

              {/* Continue with Google button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full max-w-xs flex items-center justify-center gap-3 px-5 py-3.5 bg-white text-zinc-900 hover:bg-zinc-100 font-semibold text-sm rounded-xl transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-zinc-700" />
                    <span>Verifying Admin Rights...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                      />
                    </svg>
                    <span>Continue with Google</span>
                  </>
                )}
              </button>

              {/* Error State: Displays red error text if sign-in fails or access is denied */}
              {error && (
                <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 max-w-xs w-full text-left">
                  <p className="text-red-500 text-xs font-mono font-medium leading-relaxed">
                    {error}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SecretAdminModal;
