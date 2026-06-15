import React from "react";
import PageLayout from "@/components/PageLayout";
import PageTitle from "@/components/PageTitle";
import { Shield, CheckCircle } from "lucide-react";

export default function AccessTestPrivate() {
  return (
    <PageLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <PageTitle
          arabic="اختبار الوصول"
          latin="ACCESS TEST"
          subtitle="PRIVATE PAGE — VERIFICATION ONLY"
          icon="🛡️"
        />

        <div
          className="card-dark p-6 w-full max-w-md text-center mt-4"
          style={{ borderColor: "rgba(34, 197, 94, 0.45)" }}
        >
          <CheckCircle className="w-10 h-10 mx-auto mb-3" style={{ color: "#22c55e" }} />
          <h3 className="font-inter text-sm font-bold tracking-wide text-white mb-1">
            ACCESS GRANTED
          </h3>
          <p className="font-inter text-xs text-white/50">
            You have successfully accessed this private test page.
          </p>
        </div>

        <div className="card-dark p-4 w-full max-w-md mt-3">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4" style={{ color: "#D4AF37" }} />
            <span className="font-inter text-xs font-semibold tracking-wider text-gold">
              VERIFICATION DETAILS
            </span>
          </div>
          <p className="font-inter text-xs text-white/40 leading-relaxed">
            This page is used exclusively to verify the access control system.
            It will be deleted once testing is complete.
          </p>
        </div>
      </div>
    </PageLayout>
  );
}