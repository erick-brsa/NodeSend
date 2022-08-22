import multer from "multer";
import shortid from "shortid";

import fs from "fs";
import path from 'path';
import url from 'url';

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
    console.log(req.file)
    try {
        fs.unlinkSync(path.join(__dirname, '../uploads/', req.file));
        res.json({ message: 'Deleted file' });
    } catch (error) {
        console.log(error);
    }
}