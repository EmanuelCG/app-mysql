const express = require('express');
const router = express.Router();
const pool = require('../database');
const {isLoggedIn} = require('../lib/protectUrl');

router.get('/add', isLoggedIn, (req, res) => {
    res.render('links/add');
});

router.get('/links', isLoggedIn, async (req, res) => {
    const links = await pool.query('select * from links');
    res.render('links/list', { links: links });
});

router.post('/add', isLoggedIn, async (req, res) => {
    const { title, url, description } = req.body;
    const newLink = {title, url, description};
    await pool.query('insert into links set ?', [newLink]);
    req.flash('success', 'Link guardado');
    console.log(newLink);
    res.redirect('/api/links');
});

router.get('/delete/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    await pool.query('delete from links where id = ?', [id]);
    req.flash('alert', 'El enlace fue removido');
    res.redirect('/api/links');
});

router.get('/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const link = await pool.query('select * from links where id = ?', [id]);
    console.log(link[0]);
    res.render('links/edit', { link: link[0] });
});

router.post('/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const { title, description, url } = req.body;
    const newLink = { title, description, url };
    await pool.query('update links set ? where id = ?', [newLink, id]);
    res.redirect('/api/links');
});

module.exports = router;