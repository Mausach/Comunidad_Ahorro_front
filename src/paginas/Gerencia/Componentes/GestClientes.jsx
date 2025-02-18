import React, { useEffect, useState } from 'react'
import { TablaClientes } from './Subcomponente/TablaClientes';
import { cargarClientes } from '../Helpers/CargarClientes';

export const GestClientes = ({ navigate }) => {
     const [clientes, setClientes] = useState([]); //estado para el usuario
      const [refreshData, setRefreshData] = useState(false);//estado para refrescar


      useEffect(() => {
        if (refreshData) {
          cargarClientes(setClientes, navigate);
          setRefreshData(false);
        } else {
          cargarClientes(setClientes, navigate);
        }
      }, [navigate, refreshData]);
  return (
    <div>
<TablaClientes clientes={clientes} setRefreshData={setRefreshData} navigate={navigate}/>
    </div>
  )
}
