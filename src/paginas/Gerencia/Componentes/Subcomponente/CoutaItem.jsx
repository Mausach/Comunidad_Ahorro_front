import React, { useState } from "react";
import { Button, Form, Badge, ListGroup } from "react-bootstrap";
import { starCobroCuotaRendicion } from "../../Helpers/CobroCuota";
import Swal from "sweetalert2";

const CuotaItem = ({ cuota, index, producto, cliente, setRefreshData, navigate, usuario }) => {
    const [activeForm, setActiveForm] = useState(null); // null, "pagar" o "pendiente"
    const [metodoPago, setMetodoPago] = useState("");
    const [montoCobrado, setMontoCobrado] = useState(0);
    const [comentario, setComentario] = useState("");
    const [botonesOcultos, setBotonesOcultos] = useState(false);
    const [fechaCobro, setFechaCobro] = useState("");  // NUEVO: Estado para la fecha

    const handlePagar = (e) => {
        e.preventDefault();

        if (!metodoPago.trim()) {
            Swal.fire({
                icon: 'error',
                title: 'Metodo de pago vacía',
                text: 'El método de pago no puede estar vacío.',
            });
            return;
        }

        const updatedCuota = {
            cuotaId: cuota.id,
            cat: producto.cat,
            reporteId: producto.reporteId,
            estado: "pago",
            cobradoId: usuario,
            comentario,
            metodoPago,
            monto_cobrado: cuota.monto_cuota,
            nombrecli: cliente.nombre,
            apecli: cliente.apellido,
            nombreProd: producto.nombre,
            productId: producto.id,
        };
        console.log("cuota par abackend", updatedCuota);
        starCobroCuotaRendicion(updatedCuota, setRefreshData, navigate);
        setActiveForm(null);
        setBotonesOcultos(false);
    };

    const handlePendiente = (e) => {
        e.preventDefault();
    
        if (!comentario.trim()) {
            Swal.fire({
                icon: 'error',
                title: 'Comentario vacío',
                text: 'El comentario no puede estar vacío.',
            });
            return;
        }
    
        if (!fechaCobro.trim()) {
            Swal.fire({
                icon: 'error',
                title: 'Fecha no seleccionada',
                text: 'Debes seleccionar una fecha de cobro.',
            });
            return;
        }

        if(montoCobrado){
            
        if (montoCobrado > cuota.monto_cuota) {
            Swal.fire({
                icon: 'Error',
                title: 'Monto superior',
                text: 'Debes ingresar un monto correcto.',
            });
            return;
        }

        }
    
        const updatedCuota = {
            cuotaId: cuota.id,
            cat: producto.cat,
            reporteId: producto.reporteId,
            estado: "pendiente",
            cobradoId: usuario,
            comentario,
            metodoPago,
            monto_cobrado: montoCobrado,
            fecha_cobro: fechaCobro, // NUEVO: Se envía la fecha al backend
            nombrecli: cliente.nombre,
            apecli: cliente.apellido,
            nombreProd: producto.nombre,
            productId: producto.id,
        };
    
        console.log("Cuota para backend", updatedCuota);
        starCobroCuotaRendicion(updatedCuota, setRefreshData, navigate);
        setActiveForm(null);
        setBotonesOcultos(false);
    };

    const handleNoPago = (e) => {
        e.preventDefault();

        const updatedCuota = {
            cuotaId: cuota.id,
            cat: producto.cat,
            reporteId: producto.reporteId,
            estado: "no pago",
            cobradoId: usuario,
            comentario,
            metodoPago,
            monto_cobrado: cuota.monto_cuota,
            nombrecli: cliente.nombre,
            apecli: cliente.apellido,
            nombreProd: producto.nombre,
            productId: producto.id,
        };
        console.log("cuota par abackend", updatedCuota);
        starCobroCuotaRendicion(updatedCuota, setRefreshData, navigate);
        setActiveForm(null);
        setBotonesOcultos(false);
    };

    return (
        <ListGroup.Item className="d-flex justify-content-between align-items-center">
            <div>
                <p className="mb-1"><strong>Cuota {cuota.numero_cuota}</strong></p>
                <p className="mb-1"><strong>Monto:</strong> ${cuota.monto_cuota}</p>
                <p className="mb-1"><strong>Fecha de Pago:</strong> {new Date(cuota.fecha_cobro).toLocaleDateString()}</p>
                <strong>Fecha de Pago:</strong>{" "}
  {new Date(cuota.fecha_cobro).toLocaleDateString("es-AR", {
    timeZone: "America/Argentina/Buenos_Aires", // Zona horaria de Argentina (UTC-3)
  })}
                <Badge bg={cuota.estado === "pago" ? "success" : cuota.estado === "inpago" ? "warning" : cuota.estado === "no pago" ? "danger" : "secondary"}>
                    {cuota.estado.charAt(0).toUpperCase() + cuota.estado.slice(1)}
                </Badge>
            </div>

            {(cuota.estado === "inpago" || cuota.estado === "pendiente") && (
                <div>
                    {!botonesOcultos && (
                        <>
                            <Button variant="success" size="sm" className="me-2" onClick={() => { setActiveForm("pagar"); setBotonesOcultos(true); }}>Pagar</Button>
                            <Button variant="secondary" size="sm" className="me-2" onClick={() => { setActiveForm("pendiente"); setBotonesOcultos(true); }}>Pendiente</Button>
                            <Button variant="danger" size="sm" onClick={handleNoPago}>No Pago</Button>
                        </>
                    )}

                    {/* Formulario de Pago */}
                    {activeForm === "pagar" && (
                        <Form.Group className="mt-2">
                            <Form.Control
                                type="text"
                                placeholder="Método de pago"
                                value={metodoPago}
                                onChange={(e) => setMetodoPago(e.target.value)}
                                className="mb-2"
                            />
                            <Button variant="primary" size="sm" onClick={handlePagar} className="me-2">
                                Confirmar Pago
                            </Button>
                            <Button variant="secondary" size="sm" onClick={() => {
                                setActiveForm(null);
                                setBotonesOcultos(false); // Asegurar que los botones se vuelvan a mostrar
                            }}>
                                Cancelar
                            </Button>
                        </Form.Group>
                    )}

                    {/* Formulario de Pendiente */}
                    {activeForm === "pendiente" && (
                        <Form.Group className="mt-2">
                            <Form.Control
                                type="number"
                                placeholder="Monto cobrado"
                                value={montoCobrado}
                                onChange={(e) => setMontoCobrado(e.target.value)}
                                className="mb-2"
                            />
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Comentario"
                                value={comentario}
                                onChange={(e) => setComentario(e.target.value)}
                                className="mb-2"
                            />
                            <Form.Control
                                type="text"
                                placeholder="Método de Pago"
                                value={metodoPago}
                                onChange={(e) => setMetodoPago(e.target.value)}
                                className="mb-2"
                            />
                            <Form.Control
                                type="date"
                                value={fechaCobro}
                                onChange={(e) => setFechaCobro(e.target.value)}
                                className="mb-2"
                            />
                            <Button variant="primary" size="sm" onClick={handlePendiente} className="me-2">
                                Confirmar Pendiente
                            </Button>
                            <Button variant="secondary" size="sm" onClick={() => {
                                setActiveForm(null);
                                setBotonesOcultos(false); // Asegurar que los botones se vuelvan a mostrar
                            }}>
                                Cancelar
                            </Button>
                        </Form.Group>
                    )}
                </div>
            )}
        </ListGroup.Item>
    );
};

export default CuotaItem;