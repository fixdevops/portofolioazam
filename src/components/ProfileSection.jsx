import { useEffect, useState } from "react";
import { supabase } from "../supabase";

export default function ProfileSection() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("profile").select("*").limit(1).maybeSingle()
      .then(({ data, error }) => {
        if (!error && data) setProfile(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col md:flex-row md:items-start space-y-4 md:space-y-0 md:space-x-6 animate-pulse">
        <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-40 md:h-40 rounded-full bg-gray-200 flex-shrink-0" />
        <div className="flex-1 space-y-3 pt-2">
          <div className="h-5 bg-gray-200 rounded w-40" />
          <div className="h-3 bg-gray-100 rounded w-56" />
          <div className="h-3 bg-gray-100 rounded w-full" />
          <div className="h-3 bg-gray-100 rounded w-5/6" />
        </div>
      </div>
    );
  }

  // Fallback ke data statis kalau tabel kosong / Supabase mati
  const name  = profile?.name || "M. Nabhan Dhiyauz Zaman";
  const role  = profile?.role || "Public Speaker || Communication Enthusiast";
  const bio   = profile?.bio  || "Saya M. Nabhan Dhiyauz Zaman, seorang mahasiswa yang memiliki minat besar dan keahlian di bidang public speaking dan komunikasi. Saya percaya bahwa penyampaian pesan yang jelas dan persuasif adalah kunci untuk menginspirasi serta membangun hubungan yang berdampak.";
  const photo = profile?.photo_url || `${import.meta.env.BASE_URL}Foto M. Nabhan Dhiyauz Zaman.jpg`;

  const socials = [
    { href: profile?.github_url,    icon: "ri-github-fill",    hover: "hover:text-black" },
    { href: profile?.linkedin_url,  icon: "ri-linkedin-fill",  hover: "hover:text-[#0077B5]" },
    { href: profile?.email ? `mailto:${profile.email}` : null, icon: "ri-mail-fill", hover: "hover:text-red-500" },
    { href: profile?.instagram_url, icon: "ri-instagram-line", hover: "hover:text-pink-500" },
    { href: profile?.tiktok_url,    icon: "ri-tiktok-fill",    hover: "hover:text-black" },
  ].filter((s) => s.href);

  return (
    <div className="flex flex-col md:flex-row md:items-start space-y-4 md:space-y-0 md:space-x-6">
      {/* Foto */}
      <div className="flex items-center space-x-4 md:block">
        <img
          src={photo}
          alt="profile pic"
          className="rounded-full duration-150 w-20 h-20 sm:w-28 sm:h-28 md:w-40 md:h-40 border-2 border-white shadow-md object-cover"
        />
        {/* Nama & Role (Mobile) */}
        <div className="md:hidden">
          <h1 className="text-xl sm:text-[18px] font-bold text-gray-800">{name}</h1>
          <p className="text-xs sm:text-sm font-mono text-gray-600">{role}</p>
        </div>
      </div>

      {/* Deskripsi Profil */}
      <div className="text-left md:flex-1">
        <div className="hidden md:block">
          <h1 className="text-[18px] font-bold text-gray-800">{name}</h1>
          <p className="text-sm font-mono text-gray-600">{role}</p>
        </div>
        {bio && (
          <p className="mt-2 text-sm sm:text-base leading-relaxed text-gray-700 text-left whitespace-pre-line">
            {bio}
          </p>
        )}

        {/* Social Links */}
        {socials.length > 0 && (
          <div className="hidden md:flex gap-4 mt-4 justify-center md:justify-start text-xl text-gray-600">
            {socials.map(({ href, icon, hover }) => (
              <a
                key={icon}
                href={href}
                target={href.startsWith("mailto") ? undefined : "_blank"}
                rel="noopener noreferrer"
                className={`transition-colors ${hover}`}
              >
                <i className={icon}></i>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
