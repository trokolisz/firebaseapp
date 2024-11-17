'use client'
import { get, ref, push } from 'firebase/database';
import { useEffect, useState } from 'react';
import { database } from '../../firebaseConfig';

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
    <main className="container mx-auto">
      <h1 className="text-5xl font-bold text-center my-10">
       Fetch data from Firebase Realtime Database
      </h1>
      <div className="container mx-auto border-solid">
        <form onSubmit={handleSubmit} className="mb-10 border-s-violet-800">
        <input
          type="text"
          name="name"
          value={newCompetition.name}
          onChange={handleInputChange}
          placeholder="Competition Name"
          className="border p-2 mr-2"
          required
        />
        <input
          type="text"
          name="description"
          value={newCompetition.description}
          onChange={handleInputChange}
          placeholder="Competition Description"
          className="border p-2 mr-2"
          required
        />
        <input
          type="date"
          name="start_date"
          value={newCompetition.start_date}
          onChange={handleInputChange}
          className="border p-2 mr-2"
          required
        />
        <input
          type="date"
          name="end_date"
          value={newCompetition.end_date}
          onChange={handleInputChange}
          className="border p-2 mr-2"
          required
        />
        <label className="mr-2">
          <input
            type="checkbox"
            name="is_active"
            checked={newCompetition.is_active}
            onChange={handleInputChange}
            className="mr-1"
          />
          Active
        </label>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Add Competition</button>
      </form>
      </div>
      <div className='grid grid-cols-3 gap-4'>
        {user.map((competition) => (
          <div key={competition.id} className="bg-gray-100 p-4 rounded-md">
            <h2 className="text-2xl font-bold text-center">{competition.name}</h2>
            <p className="text-lg text-center">{competition.description}</p>
            <p className="text-lg text-center">Start Date: {competition.start_date}</p>
            <p className="text-lg text-center">End Date: {competition.end_date}</p>
            <p className="text-lg text-center">Active: {competition.is_active ? 'Yes' : 'No'}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
