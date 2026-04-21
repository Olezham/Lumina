import { useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useToastStore } from "@/store/toastStore";
import styles from "./Toasts.module.scss";

const toastVariants = {
  initial: { opacity: 0, y: 14, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -10, scale: 0.98 },
};

export default function Toasts() {
  const reduceMotion = useReducedMotion();
  const toasts = useToastStore((s) => s.toasts);
  const removeToast = useToastStore((s) => s.removeToast);

  useEffect(() => {
    const timers = toasts.map((t) =>
      window.setTimeout(() => removeToast(t.id), t.duration ?? 2600),
    );
    return () => timers.forEach((x) => window.clearTimeout(x));
  }, [toasts, removeToast]);

  return (
    <div className={styles.host} aria-live="polite" aria-relevant="additions">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            className={`${styles.toast} ${styles[t.type] || ""}`}
            variants={toastVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={
              reduceMotion
                ? { duration: 0 }
                : { type: "spring", stiffness: 520, damping: 36 }
            }
            onClick={() => removeToast(t.id)}
            role="status"
          >
            {t.title ? <div className={styles.title}>{t.title}</div> : null}
            {t.message ? <div className={styles.msg}>{t.message}</div> : null}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
