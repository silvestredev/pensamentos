const User = require('../models/User');
const bcrypt = require('bcryptjs'); // biblioteca para descriptografar e criptografar senhas

module.exports = class authController {
    static login(req, res){
        res.render('auth/login')
    };

    static async loginPost(req, res){ //metodo de login
        const {email, senha} = req.body;

        //validando se o user existe
        const user = await User.findOne({where: {email: email}});

        if(!user){
            req.flash('message', 'E-mail não cadastrado!')
            res.render('auth/login')

            return
        }
        //checando se a senha está correta
        const passwordMatch = bcrypt.compareSync(senha, user.senha) //comparando a senha recebida com a senha no db
        if(!passwordMatch){
            req.flash('message', 'Senha incorreta!')
            res.render('auth/login')

            return
        }
        
       //autenticação do login
       req.session.userid = user.id; //iniciando a sessão
       
       req.flash('message', 'Você entrou!')

       req.session.save(() => { //salvando a sessão
           res.redirect('/')
       })

    }


    static register(req, res) {
        res.render('auth/register')
      }

    static async registerPost(req, res){ //metodo de registro
        const {nome, email, senha} = req.body; //salvando em um obj as informações pegas no body

        //validação de senha
    /*    if(senha = ''){
            req.flash('message', 'Essa senha é invalida!'); //utilizando o metodo flash para retornar uma message caso a senha seja != vitinho123
            res.render('auth/register')
            
            return // return para a função parar de rodar
        } */

        //checando se o usuario existe
        const checkUserExists = await User.findOne({where: {email: email}}) //checando no db o email do user
        if(checkUserExists){ //se o email já foi cadastrado...
            req.flash('message', 'Esse e-mail já está cadastrado!'); //utilizando o metodo flash para retornar uma message caso a email já esteja cadastrado
            res.render('auth/register')
            
            return 
        }

        //criando a senha com alguns elementos para dificultar vazamentos
        const salt = bcrypt.genSaltSync(10) //nos retornara uma senha com 10 caracteres aleatórios
        const hashedPassword = bcrypt.hashSync(senha, salt) //pegando a senha recebida e efetuando as alterações
    
        //criando o usuário
        const user = {
            nome,
            email,
            senha: hashedPassword,
        };

       try {
           const createdUser = await User.create(user); //usando o metodo create para criar no db
           req.session.userid = createdUser.id;

           req.flash('message', 'Usuário cadastrado com sucesso!') 

           req.session.save(() =>{  //salvando a sessão
               res.redirect('/')
           })
       } catch (error) {
           console.log(error)
       }
    }
    

    static logout(req, res) { // deslogando 
        req.session.destroy() //destruindo a sessão ativa
        res.redirect('/')
    }
};