import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { type AppwriteException } from "appwrite";
import { LockKeyhole, Mail } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID } from "@/lib/appwrite";

const inputClassName =
  "w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { user, login, isLoading, isConfigured } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (user) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      await login(email, password);
      toast.success("Logged in successfully.");
      navigate("/admin");
    } catch (error) {
      console.error(error);
      const message =
        (error as AppwriteException)?.message || "Unable to log in.";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary/30 px-4 py-10 md:px-8">
      <div className="mx-auto max-w-xl rounded-[32px] border border-border bg-card p-8 shadow-sm md:p-10">
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-primary">
            Admin Access
          </p>
          <h1 className="text-3xl font-bold text-foreground md:text-4xl">
            Sign in to edit the website
          </h1>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">
            Only Appwrite users you create in your project can log in here and make changes.
          </p>
        </div>

        {!isConfigured ? (
          <div className="rounded-[24px] border border-destructive/20 bg-destructive/5 px-5 py-4 text-sm text-foreground">
            <p className="font-semibold">Appwrite is not configured yet.</p>
            <p className="mt-2 text-muted-foreground">
              Add `VITE_APPWRITE_ENDPOINT` and `VITE_APPWRITE_PROJECT_ID` to your `.env` file, then restart the app.
            </p>
            <div className="mt-3 space-y-1 text-xs text-muted-foreground">
              <p>Endpoint: {APPWRITE_ENDPOINT || "not set"}</p>
              <p>Project ID: {APPWRITE_PROJECT_ID || "not set"}</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <label className="block space-y-2">
              <span className="text-sm font-medium">Login email</span>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  className={`${inputClassName} pl-11`}
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="admin@example.com"
                  autoComplete="email"
                  required
                />
              </div>
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium">Password</span>
              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  className={`${inputClassName} pl-11`}
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter password"
                  autoComplete="current-password"
                  required
                />
              </div>
            </label>

            {errorMessage ? (
              <div className="rounded-[20px] border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                {errorMessage}
              </div>
            ) : null}

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="submit"
                disabled={isSubmitting || isLoading}
                className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Signing in..." : "Login to Admin"}
              </button>
              <Link
                to="/"
                className="rounded-full border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary/30 hover:bg-primary hover:text-primary-foreground"
              >
                Back to Site
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminLogin;
