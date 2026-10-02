"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { format } from "date-fns";
import Emoji from "@/components/Emoji";
import { hand, serif } from "@/lib/fonts";

export type CertificateBadge = { title: string; description?: string | null; emoji?: string | null; imageUrl?: string | null; name?: string };

/**
 * A printable certificate for a badge. Opens over the page; printing shows only the certificate,
 * on one landscape A4 sheet. The name and date can be changed before printing.
 */
export default function BadgeCertificate({ badge, name, onClose }: { badge: CertificateBadge; name: string; onClose: () => void }) {
  const [who, setWho] = useState(name);
  const [when, setWhen] = useState(format(new Date(), "yyyy-MM-dd"));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    document.body.classList.add("printing-certificate");
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.classList.remove("printing-certificate");
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  if (!mounted) return null;
  const dateText = when ? format(new Date(when + "T12:00:00"), "d MMMM yyyy") : "";

  return createPortal(
    <div id="certificate-root" className="fixed inset-0 z-[60] overflow-y-auto bg-black/50 p-4 print:static print:bg-white print:p-0">
      <style>{`
        @media print {
          @page { size: A4 landscape; margin: 0; }
          body.printing-certificate > *:not(#certificate-root) { display: none !important; }
          #certificate-root { position: static !important; overflow: visible !important; }
          #certificate-sheet { width: 297mm !important; height: 209mm !important; max-width: none !important; margin: 0 !important; box-shadow: none !important; border-radius: 0 !important; }
        }
      `}</style>

      <div className="mx-auto mb-4 flex max-w-4xl flex-wrap items-end gap-3 rounded-2xl bg-brand-white p-4 print:hidden">
        <label className="text-sm font-semibold text-brand-charcoal">
          Name on the certificate
          <input value={who} onChange={(e) => setWho(e.target.value)} maxLength={60} className="mt-1 block rounded-xl border border-[#D9D1C4] bg-white px-3 py-2 text-sm" />
        </label>
        <label className="text-sm font-semibold text-brand-charcoal">
          Date
          <input type="date" value={when} onChange={(e) => setWhen(e.target.value)} className="mt-1 block rounded-xl border border-[#D9D1C4] bg-white px-3 py-2 text-sm" />
        </label>
        <div className="ml-auto flex gap-2">
          <button onClick={onClose} className="rounded-xl border border-[#D9D1C4] bg-white px-4 py-2.5 text-sm font-semibold text-[#6E5A46]">Close</button>
          <button onClick={() => window.print()} className="rounded-xl bg-brand-sage px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-sagedark">🖨️ Print</button>
        </div>
      </div>

      <div
        id="certificate-sheet"
        className={`${serif.variable} mx-auto flex aspect-[297/210] w-full max-w-4xl items-center justify-center rounded-xl bg-[#FDF9F0] p-[3%] shadow-2xl`}
      >
        <div className="flex h-full w-full flex-col items-center justify-center rounded-lg border-[6px] border-double border-[#C9A55A] p-[4%] text-center">
          <p className="text-[clamp(10px,1.6vw,15px)] font-bold uppercase tracking-[0.3em] text-[#6E5A46]">Certificate of achievement</p>
          <div className="my-[2.5%] flex h-[22%] items-center justify-center">
            {badge.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={badge.imageUrl} alt="" className="h-full w-auto object-contain" />
            ) : (
              <Emoji e={badge.emoji || "🏅"} className="h-full w-auto text-[clamp(40px,8vw,90px)]" />
            )}
          </div>
          <p className="text-[clamp(11px,1.7vw,16px)] text-[#6E5A46]">This is to certify that</p>
          <p className={`${hand.className} mt-[1%] text-[clamp(30px,6vw,64px)] leading-tight text-[#24452C]`}>{who || " "}</p>
          <p className="mt-[1.5%] text-[clamp(11px,1.7vw,16px)] text-[#6E5A46]">has earned the</p>
          <p className={`${serif.className} mt-[0.5%] text-[clamp(20px,3.6vw,40px)] font-semibold text-[#2E342F]`}>{badge.title} badge</p>
          {badge.description && <p className="mt-[1%] max-w-[70%] text-[clamp(10px,1.5vw,15px)] italic text-[#6E5A46]">{badge.description}</p>}

          <div className="mt-auto flex w-full items-end justify-between gap-6 pt-[3%] text-[clamp(9px,1.3vw,13px)] text-[#6E5A46]">
            <div className="w-[34%] text-center">
              <p className="min-h-[1.4em] font-semibold text-[#2E342F]">{dateText}</p>
              <p className="border-t border-[#C9A55A] pt-1">Date</p>
            </div>
            <div className="flex flex-col items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="" className="h-[clamp(24px,4vw,44px)] w-auto" onError={(e) => (e.currentTarget.style.display = "none")} />
              <p className="mt-1 font-bold text-[#24452C]">Bright Roots Home Learning</p>
            </div>
            <div className="w-[34%] text-center">
              <p className="min-h-[1.4em]">&nbsp;</p>
              <p className="border-t border-[#C9A55A] pt-1">Signed</p>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
