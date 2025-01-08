import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Form from "react-bootstrap/Form";
import InputGroup from 'react-bootstrap/InputGroup'; // Importar InputGroup para íconos
import { Eye, EyeSlash, Person } from 'react-bootstrap-icons'; // Importar íconos
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { starLogin } from '../Helpers/StarLogin';

export const CardLoguin = () => {
    const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar la contraseña

    // Función para alternar la visibilidad de la contraseña
    const togglePassword = () => setShowPassword(!showPassword);

    // State para usuario e email del usuario
    const [user, setUser] = useState({
        email: "",
        password: "",
    });

    const navigate = useNavigate();

    // Función para navegar al registro
    function irCobradores_vendedores() {
        navigate("/register");
    }

    // Controla los cambios en los campos del formulario
    const onInputChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value,
        });
    };

    // Captura los datos del formulario y verifica los campos
    const onSubmit = (e) => {
        e.preventDefault();
        if (user.email.trim() === "" || user.password.trim() === "") {
            // Usar SweetAlert2 para mostrar un error
            Swal.fire({
                title: '¡Error!',
                text: 'Todos los campos son obligatorios.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        } else {
            // Llamar a la función para iniciar sesión (puedes personalizarla)
            starLogin(user.email, user.password, navigate);
            
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100">
            {/* Card centrada con sombra */}
            <Card style={{ width: '23rem' }} className="shadow-lg">
                <Card.Body>
                    <Card.Title className='text-center'>
                        <h1>"NOMBRE"</h1>
                    </Card.Title>
                    <Card.Subtitle className="pt-4 text-muted text-center">
                        Sistema de gestión personalizado
                    </Card.Subtitle>

                    {/* Formulario para login */}
                    <Form onSubmit={onSubmit} className="p-5 p-sm-4 m-3">
                        {/* Campo de correo electrónico con ícono */}
                        <Form.Group className="mb-3" controlId="formGroupEmail">
                            <InputGroup>
                                <Form.Control
                                    type="email"
                                    placeholder="Correo Electrónico"
                                    name="email"
                                    value={user.email}
                                    onChange={onInputChange}
                                />
                                <InputGroup.Text>
                                    <Person />
                                </InputGroup.Text>
                            </InputGroup>
                        </Form.Group>

                        {/* Campo de contraseña con ícono y ojito */}
                        <Form.Group className="mb-3" controlId="formGroupPassword">
                            <InputGroup>
                                <Form.Control
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Contraseña"
                                    name="password"
                                    value={user.password}
                                    onChange={onInputChange}
                                />
                                <InputGroup.Text onClick={togglePassword} style={{ cursor: 'pointer' }}>
                                    {showPassword ? <EyeSlash /> : <Eye />}
                                </InputGroup.Text>
                            </InputGroup>
                        </Form.Group>

                        <Form.Group className="pt-4 d-flex justify-content-center align-items-center">
                            <Button variant="secondary" type="submit">Ingresar</Button>
                        </Form.Group>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
};

