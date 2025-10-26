import { useState, useEffect} from 'react';
import PetCat from './PetCat';
import { fetchPets } from '../api/petService';
import MeowCounter from './MeowCounter';


function Home() {
  const [count, setCount] = useState(0)
  const [pets, setPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

   useEffect(() => {
    fetchPetsData();
  }, []);

  const fetchPetsData = async () => {
    try {
      setLoading(true);

      // Fetch pets from the backend API instead of Supabase
      const data = await fetchPets();

      console.log('✅ Fetched pets from backend:', data);
      setPets(data);

      // Set first pet as default selected
      if (data && data.length > 0) {
        setSelectedPet(data[0]);
        console.log('✅ Selected first pet:', data[0]);
      } else {
        console.log('❌ No pets found in database');
      }
    } catch (error) {
      setError(error.message);
      console.error('Error fetching pets:', error);
    } finally {
      setLoading(false);
    }
  };
  const handlePet = () => setCount((c) => c + 1)

  const handlePetChange = (pet) => {
    setSelectedPet(pet);
    setCount(0); // Reset count when switching pets
  };

  // Calculate cyclePosition once to follow DRY principle
  const cyclePosition = count > 10 ? (count - 10) % 12 : null

  const getProgressPercentage = () => {
    if (count <= 10) return (count / 10) * 100
    if (cyclePosition < 2) return 100
    return ((cyclePosition - 2) / 10) * 100
  }

  const progressPercentage = Math.round(getProgressPercentage())
  const showMeow = progressPercentage === 100

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading pets...</span>
        </div>
        <p className="mt-3">Loading selected pets...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          Error loading selected pets: {error}
        </div>
      </div>
    );
  }

  if (!selectedPet) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning" role="alert">
          No pets found in database. Check console for errors.
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container mt-4">
        <h2 className="text-center mb-3">Choose Your Pet</h2>
        <div className="d-flex justify-content-center gap-3 mb-4">
          {pets.map((pet) => (
            <button
              key={pet.id}
              className={`btn ${selectedPet.id === pet.id ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => handlePetChange(pet)}
            >
              {pet.name} ({pet.species})
            </button>
          ))}
        </div>
        <div className="card mb-4">
          <div className="card-body">
            <h3 className="card-title">{selectedPet.name}</h3>
            <p className="card-text">
              <strong>Species:</strong> {selectedPet.species}<br />
              <strong>Age:</strong> {selectedPet.age} years old<br />
              <strong>Weight:</strong> {selectedPet.weight} kg
            </p>
          </div>
        </div>
      </div>


        <PetCat 
            count={count} 
            onPet={handlePet} 
            cyclePosition={cyclePosition}
            petName={selectedPet.name}
            pet_default_image={selectedPet.pet_url}
            pet_changed_image={selectedPet.pet_url2}
        />


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
