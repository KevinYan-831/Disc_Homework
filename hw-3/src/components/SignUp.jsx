import React from 'react';

function SignUp() {
  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h1 className="card-title text-center">Sign Up / Log In</h1>
              <p className="text-center text-muted mb-4">
                Create an account to save your pet progress!
              </p>

              <form>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">Username</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    id="username" 
                    placeholder="Enter username" 
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input 
                    type="email" 
                    className="form-control" 
                    id="email" 
                    placeholder="Enter email" 
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input 
                    type="password" 
                    className="form-control" 
                    id="password" 
                    placeholder="Enter password" 
                  />
                </div>

                <button type="submit" className="btn btn-primary w-100 mb-3">
                  Sign Up
                </button>
              </form>

              <div className="text-center">
                <p className="mb-0">
                  Already have an account? <a href="#">Log In</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
