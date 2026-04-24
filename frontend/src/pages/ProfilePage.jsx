import { useEffect, useState } from "react";
import { LoaderCircle, Phone, Save, UserRound } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { updatePhoneNumber } from "../services/authService";

function ProfilePage({ showToast }) {
  const { user, updateUser } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setPhoneNumber(user?.phoneNumber ?? "");
  }, [user?.phoneNumber]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);
      const authPayload = await updatePhoneNumber({ phoneNumber });
      updateUser(authPayload.user);
      showToast?.({
        type: "success",
        title: "Cap nhat thanh cong",
        message: "So dien thoai cua ban da duoc cap nhat."
      });
    } catch (error) {
      showToast?.({
        type: "error",
        title: "Cap nhat that bai",
        message:
          error.response?.data?.message || "Khong the cap nhat so dien thoai luc nay."
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto min-h-[60vh] max-w-4xl px-4 pb-16 pt-36 sm:px-6 lg:px-8">
      <div className="rounded-[2rem] border border-clay-200 bg-white/95 p-8 shadow-xl shadow-stone-950/5">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-forest-700">
          Trang ca nhan
        </p>
        <h2 className="mt-3 text-3xl font-semibold text-stone-900">Quan ly ho so cua ban</h2>
        <p className="mt-4 max-w-2xl text-base leading-7 text-stone-600">
          Ban co the cap nhat so dien thoai de nguoi dung lien he truc tiep qua Zalo khi xem bai dang.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl bg-clay-50 p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-stone-500">Ten hien thi</p>
            <div className="mt-2 flex items-center gap-3 text-lg font-semibold text-stone-900">
              <UserRound size={18} className="text-terracotta-700" />
              <span>{user?.username || "Chua dang nhap"}</span>
            </div>
          </div>
          <div className="rounded-3xl bg-clay-50 p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-stone-500">Vai tro</p>
            <p className="mt-2 text-lg font-semibold text-stone-900">{user?.role || "USER"}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-6">
          <label className="block text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
            So dien thoai Zalo
          </label>
          <div className="mt-3 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <Phone size={18} className="text-forest-700" />
            <input
              type="tel"
              value={phoneNumber}
              onChange={(event) => setPhoneNumber(event.target.value)}
              placeholder="Vi du: 0912345678"
              className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
              disabled={isSubmitting}
            />
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            So nay se duoc dung cho nut "Lien he ngay" de mo Zalo cua ban.
          </p>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#1A3021] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-950/10 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? <LoaderCircle size={16} className="animate-spin" /> : <Save size={16} />}
            {isSubmitting ? "Dang cap nhat..." : "Luu so dien thoai"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProfilePage;
