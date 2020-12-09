// var http = require('http');
var url = require('url');
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://ericadebarge:fmlwvF55iM8KpBsQ@cluster0.tq1on.mongodb.net/?retryWrites=true&w=majority";
console.log("before express require");
var express = require('express');
console.log("after express require");
var app = express();
console.log("after express()");
// var querystring = require('querystring') //for extracting POST data

//render ejs files as html
app.set('view engine', 'ejs');

app.listen(port, function() {
    console.log('Our app is running on port ' + port);
});

// set routes
app.get('/', function(req, res) {
    res.render('index');
});

app.get('/stock', function (req, res) 
{
		res.writeHead(200, {'Content-Type': 'text/html'});
		var qobj = url.parse(req.url, true).query;
		var searchType = qobj.radio;
		var searchText = qobj.input;

		MongoClient.connect(uri, function(err, database) {
            if(err) { return console.log(err); return;}
            
              var stockDB = database.db("stockData");
              var companies = stockDB.collection("companies");

	          try {
	             if (searchType == "stockTicker")
	             {
	             	companies.find({Ticker : searchText}).toArray(function(err, items) {
					  if (err) {
						console.log("Error: " + err);
					  } 
					  else 
					  {
					  	// print a message if no documents were found
					    if (items.length === 0) {
					      res.write("No documents match your criteria.");
					      res.end();
					    }

					    res.write("<h3> Results: </h3>");
				    	for (i = 0; i < items.length; i++)
				    	{
				    		res.write(parseInt(i + 1) + ". Company: " + items[i].Company + "<br>");
							res.write("&nbsp &nbsp Stock Ticker: " + items[i].Ticker + "<br> <br>");
				    	}

				    	res.end();			
					  } //end else
					 
					}); //end toArray callback
				} //end if
	            else	
	            {
	            	//user enter company name
	            	companies.find({Company : searchText}).toArray(function(err, items) {
					  if (err) {
						console.log("Error: " + err);
					  } 
					  else 
					  {
					  	// print a message if no documents were found
					    if (items.length === 0) {
					      res.write("No documents match your criteria.");
					      res.end();
					    }

					    res.write("<h3> Results: </h3>");
				    	for (i = 0; i < items.length; i++)
				    	{
				    		res.write(parseInt(i + 1) + ". Company: " + items[i].Company + "<br>");
							res.write("&nbsp &nbsp Stock Ticker: " + items[i].Ticker + "<br> <br>");
				    	}

				    	res.end();			
					  } 
					 
					}); //end toArray callback
	            } //end else
	          } //end try 
	          catch (e) {
	             console.log("Error trying to insert in database");
	             console.log(e);
	          } //end catch
            
              console.log("Success!");
              database.close();
           
        }); //end MongoClient.connect
}).listen(port);
