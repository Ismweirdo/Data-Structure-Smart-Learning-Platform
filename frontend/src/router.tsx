import { Navigate, Route, Routes } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import AdminPage from "./pages/AdminPage";
import DashboardPage from "./pages/DashboardPage";
import ExercisePage from "./pages/ExercisePage";
import ExercisesPage from "./pages/ExercisesPage";
import HomePage from "./pages/HomePage";
import KnowledgeDetailPage from "./pages/KnowledgeDetailPage";
import KnowledgeGraphPage from "./pages/KnowledgeGraphPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import VisualizationPage from "./pages/VisualizationPage";
import AuthGuard from "./components/layout/AuthGuard";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route
          path="dashboard"
          element={
            <AuthGuard>
              <DashboardPage />
            </AuthGuard>
          }
        />
        <Route path="knowledge-graph" element={<KnowledgeGraphPage />} />
        <Route path="knowledge/:id" element={<KnowledgeDetailPage />} />
        <Route path="visualization/:type" element={<VisualizationPage />} />
        <Route path="exercises" element={<ExercisesPage />} />
        <Route
          path="exercises/:id"
          element={
            <AuthGuard>
              <ExercisePage />
            </AuthGuard>
          }
        />
        <Route
          path="admin"
          element={
            <AuthGuard adminOnly>
              <AdminPage />
            </AuthGuard>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
