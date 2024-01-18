import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';

export default function handler(req: any, res: any) {
    cookieParser()(req, res, () => {
        const token = req.cookies['jwt_token'];
        const key = process.env.JWT_AUTH_SECRET_KEY as string;

        jwt.verify(token, key, (err: any, decoded: any) => {
            if (err) {
                return res.status(401).json({ valid: false });
            }
            return res.status(200).json({ valid: true });
        });
    });
}
