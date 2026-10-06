"use client";

import { useEffect } from "react";

/**
 * Makes every pop-up and every form on the site work with a keyboard and a screen reader, in one place.
 *
 * A pop-up here is any full-screen overlay (`fixed inset-0`). When one opens it is announced as a
 * dialog and named after its heading, the keyboard moves into it and stays inside it, Escape closes
 * it, and when it closes the keyboard goes back to where it was. Pop-ups that already do some of
 * this themselves are left to it.
 *
 * A form label that isn't tied to its box is tied to the box that follows it, so a screen reader
 * says "Lesson title" rather than just "edit text", and tapping the label puts you in the box.
 */

const OVERLAY = "div.fixed.inset-0:not(.pointer-events-none)";
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
const CLOSE_WORDS = /^(×|✕|✖|close|cancel|not now|no thanks)$/i;

const CONTROL = 'input:not([type="hidden"]), select, textarea';

let named = 0;

/** Tie each loose label to the box that comes straight after it. */
function tieLabels() {
  for (const label of Array.from(document.querySelectorAll<HTMLLabelElement>("label:not([for])"))) {
    if (label.dataset.tied || label.querySelector(CONTROL)) continue;
    label.dataset.tied = "1";
    // The box is the next thing after the label, or inside the next thing.
    let next = label.nextElementSibling as HTMLElement | null;
    while (next && next.tagName === "P") next = next.nextElementSibling as HTMLElement | null; // a line of help text
    if (!next) continue;
    // Only when it is plainly that label's one box: a label above a group of tick boxes is a heading, not a label.
    const inside = next.matches(CONTROL) ? [next] : Array.from(next.querySelectorAll<HTMLElement>(CONTROL));
    const control = inside.length === 1 ? inside[0] : null;
    if (!control || ["checkbox", "radio", "file"].includes(control.getAttribute("type") || "")) continue;
    if (control.getAttribute("aria-label") || control.getAttribute("aria-labelledby")) continue;
    if (control.id && document.querySelector(`label[for="${CSS.escape(control.id)}"]`)) continue;
    if (!control.id) control.id = `field-${++named}`;
    label.htmlFor = control.id;
  }
}

function overlays(): HTMLElement[] {
  return Array.from(document.querySelectorAll<HTMLElement>(OVERLAY));
}

function focusables(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) => el.offsetParent !== null || el === document.activeElement
  );
}

/** The button that closes a pop-up without doing anything else: "Cancel", "Close", or a cross that isn't for something else. */
function closeButton(root: HTMLElement): HTMLElement | null {
  const buttons = Array.from(root.querySelectorAll<HTMLElement>("button, a[role='button']"));
  const closes = (b: HTMLElement) => {
    const label = b.getAttribute("aria-label");
    // A named button says what it does: a cross labelled "Remove step" is not a way out.
    if (label) return /^(close|cancel)/i.test(label.trim()) && !/all|account|subscription|membership/i.test(label);
    return CLOSE_WORDS.test((b.textContent || "").trim());
  };
  return buttons.find((b) => closes(b) && /cancel|close/i.test(b.getAttribute("aria-label") || b.textContent || "")) || buttons.find(closes) || null;
}

export default function AccessHelper() {
  useEffect(() => {
    // Where the keyboard was before each pop-up opened, so it can go back there.
    const cameFrom = new Map<HTMLElement, HTMLElement | null>();

    const welcome = (overlay: HTMLElement) => {
      cameFrom.set(overlay, document.activeElement instanceof HTMLElement ? document.activeElement : null);
      if (!overlay.hasAttribute("role")) overlay.setAttribute("role", "dialog");
      if (!overlay.hasAttribute("aria-modal")) overlay.setAttribute("aria-modal", "true");
      if (!overlay.hasAttribute("aria-label") && !overlay.hasAttribute("aria-labelledby")) {
        const heading = overlay.querySelector<HTMLElement>("h1, h2, h3, h4");
        if (heading) {
          if (!heading.id) heading.id = `pop-up-title-${++named}`;
          overlay.setAttribute("aria-labelledby", heading.id);
        }
      }
      // Move the keyboard into the pop-up, unless the pop-up has already put it somewhere inside.
      // The pop-up itself takes the focus rather than a text box, so phones don't open their keyboard.
      window.setTimeout(() => {
        if (!overlay.isConnected || overlay.contains(document.activeElement)) return;
        if (!overlay.hasAttribute("tabindex")) overlay.setAttribute("tabindex", "-1");
        overlay.style.outline = "none";
        overlay.focus({ preventScroll: true });
      }, 0);
    };

    const sweep = () => {
      tieLabels();
      const open = overlays();
      for (const overlay of open) if (!cameFrom.has(overlay)) welcome(overlay);
      for (const [overlay, from] of Array.from(cameFrom.entries())) {
        if (overlay.isConnected) continue;
        cameFrom.delete(overlay);
        // Back to where the keyboard was, if nothing else has taken it since.
        const lost = !document.activeElement || document.activeElement === document.body;
        if (from && from.isConnected && lost && open.length === 0) from.focus({ preventScroll: true });
      }
    };

    const onKey = (event: KeyboardEvent) => {
      const open = overlays();
      const top = open[open.length - 1];
      if (!top) return;

      if (event.key === "Escape") {
        // Give the page a moment to close its own pop-up first; only step in if it is still there.
        window.setTimeout(() => {
          if (!top.isConnected) return;
          const button = closeButton(top);
          if (button) button.click();
          else top.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
        }, 0);
        return;
      }

      if (event.key === "Tab") {
        const items = focusables(top);
        if (items.length === 0) {
          event.preventDefault();
          return;
        }
        const first = items[0];
        const last = items[items.length - 1];
        const at = document.activeElement;
        if (!top.contains(at) || at === top) {
          event.preventDefault();
          (event.shiftKey ? last : first).focus();
        } else if (event.shiftKey && at === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && at === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    const watcher = new MutationObserver(sweep);
    watcher.observe(document.body, { childList: true, subtree: true });
    document.addEventListener("keydown", onKey);
    sweep();
    return () => {
      watcher.disconnect();
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return null;
}
