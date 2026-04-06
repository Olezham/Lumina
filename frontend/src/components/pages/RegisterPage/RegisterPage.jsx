import styles from "./RegisterPage.module.scss";
import RegisterForm from "./RegisterForm/RegisterForm";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.registerPage}>
      <h2 onClick={() => navigate("/")} className={styles.logo}>
        Lumina
      </h2>
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;
