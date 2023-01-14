import React, { useState } from 'react';
import logo from './logo.svg';
import "./style.css";
import Title from './FrontPage/Title';
import Login from './FrontPage/Login';
import Record from './RecordPage/Record';
import NavBar from './Common/NavBar';
import Details from './RecordPage/Details';
import BrowserRouter from {};
import PlayWAV from './PlayWAV';
import Details from './RecordPage/Details';
import BrowserRouter from {}

function App() {
  const [details, setDetails] = useState('');
  const changeDetails = (e: any) => {
    setDetails(e);
  }

  const getDetails = () => {
    return details;
  }

  return (
    <div>
      <NavBar/>
      <Title/>
      <Login changeDetails={changeDetails}/>
      <Details changeDetails={changeDetails} getDetails={getDetails}/>
      <Record/>
    </div>
  );
}

export default App;
