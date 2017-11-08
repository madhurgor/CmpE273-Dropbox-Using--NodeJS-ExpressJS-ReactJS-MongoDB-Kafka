var mysql = require('mysql');

var pool  = mysql.createPool({
	host     : 'localhost',
	user     : 'root',
	password : 'root',
	database : 'test',
	port: 3306
});

function fetchData(callback,sqlQuery){

	console.log("\nSQL Query::"+sqlQuery);

	pool.getConnection( (error, connection) => {
		connection.query(sqlQuery, function(err, rows, fields) {
			if(err){
				console.log("ERROR: " + err.message);
				connection.release();
				console.log("\nConnection released..");
			}
			else
			{
				console.log("DB Results:"+rows);
				callback(err, rows);
				connection.release();
				console.log("\nConnection released..");
			}
		});
	});
}

function insertData(callback,sql){

	console.log("\nSQL:"+sql);

	pool.getConnection( (error, connection) => {
		connection.query(sql, function(err, result) {
			if(err){
				console.log("ERROR: " + err.message);
				console.log("\nConnection closing..");
				connection.release();
				console.log("\nConnection closed.");
			}
			else
			{
				console.log("DB Results:"+result);
				callback(err, result);
				console.log("\nConnection closing..");
				connection.release();
				console.log("\nConnection closed.");
			}
		});
	});
}

exports.fetchData=fetchData;
exports.insertData=insertData;
