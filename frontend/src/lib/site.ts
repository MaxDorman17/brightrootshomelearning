export const SITE_URL = "https://brightrootshomelearning.co.uk";
export const SUPPORT_EMAIL = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "hello@brightrootshomelearning.co.uk";
export const LEGAL_UPDATED = "29 September 2026";
// The privacy and cookie policies were updated again for the newer features (extra grown-ups, notes, languages...).
export const PRIVACY_UPDATED = "4 October 2026";
// The terms changed when the free trial went from 7 to 14 days.
export const TERMS_UPDATED = "3 October 2026";

// Who runs Bright Roots. UK consumer law says the terms must name the trader and give a
// postal address, so fill these in (a business or mail-forwarding address is fine).
export const TRADING_NAME = "Bright Roots Home Learning";
export const TRADER_NAME = "Max Dorman";
export const TRADER_ADDRESS = "18 Alison Street, Kirkcaldy, KY1 1UE";

// Cookie-free visitor statistics for the public pages, on our own Umami server.
// The website ID is not a secret: it is part of the public page code.
export const STATS_SCRIPT = "https://stats.brightrootshomelearning.co.uk/script.js";
export const STATS_WEBSITE_ID = "26df8761-6a46-4a06-9650-654d63125ee6";
// Only the live site is counted, never a local or staging copy.
export const STATS_HOSTS = ["brightrootshomelearning.co.uk", "www.brightrootshomelearning.co.uk"];
