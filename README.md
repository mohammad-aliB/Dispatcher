# dispatcher
This custom web application framework was created to be very light weight and fast, it allows for some basic functionality similar to Express. An example of how it could be used can be found below:

var dispatcher=require("/Dispatcher/index.js");
dispatcher.setUP(80,'172.104.16.138');

dispatcher.staticDirectory('/Static','/Blog/staticAssets');

dispatcher.GetRequest('/',function(req,res){
    res.writeHead(200, {
        'Cache-Control':'no-cache, no-store, must-revalidate',
        'Pragma':'no-cache',
        'Expires':'0'
    });
    res.end("<html><body>Hello world!</body></html>"); 
});
