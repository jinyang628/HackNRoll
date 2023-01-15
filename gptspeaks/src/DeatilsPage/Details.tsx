import React, { useState, useEffect } from 'react';
import { BrowserRouter, Link, Route, useNavigate} from 'react-router-dom';
import { Routes } from 'react-router';
import Record from '../RecordPage/Record';
import NavBar from "../Common/NavBar";

const Details = (props: any) => {
    return (
      <div>
      <NavBar/>
      <div className="regForm">
        <h2>Input the details you would like to pass to chatGPT as a prompt</h2>
        <input
          type="text"
          value={props.getDetails()}
          onChange={(event) => props.changeDetails(event.target.value)}
        />
        <Link to="/record.html">
          <button className="btn btn-secondary button">Done</button>
        </Link>
      </div>
      </div>
    );
  }
  
  export default Details;
  
  