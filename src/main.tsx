import { lazy, Suspense, useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./firebase";

const AdminApp = lazy(() => import("./components/apps/AdminApp").then(m => ({ default: m.AdminApp })));

function isStandaloneAdminRoute(): boolean {
  if (typeof window === "undefined") return false;
  const pathname = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  return (
    pathname === "/admin" ||
    pathname.startsWith("/admin/") ||
    pathname === "/admin.html" ||
    hash === "#admin" ||
    hash === "#/admin"
  );
}

function Root() {
  const [isAdmin, setIsAdmin] = useState(isStandaloneAdminRoute);

  useEffect(() => {
    const handleRoute = () => {
      setIsAdmin(isStandaloneAdminRoute());
    };

    window.addEventListener("popstate", handleRoute);
    window.addEventListener("hashchange", handleRoute);

    return () => {
      window.removeEventListener("popstate", handleRoute);
      window.removeEventListener("hashchange", handleRoute);
    };
  }, []);

  if (isAdmin) {
    return (
      <Suspense fallback={
        <div className="fixed inset-0 min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center font-mono">
          <div className="w-6 h-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
        </div>
      }>
        <AdminApp isStandalone={true} />
      </Suspense>
    );
  }

  return <App />;
}

createRoot(document.getElementById("root")!).render(<Root />);
