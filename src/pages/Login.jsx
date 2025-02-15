import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../App';
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg'
import visibilityIcon from '../assets/svg/visibilityIcon.svg'


const Login = () => {

  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const { email, password } = formData
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();


    const onChange = (e) => {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: e.target.value,
      }))
    }

  const handleLogin = () => {
    // Simulate successful login by setting a user object
    setUser({ name: "John Doe" });
    // Redirect to Payment page so the user can complete payment
    navigate("/payment");
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      {/* Your login form elements go here */}
      <form>
          <input
            type='email'
            className='emailInput'
            placeholder='Email'
            id='email'
            value={email}
            onChange={onChange}
          />

          <div className='passwordInputDiv'>
            <input
              type={showPassword ? 'text' : 'password'}
              className='passwordInput'
              placeholder='Password'
              id='password'
              value={password}
              onChange={onChange}
            />

            <img
              src={visibilityIcon}
              alt='show password'
              className='showPassword'
              onClick={() => setShowPassword((prevState) => !prevState)}
            />
          </div>

          <Link to='/forgot-password' className='forgotPasswordLink'>
            Forgot Password
          </Link>

          <div className='signInBar'>
            <p className='signInText'>Login</p>
            <button onClick={handleLogin} className='signInButton'>
              <ArrowRightIcon fill='#ffffff' width='34px' height='34px' />
            </button>
            <p className="mt-4">
             Don't have an account? <Link to="/register" className="text-blue-500">Register here</Link>
            </p>
          </div>
        </form>


      {/* <button 
        onClick={handleLogin}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
      >
        Login
      </button> */}
      {/* <p className="mt-4">
        Don't have an account? <Link to="/register" className="text-blue-500">Register here</Link>
      </p> */}
    </div>
  );
};

export default Login;














// import { useState } from 'react'
// // import { toast } from 'react-toastify'
// import { Link} from 'react-router-dom'
// // import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
// // import OAuth from '../components/OAuth'
// import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg'
// import visibilityIcon from '../assets/svg/visibilityIcon.svg'

// function Login() {

  // const [showPassword, setShowPassword] = useState(false)
  // const [formData, setFormData] = useState({
  //   email: '',
  //   password: '',
  // })
  // const { email, password } = formData

//   // const navigate = useNavigate()

  // const onChange = (e) => {
  //   setFormData((prevState) => ({
  //     ...prevState,
  //     [e.target.id]: e.target.value,
  //   }))
  // }

//   const onSubmit = async (e) => {
//     e.preventDefault()

//     // try {
//     //   const auth = getAuth()

//     //   const userCredential = await signInWithEmailAndPassword(
//     //     auth,
//     //     email,
//     //     password
//     //   )

//     //   if (userCredential.user) {
//     //     navigate('/')
//     //   }
//     // } catch (error) {
//     //   toast.error('Bad User Credentials')
//     // }
//   }

//   return (
//     <>
//       <div className='pageContainer'>
//         <header>
//           <p className='pageHeader'>Welcome Back!</p>
//         </header>

        // <form onSubmit={onSubmit}>
        //   <input
        //     type='email'
        //     className='emailInput'
        //     placeholder='Email'
        //     id='email'
        //     value={email}
        //     onChange={onChange}
        //   />

        //   <div className='passwordInputDiv'>
        //     <input
        //       type={showPassword ? 'text' : 'password'}
        //       className='passwordInput'
        //       placeholder='Password'
        //       id='password'
        //       value={password}
        //       onChange={onChange}
        //     />

        //     <img
        //       src={visibilityIcon}
        //       alt='show password'
        //       className='showPassword'
        //       onClick={() => setShowPassword((prevState) => !prevState)}
        //     />
        //   </div>

        //   <Link to='/forgot-password' className='forgotPasswordLink'>
        //     Forgot Password
        //   </Link>

        //   <div className='signInBar'>
        //     <p className='signInText'>Sign In</p>
        //     <button className='signInButton'>
        //       <ArrowRightIcon fill='#ffffff' width='34px' height='34px' />
        //     </button>
        //   </div>
        // </form>

//         {/* <OAuth /> */}

//         <Link to='/register' className='registerLink'>
//           Sign Up Instead
//         </Link>
//       </div>
//     </>
//   )
// }

// export default Login