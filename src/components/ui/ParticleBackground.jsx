import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import { useUserProgress } from '../../context/UserProgressContext';

const ParticleBackground = () => {
    const { settings } = useUserProgress();
    const particlesInit = useCallback(async engine => {
        await loadSlim(engine);
    }, []);

    const options = {
        background: { color: { value: "transparent" } },
        fpsLimit: 60,
        interactivity: {
            events: {
                onHover: { enable: true, mode: "repulse" },
            },
            modes: {
                repulse: { distance: 80, duration: 0.4 },
            },
        },
        particles: {
            color: { value: settings.accentColor || "#ffffff" }, // Gunakan warna aksen
            links: { color: "#ffffff", distance: 150, enable: true, opacity: 0.1, width: 1 },
            move: {
                direction: "none",
                enable: true,
                outModes: { default: "none" },
                random: true,
                speed: 0.5,
                straight: false,
            },
            number: { density: { enable: true, area: 800 }, value: 50 },
            opacity: { value: {min: 0.1, max: 0.4} },
            shape: { type: "circle" },
            size: { value: { min: 1, max: 3 } },
        },
        detectRetina: true,
    };

    return (
        <Particles
            id="tsparticles"
            init={particlesInit}
            options={options}
            style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}
        />
    );
};

export default ParticleBackground;