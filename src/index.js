const express = require('express');
const morgan = require('morgan');
const hbs = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const MySQLStore = require('express-mysql-session');
const { database } = require('./keys');
const passport = require('passport');

//Inicializaciones
const app = express();
require('./lib/passport');
//settings
app.set('port', process.env.PORT || 5000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', hbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}));

app.set('view engine', '.hbs');

// Midlewares 
app.use(flash());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(session({
    secret: 'index', //
    resave: 'false', //No se renueva la sesión 
    saveUninitialized: 'false', // No se vuelve a establcer la sesion
    store: new MySQLStore(database)// Donde se guarda la session
}));
//Passport
app.use(passport.initialize());
app.use(passport.session({
    
}));


// Variables Globales
app.use((req, res, next) => {
    app.locals.success = req.flash('success');
    app.locals.alert = req.flash('alert');
    app.locals.user = req.user;// Nuestro usuario serializado se guarda en user por defecto
    next();
});

//Routes

app.use(require('./routes/index'));
app.use(require('./routes/auth'));
app.use('/api'  , require('./routes/links'));

//Public (Definimos carpetas publicas)
app.use((express.static(path.join(__dirname, 'public'))));


// Iniciar servidor
app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
})