import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function ResetPassword() {
  const { uid, token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/accounts/reset-password/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uid: uid,
            token: token,
            new_password: password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Password reset successfully!");

        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        setMessage(data.error || "Password reset failed.");
      }
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
            Create a new password
          </h1>

          <p style={styles.description}>
            Choose a new password to secure your BSCS Portal
            account and continue your academic journey.
          </p>
        </div>

        <p style={styles.footer}>
          Government Boys Post Graduate College
        </p>
      </div>

      <div style={styles.rightPanel}>
        <div style={styles.card}>
          <div style={styles.icon}>🔑</div>

          <h2 style={styles.heading}>
            Reset Password
          </h2>

          <p style={styles.subtitle}>
            Enter your new password below.
          </p>

          <form onSubmit={handleReset}>
            <label style={styles.label}>
              New Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your new password"
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
              {loading ? "Resetting..." : "Reset Password"}
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

export default ResetPassword;