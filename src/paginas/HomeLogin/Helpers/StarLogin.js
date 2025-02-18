import Swal from 'sweetalert2';
import authApi from '../../../api/authApi';

export const starLogin = async (emailOrUsername, password, navigate) => {
  try {
    const resp = await authApi.post('/auth/login', {
      emailOrUsername,
      password
    });

    localStorage.setItem('token', resp.data.token);

    // Mapeo de roles a rutas
    const roleRoutes = {
      creator: '/creator',
      gerente: '/gerencia',
      admin: '/admin',
      supervisor_ventas: '/sup',
      vendedor: '/vendedor',
      cobrador: '/cobrador',
      cobrador_vendedor: '/cobrador_vendedor',
    };

    const userRole = resp.data.rol;

    // Validar si el rol existe en el mapeo
    if (roleRoutes[userRole]) {
      navigate(roleRoutes[userRole],{ state: resp.data.id });
      
    } else {
      // Rol desconocido o sin permisos
      Swal.fire({
        title: 'Acceso denegado',
        text: 'No tienes los permisos necesarios para acceder.',
        icon: 'error',
        background: '#f9f9f9',
        confirmButtonColor: '#ffc107',
        customClass: {
          title: 'swal2-title-custom',
          content: 'swal2-content-custom',
          confirmButton: 'swal2-confirm-custom',
        },
      });
    }

  } catch (error) {
   // Asegúrate de acceder correctamente a los errores
                 const errores = error.response?.data?.errors; // Obtén todos los errores
         
                 // Si tienes errores, muestra el mensaje de uno de los campos
                 if (errores) {
                     // Obtener el primer mensaje de error (puedes personalizar esto según el comportamiento)
                     const mensajeDeError = Object.values(errores)[0]?.msg || 'Error al logearse';
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
                     const errorMessage = error.response?.data?.msg || 'Error al loguearse';
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
}