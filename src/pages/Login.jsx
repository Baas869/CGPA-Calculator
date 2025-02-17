import { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg';

const Login = () => {
  const [formData, setFormData] = useState({ name: '', level: '' });
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
    setErrors((prevErrors) => ({ ...prevErrors, [e.target.id]: '' }));
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
      // Build the credentials object as expected by your API.
      const credentials = { name, level };
      await loginUser(credentials);
      // After successful login, navigate to the payment page.
      navigate("/payment");
    } catch (error) {
      console.error("Login failed:", error);
      setErrors({ form: "Login failed. Please check your credentials and try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          className="emailInput mb-2 p-2 border rounded w-full"
          placeholder="Enter your name to login"
          id="name"
          value={name}
          onChange={onChange}
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        <input
          type="text"
          className="emailInput mb-2 p-2 border rounded w-full"
          placeholder="Enter your level"
          id="level"
          value={level}
          onChange={onChange}
        />
        {errors.level && <p className="text-red-500 text-sm">{errors.level}</p>}
        <Link to="/forgot-password" className="forgotPasswordLink">
          Forgot Password
        </Link>
        {errors.form && <p className="text-red-500 text-sm mt-2">{errors.form}</p>}
        <div className="signInBar flex items-center mt-4">
          <p className="signInText mr-4">Login</p>
          <button
            type="submit"
            className="signInButton flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            disabled={loading}
          >
            {loading ? "Logging in..." : <ArrowRightIcon fill="#ffffff" width="34px" height="34px" />}
          </button>
        </div>
      </form>
      <p className="mt-4">
        Don't have an account?{" "}
        <Link to="/register" className="text-blue-500">
          Register here
        </Link>
      </p>
    </div>
  );
};

export default Login;
