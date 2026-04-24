import { AnimatePresence, motion } from "framer-motion";
import { LoaderCircle } from "lucide-react";

function ConfirmModal({ open, title, message, confirmLabel, onConfirm, onCancel, isLoading = false }) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
        >
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            className="relative w-full max-w-md rounded-[28px] border border-clay-200 bg-white p-6 shadow-[0_30px_80px_rgba(39,31,24,0.22)]"
            aria-busy={isLoading}
          >
            <AnimatePresence>
              {isLoading ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-10 flex items-center justify-center rounded-[28px] bg-[#163020]/45 px-6 backdrop-blur-[6px]"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 18, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.98 }}
                    transition={{ duration: 0.24, ease: "easeOut" }}
                    className="w-full max-w-xs rounded-[28px] border border-white/40 bg-white/92 p-6 text-center shadow-[0_24px_80px_rgba(15,23,42,0.22)]"
                  >
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[linear-gradient(135deg,#8E3B2B,#C96C4A)] text-white shadow-[0_16px_40px_rgba(142,59,43,0.28)]">
                      <LoaderCircle size={24} className="animate-spin" />
                    </div>
                    <p className="mt-4 text-base font-semibold text-stone-900">Đang xóa bài viết</p>
                    <p className="mt-2 text-sm leading-6 text-stone-600">
                      Vui lòng chờ trong giây lát. Bài viết đang được gỡ khỏi hệ thống.
                    </p>
                  </motion.div>
                </motion.div>
              ) : null}
            </AnimatePresence>
            <h3 className="text-2xl font-semibold text-stone-900">{title}</h3>
            <p className="mt-3 text-sm leading-7 text-stone-600">{message}</p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={onCancel}
                disabled={isLoading}
                className="flex-1 rounded-full border border-clay-300 px-4 py-3 text-sm font-semibold text-stone-700"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={isLoading}
                className="flex-1 rounded-full bg-terracotta-700 px-4 py-3 text-sm font-semibold text-clay-50"
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export default ConfirmModal;
