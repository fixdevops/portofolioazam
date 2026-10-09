/**
 * inject-meta.js
 * Dijalankan sebelum `vite build` — fetch site_settings & profile dari Supabase,
 * lalu inject ke index.html sebagai meta tags statis.
 * Kalau Supabase tidak bisa diakses, fallback ke nilai default.
 */

import { readFileSync, writeFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;

// ── Fallback defaults (kalau Supabase mati) ──────────────
const DEFAULTS = {
  site_title:       "M. Nabhan Dhiyauz Zaman | Public Speaker & MC Portfolio",
  site_name:        "M. Nabhan Dhiyauz Zaman",
  site_description: "Portofolio resmi M. Nabhan Dhiyauz Zaman, Public Speaker dan Master of Ceremonies (MC). Lihat pengalaman pembicara, pengacaraan acara, serta keahlian komunikasi publik.",
  site_url:         "https://portofolioazam.vercel.app/",
  og_image:         "https://portofolioazam.vercel.app/Foto M. Nabhan Dhiyauz Zaman.jpg",
};

async function main() {
  let meta = { ...DEFAULTS };

  if (SUPABASE_URL && SUPABASE_KEY) {
    try {
      const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

      const [{ data: site }, { data: profile }] = await Promise.all([
        supabase.from("site_settings").select("*").limit(1).maybeSingle(),
        supabase.from("profile").select("photo_url, name, role").limit(1).maybeSingle(),
      ]);

      if (site) {
        meta.site_title       = site.site_title       || meta.site_title;
        meta.site_name        = site.site_name        || meta.site_name;
        meta.site_description = site.site_description || meta.site_description;
        meta.site_url         = site.site_url         || meta.site_url;

        // Tentukan og_image: utamakan dari site_settings, fallback ke foto profil
        if (site.og_image) {
          meta.og_image = site.og_image.startsWith("http")
            ? site.og_image
            : `${meta.site_url}${site.og_image}`;
        } else if (profile?.photo_url) {
          meta.og_image = profile.photo_url;
        }
      }

      console.log("✅ inject-meta: data fetched from Supabase");
      console.log("   title:", meta.site_title);
      console.log("   og_image:", meta.og_image);
    } catch (err) {
      console.warn("⚠️  inject-meta: Supabase fetch failed, using defaults.", err.message);
    }
  } else {
    console.warn("⚠️  inject-meta: VITE_SUPABASE_URL / KEY not set, using defaults.");
  }

  // ── Baca index.html ──────────────────────────────────
  const html = readFileSync("index.html", "utf-8");

  const escaped = {
    title:       escapeHtml(meta.site_title),
    description: escapeHtml(meta.site_description),
    url:         escapeHtml(meta.site_url),
    image:       escapeHtml(meta.og_image),
    name:        escapeHtml(meta.site_name),
  };

  // ── Inject / replace semua meta tags ────────────────
  let updated = html

    // <title>
    .replace(/<title>[^<]*<\/title>/, `<title>${escaped.title}</title>`)

    // description
    .replace(
      /(<meta\s+name="description"\s+content=")[^"]*(")/,
      `$1${escaped.description}$2`
    )

    // author
    .replace(
      /(<meta\s+name="author"\s+content=")[^"]*(")/,
      `$1${escaped.name}$2`
    )

    // og:title
    .replace(
      /(<meta\s+property="og:title"\s+content=")[^"]*(")/,
      `$1${escaped.title}$2`
    )

    // og:description
    .replace(
      /(<meta\s+property="og:description"\s+content=")[^"]*(")/,
      `$1${escaped.description}$2`
    )

    // og:url
    .replace(
      /(<meta\s+property="og:url"\s+content=")[^"]*(")/,
      `$1${escaped.url}$2`
    )

    // og:image
    .replace(
      /(<meta\s+property="og:image"\s+content=")[^"]*(")/,
      `$1${escaped.image}$2`
    )

    // twitter:title
    .replace(
      /(<meta\s+name="twitter:title"\s+content=")[^"]*(")/,
      `$1${escaped.title}$2`
    )

    // twitter:description
    .replace(
      /(<meta\s+name="twitter:description"\s+content=")[^"]*(")/,
      `$1${escaped.description}$2`
    )

    // twitter:image
    .replace(
      /(<meta\s+name="twitter:image"\s+content=")[^"]*(")/,
      `$1${escaped.image}$2`
    );

  writeFileSync("index.html", updated, "utf-8");
  console.log("✅ inject-meta: index.html updated successfully");
}

function escapeHtml(str = "") {
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

main();
