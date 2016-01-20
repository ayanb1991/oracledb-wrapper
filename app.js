/**
* change database connection parameters in /node_modules/node-oracledb-wrapper/index.js under 'connect' function.
*/

//require node-oracledb-wrapper
var db = require('node-oracledb-wrapper');

//insert example
var dataToInsert = {
      COUNTRY_NAME:'Zimbabum',
      ISO_ALPHA2:'ZW',
      ISO_ALPHA3:'ZWE',
      ISO_NUMERIC:'720',
      CURRENCY_CODE:'ZWD',
      CURRENCY_NAME:'Dollar',
      CURRRENCY_SYMBOL:'Z$',
      FLAG:'ZW.png'
  }

db.insert(dataToInsert).into('db_main','country_master').exec(function(newcountry){
  console.log(newcountry);
  res.jsonp(newcountry);
});


//fetch example
db.fetch().from('db_main','country_master').order('country_id','DESC').exec(function(responce){
    console.log(responce);
    res.jsonp(responce);
});

//fetch with where clause example
db.fetch().from('db_main','country_master').where({country_id:154}).exec(function(responce){
    console.log(responce);
    res.jsonp(responce);
});

//fetch with limit  example ex:get 10 results
db.fetch().from('db_main','country_master').limit(10).exec(function(responce){
    console.log(responce);
    res.jsonp(responce);
});

//update example
 var dataToUpdate = {
      COUNTRY_NAME:'Zimhalka',
      ISO_ALPHA2:'ZW',
      ISO_ALPHA3:'ZWE',
      ISO_NUMERIC:'720',
      CURRENCY_CODE:'ZWD',
      CURRENCY_NAME:'Dollar',
      CURRRENCY_SYMBOL:'Z$',
      FLAG:'ZW.png'
  }
//update function
db.update(dataToUpdate).into('db_main','country_master').where({country_name:'Zimbhari'}).exec(function(resp){
  res.jsonp(resp);
  //{"rowsAffected": 1 } 
});


//delete example
db.delete().from('db_main','country_master').where({country_name:'Zimhalka'}).exec(function(responce){
	console.log(responce);
	res.jsonp(responce);
//if deleted successfully responce will be {"rowsAffected": 1 } or {"rowsAffected": 0 } if failed
});