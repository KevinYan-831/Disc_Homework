import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuth } from '../context/AuthContext';



function NavBar({title, home, text1, text2, text3}) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

   return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">{title}</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link active" aria-current="page" to="/">{home}</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/about">{text1}</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contact">{text2}</Link>
            </li>
            {!user && (
              <li className="nav-item">
                <Link className="nav-link" to="/login">{text3}</Link>
              </li>
            )}
          </ul>
          {user && (
            <div className="d-flex align-items-center">
              <span className="me-3">
                Welcome, {user.email}
              </span>
              <button
                className="btn btn-outline-danger"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default NavBar