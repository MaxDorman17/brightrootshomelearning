"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Emoji from "@/components/Emoji";
import { SenPage, useSenRole } from "@/components/SenCards";
import SenToolTiles from "@/components/SenToolTiles";
import { senToolsIn } from "@/lib/sen";
import { senSection } from "@/lib/senSections";

/** One SEN Support section, e.g. Speech & Communication: the tools that belong to it. */
export default function SenSectionPage() {
  const { section: slug } = useParams<{ section: string }>();
  const section = senSection(slug);
  const role = useSenRole();

  if (!section) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6">
          <p className="font-bold text-brand-earth/70">We couldn&apos;t find that page.</p>
          <Link href="/make/sen" className="mt-4 inline-block font-bold text-brand-sage hover:underline">
            Back to SEN Support
          </Link>
        </div>
      </div>
    );
  }

  const tools = senToolsIn(section);

  return (
    <div className="min-h-screen">
      <Navbar />
      <SenPage title={section.name} intro={`${section.blurb}.`}>
        {tools.length > 0 ? (
          <SenToolTiles tools={tools} />
        ) : (
          <div className="brand-card p-8 text-center">
            <Emoji e={section.emoji} className="mx-auto h-16 w-16 text-6xl" />
            <p className="mt-3 text-lg font-extrabold text-brand-charcoal">Coming soon</p>
            <p className="mx-auto mt-1 max-w-md text-sm font-bold text-brand-earth/60">
              {role === "child"
                ? "New things are on the way here. Have a look at the other picture cards for now."
                : "We're making new things for this section. In the meantime, the other SEN Support sections have plenty to use."}
            </p>
          </div>
        )}
      </SenPage>
    </div>
  );
}
