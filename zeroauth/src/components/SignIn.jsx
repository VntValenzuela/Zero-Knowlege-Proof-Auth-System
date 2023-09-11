  import React, { useState } from 'react';
  import '../style/SignIn.css';
  import { BigInteger } from 'jsbn';
  
  
  const SignIn = ({ authenticateUser }) => {
  
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [round, setRound] = useState(1);
    const [totalRounds, setTotalRounds] = useState(6);
    const [responses, setResponses] = useState([]);
    const [challengeImages, setChallengeImages] = useState([]);
    const [authenticationMessage, setAuthenticationMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [gString, setGString] = useState('');
    const [pString, setPString] = useState('');
  
  
    const [v] = useState(new BigInteger((Math.floor(Math.random() * 1000) + 1).toString()));
  
    const handleSendUsername = async (e) => {
      e.preventDefault();
   try{
      const response = await fetch(process.env.REACT_APP_SERVER_IP + '/login/commitment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username
        }),
      });
      if (response.ok) {
        const data = await response.json();
  
        const gStringValue = data.gString.toString();
        const pStringValue = data.pString.toString();
      
        setGString(gStringValue);
        setPString(pStringValue);
      
  
        handleSendCommitment(pStringValue,gStringValue);
      } else {
        console.error('Error al obtener generador y numero primo', response.statusText);
      }
    }
    catch (error) {
      console.error('Error al enviar el usuario', error);
    }
    };
  
    const handleSendCommitment = async (prime, generator) => {
      setChallengeImages([]);
      const p = new BigInteger(prime);
      const g = new BigInteger(generator);
      const t = (g.modPow(v, p)).toString();
      
  
      try {
        setIsLoading(true);
        const response = await fetch(process.env.REACT_APP_SERVER_IP+ '/login/challenge', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username,
            t,
          }),
        });
    
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setChallengeImages(data.responseChallengeImages);
          setRound(1);
          setResponses([]);
        } else {
          console.error('Error al obtener el desafío de imágenes:', response.statusText);
        }
      } catch (error) {
        console.error('Error al obtener el desafío de imágenes:', error);
      }
      finally {
        setIsLoading(false); // establecer isLoading en false después de obtener las imágenes
      }
      
    };
  
  
    const generateCValue = (responses) => {
      const cValue = responses.join('');
      console.log(cValue);
      return cValue;
    };
  
    
  
  
    const handleLogin = async (e) => {
      e.preventDefault();
      const x = new BigInteger(password);
      const c = new BigInteger(generateCValue(responses).toString());
      const r = (v.subtract(c.multiply(x))).toString();
        try {
          const response = await fetch(process.env.REACT_APP_SERVER_IP+ '/login/authenticate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              username,
              r,
            }),
          });
    
          if (response.ok) {
            const data = await response.json();
            console.log('Autenticación exitosa:', data.message);
            setAuthenticationMessage(data.message);
          } else {
            console.error('Error en la autenticación:', response.statusText);
            setAuthenticationMessage(response.statusText);
          }
        } catch (error) {
          console.error('Error en la autenticación:', error);
        }
    };
  
    const handleResponse = (response) => {
      if (round <= totalRounds) {
        setResponses([...responses, response]);
        setRound(round + 1);
      } else {
         setRound(totalRounds + 1);
      }
    };
  
    const renderImages = (imageSources) => {
      const imageElements = imageSources.map((src, index) => (
        <img key={index} src={`data:image/png;base64,${src}`} alt={`Imagen ${index + 1}`} />
      ));
    
      return <div className="image-container">{imageElements}</div>;
    };
  
      return (
  <div className="signin-container">
    <h2>Iniciar sesión</h2>
    <form className="signin-form" onSubmit={handleLogin}>
      <label htmlFor="username">Nombre de usuario:</label>
      <input
        type="text"
        id="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <br />
      <button onClick={handleSendUsername}>Enviar</button>
      
      <br />
      {challengeImages.length > 0 ? (
    <>
    {round < (totalRounds + 1) ? (<><p>Ronda {round} de {totalRounds}:</p>
      <div>{renderImages(challengeImages[round - 1])}</div>
      <button type="button" onClick={() => handleResponse(1)} disabled={round === totalRounds + 1}>Sí</button>
      <button type="button" onClick={() => handleResponse(0)} disabled={round === totalRounds + 1}>No</button> </>):<p>Respondiste todas las rondas</p>  }
    </>) : isLoading && <div className="loading"><p>Cargando imágenes...</p></div>}
       <label htmlFor="password">Contraseña:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
  />
  <br />
      <button type="submit" disabled={round !== totalRounds + 1}>Iniciar sesión</button>
      {authenticationMessage && <p>{authenticationMessage}</p>}
    </form>
  </div>
      );
    };
  
    export default SignIn;
  