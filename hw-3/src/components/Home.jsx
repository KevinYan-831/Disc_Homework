import { useState } from 'react';
import PetCat from './PetCat';
import MeowCounter from './MeowCounter';

function Home() {
  const [count, setCount] = useState(0)

  const handlePet = () => setCount((c) => c + 1)

  // Calculate cyclePosition once to follow DRY principle
  const cyclePosition = count > 10 ? (count - 10) % 12 : null

  const getProgressPercentage = () => {
    if (count <= 10) return (count / 10) * 100
    if (cyclePosition < 2) return 100
    return ((cyclePosition - 2) / 10) * 100
  }

  const progressPercentage = Math.round(getProgressPercentage())
  const showMeow = progressPercentage === 100

  return (
    <>
      <PetCat count={count} onPet={handlePet} cyclePosition={cyclePosition} />
      <div className="progress mt-3" role="progressbar" aria-valuenow={progressPercentage} aria-valuemin="0" aria-valuemax="100">
        <div className="progress-bar" style={{ width: `${progressPercentage}%` }}>
          {progressPercentage}%
        </div>
      </div>
      <MeowCounter progressPercentage={progressPercentage} showMeow={showMeow} />
    </>
  )
}

export default Home
