import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0a0f", color: "white" }}>
        Loading...
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  const activeRole = localStorage.getItem("activeRole"); // "student" | "mentor" | null

  // ── Admin ──────────────────────────────────────────────────────
  if (allowedRoles?.includes("admin")) {
    return user.role === "admin" ? <Outlet /> : <Navigate to="/login" replace />;
  }

  // ── Mentor routes ──────────────────────────────────────────────
  // Access granted if:
  //   • user.isMentor === true AND they chose "mentor" in role modal
  //   • OR user.role === "mentor" AND isMentor (they registered as mentor and are approved)
  if (allowedRoles?.includes("mentor")) {
    const canAccessMentor =
      user.isMentor === true &&
      (activeRole === "mentor" || (!activeRole && user.role === "mentor"));
    return canAccessMentor ? <Outlet /> : <Navigate to="/login" replace />;
  }

  // ── Student routes ─────────────────────────────────────────────
  // Access granted if:
  //   • Pure student: role="student" AND isMentor=false  (always allowed, ignore activeRole)
  //   • Dual-role user who chose "student" in the role modal (activeRole="student")
  if (allowedRoles?.includes("student")) {
    const isPureStudent = user.role === "student" && !user.isMentor;
    const isDualRoleChoseStudent = user.isMentor === true && activeRole === "student";
    return (isPureStudent || isDualRoleChoseStudent) ? <Outlet /> : <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;

