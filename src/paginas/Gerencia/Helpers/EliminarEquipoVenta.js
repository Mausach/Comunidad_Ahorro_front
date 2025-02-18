import Swal from "sweetalert2";
import authApi from "../../../api/authApi";

export const starEliminarEquipoVenta = async (equipoId, setRefreshData, navigate) => {
  try {
    const resp = await authApi.delete(`/geren/delete-equipo-venta/${equipoId}`);

    Swal.fire({
      title: "Equipo eliminado",
      text: "El equipo ha sido eliminado exitosamente.",
      icon: "success",
      background: "#f9f9f9",
      confirmButtonColor: "#ffc107",
      customClass: {
        title: "swal2-title-custom",
        content: "swal2-content-custom",
        confirmButton: "swal2-confirm-custom",
      },
    });

    setRefreshData(true); // Actualizar la lista de equipos
  } catch (error) {
    const errorMessage = error.response?.data?.msg || "Error al eliminar el equipo";
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

    // Verificar si el error es una sesión expirada (401) y redirigir al login
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  }
};