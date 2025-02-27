import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const { registerUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({ name: "", level: "" });
  const navigate = useNavigate();
  const { name, level } = formData;

  // If the user is "Test Student" with level "300", inform them they're exempt from payment.
  useEffect(() => {
    if (
      name.trim().toLowerCase() === "test student" &&
      level.trim() === "300"
    ) {
      toast.info("You are exempt from payment. You will be directed to the dashboard.");
    }
  }, [name, level]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await registerUser(formData);
      toast.dismiss();
      toast.success("Registration successful! Redirecting...");
      navigate("/dashboard");
    } catch (error) {
      toast.dismiss();
      // Check if the error message indicates that the user already exists.
      if (
        error.response &&
        error.response.data &&
        error.response.data.detail &&
        error.response.data.detail.toLowerCase().includes("already exist")
      ) {
        toast.error("User already exists. Please log in instead.");
      } else if (error.response && error.response.data && error.response.data.detail) {
        toast.error(error.response.data.detail);
      } else {
        toast.error("Registration failed. Please try again.");
      }
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
