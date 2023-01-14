import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [response, setData] = useState(null);


  const handleSubmit1 = (event: { preventDefault: () => void; }) => {
    event.preventDefault();

    const data = {
      "email": email,
      "password": password,
    };

    useEffect(() => {
      fetch('http://127.0.0.1:8000/login?email='+email+'&password='+password, {
        method: 'GET',
      })
      .then(res => res.json())
      // store the response using useState
      .then(response => setData(response))
      .then(response => console.log('Success:', JSON.stringify(response)))
      .catch(error => console.error('Error:', error));
    }, []);
  };

  const handleSubmit2 = (event: { preventDefault: () => void; }) => {
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
    <form className="regLogForm">
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
      <div>
      <button className="btn btn-secondary button" type="submit" onClick={handleSubmit1}>Log in</button>
      <button className="btn btn-secondary button" type="submit" onClick={handleSubmit2}>Register</button>
      </div>
    </form>
  );
}

export default Login;
