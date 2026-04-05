import styles from "./LoginForm.module.scss";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { loginUser } from "@/api/auth";
import axios from "axios";

const LoginForm = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser({
        email: credentials.email,
        password: credentials.password,
      });
      const { user, token } = response;
      login(user, token);
      console.log("Login successful!");
      navigate("/dashboard");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          const errorMessage =
            error.response.data.detail ||
            `Error ${error.response.status}: ${error.response.statusText}`;
          console.log(errorMessage);
        } else {
          alert(
            "No response from server. Check your network or server status.",
          );
        }
      } else {
        console.error("Non-Axios error:", error);
        alert("An unexpected error occurred");
      }
    }
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.formCard}>
        <h2 className={styles.formTitle}>Login to your account</h2>
        <p className={styles.formP}>Enter your email and password</p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            className={styles.inputEmail}
            value={credentials.email}
            onChange={(e) =>
              setCredentials({ ...credentials, email: e.target.value })
            }
          />
          <input
            type="password"
            placeholder="Enter your password"
            className={styles.inputPassword}
            value={credentials.password}
            onChange={(e) =>
              setCredentials({ ...credentials, password: e.target.value })
            }
          />
          <a href="/" className={styles.forgotPassword}>
            Forget password?
          </a>
          <button className={styles.loginButton}>LOGIN</button>
        </form>
        <p className={styles.signupText}>
          Don't have an account?{" "}
          <span
            className={styles.signupLink}
            onClick={() => navigate("/register")}
          >
            Signup
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
