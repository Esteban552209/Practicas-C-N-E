import { useState, useEffect, useRef } from 'react';
import { supabase } from './supabase';
import { Alert } from './sweetalertTheme';
import Navbar from './components/Navbar';
import Auth from './pages/Auth';
import GameCard from './components/GameCard';
import Dashboard from './pages/Dashboard';

export default function App() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [session, setSession] = useState(null);
  const [games, setGames] = useState([]);
  const [loadingGames, setLoadingGames] = useState(true);
  const prevSession = useRef(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      prevSession.current = session;
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);

      // Alerta de bienvenida solo al hacer login, no al cargar la página
      if (session && !prevSession.current) {
        const username =
          session.user?.user_metadata?.username ||
          session.user?.email?.split('@')[0] ||
          'Gamer';
        Alert.fire({
          icon: 'success',
          title: `¡Bienvenido, ${username}!`,
          text: 'Tu sesión ha sido iniciada correctamente.',
          timer: 2000,
          showConfirmButton: false,
        });
        setShowAuthModal(false);
      }

      prevSession.current = session;
    });

    return () => subscription.unsubscribe();
  }, []);

  // Trae ofertas de la API
  useEffect(() => {
    async function fetchDeals() {
      try {
        const response = await fetch(
          'https://www.cheapshark.com/api/1.0/deals?storeID=1&upperPrice=15&pageSize=32'
        );
        const data = await response.json();
        setGames(data);
      } catch (error) {
        console.error('Error trayendo ofertas:', error);
      } finally {
        setLoadingGames(false);
      }
    }
    fetchDeals();
  }, []);

  const handleLogout = async () => {
    const result = await Alert.fire({
      icon: 'question',
      title: '¿Cerrar sesión?',
      text: 'Tu progreso y favoritos están guardados.',
      showCancelButton: true,
      confirmButtonText: 'Sí, salir',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      await supabase.auth.signOut();
      Alert.fire({
        icon: 'info',
        title: 'Hasta pronto',
        text: 'Cerraste sesión exitosamente.',
        timer: 1800,
        showConfirmButton: false,
      });
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white relative">
      <Navbar
        onOpenAuth={() => setShowAuthModal(true)}
        session={session}
        onLogout={handleLogout}
      />

      {session ? (
        <Dashboard session={session} games={games} />
      ) : (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <header className="mb-8 border-b border-neutral-800 pb-4">
            <h1 className="text-3xl font-extrabold tracking-tight text-white">
              Ofertas Reales en Steam
            </h1>
            <p className="text-neutral-400 mt-1 text-sm">
              Inicia sesión para guardar tus favoritos y recibir recomendaciones personalizadas.
            </p>
          </header>

          {loadingGames ? (
            <div className="flex items-center justify-center py-24">
              <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {games.map((game) => (
                <GameCard
                  key={game.dealID}
                  dealID={game.dealID}
                  title={game.title}
                  cover={game.thumb}
                  normalPrice={game.normalPrice}
                  salePrice={game.salePrice}
                  store="Steam"
                  session={session}
                  onOpenAuth={() => setShowAuthModal(true)}
                />
              ))}
            </div>
          )}
        </main>
      )}

      {showAuthModal && (
        <Auth onClose={() => setShowAuthModal(false)} />
      )}
    </div>
  );
}
