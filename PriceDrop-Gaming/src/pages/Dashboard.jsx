import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { Alert, Toast } from '../sweetalertTheme';
import GameCard from '../components/GameCard';

// ─── Juegos populares con título exacto para búsqueda ───────────────────────
// Cada entrada tiene el título exacto a buscar y palabras clave para validar
// que el resultado realmente corresponde al juego esperado
const POPULAR_GAMES = [
  { search: 'Undertale',            match: 'undertale' },
  { search: 'Hollow Knight',        match: 'hollow knight' },
  { search: 'Stardew Valley',       match: 'stardew valley' },
  { search: 'Cyberpunk 2077',       match: 'cyberpunk' },
  { search: 'The Witcher 3',        match: 'witcher' },
  { search: 'Terraria',             match: 'terraria' },
  { search: 'Portal 2',             match: 'portal' },
  { search: 'Celeste',              match: 'celeste' },
  { search: 'Dead Cells',           match: 'dead cells' },
  { search: 'Disco Elysium',        match: 'disco elysium' },
  { search: 'Among Us',             match: 'among us' },
];

// ─── Modal de Editar Perfil ──────────────────────────────────────────────────
function EditProfileModal({ session, perfil, onClose, onSaved }) {
  const [username, setUsername] = useState(perfil?.username || '');
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    if (!username.trim()) return;
    setLoading(true);

    const { error } = await supabase
      .from('perfiles')
      .update({ username: username.trim() })
      .eq('id', session.user.id);

    setLoading(false);

    if (error) {
      Alert.fire({ icon: 'error', title: 'Error', text: error.message });
    } else {
      onSaved(username.trim());
      onClose();
      Alert.fire({
        icon: 'success',
        title: '¡Perfil actualizado!',
        text: `Tu nuevo nombre es "${username.trim()}"`,
        timer: 2000,
        showConfirmButton: false,
      });
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative bg-neutral-900 border border-neutral-800 p-8 rounded-2xl shadow-xl max-w-sm w-full">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-500 hover:text-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-xl font-black tracking-wide text-white mb-1">EDITAR PERFIL</h2>
        <p className="text-xs text-neutral-400 mb-6 uppercase tracking-wider">Cambia tu nombre de usuario</p>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-neutral-400 uppercase mb-1">Nombre de Usuario</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-white focus:outline-none focus:border-red-600 transition-colors placeholder-neutral-600"
              placeholder="Tu nombre gamer"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-400 uppercase mb-1">Email</label>
            <input
              type="text"
              value={session.user.email}
              disabled
              className="w-full bg-neutral-950/50 border border-neutral-800 rounded-lg p-3 text-neutral-500 cursor-not-allowed"
            />
          </div>

          <button
            onClick={handleSave}
            disabled={loading || !username.trim()}
            className="w-full bg-red-700 hover:bg-red-600 text-white font-bold p-3 rounded-lg transition-all duration-300 disabled:opacity-50"
          >
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Sección Destacados ──────────────────────────────────────────────────────
function Destacados({ session, favoritedIDs, onFavoriteChange }) {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        // Busca por título y valida que el resultado sea el juego correcto
        const results = await Promise.all(
          POPULAR_GAMES.map(({ search, match }) =>
            fetch(
              `https://www.cheapshark.com/api/1.0/deals?storeID=1&title=${encodeURIComponent(search)}&pageSize=50`
            )
              .then((r) => r.json())
              .then((arr) => {
                // Filtra el resultado cuyo título incluya la palabra clave
                const found = arr.find(
                  (g) => g?.title?.toLowerCase().includes(match)
                );
                return found || null;
              })
              .catch(() => null)
          )
        );

        const games = results
          .filter(
            (g) =>
              g &&
              parseFloat(g.normalPrice) > 0 &&
              parseFloat(g.salePrice) < parseFloat(g.normalPrice)
          )
          // Deduplica por dealID
          .filter((g, i, arr) => arr.findIndex((x) => x.dealID === g.dealID) === i)
          .sort((a, b) => {
            const da = ((a.normalPrice - a.salePrice) / a.normalPrice) * 100;
            const db = ((b.normalPrice - b.salePrice) / b.normalPrice) * 100;
            return db - da;
          })
          .slice(0, 8);

        setFeatured(games);
      } catch (err) {
        console.error('Error cargando destacados:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchFeatured();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-3 py-8">
        <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-neutral-500 text-sm">Buscando juegos destacados...</span>
      </div>
    );
  }

  if (featured.length === 0) return null;

  return (
    <section>
      <div className="flex items-center gap-3 mb-4">
        <span className="text-yellow-500">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
          </svg>
        </span>
        <h3 className="text-lg font-bold text-white tracking-tight">Juegos Populares con Descuento</h3>
        <span className="text-xs text-neutral-500 bg-neutral-800 px-2 py-0.5 rounded-full">
          {featured.length} encontrados
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {featured.map((game) => (
          <GameCard
            key={game.dealID}
            dealID={game.dealID}
            title={game.title}
            cover={game.thumb}
            normalPrice={game.normalPrice}
            salePrice={game.salePrice}
            store="Steam"
            session={session}
            initialFavorited={favoritedIDs.includes(game.dealID)}
            onFavoriteChange={onFavoriteChange}
          />
        ))}
      </div>
    </section>
  );
}

// ─── Tab Mis Favoritos ───────────────────────────────────────────────────────
function FavoritosTab({ session, allGames }) {
  const [favoritos, setFavoritos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavoritos();
  }, []);

  async function fetchFavoritos() {
    setLoading(true);
    const { data, error } = await supabase
      .from('juegos_favoritos')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (!error) setFavoritos(data || []);
    setLoading(false);
  }

  function handleFavoriteChange(dealID, isFavorited) {
    if (!isFavorited) {
      setFavoritos((prev) => prev.filter((f) => f.game_id_api !== dealID));
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (favoritos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-neutral-700 mb-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
        </svg>
        <p className="text-neutral-400 text-lg font-medium">No tienes favoritos todavía</p>
        <p className="text-neutral-600 text-sm mt-2">Ve a "Explorar Ofertas" y toca el corazón en los juegos que te interesen.</p>
      </div>
    );
  }

  const enriched = favoritos.map((fav) => {
    const live = allGames.find((g) => g.dealID === fav.game_id_api);
    return {
      dealID: fav.game_id_api,
      title: fav.title,
      cover: live?.thumb || fav.thumbnail,
      normalPrice: live?.normalPrice || '?',
      salePrice: live?.salePrice || fav.precio_objetivo?.toString() || '?',
    };
  });

  return (
    <div>
      <p className="text-neutral-500 text-sm mb-5">
        {favoritos.length} {favoritos.length === 1 ? 'juego guardado' : 'juegos guardados'}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {enriched.map((game) => (
          <GameCard
            key={game.dealID}
            dealID={game.dealID}
            title={game.title}
            cover={game.cover}
            normalPrice={game.normalPrice}
            salePrice={game.salePrice}
            store="Steam"
            session={session}
            initialFavorited={true}
            onFavoriteChange={handleFavoriteChange}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Tab Explorar Ofertas ────────────────────────────────────────────────────
function OfertasTab({ session, games, favoritedIDs }) {
  const [localFavs, setLocalFavs] = useState(new Set(favoritedIDs));

  useEffect(() => {
    setLocalFavs(new Set(favoritedIDs));
  }, [favoritedIDs]);

  function handleFavoriteChange(dealID, isFavorited) {
    setLocalFavs((prev) => {
      const next = new Set(prev);
      isFavorited ? next.add(dealID) : next.delete(dealID);
      return next;
    });
  }

  return (
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
          initialFavorited={localFavs.has(game.dealID)}
          onFavoriteChange={handleFavoriteChange}
        />
      ))}
    </div>
  );
}

// ─── Dashboard Principal ─────────────────────────────────────────────────────
export default function Dashboard({ session, games }) {
  const [activeTab, setActiveTab] = useState('ofertas');
  const [perfil, setPerfil] = useState(null);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [favoritedIDs, setFavoritedIDs] = useState([]);

  const username =
    perfil?.username ||
    session?.user?.user_metadata?.username ||
    session?.user?.email?.split('@')[0] ||
    'Gamer';

  useEffect(() => {
    fetchPerfil();
    fetchFavoritedIDs();
  }, []);

  async function fetchPerfil() {
    const { data } = await supabase
      .from('perfiles')
      .select('*')
      .eq('id', session.user.id)
      .single();
    if (data) setPerfil(data);
  }

  async function fetchFavoritedIDs() {
    const { data } = await supabase
      .from('juegos_favoritos')
      .select('game_id_api')
      .eq('user_id', session.user.id);
    if (data) setFavoritedIDs(data.map((d) => d.game_id_api));
  }

  function handleFavoriteChange(dealID, isFavorited) {
    setFavoritedIDs((prev) =>
      isFavorited ? [...prev, dealID] : prev.filter((x) => x !== dealID)
    );
  }

  const tabs = [
    { id: 'ofertas', label: 'Explorar Ofertas' },
    { id: 'favoritos', label: `Mis Favoritos${favoritedIDs.length > 0 ? ` (${favoritedIDs.length})` : ''}` },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      {/* ── Tarjeta de perfil ── */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-red-600 to-red-900 flex items-center justify-center text-2xl font-black uppercase shadow-[0_0_16px_rgba(185,28,28,0.5)]">
            {username.charAt(0)}
          </div>
          <div>
            <p className="text-xs text-neutral-500 uppercase tracking-widest mb-0.5">Bienvenido de vuelta</p>
            <h2 className="text-xl font-black text-white">{username}</h2>
            <p className="text-xs text-neutral-500">{session.user.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Stat: favoritos */}
          <div className="text-center px-4 py-2 bg-neutral-800 rounded-xl">
            <p className="text-2xl font-black text-red-500">{favoritedIDs.length}</p>
            <p className="text-xs text-neutral-400">Favoritos</p>
          </div>

          <button
            onClick={() => setShowEditProfile(true)}
            className="flex items-center gap-2 text-sm text-neutral-400 hover:text-white border border-neutral-700 hover:border-neutral-500 px-4 py-2 rounded-lg transition-all duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z" />
            </svg>
            Editar Perfil
          </button>
        </div>
      </div>

      {/* ── Destacados ── */}
      <Destacados
        session={session}
        favoritedIDs={favoritedIDs}
        onFavoriteChange={handleFavoriteChange}
      />

      {/* ── Tabs ── */}
      <section>
        <div className="flex border-b border-neutral-800 mb-6 gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3 text-sm font-bold tracking-wide transition-all duration-200 border-b-2 -mb-px ${
                activeTab === tab.id
                  ? 'border-red-500 text-red-400'
                  : 'border-transparent text-neutral-500 hover:text-neutral-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'ofertas' && (
          <OfertasTab session={session} games={games} favoritedIDs={favoritedIDs} />
        )}
        {activeTab === 'favoritos' && (
          <FavoritosTab session={session} allGames={games} />
        )}
      </section>

      {showEditProfile && (
        <EditProfileModal
          session={session}
          perfil={perfil}
          onClose={() => setShowEditProfile(false)}
          onSaved={(newUsername) => setPerfil((prev) => ({ ...prev, username: newUsername }))}
        />
      )}
    </main>
  );
}
