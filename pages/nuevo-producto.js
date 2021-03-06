import React, {useState, useContext} from 'react';
import { css } from '@emotion/react';
import Router, {useRouter} from 'next/router'; 
import FileUploader from 'react-firebase-file-uploader'; 
import Layout from '../components/layout/Layout';
import { Formulario, Campo, InputSubmit, Error} from '../components/UI/Formulario';


import firebase, { FirebaseContext } from '../firebase';
import Error404 from '../components/layout/404';

// validaciones 
import useValidacion from '../hooks/useValidacion';
import validarProducto from '../validacion/validarCrearProducto';
const STATE_INICIAL = {
  nombre : '',
  empresa : '',
  imagen: '',
  url :'',
  descripcion: ''
}

const NuevoProducto = () => {

  // state de las imagenes
  const [nombreimagen, guardarNombre] = useState('');
  const [subiendo, guardarSubiendo] = useState(false); 
  const [progreso, guardarProgreso] = useState(0);
  const [urlimagen, guardarUrlImagen] = useState('');

  const [error, guardarError] = useState(false); 

  async function crearProducto () {
    // si el usuario no esta autenticado llevar al login 
    if (!usuario) {
      return router.push('/login'); 
    }

    // crear el objeto de nuevo producto
    const producto = {
      nombre,
      empresa,
      url,
      urlimagen,
      descripcion,
      votos : 0,
      comentarios: [],
      creado: Date.now(),
      creador: {
        id: usuario.uid,
        nombre: usuario.displayName
      },
      haVotado: []

    }

    // Insertar a la base de datos
    firebase.db.collection('productos').add(producto);

    return router.push('/'); 
  }

  const handleUploadStart = () => {
    guardarProgreso(0);
    guardarSubiendo(true);
}

const handleProgress = progreso => guardarProgreso({ progreso });

const handleUploadError = error => {
    guardarSubiendo(error);
    console.error(error);
};

const handleUploadSuccess = nombre => {
    guardarProgreso(100);
    guardarSubiendo(false);
    guardarNombre(nombre)
    firebase
        .storage
        .ref("productos")
        .child(nombre)
        .getDownloadURL()
        .then(url => {
          console.log(url);
          guardarUrlImagen(url);
        } );
};


  const { valores, errores, handleSubmit, handleChange, handleBlur } = useValidacion(STATE_INICIAL,validarProducto, crearProducto );
  const { nombre, empresa, imagen, url, descripcion } = valores; 
  
  // Hook de routing para redireccionar
  const router = useRouter();


  // context con las operaciones crud de firebase
  const { usuario, firebase } = useContext(FirebaseContext); 

  console.log(usuario); 

  
  return (
    <div>
      <Layout>
        { !usuario ? <Error404/> : (
        <>
          <h1
            css={css`
              text-align: center;
              margin-top: 5rem;
            `}
          >
          New Product</h1>
          <Formulario
            onSubmit={handleSubmit}
            noValidate 
          >
            <fieldset>
              <legend>General Information</legend>
              <Campo>
                  <label htmlFor="nombre">Name:</label>
                  <input 
                    type="text"
                    id="nombre"
                    placeholder="Product name"
                    name="nombre"
                    value={nombre}
                    onChange={handleChange}
                    onBlur = {handleBlur}
                  />
              </Campo>

              {errores.nombre && <Error>{errores.nombre}</Error>}
              <Campo>
                  <label htmlFor="empresa">Company:</label>
                  <input 
                    type="text"
                    id="empresa"
                    placeholder="Company Name"
                    name="empresa"
                    value={empresa}
                    onChange={handleChange}
                    onBlur = {handleBlur}
                  />
              </Campo>

              {errores.empresa && <Error>{errores.empresa}</Error>}

              <Campo>
                  <label htmlFor="imagen">Image:</label>
                  <FileUploader 
                    accept="image/*"
                    id="imagen"
                    name="imagen"
                    randomizeFilename 
                    storageRef={firebase.storage.ref("productos")}
                    onUploadStart={handleUploadStart}
                    onUploadError={handleUploadError}
                    onUploadSuccess={handleUploadSuccess}
                    onProgress={handleProgress}
                  />
              </Campo>

            

              <Campo>
                  <label htmlFor="url">URL:</label>
                  <input 
                    type="url"
                    placeholder="Product URL"
                    id="url"
                    name="url"
                    value={url}
                    onChange={handleChange}
                    onBlur = {handleBlur}
                  />
              </Campo>

              {errores.url && <Error>{errores.url}</Error>}
            </fieldset>

            <fieldset>
              <legend>About your Product</legend>
              <Campo>
                  <label htmlFor="descripcion">Description:</label>
                  <textarea 
                    id="descripcion"
                    name="descripcion"
                    value={descripcion}
                    onChange={handleChange}
                    onBlur = {handleBlur}
                  />
              </Campo>

              {errores.descripcion && <Error>{errores.descripcion}</Error>}
            </fieldset>
              {/* <div>
                  <label htmlFor="confirm">Confirm Password</label>
                  <input 
                    type="password"
                    id="confirm"
                    placeholder="Repeat Password"
                    name="confirm"
                  />
              </div> */}

              {error && <Error>{error}</Error>}
              <InputSubmit css={css` margin-bottom: 5rem;`}type="submit" value="Create Product"/>
          </Formulario>
        </> )}
      </Layout>
    </div>
  )
}

export default NuevoProducto; 