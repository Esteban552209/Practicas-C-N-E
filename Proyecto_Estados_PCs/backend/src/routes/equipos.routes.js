const { Router } = require('express');
const supabase = require('../config/supabase');

const router = Router();

// GET equipos/:salon_id
router.get('/:salon_id', async (req, res) => {
    const { salon_id } = req.params;
    const { data, error } = await supabase
        .from('equipos')
        .select('*')
        .eq('salon_id', salon_id);
        
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// PATCH equipos/:id/reportar
router.patch('/:id/reportar', async (req, res) => {
    const { id } = req.params;
    const { estado, observacion } = req.body;
    
    const { data, error } = await supabase
        .from('equipos')
        .update({ estado, observacion })
        .eq('id', id)
        .select();
        
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

router.post('/', async (req, res) => {
    const { codigo, salon_id } = req.body;
    const { data, error } = await supabase.from('equipos').insert([{ codigo, salon_id }]).select();
    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json(data);
});

// PATCH equipos/:id/reparar
router.patch('/:id/reparar', async (req, res) => {
    const { id } = req.params;
    
    const { data, error } = await supabase
        .from('equipos')
        .update({ estado: true, observacion: null })
        .eq('id', id)
        .select();
        
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

module.exports = router;