/**
 *this service will perform common tasks for oracle-db via 'oracledb' [official node module from oracle]
 *@ayanb
 *@111215 
 */

//instantiate required module
var oracledb = require('oracledb');

/**
 * this function will not take any parameters.
 * static parameters should be changed from here directly if required
 */

//var o = {};

var o = {
  dbName:null,
  tableName:null,
  fromString: null,
  whereString: null,
  selectString: null,
  intoString: null,
  insertString: null,
  limitString: null,
  orderByString: null,
  insertValue:[],
  placeholderString:null,
  connect: function(cb) {

    console.log("connecting to database");
    oracledb.getConnection({
        user: "user",
        password: "pass",
        connectString: "CONN_STRING"
      },
      function(err, con) {
        if (err) {
          console.error(err.message);
          cb(null);
        }
        cb(con);
      });

    return this;

  },
  releaseConnection: function(connection) {
    console.log("releasing database connection");
    connection.release(
      function(err) {
        if (err) {
          console.error(err.message);
        }
          
      });

   return this;

  },
  clearData:function(){

    this.dbName= null;
    this.tableName= null;
    this.fromString =  null;
    this.whereString =  null;
    this.selectString =  null;
    this.intoString =  null;
    this.insertString =  null;
    this.limitString =  null;
    this.orderByString =  null;
    this.insertValue = [];
    this.placeholderString = null;
  },

  from: function(dbName, tableName) {
    //if already value is set, clear it
    if (this.fromString) {
      this.fromString = null;
    }
    if (dbName && tableName) {
      this.dbName = dbName;
      this.tableName = tableName;
      this.fromString = "FROM " + dbName + "." + tableName + " ";
    }
   
    return this;


  },
  into: function(dbName, tableName) {
    //if already value is set, clear it
    if (this.intoString) {
      this.intoString = null;
    }
    if (dbName && tableName) {
      this.dbName = dbName;
      this.tableName = tableName;
      this.intoString = "INSERT INTO " + dbName + "." + tableName + " ";
    }
    
    //console.log(this.intoString+this.insertString);
    //console.log(this.insertValue);

    return this;


  },
  where: function(whereObject) {

    if (typeof whereObject !== 'object') {
      return;
    }
    var index = 0;
    var GAP = " "; //specifying single gap or space as variable
    var where_string = "WHERE";
    where_string += GAP; //adding space
    for (var i in whereObject) {
      //if this is not the first iteration then append "ADD"
      if (index !== 0) {
        where_string += "AND";
        where_string += GAP; //adding space
      }

      where_string += i; //adding key
      where_string += GAP; //adding space
      where_string += "="; //adding equal
      where_string += "\'" + whereObject[i] + "\'"; //adding val
      where_string += GAP; //adding space
      //we have to apend "AND" for an extra where clause, but only if current iteration is not the last one of 
      //the where object

      //increment the index variable
      index++;
    }

    console.log(where_string);
    this.whereString = where_string;
    return this;

  },
  limit: function(limit_to_num) {
    if (limit_to_num) {
      this.limitString = this.whereString ? "AND rownum <=" + limit_to_num : "WHERE rownum <=" + limit_to_num;
    }
    return this;
  },
  order: function(colName, orderWith) {
    if (!colName) {
      return;
    }
    if (!orderWith) {
      orderWith = 'ASC';
    }
    this.orderByString = " ORDER BY " + colName + " " + orderWith;
    return this;
  },
  fetch: function(columns) {
    var columnsFinal;
    if (typeof columns !== 'object' || columns === null) {
      columnsFinal = '*';
    } else {
      //blank string
      var column_string = "";
      for (var i in columns) {
        //concating with each column name from the coloumns array
        column_string += columns[i];
        column_string += ",";
        //now we need a comma, but not on the last iteration
      }
      //remove the last comma
      var columnsFinal = column_string.slice(0, -1);
    }


    var GAP = " ";
    this.selectString = "SELECT" + GAP + columnsFinal + GAP;
    return this;


  },
  insert:function(rowColumn){

    //var insert_string = "";
    var field_string = ""; //(id,fname,lname)
    var placeholder_string = ""; //(:1,:2,:3)
    //var value_string = []; //[null,'ayan','banerjee']
    var index = 0;
    var GAP = " "; //space

    field_string += "(";
    placeholder_string += "(";

    for (var i in rowColumn) {
      if (index !== 0) {
        field_string += ",";
        placeholder_string += ",";
      }

      field_string += i; //concating field string
      this.insertValue.push(rowColumn[i]); //adding value  to array
      placeholder_string += ":" + (index + 1); //concating placeholder string

      //increment the index variable, this is for manually tracking 
      index++;
    }

    field_string += ")";
    placeholder_string += ")";

    this.insertString = field_string + GAP + "VALUES" + GAP + placeholder_string;

    
    return this;
  },
  //this is the final function of the chain with callback support, now this 
  //function should be same for all chains like 'fetch', 'insert', 'update'
  exec: function(cb) {
    

    var query = "";
    var valueString = this.insertValue ? this.insertValue : [];
    var options  = this.insertValue.length > 0 ? { autoCommit: true }:{outFormat: oracledb.OBJECT,maxRows: 50000}

    if (this.intoString) {
      query += this.intoString;
    }
    if (this.insertString) {
      query += this.insertString;
    }
    if (this.selectString) {
      query += this.selectString;
    }
    
    if (this.fromString) {
      query += this.fromString;
    }
    if (this.whereString) {
      query += this.whereString;
    }
    if (this.limitString) {
      query += this.limitString;
    }
    if (this.orderByString) {
      query += this.orderByString;
    }
    
    console.log(query);
    console.log(valueString);
    console.log(options);

    this.connect(function(con) {
      con.execute(
        query, valueString,options,// bind value for :id 
        function(err, result) {

          if (err) {console.error(err.message); cb(null); } 

          if(o.intoString){
            //now insert query is successfull, but we need to return the lastinsert id, we have to do it manually in oracle
          //this function will only execute if this is an insert query, not required for fetch query
          //we assume that the sequence name will be like this 'table_name_seq'
          //console.log("select "+o.dbName+"."+o.tableName+"_id_seq.nextval");
          //con.execute("select "+o.dbName+"."+o.tableName+"_seq.nextval from dual", [], {}, function(err, nextval) {

            //if (err) {console.error(err.message); cb(null); } 
            //no error here
             con.execute("select "+o.dbName+"."+o.tableName+"_id_seq.currval from dual", [], {}, function(err, currval) {
            
              if (err) {console.error(err.message); cb(null); } 
              //no error here
              
              var last_insert_id = currval.rows[0][0] ;
             
            //console.log("select * from "+o.dbName+"."+o.tableName+" where id="+last_insert_id);
            con.execute("select * from "+o.dbName+"."+o.tableName+" where country_id="+last_insert_id, [], {outFormat: oracledb.OBJECT,maxRows: 50000}, function(err, lastRow) {

               if (err) {console.error(err.message); cb(null); } 

                //send responce
                //console.log('sendddddddddddddddddddding responce');
                cb(lastRow.rows);
                
                //reset variables
                o.clearData();
                //release oracle connection
                o.releaseConnection(con);

              });

            });

           }else{

                //send responce
                cb(result.rows);
                
                //reset variables
                o.clearData();
                //release oracle connection
                o.releaseConnection(con);

           }

          
            
           

          //});
          

        });
    });
    //cb(this.query);
  }
  
}
module.exports = o;
