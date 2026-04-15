import { useNavigate } from "react-router-dom";
import styles from "./HelpCenterPage.module.scss";

const HelpCenterPage = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.titleWrap}>
          <h1 className={styles.title}>Help Center</h1>
          <p className={styles.subtitle}>
            How to write prompts, add good materials, and get consistent
            answers.
          </p>
        </div>

        <button
          type="button"
          className={styles.backBtn}
          onClick={() => navigate("/dashboard")}
        >
          ← Back to Dashboard
        </button>
      </header>

      <main className={styles.content}>
        <section className={styles.card}>
          <h2 className={styles.h2}>1) How Lumina works</h2>
          <p className={styles.p}>
            Lumina answers questions inside the selected Topic and based on the
            Materials you uploaded for that Topic. If your materials don’t
            contain the needed info, Lumina should say there isn’t enough info
            or the question is out of scope.
          </p>

          <div className={styles.callout}>
            <div className={styles.calloutTitle}>Workflow</div>
            <ol className={styles.ol}>
              <li>Create a Topic (e.g., Chemistry).</li>
              <li>Add Materials about that topic.</li>
              <li>
                Ask questions in the chat — answers rely on uploaded data.
              </li>
            </ol>
          </div>
        </section>

        <section className={styles.card}>
          <h2 className={styles.h2}>2) Creating a Topic</h2>
          <div className={styles.grid2}>
            <div>
              <h3 className={styles.h3}>Title</h3>
              <ul className={styles.ul}>
                <li>
                  Keep it short and specific: “Organic Chemistry”, “React
                  Hooks”.
                </li>
                <li>
                  Avoid very broad topics like “Science” or “Programming”.
                </li>
              </ul>
            </div>
            <div>
              <h3 className={styles.h3}>Description</h3>
              <ul className={styles.ul}>
                <li>Write what is included and what is not.</li>
                <li>2–5 sentences is enough.</li>
              </ul>
            </div>
          </div>

          <div className={styles.example}>
            <div className={styles.exampleKicker}>Example</div>
            <div className={styles.exampleRow}>
              <span className={styles.exampleLabel}>Title:</span>
              <span>Chemistry — Acids &amp; Bases</span>
            </div>
            <div className={styles.exampleRow}>
              <span className={styles.exampleLabel}>Description:</span>
              <span>
                Covers Brønsted–Lowry and Lewis theories, pH, buffers, titration
                curves, and common patterns. Does not include organic synthesis
                or physical chemistry.
              </span>
            </div>
          </div>
        </section>

        <section className={styles.card}>
          <h2 className={styles.h2}>
            3) Adding Materials (the most important part)
          </h2>
          <p className={styles.p}>
            Materials should be inside the topic, structured, readable, and have
            enough context.
          </p>

          <div className={styles.grid2}>
            <div className={styles.good}>
              <h3 className={styles.h3}>Good materials</h3>
              <ul className={styles.ul}>
                <li>Lecture notes, textbook chapters, curated articles.</li>
                <li>Definitions + examples + formulas.</li>
                <li>Step-by-step algorithms for solving problems.</li>
                <li>FAQ / typical mistakes.</li>
              </ul>
            </div>

            <div className={styles.bad}>
              <h3 className={styles.h3}>Avoid</h3>
              <ul className={styles.ul}>
                <li>Random fragments without context.</li>
                <li>Mixed topics in one material dump.</li>
                <li>Very short notes that lack explanation.</li>
              </ul>
            </div>
          </div>

          <div className={styles.callout}>
            <div className={styles.calloutTitle}>
              Recommended material structure
            </div>
            <ol className={styles.ol}>
              <li>Terms &amp; definitions</li>
              <li>Key ideas and rules</li>
              <li>Algorithms / steps (if applicable)</li>
              <li>Formulas / tables</li>
              <li>Examples (3–5 minimum)</li>
              <li>Common mistakes</li>
            </ol>
          </div>
        </section>

        <section className={styles.card}>
          <h2 className={styles.h2}>4) Writing prompts (questions) in chat</h2>

          <div className={styles.grid2}>
            <div>
              <h3 className={styles.h3}>Good prompts</h3>
              <ul className={styles.ul}>
                <li>
                  Give context and goal: “explain”, “compare”, “solve”,
                  “summarize”.
                </li>
                <li>Include inputs (numbers, constraints, assumptions).</li>
                <li>Ask for steps, not only final answer.</li>
              </ul>
            </div>

            <div>
              <h3 className={styles.h3}>Bad prompts</h3>
              <ul className={styles.ul}>
                <li>Too broad: “Tell me about chemistry”.</li>
                <li>
                  Out of topic: “Make me a React project” in a chemistry topic.
                </li>
                <li>Opinion-only without data: “What do you think about…”</li>
              </ul>
            </div>
          </div>

          <div className={styles.example}>
            <div className={styles.exampleKicker}>Prompt examples</div>
            <ul className={styles.ul}>
              <li>“Explain Brønsted–Lowry vs Lewis acids. Give 3 examples.”</li>
              <li>“Solve this buffer pH problem and show steps: …”</li>
              <li>“Summarize ‘titration curves’ into 10 bullet points.”</li>
            </ul>
          </div>
        </section>

        <section className={styles.card}>
          <h2 className={styles.h2}>5) Off-topic questions</h2>
          <p className={styles.p}>
            If a question is outside the current Topic or the uploaded Materials
            do not contain the answer, Lumina should reply that it has no
            information for this topic or the question is out of scope.
          </p>

          <div className={styles.callout}>
            <div className={styles.calloutTitle}>Suggested responses</div>
            <ul className={styles.ul}>
              <li>
                “There is no information in the uploaded materials for this
                question.”
              </li>
              <li>
                “This question is outside the scope of the current topic.”
              </li>
            </ul>
          </div>
        </section>

        <section className={styles.card}>
          <h2 className={styles.h2}>6) Best practices</h2>
          <ul className={styles.ul}>
            <li>Prefer narrow topics over “everything in one”.</li>
            <li>Add materials in chunks and test chat after each chunk.</li>
            <li>Ask for steps, formulas, and assumptions.</li>
            <li>If answers are weak — add definitions + examples.</li>
          </ul>
        </section>

        <section className={styles.card}>
          <h2 className={styles.h2}>7) FAQ</h2>

          <div className={styles.faqItem}>
            <div className={styles.faqQ}>Why are answers sometimes off?</div>
            <div className={styles.faqA}>
              Usually because there aren’t enough materials or materials are
              mixed across topics.
            </div>
          </div>

          <div className={styles.faqItem}>
            <div className={styles.faqQ}>
              Can I upload a huge text (100–200 pages)?
            </div>
            <div className={styles.faqA}>
              You can, but it’s better to split into logical parts so you can
              control quality.
            </div>
          </div>

          <div className={styles.faqItem}>
            <div className={styles.faqQ}>How to improve quality quickly?</div>
            <div className={styles.faqA}>
              Add definitions + 3–5 examples + step-by-step solving patterns.
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HelpCenterPage;
