var http=require('http');
const server=http.createServer(function(req,res){
    res.setHeader('Content-Type','text/html');
    res.write('<html>');
    res.write('<head><title>New Project</title></head>');
    res.write('<body><h3>"Welcome to my Node Js project"</h3></body>');
    res.write('</html>');
    res.end();
});
server.listen(4000);
