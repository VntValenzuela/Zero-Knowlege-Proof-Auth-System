import React, { useState, useEffect, useRef } from 'react';
import '../style/SignUp.css';
import { BigInteger } from 'jsbn';
import Modal from 'react-modal';
import forge from 'node-forge';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("")
  const [images, setImages] = useState([]);
  const imageRefs = useRef([]);
  const resetForm = () => {
    setUsername('');
    setPassword('');
    setSelectedImages([]);
  };
  
  async function renderImages() {
    try {
      setIsLoading(true);
      setImages(null);
      const response = await fetch(process.env.REACT_APP_SERVER_IP + "/api/images");
      const data = await response.json();
  
      if (!Array.isArray(data)) {
        console.error('La respuesta del servidor no es un array:', data);
        return;
      }
  
      const imageLinks = data;
  
      const imageElements = imageLinks.map((src, index) => {
        const isSelected = selectedImages.includes(src);
        const imageClass = isSelected ? 'selected' : '';
  
        return (
          <img
            key={src}
            src={`data:image/png;base64,${src}`}
            alt=""
            className={imageClass}
            ref={el => imageRefs.current[index] = el}
            onClick={() => handleImageClick(src , index)}
          />
        );
      });
  
      setImages(<div className="signup-images">{imageElements}</div>);
    } catch (error) {
      console.error('Error al cargar las imágenes:', error);
    }
    finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    renderImages();
  }, []);

  const handleImageClick = (src, index) => {
    setSelectedImages(prevSelectedImages => {
      if (prevSelectedImages.includes(src)) {
        if (imageRefs.current[index]) {
          imageRefs.current[index].classList.remove('selected');
        }
        return prevSelectedImages.filter(image => image !== src);
      } else if (prevSelectedImages.length < 3) {
        if (imageRefs.current[index]) {
          imageRefs.current[index].classList.add('selected');
        }
        return [...prevSelectedImages, src];
      } else {
        return prevSelectedImages;
      }
    });
  };

  const generatePublicKey = (password, p, g) => {
    const x = new BigInteger(password); 
    const y = g.modPow(x, p); // Calcular la clave pública
    return y.toString(); 
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedImages.length !== 3) {
      return;
    }

    const keyPair = forge.pki.rsa.generateKeyPair(1024);
    const pValue = keyPair.privateKey.p.toString();
    const gValue = keyPair.privateKey.q.toString();
    const p = new BigInteger(pValue);
    const g = new BigInteger(gValue);
    const pString = p.toString();
    const gString = g.toString();

    const publicKey = generatePublicKey(password, p, g);

    const selectedImagesFlattened = selectedImages.map(arr => arr[0]);


    try {
      const response = await fetch(process.env.REACT_APP_SERVER_IP + '/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          publicKey,
          selectedImagesFlattened,
          gString,
          pString
        }),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log(JSON.stringify({
          username,
          publicKey,
          selectedImagesFlattened,
        }));
        setShowModal(true);
        setModalMessage("Usuario registrado exitosamente");
        console.log("Registration:", data);
        resetForm(); 
        renderImages();
      } else {
        const errorData = await response.json();
        setShowModal(true);
        setModalMessage( errorData.error);
        console.error('Error registering user:', errorData.error);
      }
    } catch (error) {
      setShowModal(true);
      setModalMessage("Error al registrar al usuario");
      console.error('Error registering user:', error);
    }


  };

  return (
    <div className="sign-up">
      <h1>Registro</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Nombre de usuario:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="image-selection">
          <h2>Selecciona 3 imágenes:</h2>
          <div className="images-container">
            {images}
          </div>
          {isLoading && (
    <div className="loading">
      <p>Cargando imágenes...</p>
    </div>
     )}
           {showModal && (
  <Modal
  isOpen={showModal}
  onRequestClose={() => setShowModal(false)}
  className="react-modal"
  contentLabel="Registro"
>
<h2 className="modal-header">{modalMessage}</h2>
<button className="modal-close-button" onClick={() => setShowModal(false)}>Cerrar</button>
</Modal>

    )}
        </div>
        <button type="submit" disabled={selectedImages.length !== 3}>
          Registrarse
        </button>
      </form>
    </div>
  );
};

export default SignUp;


