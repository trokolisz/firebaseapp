'use client'
import { get, ref } from 'firebase/database';
import { useEffect, useState } from 'react';
import { database } from './firebaseConfig';



export default function Home() {
  const [user, setUser] = useState([]); 

  useEffect(() => {
    const userRef = ref(database, 'users');
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
  return (
    <main className="container">
      <h1 className="display-4 text-center my-4">
       Fetch data from Firebase Realtime Database
      </h1>
      <div className='row'>
        {user.map((user) => (
          <div key={user.id} className="col-md-4 mb-4">
            <div className="card">
              <div className="card-body">
                <h2 className="card-title text-center">{user.username}</h2>
                <p className="card-text text-center">{user.email}</p>
              </div>
            </div>
          </div>  
        ))}
      </div>
    </main>
  );
}
