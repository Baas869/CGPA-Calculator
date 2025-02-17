import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const { registerUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({ name: '', level: '' });
  const navigate = useNavigate();

  const { name, level } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await registerUser(formData);
      // After successful registration and automatic login, navigate to the dashboard.
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration failed:', error);
      // Optionally, display error feedback to the user.
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          className="nameInput mb-2 p-2 border rounded w-full"
          placeholder="Name"
          id="name"
          value={name}
          onChange={onChange}
        />
        <input
          type="number"
          className="emailInput mb-2 p-2 border rounded w-full"
          placeholder="Enter your level"
          id="level"
          value={level}
          onChange={onChange}
        />
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
        >
          Register
        </button>
      </form>
      <p className="mt-4">
        Already have an account?{' '}
        <Link to="/login" className="text-green-500">
          Login here
        </Link>
      </p>
    </div>
  );
};

export default Register;
