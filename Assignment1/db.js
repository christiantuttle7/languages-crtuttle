import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();


const pool = new pg.Pool({
host: process.env.DB_HOST || 'localhost',
port: Number(process.env.DB_PORT || 5432),
user: process.env.DB_USER,
password: process.env.DB_PASSWORD,
database: process.env.DB_NAME,
max: 10,
idleTimeoutMillis: 30_000,
});


pool.on('error', (err) => {
console.error('Unexpected PG pool error', err);
});


export const query = (text, params) => pool.query(text, params);
export const getClient = () => pool.connect();