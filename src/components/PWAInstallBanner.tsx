import React, { useState, useEffect } from 'react';
import { Smartphone, Download, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PWAInstallBanner: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Detect iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handler as EventListener);

    // Show on iOS if not in standalone mode
    if (isIOSDevice && !(window.navigator as any).standalone) {
      setShowBanner(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler as EventListener);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowBanner(false);
      }
      setDeferredPrompt(null);
    }
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 rounded-lg bg-blue-600 p-4 text-white shadow-lg md:bottom-auto md:left-auto md:right-4 md:top-4 md:w-96">
      <div className="flex items-start gap-3">
        <Smartphone className="mt-1 size-6 shrink-0" />
        <div className="flex-1">
          <h3 className="font-semibold">Install Aplikasi</h3>
          <p className="mt-1 text-sm opacity-90">
            {isIOS
              ? 'Klik tombol "Share" (Bagikan) lalu pilih "Add to Home Screen" (Tambahkan ke Layar Utama).'
              : 'Pasang aplikasi kami di perangkat Anda untuk akses lebih cepat.'}
          </p>
        </div>
        <button onClick={() => setShowBanner(false)} className="shrink-0 p-1">
          <X className="size-5" />
        </button>
      </div>
      {!isIOS && deferredPrompt && (
        <button
          onClick={handleInstall}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-md bg-white px-3 py-2 text-sm font-semibold text-blue-600"
        >
          <Download className="size-4" />
          Pasang Sekarang
        </button>
      )}
    </div>
  );
};
