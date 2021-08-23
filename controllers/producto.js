const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../src/data/menu.json');   
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const productoController = {
    detalle: (req, res)=>{
        let id = parseInt(req.params.id, 10)
        const product = products.find(p =>p.id ===id)
        res.render('detalleProducto', {product:product})
    },
    products: (req, res)=>{
        const visited = products.filter(product => product.category === 'visited')
        const inSale = products.filter(product => product.category === 'in-sale')
        res.render('products', {visited: visited, inSale:inSale})
    },
    create: (req, res)=>{
        res.render('product-create-form');
    },
    store: (req, res)=>{
        res.send('datos del formulario');
    },
    edit: (req, res)=>{
        res.send('formulario-editar');
    },
    update: (req, res)=>{
        res.send('datos del formulario');
    }

};

module.exports = productoController;