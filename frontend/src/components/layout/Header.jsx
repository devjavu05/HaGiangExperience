import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, FileText, LogOut, Settings, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

function Header({
  onNavigateHome,
  onNavigateExplore,
  onNavigateCreate,
  onNavigateAuth,
  onNavigateMine,
  onNavigateProfile,
  currentView,
  canCreatePost,
  isAuthenticated,
  currentUser,
  onLogout
}) {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const isExperiencePage = location.pathname.startsWith("/experience/");
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        setIsUserMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    setIsUserMenuOpen(false);
  }, [location.pathname]);

  const headerClass = isHomePage
    ? "bg-transparent text-white border-transparent"
    : "border-b border-slate-100 bg-white/80 text-slate-900 backdrop-blur-md";

  const subTextClass = isHomePage ? "text-white/78" : "text-slate-500";
  const navIdleClass = isHomePage
    ? "bg-white/8 text-white hover:bg-white/14"
    : "bg-slate-100 text-slate-700 hover:bg-slate-200";
  const navActiveClass = isHomePage
    ? "bg-white text-slate-900"
    : "bg-slate-900 text-white";
  const secondaryButtonClass = isHomePage
    ? "border-white/16 bg-white/8 text-white hover:bg-white/16"
    : "border-slate-200 bg-white text-slate-900 hover:bg-slate-100";
  const primaryButtonClass = isHomePage
    ? "bg-white text-stone-900"
    : "bg-forest-900 text-clay-50";
  const avatarButtonClass = isHomePage
    ? "border-white/18 bg-white/10 text-white hover:bg-white/16"
    : "border-slate-200 bg-white/95 text-slate-900 hover:bg-slate-50 shadow-xl";
  const dropdownClass = isHomePage
    ? "border-white/12 bg-white/12 text-white backdrop-blur-xl"
    : "border-slate-200 bg-white text-slate-900 shadow-xl";
  const dropdownMutedClass = isHomePage ? "text-white/70" : "text-slate-500";
  const dropdownItemClass = isHomePage
    ? "text-white hover:bg-white/10"
    : "text-slate-700 hover:bg-slate-100";

  return (
    <header
      className={`fixed left-0 top-0 z-50 w-full transition-all duration-500 ${headerClass}`}
    >
      <div className="flex w-full flex-col gap-4 px-6 py-4 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-12 xl:px-14 2xl:px-16">
        <button type="button" onClick={onNavigateHome} className="shrink-0 text-left">
          <p
            className={`text-[11px] font-semibold uppercase tracking-[0.38em] transition-all duration-500 ${subTextClass}`}
          >
            Hà Giang
          </p>
          <h1 className="mt-1 text-xl font-semibold transition-all duration-500 sm:text-[1.35rem]">
            Local Experience
          </h1>
        </button>

        <div className="flex flex-col gap-3 lg:ml-auto lg:flex-row lg:items-center lg:gap-6 xl:gap-8">
          <nav className="flex flex-wrap items-center gap-3 text-sm xl:gap-4">
            <HeaderLink
              active={currentView === "home"}
              onClick={onNavigateExplore}
              label="Trải nghiệm"
              activeClass={navActiveClass}
              idleClass={navIdleClass}
            />
            {canCreatePost ? (
              <HeaderLink
                active={currentView === "create"}
                onClick={onNavigateCreate}
                label="Đăng bài"
                activeClass={navActiveClass}
                idleClass={navIdleClass}
              />
            ) : null}
          </nav>

          <div className="flex flex-wrap items-center gap-4 lg:justify-end xl:gap-5">
            {isAuthenticated ? (
              <div className="relative ml-auto" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen((open) => !open)}
                  className={`flex items-center gap-2.5 rounded-full border py-2 pl-2 pr-3 transition-all duration-500 ${avatarButtonClass}`}
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-700/90 text-sm font-semibold text-white">
                    {getInitials(currentUser?.username)}
                  </span>
                  <span className="hidden max-w-[110px] truncate text-left text-sm font-semibold leading-tight sm:block">
                    {currentUser?.username || "Người dùng"}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`shrink-0 transition-transform duration-300 ${isUserMenuOpen ? "rotate-180" : ""}`}
                  />
                </button>

                <AnimatePresence>
                  {isUserMenuOpen ? (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.98 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className={`absolute right-0 top-[calc(100%+12px)] w-72 overflow-hidden rounded-3xl border p-2 ${dropdownClass}`}
                    >
                      <div className="rounded-2xl px-4 py-3">
                        <div className="flex items-center gap-3">
                          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-700 text-base font-semibold text-white">
                            {getInitials(currentUser?.username)}
                          </span>
                          <div>
                            <p className="text-sm font-semibold">
                              {currentUser?.username || "Người dùng"}
                            </p>
                            <p
                              className={`text-xs uppercase tracking-[0.24em] ${dropdownMutedClass}`}
                            >
                              Role: {formatRole(currentUser?.role)}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div
                        className={`mx-2 my-1 h-px ${isHomePage ? "bg-white/10" : "bg-slate-200"}`}
                      />

                      <DropdownItem
                        icon={FileText}
                        label="Bài đăng của tôi"
                        onClick={onNavigateMine}
                        className={dropdownItemClass}
                      />
                      <DropdownItem
                        icon={Settings}
                        label="Quản lý trang cá nhân"
                        onClick={onNavigateProfile}
                        className={dropdownItemClass}
                      />
                      <DropdownItem
                        icon={LogOut}
                        label="Đăng xuất"
                        onClick={onLogout}
                        className={
                          isHomePage
                            ? "text-rose-100 hover:bg-rose-400/10"
                            : "text-rose-600 hover:bg-rose-50"
                        }
                      />
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}

function HeaderLink({ label, onClick, active = false, activeClass, idleClass }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-500 ${
        active ? activeClass : idleClass
      }`}
    >
      {label}
    </button>
  );
}

function DropdownItem({ icon: Icon, label, onClick, className }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${className}`}
    >
      <Icon size={18} />
      <span>{label}</span>
    </button>
  );
}

function getInitials(name) {
  if (!name) return <User size={18} />;

  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return initials || <User size={18} />;
}

function formatRole(role) {
  if (role === "ROLE_LOCAL_HOST") return "LOCAL_HOST";
  if (role === "ROLE_USER") return "USER";
  return "USER";
}

export default Header;
