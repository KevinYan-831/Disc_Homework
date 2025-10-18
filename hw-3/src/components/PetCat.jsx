import { useEffect, useState } from 'react'
import catDefault from '../assets/cat.jpeg'
import catAlt from '../assets/cat2.jpeg'


function PetCat({count, onPet, cyclePosition}) {

  const [image, setImage] = useState(catDefault)

  useEffect(() => {
    // Switch cat image depending on count
    if (count === 10){
      setImage(catAlt)
    } 
    else if (count > 10 && cyclePosition !== null) {
      if (cyclePosition === 0){
         setImage(catAlt)
      }
      else if (cyclePosition === 2) {
        setImage(catDefault)
    }
  }}, [count, cyclePosition])

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

export default PetCat