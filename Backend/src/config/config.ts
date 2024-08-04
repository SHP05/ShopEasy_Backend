import dotenv from 'dotenv';
dotenv.config();

export const JWT_SECRET = process.env.SECRET || '';

// export const DB_URL = `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${database}`

// import { config as conf } from 'dotenv'
// conf();

// const _config = {
//     port : process.env.PORT,
// }

// export const config = Object.freeze(_config);
