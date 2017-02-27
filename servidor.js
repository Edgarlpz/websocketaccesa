var WebSocketServer = require('ws').Server;

var PORT = 8087;

var wss = new WebSocketServer({port: PORT});
console.log('Entro el socket');
var messages = [];

wss.on('connection', function (ws) {
  messages.forEach(function(message){
    ws.send(message);
  });
  ws.on('message', function (message) {
    messages.push(message);
    console.log('Message Received: %s', message);
    var array=message.split(":");
    if(array[1]!="VINCULADA"&&array[1]!="ARMADA"&&array[1]!="DESARMADA"&&array[1]!="PRENDIDA"&&array[1]!="APAGADA"&&array[1]!="OK"&&array[1]!="CONFI_INIT"&&array[1]!="CONECTADA"){
      postToPHP(array[0], array[1], array[2]);
    }
    if(array[1]=="CONECTADA"){
      esConectada(array[0]);
    }
    wss.clients.forEach(function (conn) {
      conn.send(message);
    });
    messages.pop(message);
  });
  console.log('Usuario ingresado');
});

function postToPHP (data, data2, data3) {
    var request=require('request');
    var res=require('response');
    console.log('%s %s %s', data, data2, data3);
    var express=require('express');
    var app=express();
    request({
        method: 'POST',
        url:'http://localhost:8080/Alertaccesa/smessage.php', 
        form: {id:data, notif:data2, mail:data3}
    },function(err,httpResponse,body){ });
}

function esConectada (tarjeta) {
    var request=require('request');
    var data='conecta';
    console.log("enviando conectada");
    var res=require('response');
    var express=require('express');
    var app=express();
    request({
        method: 'POST',
        url:'http://localhost:8080/Alertaccesa/checkon.php', 
        form: {id:tarjeta, valor:data}
    },function(err,httpResponse,body){ });
}