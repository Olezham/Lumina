import LoginForm from "./LoginForm/LoginForm";
import styles from "./LoginPage.module.scss";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.loginPage}>
      <h2 onClick={() => navigate("/")} className={styles.logo}>
        Lumina
      </h2>
      <LoginForm />
    </div>
  );
};

export default LoginPage;
