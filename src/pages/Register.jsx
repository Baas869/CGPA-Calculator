import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const { registerUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({ name: "", level: "" });
  
  const navigate = useNavigate();

  const { name, level } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await registerUser(formData);

      // Show success toast
      toast.success("Registration successful! Redirecting...");

      // Redirect to dashboard after successful registration
      navigate("/dashboard");
    } catch (error) {
      console.error("Registration failed:", error);

      // Show error toast
      toast.error("Registration failed. Please try again.");
    }
  };

  return (
    <div className="container mx-auto p-4 flex justify-center">
      <div className="w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>

        <form onSubmit={handleRegister} className="space-y-3">
          <input
            type="text"
            className="w-full max-w-md p-2 border rounded"
            placeholder="Name"
            id="name"
            value={name}
            onChange={onChange}
          />

          <input
            type="number"
            className="w-full max-w-md p-2 border rounded"
            placeholder="Enter your level"
            id="level"
            value={level}
            onChange={onChange}
          />

          <button
            type="submit"
            className="w-full max-w-md bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
          >
            Register
          </button>
        </form>

        <p className="mt-4 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-green-500">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
