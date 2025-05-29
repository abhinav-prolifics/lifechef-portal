import { Lock, Mail } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { useAuth } from "../context/AuthContext";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { login, state } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    try {
      await login(email, password);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError("An error occurred during login");
      console.log(err);
    }
  };

  // Redirect if already authenticated
  React.useEffect(() => {
    if (state.isAuthenticated) {
      navigate("/dashboard");
    }
  }, [state.isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-emerald-50 to-teal-100">
      <div className="flex flex-col items-center justify-center px-4 py-2 sm:px-6 lg:px-8 flex-grow">
        <div className="max-w-md w-full space-y-3 flex flex-col justify-center items-center">
          <div className="text-center">
            <div className="flex justify-center">
              <div className="flex items-center justify-center">
                {/*<Leaf className="h-8 w-8 text-white" />*/}
                <img
                  className="h-12 w-21"
                  src="https://www.lifechef.com/assets/frozen/logo-health.svg"
                  alt="LifeChef Health Logo"
                />
              </div>
            </div>
            <div>
              <h2 className="mt-4 text-l font-extrabold text-gray-900">
                Member Improvement Plan
              </h2>
              <p className=" text-sm text-gray-600">Clinician Portal</p>
            </div>
          </div>

          <div className="bg-white py-5 shadow-lg sm:rounded-lg sm:px-4 w-[85%] flex justify-center">
            <div className="w-[300px] ">
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="py-2">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    label="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    icon={<Mail className="h-5 w-5 text-gray-400" />}
                    placeholder="name@lifechef.health"
                    fullWidth
                  />
                </div>

                <div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    label="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    icon={<Lock className="h-5 w-5 text-gray-400" />}
                    placeholder="Enter your password"
                    fullWidth
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="remember-me"
                      className="ml-2 block text-sm text-gray-900"
                    >
                      Remember me
                    </label>
                  </div>

                  <div className="text-sm">
                    <a
                      href="#"
                      className="font-medium text-emerald-600 hover:text-emerald-500"
                    >
                      Forgot your password?
                    </a>
                  </div>
                </div>

                {state.error && (
                  <div className="rounded-md bg-red-50 p-4">
                    <div className="text-sm text-red-700">{state.error}</div>
                  </div>
                )}

                {error && (
                  <div className="rounded-md bg-red-50 p-4">
                    <div className="text-sm text-red-700">{error}</div>
                  </div>
                )}

                <div>
                  <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    isLoading={state.isLoading}
                  >
                    Sign in
                  </Button>
                </div>
              </form>
              <div className="mt-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">
                      Demo Login
                    </span>
                  </div>
                </div>

                <div className="mt-2 flex  gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setEmail("sarah.johnson@lifechef.health");
                      setPassword("password");
                    }}
                    className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-xs font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Dr. Sarah Johnson (Clinician)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEmail("mark.wilson@lifechef.health");
                      setPassword("password");
                    }}
                    className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-xs font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Mark Wilson<br></br> (Care Team)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-white py-1">
        <div className="max-w-7xl mx-auto px-4 overflow-hidden sm:px-6 lg:px-8">
          <p className="text-center text-base text-gray-500">
            &copy; {new Date().getFullYear()} LifeChef Health. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Login;
