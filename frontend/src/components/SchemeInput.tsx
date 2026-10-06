"use client";

import { useEffect, useState } from "react";
import { checkSession } from "@/lib/api";
import { SCHEME_OPTIONS } from "@/lib/schemes";

type Props = {
  value: string;
  onChange: (value: string) => void;
  className: string;
};

/** A text box for the scheme a lesson comes from. The family's own schemes are suggested first, then the common ones. */
export default function SchemeInput({ value, onChange, className }: Props) {
  const [mine, setMine] = useState<string[]>([]);

  useEffect(() => {
    checkSession()
      .then((res) => {
        if (Array.isArray(res.data.family_schemes)) setMine(res.data.family_schemes);
      })
      .catch(() => {});
  }, []);

  const options = [...mine, ...SCHEME_OPTIONS.filter((s) => !mine.includes(s))];

  return (
    <>
      <input
        list="scheme-options"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={100}
        placeholder={mine.length > 0 ? `e.g. ${mine.slice(0, 2).join(", ")}` : "e.g. Twinkl, White Rose Maths"}
        className={className}
      />
      <datalist id="scheme-options">
        {options.map((s) => (
          <option key={s} value={s} />
        ))}
      </datalist>
    </>
  );
}
