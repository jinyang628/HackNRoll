import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const data = {
    "username": username,
    "email": email,
    "password": password
  };

  const handleSubmit = (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    axios.post('http://127.0.0.1:8000/register', data)
    .then((response: any) =>{
      console.log(response);
    })
    .catch((error: any) => {
      console.log(error);
    });
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
