import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";

export default function AccountModal({ user, onClose }) {
  const navigate = useNavigate();
  const { role } = useAuth();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (user?.id) {
      base44.entities.UserAccessProfile.filter({ user_id: user.id })
        .then(profiles => {
          if (profiles && profiles.length > 0) {
            setProfile(profiles[0]);
          }
        })
        .catch(console.error);
    }
  }, [user]);

  const handleLogout = async () => {
    await base44.auth.logout('/onboarding');
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        style={{ background: "rgba(0,0,0,0.70)" }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="w-full max-w-md rounded-2xl border p-6"
          style={{
            background: "linear-gradient(145deg, rgba(10,36,62,0.99) 0%, rgba(6,22,44,0.99) 100%)",
            borderColor: "rgba(212,175,55,0.30)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.60), 0 0 40px rgba(212,175,55,0.10)",
          }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center text-2xl font-bold"
              style={{
                background: "linear-gradient(135deg, rgba(212,175,55,0.30), rgba(212,175,55,0.10))",
                border: "2px solid rgba(212,175,55,0.40)",
                color: "#E8C84A",
              }}>
              {user?.full_name?.[0]?.toUpperCase() || 'U'}
            </div>
            <h2 className="font-amiri text-2xl font-bold text-white">{user?.full_name || 'User'}</h2>
            <p className="font-inter text-xs text-white/50 mt-1">{user?.email}</p>
          </div>

          {/* Profile Info */}
          {profile && (
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between py-2 border-b border-white/10">
                <span className="font-inter text-xs text-white/60">Role</span>
                <span className={`font-inter text-xs font-semibold px-2 py-1 rounded-full ${
                  role === 'owner' || profile.role === 'admin'
                    ? 'text-amber-400 bg-amber-400/10'
                    : 'text-blue-400 bg-blue-400/10'
                }`}>
                  {role === 'owner' ? 'OWNER' : profile.role?.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-white/10">
                <span className="font-inter text-xs text-white/60">Status</span>
                <span className="font-inter text-xs font-semibold text-green-400 bg-green-400/10 px-2 py-1 rounded-full">
                  {profile.account_status || 'ACTIVE'}
                </span>
              </div>
              {profile.subscription_plan && profile.subscription_plan !== 'NONE' && (
                <div className="flex items-center justify-between py-2 border-b border-white/10">
                  <span className="font-inter text-xs text-white/60">Subscription</span>
                  <span className="font-inter text-xs font-semibold text-purple-400 bg-purple-400/10 px-2 py-1 rounded-full">
                    {profile.subscription_plan.replace('_', ' ')}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="space-y-2">
            {user?.role === 'admin' && (
              <button
                onClick={() => { onClose(); navigate('/admin/access-dashboard'); }}
                className="w-full py-3 px-4 rounded-xl font-inter text-sm font-semibold"
                style={{
                  background: "linear-gradient(135deg, rgba(212,175,55,0.30), rgba(212,175,55,0.15))",
                  border: "1px solid rgba(212,175,55,0.40)",
                  color: "#E8C84A",
                  }}>
                  {role === 'owner' ? 'Owner Dashboard' : 'Admin Dashboard'}
                  </button>
            )}
            
            <button
              onClick={handleLogout}
              className="w-full py-3 px-4 rounded-xl font-inter text-sm font-semibold text-white/80 hover:text-white"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.15)",
              }}>
              Logout
            </button>
            
            <button
              onClick={onClose}
              className="w-full py-2.5 px-4 rounded-xl font-inter text-xs text-white/50 hover:text-white/80"
              style={{ background: "transparent" }}>
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}