const express = require('express');
const DBA = require('./dba.js');

const app = express();

const port = 5000;

const Dba = new DBA();

var stock = [
    {id : 1, name : "Now", company : 'Service Now Inc'},
    {id : 2, name : "INTU", company : 'Intuit Inc.'},
    {id : 3, name : "TSLA", company : 'Tesla Inc'},
    {id : 4, name : "AMZN", company : 'Amazon.com Inc.'},
    {id : 5, name : "AAPL", company : 'Apple Inc.'}
];

var stock_price = [
    {id : 1, stockId : 1, timestamp : 1564244631, price : 100},
    {id : 2, stockId : 1, timestamp : 1564244831, price : 101},
    {id : 3, stockId : 1, timestamp : 1564244931, price : 105},
    {id : 4, stockId : 1, timestamp : 1564245631, price : 104},
    {id : 5, stockId : 2, timestamp : 1564244631, price : 105},
    {id : 6, stockId : 2, timestamp : 1564244831, price : 120},
    {id : 7, stockId : 2, timestamp : 1564244931, price : 110},
    {id : 8, stockId : 2, timestamp : 1564245631, price : 115},
    {id : 9, stockId : 3, timestamp : 1564244631, price : 200},
    {id : 10, stockId : 3, timestamp : 1564244831, price : 210},
    {id : 11, stockId : 3, timestamp : 1564244931, price : 205},
    {id : 12, stockId : 3, timestamp : 1564245631, price : 190},
    {id : 13, stockId : 4, timestamp : 1564244631, price : 195},
    {id : 14, stockId : 4, timestamp : 1564244831, price : 200},
    {id : 15, stockId : 4, timestamp : 1564244931, price : 210},
    {id : 16, stockId : 4, timestamp : 1564245631, price : 185},
];

var user = [
    {id : 1, name: 'John Smith'},
    {id : 2, name: 'Steve Smith'},
    {id : 3, name: 'Mark Anderson'}
];

var userFollowStock = [
    {id : 1, userId : 1, stockId : 1, count : 5, purchase_price : 100},
    {id : 2, userId : 1, stockId : 2, count : 5, purchase_price : 100},
    {id : 3, userId : 1, stockId : 3, count : 5, purchase_price : 100},
    {id : 4, userId : 2, stockId : 1, count : 5, purchase_price : 100},
    {id : 5, userId : 2, stockId : 2, count : 5, purchase_price : 100},
    {id : 6, userId : 2, stockId : 3, count : 5, purchase_price : 100},
    {id : 7, userId : 3, stockId : 1, count : 5, purchase_price : 100},
    {id : 8, userId : 3, stockId : 2, count : 5, purchase_price : 100}
];

app.get('/api/stocks', (req, res) => {
    const stocks = stock;

    res.json(stocks);

});

app.get('/api/stock/:id', (req, res) => {

    const values = stock_price.filter(sp => sp.stockId === parseInt(req.params.id));
    if(!values)
        res.status(404).send('No data found for the given stock Id');
    res.json(values);
})

app.get('/api/user/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const userStocks = userFollowStock.filter(us => us.userId === userId);
    const stocks = stock.filter( s => userStocks.find(us => us.stockId === s.id));
    //TODO: Calculate the gain/loss based on the current value
    const gain =  200;

    if(!userStocks || !stocks)
        res.status(404).send("NO stocks found for the given user Id");

    const result = {
        stocks,
        gain,
        userStocks
    }
    console.log(result);
    res.json(result);
});


app.post('/api/user/stocks', (req, res) => {

    let {userId, stockId, count, price} = req.body;
     if(!userId || !stockId || !count || !price) {
         res.status(400).send('Invalid request');
     }
      

    if(!user.find(u => u.id === userId)){
        res.status(400).send('No user found to add stock!!!');
    }
    
    if(!stock.find(s => s.id === stockId)){
        res.status(400).send('No stock found to add to the user!!!');
    }
    
    let id = userFollowStock.length + 1;

    let userObject = {
        id : id,
        userId : req.body.userId,
        stockId : req.body.stockId,
        count : req.body.count,
        purchase_price : price
    }

    userFollowStock.push(userObject);

    res.send(id);
});


app.put('/api/user/stocks', (req, res) => {

    let {userId, stockId, count, price} = req.body;
     if(!userId || !stockId || !count || !price) {
         res.status(400).send('Invalid request');
     }
      
    let userStock = userFollowStock.find(us => us.userId === userId && us.stockId === stockId);

    if(!userStock)
        res.status(404).send("No records found for the given user and stock id");

    userStock.count = count;
    userStock.purchase_price = price;
 
     res.send(userStock.id);
 });


 app.delete('/api/user/stock/:userId/:stockId', (req, res) => {

    console.log(req.params.userId);
    console.log(req.params.stockId);
    const userStock = userFollowStock.find( us => us.userId === parseInt(req.params.userId)
    && us.stockId === parseInt(req.params.stockId));
    if(!userStock)
        res.status(404).send("No records found for the given user and stock id");
    
    const index = userFollowStock.indexOf(userStock);
    userFollowStock.splice(index, 1);

    console.log(userFollowStock);
    res.send(userStock);

 })


app.listen(port, () => console.log(`Listening on port : ${port}`));
