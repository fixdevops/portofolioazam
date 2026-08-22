import { useEffect, useState } from "react";
import { supabase } from "../supabase";

export default function SkillsSection() {
  const [categories, setCategories] = useState([]);
  const [skills, setSkills]         = useState([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.from("skill_categories").select("*").order("sort_order"),
      supabase.from("skills").select("*").order("category").order("sort_order"),
    ]).then(([{ data: cats }, { data: sks }]) => {
      setCategories(cats || []);
      setSkills(sks || []);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div>
        <h2 className="text-[18px] font-bold text-gray-800 mb-3 flex items-center gap-2">
          <i className="ri-code-s-slash-line"></i> Skills &amp; Technologies
        </h2>
        <div className="flex flex-wrap gap-2 mb-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-7 w-20 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  // Kalau tidak ada data sama sekali, jangan render section ini
  if (categories.length === 0 && skills.length === 0) return null;

  return (
    <div>
      <h2 className="text-[18px] font-bold text-gray-800 mb-3 flex items-center gap-2">
        <i className="ri-code-s-slash-line"></i> Skills &amp; Technologies
      </h2>

      <div className="space-y-3">
        {categories.map((cat) => {
          const catSkills = skills.filter((s) => s.category === cat.name);
          if (catSkills.length === 0) return null;
          return (
            <div key={cat.id}>
              <p className="text-xs text-gray-400 font-mono mb-2 flex items-center gap-1">
                <i className={cat.icon}></i> {cat.name}
              </p>
              <ul className="flex flex-wrap gap-2 list-none p-0">
                {catSkills.map((skill) => (
                  <li key={skill.id}
                    className="bg-white text-gray-700 border border-gray-200 rounded-lg py-1 px-3 text-sm hover:bg-gray-50 transition-colors shadow-sm">
                    {skill.name}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
