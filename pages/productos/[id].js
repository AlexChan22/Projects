import React, { useEffect, useContext, useState } from 'react';
import { useRouter } from 'next/router';

import Layout from '../../components/layout/Layout';
import { FirebaseContext } from '../../firebase';
import Error404 from '../../components/layout/404';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';

import { Campo, InputSubmit } from '../../components/UI/Formulario';
import Boton from '../../components/UI/Boton';

const ContenedorProducto = styled.div`
    @media(min-width: 768px) {
        display: grid;
        grid-template-columns: 2fr 1fr;
        column-gap: 2rem;
    }
`;

const CreadorProducto = styled.p`
    padding: .5rem 2rem; 
    background-color: #DA552F;
    color: #FFF;
    text-transform: uppercase;
    font-weight: bold;
    display: inline-block;
    text-align: center;
`;

// Dynamic Routing con Next 
const Producto = () => {

    // state del componente
    const [producto, guardarProducto ] = useState({});
    const [error, guardarError] = useState(false); 
    const [comentario, guardarComentario] = useState({}); 
    const [consultarDB, guardarConsultarDB ] = useState(true);

    // Routing para obtener el id actual
    const router = useRouter();
    const { query: {id} } = router; 

    // context de firebase
    const { firebase, usuario } = useContext(FirebaseContext); 

    // Consultar a la base de datos cuando obtenga el id
    useEffect(() => {
        if (id && consultarDB) {
            const obtenerProducto = async () => {
                const productoQuery = await firebase.db.collection('productos').doc(id); 
                const producto = await productoQuery.get();
                if (producto.exists) {
                    guardarProducto( producto.data() );
                    guardarConsultarDB(false); 
                } else {
                    guardarError(true);
                    guardarConsultarDB(false);
                }
            }
            obtenerProducto();
        }
    }, [id, producto] )

    if (Object.keys(producto).length === 0 && !error) {
        return 'Loading...';
    }

    const { comentarios, creado, descripcion, empresa , nombre, url, urlimagen, votos, creador, haVotado } = producto;

    // Administrar y validar los votos 
    const votarProducto = () => {
        if(!usuario ) {
            return router.push('/login');
        }

        // obtener y sumar un nuevo voto
        const nuevoTotal = votos + 1; 
        
        // Verificar si el usuario actual ha votado
        if(haVotado.includes(usuario.uid)) return;

        // guardar el ID del usuario que ha votado 
        const nuevoHaVotado = [...haVotado, usuario.uid];

        // Actualizar a la base de datos
        firebase.db.collection('productos').doc(id).update({votos: nuevoTotal, haVotado:nuevoHaVotado});

        // Actualizar el state 
        guardarProducto({
            ...producto,
            votos: nuevoTotal
        })

        guardarConsultarDB(true); // hay un Voto, consultar a la base de datos
    }

    // Funciones para crear comentarios 
    const comentarioChange = e => {
        guardarComentario({
            ...comentario,
            [e.target.name]: e.target.value
        })
    } 

    // Identifica si el comentario es del creador 
    const esCreador = id => {
        if( creador.id == id ) {
            return true; 
        }
    }

    const agregarComentario = e => {
        e.preventDefault(); 

        if(!usuario) {
           return router.push('/login') 
        }

        // Informacion extra al comentario 
        comentario.usuarioId = usuario.uid;
        comentario.usuarioNombre = usuario.displayName;

        // Tomar copia de comentarios y agregarlos al arreglo 
        const nuevosComentarios = [...comentarios, comentario]; 

        // Actualizar la BD 
        firebase.db.collection('productos').doc(id).update({
            comentarios: nuevosComentarios
        })
        // Actualizar el state
        guardarProducto({
            ...producto,
            comentarios: nuevosComentarios
        })

        guardarConsultarDB(true); // hay un comentario, consultar a la base de datos
    }

    // Funcion que revisa que el creador del producto sea el mismo que esta autenticado
    const puedeBorrar = () => {
        if(!usuario) return false;

        if(creador.id === usuario.uid) {
            return true; 
        }
    }

    // eliminar producto de la base de datos 
    const eliminarProducto = async () => {

        if(!usuario) {
            return router.push('/login');
        }

        if(creador.id !== usuario.uid) {
            return router.push('/'); 
        }

        try {
            await firebase.db.collection('productos').doc(id).delete();
            router.push('/')
        } catch (error) {
            console.log('error');
        } 
    }

    return ( 
        <Layout>
            <>
                { error ?  <Error404 /> : (
                <div className="contenedor">
                    <h1 css={css`
                        text-align: center;
                        margin-top: 5rem; 
                    `}>{nombre}</h1>

                    <ContenedorProducto>
                        <div>
                            <p>Published on: {formatDistanceToNow( new Date(creado))}</p>
                            <p>By: {creador.nombre} from {empresa}</p>
                            <img src={urlimagen}/>
                            <p>{descripcion}</p>


                            {usuario && (
                            <>
                            <h2>Add a comment: </h2>
                            <form
                                onSubmit={agregarComentario}
                            >
                                <Campo>
                                    <input 
                                        type="text"
                                        name="mensaje"
                                        onChange={comentarioChange}
                                    />
                                </Campo>
                                <InputSubmit 
                                    type="submit"
                                    value="Publish Comment"
                                />
                            </form>
                            </>)}

                            <h2 css={css`
                                margin: 2rem 0;
                            `}>Comments</h2>
                            
                            {comentarios.length === 0 ? 'No comments yet' : (
                                <ul>
                                    {comentarios.map( (comentario, i) => (
                                        <li
                                            key={`${comentario.usuarioId}-${i}`}
                                            css={css`
                                                border: 1px solid #e1e1e1;
                                                padding: 2rem;
                                            `}
                                        >
                                            <p>{comentario.mensaje}</p>
                                            <p>Written by: <span
                                                css={css`
                                                    font-weight: bold;
                                                `}
                                            > {''} {comentario.usuarioNombre}</span></p>
                                            { esCreador( comentario.usuarioId ) && 
                                                <CreadorProducto>Creator</CreadorProducto>
                                            }
                                        </li>
                                    ))}
                                </ul>
                            )}
                            
                        </div>

                        <aside>
                            <Boton
                                target="_blank"
                                bgColor="true"
                                href={url}
                            >
                                Visit URL
                            </Boton>

                           
                           <div
                            css={css`
                                margin-top: 5rem;
                            `}
                           >
                                <p css={css`
                                    text-align: center;
                                `}>{votos} Votes</p>
                                {usuario && 
                                    <Boton
                                        onClick={votarProducto}
                                    >
                                        Vote
                                    </Boton>
                                }
                           </div>
                        </aside>
                    </ContenedorProducto>
                    {puedeBorrar() && 
                    <Boton
                        onClick={eliminarProducto}
                    >Delete Product
                    
                    </Boton>}
                </div>)}
            </>
        </Layout>
    );
}
 
export default Producto;