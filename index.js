var httpModule=require('http');
var wildcard = require('wildcard');
var server=httpModule.createServer(function(req,res){
         dispatcher.prototype.dispatch(req,res)
        });

var dispatcher = function() {
    var that=this;
    dispatcher.prototype.setUP=function(port,ip){
        server.listen(port,ip, function(){
            console.log("My server is operating on node");
        });
    }
    this.listeners = { get: [ ], post: [ ] };
    var errorPage404Location=null;
    dispatcher.prototype.GetRequest = function(url, callback) {
        this.listeners['get'].push({callback: callback,url: url});
        console.log("aaaaaaaaaaaaaaaaaaa")
        console.log(this.listeners)

    }       
    dispatcher.prototype.PostRequest = function(url, callback) {
        this.listeners['post'].push({callback: callback,url: url});
    }   
    dispatcher.prototype.errorPage404Default = function(req, res) {
        res.writeHead(404, {'Content-Type': 'text/html'});
        res.end("404 error Page not found");
    }
    dispatcher.prototype.errorPage404Path = function(url,callback){
        errorPage404Location=url;
        this.listeners['get'].push({callback: callback,url: url});
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

    dispatcher.prototype.dispatch = function(req, res) {
        console.log(this)
        var url = require('url').parse(req.url, true);
        var method = req.method.toLowerCase();
        var listener = this.getListener(url.pathname, method,0);
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
        }else{
            if(req.headers['content-type']=='application/x-www-form-urlencoded'){
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
            listener = this.listeners[method][i];
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