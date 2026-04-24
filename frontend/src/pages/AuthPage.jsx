import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LogIn, UserPlus } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { login, register } from "../services/authService";
import heroHaGiang from "../assets/pexels-qhung999-32149195.jpg";

function AuthPage({ onSuccess, showToast }) {
  const { login: saveAuth } = useAuth();
  const [authMode, setAuthMode] = useState("login");
  const [form, setForm] = useState({
    username: "",
    password: "",
    email: "",
    phoneNumber: "",
    role: "ROLE_LOCAL_HOST"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleLoginSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const authPayload = await login({
        username: form.username,
        password: form.password
      });

      saveAuth(authPayload);
      showToast?.({
        type: "success",
        title: "Đăng nhập thành công",
        message: `Xin chào ${authPayload.user.username}.`
      });
      onSuccess?.();
    } catch (error) {
      showToast?.({
        type: "error",
        title: "Đăng nhập thất bại",
        message:
          error.response?.data?.message ||
          "Không thể xử lý yêu cầu xác thực lúc này. Vui lòng thử lại sau."
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleRegisterSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await register(form);
      showToast?.({
        type: "success",
        title: "Đăng ký thành công",
        message: "Tài khoản đã được tạo. Hãy đăng nhập để bắt đầu hành trình của bạn."
      });
      setForm((current) => ({ ...current, password: "" }));
      setAuthMode("login");
    } catch (error) {
      showToast?.({
        type: "error",
        title: "Đăng ký thất bại",
        message:
          error.response?.data?.message ||
          "Không thể xử lý yêu cầu xác thực lúc này. Vui lòng thử lại sau."
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-white lg:h-screen lg:overflow-hidden">
      <AuthVisualPanel />

      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] px-4 py-12 sm:px-6 lg:ml-[50vw] lg:h-screen lg:w-[50vw] lg:overflow-y-auto lg:px-10">
        <div className="my-6 w-full max-w-md">
          <div className="rounded-[2.5rem] border border-slate-100 bg-white p-10 shadow-[0_20px_50px_rgba(0,0,0,0.08)]">
            <AuthHeader authMode={authMode} onModeChange={setAuthMode} />

            <AnimatePresence mode="wait">
              {authMode === "login" ? (
                <LoginForm
                  key="login"
                  form={form}
                  isSubmitting={isSubmitting}
                  onChange={updateField}
                  onSubmit={handleLoginSubmit}
                />
              ) : (
                <RegisterForm
                  key="register"
                  form={form}
                  isSubmitting={isSubmitting}
                  onChange={updateField}
                  onSubmit={handleRegisterSubmit}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

function AuthVisualPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -64 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative hidden h-screen overflow-hidden lg:fixed lg:left-0 lg:top-0 lg:block lg:w-[50vw]"
    >
      <img
        src={heroHaGiang}
        alt="Thiên nhiên Hà Giang"
        className="h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-[#1A3021]/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/25 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/10 to-transparent" />
      <div className="absolute inset-0 flex items-center justify-center px-14 text-center">
        <div className="max-w-2xl text-white">
          <p className="text-sm font-medium uppercase tracking-[0.38em] text-white/80">
            Ha Giang Local Experience
          </p>
          <blockquote className="mt-8 font-sans text-4xl font-bold leading-tight xl:text-5xl">
            "Mỗi hành trình đẹp nhất đều bắt đầu từ một khoảnh khắc mở lòng với vùng đất mới."
          </blockquote>
          <p className="mt-6 text-base leading-8 text-white/85 xl:text-lg">
            Chạm vào nhịp sống Hà Giang qua những cung đường, thửa ruộng và câu chuyện rất thật từ người bản địa.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function AuthHeader({ authMode, onModeChange }) {
  return (
    <>
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.28em] text-[#6F8A74]">
          Welcome
        </p>
        <h1 className="mt-3 font-sans text-[1.75rem] font-bold text-[#1A3021] sm:text-[2rem]">
          {authMode === "login" ? "Chào mừng bạn trở lại" : "Tạo tài khoản mới"}
        </h1>
        <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
          {authMode === "login"
            ? "Đăng nhập để tiếp tục hành trình khám phá Hà Giang."
            : "Đăng ký nhanh để bắt đầu lưu lại những trải nghiệm đáng nhớ."}
        </p>
      </div>

      <div className="mt-8 rounded-full border border-slate-100 bg-slate-50/80 p-1.5">
        <div className="grid grid-cols-2 gap-1">
          <button
            type="button"
            onClick={() => onModeChange("login")}
            className={`rounded-full px-5 py-3 text-sm font-semibold transition-all ${
              authMode === "login"
                ? "bg-[#E8F3EE] text-[#1A3021]"
                : "bg-transparent text-slate-600 hover:text-[#1A3021]"
            }`}
          >
            Đăng nhập
          </button>
          <button
            type="button"
            onClick={() => onModeChange("register")}
            className={`rounded-full px-5 py-3 text-sm font-semibold transition-all ${
              authMode === "register"
                ? "bg-[#E8F3EE] text-[#1A3021]"
                : "bg-transparent text-slate-600 hover:text-[#1A3021]"
            }`}
          >
            Đăng ký
          </button>
        </div>
      </div>
    </>
  );
}

function LoginForm({ form, isSubmitting, onChange, onSubmit }) {
  return (
    <motion.form
      onSubmit={onSubmit}
      initial={{ opacity: 0, x: 18 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -18 }}
      transition={{ duration: 0.24, ease: "easeOut" }}
      className="mt-8 space-y-5"
    >
      <AuthField
        label="Tên đăng nhập"
        input={
          <input
            value={form.username}
            onChange={(event) => onChange("username", event.target.value)}
            placeholder="Nhập tên đăng nhập"
            className={inputClass()}
          />
        }
      />

      <AuthField
        label="Mật khẩu"
        input={
          <input
            type="password"
            value={form.password}
            onChange={(event) => onChange("password", event.target.value)}
            placeholder="Nhập mật khẩu"
            className={inputClass()}
          />
        }
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#1A3021] px-6 py-4 text-base font-semibold text-white shadow-lg shadow-emerald-950/10 transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
      >
        <LogIn size={18} />
        {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
      </button>
    </motion.form>
  );
}

function RegisterForm({ form, isSubmitting, onChange, onSubmit }) {
  return (
    <motion.form
      onSubmit={onSubmit}
      initial={{ opacity: 0, x: 18 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -18 }}
      transition={{ duration: 0.24, ease: "easeOut" }}
      className="mt-8 space-y-5"
    >
      <AuthField
        label="Tên đăng nhập"
        input={
          <input
            value={form.username}
            onChange={(event) => onChange("username", event.target.value)}
            placeholder="Nhập tên đăng nhập"
            className={inputClass()}
          />
        }
      />

      <AuthField
        label="Mật khẩu"
        input={
          <input
            type="password"
            value={form.password}
            onChange={(event) => onChange("password", event.target.value)}
            placeholder="Nhập mật khẩu"
            className={inputClass()}
          />
        }
      />

      <AuthField
        label="Email"
        input={
          <input
            type="email"
            value={form.email}
            onChange={(event) => onChange("email", event.target.value)}
            placeholder="you@example.com"
            className={inputClass()}
          />
        }
      />

      <AuthField
        label="Số điện thoại"
        input={
          <input
            type="tel"
            value={form.phoneNumber}
            onChange={(event) => onChange("phoneNumber", event.target.value)}
            placeholder="Ví dụ: 0912345678"
            className={inputClass()}
          />
        }
      />

      <AuthField
        label="Vai trò"
        input={
          <select
            value={form.role}
            onChange={(event) => onChange("role", event.target.value)}
            className={inputClass()}
          >
            <option value="ROLE_LOCAL_HOST">Local Host</option>
            <option value="ROLE_USER">Người dùng</option>
          </select>
        }
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#1A3021] px-6 py-4 text-base font-semibold text-white shadow-lg shadow-emerald-950/10 transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
      >
        <UserPlus size={18} />
        {isSubmitting ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
      </button>
    </motion.form>
  );
}

function AuthField({ label, input }) {
  return (
    <div className="group space-y-2.5">
      <label className="text-sm font-medium text-slate-700 transition-colors group-focus-within:text-[#1A3021]">
        {label}
      </label>
      {input}
    </div>
  );
}

function inputClass() {
  return "w-full rounded-2xl border border-transparent bg-slate-50 px-5 py-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-[#C98B63] focus:bg-white focus:ring-4 focus:ring-[#E8F3EE]";
}

export default AuthPage;
