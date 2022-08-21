import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
    const authHeader = req.get('Authorization');

    if (authHeader) {
        const token = authHeader.split(' ')[1];
        try {
            const user = jwt.verify(token, process.env.SECRET_KEY);
            req.user = user;
        } catch (error) {
            res.status(401).json({ message: 'No autorizado' });
            return next();        
        }
    }
    
    // res.status(401).json({ message: 'No autorizado' });
    return next();    
}

export default auth;