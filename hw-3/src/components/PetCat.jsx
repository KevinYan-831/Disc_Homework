import { useEffect, useState } from 'react'

// Fallback placeholder image
const PLACEHOLDER = 'https://via.placeholder.com/400x400?text=Pet+Image';

function PetCat({count, onPet, cyclePosition, petName, pet_default_image, pet_changed_image}) {
  
  const defaultImg = pet_default_image || PLACEHOLDER;
  const altImg = pet_changed_image || PLACEHOLDER;
  
  console.log('🐾 PetCat received:', { petName, pet_default_image, pet_changed_image });
  
  const [image, setImage] = useState(defaultImg)


  useEffect(() => {
    setImage(defaultImg);
  }, [defaultImg]);

  useEffect(() => {
    // Switch cat image depending on count
    if (count === 10){
      setImage(altImg)
    } 
    else if (count > 10 && cyclePosition !== null) {
      if (cyclePosition === 0){
         setImage(altImg)
      }
      else if (cyclePosition === 2) {
        setImage(defaultImg)
    }
  }}, [count, cyclePosition, defaultImg, altImg])

  return (
    <section className="card pet-card">
      <div className="pet-container">
        <img className="pet-image" src={image} alt={petName} />
      </div>
      <button className="btn btn-primary" onClick={onPet}>
        Pet {petName}
      </button>
      <p>{petName} has been petted {count} times</p>
    </section>
  )

}

export default PetCat