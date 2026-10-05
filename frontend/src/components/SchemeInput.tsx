"use client";

import { SCHEME_OPTIONS } from "@/lib/schemes";

type Props = {
  value: string;
  onChange: (value: string) => void;
  className: string;
};

/** A text box for the scheme a lesson comes from, with the common ones offered as suggestions. */
export default function SchemeInput({ value, onChange, className }: Props) {
  return (
    <>
      <input
        list="scheme-options"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={100}
        placeholder="e.g. Twinkl, White Rose Maths"
        className={className}
      />
      <datalist id="scheme-options">
        {SCHEME_OPTIONS.map((s) => (
          <option key={s} value={s} />
        ))}
      </datalist>
    </>
  );
}
