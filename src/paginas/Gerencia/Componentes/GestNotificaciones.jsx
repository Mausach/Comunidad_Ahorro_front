import { useState, useEffect } from "react";
import { CargarCuotasHoy } from "../Helpers/CargarCuotasHoy";
import { CardCuotasDia } from "./Subcomponente/CardCuotasDia";
import { CargarCuotasPactadas } from "../Helpers/CargarCuotasPactadas";
import CardCuotaPactada from "./Subcomponente/CardEntregasPactadas";

const GestNotificaciones = ({navigate}) => {
  const [cuotasHoy, setCuotasHoy] = useState([]);
  const [pactadas, setPactadas] = useState([]);//para entregas pactadas


  useEffect(() => {
    CargarCuotasHoy(setCuotasHoy,navigate)
    CargarCuotasPactadas(setPactadas,navigate)
  }, []);

  return (
    <>
    
     <CardCuotasDia cuotasHoy={cuotasHoy} />

{/* Mostrar cuotas pactadas */}
{pactadas.length > 0 ? (
        <CardCuotaPactada pactadas={pactadas} />
      ) : (
        <p className="text-muted">No hay cuotas pactadas disponibles.</p>
      )}
    
    </>
  
  );
};

export default GestNotificaciones;