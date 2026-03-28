import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const ProtectedAdminRoute = ({ children }: { children: JSX.Element }) => {
  const { user, isLoading, isConfigured } = useAuth();

  if (!isConfigured) {
    return <Navigate to="/admin-login" replace />;
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary/30 px-4">
        <div className="rounded-[28px] border border-border bg-card px-6 py-5 text-sm text-muted-foreground shadow-sm">
          Checking admin access...
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin-login" replace />;
  }

  return children;
};

export default ProtectedAdminRoute;
