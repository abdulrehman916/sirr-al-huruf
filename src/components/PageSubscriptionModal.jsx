import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Check, Clock } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

const G = {
  border: "rgba(212,175,55,0.40)",
  borderHi: "rgba(212,175,55,0.65)",
  glow: "rgba(212,175,55,0.22)",
  text: "#F5D060",
  dim: "rgba(212,175,55,0.55)",
  bg: "rgba(212,175,55,0.07)",
  bgHi: "rgba(212,175,55,0.14)"
};

// Page-specific subscription plans
const PAGE_PLANS_CONFIG = {
  '/abjad': {
    name: 'Abjad Kabir',
    plans: [
      { id: 'abjad_30', name: '30 Days', price: '₹299', duration_days: 30, features: ['Full Abjad access', 'All calculation modes', 'Reference tables'] },
      { id: 'abjad_180', name: '6 Months', price: '₹899', duration_days: 180, features: ['Full Abjad access', 'All calculation modes', 'Reference tables', 'Save calculations'] },
      { id: 'abjad_365', name: '1 Year', price: '₹1499', duration_days: 365, features: ['Full Abjad access', 'All calculation modes', 'Reference tables', 'Save calculations', 'Priority support'] }
    ]
  },
  '/hadim': {
    name: 'Hadim',
    plans: [
      { id: 'hadim_30', name: '30 Days', price: '₹399', duration_days: 30, features: ['Hadim calculations', 'Kasem analysis', 'Zikr recommendations'] },
      { id: 'hadim_180', name: '6 Months', price: '₹999', duration_days: 180, features: ['Hadim calculations', 'Kasem analysis', 'Zikr recommendations', 'Save sessions'] },
      { id: 'hadim_lifetime', name: 'Lifetime', price: '₹2999', duration_days: 'LIFETIME', features: ['Lifetime access', 'All features', 'Unlimited saves', 'Priority support'] }
    ]
  },
  '/vefkin-yapilisi': {
    name: 'Vefkin Yapilisi',
    plans: [
      { id: 'vefk_30', name: '30 Days', price: '₹499', duration_days: 30, features: ['Vefk creation', 'Grid generation', 'Letter analysis'] },
      { id: 'vefk_180', name: '6 Months', price: '₹1299', duration_days: 180, features: ['Vefk creation', 'Grid generation', 'Letter analysis', 'Export PDF'] },
      { id: 'vefk_lifetime', name: 'Lifetime', price: '₹3999', duration_days: 'LIFETIME', features: ['Lifetime access', 'All features', 'Unlimited exports', 'Priority support'] }
    ]
  },
  '/mizaan9': {
    name: 'Mizan 9',
    plans: [
      { id: 'mizan_30', name: '30 Days', price: '₹399', duration_days: 30, features: ['Mizan calculations', '9-step process', 'Result analysis'] },
      { id: 'mizan_180', name: '6 Months', price: '₹999', duration_days: 180, features: ['Mizan calculations', '9-step process', 'Result analysis', 'Save history'] },
      { id: 'mizan_lifetime', name: 'Lifetime', price: '₹2999', duration_days: 'LIFETIME', features: ['Lifetime access', 'All features', 'Unlimited saves', 'Priority support'] }
    ]
  },
  '/magic-sqayer': {
    name: 'Magic Sqayer',
    plans: [
      { id: 'sqayer_30', name: '30 Days', price: '₹349', duration_days: 30, features: ['Sqayer calculations', 'Pattern analysis'] },
      { id: 'sqayer_180', name: '6 Months', price: '₹899', duration_days: 180, features: ['Sqayer calculations', 'Pattern analysis', 'Save results'] },
      { id: 'sqayer_365', name: '1 Year', price: '₹1499', duration_days: 365, features: ['Full access', 'All features', 'Priority support'] }
    ]
  },
  '/basthul-huroof-2': {
    name: 'Basthul Huroof',
    plans: [
      { id: 'bast_30', name: '30 Days', price: '₹299', duration_days: 30, features: ['Bast calculations', 'Letter spreading'] },
      { id: 'bast_180', name: '6 Months', price: '₹799', duration_days: 180, features: ['Bast calculations', 'Letter spreading', 'Save sessions'] },
      { id: 'bast_lifetime', name: 'Lifetime', price: '₹2499', duration_days: 'LIFETIME', features: ['Lifetime access', 'All features', 'Unlimited saves'] }
    ]
  },
  '/faal-hasrath': {
    name: 'Faal Hasrath',
    plans: [
      { id: 'faal_30', name: '30 Days', price: '₹249', duration_days: 30, features: ['Faal calculations', 'Quick answers'] },
      { id: 'faal_180', name: '6 Months', price: '₹649', duration_days: 180, features: ['Faal calculations', 'Quick answers', 'History'] },
      { id: 'faal_365', name: '1 Year', price: '₹999', duration_days: 365, features: ['Full access', 'All features', 'Priority support'] }
    ]
  },
  '/evil-jinn': {
    name: 'Evil Jinn',
    plans: [
      { id: 'jinn_30', name: '30 Days', price: '₹199', duration_days: 30, features: ['Jinn information', 'Protection rules'] },
      { id: 'jinn_180', name: '6 Months', price: '₹499', duration_days: 180, features: ['Jinn information', 'Protection rules', 'Remedies'] },
      { id: 'jinn_lifetime', name: 'Lifetime', price: '₹1499', duration_days: 'LIFETIME', features: ['Lifetime access', 'All content', 'Updates included'] }
    ]
  },
  '/holy-names': {
    name: 'Holy Names',
    plans: [
      { id: 'holy_30', name: '30 Days', price: '₹199', duration_days: 30, features: ['Holy names database', 'Meanings'] },
      { id: 'holy_180', name: '6 Months', price: '₹499', duration_days: 180, features: ['Holy names database', 'Meanings', 'Search'] },
      { id: 'holy_lifetime', name: 'Lifetime', price: '₹1499', duration_days: 'LIFETIME', features: ['Lifetime access', 'All content', 'Updates'] }
    ]
  },
  '/astro-clock': {
    name: 'Astro Clock',
    plans: [
      { id: 'astro_30', name: '30 Days', price: '₹399', duration_days: 30, features: ['Live planetary hours', 'Moon mansion tracking'] },
      { id: 'astro_180', name: '6 Months', price: '₹999', duration_days: 180, features: ['Live planetary hours', 'Moon mansion tracking', 'Timing advisor'] },
      { id: 'astro_lifetime', name: 'Lifetime', price: '₹2999', duration_days: 'LIFETIME', features: ['Lifetime access', 'All features', 'Priority support'] }
    ]
  }
};

export default function PageSubscriptionModal({ isOpen, onClose, pagePath }) {
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pricing, setPricing] = useState([]);
  const [fetchingPricing, setFetchingPricing] = useState(true);
  
  // Get page config
  const pageConfig = PAGE_PLANS_CONFIG[pagePath] || PAGE_PLANS_CONFIG['/abjad'];
  const pageTitle = pageConfig.name;

  useEffect(() => {
    if (isOpen && pagePath) {
      fetchPricing();
    }
  }, [isOpen, pagePath]);

  const fetchPricing = async () => {
    setFetchingPricing(true);
    try {
      const res = await base44.functions.invoke('getPagePricing', { page_path: pagePath });
      if (res.data.success && res.data.pricing.length > 0) {
        // Map pricing to plans
        const plansWithPricing = pageConfig.plans.map(plan => {
          const pricingInfo = res.data.pricing.find(p => p.plan_name === plan.id.replace(/_\d+/, '').toUpperCase() + '_MONTH') || 
                             res.data.pricing.find(p => plan.id.includes('30') && p.plan_name === '1_MONTH') ||
                             res.data.pricing.find(p => plan.id.includes('180') && p.plan_name === '6_MONTHS') ||
                             res.data.pricing.find(p => plan.id.includes('365') && p.plan_name === '1_YEAR') ||
                             res.data.pricing.find(p => plan.id.includes('lifetime') && p.plan_name === 'LIFETIME');
          
          return {
            ...plan,
            price: pricingInfo ? `${pricingInfo.currency} ${pricingInfo.price}` : plan.price,
            currency: pricingInfo?.currency || 'AED'
          };
        });
        setPricing(plansWithPricing);
      } else {
        setPricing(pageConfig.plans);
      }
    } catch (error) {
      console.error('Error fetching pricing:', error);
      setPricing(pageConfig.plans);
    }
    setFetchingPricing(false);
  };

  const pagePlans = pricing.length > 0 ? pricing : pageConfig.plans;

  const handleSubscribe = async (plan) => {
    setLoading(true);
    try {
      const response = await base44.functions.invoke("createPageSubscription", {
        page_path: pagePath,
        page_name: pageTitle,
        plan_name: plan.id,
        duration_days: plan.duration_days
      });

      if (response.data.success) {
        toast({
          title: "Subscription Activated!",
          description: `You now have ${plan.name} access to ${pageTitle}`,
          variant: "default"
        });
        onClose();
      }
    } catch (error) {
      toast({
        title: "Subscription Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!pagePlans || pagePlans.length === 0) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-700">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-white text-xl">
              Subscribe to {pageTitle}
            </DialogTitle>
            <button onClick={onClose} className="text-white/60 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {fetchingPricing ? (
            <div className="col-span-full flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            pagePlans.map((plan, idx) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`p-5 rounded-xl border cursor-pointer transition-all ${
                  selectedPlan?.id === plan.id 
                    ? 'border-gold bg-gold/10' 
                    : 'border-white/10 hover:border-gold/50'
                }`}
                style={{
                  background: selectedPlan?.id === plan.id ? G.bgHi : 'rgba(255,255,255,0.03)'
                }}
                onClick={() => setSelectedPlan(plan)}
              >
                {/* Plan name */}
                <h3 className="font-inter text-lg font-bold text-white mb-2">
                  {plan.name}
                </h3>

                {/* Price */}
                <div className="mb-4">
                  <span className="font-inter text-3xl font-bold" style={{ color: G.text }}>
                    {plan.price}
                  </span>
                </div>

                {/* Features */}
                <div className="space-y-2 mb-6">
                  {plan.features.map((feature, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2">
                      <Check className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: G.text }} />
                      <span className="text-white/80 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Select button */}
                <Button
                  className={`w-full ${
                    selectedPlan?.id === plan.id 
                      ? 'bg-gold text-black' 
                      : 'bg-white/10 text-white hover:bg-gold/20'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSubscribe(plan);
                  }}
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Select Plan'}
                </Button>
              </motion.div>
            ))
          )}
        </div>

        {/* Info */}
        <div className="mt-6 p-4 rounded-lg" style={{ background: G.bg, border: `1px solid ${G.border}` }}>
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: G.text }} />
            <div>
              <p className="text-white/80 text-sm font-semibold mb-1">Instant Access</p>
              <p className="text-white/60 text-xs">
                Your subscription activates immediately. Access will be granted to {pageTitle} upon successful subscription.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}