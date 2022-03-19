const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session'); //middleware express-session armazena os dados da sessão no servidor
const FileStore = require('session-file-store')(session);
const flash = require('express-flash');

const app = express();

const conn = require('./db/conn');

//models 
const User = require('./models/User');
const Tought = require('./models/Tought');

//importanto Rotas
const authRoutes = require('./routes/authRoutes')
const toughtsRoutes = require('./routes/toughtsRoutes');

//importando o controller
const AuthController = require('./controller/AuthController')
const ToughtController = require('./controller/ToughtController');

//config template engine (handlebars)
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');

//receber repostas do body
app.use(
    express.urlencoded({
        extended: true
    })
);
app.use(express.json());

//arquivos públicos
app.use(express.static('public'))


//session middleware
app.use(
    session({
        name: 'session', //nomeação da session
        secret: 'meu_secret', //torná-la 'inquebrável'
      //resave: false, // caiu a sessão, será desconectada
        saveUninitialized: false, // reduzir o uso de armazenamento do servidor ou cumprir as leis que exigem permissão antes de configurar um cookie
        store: new FileStore({ //filestore permite salvar sessões em arquivos
            logFn: function(){},
            path: require('path').join(require('os').tmpdir(), 'sessions'), //caminho para a pasta sessions // tempdir = diretório temporário
        }),
        cookie: { // config cookie para fazer a conexão com o user
            secure: false, 
            maxAge: 360000, //tempo de duração 1 dia
            expires: new Date(Date.now() + 360000), //forçar a expriração
            httpOnly: true 
        }    
    })
)

// flash messages = mensagens de status do sistema
app.use(flash())

//salvar a sessão e manter logado
app.use((req, res, next) =>{
    console.log(req.session.userid)
    if(req.session.userid){ // se o usuário tiver a sessão...
        res.locals.session = req.session // manda o user da req para a res, assim acessamos no front
    }

    next()
}); 




//Routes middlewares
app.use('/toughts', toughtsRoutes) // /toughts leva a todas as rotas
app.use('/', authRoutes)


app.get('/', ToughtController.showToughts); // a url '/' exibe os pensamentos




//conn.sync({force: true}) //forçando a recriação das tables
conn.sync()
.then(
    app.listen(3000)
)
.catch((err) => console.log(err));
