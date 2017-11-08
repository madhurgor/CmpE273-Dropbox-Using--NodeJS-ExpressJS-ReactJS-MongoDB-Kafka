var mysql = require('mysql');

//Put your mysql configuration settings - user, password, database and port
function getConnection(){
	var connection = mysql.createConnection({
		host     : 'localhost',
		user     : 'root',
		password : 'root',
		database : 'test',
		port	 : 3306
	});
	return connection;
}


function fetchData(callback,sqlQuery){

	console.log("\nSQL Query::"+sqlQuery);

	var connection=getConnection();

	connection.query(sqlQuery, function(err, rows, fields) {
		if(err){
			console.log("ERROR: " + err.message);
			connection.end();
			console.log("\nConnection closed..");
		}
		else
		{	// return err or result
			console.log("DB Results:"+rows);
			callback(err, rows);
			connection.end();
			console.log("\nConnection closed..");
		}
	});
}

function insertData(callback,sql){

	console.log("\nSQL:"+sql);

	var connection = getConnection();

	connection.query(sql, function(err, result) {
		if(err){
			console.log("ERROR: " + err.message);
			connection.end();
			console.log("\nConnection closed..");
		}
		else
		{	// return err or result
			console.log("DB Results:"+result);
			callback(err, result);
			connection.end();
			console.log("\nConnection closed..");
		}
	});
}

exports.fetchData=fetchData;
exports.insertData=insertData;
