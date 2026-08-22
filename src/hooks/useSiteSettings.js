import { useEffect, useState } from "react";
import { supabase } from "../supabase";

export function useSiteSettings() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    supabase
      .from("site_settings")
      .select("*")
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setSettings(data);
      });
  }, []);

  return settings;
}
