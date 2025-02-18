import Swal from "sweetalert2";
import authApi from "../../../api/authApi";

export const CargarProductosClienteCuota = async (clienteId, setProductos, setCuotas, navigate) => {
    try {
      const resp = await authApi.get(`/geren/productos-cliente/${clienteId}`);
  
      if (resp.data && Array.isArray(resp.data.productos)) {
        setProductos(resp.data.productos);
  
        // Extraer cuotas solo de productos que las tengan (prestamos, planes, ventas permutadas)
        const cuotas = resp.data.productos
          .filter(producto => producto.cuotas) // Filtrar productos con cuotas
          .flatMap(producto => producto.cuotas); // Obtener todas las cuotas en un solo array
  
        setCuotas(cuotas);
      } else {
        console.error("La respuesta del backend no es válida:", resp.data);
      }
    } catch (error) {
      console.log(error.response?.data?.msg || "Error desconocido al cargar productos y cuotas");
  
      Swal.fire({
        title: "ERROR",
        text: error.response?.data?.msg || "Ocurrió un error inesperado.",
        icon: "error",
        background: "#f9f9f9",
        confirmButtonColor: "#ffc107",
        customClass: {
          title: "swal2-title-custom",
          content: "swal2-content-custom",
          confirmButton: "swal2-confirm-custom",
        },
      });
  
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/");
      }
    }
  };