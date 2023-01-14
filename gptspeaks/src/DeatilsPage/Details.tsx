import React, { useState, useEffect } from 'react';

const Details = (props: any) => {
    return (
      <>
        <h1>details page. Edit this in src/DetailsPage/Details.tsx</h1>
        <input
          type="text"
          value={props.getDetails()}
          onChange={(event) => props.changeDetails(event.target.value)}
        />
      </>
    );
  }
  
  export default Details;
  
  