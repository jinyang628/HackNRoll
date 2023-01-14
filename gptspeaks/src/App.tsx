import React from 'react';
import logo from './logo.svg';
import "./style.css";
import Title from './FrontPage/Title';
import Login from './FrontPage/Login';
import Record from './RecordPage/Record';
import NavBar from './Common/NavBar';
import PlayWAV from './PlayWAV';

function App() {
  return (
    <div>
      <NavBar/>
      <Title/>
      <Login/>
      <Record/>
      <PlayWAV/>
    </div>
  );
}

export default App;
