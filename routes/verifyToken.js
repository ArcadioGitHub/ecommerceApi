const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const authHeader =  req.headers.token;
    if(authHeader){
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.JWT_SEC_KEY, (err, user) => {
            if(err) res.status(403).json("token is not valid!");
            res.user = user;
            next();
        });
    } else {
        return res.status(401).json("You are not authenticated!");
    }
}

const verifyTokenAndAuthorization = (req, res, next) => {
    verifyToken(req, res, ()=> {
        if(res.user.id === req.params.id || res.user.isAdmin){
            next();
        } else {
            res.status(403).json("You have no permissions to do this")
        }
    })
}

const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, ()=> {
        if(res.user.isAdmin){
            next();
        } else {
            res.status(403).json("You have no permissions to do this")
        }
    })
}

module.exports = {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin};
