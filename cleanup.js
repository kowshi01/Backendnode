//nodepro.js
const http = require('http');
const exnode=require('./exnodepro');
//const server = http.createServer(exnode); 
const server = http.createServer(exnode.handler); 
console.log(exnode.someText);
server.listen(4000);

//exnodepro.js
var fs = require('fs');
const reqHandler=(req,res)=>{
    const url=req.url;
    const method=req.method;
    if (url === '/') {
        fs.readFile('message.txt','utf8',function(err,data){
        res.write('<html>');
        res.write(`<head><title>New Project</title></head>`); 
        res.write(`<body>${data}</body>`);
        res.write('<body>');      
        res.write(`<form action="/message" method="POST"><input type="text" name="message"><button type="submit">Send</button><br></form>`);             
        res.write(`</body>`);        
        res.write('</html>'); 
        return res.end();
        });        
    }
    if (method === "POST" && url === '/message') {
        const a= [];
        req.on("data", (chunk) => {
            a.push(chunk);
        });
        req.on('end', () => {
            const parsedData = Buffer.concat(a).toString();
            const message1 = parsedData.split('=')[1];
            console.log(message1);
            fs.writeFileSync('message.txt', message1);
            res.statusCode = 302;
            res.setHeader('Location', '/');
            return res.end();
        });        
    }
}
//module.exports=reqHandler;
/*module.exports={
   handler: reqHandler,
   someText:'Some Text'
}*/
/*module.exports.handler=reqHandler;
module.exports.someText='Some text';*/
exports.handler=reqHandler;
exports.someText='Some text';
