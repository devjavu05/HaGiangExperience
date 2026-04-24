import { useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Toast from "./components/common/Toast";
import ConfirmModal from "./components/common/ConfirmModal";
import Layout from "./components/layout/Layout";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { useExperiences } from "./hooks/useExperiences";
import { deleteExperience } from "./services/experienceService";
import LandingPage from "./pages/LandingPage";
import ExplorePage from "./pages/ExplorePage";
import ExperiencePage from "./pages/ExperiencePage";
import CreatePost from "./pages/CreatePost";
import AuthPage from "./pages/AuthPage";
import MyExperiences from "./pages/MyExperiences";
import EditExperiencePage from "./pages/EditExperiencePage";
import ProfilePage from "./pages/ProfilePage";

function getCurrentView(pathname) {
  if (pathname.startsWith("/explore")) return "home";
  if (pathname.startsWith("/dashboard")) return "mine";
  if (pathname.startsWith("/profile")) return "profile";
  if (pathname.startsWith("/create")) return "create";
  if (pathname.startsWith("/auth")) return "auth";
  return "";
}

function AppContent() {
  const { experiences, isLoading, error, refreshExperiences } = useExperiences();
  const { user, isLocalHost, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [toast, setToast] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeletingExperience, setIsDeletingExperience] = useState(false);
  const [deletedExperienceId, setDeletedExperienceId] = useState(null);

  function showToast(config) {
    const nextToast = {
      id: Date.now(),
      ...config
    };

    setToast(nextToast);
    window.clearTimeout(showToast.timeoutId);
    showToast.timeoutId = window.setTimeout(() => {
      setToast(null);
    }, 2800);
  }

  async function handleSavedExperience(savedExperience) {
    await refreshExperiences();
    if (savedExperience?.id) {
      navigate(`/experience/${savedExperience.id}`);
      return;
    }
    navigate("/explore");
  }

  async function handleConfirmDelete() {
    if (!deleteTarget || isDeletingExperience) return;

    try {
      setIsDeletingExperience(true);
      const deletedId = deleteTarget.id;
      await deleteExperience(deleteTarget.id);
      showToast({
        type: "success",
        title: "Xóa thành công",
        message: "Bài viết và các tệp ảnh liên quan đã được xóa."
      });
      setDeletedExperienceId(deletedId);
      setDeleteTarget(null);
      await refreshExperiences();
      if (location.pathname.startsWith("/experience/")) {
        navigate("/explore");
      }
    } catch (errorResponse) {
      showToast({
        type: "error",
        title: "Xóa thất bại",
        message: errorResponse.response?.data?.message || "Không thể xóa bài viết lúc này."
      });
    } finally {
      setIsDeletingExperience(false);
    }
  }

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Toast toast={toast} />
      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Xác nhận xóa bài viết"
        message={`Bạn có chắc chắn muốn xóa trải nghiệm ${deleteTarget?.title?.toLowerCase() ?? ""} không?`}
        confirmLabel="Xóa bài viết"
        onCancel={() => {
          if (isDeletingExperience) return;
          setDeleteTarget(null);
        }}
        onConfirm={handleConfirmDelete}
        isLoading={isDeletingExperience}
      />

      <Routes>
        <Route
          element={
            <Layout
              currentView={getCurrentView(location.pathname)}
              canCreatePost={isLocalHost}
              isAuthenticated={isAuthenticated}
              currentUser={user}
              onNavigateHome={() => navigate("/")}
              onNavigateExplore={() => navigate("/explore")}
              onNavigateAuth={() => navigate("/auth")}
              onNavigateCreate={() => navigate("/create")}
              onNavigateMine={() => navigate("/dashboard")}
              onNavigateProfile={() => navigate("/profile")}
              onLogout={() => {
                logout();
                navigate("/");
                showToast({
                  type: "success",
                  title: "Đăng xuất thành công",
                  message: "Hẹn gặp lại bạn trong những hành trình tiếp theo."
                });
              }}
            />
          }
        >
          <Route index element={<LandingPage />} />
          <Route
            path="/explore"
            element={
              <ExplorePage
                currentUser={user}
                deletedExperienceId={deletedExperienceId}
                onEditExperience={(experience) => navigate(`/experience/${experience.id}/edit`)}
                onDeleteExperience={(experience) => setDeleteTarget(experience)}
              />
            }
          />
          <Route path="/experience/:id" element={<ExperiencePage />} />
          <Route
            path="/dashboard"
            element={
              <MyExperiences
                showToast={showToast}
                deletedExperienceId={deletedExperienceId}
                onEditExperience={(experience) => navigate(`/experience/${experience.id}/edit`)}
                onDeleteExperienceRequest={(experience) => setDeleteTarget(experience)}
              />
            }
          />
          <Route
            path="/create"
            element={<CreatePost showToast={showToast} onSuccess={handleSavedExperience} />}
          />
          <Route
            path="/experience/:id/edit"
            element={<EditExperiencePage showToast={showToast} onSaved={handleSavedExperience} />}
          />
          <Route
            path="/auth"
            element={<AuthPage showToast={showToast} onSuccess={() => navigate("/explore")} />}
          />
          <Route
            path="/profile"
            element={<ProfilePage showToast={showToast} />}
          />
        </Route>
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
