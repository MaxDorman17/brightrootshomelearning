"use client";

import { useEffect, useState } from "react";
import { sendTestPush } from "@/lib/api";
import {
  getInstallPrompt,
  isInstalled,
  isIos,
  notificationsOn,
  onInstallPromptChange,
  promptInstall,
  pushSupported,
  turnOffNotifications,
  turnOnNotifications,
} from "@/lib/pwa";

const HIDE_KEY = "app_card_hidden";

/**
 * "Get the app" card: install Bright Roots to the home screen and turn on phone notifications.
 * `dismissible` lets it be hidden on the home page; the Account page always shows it.
 */
export default function AppCard({ role, dismissible = false }: { role: "parent" | "child"; dismissible?: boolean }) {
  const [ready, setReady] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [canPrompt, setCanPrompt] = useState(false);
  const [ios, setIos] = useState(false);
  const [supported, setSupported] = useState(false);
  const [on, setOn] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (dismissible) {
      try {
        setHidden(localStorage.getItem(HIDE_KEY) === "1");
      } catch {}
    }
    setInstalled(isInstalled());
    setIos(isIos());
    setSupported(pushSupported());
    setCanPrompt(!!getInstallPrompt());
    notificationsOn().then(setOn);
    setReady(true);
    return onInstallPromptChange(() => {
      setCanPrompt(!!getInstallPrompt());
      setInstalled(isInstalled());
    });
  }, [dismissible]);

  if (!ready || hidden) return null;
  // On the home page, once everything is set up there's nothing left to do.
  if (dismissible && installed && on) return null;

  const install = async () => {
    const accepted = await promptInstall();
    if (accepted) setInstalled(true);
  };

  const toggle = async () => {
    setBusy(true);
    setMessage("");
    try {
      if (on) {
        await turnOffNotifications();
        setOn(false);
        setMessage("Notifications are off on this device.");
      } else {
        const result = await turnOnNotifications();
        if (result === "on") {
          setOn(true);
          const tested = await sendTestPush().then(() => true).catch(() => false);
          setMessage(tested ? "Done! You should see a test notification now." : "Notifications are on for this device.");
        } else if (result === "denied") {
          setMessage("Notifications are blocked. You can allow them in your phone or browser settings.");
        } else {
          setMessage("This browser can't show notifications.");
        }
      }
    } catch {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const what =
    role === "child"
      ? "Get a nudge when it's time for spellings or other reminders."
      : "Get your daily summary and a ping when a child asks for a reward.";
  // iPhones only allow notifications once Bright Roots is on the home screen.
  const needsInstallForPush = ios && !installed;

  return (
    <div className="brand-card relative overflow-hidden p-5">
      {dismissible && (
        <button
          onClick={() => {
            setHidden(true);
            try {
              localStorage.setItem(HIDE_KEY, "1");
            } catch {}
          }}
          className="absolute right-3 top-3 rounded-lg px-2 py-1 text-xs font-bold text-brand-earth/60 hover:bg-brand-cream"
        >
          Hide
        </button>
      )}
      <div className="flex items-start gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/icons/icon-192.png" alt="" className="h-14 w-14 shrink-0 rounded-2xl border border-brand-line" />
        <div className="min-w-0 flex-1 pr-10">
          <h2 className="text-lg font-extrabold text-brand-charcoal">
            {installed ? "Bright Roots app" : "Get the Bright Roots app"}
          </h2>
          <p className="mt-1 text-sm text-brand-earth/70">
            {installed
              ? "You're using the app. Turn on notifications so nothing slips."
              : "Add Bright Roots to your home screen. It opens full screen, just like an app."}
          </p>
        </div>
      </div>

      {!installed && (
        <div className="mt-4">
          {canPrompt ? (
            <button onClick={install} className="rounded-xl bg-brand-sage px-5 py-2.5 text-sm font-extrabold text-white">
              Install the app
            </button>
          ) : ios ? (
            <ol className="space-y-1.5 rounded-xl bg-brand-cream p-4 text-sm text-brand-charcoal">
              <li>
                1. Open this page in <b>Safari</b>.
              </li>
              <li>
                2. Tap the <b>Share</b> button (the square with an arrow).
              </li>
              <li>
                3. Choose <b>Add to Home Screen</b>, then <b>Add</b>.
              </li>
            </ol>
          ) : (
            <p className="rounded-xl bg-brand-cream p-4 text-sm text-brand-charcoal">
              On Android, open the browser menu (⋮) and choose <b>Install app</b> or <b>Add to Home screen</b>. On a
              computer, look for the install icon at the end of the address bar.
            </p>
          )}
        </div>
      )}

      <div className="mt-4 border-t border-brand-line pt-4">
        <p className="text-sm font-extrabold text-brand-charcoal">Notifications</p>
        <p className="mt-0.5 text-sm text-brand-earth/70">{what}</p>
        {needsInstallForPush ? (
          <p className="mt-2 text-sm font-semibold text-brand-earth">
            On iPhone and iPad, add Bright Roots to your home screen first, then open it from there to turn these on.
          </p>
        ) : supported && !on && typeof Notification !== "undefined" && Notification.permission === "denied" ? (
          <p className="mt-2 text-sm font-semibold text-brand-earth">
            Notifications are blocked for Bright Roots. You can allow them in your phone or browser settings.
          </p>
        ) : supported ? (
          <button
            onClick={toggle}
            disabled={busy}
            className={
              "mt-3 rounded-xl px-5 py-2.5 text-sm font-extrabold disabled:opacity-60 " +
              (on ? "border-2 border-brand-line bg-white text-brand-earth" : "bg-brand-sage text-white")
            }
          >
            {busy ? "One moment..." : on ? "Turn off on this device" : "Turn on notifications"}
          </button>
        ) : (
          <p className="mt-2 text-sm text-brand-earth/70">This browser can&apos;t show notifications.</p>
        )}
        {message && <p className="mt-2 text-sm font-semibold text-brand-sage">{message}</p>}
      </div>
    </div>
  );
}
