import React from 'react';
import {Redirect} from 'react-router-dom';

function Home() {
  return (
    <Redirect to="/matches" />
  );
}

export default Home;
