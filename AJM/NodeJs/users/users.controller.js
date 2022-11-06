const express = require('express');
const router = express.Router();
const userService = require('./user.service');
// routes
router.post('/', authenticate);

module.exports = router;

function authenticate(req, res, next) {
    console.log("login")
    userService.authenticate(req.body,next)
             .then((ele) =>{res.status(200).json(ele)})
            .catch((a)=>{next});
}
