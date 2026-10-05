"use client";

import { useEffect, useState } from "react";
import MakeEditor from "@/components/make/MakeEditor";
import { MakeKind } from "@/lib/api";

export default function NewMakePage() {
  const [kind, setKind] = useState<MakeKind | null>(null);
  const [teen, setTeen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const k = params.get("kind");
    setTeen(params.get("teen") === "1");
    setKind(k === "craft" || k === "pe" || k === "outdoor" || k === "life" || k === "little" ? k : "recipe");
  }, []);

  return kind ? <MakeEditor kind={kind} teen={teen} /> : null;
}
