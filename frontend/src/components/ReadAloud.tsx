"use client";

import { useEffect, useState } from "react";
import { EmojiText } from "@/components/Emoji";
import { speakText } from "@/components/games/common";

/** A "Read to me" button for children who find reading hard. Uses the device's own voice, so nothing is sent anywhere. */
export default function ReadAloud({ text, label = "🔊 Read to me", className = "" }: { text: string; label?: string; className?: string }) {
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    setSupported(typeof window !== "undefined" && !!window.speechSynthesis);
    return () => window.speechSynthesis?.cancel();
  }, []);

  if (!supported || !text.trim()) return null;
  return (
    <button
      type="button"
      onClick={() => speakText(text)}
      className={"rounded-xl border-2 border-brand-line bg-white px-4 py-2 text-sm font-extrabold text-brand-sage hover:bg-brand-cream " + className}
    >
      <EmojiText text={label} />
    </button>
  );
}
