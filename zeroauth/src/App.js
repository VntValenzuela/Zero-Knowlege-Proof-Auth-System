import React, { useState } from 'react';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';

import './style/App.css';

const App = () => {

  return (
<div>
  <h1>Autenticación con Zero Knowledge Proofs</h1>
  <SignUp registerUser/>
  <SignIn authenticateUser/>

</div>
  );
};

export default App; 
