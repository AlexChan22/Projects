import React, { useContext } from 'react';

import Buscar from '../UI/Buscar';
import Navegacion from './Navegacion';
import Link from 'next/link';
import styled from '@emotion/styled';
import {css} from '@emotion/react'; 

import Boton from '../UI/Boton';

import { FirebaseContext } from '../../firebase';

const ContenedorHeader = styled.div`
    max-width: 1200px;
    width: 95%;
    margin: 0 auto;
    @media (min-width: 768px) {
        display: flex;
        justify-content: space-between;
    }
`;

const Logo = styled.a`
    color: var(--naranja);
    font-size: 4rem;
    line-height: 0;
    font-weight: 700;
    font-family: 'Roboto Slab', serif;
    margin-right: 2rem;
    &:hover {
        cursor: pointer;
    }
`;

const Header = () => {

    const {usuario, firebase} = useContext(FirebaseContext); 
    return ( 
        <header
            css={css`
                border-bottom: 2px solid var(--gris3);
                padding: 1rem 0;
            `}
        >
            <ContenedorHeader>
                <div
                    css={css`
                        display: flex;
                        align-items: center;
                    `}
                >
                    <Link href="/">
                        <Logo>P</Logo>
                    </Link>
                    {/* Buscador Aqui*/}
                    <Buscar /> 
                    {/* Nav Aqui*/}
                    <Navegacion />
                </div>

                <div
                    css={css`
                        display: flex;
                        align-items: center;
                    `}
                >
                    { usuario ? (
                        <>
                        <p
                        css={css`
                            margin-right: 2rem;
                        `}
                        >Hello: {usuario.displayName}</p>
                        <Boton 
                            bgColor="true"
                            onClick={() => firebase.logout()}
                        >Signout</Boton>
                        </>
                    ) : (
                        <>
                        <Link href="/login">
                            <Boton
                                bgColor="true"
                            >Login</Boton>
                        </Link>
                        <Link href="/crear-cuenta">
                            <Boton>Create Account</Boton>
                        </Link>
                        </>

                    ) }
                    
                </div>
            </ContenedorHeader>
        </header>
     );
}
 
export default Header;