const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/show/:s', (req, res) => {
    res.sendFile(path.join(__dirname,'..','public','show.html'));
});

router.get('/read/:id', (req, res) => {
    res.json(JSON.stringify(res.foods.find(v=>v.id === +req.params.id)));
});

router.get('/:foodType', (req,res)=>{
    res.json(JSON.stringify(res.foods.filter(v=>v.type === req.params.foodType)));
});

module.exports = router;