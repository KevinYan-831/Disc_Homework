import React from 'react';

function MeowCounter({ progressPercentage, showMeow }) {
  return (
    <div className="mt-3">
      {showMeow && (
        <div className="alert alert-success" role="alert">
          <h4 className="alert-heading">Meow! 🐱</h4>
          <p>Your cat is happy! Keep petting to see more reactions!</p>
        </div>
      )}
    </div>
  );
}

export default MeowCounter;