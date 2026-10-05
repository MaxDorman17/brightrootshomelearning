"use client";

import { useEffect, useState } from "react";
import { checkSession } from "@/lib/api";
import { getRole } from "@/lib/auth";

/**
 * The Bright Roots Store (workbooks, cookbooks, stationery). While it's being set up only the site
 * owner (ADMIN_EMAILS on the backend) can see the Store button and page. Set this to true to open
 * it to every parent.
 */
export const STORE_OPEN = false;

/** null while checking, then whether this person can see the Store. */
export function useStoreVisible(): boolean | null {
  const [visible, setVisible] = useState<boolean | null>(STORE_OPEN ? true : null);
  useEffect(() => {
    if (STORE_OPEN) return;
    if (getRole() !== "parent") {
      setVisible(false);
      return;
    }
    checkSession()
      .then((res) => setVisible(!!res.data.is_admin))
      .catch(() => setVisible(false));
  }, []);
  return visible;
}
