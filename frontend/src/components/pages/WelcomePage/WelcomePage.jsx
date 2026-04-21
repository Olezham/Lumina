import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./WelcomePage.module.scss";
import { motion, useReducedMotion } from "motion/react";

const WelcomePage = () => {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();

  const btnTransition = reduceMotion
    ? { duration: 0 }
    : { type: "spring", stiffness: 520, damping: 30 };

  const heroVariants = {
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
  };

  return (
    <div className={styles.page}>
      <header className={styles.navbar}>
        <motion.div
          className={styles.logo}
          initial={false}
          whileHover={reduceMotion ? undefined : { y: -1 }}
          transition={btnTransition}
        >
          <span className={styles.logoTitle}>Lumina</span>
          {/* <span className={styles.logoSub}>AI KNOWLEDGE BASE</span> */}
        </motion.div>

        <div className={styles.navActions}>
          <motion.button
            className={styles.btnGhost}
            onClick={() => navigate("/login")}
            whileHover={reduceMotion ? undefined : { y: -1 }}
            whileTap={reduceMotion ? undefined : { scale: 0.98 }}
            transition={btnTransition}
          >
            Log In
          </motion.button>

          <motion.button
            className={styles.btnPrimary}
            onClick={() => navigate("/register")}
            whileHover={reduceMotion ? undefined : { y: -1 }}
            whileTap={reduceMotion ? undefined : { scale: 0.98 }}
            transition={btnTransition}
          >
            Get Started →
          </motion.button>
        </div>
      </header>

      <motion.main
        className={styles.hero}
        variants={heroVariants}
        initial="initial"
        animate="animate"
        transition={
          reduceMotion ? { duration: 0 } : { duration: 0.28, ease: "easeOut" }
        }
      >
        <motion.div
          className={styles.heroBadge}
          initial={false}
          whileHover={reduceMotion ? undefined : { scale: 1.03 }}
          transition={btnTransition}
        >
          ✦ AI KNOWLEDGE BASE
        </motion.div>

        <h1 className={styles.heroTitle}>
          Learn smarter with
          <br />
          <span className={styles.heroTitleAccent}>AI-powered insights</span>
        </h1>

        <p className={styles.heroSub}>
          Upload your materials. Ask anything. Get structured knowledge.
        </p>

        <div className={styles.heroActions}>
          <motion.button
            className={styles.btnPrimary}
            onClick={() => navigate("/register")}
            whileHover={reduceMotion ? undefined : { y: -1 }}
            whileTap={reduceMotion ? undefined : { scale: 0.98 }}
            transition={btnTransition}
          >
            Get Started — It's Free
          </motion.button>

          <motion.button
            className={styles.btnGhost}
            onClick={() => navigate("/login")}
            whileHover={reduceMotion ? undefined : { y: -1 }}
            whileTap={reduceMotion ? undefined : { scale: 0.98 }}
            transition={btnTransition}
          >
            Log In
          </motion.button>
        </div>

        <div className={styles.cards}>
          {[
            {
              icon: "📄",
              title: "Upload Materials",
              sub: "PDFs, notes, transcripts",
            },
            { icon: "🤖", title: "AI Analyzes", sub: "Structures by topic" },
            { icon: "💡", title: "Get Insights", sub: "Ask, quiz, export" },
          ].map((c, idx) => (
            <React.Fragment key={c.title}>
              <motion.div
                className={styles.card}
                initial={false}
                whileHover={
                  reduceMotion
                    ? undefined
                    : { y: -3, boxShadow: "0 10px 26px rgba(0,0,0,0.12)" }
                }
                whileTap={reduceMotion ? undefined : { scale: 0.99 }}
                transition={btnTransition}
              >
                <div className={styles.cardIcon}>{c.icon}</div>
                <div className={styles.cardText}>
                  <span className={styles.cardTitle}>{c.title}</span>
                  <span className={styles.cardSub}>{c.sub}</span>
                </div>
              </motion.div>

              {idx < 2 ? <div className={styles.cardArrow}>→</div> : null}
            </React.Fragment>
          ))}
        </div>
      </motion.main>

      <footer className={styles.footer}>
        <span>© 2026 Lumina · Privacy Policy · Terms of Service</span>
      </footer>
    </div>
  );
};

export default WelcomePage;
