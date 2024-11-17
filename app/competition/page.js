'use client'
import { get, ref, push } from 'firebase/database';
import { useEffect, useState } from 'react';
import { database } from '../firebaseConfig';

export default function Home() {
  const [user, setUser] = useState([]);
  const [newCompetition, setNewCompetition] = useState({
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    is_active: false,
    teams: {}
  });

  useEffect(() => {
    const userRef = ref(database, 'competition');
    get(userRef).then((snapshot) => {
      if (snapshot.exists()) {
        const usersArray = Object.entries(snapshot.val()).map(([id, data]) => 
          ({ id,
             ...data 
          }));
        setUser(usersArray);
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewCompetition({ 
      ...newCompetition, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const competitionRef = ref(database, 'competition');
    push(competitionRef, newCompetition).then((newRef) => {
        setNewCompetition({
            name: '',
            description: '',
            start_date: '',
            end_date: '',
            is_active: false,
            teams: {}
        });
        // Add the new competition to the user state
        setUser((prevUser) => [
            ...prevUser,
            { id: newRef.key, ...newCompetition }
        ]);
    }).catch((error) => {
        console.error(error);
    });
  };

  return (
    <main className="container">
      <h1 className="display-4 text-center my-4">
       Fetch data from Firebase Realtime Database
      </h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="form-group">
          <input
            type="text"
            name="name"
            value={newCompetition.name}
            onChange={handleInputChange}
            placeholder="Competition Name"
            className="form-control mb-2"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            name="description"
            value={newCompetition.description}
            onChange={handleInputChange}
            placeholder="Competition Description"
            className="form-control mb-2"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="date"
            name="start_date"
            value={newCompetition.start_date}
            onChange={handleInputChange}
            className="form-control mb-2"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="date"
            name="end_date"
            value={newCompetition.end_date}
            onChange={handleInputChange}
            className="form-control mb-2"
            required
          />
        </div>
        <div className="form-check mb-2">
          <input
            type="checkbox"
            name="is_active"
            checked={newCompetition.is_active}
            onChange={handleInputChange}
            className="form-check-input"
          />
          <label className="form-check-label">
            Active
          </label>
        </div>
        <button type="submit" className="btn btn-primary">Add Competition</button>
      </form>
      
      <div className='row'>
        {user.map((competition) => (
          <div key={competition.id} className="col-md-4 mb-4">
            <div className="card">
              <div className="card-body">
                <h2 className="card-title text-center">{competition.name}</h2>
                <p className="card-text text-center">{competition.description}</p>
                <p className="card-text text-center">Start Date: {competition.start_date}</p>
                <p className="card-text text-center">End Date: {competition.end_date}</p>
                <p className="card-text text-center">Active: {competition.is_active ? 'Yes' : 'No'}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
