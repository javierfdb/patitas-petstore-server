import { pool } from "../database/connection.js";
import format from "pg-format";

const getProductos = async ({sort, limit}) => {
    const query = "SELECT * FROM productos ORDER BY %s %s";
    const finalQuery = format(query, Object.keys(sort)[0], sort.titulo);
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

const crearProducto = async({titulo, descripcion, precio, imagen}) => {
    const datosProducto = "INSERT INTO productos (titulo, descripcion, precio, imagen) values ($1, $2, $3, $4) RETURNING *";
    const {rows}= await pool.query(datosProducto, [titulo, descripcion, precio, imagen]);
    return rows[0];
}

const update = async (id, {titulo, descripcion, precio, imagen} ) => {
    if (!titulo || !descripcion || !precio || !imagen  ) {
        throw { code: "400" }; 
    }
    const sentencia = "UPDATE productos SET titulo = $1, descripcion = $2, precio = $3, imagen = $4 WHERE id = $5 RETURNING *"
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