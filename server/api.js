const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const db = require('./db');
const { ObjectId } = require('mongodb');

const PORT = 8092;

const app = express();

module.exports = app;

app.use(require('body-parser').json());
app.use(cors());
app.use(helmet());

app.options('*', cors());

app.get('/', (request, response) => {
  response.send({'ack': true});
});

//Get all produts' id
app.get('/products/_id', async(req, res) => {
  result = await db.find([{},{"_id":1}]);
  result=result.map(function(item){ return item._id; })
  console.log(req.params._id)
  console.log(result.length);
  res.send(result);
});

//Get specific product:
app.get('/products_specific', async(req, res) => {
  result = await db.find({"_id":"678384c9-20bd-5151-9e1a-382984501eb8"});
  console.log(result.length);
  res.send(result);
});


//Get all products: 
app.get('/products', async(req, res) => {
  result = await db.find({});
  console.log(result.length);
  res.send(result);
});

//Get product with search params:
app.get('/products_test', async(req, res) => {
  //console.log(req.params._id)
  const mysort = { "price": -1 };

  result= await db.find({}).sort(mysort);

  console.log(result.length);
  res.send(result);

});

//Get product with search params:
app.get('/products/search', async(req, res) => {
  //console.log(req.params._id)
  
  var match = {};
  var queryAgg = [];
  
  const limit = parseInt(req.query.limit);
  const brand = req.query.brand;
  const price = parseInt(req.query.price);

  if (brand !== undefined){
    match["brand"] = brand;
  }
  if (price !== undefined){
    match["price"] = {$lt:price};
  }
  if(limit !== undefined){
    queryAgg.push({$match : match});
    queryAgg.push({$limit : limit});
    console.log("query : ", queryAgg);
    result = await db.aggregate(queryAgg);
  }
  else{
    result = await db.find(match);
  }
  
    // console.log(result.length);
  res.send(result);
});

app.listen(PORT);

console.log(`📡 Running on port ${PORT}`);