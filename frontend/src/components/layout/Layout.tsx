// src/components/layout/Layout.tsx
import { Outlet } from "react-router-dom";
import NavBar from "@/components/common/NavBar";

const Layout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Global NavBar always at the top */}
      <NavBar />

      <main className="flex-grow">
        <Outlet /> {/* All pages will render here */}
      </main>

      {/* Global Footer */}
      <footer className="bg-gray-100 dark:bg-slate-900 py-4 text-center text-sm text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-slate-700">
        🔒 We never share your data. All data is securely stored | Created ❤️ by{" "}
        <span className="font-semibold">Destiny Jokomba</span>
      </footer>
    </div>
  );
};

export default Layout;
