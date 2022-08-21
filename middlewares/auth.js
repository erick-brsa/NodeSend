import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
    const authHeader = req.get('Authorization');

    if (authHeader) {
        const token = authHeader.split(' ')[1];
        try {
            const user = jwt.verify(token, process.env.SECRET_KEY);
            req.user = user;
        } catch (error) {
            console.log(error);
        }
    }
    return next();    
}

export default auth;