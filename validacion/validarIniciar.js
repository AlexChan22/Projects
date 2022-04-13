export default function validarIniciar(valores) {
    let errores = {};

    // validar el email
    if(!valores.email) {
        errores.email = 'Your email is required';
    } else if ( !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(valores.email)) {
        errores.email = "Email not valid"
    }

    // Validar el password 
    if (!valores.password) {
        errores.password = "A Password is required";
    } else if (valores.password.length < 6) {
        errores.password = 'Your Password should have at least 6 characters'
    }

    return errores;

}