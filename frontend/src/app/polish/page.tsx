import { redirect } from "next/navigation";

/** The old Polish-only page. Its practice history now lives on the Languages page. */
export default function PolishPage() {
  redirect("/languages");
}
