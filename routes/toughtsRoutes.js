const express = require('express');
const router = express.Router();

//controller
const ToughtController = require('../controller/ToughtController'); //chamando o controller

//middleware de autenticação
const checkAuth = require('../helpers/auth').checkAuth

router.post('/edit', checkAuth, ToughtController.editPost)
router.get('/edit/:id', checkAuth, ToughtController.edit) //editando pensamento utilizando o id do pensamento
router.post('/delet', checkAuth, ToughtController.deletPost);
router.post('/add', checkAuth, ToughtController.addPost);
router.get('/add', checkAuth, ToughtController.addTought);
router.get('/painel', checkAuth, ToughtController.painel);
router.get('/', ToughtController.showToughts); //criando rota da home

module.exports = router;

