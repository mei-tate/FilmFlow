import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSignup } from "../hooks/useSignup";
import { useAuthContext } from "../hooks/useAuthContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Signup.css";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 👁️ NEW: toggle password visibility
  const [showPassword, setShowPassword] = useState(false);

  // password generator UI state
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [genError, setGenError] = useState(null);

  const { signup, error, isLoading } = useSignup();
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signup(email, password);
  };

  useEffect(() => {
    if (user) {
      navigate("/profile");
    }
  }, [user, navigate]);

  const generatePassword = async () => {
    setLoadingPassword(true);
    setGenError(null);

    try {
      const res = await fetch("http://localhost:4000/api/password/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          length: 16,
          includeUppercase: true,
          includeLowercase: true,
          includeNumbers: true,
          includeSymbols: true,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate password");
      }

      setPassword(data.password);
    } catch (err) {
      setGenError(err.message);
    } finally {
      setLoadingPassword(false);
    }
  };

  return (
    <form className="signup" onSubmit={handleSubmit}>
      <h3>Sign Up</h3>

      <label>Email address:</label>
      <input
        type="email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
      />

      <label>Password:</label>
      <div className="password-input-wrapper">
        <input
          type={showPassword ? "text" : "password"}
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          className="password-input"
        />

        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="toggle-password-btn"
          aria-label="Toggle password visibility"
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>

      {/* 🔐 PASSWORD GENERATOR SECTION */}
      <div className="password-generator">
        <button
          type="button"
          onClick={generatePassword}
          disabled={loadingPassword}
        >
          {loadingPassword ? "Generating..." : "Generate Strong Password"}
        </button>

        {genError && <div className="error">{genError}</div>}
      </div>

      <button disabled={isLoading} type="submit">
        Sign up
      </button>

      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default Signup;