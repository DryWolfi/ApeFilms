const express = require('express');

const router = express.Router();

router.get('/v1', (req, res) => {
    res.render('empty');
});

function checkAuth(req, res, next) {
    if (!req.user) return res.redirect("/err?err=unaut");
    next();  
}
function checkAdmin(req, res, next) {
    if (!req.user) return res.redirect("/err?err=unaut");
    else if (req.user.role !== 1) return res.redirect("/err?err=forb");
    else next(); 
}

module.exports = router;