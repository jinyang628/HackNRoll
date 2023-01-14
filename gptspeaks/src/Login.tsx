import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  

  const handleSubmit = (event: { preventDefault: () => void; }) => {
    event.preventDefault();
<<<<<<< HEAD

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
=======
    const data = {
      "username": username,
      "email": email,
      "password": password
    };
    console.log(data);
    axios.post('https://127.0.0.1:8000/register', data)
    .then((response: any) =>{
      console.log(response);
>>>>>>> 8163fb4d8291ece5b9900949c3d4d73cd056769f
    })
    .then(res => res.json())
    .then(response => console.log('Success:', JSON.stringify(response)))
    .catch(error => console.error('Error:', error));
  };

  return (
    <form className="regLogForm" onSubmit={handleSubmit}>
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
      <button className="btn btn-secondary button" type="submit">Log in</button>
      <button className="btn btn-secondary button" type="button">Register</button>
      </div>
    </form>
  );
}

export default Login;
