Hi, I have faced problems writing huge line of queries when using 'node-oracledb', which is the official Oracle driver for node.
But it's pretty much low level. So I wanted a wrapper which can provide easy query building like Bookshelf.js or Knex.js. I have tried a little and I expect others to contribute in it, if you found it worthy please do a pull request. Thanks. Ayan.


Examples
---------------------------------
Insert Query
---------------
var db = require('wrapper');

var dataToInsert = {
      CITY_NAME:'Cuttack',
      STATE_ID:2976,
      COUNTRY_ID:180,
      COUNTRY_CD:'IN'
  }

db.insert(dataToInsert).into('dbName','tableName').exec(function(result){
  console.log(result);
  res.jsonp(result);
});

-------------------------------------------
Select Or Fetch Query
-------------------------------------------

var db = require('wrapper');

 db.fetch().from('dbName','tableName').limit(10).order('id','DESC').exec(function(responce){
        console.log(responce);
        res.jsonp(responce);
 });


Only two functions are working now, I have to run tests on these two, after that I will work on other methods. Obviously forks and pull requests are welcome. 