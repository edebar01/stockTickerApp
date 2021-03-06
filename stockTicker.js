var http = require('http');
var url = require('url');
console.log("before Mongo client");
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://ericadebarge:fmlwvF55iM8KpBsQ@cluster0.tq1on.mongodb.net/?retryWrites=true&w=majority";
var port = process.env.PORT || 3000;

http.createServer(function (req, res) 
{
	if (req.url == '/stock')
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
	} //end if 
	else
	{
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.write('<form method="GET" action="stock">');
	    res.write("<h5> Please choose whether you would like to search based on the stock ticker or company name</h5>");
	    res.write('<input type="radio" id="stockTicker" name="radio" value="stockTicker">');
	    res.write('<label for="stockTicker">Stock Ticker</label><br>');
	    res.write('<input type="radio" id="company" name="radio" value="company">');
	    res.write('<label for="company">Company Name</label><br><br>');
	    res.write('<input type="text" name="input"><br><br>');
	    res.write('<input type="submit">');
	    res.write('</form>');
	    res.end();
	}

}).listen(port);
