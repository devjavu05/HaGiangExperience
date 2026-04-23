import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, AlertCircle } from "lucide-react";

function Toast({ toast }) {
  return (
    <div className="pointer-events-none fixed right-4 top-20 z-50 w-[min(92vw,380px)]">
      <AnimatePresence>
        {toast ? (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.96 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className={`pointer-events-auto rounded-3xl border px-4 py-4 shadow-[0_18px_45px_rgba(56,45,34,0.18)] ${
              toast.type === "success"
                ? "border-forest-200 bg-forest-50 text-forest-900"
                : "border-terracotta-200 bg-white text-stone-900"
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl ${
                  toast.type === "success"
                    ? "bg-forest-900 text-clay-50"
                    : "bg-terracotta-700 text-clay-50"
                }`}
              >
                {toast.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              </div>
              <div>
                <p className="text-sm font-semibold">{toast.title}</p>
                <p className="mt-1 text-sm leading-6 text-stone-600">{toast.message}</p>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export default Toast;
