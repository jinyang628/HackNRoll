import React, { useState } from 'react'
import { Link } from 'react-router-dom';


function Registration() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const handleSubmit1 = (event: { preventDefault: () => void; }) => {

    event.preventDefault();
  
    const data = {
      "username": username,
      "email": email,
      "details":"",
      "password": password,
    };
  
    fetch('http://127.0.0.1:8000/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    // store the response somewhere
    .then(response => console.log('Success:', JSON.stringify(response)))
    .catch(error => console.error('Error:', error));
  };

  return (
    <form className="regForm">
      <label>
        Username:
        <input value={username} onChange={(e) => setUsername(e.target.value)} required />
      </label>
      <br />
      <label>
        Email:
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </label>
      <br />
      <label>
        Password:
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </label>
      <br />

        <Link to="/">
          {/* <button className="btn btn-secondary button" onClick={handleSubmit1}>Register</button> */}
          <button className="btn btn-secondary button">Register</button>
          {/* the onClick function kinda spoils the navigation. I cant seem to call handleSubmit and navigate to the details.html at the same time */}
          {/* u guys can uncomment the one without onClick to navigate to details.html */}
          {/* i read online it has to do with the useNavigate method of react-router-dom*/}
          {/* i already tried a few ways as u can see within the handleSubmit function with the navigate calls but they dont work */}

        </Link>
    </form>
  );
}


export default Registration