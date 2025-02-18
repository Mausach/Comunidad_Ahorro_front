import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { Accordion, Form, Modal } from 'react-bootstrap';
import { starEditarProductos } from '../../Helpers/EditProductos';
import { habilitarProducto } from '../../Helpers/habilitarProducto';
import { deshabilitarProducto } from '../../Helpers/DeshabilitarProducto';
import Swal from 'sweetalert2';

export const Card_Planes = ({ productos, setRefreshData, navigate }) => {
  const {

    nombre,
    descripcion,
    venta_directa_bandera,
    venta_permutada_bandera,
    accesorio_bandera,
    servicio_bandera,
    plan_bandera,
    plan_descripcion,
    cantidad_cuotas_plan,
    monto_cuotas_plan,
    entrega_pactada_bandera,
    cuotas_entrega_pactada,
    estado_producto,
  } = productos;

  const [productoEdit, setProductoEdit] = useState(productos);

  const [showModal, setShowModal] = useState(false);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);



  //maneja cambios en el formulario
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductoEdit((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleActivate = (productos) => {
    Swal.fire({
      title: '¿Desea activar este producto?',
      text: `${productos.nombre} ${productos.descripcion}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, activar',
    }).then((result) => {
      if (result.isConfirmed) {
        //ActivateUser(user.id);
        habilitarProducto(productos.id)

        setRefreshData(true);
        console.log(productos.id, productos.estado_producto)
      }
    });
  };

  const handleDeactivate = (productos) => {
    Swal.fire({
      title: '¿Inhabilitar este producto?',
      text: `${productos.nombre} ${productos.descripcion}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, dar de baja',
    }).then((result) => {
      if (result.isConfirmed) {
        //DeactivateUser(user.id);
        deshabilitarProducto(productos.id)
        console.log(productos.id, productos.estado_producto)
        setRefreshData(true);
      }
    });
  };

  const handleUpdatePlan = (e) => {
    e.preventDefault();
    const form = e.target;

    const updatedPlan = {
      id: productoEdit.id,
      nombre: form.nombre?.value || productoEdit.nombre,
      descripcion: form.descripcion?.value || productoEdit.descripcion,
      venta_directa_bandera: form.venta_directa_bandera?.checked || false,
      venta_permutada_bandera: form.venta_permutada_bandera?.checked || false,
      accesorio_bandera: form.accesorio_bandera?.checked || false,
      servicio_bandera: form.servicio_bandera?.checked || false,
      plan_bandera: form.plan_bandera?.checked || false,
      tipo_cobranza_prestamo: form.tipo_cobranza_prestamo?.value,
      monto_max_prestar: form.monto_max_prestar?.value || productoEdit.monto_max_prestar,
      plan_descripcion: form.plan_descripcion?.value || productoEdit.plan_descripcion,
      cantidad_cuotas_plan: form.cantidad_cuotas_plan?.value || productoEdit.cantidad_cuotas_plan,
      monto_cuotas_plan: form.monto_cuotas_plan?.value || productoEdit.monto_cuotas_plan,
      entrega_pactada_bandera: form.entrega_pactada_bandera?.checked || false,
      cuotas_entrega_pactada: form.cuotas_entrega_pactada?.value
        ? form.cuotas_entrega_pactada.value.split(',').map((cuota) => cuota.trim())
        : productoEdit.cuotas_entrega_pactada,
      // Puedes añadir otros campos necesarios aquí
    };

    // Validar nombre
    if (!updatedPlan.nombre || updatedPlan.nombre.trim().length < 7) {

      Swal.fire({
        icon: 'error',
        title: 'Nombre no valido',
        text: 'El nombre debe tener al menos 7 caracteres.',
      });
      return;
    }

    // Validar descripción
    if (!updatedPlan.descripcion || updatedPlan.descripcion.trim().length < 8) {

      Swal.fire({
        icon: 'error',
        title: 'Descripcion no valida',
        text: 'La descripción debe tener al menos 8 caracteres.',
      });
      return;

    }

    // Validar plan si está marcado
    if (updatedPlan.plan_bandera) {
      if (!updatedPlan.plan_descripcion || updatedPlan.plan_descripcion.trim().length < 8) {

        Swal.fire({
          icon: 'error',
          title: 'Descripcion del plan no valida',
          text: 'La descripción del plan debe tener al menos 8 caracteres.',
        });
        return;

      }
      if (!updatedPlan.cantidad_cuotas_plan || updatedPlan.cantidad_cuotas_plan <= 0) {

        Swal.fire({
          icon: 'error',
          title: 'Cantidad de cuotas no valido',
          text: 'La cantidad de cuotas debe ser mayor a 0.',
        });
        return;

      }
      if (!updatedPlan.monto_cuotas_plan || updatedPlan.monto_cuotas_plan <= 0) {


        Swal.fire({
          icon: 'error',
          title: 'Monto de cuotas no valido',
          text: 'El monto de las cuotas debe ser mayor a 0.',
        });
        return;


      }
    }

    // Validar entrega pactada si está marcada
    // Validar entrega pactada si está marcada
    if (updatedPlan.entrega_pactada_bandera) {
      if (
        !updatedPlan.cuotas_entrega_pactada ||
        updatedPlan.cuotas_entrega_pactada.length === 0
      ) {
        Swal.fire({
          icon: 'error',
          title: 'Cuotas para la entrega no válidas',
          text: 'Debe ingresar al menos una cuota para la entrega pactada.',
        });
        return;
      }

      // Validar que las cuotas no contengan ceros ni valores repetidos
      const cuotasUnicas = [...new Set(updatedPlan.cuotas_entrega_pactada.map(Number))];
      const contieneCero = cuotasUnicas.includes(0);

      if (contieneCero) {
        Swal.fire({
          icon: 'error',
          title: 'Cuotas inválidas',
          text: 'Las cuotas no pueden contener el valor 0.',
        });
        return;
      }

      if (cuotasUnicas.length !== updatedPlan.cuotas_entrega_pactada.length) {
        Swal.fire({
          icon: 'error',
          title: 'Cuotas duplicadas',
          text: 'No puede ingresar cuotas repetidas.',
        });
        return;
      }
    }


    console.log('Plan actualizado:', updatedPlan);

    // Actualizar el usuario
    starEditarProductos(updatedPlan, setRefreshData, navigate);
    setShowModal(false);


  };

  return (
    <div className="card-container">
      <Card
        className="card p-3 mb-5 bg-white m-3 col-3 p-2 col-md-4 col-xl-3 shadow-lg  rounded-start-5"
        border="light"
        style={{ width: '20rem', height: '30rem', overflow: 'auto' }}
      >

        <Card.Title className="text-center">{nombre}</Card.Title>
        <hr />
        {/* Información Principal del Producto */}
        <Card.Body>


          <Card.Text>{descripcion || 'Sin descripción disponible.'}</Card.Text>
          <hr />

          {/* Modalidades del Producto */}
          <div>
            <h6>Modalidades:</h6>
            <ul>
              <li>
                Venta Directa: <strong>{venta_directa_bandera ? 'Sí' : 'No'}</strong>
              </li>
              <li>
                Accesorio: <strong>{accesorio_bandera ? 'Sí' : 'No'}</strong>
              </li>
              <li>
                Servicio: <strong>{servicio_bandera ? 'Sí' : 'No'}</strong>
              </li>
              <li>
                Venta Permutada: <strong>{venta_permutada_bandera ? 'Sí' : 'No'}</strong>
              </li>
              <li>
                Plan: <strong>{plan_bandera ? 'Sí' : 'No'}</strong>
              </li>
            </ul>
          </div>

          {/* Información Adicional del Plan */}
          {plan_bandera && (
            <>
              <hr />
              <div>
                <h6>Detalles del Plan:</h6>
                <p>
                  Descripción: <strong>{plan_descripcion || 'No especificada'}</strong>
                </p>
                <p>
                  Cuotas: <strong>{cantidad_cuotas_plan || 'N/A'}</strong>
                </p>
                <p>
                  Monto por Cuota: <strong>{monto_cuotas_plan ? `$${monto_cuotas_plan}` : 'N/A'}</strong>
                </p>
              </div>
            </>
          )}

          {/* Información de Entrega Pactada */}
          {entrega_pactada_bandera && (
            <>
              <hr />
              <div>
                <h6>Entrega Pactada:</h6>
                <p>
                  Disponible: <strong>{entrega_pactada_bandera ? 'Sí' : 'No'}</strong>
                </p>
                <p>
                  Cuotas: <strong>{cuotas_entrega_pactada ? cuotas_entrega_pactada.join(', ') : 'N/A'}</strong>
                </p>
              </div>
            </>
          )}

          <div className="d-flex flex-column gap-2">
            {productos.estado_producto ? (
              <Button variant="danger" onClick={() => handleDeactivate(productos)}>
                Baja de producto
              </Button>
            ) : (
              <Button variant="success" onClick={() => handleActivate(productos)}>
                Activar producto
              </Button>
            )}

            <Button variant="primary" onClick={handleShow}>
              Editar plan
            </Button>
          </div>


        </Card.Body>
      </Card>

      {/* Modal para Editar Plan */}

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Crear un Nuevo Producto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdatePlan}>
            {/* Nombre */}
            <Form.Group controlId="nombre">
              <Form.Label>Nombre del Producto</Form.Label>
              <Form.Control
                type="text"
                minLength={7}
                maxLength={30}
                placeholder="Ingrese el nombre"
                defaultValue={productoEdit.nombre || ''}
                onChange={handleChange}
              />
            </Form.Group>

            {/* Descripción */}
            <Form.Group controlId="descripcion" className="mt-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                minLength={8}
                placeholder="Ingrese una descripción"
                defaultValue={productoEdit.descripcion || ''}
                onChange={handleChange}
              />
            </Form.Group>

            {/* Checkbox para Plan */}
            <Form.Group controlId="plan_bandera" className="mt-3">
              <Form.Check
                type="checkbox"
                label="¿Es un plan?"
                checked={productoEdit.plan_bandera}
                onChange={(e) => setProductoEdit({ ...productoEdit, plan_bandera: e.target.checked })}
              />
            </Form.Group>

            {/* Acordeón para Plan */}
            {productoEdit.plan_bandera && (
              <Accordion defaultActiveKey="0" className="mt-3">
                <Accordion.Item eventKey="0">
                  <Accordion.Header>Detalles del Plan</Accordion.Header>
                  <Accordion.Body>
                    <Form.Group controlId="plan_descripcion">
                      <Form.Label>Descripción del Plan</Form.Label>
                      <Form.Control
                        type="text"
                        minLength={8}
                        placeholder="Ingrese la descripción del plan"
                        defaultValue={productoEdit.plan_descripcion}
                        onChange={handleChange}
                      />
                    </Form.Group>
                    <Form.Group controlId="cantidad_cuotas_plan" className="mt-3">
                      <Form.Label>Cantidad de Cuotas</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Ingrese la cantidad de cuotas"
                        defaultValue={productoEdit.cantidad_cuotas_plan}
                        onChange={handleChange}
                      />
                    </Form.Group>
                    <Form.Group controlId="monto_cuotas_plan" className="mt-3">
                      <Form.Label>Monto de las Cuotas</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Ingrese el monto de las cuotas"
                        defaultValue={productoEdit.monto_cuotas_plan}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            )}

            {/* Checkbox para Entrega Pactada */}
            <Form.Group controlId="entrega_pactada_bandera" className="mt-3">
              <Form.Check
                type="checkbox"
                label="¿Es una entrega pactada?"
                checked={productoEdit.entrega_pactada_bandera}
                onChange={(e) => setProductoEdit({ ...productoEdit, entrega_pactada_bandera: e.target.checked })}
              />
            </Form.Group>

            {/* Acordeón para Entrega Pactada */}
            {productoEdit.entrega_pactada_bandera && (
              <Accordion defaultActiveKey="0" className="mt-3">
                <Accordion.Item eventKey="1">
                  <Accordion.Header>Detalles de Entrega Pactada</Accordion.Header>
                  <Accordion.Body>
                    <Form.Group controlId="cuotas_entrega_pactada">
                      <Form.Label>Cuotas de Entrega Pactada</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Ejemplo: 3,5,7,9,12"
                        defaultValue={productoEdit.cuotas_entrega_pactada || ''}
                        onChange={(e) => {
                          const cuotas = e.target.value
                            .split(',')
                            .map((item) => item.trim());
                          setProductoEdit({
                            ...productoEdit,
                            cuotas_entrega_pactada: cuotas,
                          });
                        }}
                      />
                    </Form.Group>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            )}

            {/* Checkbox para Venta Directa */}
            <Form.Group controlId="venta_directa_bandera" className="mt-3">
              <Form.Check
                type="checkbox"
                label="¿Es venta directa?"
                checked={productoEdit.venta_directa_bandera}
                onChange={(e) => setProductoEdit({ ...productoEdit, venta_directa_bandera: e.target.checked })}
              />
            </Form.Group>

            {/* Checkbox para Venta Permutada */}
            <Form.Group controlId="venta_permutada_bandera" className="mt-3">
              <Form.Check
                type="checkbox"
                label="¿Es venta permutada?"
                checked={productoEdit.venta_permutada_bandera}
                onChange={(e) => setProductoEdit({ ...productoEdit, venta_permutada_bandera: e.target.checked })}
              />
            </Form.Group>

            {/* Checkbox para Accesorios */}
            <Form.Group controlId="accesorio_bandera" className="mt-3">
              <Form.Check
                type="checkbox"
                label="¿Es un accesorio?"
                checked={productoEdit.accesorio_bandera}
                onChange={(e) => setProductoEdit({ ...productoEdit, accesorio_bandera: e.target.checked })}
              />
            </Form.Group>

            {/* Checkbox para Servicios */}
            <Form.Group controlId="servicio_bandera" className="mt-3">
              <Form.Check
                type="checkbox"
                label="¿Es un servicio?"
                checked={productoEdit.servicio_bandera}
                onChange={(e) => setProductoEdit({ ...productoEdit, servicio_bandera: e.target.checked })}
              />
            </Form.Group>

            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Cancelar
              </Button>
              <Button variant="dark" type="submit">
                Guardar Cambios
              </Button>
            </Modal.Footer>

          </Form>
        </Modal.Body>

      </Modal>


    </div>
  );
};