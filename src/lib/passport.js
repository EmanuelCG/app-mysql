const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const pool = require('../database');
const helpers = require('../lib/helpers');

passport.use('local.signin', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    const rows = await pool.query('select * from users where username = ?', [username]);
    if(rows.length > 0){
        const user = rows[0];
       const validPass = await helpers.matchPass(password, user.password);
        if(validPass){
            return done(null, user, req.flash('success', 'Welcome ' + user.username));
        }else{
            return done(null, false, req.flash( 'alert', 'Incorrect Password'));
        }
    }else{
        return done(null, false, req.flash('alert', 'User does not exists'));
    }
}));

passport.use('local.signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    const { fullname } = req.body,
        newUser = { username, password, fullname };
    newUser.password = await helpers.encryptPass(password);
    const result = await pool.query('insert into users set ?', [newUser]);
    newUser.id = result.insertId;// Obtengo el id para luego serializar y deserializar (manejo de sesiones)
    return done(null, newUser); // Se almacena en una sesión
}));


passport.serializeUser((user, done)=>{
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const rows = await pool.query('select * from users where id = ?', [id]);
    done(null, rows[0]);
});