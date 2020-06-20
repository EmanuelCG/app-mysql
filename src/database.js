const mysql = require('mysql');
const { promisify } = require('util');
const { database } = require('./keys');

const pool = mysql.createPool(database);

pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('La conexión con la base de datos fue cerrada');
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Database has to many connections');
        }
        if (err.code === 'ECONNREDUSED') {
            console.log('Database connection was refused')
        }
    }
    
    if (connection) connection.release();
    console.log('DB is Connected');
    return;
});

//Convirtirtiendo a promesas las querys a la base de datos 
pool.query = promisify(pool.query);

module.exports = pool;