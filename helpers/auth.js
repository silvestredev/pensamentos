module.exports.checkAuth = function(req, res, next){
    const userId = req.session.userid

    if(!userId){
        res.redirect('/login')
    }

    next()
};

//criando middleware para ver se o user está logado, caso não, retornar para a pag de login