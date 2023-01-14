import React from 'react';
import logo from './logo.svg';
import "./style.css";
import Title from './FrontPage/Title';
import Login from './FrontPage/Login';
import Record from './RecordPage/Record';
import NavBar from './Common/NavBar';

function App() {
  return (
    <div>
      <NavBar/>
      <Title/>
      <Login/>
      <Record/>
    </div>
  );
}

export default App;
