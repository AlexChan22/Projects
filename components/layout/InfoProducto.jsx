import React from 'react'

const InfoProducto = ({producto}) => {
    const { id, comentarios, creado, descripcion, empresa , nombre, url, urlimagen, votos } = producto;


    
    return (
        <h2>Desde Producto</h2>
     );
}
 
export default InfoProducto;