import { useState } from "react";
import { supabase } from "../supabase";

export default function Auth({ onClose }) {
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState(""); // Nuevo campo
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState(""); // Nuevo campo
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            if (isSignUp) {
                // Validación de contraseñas
                if (password !== confirmPassword) {
                    throw new Error(
                        "Las contraseñas no coinciden. Intenta de nuevo.",
                    );
                }

                const { error } = await supabase.auth.signUp({
                    email: email,
                    password: password,
                    options: {
                        // Aquí le pasamos datos extra (metadata) a Supabase
                        data: {
                            username: username,
                        },
                    },
                });
                if (error) throw error;
                setMessage(
                    "¡Registro exitoso! Revisa tu correo para verificar tu cuenta.",
                );
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email: email,
                    password: password,
                });
                if (error) throw error;
                setMessage("¡Sesión iniciada correctamente!");

                // Cierra el modal automáticamente después de 1.5 segundos si fue exitoso
                setTimeout(() => {
                    onClose();
                }, 1500);
            }
        } catch (error) {
            setMessage(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    }

    return (
        // Contenedor principal: Fijo en toda la pantalla, fondo semitransparente con desenfoque (blur)
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            {/* Tarjeta del Modal con 'relative' para poder ubicar la X de cerrar */}
            <div className="relative bg-neutral-900 border border-neutral-800 p-8 rounded-2xl shadow-xl shadow-red-950/20 max-w-md w-full animate-fade-in-up">
                {/* Botón de Cerrar */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-neutral-500 hover:text-white transition-colors"
                    title="Cerrar ventana"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-6 h-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>

                <h2 className="text-2xl font-black tracking-wide text-center text-white mb-2">
                    {isSignUp ? "CREAR CUENTA" : "INICIAR SESIÓN"}
                </h2>
                <p className="text-xs text-neutral-400 text-center mb-6 uppercase tracking-wider">
                    {isSignUp
                        ? "Únete al rastreador de ofertas"
                        : "Accede a tu panel gamer"}
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Campo de Username (Solo visible si es registro) */}
                    {isSignUp && (
                        <div>
                            <label className="block text-xs font-bold text-neutral-400 uppercase mb-1">
                                Nombre de Usuario
                            </label>
                            <input
                                type="text"
                                required
                                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-white focus:outline-none focus:border-red-600 transition-colors placeholder-neutral-600"
                                placeholder="Ej. ArteNauta2026"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-bold text-neutral-400 uppercase mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            required
                            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-white focus:outline-none focus:border-red-600 transition-colors placeholder-neutral-600"
                            placeholder="tu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-neutral-400 uppercase mb-1">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            required
                            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-white focus:outline-none focus:border-red-600 transition-colors placeholder-neutral-600"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {/* Campo de Confirmar Contraseña (Solo visible si es registro) */}
                    {isSignUp && (
                        <div>
                            <label className="block text-xs font-bold text-neutral-400 uppercase mb-1">
                                Confirmar Contraseña
                            </label>
                            <input
                                type="password"
                                required
                                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-white focus:outline-none focus:border-red-600 transition-colors placeholder-neutral-600"
                                placeholder="Repite tu contraseña"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-red-700 hover:bg-red-600 text-white font-bold p-3 rounded-lg transition-all duration-300 shadow-[0_0_10px_rgba(185,28,28,0.3)] hover:shadow-[0_0_20px_rgba(220,38,38,0.6)] disabled:opacity-50 mt-2"
                    >
                        {loading
                            ? "Procesando..."
                            : isSignUp
                            ? "Registrarse"
                            : "Entrar"}
                    </button>
                </form>

                {message && (
                    <p
                        className={`mt-4 text-center text-sm p-2 rounded ${message.startsWith("Error") ? "bg-red-900/20 text-red-400 border border-red-900/50" : "bg-emerald-900/20 text-emerald-400 border border-emerald-900/50"}`}
                    >
                        {message}
                    </p>
                )}

                <div className="mt-6 text-center text-sm border-t border-neutral-800 pt-4">
                    <button
                        onClick={() => {
                            setIsSignUp(!isSignUp);
                            setMessage(""); // Limpia mensajes al cambiar de modo
                        }}
                        className="text-neutral-400 hover:text-red-500 transition-colors"
                    >
                        {isSignUp
                            ? "¿Ya tienes cuenta? Inicia sesión"
                            : "¿No tienes cuenta? Regístrate"}
                    </button>
                </div>
            </div>
        </div>
    );
}
