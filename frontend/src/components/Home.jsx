import { useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PetCat from './PetCat';
import { fetchPets, createPet, deletePet } from '../api/petService';
import MeowCounter from './MeowCounter';
import 'bootstrap-icons/font/bootstrap-icons.css';


function Home() {
  const { user, getAccessToken } = useAuth();
  const navigate = useNavigate();
  const [count, setCount] = useState(0)
  const [pets, setPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal state for creating pets
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [newPetForm, setNewPetForm] = useState({
    name: '',
    species: '',
    age: '',
    weight: '',
    pet_url: '',
    pet_url2: ''
  });

   useEffect(() => {
    fetchPetsData();
  }, []);

  const fetchPetsData = async () => {
    try {
      setLoading(true);

      // Get access token from auth context
      const token = getAccessToken();

      // Fetch pets from the backend API
      const data = await fetchPets(token);

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

  // Modal handlers
  const openCreateModal = () => {
    setShowCreateModal(true);
    setSubmitError(null);
    setNewPetForm({
      name: '',
      species: '',
      age: '',
      weight: '',
      pet_url: '',
      pet_url2: ''
    });
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
    setSubmitError(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setNewPetForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitting(true);

    try {
      // Validate required fields
      if (!newPetForm.name.trim() || !newPetForm.species.trim()) {
        setSubmitError('Name and species are required');
        setSubmitting(false);
        return;
      }

      // Prepare data - convert empty strings to null for optional fields
      const petData = {
        name: newPetForm.name.trim(),
        species: newPetForm.species.trim(),
        age: newPetForm.age ? parseInt(newPetForm.age) : null,
        weight: newPetForm.weight ? parseFloat(newPetForm.weight) : null,
        pet_url: newPetForm.pet_url.trim() || null,
        pet_url2: newPetForm.pet_url2.trim() || null
      };

      // Get access token
      const token = getAccessToken();

      const createdPet = await createPet(petData, token);
      console.log('✅ Pet created:', createdPet);

      // Refresh the pet list
      await fetchPetsData();

      // Select the newly created pet
      setSelectedPet(createdPet);
      setCount(0);

      // Close modal
      closeCreateModal();
    } catch (error) {
      console.error('Error creating pet:', error);
      setSubmitError(error.message || 'Failed to create pet');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePet = async (petId, petName) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${petName}? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      // Get access token
      const token = getAccessToken();
      
      await deletePet(petId, token);
      console.log('✅ Pet deleted:', petId);

      // Refresh the pet list
      const updatedPets = await fetchPets(token);
      setPets(updatedPets);

      // If deleted pet was selected, select the first available pet
      if (selectedPet?.id === petId) {
        if (updatedPets.length > 0) {
          setSelectedPet(updatedPets[0]);
        } else {
          setSelectedPet(null);
        }
        setCount(0);
      }
    } catch (error) {
      console.error('Error deleting pet:', error);
      alert(`Failed to delete pet: ${error.message}`);
    }
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

  if (!selectedPet && pets.length === 0) {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            <div className="text-center py-5">
              <div className="mb-4">
                <i className="bi bi-emoji-frown" style={{ fontSize: '4rem', color: '#ffc107' }}></i>
              </div>
              <h3 className="mb-3">No Pets Yet!</h3>
              <p className="text-muted mb-4">
                {user
                  ? "Start your pet collection by creating your first virtual pet!"
                  : "Please log in to create and manage your virtual pets."}
              </p>
              {user ? (
                <button className="btn btn-primary btn-lg" onClick={openCreateModal}>
                  <i className="bi bi-plus-circle me-2"></i>
                  Create Your First Pet
                </button>
              ) : (
                <button className="btn btn-primary btn-lg" onClick={() => navigate('/login')}>
                  <i className="bi bi-box-arrow-in-right me-2"></i>
                  Log In / Sign Up
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container mt-4 px-3 px-md-4">
        <div className="row">
          <div className="col-12">
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-4 gap-3">
              <h2 className="mb-0">
                <i className="bi bi-hearts me-2 text-danger"></i>
                Choose Your Pet
              </h2>
              {user && (
                <button className="btn btn-success" onClick={openCreateModal}>
                  <i className="bi bi-plus-circle me-2"></i>
                  Create New Pet
                </button>
              )}
            </div>

            <div className="d-flex justify-content-center gap-2 gap-md-3 mb-4 flex-wrap">
              {pets.map((pet) => (
                <div key={pet.id} className="position-relative">
                  <button
                    className={`btn ${selectedPet?.id === pet.id ? 'btn-primary' : 'btn-outline-primary'} btn-sm btn-md-md`}
                    onClick={() => handlePetChange(pet)}
                  >
                    <i className="bi bi-star-fill me-1"></i>
                    {pet.name} ({pet.species})
                  </button>
                  {user && (
                    <button
                      className="btn btn-sm btn-danger position-absolute top-0 start-100 translate-middle rounded-circle"
                      style={{ width: '24px', height: '24px', padding: '0', fontSize: '12px', lineHeight: '1', zIndex: 10 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePet(pet.id, pet.name);
                      }}
                      title={`Delete ${pet.name}`}
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="row justify-content-center">
              <div className="col-12 col-md-10 col-lg-8">
                <div className="card shadow-sm mb-4">
                  <div className="card-body">
                    <h3 className="card-title">
                      <i className="bi bi-info-circle me-2 text-primary"></i>
                      {selectedPet.name}
                    </h3>
                    <div className="row mt-3">
                      <div className="col-6 col-md-4 mb-2">
                        <strong><i className="bi bi-tag me-1"></i>Species:</strong> {selectedPet.species}
                      </div>
                      <div className="col-6 col-md-4 mb-2">
                        <strong><i className="bi bi-calendar me-1"></i>Age:</strong> {selectedPet.age} years
                      </div>
                      <div className="col-6 col-md-4 mb-2">
                        <strong><i className="bi bi-speedometer me-1"></i>Weight:</strong> {selectedPet.weight} kg
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid px-3 px-md-4">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-8">
            <PetCat
                count={count}
                onPet={handlePet}
                cyclePosition={cyclePosition}
                petName={selectedPet.name}
                pet_default_image={selectedPet.petUrl}
                pet_changed_image={selectedPet.petUrl2}
            />
          </div>
        </div>
      </div>

      <div className="container px-3 px-md-4">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-8">
            <div className="progress mt-3 mb-3" style={{ height: '30px' }} role="progressbar" aria-valuenow={progressPercentage} aria-valuemin="0" aria-valuemax="100">
              <div className="progress-bar progress-bar-striped progress-bar-animated" style={{ width: `${progressPercentage}%`, fontSize: '16px', lineHeight: '30px' }}>
                {progressPercentage}%
              </div>
            </div>
          </div>
        </div>
      </div>

      <MeowCounter progressPercentage={progressPercentage} showMeow={showMeow} />

      {/* Create Pet Modal */}
      {showCreateModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Create New Pet</h5>
                <button type="button" className="btn-close" onClick={closeCreateModal}></button>
              </div>
              <form onSubmit={handleCreateSubmit}>
                <div className="modal-body">
                  {submitError && (
                    <div className="alert alert-danger" role="alert">
                      {submitError}
                    </div>
                  )}

                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Pet Name <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={newPetForm.name}
                      onChange={handleFormChange}
                      required
                      placeholder="Enter pet name"
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="species" className="form-label">Species <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      className="form-control"
                      id="species"
                      name="species"
                      value={newPetForm.species}
                      onChange={handleFormChange}
                      required
                      placeholder="e.g., cat, dog, rabbit"
                    />
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="age" className="form-label">Age (years)</label>
                      <input
                        type="number"
                        className="form-control"
                        id="age"
                        name="age"
                        value={newPetForm.age}
                        onChange={handleFormChange}
                        min="0"
                        placeholder="Optional"
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label htmlFor="weight" className="form-label">Weight (kg)</label>
                      <input
                        type="number"
                        className="form-control"
                        id="weight"
                        name="weight"
                        value={newPetForm.weight}
                        onChange={handleFormChange}
                        min="0"
                        step="0.1"
                        placeholder="Optional"
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="pet_url" className="form-label">Pet Image URL (Default)</label>
                    <input
                      type="url"
                      className="form-control"
                      id="pet_url"
                      name="pet_url"
                      value={newPetForm.pet_url}
                      onChange={handleFormChange}
                      placeholder="https://example.com/pet-image.jpg"
                    />
                    <small className="form-text text-muted">URL to the default pet image</small>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="pet_url2" className="form-label">Pet Image URL (Happy/Petted)</label>
                    <input
                      type="url"
                      className="form-control"
                      id="pet_url2"
                      name="pet_url2"
                      value={newPetForm.pet_url2}
                      onChange={handleFormChange}
                      placeholder="https://example.com/pet-happy-image.jpg"
                    />
                    <small className="form-text text-muted">URL to the happy/petted pet image</small>
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={closeCreateModal} disabled={submitting}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? 'Creating...' : 'Create Pet'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Home
