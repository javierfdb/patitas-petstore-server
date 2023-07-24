import * as dotenv from "dotenv";
dotenv.config();
import { pool } from "./database/connection.js";
import express from 'express';

import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import cors from 'cors';

export const app = express();

import { verifyToken } from "./middlewares/verifyToken.js";

import productRouter from './routes/product.route.js';

app.use(cors());
app.use(express.json());

app.use('/', productRouter); // acá saque lo de api

app.post("/registro", async (req, res) => {
    const {correo, contrasena} = req.body;

    try {
        if(!correo || !contrasena) {
            throw {message: "se necesita el correo y la contraseña"};
        }

        const hashContrasena = await bcrypt.hash(contrasena, 10);
        const text = "INSERT INTO usuarios (correo, contrasena) VALUES ($1, $2) RETURNING *";
        const {rows} = await pool.query(text, [correo, hashContrasena]);
        const token = jwt.sign({correo}, process.env.JWT_PASS);
        res.status(201).json({rows, token});
        
    } catch (error) {
        console.error(error, message);
        res.status(500).json({message: error.message});
    }
});

app.post("/ingresar", async (req, res) => { 
    const {correo, contrasena} = req.body;
    try {
        if(!correo || !contrasena) {
            throw{message: "se necesita el correo y la contraseña"};
        }
        const text = "SELECT * FROM usuarios WHERE correo = $1";
        const {rows: [userDB],
             rowCount,
            } = await pool.query(text, [correo]); 

        if(!rowCount) {
            throw{message: "No existe el usuario"};
        }
        const verifyPass = await bcrypt.compare(contrasena, userDB.contrasena);

        if(!verifyPass) {
            throw{message: "Contraseña incorrecta"};
        }
        const token = jwt.sign({correo}, process.env.JWT_PASS);
        res.json({token});
    } catch (error) {
        console.error(error.message);
        res.status(500).json({message:error.message});
    }
});

app.get("/dashboard", verifyToken, async (req, res) => { 
    
    try { 

    const text = "SELECT * FROM usuarios WHERE correo = $1";
    const { rows } = await pool.query(text, [req.correo]);
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

app.get("/dashboard/mis-publicaciones", verifyToken, async (req, res) => { 
    
    try { 

    const text = "SELECT * FROM productos WHERE correo = $1";
    const { rows } = await pool.query(text, [req.correo]);
    res.json(rows);

    } catch (error) {
        // console.error(error.message);
        res.status(500).json({error});  
    }
});

app.post("/dashboard/publicar", async (req, res) => {
    const {titulo, descripcion, correo, imagen, precio, categoria, megusta} = req.body;

    try {
        if(!titulo || !descripcion || !correo || !imagen || !precio || !categoria || !megusta) {
            throw {message: "se necesita el correo y la contraseña"};
        }
        const text = "INSERT INTO productos (titulo, descripcion, correo, imagen, precio, categoria, megusta) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *";
        const {rows} = await pool.query(text, [titulo, descripcion, correo, imagen, precio, categoria, megusta]);
        res.json({rows});
  
    } catch (error) {
        console.error(error, message);
        res.status(500).json({message: error.message});
    }
});
 
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log("Escuchando peticiones en el puerto: " + PORT);
});

