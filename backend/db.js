import mysql from 'mysql2';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'A0957333255a', // cambia si tienes clave
  database: 'plataforma_EUSANJOSE'
});

export default pool.promise();
