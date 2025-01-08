import React, { useState, useEffect } from "react";
import { CardLoguin } from "./Componentes/CardLoguin";
import { gsap } from "gsap";

export const HomeLogin = () => {
    const [showWelcome, setShowWelcome] = useState(true); // Estado para controlar la pantalla de bienvenida

    useEffect(() => {
        if (showWelcome) {
            // Animación de entrada del mensaje de bienvenida
            const timeline = gsap.timeline();
            timeline
                .fromTo(
                    ".welcome-screen",
                    { opacity: 0, scale: 0.8 },
                    { opacity: 1, scale: 1, duration: 1, ease: "power2.out" }
                )
                .to(".welcome-screen", {
                    opacity: 0,
                    scale: 0.8,
                    duration: 1,
                    ease: "power2.in",
                    delay: 2, // Mostrar el mensaje durante 2 segundos
                    onComplete: () => setShowWelcome(false), // Ocultar el mensaje
                });
        }
    }, [showWelcome]);

    return (
        <div className="background-login">
            {showWelcome ? (
                <div className="welcome-screen d-flex justify-content-center align-items-center min-vh-100">
                    <h1 className="text-center text-white">
                        ¡Bienvenido a "NOMBRE DE LA PLATAFORMA"!
                    </h1>
                </div>
            ) : (
                // Contenido principal después de la bienvenida
                <CardLoguin />
            )}
        </div>
    );
};