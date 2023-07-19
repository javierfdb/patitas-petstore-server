import * as dotenv from "dotenv";
dotenv.config();
import express from 'express';
import cors from 'cors';
const app = express();

import productRouter from './routes/product.route.js';

app.use(cors());
app.use(express.json());
app.use('/api', productRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log("Escuchando peticiones en el puerto: " + PORT);
});