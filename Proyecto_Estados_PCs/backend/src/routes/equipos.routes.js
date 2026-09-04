const { Router } = require('express');
const supabase = require('../config/supabase');

const router = Router();

// GET equipos/:salon_id
router.get('/:salon_id', async (req, res) => {
    const { salon_id } = req.params;
    const { data, error } = await supabase
        .from('equipos')
        .select('*')
        .eq('salon_id', salon_id)
        .order('codigo', { ascending: true });
        
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// POST equipos/
router.post('/', async (req, res) => {
    const { codigo, salon_id } = req.body;
    
    const { data, error } = await supabase
        .from('equipos')
        .insert([{ codigo, salon_id }])
        .select();
        
    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json(data);
});

// PATCH equipos/:id/reportar
router.patch('/:id/reportar', async (req, res) => {
    const { id } = req.params;
    const { estado, observacion } = req.body;
    const { data: equipo, error: errorEquipo } = await supabase
        .from('equipos')
        .update({ estado, observacion })
        .eq('id', id)
        .select();
        
    if (errorEquipo) return res.status(500).json({ error: errorEquipo.message });

    if (estado === false) {
        const { error: errorHistorial } = await supabase
            .from('historial_reportes')
            .insert([{ 
                equipo_id: id, 
                accion: 'REPORTADO', 
                observacion 
            }]);
            
        if (errorHistorial) return res.status(500).json({ error: errorHistorial.message });
    }

    res.json(equipo);
});

// PATCH equipos/:id/reparar
router.patch('/:id/reparar', async (req, res) => {
    const { id } = req.params;
    const { data: equipo, error: errorEquipo } = await supabase
        .from('equipos')
        .update({ estado: true, observacion: null })
        .eq('id', id)
        .select();
        
    if (errorEquipo) return res.status(500).json({ error: errorEquipo.message });

    const { error: errorHistorial } = await supabase
        .from('historial_reportes')
        .insert([{ 
            equipo_id: id, 
            accion: 'REPARADO', 
            observacion: 'Equipo marcado como operativo' 
        }]);
        
    if (errorHistorial) return res.status(500).json({ error: errorHistorial.message });

    res.json(equipo);
});

module.exports = router;