/** The illustrated gold star, used instead of the ⭐ emoji. Sized with className (defaults to the text size). */
export default function StarIcon({ className = "inline-block h-[1.15em] w-[1.15em] align-[-0.2em]" }: { className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src="/illustrations/star.png" alt="stars" className={`${className} select-none object-contain`} draggable={false} />;
}
