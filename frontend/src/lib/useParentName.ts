"use client";

import { useEffect, useState } from "react";
import { checkSession } from "@/lib/api";

export const PARENT_NAME_FALLBACK = "your grown-up";

/** For child screens: what this child's parent is called, e.g. "Notes from Sarah". */
export function useParentName(): string {
  const [name, setName] = useState(PARENT_NAME_FALLBACK);

  useEffect(() => {
    checkSession()
      .then((res) => {
        if (res.data.parent_name) setName(res.data.parent_name);
      })
      .catch(() => {});
  }, []);

  return name;
}
