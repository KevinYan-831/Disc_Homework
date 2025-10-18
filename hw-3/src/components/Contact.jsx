import React from 'react';

function Contact() {
  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-body">
          <h1 className="card-title">Contact Information</h1>
          <p className="lead">Feel free to reach out to me!</p>
          
          <div className="mt-4">
            <h4>Get in Touch</h4>
            <ul className="list-unstyled">
              <li className="mb-3">
                <strong>📧 Email:</strong>{' '}
                <a href="mailto:your.email@example.com">your.email@example.com</a>
              </li>
              <li className="mb-3">
                <strong>💼 LinkedIn:</strong>{' '}
                <a href="https://linkedin.com/in/yourprofile" target="_blank" rel="noopener noreferrer">
                  linkedin.com/in/yourprofile
                </a>
              </li>
              <li className="mb-3">
                <strong>💻 GitHub:</strong>{' '}
                <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer">
                  github.com/yourusername
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
