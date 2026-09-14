import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/accounts/forgot-password/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username,
          }),
        }
      );

      const data = await response.json();

      setMessage(
        data.message || data.error || "Request completed."
      );
    } catch (error) {
      console.error(error);
      setMessage("Could not connect to Django server.");
    }

    setLoading(false);
  };

  return (
    <div style={styles.page}>
      <div style={styles.leftPanel}>
        <div>
          <div style={styles.logo}>BSCS</div>

          <h1 style={styles.title}>
            Reset your password
          </h1>

          <p style={styles.description}>
            Don't worry. Enter your username and we'll help you
            get back into your academic portal.
          </p>
        </div>

        <p style={styles.footer}>
          Government Boys Post Graduate College
        </p>
      </div>

      <div style={styles.rightPanel}>
        <div style={styles.card}>
          <div style={styles.icon}>🔐</div>

          <h2 style={styles.heading}>
            Forgot Password?
          </h2>

          <p style={styles.subtitle}>
            Enter your username to request a password reset.
          </p>

          <form onSubmit={handleForgotPassword}>
            <label style={styles.label}>
              Username
            </label>

            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              style={styles.input}
              required
            />

            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.button,
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? "Please wait..." : "Request Reset"}
            </button>
          </form>

          {message && (
            <div style={styles.message}>
              {message}
            </div>
          )}

          <button
            type="button"
            onClick={() => navigate("/login")}
            style={styles.backButton}
          >
            ← Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    fontFamily: "Arial, sans-serif",
    background: "#f5f7fa",
  },

  leftPanel: {
    width: "45%",
    minHeight: "100vh",
    background: "#fe0000",
    color: "white",
    padding: "60px",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },

  logo: {
    width: "70px",
    height: "70px",
    borderRadius: "18px",
    background: "white",
    color: "#fe0000",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: "20px",
    marginBottom: "50px",
  },

  title: {
    fontSize: "42px",
    lineHeight: "1.15",
    marginBottom: "20px",
  },

  description: {
    fontSize: "18px",
    lineHeight: "1.7",
    maxWidth: "500px",
    opacity: 0.9,
  },

  footer: {
    fontSize: "14px",
    opacity: 0.8,
  },

  rightPanel: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "30px",
  },

  card: {
    width: "100%",
    maxWidth: "420px",
    background: "white",
    padding: "45px",
    borderRadius: "22px",
    boxShadow: "0 15px 45px rgba(0,0,0,0.08)",
    boxSizing: "border-box",
  },

  icon: {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    background: "#fff1f1",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "28px",
    marginBottom: "20px",
  },

  heading: {
    fontSize: "30px",
    margin: "0 0 8px 0",
    color: "#202124",
  },

  subtitle: {
    color: "#6b7280",
    lineHeight: "1.6",
    marginBottom: "30px",
  },

  label: {
    display: "block",
    fontSize: "14px",
    fontWeight: "600",
    color: "#374151",
    marginBottom: "8px",
  },

  input: {
    width: "100%",
    padding: "14px 15px",
    border: "1px solid #dfe3e8",
    borderRadius: "10px",
    fontSize: "15px",
    marginBottom: "20px",
    boxSizing: "border-box",
    outline: "none",
  },

  button: {
    width: "100%",
    padding: "14px",
    border: "none",
    borderRadius: "10px",
    background: "#fe0000",
    color: "white",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
  },

  message: {
    marginTop: "18px",
    padding: "12px",
    borderRadius: "10px",
    background: "#f5f7fa",
    color: "#555",
    fontSize: "14px",
    lineHeight: "1.5",
    textAlign: "center",
  },

  backButton: {
    width: "100%",
    marginTop: "18px",
    padding: "10px",
    border: "none",
    background: "transparent",
    color: "#fe0000",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  },
};

export default ForgotPassword;