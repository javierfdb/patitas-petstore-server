import {handleErrors} from "../database/errors.js";
import {productosModelo} from "../models/product.model.js"; 


const getAllProducts = async (req, res) => {
    const {sort, limit = 6, page = 1, filters } = req.query;
    try {
        const resultado =  await productosModelo.getProductos({ sort, limit, page, filters });
        return res.json({resultado});
      } catch (error) {
        console.log(error);
        const { status, message } = handleErrors(error.code);
        return res.status(status).json({ ok: false, result: message }); 
      }
}


const getSingleProduct = async (req, res) => {
    const {id} = req.params;
    try {
        const resultado =  await productosModelo.getOneProduct(id);
        return res.status(200).json({ok:true, resultado});
    } catch (error) {
      console.log(error);
      const { status, message } = handleErrors(error.code);
      return res.status(status).json({ ok: false, result: message }); 
    }
}

const cargarProduct = async (req, res) => {
    const {titulo, descripcion, precio, imagen} = req.body
    try {
        const resultado = await productosModelo.crearProducto({titulo, descripcion, precio, imagen}); 
        return res.status(201).json({ok:true, resultado});
    } catch (error) {
        console.log(error);
        const { status, message } = handleErrors(error.code);
        return res.status(status).json({ ok: false, result: message });       
    } 
}

const updateProduct = async (req, res) => {
    const {id} = req.params;
    const {titulo, descripcion, precio, imagen} = req.body; 
    try {
        const resultado = await productosModelo.update(id, {titulo, descripcion, precio, imagen});
        return res.status(200).json({ok:true, resultado});
    } catch (error) {
        const { status, message } = handleErrors(error.code);
        return res.status(status).json({ ok: false, result: message });        
    }
}

const deleteProduct = async (req, res) => {
    const {id} = req.params;
    try {
        const resultado = await productosModelo.remove(id);
        return res.status(200).json({ok:true, resultado});
    } catch (error) {
        const { status, message } = handleErrors(error.code);
        return res.status(status).json({ ok: false, result: message });    
    }
}

export const productsController = {
    getAllProducts,
    getSingleProduct,
    cargarProduct,
    updateProduct,
    deleteProduct
}