import styles from "./RegisterForm.module.scss";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { registerUser } from "@/api/auth";
import axios from "axios";

const RegisterForm = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const register = useAuthStore((state) => state.register);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (credentials.password !== credentials.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await registerUser({
        email: credentials.email,
        password: credentials.password,
      });
      const { user, token } = response;
      register(user, token);
      console.log("Registration successful!");
      navigate("/dashboard");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          const errorMessage =
            error.response.data.detail || "Registration failed";
          alert(errorMessage);
        } else {
          console.log(
            "No response from server. Check your network or server status.",
          );
        }
      } else {
        console.error("Non-Axios error:", error);
        console.log("An unexpected error occurred");
      }
    }
  };

  return (
    <div className={styles.formContainerRegister}>
      <div className={styles.formCardRegister}>
        <h2 className={styles.formTitleRegister}>Create an account</h2>
        <p className={styles.formPregister}>
          Enter your email below to create account
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            className={styles.inputEmailRegister}
            value={credentials.email}
            onChange={(e) =>
              setCredentials({ ...credentials, email: e.target.value })
            }
          />
          <input
            type="password"
            placeholder="Create your password"
            className={styles.inputPasswordRegister}
            value={credentials.password}
            onChange={(e) =>
              setCredentials({ ...credentials, password: e.target.value })
            }
          />
          <input
            type="password"
            placeholder="Confirm your password"
            className={styles.inputPasswordRegisterConfirm}
            value={credentials.confirmPassword}
            onChange={(e) =>
              setCredentials({
                ...credentials,
                confirmPassword: e.target.value,
              })
            }
          />
          <button type="submit" className={styles.signUpButton}>
            SIGN UP
          </button>
        </form>
        <p className={styles.loginText}>
          Already have an account?{" "}
          <span className={styles.loginLink} onClick={() => navigate("/login")}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
