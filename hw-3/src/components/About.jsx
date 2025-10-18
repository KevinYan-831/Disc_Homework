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
                This is a fun and interactive application where you can pet virtual cats 
                and watch them react to your affection!
              </p>
              <p>
                Every pet counts! Watch the progress bar fill up as you show your cat some love. 
                When you reach certain milestones, your cat will change its expression and even meow!
              </p>
              <h4 className="mt-4">Features:</h4>
              <ul>
                <li>Interactive cat petting experience</li>
                <li>Real-time progress tracking</li>
                <li>Multiple cat expressions</li>
                <li>Meow counter to track your achievements</li>
              </ul>
              <p className="mt-3">
                <strong>Pro tip:</strong> Keep petting to unlock all the different cat reactions!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
