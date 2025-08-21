// src/components/layout/Layout.tsx
import { Outlet } from "react-router-dom";
import NavBar from "@/components/common/NavBar";

function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
