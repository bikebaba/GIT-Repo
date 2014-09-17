/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var express = require('express');
app = express();
//articles = require('./controllers/articles');
var bodyParser = require('body-parser');
var AWS = require('aws-sdk');
AWS.config.loadFromPath('../config.json');
var table = 'archive_meta';
//var searchPath = 'search-postpic-domain-nc6zdberkdqmxq3xqdb5pcuuti.us-east-1.cloudsearch.amazonaws.com';
var searchPath = 'search-archive-meta-domain-5siojmf2dz2mkdy3en6ry6dbby.us-east-1.cloudsearch.amazonaws.com';
//app.use(bodyParser());
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded());

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
});

// simple logger
app.use(function(req, res, next){
  console.log('%s %s', req.method, req.url);
  next();
});

//app.use(express.bodyParser());

var notImplemented = function(req, res) {
    res.send(501)
}

// 'users/me' => [action1]....action[n]
// eg: /users/me' +> looks up user and renders a profile view

app.get("/title/search/:term", function(req, res) {
    
   var csd = new AWS.CloudSearchDomain({endpoint: searchPath}); 
   //var sTerm = term;
   var params = {
  query: req.params.term, /* required */
  //cursor: 'STRING_VALUE',
  //expr: 'STRING_VALUE',
  //facet: 'STRING_VALUE',
  //filterQuery: 'STRING_VALUE',
  //highlight: 'STRING_VALUE',
  //partial: true || false,
  queryOptions: '{fields:["title"]}',
  return: '_all_fields',
  queryParser: 'simple',
  //format: '_xml',
  //return: 'STRING_VALUE',
  size: 1000,
  //sort: 'STRING_VALUE',
  start: 0
    };
    csd.search(params, function(err, data) {
      if (err) console.log(err, err.stack); // an error occurred
      else     console.log(res.json);           // successful response
      //data = JSON.parse(data);
       res.send(data);
});


 //  res.send("Hello " + req.param('search'))     ;
                }
        );

app.get("/getfromID/:term", function(req, res) {
var db = new AWS.DynamoDB();

var params = {
"TableName" : table,
"Key" : { "uuid" : { "S" : req.params.term } }
    }

 db.getItem(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
      else     console.log(res.json);           // successful response
      //data = JSON.parse(data);
       res.send(data);
  });
 }
    );
    
app.post("/updateID/:term", function(req, res) {
var db = new AWS.DynamoDB();

console.log(req.params.term);
//'Pic_meta', '82.0.378880163', null, { 'CITY': { value: 'Ashburn' } }, {}
var params = {
"TableName" : table,
"Key" : { "uuid" : { "S" : req.params.term } } ,
"AttributeUpdates": {
    // this would add the attribute "4" with the string "a string of text" to the item with the hash key "5:15"
    "byline": {
      "Value": { "S": req.param("BY-LINE") },
      "Action": "PUT"
    },
    "caption": {
      "Value": { "S": req.param("caption") },
      "Action": "PUT"
    },
    "category": {
      "Value": { "S": req.param("category") },
      "Action": "PUT"
    },
    "source": {
      "Value": { "S": req.param("source") },
      "Action": "PUT"
    },
    "headline": {
      "Value": { "S": req.param("headline") },
      "Action": "PUT"
    }
  },
  "ReturnValues" : 'ALL_NEW'
//"AttributeUpdates" : { "" : { "Action": 'PUT', "Value" : {"CITY" : { "S" : 'Ashburn' }} }    }
}
db.updateItem(params,
               function(err, data) {
                   
                   if (err) console.log(err, err.stack); // an error occurred
                    else     console.log(res.json);           // successful response
                    //data = JSON.parse(data);
                     res.send(data);
               });

 }
    );
    
    
app.get("/search/:term", function(req, res) {
    
   var csd = new AWS.CloudSearchDomain({endpoint: searchPath}); 
   //var sTerm = term;
   var params = {
  query: req.params.term, /* required */
  cursor: 'initial',
  //expr: 'STRING_VALUE',
  //facet: 'STRING_VALUE',
  //filterQuery: 'STRING_VALUE',
  //highlight: 'STRING_VALUE',
  //partial: true || false,
  //queryOptions: '{fields:["title"]}',
  return: '_all_fields',
  queryParser: 'simple',
  //format: '_xml',
  //return: 'STRING_VALUE',
  size: 3,
  //sort: 'STRING_VALUE',
  start: 0
    };
    csd.search(params, function(err, data) {
      if (err) console.log(err, err.stack); // an error occurred
      else     console.log(res.json);           // successful response
      //data = JSON.parse(data);
       res.send(data);
});


 //  res.send("Hello " + req.param('search'))     ;
                }
        );

app.get("/search", function(req, res) {
    
   var csd = new AWS.CloudSearchDomain({endpoint: searchPath}); 
   
   //console.log(req.param.name);
     //   console.log('aaaa  ' + req.param('name'));
       // console.log(req.body);
        //res.send(req.json);
   //var sTerm = term;
   var params = {
  query: "(and by_line:'" + req.param("by_line") +           "'  \n\
        (and caption:'" + req.param("caption") + "')    \n\
        (and category:'" + req.param("category") + "')    \n\
        (and source:'" + req.param("source") + "')  \n\
        (and headline:'" + req.param("headline") + "')  \n\
        (and date_created:'" + req.param("date_created") + "') \n\
        )",
  return: '_all_fields',
  queryParser: 'structured',
  size: 1000,
  start: 0
    };
    csd.search(params, function(err, data) {
      if (err) console.log(err, err.stack); // an error occurred
      else     console.log(res.json);           // successful response
        console.log(req.param('term'));
        console.log('aaaa  ' + req.param('term'));
        console.log(req.body);
      //data = JSON.parse(data);
       res.send(data);
}
        );
   
 //  res.send("Hello " + req.param('search'))     ;
                }
        );


app.post("/search", function(req, res) {
    
   var csd = new AWS.CloudSearchDomain({endpoint: searchPath}); 
   
   //console.log(req.param.name);
     //   console.log('aaaa  ' + req.param('name'));
       // console.log(req.body);
        //res.send(req.json);
   //var sTerm = term;
   var params = {
  query: "(and byline:'" + req.param("by_line") +           "'  \n\
        (and caption:'" + req.param("caption") + "')    \n\
        (and category:'" + req.param("category") + "')    \n\
        (and source:'" + req.param("source") + "')  \n\
        (and headline:'" + req.param("headline") + "')  \n\
        (and datecreated:'" + req.param("date_created") + "') \n\
        )",
  return: '_all_fields',
  queryParser: 'structured',
  size: 1000,
  start: 0
    };
    csd.search(params, function(err, data) {
      if (err) console.log(err, err.stack); // an error occurred
      else     console.log(res.json);           // successful response
        console.log(req.param('term'));
        console.log('aaaa  ' + req.param('term'));
        console.log(req.body);
      //data = JSON.parse(data);
       res.send(data);
}
        );
   
 //  res.send("Hello " + req.param('search'))     ;
                }
        );

app.get("/goodbye", function(req, res) {
   res.send("Bye Bye world Dude")     ;
                }
        );


app.listen(8080, function() {
    console.log("Server is Running on 8080");
})