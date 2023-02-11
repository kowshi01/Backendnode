var http = require('http');
const server = http.createServer(function (req, res) {
    const url = req.url;
    if (url === '/home') {
        res.write('<html>');
        res.write('<head><title>New Project</title></head>');
        res.write('<body><h3>"Welcome home"</h3></body>');
        res.write('</html>');
        res.end();
    } else if (url === '/about') {
        res.write('<html>');
        res.write('<head><title>New Project</title></head>');
        res.write('<body><h3>"Welcome to About Us page"</h3></body>');
        res.write('</html>');
        res.end();
    } else if(url==='/node'){
        res.write('<html>');
        res.write('<head><title>New Project</title></head>');
        res.write('<body><h3>"Welcome to my Node Js project"</h3></body>');
        res.write('</html>');
        res.end();
    }

});
server.listen(4000);
