"use client";

import { useEffect, useState } from "react";
import {
  apiFileUrl,
  getUploadedColouring,
  type UploadedColouringSheet,
  type UploadedColouringTheme,
} from "@/lib/api";
import { sheetAnswers, sheetPdf, sheetPicture, SHEETS, THEMES, type Level, type SheetKind } from "@/lib/colouring";
import { addedOn, addedWithin, isNew, isNewSince } from "@/lib/newContent";

/** A sheet as the colouring pages show it: one of the original static ones, or one uploaded on /admin/colouring. */
export type ShownSheet = {
  key: string;
  slug: string;
  title: string;
  theme: string;
  kind: SheetKind;
  level?: Level;
  pdf: string;
  picture: string;
  answers?: string;
  added: Date | null;
  isNew: boolean;
};
export type ShownTheme = { slug: string; name: string; cover: string | null };

type Uploaded = { themes: UploadedColouringTheme[]; sheets: UploadedColouringSheet[] };
const NOTHING: Uploaded = { themes: [], sheets: [] };

function loadUploaded(): Promise<Uploaded> {
  return getUploadedColouring()
    .then((res) => ({ themes: res.data.themes || [], sheets: res.data.sheets || [] }))
    .catch(() => NOTHING); // the API is down: just show the original sheets
}

const BUILT_IN: ShownSheet[] = SHEETS.map((s) => ({
  key: `${s.theme}/${s.slug}`,
  slug: s.slug,
  title: s.title,
  theme: s.theme,
  kind: s.kind ?? "colouring",
  level: s.level,
  pdf: sheetPdf(s),
  picture: sheetPicture(s),
  answers: s.kind === "word-search" ? sheetAnswers(s) : undefined,
  added: addedOn(s.slug),
  isNew: isNew(s.slug),
}));

function fromUpload(s: UploadedColouringSheet): ShownSheet {
  return {
    key: `uploaded/${s.id}`,
    slug: s.slug,
    title: s.title,
    theme: s.theme,
    kind: "colouring",
    pdf: apiFileUrl(s.pdf_url),
    picture: apiFileUrl(s.preview_url),
    added: s.created_at ? new Date(s.created_at) : null,
    isNew: isNewSince(s.created_at),
  };
}

const NEW_THIS_WEEK_DAYS = 7;

/** Every colouring theme and sheet: the original ones straight away, plus uploaded ones once they've loaded.
 * If the uploaded ones can't be fetched, the pages still show the originals. */
export function useColouring() {
  const [uploaded, setUploaded] = useState<Uploaded | null>(null);

  useEffect(() => {
    let live = true;
    loadUploaded().then((data) => live && setUploaded(data));
    return () => {
      live = false;
    };
  }, []);

  const extra = uploaded ?? NOTHING;
  // Uploaded sheets come after the originals in each theme, in the order the team set (oldest first).
  const sheets = [...BUILT_IN, ...extra.sheets.map(fromUpload)];
  const sheetsIn = (theme: string) => sheets.filter((s) => s.theme === theme);
  const coverFrom = (slug: string) => sheetsIn(slug)[0]?.picture ?? null;

  const themes: ShownTheme[] = [
    ...THEMES.map((t) => ({ slug: t.slug, name: t.name, cover: t.cover ? `/colouring/covers/${t.slug}.jpg` : coverFrom(t.slug) })),
    ...extra.themes
      .filter((t) => !THEMES.some((b) => b.slug === t.slug))
      .map((t) => ({ slug: t.slug, name: t.name, cover: t.cover_url ? apiFileUrl(t.cover_url) : coverFrom(t.slug) })),
  ];

  const newThisWeek = sheets
    .filter((s) => addedWithin(s.added, NEW_THIS_WEEK_DAYS))
    .sort((a, b) => (b.added?.getTime() ?? 0) - (a.added?.getTime() ?? 0));

  return { loaded: uploaded !== null, themes, sheets, sheetsIn, newThisWeek };
}
