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
    
    res.json(link);
};