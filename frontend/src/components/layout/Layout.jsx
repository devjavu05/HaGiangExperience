import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

function Layout(props) {
  const location = useLocation();
  const isAuthPage = location.pathname.startsWith("/auth");
  const isHomePage = location.pathname === "/";

  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-900">
      {isAuthPage ? null : <Header {...props} />}
      <main className={`flex-1 bg-white ${isAuthPage ? "" : ""}`}>
        <Outlet />
      </main>
      {isAuthPage || isHomePage ? null : <Footer />}
    </div>
  );
}

export default Layout;
