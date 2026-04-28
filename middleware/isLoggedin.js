const jwt = require('jsonwebtoken');

const isLoggedin = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) return res.redirect('/admin');


        const takenData = jwt.verify(token, process.env.JWT_SECRET);
        console.log(takenData);
        req.id = takenData.id;
        req.role = takenData.role;
        req.fullname = takenData.fullname;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).send('Unauthorized: Invalid Token');
    }
};

module.exports = isLoggedin;