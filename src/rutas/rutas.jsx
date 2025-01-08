import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { HomeLogin } from '../paginas/HomeLogin/HomeLogin'
import { Admin } from '../paginas/Admin/Admin'
import { Cobrador_vendedor } from '../paginas/Cobrador_Vendedor.jsx/Cobrador_vendedor'
import { Vendedor } from '../paginas/vendedor/Vendedor'
import { Supervisores } from '../paginas/Supervision/Supervisores'



export const AppRouter = () => {
    return (
      <BrowserRouter>
        <Routes>
  
          <Route path="/*" element={<HomeLogin/>} />
          <Route path="/admin" element = {<Admin/>} />
          <Route path="/cobrador_vendedor" element = {<Cobrador_vendedor/>} />
          <Route path="/vendedor" element = {<Vendedor/>} />
          <Route path="/sup" element = {<Supervisores/>} />
  
        </Routes>
      </BrowserRouter>
    )
  }