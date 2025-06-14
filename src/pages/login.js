import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { auth } from "../lib/firebase-config";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { useRouter } from "next/router";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, form.email, form.password);
      alert("Login successful!");
      router.push("/home");
    } catch (err) {
      alert("Login failed: " + err.message);
    }
  };

  const handleForgotPassword = async () => {
    if (!form.email) {
      alert("Please enter your email to reset password.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, form.email);
      alert("Password reset email sent! Check your inbox.");
    } catch (err) {
      alert("Error sending reset email: " + err.message);
    }
  };

  return (
    <>
      <Head>
        <title>Login | Bus Scheduler</title>
      </Head>

      <main className="login-page">
        <div className="login-card">
          <div className="login-header">
            <img src="/bus-icon.png" alt="Bus Icon" className="bus-icon" />
            <h2>Bus Scheduler Login</h2>
            <p>Track your route. Ride smarter.</p>
          </div>

          <form className="login-form" onSubmit={handleLogin}>
            <label>Email Address</label>
            <input type="email" name="email" placeholder="you@example.com" onChange={handleChange} required />

            <label>Password</label>
            <input type="password" name="password" placeholder="••••••••" onChange={handleChange} required />

            <p className="forgot-link">
              <a href="#" onClick={handleForgotPassword}>Forgot Password?</a>
            </p>

            <button type="submit">Login</button>
          </form>

          <p className="bottom-link">
            Don’t have an account? <Link href="/signup">Sign up here</Link>
          </p>
        </div>

        <style jsx>{`
          .login-page {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            background: #f3e8ff;
            font-family: 'Poppins', sans-serif;
            background-image: url('/bus-background-pattern.svg');
            background-repeat: no-repeat;
            background-position: right bottom;
            background-size: 400px;
          }

          .login-card {
            background: #ffffff;
            padding: 3rem 2.5rem;
            border-radius: 20px;
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
            max-width: 400px;
            width: 100%;
          }

          .login-header {
            text-align: center;
            margin-bottom: 2rem;
          }

          .bus-icon {
            width: 60px;
            margin-bottom: 0.5rem;
          }

          h2 {
            color: #0f172a;
            margin: 0;
            font-size: 1.8rem;
          }

          .login-header p {
            color: #475569;
            font-size: 0.95rem;
          }

          .login-form label {
            font-weight: 500;
            margin-bottom: 0.25rem;
            display: block;
            color: #1e293b;
          }

          .login-form input {
            width: 100%;
            padding: 0.75rem;
            margin-bottom: 1rem;
            border-radius: 8px;
            border: 1px solid #cbd5e1;
            font-size: 1rem;
            background-color: #f8fafc;
          }

          .login-form input:focus {
            outline: none;
            border-color: #facc15;
            box-shadow: 0 0 0 2px rgba(234, 179, 8, 0.3);
          }

          .forgot-link {
            text-align: right;
            margin-bottom: 1.5rem;
            font-size: 0.85rem;
          }

          .forgot-link a {
            color: #9333ea;
            text-decoration: none;
          }

          .forgot-link a:hover {
            text-decoration: underline;
          }

          button {
            width: 100%;
            background: #9400D3;
            border: none;
            padding: 0.75rem;
            font-weight: 600;
            font-size: 1rem;
            color: #ffffff;
            border-radius: 8px;
            cursor: pointer;
          }

          button:hover {
            background: #000000;
          }

          .bottom-link {
            text-align: center;
            margin-top: 1rem;
            font-size: 0.9rem;
            color: #475569;
          }

          .bottom-link a {
            color: #0f766e;
            text-decoration: none;
          }

          .bottom-link a:hover {
            text-decoration: underline;
          }
        `}</style>
      </main>
    </>
  );
}
