import React, {useState} from 'react';
import { css } from '@emotion/react';
import Router from 'next/router'; 
import Layout from '../components/layout/Layout';
import { Formulario, Campo, InputSubmit, Error} from '../components/UI/Formulario';

import firebase from '../firebase';

// validaciones 
import useValidacion from '../hooks/useValidacion';
import validarIniciar from '../validacion/validarIniciar';

const STATE_INICIAL = {
  email: '',
  password: ''
}

const Login = () => {

  const [error, guardarError] = useState(false); 

  async function iniciarSesion () {
    try {
      await firebase.login(email, password);
      Router.push('/');
    } catch (error) {
      console.log('An Error Occured when logging in'); 
      guardarError(error.message); 
    }
  }

  const { valores, errores, handleSubmit, handleChange, handleBlur } = useValidacion(STATE_INICIAL,validarIniciar, iniciarSesion );
  const { email, password } = valores; 

  

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
          Login</h1>
          <Formulario
            onSubmit={handleSubmit}
            noValidate 
          >
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
              <InputSubmit type="submit" value="Login"/>
          </Formulario>
        </>
      </Layout>
    </div>
  )
}

export default Login; 