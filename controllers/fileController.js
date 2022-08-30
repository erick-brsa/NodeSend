import multer from "multer";
import shortid from "shortid";

import fs from "fs";
import path from 'path';
import url from 'url';
import Link from "../models/Link.js";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const uploadFile = async (req, res, next) => {

    const configMulter = {
        limits: { fileSize: req.user ? 1024 * 1024 * 10 : 1024 * 1024 },
        storage: multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, path.join(__dirname, '../uploads/'));
            },
            filename: (req, file, cb) => {
                const ext = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
                cb(null, `${shortid.generate()}${ext}`);
            }
        })
    }

    const upload = multer(configMulter).single("file");

    upload(req, res, async (error) => {
        if (!error) {
            res.json({ file: req.file.filename });
        } else {
            console.log(error);
            return next();
        }
    });
}

export const deleteFile = async (req, res) => {
    try {
        fs.unlinkSync(path.join(__dirname, '../uploads/', req.file));
        res.json({ message: 'Deleted file' });
    } catch (error) {
        console.log(error);
    }
}

// Descargar un archivo
export const downloadFile = async (req, res, next) => {

    const { file } = req.params 

    const link = await Link.findOne({ name: file })

    const fileDownload = path.join((__dirname + '/../uploads/' + file))
    res.download(fileDownload)

    // Si el enlace existe
    const { name, downloads } = link;

    // Si las descargas son iguales a 1 => eliminar el enlace y el archivo
    if (downloads === 1) {
        
        // Eliminar el archivo
        req.file = name;

        // Eliminar el enlace    
        await Link.findOneAndRemove(link._id);
        
        next() 
    }
    
    // Si las descargas son iguales > 1 => restar 1 a las descargas y guardar el enlace
    if (link.downloads > 1) {
        link.downloads--;
        await link.save();
        res.json({ file: link.name });
    }
}