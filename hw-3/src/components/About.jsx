import React from 'react';

function About() {
  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-body">
          <h1 className="card-title">About Pet Your Pet</h1>
          <div className="row mt-4">
            <div className="col-md-12">
              <h3>Welcome to Pet Your Pet! 🐱</h3>
              <p>
                This is a fun and interactive application where you create customized profile for your own cute pet
              </p>
              <h4 className="mt-4">Features:</h4>
              <ul>
                <li>Interactive pet petting experience</li>
                <li>Join nearby pet communities and find friends for your pet</li>
                <li>Make friends</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
