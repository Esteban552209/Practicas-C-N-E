const { Router } = require('express');
const supabase = require('../config/supabase');
const router = Router();

// GET /historial
router.get('/', async (req, res) => {
    const { data, error } = await supabase
        .from('historial_reportes')
        .select(`
            id,
            accion,
            observacion,
            fecha,
            equipos (
                codigo,
                salones (nombre)
            )
        `)
        .order('fecha', { ascending: false });
        
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

module.exports = router;