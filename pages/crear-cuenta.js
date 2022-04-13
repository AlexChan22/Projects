import React, {useState} from 'react';
import { css } from '@emotion/react';
import Router from 'next/router'; 
import Layout from '../components/layout/Layout';
import { Formulario, Campo, InputSubmit, Error} from '../components/UI/Formulario';

import firebase from '../firebase';

// validaciones 
import useValidacion from '../hooks/useValidacion';
import validarCrearCuenta from '../validacion/validarCrearCuenta';

const STATE_INICIAL = {
  nombre : '',
  email: '',
  password: ''
}

const CrearCuenta = () => {

  const [error, guardarError] = useState(false); 

  async function crearCuenta () {
    try {
      await firebase.registrar(nombre, email, password);
      Router.push('/');
    } catch (error) {
      console.log('An Error Occured when creating a new User'); 
      guardarError(error.message); 
    }
  }

  const { valores, errores, handleSubmit, handleChange, handleBlur } = useValidacion(STATE_INICIAL,validarCrearCuenta, crearCuenta );
  const { nombre, email, password } = valores; 

  

  return (
    <div>
      <Layout>
        <>
          <h1
            css={css`
              text-align: center;
              margin-top: 5rem;
            `}
          >
          Create Account</h1>
          <Formulario
            onSubmit={handleSubmit}
            noValidate 
          >
              <Campo>
                  <label htmlFor="nombre">Name:</label>
                  <input 
                    type="text"
                    id="nombre"
                    placeholder="Your name"
                    name="nombre"
                    value={nombre}
                    onChange={handleChange}
                    onBlur = {handleBlur}
                  />
              </Campo>

              {errores.nombre && <Error>{errores.nombre}</Error>}

              <Campo>
                  <label htmlFor="email">email:</label>
                  <input 
                    type="email"
                    id="email"
                    placeholder="Your email"
                    name="email"
                    value={email}
                    onChange={handleChange}
                    onBlur = {handleBlur}
                  />
              </Campo>
              {errores.email && <Error>{errores.email}</Error>}

              <Campo>
                  <label htmlFor="password">Password:</label>
                  <input 
                    type="password"
                    id="password"
                    placeholder="Your password"
                    name="password"
                    value={password}
                    onChange={handleChange}
                    onBlur = {handleBlur}
                  />
              </Campo>
              {errores.password && <Error>{errores.password}</Error>}

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
              <InputSubmit type="submit" value="Create Account"/>
          </Formulario>
        </>
      </Layout>
    </div>
  )
}

export default CrearCuenta; 