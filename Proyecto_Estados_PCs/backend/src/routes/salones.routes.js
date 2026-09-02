const { Router } = require('express');
const supabase = require('../config/supabase');

const router = Router();

// GET salones
router.get('/', async (req, res) => {
    const { data, error } = await supabase.from('salones').select('*');
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

module.exports = router;