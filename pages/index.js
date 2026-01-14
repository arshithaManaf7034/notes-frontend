import { useState } from "react";
import { useRouter } from "next/router";
import { apiRequest } from "../lib/api";

export default function AuthPage() {
  const [mode, setMode] = useState("login"); // login | register
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  async function submit() {
    try {
      if (mode === "register") {
        await apiRequest("/auth/register", "POST", { email, password });
        alert("Registered successfully. Please login.");
        setMode("login");
        return;
      }

      const res = await apiRequest("/auth/login", "POST", { email, password });
      localStorage.setItem("token", res.access_token);
      router.push("/notes");
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-layout">
        
        {/* LEFT TEXT SECTION */}
        <div className="auth-left">
          <h1>
            Your Ideas.<br />
            Your Canvas.
          </h1>
          <p>
            Effortlessly capture, organize,<br />
            and create.
          </p>
        </div>

        {/* RIGHT AUTH CARD */}
        <div className="auth-card">
          <div className="auth-tabs">
            <button
              className={`auth-tab ${mode === "login" ? "active" : ""}`}
              onClick={() => setMode("login")}
            >
              SIGN IN
            </button>

            <button
              className={`auth-tab ${mode === "register" ? "active" : ""}`}
              onClick={() => setMode("register")}
            >
              REGISTER NOW
            </button>
          </div>

          <div className="auth-body">
            <input
              placeholder="Email ID"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button onClick={submit}>
              {mode === "login" ? "SIGN IN" : "REGISTER"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
