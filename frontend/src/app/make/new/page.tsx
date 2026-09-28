"use client";

import { useEffect, useState } from "react";
import MakeEditor from "@/components/make/MakeEditor";
import { MakeKind } from "@/lib/api";

export default function NewMakePage() {
  const [kind, setKind] = useState<MakeKind | null>(null);

  useEffect(() => {
    setKind(new URLSearchParams(window.location.search).get("kind") === "craft" ? "craft" : "recipe");
  }, []);

  return kind ? <MakeEditor kind={kind} /> : null;
}
