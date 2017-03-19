var httpModule=require('http');
var wildcard = require('wildcard');
var querystring = require('querystring');
var fs = require("fs");
var url=require("url")
var server=httpModule.createServer(function(req,res){
         dispatcher.prototype.dispatch(req,res)
        });

var dispatcher = function() {
    var that=this;
    dispatcher.prototype.setUP=function(port,ip){
        server.listen(port,ip, function(){
          //  console.log("My server is operating on node");
        });
    }
    this.listeners = { get: [ ], post: [ ] };

    dispatcher.prototype.GetRequest = function(url, callback) {
        this.listeners['get'].push({callback: callback,url: url});
        //console.log("bbbbbbbb")
        //console.log(this.listeners)

    }       
    dispatcher.prototype.PostRequest = function(url, callback) {
        this.listeners['post'].push({callback: callback,url: url});
    }   
    var errorPage404Location=null;
    dispatcher.prototype.errorPage404Default = function(req, res) {
        res.writeHead(404, {'Content-Type': 'text/html'});
        res.end("404 error Page not found");
        console.log(this.listeners)
    }
    dispatcher.prototype.errorPage404Path = function(url,callback){
        errorPage404Location=url;
        this.listeners['get'].push({callback: callback,url: url});
    }
    dispatcher.prototype.staticDirectory = function(url, dir) {
        var fileList=fs.readdirSync(dir);
        for (var i = 0, len = fileList.length; i < len; i++) {
            this.listeners['get'].push(this.sendFile, url+"/"+fileList[i]);
        }
        console.log(url+"/"+fileList[i])
    }
    dispatcher.prototype.sendFile = function(req, res){
        var path = url.parse(req.url).pathname;
      //  for(var i = 0, listener; i<staticListeners["data"].length; i++) {
            //console.log(staticListeners["data"][i]);
            //console.log(req.url);
          //  listener = staticListeners["data"][i];
          //  if(listener.url==req.url){
          //      path=listener.dir;
                
     //           break;
       //     }
       // }
                //comment out one line below for production servers
            //res.setHeader('Access-Control-Allow-Origin','*');
        if(path.split('.').pop()=="html"){
            res.writeHead(200, {'Content-Type': 'text/html'});
        }else if(path.split('.').pop()=="css"){
            res.writeHead(200, {'Content-Type': 'text/css'});           
        }else if(path.split('.').pop()=="js"){
            res.writeHead(200, {'Content-Type': 'text/javascript'});           
        }else if(path.split('.').pop()=="svg"){
            res.writeHead(200, {'Content-Type': 'image/svg+xml'});           
        }
        fs.readFile(path, function(err, data) {
            if (err){
                res.writeHead(500);
                res.end();
                //return;
            }else{
                res.end(data);
                // return;
            }
        });
    }
  // dispatcher.prototype.setCookie = function(key,value,domain,path,expires,maxAge,Secure,HttpOnly) {
  //       cookie=key+"="+value+"; ";
  //       if(expires){
  //            cookie+="Expires="+expires+"; ";
  //        }else if(maxAge){
  //            cookie+="max-age="+maxAge+"; ";
  //       }
  //       if(path){
  //           cookie+="Path="+path+"; ";
  //       }
  //       if(domain){
  //           cookie+="Domain="+domain+"; ";
  //       }
  //       if(HttpOnly){
  //           cookie+="HttpOnly; ";
  //       }
  //       if(Secure){
  //           cookie+="Secure; ";
  //       }
  //       return cookie;
  //   }

    dispatcher.prototype.dispatch = function(req, res,skip) {
       // console.log(this)
        var url = require('url').parse(req.url, true);
        var method = req.method.toLowerCase();
        var listener = this.getListener(url.pathname, method,skip);
        if(listener){
            //rc = req.headers.cookie;
            // req.cookieData=[];
            // if(req.headers.cookie){
            //     try{
            //         // rc.split(';').forEach(function( cookie ) {
            //         req.headers.cookie.split(';').forEach(function( cookie ) {
            //             var parts = cookie.split('=');
            //             req.cookieData[parts.shift().trim()] = parts.join('=');
            //         });
            //     } catch(err) {
            //         console.log(err);
            //         res.end("your cookie had an error");
            //     }
            // }
            listenerCb=listener;
        }else if(errorPage404Location!=null){
            listenerCb = this.getListener(errorPage404Location, "get",0);
        }else{
            listenerCb=this.errorPage404Default;
        }
        if(method=='get'){
            listenerCb(req, res);
        }else if(method=='post'){
            if(req.headers['content-type']=='application/x-www-form-urlencoded'){
                var body = '';
                    req.on('data', function (data) {
                        body += data;
                        // Too much POST data, kill the connection!
                        // 1e6 === 1 * Math.pow(10, 5) === 1 * 100000 ~~~ 100kb
                        if (body.length > 1e5)
                            req.connection.destroy();
                    });

                    req.on('end', function () {
                        req.postData = querystring.parse(body);
                        // use post['blah'], etc.
                    });
            
                // var bodyData="";
                // req.on('data', function (chunk) {
                //     bodyData+=chunk;
                // });
                // req.postData=[];
                // req.on('end', function() {
                //     //console.log("test BBD"+bodyData+" ampersand "+bodyData.indexOf("&"))
                //     //had to remove part about ampersand as it was preventing single field post data from working
                //     if(bodyData&&bodyData!==null/*&&bodyData.indexOf("&")>=0*/){
                //         try{
                //             //console.log("bodydata"+bodyData)
                //             bodyData.split('&').forEach(function(bodyData) {
                //                 var parts = bodyData.split('=');
                //                 parts[1]=decodeURIComponent(parts[1].replace(/\+/g, " ").replace(/&amp;/g,"&")+'')
                //                 req.postData[ parts[0].trim() ] = (parts[1] || '').trim();
                //                 //console.log(req.postData);
                //                 //console.log("###########################################################################################################################");
                //             });    
                //         }catch(err) {
                //             res.end("your postdata had an error");
                //         }
                //     }
                //     listenerCb(req, res);
                // });
            }else{
                res.end("error no binary post data supported");
            }
        }
    }
    dispatcher.prototype.getListener = function(url, method,skip) {

                            //console.log("C "+url+" : "+method+ " C");
        for(var i = 0, listener; i<that.listeners[method].length; i++) {
            listener = that.listeners[method][i];
            if(wildcard(listener.url, url)) {
                if(skip==0){
                    //console.log("A "+listener.url);
                    //console.log("B "+url+ " B");
                    return listener.callback;
                }else{
                    skip=skip-1;
                }
            }
        }
    }
}
module.exports = new dispatcher();