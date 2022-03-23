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
// app.get('/products', async(req, res) => {
//   result = await db.find({});
//   console.log(result.length);
//   res.send(result);
// });

app.get('/products', async(request, response) => {
	let page = parseInt(request.query.page);
  	let size = parseInt(request.query.size);
  	let debut = parseInt((page-1)*size);

	const result = await db.find({});
	let prod =[];	
	try{

		if(page==null)
		{
			page=1;
		}
		if(size==null)
		{
			size=12;
		}

		for(i=debut; i< debut+size;i++){

			if(result[i] != null){
 				prod.push(result[i]);
 			}
 		}

		response.send({"page" :true,"success" :true, "data" : { "meta" :{"currentPage":page, "pageSize":size, 
			"pageCount":prod.length, "count":result.length}, "result":prod}});
		//response.send({'a': prod});
	}catch(e){
		response.send(e);
	}
})

// app.get('/products', async (request, response) => {
//   // set default values for query parameters
//   const { brand = 'all', price = 'all', limit = 12, skip = 0 , sort = 1} = request.query;
//   if (brand === 'all' && price === 'all') {
//       const products = await db.find_limit([{ '$sort': { "price": parseInt(sort)} }, { '$limit': parseInt(limit) }, { '$skip': parseInt(skip) }]);
//       response.send(products);
//   } else if (brand === 'all') {
//       const products = await db.find_limit([{ '$match': { 'price': { '$lte': parseInt(price) } } }, { '$sort': { "price": parseInt(sort) } }, { '$limit': parseInt(limit) }, { '$skip': parseInt(skip) }]);
//       response.send(products);
//   } else if (price === 'all') {
//       const products = await db.find_limit([{
//           '$match': { 'brand': brand }
//       }, { '$sort': { "price": parseInt(sort) } }, { '$limit': parseInt(limit) }, { '$skip': parseInt(skip) }]);
//       response.send(products);
//   } else {
//       const products = await db.find_limit([{'$match': { 'brand': brand }},
//           { '$match': { 'price': { '$lte': parseInt(price) } } },
//           { '$sort': { "price": parseInt(sort)} }, { '$limit': parseInt(limit) }, { '$skip': parseInt(skip) }]);
//       response.send(products);
//   }
// });

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