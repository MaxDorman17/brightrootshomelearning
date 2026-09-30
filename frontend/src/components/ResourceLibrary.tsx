"use client";

import { ChangeEvent, FormEvent, useCallback, useEffect, useRef, useState } from "react";
import {
  addResourceFolder,
  addResourceLink,
  deleteResource,
  deleteResourceFolder,
  downloadResource,
  getResources,
  renameResourceFolder,
  updateResource,
  uploadResourceFile,
} from "@/lib/api";
import Emoji from "@/components/Emoji";

type Folder = { name: string; count: number; is_subject: boolean; is_custom: boolean };
type Item = {
  id: number;
  folder: string;
  title: string;
  kind: "link" | "file";
  url: string | null;
  original_name: string | null;
  content_type: string | null;
  size: number | null;
  note: string | null;
  visible_to_children: boolean;
};

const input = "rounded-xl border border-[#D9D1C4] bg-white px-3 py-2 text-sm text-brand-charcoal outline-none focus:border-brand-softsage";

/** The website a link goes to; Bright Roots' own learning aids are links within the site. */
function linkHost(url: string | null) {
  if (!url) return "";
  if (url.startsWith("/")) return "Bright Roots learning aid";
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

function icon(item: Item) {
  if (item.kind === "link") {
    if (item.url?.startsWith("/learning-aids/")) return "📐";
    const host = linkHost(item.url);
    if (host.includes("twinkl")) return "🟣";
    if (host.includes("youtube") || host.includes("youtu.be")) return "▶️";
    if (host.includes("bbc")) return "📺";
    return "🔗";
  }
  const type = item.content_type || "";
  if (type.startsWith("image/")) return "🖼️";
  if (type.includes("pdf")) return "📄";
  if (type.includes("presentation") || type.includes("powerpoint")) return "📊";
  if (type.includes("sheet") || type.includes("excel")) return "📈";
  return "📝";
}

function fileSize(bytes: number | null) {
  if (!bytes) return "";
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function errorText(err: any, fallback: string) {
  const detail = err?.response?.data?.detail;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail) && detail[0]?.msg) return String(detail[0].msg).replace(/^Value error, /, "");
  return fallback;
}

function ItemRow({
  item,
  isParent,
  folders,
  onChanged,
}: {
  item: Item;
  isParent: boolean;
  folders: Folder[];
  onChanged: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(item.title);
  const [note, setNote] = useState(item.note || "");
  const [folder, setFolder] = useState(item.folder);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const open = async () => {
    if (item.kind === "link" && item.url) {
      if (item.url.startsWith("/")) window.location.href = item.url;
      else window.open(item.url, "_blank", "noopener,noreferrer");
      return;
    }
    setBusy(true);
    try {
      const res = await downloadResource(item.id);
      const url = URL.createObjectURL(res.data as Blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = item.original_name || item.title;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    } catch {
      setError("Could not download this file.");
    } finally {
      setBusy(false);
    }
  };

  const save = async (visible = item.visible_to_children) => {
    setError("");
    try {
      await updateResource(item.id, { folder, title, note, visible_to_children: visible });
      setEditing(false);
      onChanged();
    } catch (err) {
      setError(errorText(err, "Could not save."));
    }
  };

  const remove = async () => {
    if (!confirm(`Delete "${item.title}"?`)) return;
    await deleteResource(item.id);
    onChanged();
  };

  if (editing) {
    return (
      <div className="space-y-2 py-3">
        <div className="flex flex-wrap gap-2">
          <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={255} className={input + " min-w-[12rem] flex-1"} aria-label="Title" />
          <select value={folder} onChange={(e) => setFolder(e.target.value)} className={input} aria-label="Folder">
            {folders.map((f) => (
              <option key={f.name} value={f.name}>{f.name}</option>
            ))}
          </select>
        </div>
        <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Note (optional)" className={input + " w-full"} />
        <div className="flex gap-2">
          <button onClick={() => save()} className="rounded-xl bg-brand-sage px-4 py-2 text-xs font-bold text-white">Save</button>
          <button onClick={() => setEditing(false)} className="text-xs font-bold text-[#6E5A46]">Cancel</button>
        </div>
        {error && <p className="text-xs font-semibold text-[#A64F42]">{error}</p>}
      </div>
    );
  }

  return (
    <div className="py-3">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-2xl"><Emoji e={icon(item)} /></span>
        <button onClick={open} disabled={busy} className="min-w-0 flex-1 text-left">
          <p className="truncate font-bold text-brand-charcoal hover:text-brand-sage hover:underline">{item.title}</p>
          <p className="truncate text-xs text-[#6E5A46]">
            {item.kind === "link" ? linkHost(item.url) : `${item.original_name} · ${fileSize(item.size)}`}
            {item.note ? ` · ${item.note}` : ""}
          </p>
        </button>
        {isParent && (
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => save(!item.visible_to_children)}
              className={"rounded-full px-2.5 py-1 text-[11px] font-bold " + (item.visible_to_children ? "bg-brand-tint text-brand-sage" : "bg-[#F0ECE6] text-[#6E5A46]")}
              title="Choose whether children can see this"
            >
              {item.visible_to_children ? "👀 Children can see" : "🙈 Parents only"}
            </button>
            <button onClick={() => setEditing(true)} className="text-xs font-bold text-brand-sage hover:underline">Edit</button>
            <button onClick={remove} className="text-xs font-bold text-[#A64F42] hover:underline">Delete</button>
          </div>
        )}
        {!isParent && (
          <button onClick={open} disabled={busy} className="rounded-xl bg-brand-sage px-3 py-1.5 text-xs font-bold text-white">
            {item.kind === "link" ? "Open" : busy ? "..." : "Download"}
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-xs font-semibold text-[#A64F42]">{error}</p>}
    </div>
  );
}

function AddPanel({ folder, onDone }: { folder: string; onDone: () => void }) {
  const [mode, setMode] = useState<"link" | "file">("link");
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [note, setNote] = useState("");
  const [visible, setVisible] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (mode === "link") {
        await addResourceLink({ folder, title: title.trim() || url.trim(), url: url.trim(), note, visible_to_children: visible });
      } else {
        if (!file) throw new Error("Choose a file");
        if (file.size > 20 * 1024 * 1024) throw new Error("Files must be 20 MB or smaller");
        await uploadResourceFile(folder, file, title, note, visible);
      }
      setTitle("");
      setUrl("");
      setNote("");
      setFile(null);
      if (fileRef.current) fileRef.current.value = "";
      onDone();
    } catch (err: any) {
      setError(err instanceof Error && !err.hasOwnProperty("response") ? err.message : errorText(err, "Could not add."));
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="mt-4 space-y-3 rounded-2xl bg-brand-cream p-4">
      <div className="flex gap-2">
        {(["link", "file"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={"rounded-xl border px-3 py-1.5 text-sm font-bold " + (mode === m ? "border-brand-sage bg-white text-brand-sage" : "border-transparent text-[#6E5A46]")}
          >
            {m === "link" ? "🔗 Add a link" : "📄 Upload a file"}
          </button>
        ))}
      </div>
      {mode === "link" ? (
        <input required type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://www.twinkl.co.uk/resource/..." className={input + " w-full"} />
      ) : (
        <input
          ref={fileRef}
          required
          type="file"
          accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.png,.jpg,.jpeg,.gif,.webp,.txt"
          onChange={(e: ChangeEvent<HTMLInputElement>) => setFile(e.target.files?.[0] ?? null)}
          className="block w-full text-sm text-[#6E5A46] file:mr-3 file:rounded-xl file:border-0 file:bg-brand-sage file:px-4 file:py-2 file:text-sm file:font-bold file:text-white"
        />
      )}
      <div className="flex flex-wrap gap-2">
        <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={255} placeholder={mode === "link" ? "Title, e.g. Number bonds game" : "Title (optional)"} className={input + " min-w-[12rem] flex-1"} />
        <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Note (optional)" className={input + " min-w-[12rem] flex-1"} />
      </div>
      <label className="flex items-center gap-2 text-sm text-[#6E5A46]">
        <input type="checkbox" checked={visible} onChange={(e) => setVisible(e.target.checked)} className="accent-brand-sage" />
        Children can see this
      </label>
      {error && <p className="text-xs font-semibold text-[#A64F42]">{error}</p>}
      <button type="submit" disabled={busy} className="rounded-xl bg-brand-sage px-4 py-2 text-sm font-bold text-white disabled:opacity-50">
        {busy ? "Adding..." : `Add to ${folder}`}
      </button>
    </form>
  );
}

export default function ResourceLibrary({ isParent }: { isParent: boolean }) {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [current, setCurrent] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [newFolder, setNewFolder] = useState("");
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    const res = await getResources();
    setFolders(res.data.folders);
    setItems(res.data.items);
    setLoaded(true);
  }, []);

  useEffect(() => {
    load().catch(() => setLoaded(true));
    // Opened from a lesson: /child/resources?folder=Maths
    const folder = new URLSearchParams(window.location.search).get("folder");
    if (folder) setCurrent(folder);
  }, [load]);

  const folderItems = items.filter((i) => i.folder === current);
  const currentFolder = folders.find((f) => f.name === current);

  const createFolder = async (e: FormEvent) => {
    e.preventDefault();
    if (!newFolder.trim()) return;
    const res = await addResourceFolder(newFolder.trim());
    setNewFolder("");
    await load();
    setCurrent(res.data.name);
  };

  const renameFolder = async () => {
    if (!current) return;
    const name = prompt("New folder name", current);
    if (!name || name.trim() === current) return;
    try {
      const res = await renameResourceFolder(current, name.trim());
      await load();
      setCurrent(res.data.name);
    } catch (err) {
      setMessage(errorText(err, "Could not rename."));
    }
  };

  const removeFolder = async () => {
    if (!current || !confirm(`Remove the "${current}" folder?`)) return;
    try {
      await deleteResourceFolder(current);
      setCurrent(null);
      load();
    } catch (err) {
      setMessage(errorText(err, "Could not remove."));
    }
  };

  if (!loaded) return <p className="text-sm text-[#6E5A46]">Loading resources...</p>;

  if (current === null) {
    return (
      <div className="space-y-5">
        {folders.length === 0 ? (
          <div className="brand-card p-6 text-center text-sm text-[#6E5A46]">
            {isParent ? "Add a subject to your timetable to get started." : "Nothing here yet. Your grown-up can add worksheets and links for you."}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {folders.map((f) => (
              <button
                key={f.name}
                onClick={() => {
                  setCurrent(f.name);
                  setShowAdd(false);
                  setMessage("");
                }}
                className="brand-card flex flex-col items-start p-4 text-left transition-shadow hover:shadow-md"
              >
                <span className="text-3xl">{f.count > 0 ? "📂" : "📁"}</span>
                <span className="mt-2 w-full truncate font-extrabold text-brand-charcoal">{f.name}</span>
                <span className="text-xs text-[#6E5A46]">{f.count} item{f.count === 1 ? "" : "s"}</span>
              </button>
            ))}
          </div>
        )}
        {isParent && (
          <form onSubmit={createFolder} className="flex flex-wrap gap-2">
            <input value={newFolder} onChange={(e) => setNewFolder(e.target.value)} maxLength={100} placeholder="New folder, e.g. Nature table" className={input} />
            <button type="submit" className="rounded-xl border border-brand-line bg-white px-4 py-2 text-sm font-bold text-brand-sage">+ Add folder</button>
          </form>
        )}
      </div>
    );
  }

  return (
    <div className="brand-card p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button onClick={() => setCurrent(null)} className="text-sm font-bold text-brand-sage hover:underline">← All folders</button>
          <h2 className="text-lg font-extrabold text-brand-charcoal">📂 {current}</h2>
        </div>
        {isParent && (
          <div className="flex flex-wrap items-center gap-3">
            {currentFolder?.is_custom && (
              <>
                <button onClick={renameFolder} className="text-xs font-bold text-[#6E5A46] hover:underline">Rename folder</button>
                <button onClick={removeFolder} className="text-xs font-bold text-[#A64F42] hover:underline">Remove folder</button>
              </>
            )}
            <button onClick={() => setShowAdd(!showAdd)} className="rounded-xl bg-brand-sage px-4 py-2 text-xs font-bold text-white">
              {showAdd ? "Close" : "+ Add"}
            </button>
          </div>
        )}
      </div>

      {isParent && showAdd && (
        <AddPanel
          folder={current}
          onDone={() => {
            setShowAdd(false);
            load();
          }}
        />
      )}
      {message && <p className="mt-3 text-sm font-semibold text-[#A64F42]">{message}</p>}

      {folderItems.length === 0 ? (
        <p className="mt-4 text-sm text-[#6E5A46]">
          {isParent ? "This folder is empty. Add a link or upload a worksheet." : "Nothing in this folder yet."}
        </p>
      ) : (
        <div className="mt-2 divide-y divide-brand-line">
          {folderItems.map((item) => (
            <ItemRow key={item.id} item={item} isParent={isParent} folders={folders} onChanged={load} />
          ))}
        </div>
      )}
    </div>
  );
}
