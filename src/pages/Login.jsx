import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [formData, setFormData] = useState({ name: "", level: "" });
  const { name, level } = formData;
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
    setErrors((prevErrors) => ({ ...prevErrors, [e.target.id]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!level.trim()) {
      newErrors.level = "Level is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      const credentials = { name, level };
      await loginUser(credentials);

      // Show success toast
      toast.success("Login successful! Redirecting...");

      // Redirect to payment page after successful login.
      navigate("/payment");
    } catch (error) {
      console.error("Login failed:", error);

      // Show error toast
      toast.error("Login failed. Please check your credentials and try again.");

      setErrors({
        form: "Login failed. Please check your credentials and try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 flex justify-center">
      <div className="w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

        <form onSubmit={handleLogin} className="space-y-3">
          <input
            type="text"
            className="w-full max-w-md p-2 border rounded"
            placeholder="Enter your name"
            id="name"
            value={name}
            onChange={onChange}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

          <input
            type="text"
            className="w-full max-w-md p-2 border rounded"
            placeholder="Enter your level"
            id="level"
            value={level}
            onChange={onChange}
          />
          {errors.level && <p className="text-red-500 text-sm">{errors.level}</p>}

          <Link to="/forgot-password" className="text-blue-500 text-sm">
            Forgot Password?
          </Link>
          {errors.form && <p className="text-red-500 text-sm">{errors.form}</p>}

          {/* Login Button (Styled Like Register Button) */}
          <button
            type="submit"
            className="w-full max-w-md bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-4 text-center">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-500">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
