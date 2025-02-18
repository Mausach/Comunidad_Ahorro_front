import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Swal from 'sweetalert2';
import { CargarUsuarios } from '../Helpers/CargarUsuarios';
import { CargarRoles } from '../Helpers/CargarRoles';
import { habilitarUsuario } from '../Helpers/HabilitarUsiario';
import { deshabilitarUsuario } from '../Helpers/DeshabilitarUsuario';
import { ModalCrearUsuario } from './Subcomponente/ModalCrearUsuario';
import { ModalEditUsuarios } from './Subcomponente/ModalEditUsuarios';
import { ListGroup, Modal } from 'react-bootstrap';
import ModalCrearEquipoVenta from './Subcomponente/ModalCrearEquipoVenta';
import { CargarEquiposVenta } from '../Helpers/CargarEquipoDeVentas';
import CardsEquiposVentas from './Subcomponente/CardsEquipoDeVentas';



//falta modularizar bien y dividir en otros respectivos componentes tambien validar bien los datos al editar
export const Gestion_Empleados = ({ navigate }) => {
  const [users, setUsers] = useState([]); //estado para el usuario
  const [roles, setRoles] = useState([]); // Estado para roles disponibles
  const [equipos, setEquipos] = useState([]); //equipos de venta
  const [showModal, setShowModal] = useState(false);//para modal de datos personales
  const [showModalER, setShowModalER] = useState(false);//para modal de datos redimiento
  const [selectedUser, setSelectedUser] = useState(null);//usuario seleccionado
  const [searchTerm, setSearchTerm] = useState('');//estado para buscador
  const [refreshData, setRefreshData] = useState(false);//estado para refrescar
  const [showCreateModal, setShowCreateModal] = useState(false); // Modal para crear usuario
  const [showCreateEquipoven, setShowCreateEquipoven] = useState(false); // Modal para crear equipos de venta
  const [showDetailsModal, setShowDetailsModal] = useState(false);// Modal par amostrar datos de  los usuarios


  //para editar datos personales
  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };
  //editar datos de rendimiento
  const handleCloseModalER = () => setShowModalER(false);
  const handleShowModalER = (user) => {
    setSelectedUser(user);
    setShowModalER(true);
  };


  //paramodl crear equipo de venta
  const handleShowCreateEquipo = () => setShowCreateEquipoven(true);
  const handleCloseCreateEquipo = () => setShowCreateEquipoven(false);

  //paramodl crear usuarios
  const handleShowCreateModal = () => setShowCreateModal(true);
  const handleCloseCreateModal = () => setShowCreateModal(false);

  const handleCloseDetailsModal = () => setShowDetailsModal(false);
  const handleShowDetailsModal = (user) => {
    setSelectedUser(user);
    setShowDetailsModal(true);
  };


  //para el buscador
  const filteredUsers = users.filter(user => //para filtrar el usuario
    Object.values(user).some(value =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  //habilita al usuario
  const handleActivate = (user) => {
    Swal.fire({
      title: '¿Habilitar este usuario?',
      text: `${user.nombres} ${user.apellido}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, habilitar',
    }).then((result) => {
      if (result.isConfirmed) {
        //ActivateUser(user.id);
        habilitarUsuario(user.id)
        console.log(user.id)
        setRefreshData(true);
      }
    });
  };
  //deshabilita al usuario
  const handleDeactivate = (user) => {
    Swal.fire({
      title: '¿Inhabilitar este usuario?',
      text: `${user.nombres} ${user.apellido}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, inhabilitar',
    }).then((result) => {
      if (result.isConfirmed) {
        //DeactivateUser(user.id);
        deshabilitarUsuario(user.id)
        console.log(user.id)
        setRefreshData(true);
      }
    });
  };


  //formatea la fecha para la tabla
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'; // Maneja valores nulos o indefinidos
    const date = new Date(dateString);
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return date.toLocaleDateString('es-AR', options); // Cambiado a 'es-AR'
  };


  useEffect(() => {
    if (refreshData) {
      CargarUsuarios(setUsers, navigate);
      CargarRoles(setRoles, navigate);
      CargarEquiposVenta(setEquipos, navigate)

      setRefreshData(false);
    } else {
      CargarUsuarios(setUsers, navigate);
      CargarRoles(setRoles, navigate);
      CargarEquiposVenta(setEquipos, navigate)
    }
  }, [navigate, refreshData]);

  return (
    <>
      <div className="p-4">
        <h2>Gestión de Usuarios</h2>

        {/*Buscador*/}
        <Form.Group className="mb-3">
          <Form.Control
            type="text"
            placeholder="Buscar usuario..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Form.Group>

        <div className="d-flex gap-2 mb-2">

          {/* tabla de usuario y booton crear */}
          <Button variant="primary" className='mb-3 rounded-3' onClick={handleShowCreateModal}>
            Crear Nuevo Usuario
          </Button>

          {/* tabla de usuario y booton crear */}
          <Button variant="primary" className='mb-3 rounded-3' onClick={handleShowCreateEquipo}>
            Crear Nuevo Equipo de Venta
          </Button>

        </div>


        {/*lista empleado*/}
        <ListGroup className="card text-dark shadow p-3 mb-5 bg-white rounded m-3">
  {filteredUsers.length > 0 ? (
    filteredUsers
      .sort((a, b) => a.apellido.localeCompare(b.apellido)) // Ordenar por apellido A-Z
      .map((user) => (
        <ListGroup.Item key={user.id} className="d-flex justify-content-between align-items-center">
          <div className="row w-100">
            <div className="col-8">
              <span>
                {user.nombres} {user.apellido}
              </span>
            </div>

            <div className="col-4">
              {/* Contenedor de botones en fila */}
              <div className="d-flex flex-wrap justify-content-end">
                {/* Ver detalles */}
                <Button variant="outline-primary" onClick={() => handleShowDetailsModal(user)} className="me-2 mb-2">
                  <i className="bi bi-eye"></i>
                </Button>

                {/* Editar */}
                <Button
                  variant="outline-primary"
                  onClick={() => handleShowModal(user)}
                  className="me-2 mb-2"
                >
                  <i className="bi bi-pencil-square"></i>
                </Button>

                {/* Editar rendimiento */}
                <Button
                  variant="outline-primary"
                  onClick={() => handleShowModalER(user)}
                  className="me-2 mb-2"
                >
                  <i className="bi bi-person-lines-fill"></i>
                </Button>

                {user.estado_acceso ? (
                  <Button
                    variant="outline-danger"
                    onClick={() => handleDeactivate(user)}
                    className="me-2 mb-2"
                  >
                    {/* Inhabilitar */}
                    <i className="bi bi-person-fill-slash"></i>
                  </Button>
                ) : (
                  <Button
                    variant="outline-success"
                    onClick={() => handleActivate(user)}
                    className="me-2 mb-2"
                  >
                    {/* Habilitar */}
                    <i className="bi bi-person-check-fill"></i>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </ListGroup.Item>
      ))
  ) : (
    <ListGroup.Item className="text-center">No hay clientes registrados.</ListGroup.Item>
  )}
</ListGroup>


        <CardsEquiposVentas equipos={equipos} users={users} setRefreshData={setRefreshData} navigate={navigate} />


      </div>


      {/* Modal para ver detalles del cliente */}
      <Modal show={showDetailsModal} onHide={handleCloseDetailsModal}>
        <Modal.Header closeButton>
          <Modal.Title>Detalles del Cliente</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <div>
              <p><strong>Nombre:</strong> {selectedUser.nombres}</p>
              <p><strong>Apellido:</strong> {selectedUser.apellido}</p>
              <p><strong>Rol:</strong> {selectedUser.rol.nombre}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>N° Teléfono:</strong> {selectedUser.numero_telefono}</p>
              <p><strong>N° Teléfono 2:</strong> {selectedUser.numero_telefono_2}</p>
              <p><strong>DNI:</strong> {selectedUser.dni}</p>
              <p><strong>CUIL:</strong> {selectedUser.cuil}</p>
              <p><strong>Dirección del Hogar:</strong> {selectedUser.direccion_hogar}</p>
              <p><strong>Apellido Familiar Directo:</strong> {selectedUser.apellido_familiar}</p>
              <p><strong>Nombre Familiar Directo:</strong> {selectedUser.nombre_familiar}</p>
              <p><strong>Fecha Ingreso:</strong> {formatDate(selectedUser.fecha_ingreso)}</p>
              <p><strong>Fecha Despido/Renuncia:</strong> {formatDate(selectedUser.fecha_despido_renuncia)}</p>
              <p><strong>Estado Acceso:</strong> {selectedUser.estado_acceso ? 'Activo' : 'Inactivo'}</p>
              <p><strong>Estado Rendimiento:</strong> {selectedUser.estado_rendimiento || 'N/A'}</p>
              <p><strong>Monotributo:</strong> {selectedUser.monotributo ? 'Sí' : 'No'}</p>
              <p><strong>Objetivo:</strong> {selectedUser.objetivo || 'N/A'}</p>
              <p><strong>Sueldo:</strong> {selectedUser.sueldo}</p>
              <p><strong>Usuario:</strong> {selectedUser.nombre_de_usuario}</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDetailsModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>


      {/* Modal para crear usuario */}
      <ModalCrearUsuario showCreateModal={showCreateModal} handleCloseCreateModal={handleCloseCreateModal}
        setRefreshData={setRefreshData} navigate={navigate} roles={roles} />

      {/* Modal para crear equipo venta */}
      <ModalCrearEquipoVenta showCreateEquipoven={showCreateEquipoven} handleCloseCreateEquipo={handleCloseCreateEquipo}
        setRefreshData={setRefreshData} navigate={navigate} roles={roles} users={users} />



      {/* Modal para editar usuario */}
      <ModalEditUsuarios showModal={showModal} showModalER={showModalER}
        handleCloseModal={handleCloseModal} handleCloseModalER={handleCloseModalER}
        setRefreshData={setRefreshData} navigate={navigate} roles={roles} selectedUser={selectedUser} />
    </>
  );
};
