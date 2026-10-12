import Link from "next/link";
import Emoji from "@/components/Emoji";
import type { SenTool } from "@/lib/sen";

/** The SEN Support tools as picture tiles. */
export default function SenToolTiles({ tools }: { tools: SenTool[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {tools.map((t) => (
        <Link key={t.slug} href={`/make/sen/${t.slug}`} className="brand-card group overflow-hidden transition-shadow hover:shadow-md">
          <div className="flex aspect-square items-center justify-center border-b border-brand-line bg-brand-cream">
            {t.art ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={t.art} alt="" className="h-3/4 w-3/4 object-contain" />
            ) : (
              <Emoji e={t.emoji} className="h-1/2 w-1/2 text-7xl" />
            )}
          </div>
          <div className="p-3">
            <h3 className="font-extrabold text-brand-charcoal group-hover:text-brand-sage">{t.name}</h3>
            <p className="mt-0.5 text-sm font-bold text-brand-earth/60">{t.blurb}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
