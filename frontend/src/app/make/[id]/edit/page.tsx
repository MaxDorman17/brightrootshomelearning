"use client";

import { useParams } from "next/navigation";
import MakeEditor from "@/components/make/MakeEditor";

export default function EditMakePage() {
  const params = useParams<{ id: string }>();
  return <MakeEditor id={Number(params.id)} />;
}
