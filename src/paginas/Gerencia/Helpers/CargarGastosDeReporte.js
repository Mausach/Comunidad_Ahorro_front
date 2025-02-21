import Swal from "sweetalert2";
import authApi from "../../../api/authApi";


export const CargarGastosDeReporte= async (reporteId,setGastos, navigate) => {
    console.log(reporteId)
    try {
      const resp = await authApi.get(`/geren/gastos-report/${reporteId}`); // Petición al backend
  
      // Verificar si la respuesta es válida
      if (resp.data && Array.isArray(resp.data.gastos)) {
        setGastos(resp.data.gastos); // Actualiza el estado con los datos
      } else {
        console.error('La respuesta del servidor no es válida:', resp.data);
        Swal.fire({
          title: 'ERROR',
          text: 'La respuesta del servidor no es válida.',
          icon: 'error',
          background: '#f9f9f9',
          confirmButtonColor: '#ffc107',
        });
      }
    } catch (error) {
      console.error('Error al cargar las cuotas pactadas:', error.response?.data?.msg || error.message);
  
      Swal.fire({
        title: 'ERROR',
        text: error.response?.data?.msg || 'Ocurrió un error inesperado.',
        icon: 'error',
        background: '#f9f9f9',
        confirmButtonColor: '#ffc107',
      });
  
      // Manejo de error 401 (no autenticado)
      if (error.response?.status === 401) {
        localStorage.removeItem('token'); // Elimina el token
        navigate('/'); // Redirige al login
      }
    }
  };