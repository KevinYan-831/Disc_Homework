import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'

//Import Components
import NavBar from './components/NavBar';
import Home from './components/Home';
import About from './components/About';
import Contact from './components/Contact';
import SignUp from './components/SignUp';

function App() {
  return (
    <Router>
      <div className="app-shell">
        <NavBar title="Pet Your Pet" home="Home" text1="About" text2="Contact" text3="Sign Up/ Log In" />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
