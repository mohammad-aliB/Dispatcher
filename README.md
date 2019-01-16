# dispatcher
This custom web application framework was created to be very light weight and fast, it allows for some basic functionality similar to Express. An example of how it could be used can be found below:

var dispatcher=require("/Dispatcher/index.js");<br>
dispatcher.setUP(80,'172.104.16.138');//port then ip you want to listen on

dispatcher.staticDirectory('/Static','/Blog/staticAssets');// the first path is the one you want to acces the static files with at the second is the one you want to retrieve the static file from. so for example example.com/Static/Hello.world would be /Blog/staticAssets/Hello.world on the server

dispatcher.GetRequest('/',function(req,res){// the quotes are the path name<br>
    res.writeHead(200, {<br>
        'Cache-Control':'no-cache, no-store, must-revalidate',<br>
        'Pragma':'no-cache',<br>
        'Expires':'0'<br>
    });<br>
    res.end("<html><body>Hello world!</body></html>"); <br>
});
