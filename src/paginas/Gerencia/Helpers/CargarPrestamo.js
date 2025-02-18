import Swal from "sweetalert2";
import authApi from "../../../api/authApi";


export const CargarPrestamo = async (setPrestamos, navigate) => {
    try {
      const resp = await authApi.get('/geren/Prestamo'); // Petición al backend
  
      // Validar si la respuesta contiene un array de usuarios
      if (Array.isArray(resp.data.prestamoEstructura)) {
        setPrestamos(resp.data.prestamoEstructura); // Actualiza el estado con los usuarios
      } else {
        console.error('Los datos del prestamo no son un array:', resp.data);
        setPrestamos(resp.data.prestamoEstructura)
      }
    } catch (error) {
     // Asegúrate de acceder correctamente a los errores
                   const errores = error.response?.data?.errors; // Obtén todos los errores
           
                   // Si tienes errores, muestra el mensaje de uno de los campos
                   if (errores) {
                       // Obtener el primer mensaje de error (puedes personalizar esto según el comportamiento)
                       const mensajeDeError = Object.values(errores)[0]?.msg || 'Error al cargar prestamos ';
                       console.log(mensajeDeError);
           
                       Swal.fire({
                           title: "ERROR",
                           text: mensajeDeError,
                           icon: "error",
                           background: "#f9f9f9",
                           confirmButtonColor: "#ffc107",
                           customClass: {
                               title: "swal2-title-custom",
                               content: "swal2-content-custom",
                               confirmButton: "swal2-confirm-custom",
                           },
                       });
                   } else {
                       // Si no hay errores, usar el mensaje genérico
                       const errorMessage = error.response?.data?.msg || 'Error a cargar prestamos 2 ';
                       Swal.fire({
                           title: "ERROR",
                           text: errorMessage,
                           icon: "error",
                           background: "#f9f9f9",
                           confirmButtonColor: "#ffc107",
                           customClass: {
                               title: "swal2-title-custom",
                               content: "swal2-content-custom",
                               confirmButton: "swal2-confirm-custom",
                           },
                       });
                   }
           
                   // Verificar si el error es una sesión expirada (401) y redirigir al login
                   if (error.response?.status === 401) {
                       localStorage.removeItem('token');
                       navigate('/');
                   }
    }
  };