const express = require('express');
const app = express();

app.use('/static', express.static(__dirname + '/public'));


app.get('/', (req,res) => {
    res.sendFile(__dirname + '/views/home.html');
});

app.get('/home', (req,res) => {
    res.sendFile(__dirname + '/views/home.html');
});

app.get('/producto', (req,res) => {
    res.sendFile(__dirname + '/views/detalleProducto.html');
});

app.get('/inicio', (req,res) => {
    res.sendFile(__dirname + '/views/inicio.html');
});

app.get('/login', (req,res) => {
    res.sendFile(__dirname + '/views/login.html');
});

app.get('/registro', (req,res) => {
    res.sendFile(__dirname + '/views/registro.html');
});

app.listen(3000, () => {
    console.log('Servidor funcionando');
});
