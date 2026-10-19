import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import banner from "../assets/banner.png";
import logo from "../assets/logo.png";

function Account() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const { loginUser, registerUser } = useAuth();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Clear form when switching between Login/Register
  const handleModeChange = (newMode) => {
    setMode(newMode);

    setForm({
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      password: "",
    });
  };


  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      if (mode === "login") {
        const success = await loginUser(form.email, form.password);
        if(success) {
          navigate("/");
        }

      } else {
        const success = await registerUser(form);

        if(success) {

          setForm({
          firstName: "",
          lastName: "",
          phone: "",
          email: "",
          password: "",
        });

          setMode("login");
        }

      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <header
        className="flex flex-col items-center justify-center bg-cover bg-center h-80"
        style={{ backgroundImage: `url(${banner})` }}
      >
        <img src={logo} alt="Logo" />

        <h2 className="text-5xl font-medium -translate-y-2">
          Account
        </h2>

        <p>
          <Link to="/" className="font-medium">
            Home
          </Link>{" "}
          ❯ Account
        </p>
      </header>

      <main className="my-15">

        {/* ================= LOGIN ================= */}
        {mode === "login" && (
          <div className="w-[75%] md:w-[40%] mx-auto">
            <form
              className="flex flex-col gap-5"
              onSubmit={handleSubmit}
            >
              <h2 className="text-4xl font-medium mb-5">
                Log In
              </h2>

              <div>
                <label htmlFor="email">
                  Email address
                </label>

                <input
                  className="border border-secondary-text p-3 w-full my-4 rounded"
                  type="email"
                  required
                  name="email"
                  id="email"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="password">
                  Password
                </label>

                <input
                  className="border border-secondary-text p-3 w-full my-4 rounded"
                  type="password"
                  required
                  name="password"
                  id="password"
                  value={form.password}
                  onChange={handleChange}
                />
              </div>

              <div>
                <button
                  className="border rounded-md p-3 w-50 mr-6 cursor-pointer disabled:opacity-50"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Log In"}
                </button>

                {/* <Link to="/forgot-password">
                  Lost your password?
                </Link> */}
              </div>
            </form>

            {/* Switch to Register */}
            <p className="mt-8">
              Don't have an account?{" "}
              <button
                type="button"
                className="font-medium cursor-pointer"
                onClick={() => handleModeChange("register")}
              >
                Register
              </button>
            </p>
          </div>
        )}

        {/* ================= REGISTER ================= */}
        {mode === "register" && (
          <div className="w-[75%] md:ww-[40%] mx-auto">
            <form
              className="flex flex-col gap-5"
              onSubmit={handleSubmit}
            >
              <h2 className="text-4xl font-medium mb-5">
                Register
              </h2>

              <div className="flex gap-3">
                <div className="flex-1">
                  <label htmlFor="firstName">
                    First Name
                  </label>

                  <input
                    className="border border-secondary-text p-3 w-full my-4 rounded"
                    type="text"
                    required
                    name="firstName"
                    id="firstName"
                    placeholder="John"
                    value={form.firstName}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex-1">
                  <label htmlFor="lastName">
                    Last Name
                  </label>

                  <input
                    className="border border-secondary-text p-3 w-full my-4 rounded"
                    type="text"
                    required
                    name="lastName"
                    id="lastName"
                    placeholder="Doe"
                    value={form.lastName}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="register-email">
                  Email address
                </label>

                <input
                  className="border border-secondary-text p-3 w-full my-4 rounded"
                  type="email"
                  required
                  name="email"
                  id="register-email"
                  placeholder="abc@def.com"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="phone">
                  Phone number
                </label>

                <input
                  className="border border-secondary-text p-3 w-full my-4 rounded"
                  type="tel"
                  required
                  name="phone"
                  id="phone"
                  placeholder="+1234567890"
                  value={form.phone}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="register-password">
                  Password
                </label>

                <input
                  className="border border-secondary-text p-3 w-full my-4 rounded"
                  type="password"
                  required
                  name="password"
                  id="register-password"
                  value={form.password}
                  onChange={handleChange}
                />
              </div>

              <p className="text-justify">
                Your personal data will be used to support your
                experience throughout this website, to manage
                access to your account and other purposes
                described in our{" "}
                <Link
                  to="/privacy-policy"
                  className="font-medium"
                >
                  privacy policy
                </Link>
                .
              </p>

              <button
                className="border rounded-md p-3 w-50 cursor-pointer disabled:opacity-50"
                type="submit"
                disabled={loading}
              >
                {loading ? "Registering..." : "Register"}
              </button>
            </form>

            {/* Switch to Login */}
            <p className="mt-8">
              Already have an account?{" "}
              <button
                type="button"
                className="font-medium cursor-pointer"
                onClick={() => handleModeChange("login")}
              >
                Login
              </button>
            </p>
          </div>
        )}
      </main>
    </>
  );
}

export default Account;