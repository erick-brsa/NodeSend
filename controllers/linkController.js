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
    const { original_name, name } = req.body;
    
    // Crear un objeto de enlace
    const link = new Link();
    
    link.url = shortid.generate();
    link.name = name;
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

// Obtener todos los enlaces
export const getAllLinks = async (req, res) => {
    try {
        const links = await Link.find().select('url -_id');
        res.json(links);
    } catch (error) {
        console.log(error);
    }
}

// Obtener el enlace
export const getLink = async (req, res, next) => {

    // Verificar si el enlace existe
    const { url } = req.params;

    const link = await Link.findOne({ url });

    if (!link) {
        res.status(404).json({ message: 'El enlace no existe' });
        return next();
    }

    res.json({ file: link.name, password: false });
    
    next();
};

// Retorna si el enlace tiene password
export const hasPassword = async (req, res, next) => {
    
    const { url } = req.params;

    const link = await Link.findOne({ url });

    if (!link) {
        res.status(404).json({ message: "El enlace no existe"})
        return next();
    }

    if (link.password) {
        return res.json({ password: true, link: link.url })
    }

    next();
}

// Verificar la contraseña
export const verifyPassword = async (req, res, next) => {
    const { url } = req.params
    const { password } = req.body

    // Consultar por el enlace
    const link = await Link.findOne({ url })

    if (!link) {
        res.status(404).json({ message: "El enlace no existe"})
        return next();
    }

    if (bcrypt.compareSync(password, link.password)) {
        // Permitirle descargar el archivo
        next();
    } else {
        return res.status(401).json({ message: 'Contraseña incorrecto' })
    }
    

    res.json({ message: 'Verificando...'})
}