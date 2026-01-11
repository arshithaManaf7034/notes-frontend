import { useState } from "react";
import { useRouter } from "next/router";
import { apiRequest } from "../lib/api";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function register(e) {
    e.preventDefault(); 
    console.log("REGISTER CLICKED");

    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const res = await apiRequest("/auth/register", "POST", {
        email,
        password,
      });

      console.log("REGISTER RESPONSE:", res);

      alert("Registration successful! Please login.");
      router.push("/");
    } catch (err) {
      console.error("REGISTER ERROR:", err);
      alert(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-container">
      <div className="form-card">
        <h1>Register</h1>

        <form onSubmit={register}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p>
          Already have an account? <a href="/">Login</a>
        </p>
      </div>
    </div>
  );
}
