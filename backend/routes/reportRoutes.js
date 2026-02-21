const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Submit a Report
router.post('/', async (req, res) => {
    const { user_id, disaster_id, location_id, message, type, status } = req.body;
    try {
        const [result] = await db.execute(
            'INSERT INTO community_reports (user_id, disaster_id, location_id, message, type, status) VALUES (?, ?, ?, ?, ?, ?)',
            [user_id || null, disaster_id || null, location_id || null, message, type || 'Hazard', status || 'Pending']
        );
        res.status(201).json({ message: 'Report submitted', id: result.insertId });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Get Recent Reports
router.get('/', async (req, res) => {
    try {
        const [reports] = await db.execute(`
            SELECT r.*, d.name as disaster_name, l.name as location_name, u.username
            FROM community_reports r
            LEFT JOIN disasters d ON r.disaster_id = d.id
            LEFT JOIN locations l ON r.location_id = l.id
            LEFT JOIN users u ON r.user_id = u.id
            ORDER BY r.created_at DESC
            LIMIT 50
        `);
        res.json(reports);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
