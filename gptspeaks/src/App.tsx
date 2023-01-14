import React from 'react';
import logo from './logo.svg';
import "./style.css";
import Title from './Title';
import Login from './Login';
import Record from './Record';
import NavBar from './NavBar';

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
