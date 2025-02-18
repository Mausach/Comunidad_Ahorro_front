import React, { useEffect, useState } from 'react'
import { TablaClientes } from './Subcomponente/TablaClientes';
import { cargarClientes } from '../Helpers/CargarClientes';
import { ListaClientes } from './Subcomponente/ListaClientesCobranza';

export const GestCobranza = ({ navigate,usuario }) => {
     const [clientes, setClientes] = useState([]); //estado para el usuario
      


      useEffect(() => {

        
          cargarClientes(setClientes, navigate);
        
      }, [navigate]);
  return (
    <div>
<ListaClientes clientes={clientes}  navigate={navigate} usuario={usuario}/>
    </div>
  )
}