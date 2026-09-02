import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { Toast } from '../sweetalertTheme';

export default function GameCard({
  dealID,
  title,
  cover,
  normalPrice,
  salePrice,
  store,
  session,
  onOpenAuth,
  initialFavorited = false,
  onFavoriteChange,
}) {
  const rawNormal = parseFloat(normalPrice);
  const rawSale = parseFloat(salePrice);
  const discount = rawNormal > 0 ? Math.round(((rawNormal - rawSale) / rawNormal) * 100) : 0;

  const [favorited, setFavorited] = useState(initialFavorited);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFavorited(initialFavorited);
  }, [initialFavorited]);

  async function toggleFavorite() {
    if (!session) {
      onOpenAuth?.();
      return;
    }

    setLoading(true);
    const userId = session.user.id;

    try {
      if (favorited) {
        // ── Eliminar de favoritos ──
        const { error } = await supabase
          .from('juegos_favoritos')
          .delete()
          .eq('user_id', userId)
          .eq('game_id_api', dealID);

        if (error) throw error;

        setFavorited(false);
        onFavoriteChange?.(dealID, false);
        Toast.fire({ icon: 'info', title: 'Eliminado de favoritos' });
      } else {
        // ── Insertar en favoritos ──
        // Primero verificamos si ya existe (evita duplicados)
        const { data: existing } = await supabase
          .from('juegos_favoritos')
          .select('id')
          .eq('user_id', userId)
          .eq('game_id_api', dealID)
          .maybeSingle();

        if (existing) {
          // Ya existe, solo actualiza el estado visual
          setFavorited(true);
          onFavoriteChange?.(dealID, true);
          return;
        }

        const { error } = await supabase.from('juegos_favoritos').insert({
          user_id: userId,
          game_id_api: dealID,          // columna en Supabase
          title: title,
          thumbnail: cover,
          precio_objetivo: isNaN(rawSale) ? null : rawSale,
        });

        if (error) throw error;

        setFavorited(true);
        onFavoriteChange?.(dealID, true);
        Toast.fire({ icon: 'success', title: '¡Añadido a favoritos!' });
      }
    } catch (error) {
      console.error('Error favorito:', error);
      Toast.fire({
        icon: 'error',
        title: 'Error: ' + (error?.message || 'No se pudo guardar'),
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-lg hover:shadow-red-900/20 hover:border-red-600/50 transition-all duration-300 group flex flex-col">
      {/* Imagen */}
      <div className="relative h-48 overflow-hidden bg-neutral-950">
        <img
          src={cover}
          alt={title}
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
        />
        {discount > 0 && (
          <div className="absolute top-3 left-3 bg-red-700 text-white text-xs font-bold px-2 py-1 rounded shadow-[0_0_10px_rgba(185,28,28,0.5)]">
            -{discount}%
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <p className="text-xs text-neutral-400 mb-1 uppercase tracking-wider">{store}</p>
          <h3 className="text-lg font-bold text-white leading-tight mb-2 line-clamp-2">{title}</h3>
        </div>

        <div className="mt-4 flex items-end justify-between">
          <div>
            {rawNormal > rawSale && (
              <p className="text-sm text-neutral-500 line-through">${rawNormal.toFixed(2)}</p>
            )}
            <p className="text-2xl font-black text-red-500">
              {rawSale > 0 ? `$${rawSale.toFixed(2)}` : 'Gratis'}
            </p>
          </div>

          <button
            onClick={toggleFavorite}
            disabled={loading}
            title={
              !session
                ? 'Inicia sesión para guardar'
                : favorited
                ? 'Quitar de Favoritos'
                : 'Añadir a Favoritos'
            }
            className={`transition-all duration-200 p-2 rounded-full hover:bg-neutral-800 disabled:opacity-50 ${
              favorited ? 'text-red-500 scale-110' : 'text-neutral-500 hover:text-red-500'
            }`}
          >
            {loading ? (
              <svg className="w-6 h-6 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill={favorited ? 'currentColor' : 'none'}
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
