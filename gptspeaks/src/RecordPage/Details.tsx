import React, { useState, useEffect } from 'react';

const Details = (props: any) => {
    return (
        <>
        <input
          type="text"
          value={props.getDetails()}
          onChange={(event) => props.changeDetails(event.target.value)}
        />
      </>
    );
  }
  
  export default Details;
  
  