import { AnimatePresence, motion } from "framer-motion";

function ConfirmModal({ open, title, message, confirmLabel, onConfirm, onCancel }) {
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
            className="w-full max-w-md rounded-[28px] border border-clay-200 bg-white p-6 shadow-[0_30px_80px_rgba(39,31,24,0.22)]"
          >
            <h3 className="text-2xl font-semibold text-stone-900">{title}</h3>
            <p className="mt-3 text-sm leading-7 text-stone-600">{message}</p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 rounded-full border border-clay-300 px-4 py-3 text-sm font-semibold text-stone-700"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={onConfirm}
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
