import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X, Wifi, WifiOff, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePwaStatus } from "@/hooks/usePwaStatus";
import { useLanguage } from "@/contexts/LanguageContext";

export const InstallPrompt = () => {
  const { isOnline, canInstall, isInstalled, installApp } = usePwaStatus();
  const { language } = useLanguage();
  const [dismissed, setDismissed] = useState(false);
  const [showOffline, setShowOffline] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      setShowOffline(true);
      const timer = setTimeout(() => setShowOffline(false), 4000);
      return () => clearTimeout(timer);
    }
    setShowOffline(false);
  }, [isOnline]);

  const handleInstall = async () => {
    const result = await installApp();
    if (result === "accepted") setDismissed(true);
  };

  return (
    <>
      {/* Offline indicator */}
      <AnimatePresence>
        {showOffline && (
          <motion.div
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            className="fixed top-0 left-0 right-0 z-[100] bg-destructive text-destructive-foreground px-4 py-2 flex items-center justify-center gap-2 text-sm font-medium"
          >
            <WifiOff className="h-4 w-4" />
            You're offline — cached data is available
          </motion.div>
        )}
      </AnimatePresence>

      {/* Online restored */}
      <AnimatePresence>
        {isOnline && showOffline === false && (
          <motion.div
            key="online-toast"
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            transition={{ delay: 0.2 }}
            className="hidden"
          />
        )}
      </AnimatePresence>

      {/* Install prompt */}
      <AnimatePresence>
        {canInstall && !isInstalled && !dismissed && (
          <motion.div
            initial={{ y: 100, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 100, opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-sm z-50"
          >
            <div className="bg-card border border-border rounded-2xl shadow-xl p-4 tricolor-bar-top">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-primary/10 flex-shrink-0">
                  <Smartphone className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-foreground text-sm">
                    Install Farm Intellect
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Access your farm data offline, get push alerts & works like a native app
                  </p>
                  <div className="flex gap-2 mt-3">
                    <Button
                      size="sm"
                      onClick={handleInstall}
                      className="bg-accent text-accent-foreground hover:bg-accent/90 glow-saffron text-xs gap-1.5"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Install App
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setDismissed(true)}
                      className="text-xs text-muted-foreground"
                    >
                      Not now
                    </Button>
                  </div>
                </div>
                <button
                  onClick={() => setDismissed(true)}
                  className="text-muted-foreground hover:text-foreground p-1"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
