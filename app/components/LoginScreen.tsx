"use client";

import { useState, useEffect } from "react";
import { useSocket } from "../context/SocketContext";

export default function LoginScreen() {
  const { login, authError } = useSocket();
  const [inputUsername, setInputUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (authError) {
      setError(authError);
    }
  }, [authError]);

  const handleLogin = async () => {
    if (!inputUsername.trim()) {
      setError("Username is required");
      return;
    }

    setIsLoading(true);

    try {
      const success = await login(inputUsername, password);

      if (!success && !authError) {
        setError("Authentication failed");
      }
    } catch (err) {
      setError("Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Real-Time Chat Application
          </h1>
        </div>

        <div className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={inputUsername}
                onChange={(e) => setInputUsername(e.target.value)}
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your username"
              />
            </div>

            <div>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your password"
              />
            </div>

            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          </div>

          <div>
            <button
              onClick={handleLogin}
              disabled={isLoading}
              className={`w-full px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
