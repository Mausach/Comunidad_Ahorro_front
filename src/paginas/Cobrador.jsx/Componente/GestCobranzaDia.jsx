import { useState, useEffect } from "react";
import CardCuotasHoyCob from "./CardCuotasHoy";
import { CargarCuotasHoyCob } from "../Helper/CargarCuotasHoyCob";




const GestCobranzaDia = ({ navigate, usuario }) => {
    const [cuotasHoy, setCuotasHoy] = useState([]);
    const [refreshData, setRefreshData] = useState(false);//estado para refrescar


    useEffect(() => {
        if (refreshData) {
            CargarCuotasHoyCob (usuario, setCuotasHoy, navigate)

            setRefreshData(false);
        } else {
            CargarCuotasHoyCob (usuario, setCuotasHoy, navigate)
        }
    }, [navigate, refreshData]);



    return (
        <>

            <CardCuotasHoyCob cuotasHoy={cuotasHoy} setRefreshData={setRefreshData} navigate={navigate} usuario={usuario} />


        </>

    );
};

export default GestCobranzaDia;