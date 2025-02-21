import Swal from "sweetalert2";
import authApi from "../../../api/authApi";

export const starCobroCuotaRendicion = async (updatedCuota, setRefreshData, navigate) => {
    console.log("Datos enviados:", updatedCuota);

    try {
        const resp = await authApi.put('/geren/edit-cuota-rend', updatedCuota);
        
        console.log("Respuesta del servidor:", resp);

        // Si la respuesta tiene un status 200-299, mostrar éxito
        if (resp.status >= 200 && resp.status < 300) {
            Swal.fire({
                title: "Cuota actualizada",
                text: "Los cambios han sido guardados correctamente.",
                icon: "success",
                background: "#f9f9f9",
                confirmButtonColor: "#ffc107",
                customClass: {
                    title: "swal2-title-custom",
                    content: "swal2-content-custom",
                    confirmButton: "swal2-confirm-custom",
                },
            });

            setRefreshData(true);
        } else {
            throw new Error("Respuesta no exitosa del servidor.");
        }
        
    } catch (error) {
        console.error("Error en la petición:", error);

        let mensajeDeError = "Error al actualizar datos";

        if (error.response) {
            // Si hay respuesta del backend, intenta obtener el mensaje de error
            mensajeDeError = error.response.data?.msg || mensajeDeError;

            const errores = error.response.data?.errors;
            if (errores) {
                mensajeDeError = Object.values(errores)[0]?.msg || mensajeDeError;
            }

            // Verificar si el error es por sesión expirada (401)
            if (error.response.status === 401) {
                localStorage.removeItem('token');
                navigate('/login');
                return;
            }
        }

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
    }
};