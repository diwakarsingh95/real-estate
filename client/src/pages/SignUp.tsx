import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getErrorMessage } from "../utils/helpers";

const SignUp = () => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      setLoading(false);
      if (!res.ok) {
        setError(data.message);
        return;
      }
      setError("");
      navigate("/sign-in");
    } catch (err) {
      console.error(err);
      setLoading(false);
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          id="username"
          type="text"
          placeholder="Username"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          id="email"
          type="email"
          placeholder="Email"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          id="password"
          type="password"
          placeholder="Password"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>
      </form>
      <div className="flex gap-2 mt-5">
        <p>Have an account?</p>
        <Link to="/sign-in">
          <span className="text-blue-700">Sign in</span>
        </Link>
      </div>
      {error && <p className="text-red-500 mt-5">{error}</p>}
    </div>
  );
};

export default SignUp;
