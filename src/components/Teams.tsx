import { useEffect, useRef, useState } from "react";
import { teamPhotos } from "../content";
import { Reveal } from "../lib/motion";
import { Icon } from "./Icon";
import { Section } from "./Layout";

type Photo = (typeof teamPhotos)[number];

const base = (p: Photo) => `/images/team/${p.file}`;
const srcSet = (p: Photo) => `${base(p)}-960.webp 960w, ${base(p)}-1600.webp ${p.width}w`;

/** Grid placement on large screens: one big photo, a tall portrait, two smaller ones. */
const layout = [
  "aspect-[3/2] sm:col-span-2",
  "aspect-[4/5] sm:aspect-auto sm:row-span-2",
  "aspect-[3/2]",
  "aspect-[16/9] sm:aspect-[3/2]",
];

function Lightbox({ index, onClose, onMove }: { index: number | null; onClose: () => void; onMove: (i: number) => void }) {
  const ref = useRef<HTMLDialogElement | null>(null);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (index !== null && !dialog.open) dialog.showModal();
    if (index === null && dialog.open) dialog.close();
  }, [index]);

  const count = teamPhotos.length;
  const photo = index === null ? null : teamPhotos[index];
  const go = (step: number) => index !== null && onMove((index + step + count) % count);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(1);
        if (e.key === "ArrowLeft") go(-1);
      }}
      aria-label={photo ? photo.caption : "Team photo"}
      className="m-auto max-h-[calc(100dvh-2rem)] w-[min(72rem,calc(100vw-2rem))] overflow-hidden rounded-[1.5rem] border border-line bg-night-950 p-0 text-ink shadow-2xl backdrop:bg-night-950/85 backdrop:backdrop-blur-sm"
      data-testid="team-lightbox"
    >
      {photo && (
        <figure>
          {/* Only the image re-animates, so keyboard focus stays on the buttons */}
          <picture key={photo.file} className="panel-in block">
            <source srcSet={`${base(photo)}-1600.webp`} type="image/webp" />
            <img
              src={`${base(photo)}-1600.jpg`}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              className="max-h-[calc(100dvh-8rem)] w-full bg-night-900 object-contain"
            />
          </picture>
          <figcaption className="flex items-center justify-between gap-3 border-t border-line px-4 py-3 sm:px-5">
            <span className="min-w-0">
              <span className="block truncate font-semibold">{photo.caption}</span>
              <span className="text-xs text-mute">
                {(index ?? 0) + 1} / {count}
              </span>
            </span>
            <span className="flex shrink-0 gap-2">
              <button type="button" onClick={() => go(-1)} className="btn btn-ghost btn-sm aspect-square !px-0" aria-label="Previous photo">
                <Icon name="arrowRight" className="size-4 rotate-180" />
              </button>
              <button type="button" onClick={() => go(1)} className="btn btn-ghost btn-sm aspect-square !px-0" aria-label="Next photo">
                <Icon name="arrowRight" className="size-4" />
              </button>
              <button type="button" onClick={onClose} className="btn btn-ghost btn-sm aspect-square !px-0" aria-label="Close photo">
                <Icon name="close" className="size-4" />
              </button>
            </span>
          </figcaption>
        </figure>
      )}
    </dialog>
  );
}

export function Teams() {
  const [open, setOpen] = useState<number | null>(null);
  const opener = useRef<HTMLButtonElement | null>(null);

  return (
    <Section
      id="teams"
      eyebrow="People"
      title="Teams I've worked with"
      lead="Quality is a team sport. A few moments with the developers, designers and product people I've shipped with."
    >
      <ul className="grid gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-3" data-testid="team-gallery">
        {teamPhotos.map((p, i) => (
          <Reveal as="li" key={p.file} delay={i * 90} className={`relative ${layout[i] ?? "aspect-[3/2]"}`}>
            <button
              type="button"
              onClick={(e) => {
                opener.current = e.currentTarget;
                setOpen(i);
              }}
              aria-haspopup="dialog"
              className="group absolute inset-0 cursor-pointer overflow-hidden rounded-[var(--radius-card)] border border-line bg-night-800 text-left shadow-xl shadow-black/30 focus-visible:outline-offset-4"
            >
              <picture>
                <source srcSet={srcSet(p)} sizes={i === 0 ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"} type="image/webp" />
                <img
                  src={`${base(p)}-1600.jpg`}
                  alt={p.alt}
                  width={p.width}
                  height={p.height}
                  loading="lazy"
                  decoding="async"
                  className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </picture>
              <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-night-950/90 via-night-950/50 to-transparent px-4 pt-12 pb-3.5">
                <span className="text-sm font-semibold text-white">{p.caption}</span>
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-white/10 text-white opacity-0 backdrop-blur transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100" aria-hidden="true">
                  <Icon name="arrowUpRight" className="size-4" />
                </span>
              </span>
            </button>
          </Reveal>
        ))}
      </ul>

      <Lightbox
        index={open}
        onMove={setOpen}
        onClose={() => {
          setOpen(null);
          opener.current?.focus();
        }}
      />
    </Section>
  );
}
