var http=require('http');
http.createServer(function(req,res){
    res.write("Kowshika");
    res.end();
}).listen(8000);