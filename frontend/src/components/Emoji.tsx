import { illustrationFor, splitIllustrated } from "@/lib/illustrations";

const INLINE = "inline-block h-[1.2em] w-[1.2em] align-[-0.25em] object-contain select-none";

/**
 * Shows an emoji, or its Bright Roots illustration when there is one. Sized to the surrounding text,
 * so `text-4xl` on a parent makes it big; pass className to size it directly.
 */
export default function Emoji({ e, className }: { e: string | null | undefined; className?: string }) {
  if (!e) return null;
  const src = illustrationFor(e);
  if (!src) return <span className={className ? `${className} inline-flex items-center justify-center leading-none` : undefined}>{e}</span>;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={e} className={className ? `${className} object-contain select-none` : INLINE} draggable={false} />;
}

/** Text that may contain emojis: any with an illustration are swapped for it. */
export function EmojiText({ text }: { text: string }) {
  return (
    <>
      {splitIllustrated(text).map((part, i) =>
        typeof part === "string" ? (
          part
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={i} src={part.src} alt={part.emoji} className={INLINE} draggable={false} />
        )
      )}
    </>
  );
}
