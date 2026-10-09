import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabase";

export default function Footer() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    supabase.from("profile").select("name, github_url, tiktok_url, instagram_url").limit(1).maybeSingle()
      .then(({ data }) => { if (data) setProfile(data); });
  }, []);

  const name        = profile?.name         || "King Azam";
  const githubUrl   = profile?.github_url   || "#";
  const tiktokUrl   = profile?.tiktok_url   || "#";
  const instagramUrl = profile?.instagram_url || "#";

  return (
    <footer className="border-t border-t-gray-200 py-3 mt-4">
      <div className="px-4 sm:mx-auto text-gray-800 max-w-4xl flex justify-between items-center">
        <p className="text-sm">
          © {new Date().getFullYear()} {name}, All right reserved.
        </p>
        <div className="flex space-x-3 sm:space-x-4 ml-auto text-gray-800 items-center justify-center sm:justify-start">
          {githubUrl !== "#" && (
            <Link to={githubUrl} target="_blank" rel="noopener noreferrer" className="text-xl">
              <i className="ri-github-fill"></i>
            </Link>
          )}
          {tiktokUrl !== "#" && (
            <Link to={tiktokUrl} target="_blank" rel="noopener noreferrer" className="text-xl">
              <i className="ri-tiktok-fill"></i>
            </Link>
          )}
          {instagramUrl !== "#" && (
            <Link to={instagramUrl} target="_blank" rel="noopener noreferrer" className="text-xl">
              <i className="ri-instagram-line"></i>
            </Link>
          )}
        </div>
      </div>
    </footer>
  );
}
