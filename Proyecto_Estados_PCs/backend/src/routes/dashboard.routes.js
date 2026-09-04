const { Router } = require('express');
const supabase = require('../config/supabase');
const router = Router();

// GET /dashboard/estadisticas
router.get('/estadisticas', async (req, res) => {
    try {
        const { count: totalSalones, error: errSalones } = await supabase
            .from('salones')
            .select('*', { count: 'exact', head: true });

        const { count: totalEquipos, error: errEquipos } = await supabase
            .from('equipos')
            .select('*', { count: 'exact', head: true });

        const { count: equiposFalla, error: errFalla } = await supabase
            .from('equipos')
            .select('*', { count: 'exact', head: true })
            .eq('estado', false);

        if (errSalones || errEquipos || errFalla) {
            return res.status(500).json({ error: 'Error al calcular estadísticas' });
        }

        const equiposOperativos = (totalEquipos || 0) - (equiposFalla || 0);

        res.json({
            total_salones: totalSalones || 0,
            total_equipos: totalEquipos || 0,
            equipos_operativos: equiposOperativos,
            equipos_falla: equiposFalla || 0
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;