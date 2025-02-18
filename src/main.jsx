import React from 'react'
import ReactDOM from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.css'; // Importa los estilos CSS de Bootstrap
import 'bootstrap-icons/font/bootstrap-icons.css'; // Importa los estilos CSS de Bootstrap Icons
import App from './App.jsx'
import "./ccs/style.css"
import { Footer } from './componentes/Footer.jsx';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <Footer/>
  </React.StrictMode>,
)
