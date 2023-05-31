import jwt from "jsonwebtoken";
require("dotenv").config();
import constant from "./constant";

// RewriteCond %{REQUEST_URI}  ^/socket.io            [NC]
// RewriteCond %{QUERY_STRING} transport=websocket    [NC]
// RewriteRule /socket/(.*)           ws://18.139.48.18:4002/$1 [P,L]

// ProxyPass        /socket.io http://18.139.48.18:4002/socket.io
// ProxyPassReverse /socket.io http://18.139.48.18:4002/socket.io


export function verifyJWTToken(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.SECRET_JWT_KEY, (err, tkn) => {
            if (err || !tkn) {
                return reject(err);
            }
            resolve(tkn);
        });
    });
}


export default {
    verifyJWTToken
};
