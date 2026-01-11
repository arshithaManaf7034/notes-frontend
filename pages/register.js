import { useState } from "react";
import { useRouter } from "next/router";
import { apiRequest } from "../lib/api";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  async function register() {
    try {
      await apiRequest("/auth/register", "POST", {
        email,
        password,
      });
      alert("Registration successful! Please login.");
      router.push("/");
    } catch (err) {
      alert(err.message);
    }
  }

  return (
   <div className="auth-container">
  <div className="form-card">
    <h1>Register</h1>

    <input
      placeholder="Email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
    />

    <input
      type="password"
      placeholder="Password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
    />

    <button onClick={register}>Register</button>

    <p>
      Already have an account? <a href="/">Login</a>
    </p>
  </div>
</div>

  );
}
