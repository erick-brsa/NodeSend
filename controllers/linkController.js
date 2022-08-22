import bcrypt from 'bcrypt';
import shortid from 'shortid';
import Link from '../models/Link.js';
import { validationResult } from 'express-validator';

export const createLink = async (req, res, next) => {

    // Revisar si hay errores
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Obtener el nombre del archivo
    const { original_name } = req.body;
    
    // Crear un objeto de enlace
    const link = new Link();
    
    link.url = shortid.generate();
    link.name = shortid.generate();
    link.original_name = original_name;    
    
    // Si el usuario está autenticado
    if (req.user) {
        const { downloads, password } = req.body;
        // Asignar el número de descargas
        if (downloads) {
            link.downloads = downloads;
        }

        // Asignar el password
        if (password) {
            const salt = await bcrypt.genSalt(10);
            link.password = await bcrypt.hash(password, salt);
        }

        // Asignar el autor
        link.author = req.user.id;
    }
    
    // Almacenar el enlace en la base de datos
    try {
        await link.save();
        res.status(201).json({ message: `${link.url}` });
        return next();
    } catch (error) {
        console.log(error);        
    }
};

// Obtener el enlace
export const getLink = async (req, res, next) => {

    // Verificar si el enlace existe
    const { url } = req.params;

    const link = await Link.findOne({ url });

    if (!link) {
        res.status(404).json({ message: 'El enlace no existe' });
        return next();
    }

    // Si el enlace existe
    const { name, downloads } = link;

    // Si las descargas son iguales a 1 => eliminar el enlace y el archivo
    if (downloads === 1) {
        
        // Eliminar el archivo
        req.file = name;

        // Eliminar el enlace    
        await Link.findOneAndRemove(req.params.url);
        
        next() 
    }
    
    // Si las descargas son iguales > 1 => restar 1 a las descargas y guardar el enlace
    if (link.downloads > 1) {
        link.downloads--;
        await link.save();
        res.json({ file: link.name });
    }
};