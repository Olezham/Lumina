import LoginForm from "./LoginForm/LoginForm";
import styles from "./LoginPage.module.scss";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";

const pageMotion = {
  initial: { opacity: 0, y: 14, filter: "blur(6px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -10, filter: "blur(6px)" },
};

const LoginPage = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      className={styles.loginPage}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageMotion}
      transition={{ duration: 0.22, ease: "easeOut" }}
    >
      <h2 onClick={() => navigate("/")} className={styles.logo}>
        Lumina
      </h2>
      <LoginForm />
    </motion.div>
  );
};

export default LoginPage;
