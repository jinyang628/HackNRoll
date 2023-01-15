import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { BrowserRouter, Link, Route, useNavigate} from 'react-router-dom';
import Registration from '../RegistrationPage/Registration';
import { Routes } from 'react-router';
import NavBar from '../Common/NavBar';
import Title from './Title';
import Record from '../Record';
import Details from '../DeatilsPage/Details';

function LoginContent(props: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const handleSubmit1 = (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    const { navigate } = props;
    
    const data = {
      "email": email,
      "password": password,
    };

    fetch('http://127.0.0.1:8000/login?email='+email+'&password='+password, {
      method: 'GET',
    })
    .then(res => res.json())
    // store the response using useState
    .then(response => {
      console.log('here');
      props.changeDetails(response)
      navigate('/details.html')
      })
    .then(response => console.log('Success:', JSON.stringify(response)))
    .catch(error => console.error('Error:', error));
  };

  return (
      <div>
      <NavBar/>
      <Title/>
      <form className="logForm">
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

          <Link to="/details.html">
            {/* <button className="btn btn-secondary button" onClick={handleSubmit1}>Log in</button> */}
            <button className="btn btn-secondary button">Log in</button>
            {/* the onClick function kinda spoils the navigation. I cant seem to call handleSubmit and navigate to the details.html at the same time */}
            {/* u guys can uncomment the one without onClick to navigate to details.html */}
            {/* i read online it has to do with the useNavigate method of react-router-dom*/}
            {/* i already tried a few ways as u can see within the handleSubmit function with the navigate calls but they dont work */}

          </Link>

          <Link to="/registration.html">
            <a className="Link">Don't have an account? Click here to register</a>
          </Link>
      </form>
      <Record/>
      </div>
    
  );
}


function Login(){
    const [details, setDetails] = useState('');
    const changeDetails = (e: any) => {
      setDetails(e);
    }

    const getDetails = () => {
      return details;
    }

    return(
      <BrowserRouter>
          <Routes>
              <Route path="/" element={<LoginContent navigate={useNavigate} changeDetails={changeDetails}/>}/>
              <Route path="/details.html" element={<Details changeDetails={changeDetails} getDetails={getDetails}/>}/>
              <Route path="/registration.html" element={<Registration/>}/>
              <Route path="/record.html" element={<Record/>}/>
          </Routes>
      </BrowserRouter>
    );
}

export default Login;
