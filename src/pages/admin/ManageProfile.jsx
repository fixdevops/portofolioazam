import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../../supabase";
import Layout from "../../components/Layout";
import { uploadAsset, deleteAsset, pathFromPublicUrl } from "../../lib/supabaseStorage";
import {
  Save, Plus, Trash2, User, Link2, Code2,
  GripVertical, Loader2, Globe, Github,
  Tag, X, ImagePlus,
} from "lucide-react";

const TABS = ["Profil", "Skills", "Site Settings"];
const inputCls = "w-full border border-zinc-200 rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-300";

function Field({ label, hint, children }) {
  return (
    <div>
      <label className="block text-xs font-medium text-zinc-600 mb-1">{label}</label>
      {children}
      {hint && <p className="text-[10px] text-zinc-400 mt-1">{hint}</p>}
    </div>
  );
}

function SaveBtn({ saving, msg }) {
  return (
    <div className="flex items-center gap-3 pt-1">
      <button type="submit" disabled={saving}
        className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white text-sm rounded-xl hover:bg-zinc-700 disabled:opacity-50 transition-colors">
        {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
        Simpan
      </button>
      {msg && (
        <span className={`text-xs ${msg.startsWith("Gagal") ? "text-red-500" : "text-green-600"}`}>
          {msg}
        </span>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
export default function ManageProfile() {
  const [activeTab, setActiveTab] = useState("Profil");

  // ── profile ───────────────────────────────────────────────
  const [profile, setProfile]             = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [saving, setSaving]               = useState(false);
  const [saveMsg, setSaveMsg]             = useState("");
  const [photoFile, setPhotoFile]         = useState(null);
  const [photoPreview, setPhotoPreview]   = useState(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  // ── skills & categories ───────────────────────────────────
  const [skills, setSkills]               = useState([]);
  const [categories, setCategories]       = useState([]); // [{id, name, icon}]
  const [skillsLoading, setSkillsLoading] = useState(true);
  const [newSkillName, setNewSkillName]   = useState("");
  const [newSkillCat, setNewSkillCat]     = useState("");  // nama kategori
  const [addingSkill, setAddingSkill]     = useState(false);
  const [deletingSkillId, setDeletingSkillId] = useState(null);
  // new category
  const [newCatName, setNewCatName]       = useState("");
  const [newCatIcon, setNewCatIcon]       = useState("ri-code-s-slash-line");
  const [addingCat, setAddingCat]         = useState(false);
  const [deletingCatName, setDeletingCatName] = useState(null);

  // ── site settings ─────────────────────────────────────────
  const [siteSettings, setSiteSettings]   = useState(null);
  const [siteLoading, setSiteLoading]     = useState(true);
  const [savingSite, setSavingSite]       = useState(false);
  const [saveSiteMsg, setSaveSiteMsg]     = useState("");
  const [ogFile, setOgFile]               = useState(null);
  const [ogPreview, setOgPreview]         = useState(null);
  const [uploadingOg, setUploadingOg]     = useState(false);
  const ogInputRef                        = useRef(null);

  // ── fetch profile ─────────────────────────────────────────
  useEffect(() => {
    supabase.from("profile").select("*").limit(1).maybeSingle()
      .then(({ data }) => { setProfile(data || {}); setProfileLoading(false); });
  }, []);

  // ── fetch skills + categories ─────────────────────────────
  const fetchSkillsAndCats = async () => {
    const [{ data: cats }, { data: sks }] = await Promise.all([
      supabase.from("skill_categories").select("*").order("sort_order"),
      supabase.from("skills").select("*").order("category").order("sort_order"),
    ]);
    setCategories(cats || []);
    setSkills(sks || []);
    if (!newSkillCat && cats?.length) setNewSkillCat(cats[0].name);
    setSkillsLoading(false);
  };
  useEffect(() => { fetchSkillsAndCats(); }, []); // eslint-disable-line

  // ── fetch site settings ───────────────────────────────────
  useEffect(() => {
    supabase.from("site_settings").select("*").limit(1).maybeSingle()
      .then(({ data }) => { setSiteSettings(data || {}); setSiteLoading(false); });
  }, []);

  // ── save profile ──────────────────────────────────────────
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true); setSaveMsg("");
    try {
      let photo_url = profile.photo_url;
      if (photoFile) {
        setUploadingPhoto(true);
        const oldPath = pathFromPublicUrl(profile.photo_url || "");
        if (oldPath) await deleteAsset(oldPath);
        const { publicUrl } = await uploadAsset(photoFile, "profile");
        photo_url = publicUrl;
        setUploadingPhoto(false);
        setPhotoFile(null); setPhotoPreview(null);
      }

      // Hanya kirim kolom yang ada di tabel
      const payload = {
        name:             profile.name,
        role:             profile.role,
        bio:              profile.bio,
        photo_url,
        github_url:       profile.github_url,
        linkedin_url:     profile.linkedin_url,
        email:            profile.email,
        instagram_url:    profile.instagram_url,
        tiktok_url:       profile.tiktok_url,
        github_username:  profile.github_username,
        updated_at:       new Date().toISOString(),
      };

      if (profile.id) {
        const { error } = await supabase.from("profile").update(payload).eq("id", profile.id);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from("profile").insert([payload]).select().single();
        if (error) throw error;
        setProfile(data);
      }
      setProfile((p) => ({ ...p, photo_url }));
      setSaveMsg("✓ Tersimpan!");
      setTimeout(() => setSaveMsg(""), 2500);
    } catch (err) {
      setSaveMsg("Gagal: " + err.message);
      console.error("Save profile error:", err);
    } finally { setSaving(false); }
  };

  // ── save site settings ────────────────────────────────────
  const handleSaveSite = async (e) => {
    e.preventDefault();
    setSavingSite(true); setSaveSiteMsg("");
    try {
      let og_image = siteSettings.og_image;
      if (ogFile) {
        setUploadingOg(true);
        const oldPath = pathFromPublicUrl(siteSettings.og_image || "");
        if (oldPath) await deleteAsset(oldPath);
        const { publicUrl } = await uploadAsset(ogFile, "og-images");
        og_image = publicUrl;
        setUploadingOg(false);
        setOgFile(null); setOgPreview(null);
      }

      // Hanya kirim kolom yang ada di tabel
      const payload = {
        site_title:       siteSettings.site_title,
        site_name:        siteSettings.site_name,
        site_description: siteSettings.site_description,
        site_url:         siteSettings.site_url,
        og_image,
        updated_at:       new Date().toISOString(),
      };

      if (siteSettings.id) {
        const { error } = await supabase.from("site_settings").update(payload).eq("id", siteSettings.id);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from("site_settings").insert([payload]).select().single();
        if (error) throw error;
        setSiteSettings(data);
      }
      setSiteSettings((p) => ({ ...p, og_image }));
      setSaveSiteMsg("✓ Tersimpan!");
      setTimeout(() => setSaveSiteMsg(""), 2500);
    } catch (err) {
      setSaveSiteMsg("Gagal: " + err.message);
      console.error("Save site settings error:", err);
    } finally { setSavingSite(false); }
  };

  // ── add category ──────────────────────────────────────────
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    setAddingCat(true);
    const maxOrder = categories.reduce((m, c) => Math.max(m, c.sort_order || 0), 0);
    await supabase.from("skill_categories").insert([{
      name: newCatName.trim(),
      icon: newCatIcon.trim() || "ri-code-s-slash-line",
      sort_order: maxOrder + 1,
    }]);
    setNewCatName(""); setNewCatIcon("ri-code-s-slash-line");
    await fetchSkillsAndCats();
    setAddingCat(false);
  };

  // ── delete category ───────────────────────────────────────
  const handleDeleteCategory = async (name) => {
    setDeletingCatName(name);
    // hapus semua skill di kategori ini dulu
    await supabase.from("skills").delete().eq("category", name);
    await supabase.from("skill_categories").delete().eq("name", name);
    await fetchSkillsAndCats();
    setDeletingCatName(null);
  };

  // ── add skill ─────────────────────────────────────────────
  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!newSkillName.trim() || !newSkillCat) return;
    setAddingSkill(true);
    const maxOrder = skills
      .filter((s) => s.category === newSkillCat)
      .reduce((m, s) => Math.max(m, s.sort_order || 0), 0);
    await supabase.from("skills").insert([{
      name: newSkillName.trim(),
      category: newSkillCat,
      sort_order: maxOrder + 1,
    }]);
    setNewSkillName("");
    await fetchSkillsAndCats();
    setAddingSkill(false);
  };

  // ── delete skill ──────────────────────────────────────────
  const handleDeleteSkill = async (id) => {
    setDeletingSkillId(id);
    await supabase.from("skills").delete().eq("id", id);
    setSkills((prev) => prev.filter((s) => s.id !== id));
    setDeletingSkillId(null);
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">

        {/* Tabs */}
        <div className="flex gap-1 bg-zinc-100 rounded-xl p-1 mb-6">
          {TABS.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all ${
                activeTab === tab ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"
              }`}>
              {tab}
            </button>
          ))}
        </div>

        {/* ── TAB: PROFIL ─────────────────────────────────── */}
        {activeTab === "Profil" && (
          <div className="bg-white border border-zinc-100 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <User size={16} className="text-zinc-400" />
              <h2 className="text-sm font-semibold text-zinc-800">Profil</h2>
            </div>

            {profileLoading ? (
              <div className="flex justify-center py-10"><Loader2 size={20} className="animate-spin text-zinc-300" /></div>
            ) : (
              <form onSubmit={handleSaveProfile} className="space-y-4">
                {/* Foto */}
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img src={photoPreview || profile?.photo_url || "/fotoprofile fixz.png"}
                      alt="foto" className="w-20 h-20 rounded-full object-cover border-2 border-zinc-100" />
                    {uploadingPhoto && (
                      <div className="absolute inset-0 bg-white/70 rounded-full flex items-center justify-center">
                        <Loader2 size={16} className="animate-spin text-zinc-500" />
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="cursor-pointer text-xs px-3 py-1.5 rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-50 transition-colors">
                      Ganti Foto
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                        const f = e.target.files?.[0]; if (!f) return;
                        setPhotoFile(f); setPhotoPreview(URL.createObjectURL(f));
                      }} />
                    </label>
                    <p className="text-[10px] text-zinc-400 mt-1">JPG, PNG, WebP — maks 10MB</p>
                  </div>
                </div>

                <Field label="Nama">
                  <input type="text" value={profile?.name || ""} required
                    onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                    className={inputCls} />
                </Field>

                <Field label="Role / Tagline">
                  <input type="text" value={profile?.role || ""}
                    onChange={(e) => setProfile((p) => ({ ...p, role: e.target.value }))}
                    className={inputCls} />
                </Field>

                <Field label="Bio">
                  <textarea value={profile?.bio || ""} rows={5}
                    onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))}
                    className={`${inputCls} resize-none`} />
                </Field>

                <Field label="GitHub Username"
                  hint="Dipakai untuk GitHub Activity calendar di homepage">
                  <div className="relative">
                    <Github size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input type="text" value={profile?.github_username || ""}
                      onChange={(e) => setProfile((p) => ({ ...p, github_username: e.target.value }))}
                      placeholder="contoh: fixdevops"
                      className={`${inputCls} pl-8`} />
                  </div>
                </Field>

                {/* Social Links */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Link2 size={13} className="text-zinc-400" />
                    <span className="text-xs font-medium text-zinc-600">Social Links</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { key: "github_url",    label: "GitHub URL",    type: "url",   placeholder: "https://github.com/..." },
                      { key: "linkedin_url",  label: "LinkedIn URL",  type: "url",   placeholder: "https://linkedin.com/in/..." },
                      { key: "email",         label: "Email",         type: "email", placeholder: "email@example.com" },
                      { key: "instagram_url", label: "Instagram URL", type: "url",   placeholder: "https://instagram.com/..." },
                      { key: "tiktok_url",    label: "TikTok URL",    type: "url",   placeholder: "https://tiktok.com/@..." },
                    ].map(({ key, label, type, placeholder }) => (
                      <div key={key}>
                        <label className="block text-[11px] text-zinc-500 mb-1">{label}</label>
                        <input type={type} value={profile?.[key] || ""}
                          onChange={(e) => setProfile((p) => ({ ...p, [key]: e.target.value }))}
                          placeholder={placeholder}
                          className="w-full border border-zinc-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-zinc-300" />
                      </div>
                    ))}
                  </div>
                </div>

                <SaveBtn saving={saving} msg={saveMsg} />
              </form>
            )}
          </div>
        )}

        {/* ── TAB: SKILLS ─────────────────────────────────── */}
        {activeTab === "Skills" && (
          <div className="space-y-4">

            {/* Manage Categories */}
            <div className="bg-white border border-zinc-100 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Tag size={15} className="text-zinc-400" />
                <h2 className="text-sm font-semibold text-zinc-800">Kategori Skill</h2>
                <span className="text-[10px] text-zinc-400 ml-1">— buat kategori sesuai kebutuhan</span>
              </div>

              {/* Add category form */}
              <form onSubmit={handleAddCategory} className="flex gap-2 mb-4">
                <div className="flex-1">
                  <input type="text" value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    placeholder="Nama kategori, mis: Mobile, Data Science..."
                    className={inputCls} required />
                </div>
                <div className="w-44">
                  <input type="text" value={newCatIcon}
                    onChange={(e) => setNewCatIcon(e.target.value)}
                    placeholder="Icon remixicon"
                    className={inputCls} />
                </div>
                <button type="submit" disabled={addingCat || !newCatName.trim()}
                  className="flex items-center gap-1.5 px-3 py-2 bg-zinc-900 text-white text-sm rounded-xl hover:bg-zinc-700 disabled:opacity-40 flex-shrink-0">
                  {addingCat ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                </button>
              </form>
              <p className="text-[10px] text-zinc-400 mb-3">
                Icon: pakai class RemixIcon, mis: <code className="bg-zinc-100 px-1 rounded">ri-global-line</code>, <code className="bg-zinc-100 px-1 rounded">ri-smartphone-line</code>, <code className="bg-zinc-100 px-1 rounded">ri-database-2-line</code>
              </p>

              {/* Category list */}
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <div key={cat.id}
                    className="flex items-center gap-2 bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-1.5 group">
                    <i className={`${cat.icon} text-zinc-400 text-sm`}></i>
                    <span className="text-xs text-zinc-700 font-medium">{cat.name}</span>
                    <span className="text-[10px] text-zinc-300">
                      ({skills.filter((s) => s.category === cat.name).length})
                    </span>
                    <button
                      onClick={() => handleDeleteCategory(cat.name)}
                      disabled={deletingCatName === cat.name}
                      className="text-zinc-200 hover:text-red-400 transition-colors ml-0.5"
                      title="Hapus kategori beserta semua skill-nya">
                      {deletingCatName === cat.name
                        ? <Loader2 size={11} className="animate-spin" />
                        : <X size={11} />}
                    </button>
                  </div>
                ))}
                {categories.length === 0 && (
                  <p className="text-xs text-zinc-300 italic">Belum ada kategori</p>
                )}
              </div>
            </div>

            {/* Add Skill */}
            <div className="bg-white border border-zinc-100 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Code2 size={15} className="text-zinc-400" />
                <h2 className="text-sm font-semibold text-zinc-800">Tambah Skill</h2>
              </div>

              <form onSubmit={handleAddSkill} className="flex gap-2 mb-5">
                <input type="text" value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  placeholder="Nama skill, mis: Flutter, Python, Docker..."
                  className={`flex-1 ${inputCls}`} required />
                <select value={newSkillCat}
                  onChange={(e) => setNewSkillCat(e.target.value)}
                  className="border border-zinc-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-300 bg-white min-w-[140px]">
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
                <button type="submit" disabled={addingSkill || !newSkillName.trim() || !newSkillCat}
                  className="flex items-center gap-1.5 px-3 py-2 bg-zinc-900 text-white text-sm rounded-xl hover:bg-zinc-700 disabled:opacity-40 flex-shrink-0">
                  {addingSkill ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                  Tambah
                </button>
              </form>

              {/* Skills grouped by category */}
              {skillsLoading ? (
                <div className="flex justify-center py-8"><Loader2 size={20} className="animate-spin text-zinc-300" /></div>
              ) : (
                <div className="space-y-5">
                  {categories.map((cat) => {
                    const catSkills = skills.filter((s) => s.category === cat.name);
                    return (
                      <div key={cat.id}>
                        <div className="flex items-center gap-1.5 mb-2">
                          <i className={`${cat.icon} text-zinc-400 text-sm`}></i>
                          <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">{cat.name}</span>
                          <span className="text-[10px] text-zinc-300">({catSkills.length})</span>
                        </div>
                        {catSkills.length === 0 ? (
                          <p className="text-xs text-zinc-300 italic pl-1">Belum ada skill — tambah di atas</p>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {catSkills.map((skill) => (
                              <div key={skill.id}
                                className="flex items-center gap-1.5 bg-zinc-50 border border-zinc-200 rounded-lg px-2.5 py-1">
                                <GripVertical size={11} className="text-zinc-300" />
                                <span className="text-xs text-zinc-700">{skill.name}</span>
                                <button onClick={() => handleDeleteSkill(skill.id)}
                                  disabled={deletingSkillId === skill.id}
                                  className="text-zinc-200 hover:text-red-400 transition-colors ml-0.5">
                                  {deletingSkillId === skill.id
                                    ? <Loader2 size={11} className="animate-spin" />
                                    : <Trash2 size={11} />}
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {categories.length === 0 && (
                    <p className="text-sm text-zinc-300 text-center py-4">Buat kategori dulu di atas</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── TAB: SITE SETTINGS ──────────────────────────── */}
        {activeTab === "Site Settings" && (
          <div className="bg-white border border-zinc-100 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <Globe size={16} className="text-zinc-400" />
              <h2 className="text-sm font-semibold text-zinc-800">Site Settings</h2>
            </div>
            <p className="text-xs text-zinc-400 mb-5 bg-zinc-50 rounded-lg p-3 border border-zinc-100">
              Pengaturan ini dipakai untuk meta tag, title browser, dan SEO halaman.
            </p>

            {siteLoading ? (
              <div className="flex justify-center py-10"><Loader2 size={20} className="animate-spin text-zinc-300" /></div>
            ) : (
              <form onSubmit={handleSaveSite} className="space-y-4">

                <Field label="Nama Pemilik Site">
                  <input type="text" value={siteSettings?.site_name || ""}
                    onChange={(e) => setSiteSettings((p) => ({ ...p, site_name: e.target.value }))}
                    placeholder="Fikri Asyam" className={inputCls} />
                </Field>

                <Field label="Title Tab Browser">
                  <input type="text" value={siteSettings?.site_title || ""}
                    onChange={(e) => setSiteSettings((p) => ({ ...p, site_title: e.target.value }))}
                    placeholder="Fikri Asyam | Frontend Developer Portfolio"
                    className={inputCls} />
                </Field>

                <Field label="Deskripsi SEO">
                  <textarea value={siteSettings?.site_description || ""} rows={3}
                    onChange={(e) => setSiteSettings((p) => ({ ...p, site_description: e.target.value }))}
                    placeholder="Portofolio resmi..."
                    className={`${inputCls} resize-none`} />
                </Field>

                <Field label="URL Website">
                  <input type="url" value={siteSettings?.site_url || ""}
                    onChange={(e) => setSiteSettings((p) => ({ ...p, site_url: e.target.value }))}
                    placeholder="https://namaanda.vercel.app/"
                    className={inputCls} />
                </Field>

                {/* OG Image — upload file */}
                <Field label="Preview Image (OG Image)"
                  hint="Gambar yang muncul saat link dibagikan di WhatsApp, Twitter, dll. Ukuran ideal 1200×630px.">
                  <div className="space-y-3">
                    {/* Preview */}
                    {(ogPreview || siteSettings?.og_image) && (
                      <div className="relative w-full rounded-xl overflow-hidden border border-zinc-200 bg-zinc-50" style={{ aspectRatio: "1200/630" }}>
                        <img
                          src={ogPreview || siteSettings?.og_image}
                          alt="OG preview"
                          className="w-full h-full object-cover"
                          onError={(e) => e.target.style.display = "none"}
                        />
                        {uploadingOg && (
                          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                            <Loader2 size={20} className="animate-spin text-zinc-500" />
                          </div>
                        )}
                      </div>
                    )}

                    {/* Upload button */}
                    <label className="flex items-center gap-2 cursor-pointer w-fit text-xs px-3 py-2 rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-50 transition-colors">
                      <ImagePlus size={14} />
                      {siteSettings?.og_image ? "Ganti Gambar" : "Upload Gambar"}
                      <input
                        ref={ogInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0]; if (!f) return;
                          setOgFile(f); setOgPreview(URL.createObjectURL(f));
                        }}
                      />
                    </label>
                  </div>
                </Field>

                <SaveBtn saving={savingSite} msg={saveSiteMsg} />
              </form>
            )}
          </div>
        )}

      </div>
    </Layout>
  );
}
