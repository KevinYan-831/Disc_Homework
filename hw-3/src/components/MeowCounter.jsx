import { useEffect, useState } from 'react'



function MeowCounter({ progressPercentage, showMeow }) {
  const [countMeow, setCountMeow] = useState(0)


  // Increment meow count whenever progress reaches 100%
  useEffect(() => {
    if (progressPercentage === 100 && showMeow) {
      setCountMeow((value) => value + 1)
    }
  }, [progressPercentage, showMeow])

  return (
    <section className="card meow-card">
      <div className="meow-container">
        <div className="meow-content">
          <p>Meows counted: {countMeow}</p>
          <div className="meow-visual">🐱</div>
        </div>
        {showMeow && (
          <div className="chat-bubble">
            <div className="chat-bubble-content">meow</div>
          </div>
        )}
      </div>
    </section>
  )
}
export default MeowCounter
