const Tought = require('../models/Tought');
const User = require('../models/User');

const {Op} = require('sequelize');

module.exports = class ToughtController { //exportando a classe que contem os métodos de requisição
    static async showToughts(req, res){
    
      //funcionalidade de busca
      let search = '';

      if(req.query.search){
        search = req.query.search; //query de busca
      }

      //ordem de busca ASC = ASCENDENTE DESC = DESCENDENTE 
      let order = 'DESC'

      if(req.query.order === 'old'){
        order = 'ASC'
      } else {
        order = 'DESC'
      };
      //
      
      const toughtsData = await Tought.findAll({
        include: User,
        where: {
          titulo: {[Op.like]: `%${search}%`}, //buscando uma palavra chave na query search
        },
        order: [['createdAt', order]],
      });  
      const toughts = toughtsData.map((result) => result.get({plain: true})) //todos os resultados serão jogados no mesmo array (usuário e pensamento)
      
      let toughtsQty = toughts.length; //para saber quantos resultados foram encontrados

      if(toughtsQty === 0){
        toughtsQty = false
      };

      res.render('toughts/home', {toughts, search, toughtsQty})
    };

    static async painel(req, res){
      const userId = req.session.userid;
      const user = await User.findOne({ //checando se o usuário existe
        where: {id: userId},
        include: Tought, //com o metodo include podemos trazer todos os models relacionados a esse user
        plain: true, //trazer só o relevante
      });

      if(!user){ //caso não, retornar para a tela de login
        res.redirect('/login') 
      }
      
      const toughts = user.Toughts.map((result) => result.dataValues) //map nos permite interagir com o array //nesse caso, estamos retornando somente o que interessa, os pensamentos.
      
      let emptyToughts = false;

      if(toughts.length === 0){  //se não houver nenhum pensamento...
        emptyToughts = true
      }

      res.render('toughts/painel', {toughts, emptyToughts})  
    };

    static addTought(req, res){
      res.render('toughts/add')  
    };

    static async addPost(req, res){ //adicionando pensamentos 
      const tought = {
        titulo: req.body.titulo,
        UserId: req.session.userid //pegando o id do usuário da sessão
      }

     try {
        await Tought.create(tought); //criando no db
        req.flash('message', 'Pensamento adicionado com sucesso!');
  
        req.session.save(() => { //salvando a session para redirecionar
          res.redirect('/toughts/painel')
        })
     } catch (error) {
       console.log(error)
     }
  }

  static async deletPost(req, res){ //deletando pensamento
    const id = req.body.id; //id do pensamento
    const UserId = req.session.userid; //id do user para evitar deletar o pensamento de outro user

    try {
      await Tought.destroy({where: {id: id, UserId: UserId}})
      req.flash('message', 'Pensamento removido com sucesso!');

      req.session.save(() => {
        res.redirect('/toughts/painel') //salvando a session para redirecionar
      })

    } catch (error) {
      console.log(error)
    }
  }

  static async edit(req, res){ //editar pensamento
    const id = req.params.id;

    const tought = await Tought.findOne({where: {id:id}, raw: true});
    res.render('toughts/edit', {tought});
  };

  static async editPost(req, res){
    const id = req.body.id;
    const tought = {
      titulo: req.body.titulo,
    };

    try {
      await Tought.update(tought, {where: {id:id}})
      req.flash('message', 'Pensamento atualizado com sucesso!');
  
      req.session.save(() => {
        res.redirect('/toughts/painel') //salvando a session para redirecionar
      });
    } catch (error) {
      console.log(error)
    }
  };
};