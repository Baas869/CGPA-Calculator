import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const { registerUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({ name: '', number: '' });
  const navigate = useNavigate();

  const { name, number } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await registerUser(formData);
      // After successful registration and automatic login, navigate to payment or dashboard
      navigate('/payment');
    } catch (error) {
      console.error('Registration failed:', error);
      // Optionally, display error feedback to the user
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
          id="number"
          value={number}
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















// import { useContext, useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { AuthContext } from '../App';

// const Register = () => {
//   const { setUser } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     name: '',
//     number: '',
//   })
//   const { name, number } = formData

//   const handleRegister = () => {
//     // Simulate successful registration by setting a user object
//     setUser({ name: "New User" });
//     // Redirect to Payment page so the user can complete payment
//     navigate("/payment");
//   };

//   const onChange = (e) => {
//     setFormData((prevState) => ({
//       ...prevState,
//       [e.target.id]: e.target.value,
//     }))
//   }

//   const onSubmit = async (e) => {
//     e.preventDefault()
 
//   }

//   return (
//     <div className="container mx-auto p-4">
//       <h2 className="text-2xl font-bold mb-4">Register</h2>
//       {/* Your registration form elements go here */}
//         <form onSubmit={onSubmit}>
//             <input
//               type='text'
//               className='nameInput'
//               placeholder='Name'
//               id='name'
//               value={name}
//               onChange={onChange}
//             />
//             <input
//               type='number'
//               className='emailInput'
//               placeholder='Enter your level'
//               id='number'
//               value={number}
//               onChange={onChange}
//             />
//             <button 
//               onClick={handleRegister}
//               className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
//             >
//               Register
//             </button>
//             <p className="mt-4">
//               Already have an account? <Link to="/login" className="text-green-500">Login here</Link>
//             </p>
//         </form>
//     </div>
    
//   );
// };

// export default Register;