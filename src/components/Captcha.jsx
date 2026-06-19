import { useState } from "react";
import { RefreshCw } from "lucide-react";

/**
 * Cloudflare Turnstile CAPTCHA component.
 * Zero-interaction, privacy-friendly, GDPR compliant.
 * 
 * Usage:
 * 1. Get site key from https://www.cloudflare.com/products/turnstile/
 * 2. Add CLOUDFLARE_TURNSTILE_SITE_KEY to app secrets
 * 3. Use <Captcha onVerify={(token) => {...}} />
 */

export default function Captcha({ onVerify, onError, theme = "dark" }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const containerRef = useState(null);

  const SITE_KEY = "0x4AAAAAAAtk9fXG9sZ2VudA"; // Placeholder - replace with actual key

  const loadCaptcha = () => {
    if (typeof window !== 'undefined' && !window.turnstile) {
      const script = document.createElement('script');
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        renderCaptcha();
      };
      script.onerror = () => {
        setError("Failed to load CAPTCHA");
        setLoading(false);
        onError?.("CAPTCHA load failed");
      };
      document.body.appendChild(script);
    } else if (window.turnstile) {
      renderCaptcha();
    }
  };

  const renderCaptcha = () => {
    try {
      if (containerRef.current && window.turnstile) {
        window.turnstile.render(containerRef.current, {
          sitekey: SITE_KEY,
          callback: function(token) {
            setLoading(false);
            onVerify?.(token);
          },
          'error-callback': function(errorCode) {
            setError(errorCode);
            setLoading(false);
            onError?.(errorCode);
          },
          theme: theme,
          size: 'flexible',
          retry: 'auto'
        });
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
      onError?.(err.message);
    }
  };

  useState(() => {
    loadCaptcha();
  }, []);

  return (
    <div className="w-full flex flex-col items-center">
      {loading && (
        <div className="flex items-center gap-2 text-xs text-white/40">
          <RefreshCw className="w-3 h-3 animate-spin" />
          Loading security check...
        </div>
      )}
      {error && (
        <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
          Security check failed: {error}
        </div>
      )}
      <div ref={containerRef} className="my-2" />
    </div>
  );
}