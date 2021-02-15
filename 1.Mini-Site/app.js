const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

const FOOD = require('./routing/Food');

const PORT = 5002;

//config
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.set('view engine', 'ejs');

//get data
app.use('/', (req, res, next) => {
    res.foods = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'data.json'), 'utf-8'));
    next();
});

//routing
app.get('/about', (req, res) => res.render('./about'));
app.get('/contact', (req, res) => res.render('./contact'));
app.get('/food/:id', (req, res) => {
    let food = res.foods.find(f => f.id === +req.params.id);
    res.render('./show', {food});
});
app.get('/:search?', (req, res) => {
    let foods = res.foods;
    let searchKey = req.params.search;
    //if searched anything return json
    if (searchKey !== undefined && searchKey !== "favicon.ico") {
        //if search is empty return all data with json
        if(searchKey !== "%%%"){
            let reg = new RegExp(`\w*${searchKey}\w*`);
            foods = foods.filter(f => reg.test(JSON.stringify(f)));
        }
        res.json(JSON.stringify(foods));
        //if request is not for search return a view
    } else {
        res.render('./index', {foods});
    }
})

app.listen(PORT, () => console.log("app is running on port " + PORT));