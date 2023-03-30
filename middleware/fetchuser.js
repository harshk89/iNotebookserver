require('dotenv').config();
var jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET_KEY;

const fetchuser = (req, res, next) => {
    //Get the user from the fwt token and add id to req object
    const token = req.header('auth-token');
    if(!token) {
        res.status(401).send({error: "Please authenticate using a valid token"})
    }
    try {
        // console.log("verifying token")
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user;
        console.log(req);
        next();
    } catch (error) {
        res.status(401).send({error: "Please authenticate using a valid token"})
    }
    
}

module.exports = fetchuser;
