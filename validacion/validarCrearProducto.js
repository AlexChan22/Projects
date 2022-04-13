export default function validarProducto(valores) {
    let errores = {};

    // Validar el nombre del usuario 
    if(!valores.nombre) {
        errores.nombre = 'Your Name is required';
    }

    // Validar la empresa
    if(!valores.empresa) {
        errores.empresa = 'Company name is required';
    }

    // Validar la URL
    if (!valores.url) {
        errores.url = "Product URL is required";
    } else if (!/^(ftp|http|https):\/\/[^ "]+$/.test(valores.url) ) {
        errores.url = 'URL Format is not correct';
    }

    // Validar descripcion 
    if(!valores.descripcion) {
        errores.descripcion = "What's your product description?"
    }
    return errores;

}