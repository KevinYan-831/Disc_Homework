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
                <a href="mailto:JixinYan2029@u.northwestern.edu">JixinYan2029@u.northwestern.edu</a>
              </li>
              <li className="mb-3">
                <strong>💼 LinkedIn:</strong>{' '}
                <a href="https://linkedin.com/in/jixin-yan" target="_blank" rel="noopener noreferrer">
                  linkedin.com/in/jixin-yan
                </a>
              </li>
              <li className="mb-3">
                <strong>💻 GitHub:</strong>{' '}
                <a href="https://github.com/KevinYan-831" target="_blank" rel="noopener noreferrer">
                  github.com/KevinYan-831
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
