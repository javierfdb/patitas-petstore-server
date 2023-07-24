import { pool } from "../database/connection.js";
import format from "pg-format";

const getProductos = async ({ sort, limit, page, filters }) => {

    let query = "SELECT * FROM productos";
    const arrayValues = [];

    if (filters) {
        query += " WHERE ";
        const propertys = Object.keys(filters);
        const operatorsQueryObjet = {
           $eq: "=",
           $gt: ">",
           $gte: ">=",
           $lt: "<",
           $lte: "<=",
           $ne: "!=",
        };
        for (const key in filters) {
           const name = key;
           const object = filters[name];
           const operator = Object.keys(object)[0];
           const value = object[operator];
           query += "%s %s '%s'";
           arrayValues.push(name, operatorsQueryObjet[operator], value);
           if (key !== propertys[propertys.length - 1]) {
              query += " AND ";
           }
        }

     }

    if(sort) {
        query += " ORDER BY %s %s";
        const property = Object.keys(sort)[0];
        arrayValues.push(property, sort[property]);
    }

    if(limit) {
        query += " LIMIT %s";
        arrayValues.push(limit);  
    }

    if(page) {
        query += " OFFSET %s";
        arrayValues.push((page - 1) * limit);
    }

    const finalQuery = format(query, ...arrayValues);
    const {rows} = await pool.query(finalQuery );
    return rows;
}

const getOneProduct = async(id) => {
    const datoProducto = "SELECT * FROM productos WHERE id = $1";
    const {rows} =  await pool.query(datoProducto, [id]); 
    if(rows.length === 0) {
        throw ({code: "404"});
    }
    return rows[0];
}

const crearProducto = async({titulo, descripcion, correo, imagen, precio, categoria, megusta}) => {
    const datosProducto = "INSERT INTO productos (titulo, descripcion, correo, imagen, precio, categoria, megusta) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *";
    const {rows}= await pool.query(datosProducto, [titulo, descripcion, correo, imagen, precio, categoria, megusta]);
    return rows[0];
}

const update = async (id, {titulo, descripcion, correo, imagen, precio, categoria, megusta} ) => {
    if (!titulo || !descripcion || !correo || !imagen || !precio || !categoria || !megusta  ) {
        throw { code: "400" }; 
    }
    const sentencia = "UPDATE productos SET titulo = $1, descripcion = $2, correo = $3, imagen = $4, precio = $5, megusta = $6, WHERE id = $5 RETURNING *"
    const {rows} = await pool.query(sentencia,[titulo, descripcion, precio, imagen, id]);
    return rows[0];
}

const remove = async (id) => {
    const sentencia = "DELETE FROM productos WHERE id = $1 RETURNING *";
    const {rows} = await pool.query(sentencia, [id]);
    return rows[0];
}

export const productosModelo = {
    getProductos,
    getOneProduct,
    crearProducto,
    update,
    remove
};