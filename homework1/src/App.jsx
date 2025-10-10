import { useEffect, useState } from 'react'
import catDefault from './assets/cat.jpeg'
import catAlt from './assets/cat2.jpeg'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';

//import component from booststrap 
function NavBar(props) {
  return (
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">{props.title}</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item">
              <a class="nav-link active" aria-current="page" href="#">{props.home}</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">{props.text1}</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">{props.text2}</a>
            </li>
            <li class="nav-item">
              <a class="nav-link disabled" aria-disabled="true">{props.text3}</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

function PetCat({count, onPet}) {

  const [image, setImage] = useState(catDefault)

  useEffect(() => {
    // Switch cat image depending on count
    if (count === 10){
      setImage(catAlt)
    } 
    else if (count > 10) {
      const cyclePosition = (count - 10) % 12
      if (cyclePosition === 0){
         setImage(catAlt)
      }
      else if (cyclePosition === 2) {
        setImage(catDefault)
    }
  }}, [count])

  return (
    <section className="card pet-card">
      <div className="pet-container">
        <img className="pet-image" src={image} alt="灰灰" />
      </div>
      <button className="btn btn-primary" onClick={onPet}>
        Pet the cat
      </button>
      <p>灰灰 has been petted {count} times</p>
    </section>
  )

}

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

function App() {

const [count, setCount] = useState(0)

  const handlePet = () => setCount((c) => c + 1)

  const getProgressPercentage = () => {
    if (count <= 10) return (count / 10) * 100
    const cyclePosition = (count - 10) % 12
    if (cyclePosition < 2) return 100
    return ((cyclePosition - 2) / 10) * 100
  }

  const progressPercentage = Math.round(getProgressPercentage())
  const showMeow = progressPercentage === 100

  return (
    <div className="app-shell">
      <NavBar title="Pet Your Pet" home="Home" text1="About" text2="Contact" text3="Sign Up/ Log In" />
        <PetCat count={count} onPet={handlePet} />
        <div className="progress mt-3" role="progressbar" aria-valuenow={progressPercentage} aria-valuemin="0" aria-valuemax="100">
          <div className="progress-bar" style={{ width: `${progressPercentage}%` }}>
            {progressPercentage}%
          </div>
        </div>
        <MeowCounter progressPercentage={progressPercentage} showMeow={showMeow} />
    </div>
  )
}

export default App
