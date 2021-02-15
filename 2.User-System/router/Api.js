const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const security = require('../tools/security');

router.post('/create', (req, res) => {
    //todo: username should be unique
    if(!security.findUser(req.users, req.body.username, req.body.password)) {
        req.users.push({...req.body, isLoggedIn: false});
        fs.writeFileSync(path.join(__dirname, '..', 'data', 'users.json'), JSON.stringify(req.users, null, 2));
        console.log(`LOG::> ${req.body.username} created`);
        return res.status(201).json({result: true});
    }
    console.log(`LOG::> ${req.body.username} exist`);

    res.status(200).json({result: "user exist"});
});

router.post('/login', (req, res) => {
    let user = security.findUser(req.users, req.body.username, req.body.password);
    if (user) {
        user.isLoggedIn = true;
        let token = security.encode(`${user.username}***${user.password}`);
        global.gLoginToken = token;
        res.json({token, status: 200});
    } else
        res.json({status: 404});
});

router.get('/logout', (req,res)=>{
    let token = security.decode(gLoginToken);
    let user = security.findUser(req.users, token[0], token[1]);
    user.isLoggedIn = false;
    res.json({status:200});
});

router.post('/update-info', security.checkLogin, (req,res)=>{
    let reqToken = security.decode(req.body.token);
    let user = req.users.find(u => u.username === reqToken[0] && u.password === reqToken[1]);
    let update = req.body;
    user.name = update.name;
    user.username = update.username;
    user.email = update.email;
    user.gender = update.gender;
    let token = security.encode(user.username+"***"+user.password);
    gLoginToken = token;
    security.updateDB(req.users);
    res.json({status:200, token});
});

router.post('/update-password', security.checkLogin, (req, res) => {
    let reqToken = security.decode(req.body.token);
    let user = req.users.find(u => u.username === reqToken[0] && u.password === reqToken[1]);
    let update = req.body;
    if(update.oldPassword !== reqToken[1])
        return res.json({status: 400, message: "old password is incorrect"});
    user.password = update.newPassword;
    gLoginToken = security.encode(user.username+"***"+user.password);
    security.updateDB(req.users);
    res.json({status:200});
});



module.exports = router;