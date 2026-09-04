const { Router } = require('express');
const supabase = require('../config/supabase');

const router = Router();

// GET salones
router.get('/', async (req, res) => {
    const { data, error } = await supabase.from('salones').select('*').order('nombre', {ascending: true});
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// POST salones
router.post('/', async (req, res) => {
    const { nombre } = req.body;
    const { data, error } = await supabase.from('salones').insert([{ nombre }]).select();
    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json(data);
});

// PATCH salones/:id (Editar nombre)
router.patch('/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre } = req.body;
    
    const { data, error } = await supabase
        .from('salones')
        .update({ nombre })
        .eq('id', id)
        .select();
        
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// DELETE salones/:id (Eliminar salón)
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    
    const { error } = await supabase
        .from('salones')
        .delete()
        .eq('id', id);
        
    if (error) return res.status(500).json({ error: error.message });
    res.status(204).send();
});

module.exports = router;