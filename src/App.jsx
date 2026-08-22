import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Protected route
import ProtectedRoute from './components/common/ProtectedRoute';

// Page view tracking
import { usePageTracking } from './hooks/usePageTracking';
import { useSiteSettings } from './hooks/useSiteSettings';

// ─── Main Pages ──────────────────────────────────────
import Resume from './pages/Resume';
import HomePage from './pages/HomePage';
import ChatRoom from './pages/ChatRoom';
import AmbientPlayer from './components/AmbientPlayer';

// ─── Frontdev Pages ─────────────────────────────────
import Project from './pages/Project';
import Certificate from './pages/Certificate';
import Guestbook from './pages/Guestbook';
import GithubRepo from './pages/GithubRepo';
import Blogs from './pages/Blog';
import DetailBlog from './pages/DetailBlog';
import Writings01 from './pages/DetailWritings/tailwind-ui-is-now-tailwind-plus';
import OtherFrontDev from './pages/OtherFrontDev';

// ─── Admin Pages ────────────────────────────────────
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import AdminProject from './pages/admin/ManageProject';
import AdminCertificate from './pages/admin/ManageCertificate';
import ManageBlogs from './pages/admin/ManageBlogs';
import ManageQuotes from './pages/admin/ManageQuotes';
import ManageAudio from './pages/admin/ManageAudio';
import ManageChat from './pages/admin/ManageChat';
import ManageEducation from './pages/admin/ManageEducation';
import ManageExperience from './pages/admin/ManageExperience';
import ManageResume from './pages/admin/ManageResume';
import ManageProfile from './pages/admin/ManageProfile';

function AppRoutes() {
  usePageTracking();

  // Update title & meta dari site_settings
  const siteSettings = useSiteSettings();
  useEffect(() => {
    if (!siteSettings) return;

    // Update title
    if (siteSettings.site_title) {
      document.title = siteSettings.site_title;
    }

    // Update meta description
    const setMeta = (name, content, prop = false) => {
      if (!content) return;
      const attr = prop ? "property" : "name";
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) { el = document.createElement("meta"); el.setAttribute(attr, name); document.head.appendChild(el); }
      el.setAttribute("content", content);
    };

    setMeta("description", siteSettings.site_description);
    setMeta("author", siteSettings.site_name);
    setMeta("og:title", siteSettings.site_title, true);
    setMeta("og:description", siteSettings.site_description, true);
    setMeta("og:url", siteSettings.site_url, true);
    setMeta("og:image", siteSettings.og_image?.startsWith("http") ? siteSettings.og_image : `${siteSettings.site_url}${siteSettings.og_image}`, true);
    setMeta("twitter:title", siteSettings.site_title);
    setMeta("twitter:description", siteSettings.site_description);
  }, [siteSettings]);

  return (
    <Routes>

      {/* ── Main Routes ───────────────── */}
      <Route path="/" element={<HomePage />} />
      <Route path="/resume" element={<Resume />} />
      <Route path="/chat" element={<ChatRoom />} />

      {/* ── Frontdev Routes ───────────── */}
      <Route path="/projects" element={<Project />} />
      <Route path="/certificates" element={<Certificate />} />
      <Route path="/guestbook" element={<Guestbook />} />
      <Route path="/github" element={<GithubRepo />} />
      <Route path="/others" element={<OtherFrontDev />} />
      <Route path="/blogs" element={<Blogs />} />
      <Route path="/blogs/:slug" element={<DetailBlog />} />
      <Route path="/writings/tailwind-ui-is-now-tailwind-plus" element={<Writings01 />} />

      {/* Login */}
      <Route path="/login" element={<Login />} />

      {/* Admin / Dashboard (Protected) */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/dashboard/frontdev/manage-projects" element={<ProtectedRoute><AdminProject /></ProtectedRoute>} />
      <Route path="/dashboard/frontdev/manage-certificates" element={<ProtectedRoute><AdminCertificate /></ProtectedRoute>} />
      <Route path="/dashboard/frontdev/manage-blogs" element={<ProtectedRoute><ManageBlogs /></ProtectedRoute>} />
      <Route path="/dashboard/creator/manage-quotes" element={<ProtectedRoute><ManageQuotes /></ProtectedRoute>} />
      <Route path="/dashboard/creator/manage-audio" element={<ProtectedRoute><ManageAudio /></ProtectedRoute>} />
      <Route path="/dashboard/manage-chat" element={<ProtectedRoute><ManageChat /></ProtectedRoute>} />
      <Route path="/dashboard/manage-education" element={<ProtectedRoute><ManageEducation /></ProtectedRoute>} />
      <Route path="/dashboard/manage-experience" element={<ProtectedRoute><ManageExperience /></ProtectedRoute>} />
      <Route path="/dashboard/manage-resume" element={<ProtectedRoute><ManageResume /></ProtectedRoute>} />
      <Route path="/dashboard/manage-profile" element={<ProtectedRoute><ManageProfile /></ProtectedRoute>} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AmbientPlayer />
      <AppRoutes />
    </Router>
  );
}

export default App;
