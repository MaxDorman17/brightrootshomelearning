import { redirect } from "next/navigation";

/** Teen Corner moved to its own menu. */
export default function OldTeenCornerPage() {
  redirect("/teens");
}
