import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';


function NavBar({title, home, text1, text2, text3}) {
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">{title}</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link active" aria-current="page" to="/">{home}</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/about">{text1}</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contact">{text2}</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/signup">{text3}</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default NavBar