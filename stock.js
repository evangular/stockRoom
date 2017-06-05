#!/usr/bin/node

// {'dimensions':{'width':{value:100,type:'mm'},'height':{'value':100,'type':'mm'}},'power':{'volts': 10.3,'amps': 4.0}}
//"{'wattage':{'value': (), 'type': '()'}, 'height': {'value': 100, 'type': 'mm'}}"

const prettyjson = require('prettyjson');
String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

var POS_COST=2,POS_NAME=3,POS_ORIGIN=4,POS_POSTAGE=5,POS_TYPE=6,POS_JSON=7;
var MIN_FIELDS=5;

if(process.argv.length<MIN_FIELDS){
	console.log(process.argv[1]+' <cost> <name> <origin> <postage> <tool/material> <JSON>');
	return; 
}

// var purchaseDate=null;
// if(process.argv.length>7){
//   var parts =process.argv[7].split('/');
//   if(parts.length<3){
//    console.log('date format: DD/MM/YYYY');
//    return;
//   }
//   purchaseDate=new Date(parts[2],parts[1]-1,parts[0]); 
// }
var attributes={};
if(process.argv.length>POS_JSON){
  attributes=JSON.parse(process.argv[POS_JSON].replaceAll("\'",'\"'));
}

var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

// Connection URL 
var url = 'mongodb://localhost:27017/esme';
// Use connect method to connect to the Server 
MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("connected correctly to server");
//mongo output, makes mongo collection?
    var collection = db.collection('orders');
    var item={
        cost: parseFloat(process.argv[2]),
        name: process.argv[3],
        origin: process.argv[4],
        postage: process.argv[5]==='n'?null:parseFloat(process.argv[5]),
        type: process.argv[6],
        attributes: attributes
      };
    collection.insert(item,function(err){
        assert.equal(null, err);
        item._id=item._id.id.join('');
        console.log('sent order to database');
        console.log(prettyjson.render(item));
        process.exit();
    });
});

//client output, variable result of aggregate search
/*    console.log('+stock added to database');
    collection.aggregate([{ $match: { why: process.argv[4]} },{
        $group: {
            _id: null,
            total: {
                $sum: "$cost"
            }
        } 
    }],function(err,result){
      assert.equal(null, err);
      console.log('-total spending on '+process.argv[4]+' to date £'+result[0].total);
          collection.aggregate([{
              $group: {
                  _id: null,
                  total: {
                      $sum: "$cost"
                  }
              } 

          }],function(err,result){
            assert.equal(null, err);
            console.log('-total spending to date £'+result[0].total);
            process.exit();
          })
    });    
  }); */
