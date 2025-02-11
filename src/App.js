import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './pages/Login'
import Register from './pages/Register'
import Home from "./pages/Home";
import Navbar from "./components/share/Navbar";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
        </Routes>
        <Navbar />
      </Router>
    </>
  );
}

export default App;
