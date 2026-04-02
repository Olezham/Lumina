import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./WelcomePage.module.scss";

export default function WelcomePage() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      {/* NAVBAR */}
      <header className={styles.navbar}>
        <div className={styles.logo}>
          <span className={styles.logoTitle}>Lumina</span>
          {/* <span className={styles.logoSub}>AI KNOWLEDGE BASE</span> */}
        </div>
        <div className={styles.navActions}>
          <button
            className={styles.btnGhost}
            onClick={() => navigate("/login")}
          >
            Log In
          </button>
          <button
            className={styles.btnPrimary}
            onClick={() => navigate("/register")}
          >
            Get Started →
          </button>
        </div>
      </header>

      {/* HERO */}
      <main className={styles.hero}>
        <div className={styles.heroBadge}>✦ AI KNOWLEDGE BASE</div>
        <h1 className={styles.heroTitle}>
          Learn smarter with
          <br />
          <span className={styles.heroTitleAccent}>AI-powered insights</span>
        </h1>
        <p className={styles.heroSub}>
          Upload your materials. Ask anything. Get structured knowledge.
        </p>
        <div className={styles.heroActions}>
          <button
            className={styles.btnPrimary}
            onClick={() => navigate("/register")}
          >
            Get Started — It's Free
          </button>
          <button
            className={styles.btnGhost}
            onClick={() => navigate("/login")}
          >
            Log In
          </button>
        </div>

        {/* CARDS ROW */}
        <div className={styles.cards}>
          <div className={styles.card}>
            <div className={styles.cardIcon}>📄</div>
            <div className={styles.cardText}>
              <span className={styles.cardTitle}>Upload Materials</span>
              <span className={styles.cardSub}>PDFs, notes, transcripts</span>
            </div>
          </div>
          <div className={styles.cardArrow}>→</div>
          <div className={styles.card}>
            <div className={styles.cardIcon}>🤖</div>
            <div className={styles.cardText}>
              <span className={styles.cardTitle}>AI Analyzes</span>
              <span className={styles.cardSub}>Structures by topic</span>
            </div>
          </div>
          <div className={styles.cardArrow}>→</div>
          <div className={styles.card}>
            <div className={styles.cardIcon}>💡</div>
            <div className={styles.cardText}>
              <span className={styles.cardTitle}>Get Insights</span>
              <span className={styles.cardSub}>Ask, quiz, export</span>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <span>© 2026 Lumina · Privacy Policy · Terms of Service</span>
      </footer>
    </div>
  );
}
