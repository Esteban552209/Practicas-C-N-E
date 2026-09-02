export default function Navbar({ onOpenAuth, session, onLogout }) {
  const username = session?.user?.user_metadata?.username || session?.user?.email?.split('@')[0] || 'Gamer';

  return (
    <nav className="bg-neutral-950 border-b border-red-600/30 text-white shadow-lg shadow-red-900/10 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <div className="flex-shrink-0 cursor-pointer">
            <span className="text-2xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800">
              PRICE<span className="text-white">DROP</span>
            </span>
          </div>

          {/* Links (solo si no hay sesión) */}
          {!session && (
            <div className="hidden md:flex items-baseline space-x-8 ml-10">
              <a href="#" className="text-gray-300 hover:text-red-500 transition-colors duration-200 px-3 py-2 text-sm font-medium">
                Inicio
              </a>
              <a href="#" className="text-gray-300 hover:text-red-500 transition-colors duration-200 px-3 py-2 text-sm font-medium">
                Explorar Ofertas
              </a>
            </div>
          )}

          {/* Zona derecha */}
          <div className="flex items-center gap-3">
            {session ? (
              <>
                {/* Avatar + nombre */}
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center text-xs font-bold uppercase shadow-[0_0_8px_rgba(185,28,28,0.5)]">
                    {username.charAt(0)}
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-neutral-300">
                    {username}
                  </span>
                </div>

                {/* Botón cerrar sesión */}
                <button
                  onClick={onLogout}
                  className="text-neutral-400 hover:text-red-400 transition-colors text-sm px-3 py-2 rounded-md hover:bg-neutral-800"
                >
                  Salir
                </button>
              </>
            ) : (
              <button
                onClick={onOpenAuth}
                className="bg-red-700 hover:bg-red-600 text-white px-5 py-2 rounded-md text-sm font-bold transition-all duration-300 shadow-[0_0_10px_rgba(185,28,28,0.4)] hover:shadow-[0_0_20px_rgba(220,38,38,0.8)]"
              >
                Entrar
              </button>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}
