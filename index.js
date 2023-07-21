import * as dotenv from "dotenv";
dotenv.config();
import { pool } from "./database/connection.js";
import express from 'express';

import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";


import cors from 'cors';
const app = express();

import { verifyToken } from "./middlewares/verifyToken.js";

import productRouter from './routes/product.route.js';

app.use(cors());
app.use(express.json());

app.use('/api', productRouter);

app.post("/registro", async (req, res) => {
    const {email, contrasena} = req.body;

    try {
        if(!email || !contrasena) {
            throw {message: "se necesita el email y la contraseña"};
        }
        const hashContrasena = await bcrypt.hash(contrasena, 10);
        const text = "INSERT INTO usuarios (email, contrasena) VALUES ($1, $2) RETURNING *";
        const {rows} = await pool.query(text, [email, hashContrasena]);
        const token = jwt.sign({email}, process.env.JWT_PASS);
        res.json({rows, token});
  
    } catch (error) {
        console.error(error,message);
        res.status(500).json({message: error.message});
    }
});

app.post("/ingresar", async (req, res) => { 
    const {email, contrasena} = req.body;
    try {
        if(!email || !contrasena) {
            throw{message: "se necesita el email y la contraseña"};
        }
        //verificar credenciales
        const text = "SELECT * FROM usuarios WHERE email = $1";
        const {rows: [userDB],
             rowCount,
            } = await pool.query(text, [email]); 

        if(!rowCount) {
            throw{message: "No existe el usuario"};
        }
        const verifyPass = await bcrypt.compare(contrasena, userDB.contrasena);

        if(!verifyPass) {
            throw{message: "Contraseña incorrecta"};
        }
        // generar jwt
        const token = jwt.sign({email}, process.env.JWT_PASS);
        res.json({token});
    } catch (error) {
        console.error(error.message);
        res.status(500).json({message:error.message});
    }
});

app.get("/dashboard", verifyToken, async (req, res) => { 
    
    try { 

    const text = "SELECT * FROM usuarios WHERE email = $1";
    const { rows } = await pool.query(text, [req.email]);
    res.json(rows);

    } catch (error) {
        console.error(error.message);
        res.status(500).json({message:error.message}); 
    }
});

app.get("/tienda", async (req, res) => { 
    
    try { 

    const text = "SELECT * FROM productos";
    const { rows } = await pool.query(text);
    res.json(rows);

    } catch (error) {
        console.error(error.message);
        res.status(500).json({message:error.message}); 
    }
});

app.get("/detalle/:id", async (req, res) => { 
    const {id} = req.params;
    try { 

    const text = "SELECT * FROM productos WHERE id = $1";
    const { rows } = await pool.query(text, [id]);
    res.json(rows);

    } catch (error) {
        console.error(error.message);
        res.status(500).json({message:error.message}); 
    }
});
 

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log("Escuchando peticiones en el puerto: " + PORT);
});