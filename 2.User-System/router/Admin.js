const express =require('express');
const router = express.Router();

const security = require('../tools/security');

router.get('/', (req,res)=>{
    let token = security.decode(gLoginToken);
    res.render('./dashboard/index', {user: security.findUser(req.users, token[0], token[1])});
});

module.exports = router;