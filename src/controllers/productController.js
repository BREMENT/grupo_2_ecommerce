const {v4: uuidv4} = require('uuid');
const { validationResult } = require('express-validator');
const {request, response} = require('express');
const db = require('../database/models');

const Op = db.Sequelize.Op;

const productoController = {
    detalle: async(req = request, res = response)=>{
        try {    
            const product = await db.Producto.findByPk(Number(req.params.id));
            res.render('productDetail', {product, user: req.session.userLogged })
        } catch (error) {
            console.log(error);
        }
    },
    products: async(req = request, res = response)=>{
        try {
            const [inSale, visited] = await Promise.all([
                db.Producto.findAll({
                    where:{
                        tipo_categoria_id:1,
                        estatus: 1
                    },
                    include:[{association:'TipoCategoria'}]
                }),
                db.Producto.findAll({
                    where:{
                        tipo_categoria_id:2,
                        estatus: 1
                    },
                    include:[{association:'TipoComida'}]
                })
            ]);
            res.render('products', {visited , inSale})
           
        } catch (error) {
            console.log(error);
        }

    },
    create: async(req = request, res = response)=>{
        try {
            const [tipoComida,tipoCategoria] = await Promise.all([
                 db.TipoComida.findAll({where:{estatus:1}}),
                 db.TipoCategoria.findAll({where:{estatus:1}})
            ])
            res.render('product-create-form',{ tipoComida, tipoCategoria });  
        } catch (error) {
            console.log(error);
        }
    },
    store: async(req = resquest, res = response)=>{
        console.log(req.body);
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            // res.render('product-create-form',{errors: errors.mapped(), old: req.body });
            console.log(errors.mapped());
            return;
        }

        try {
            const {
                name:nombre,
                price:precio,
                discount: descuento,
                category: tipo_categoria_id,
                food_type: tipo_comida_id,
                description: descripcion
            } = req.body;

            const newUser = await db.Producto.create({
                nombre,
                precio,
                descuento,
                tipo_categoria_id,
                tipo_comida_id,
                descripcion,
                foto: req.file.filename
            });
            console.log(newUser);
            res.redirect('/productos');   
        } catch (error) {
            console.log(error);
        }
        
    },
    edit: async(req = request, res = response)=>{
        try{
            const [product, category, foods] = await Promise.all([
                db.Producto.findByPk(Number(req.params.id),{
                    include: [{association:'TipoComida'}, {association:'TipoCategoria'}]
                }),
                db.TipoCategoria.findAll({where:{estatus: 1}}),
                db.TipoComida.findAll({where:{estatus: 1}})
            ]);

            res.render('productEdit', { product, category, foods });
        }catch (error) {
            console.log(error);
        }
    },
    update: async(req = request, res = response)=>{
        const id = Number(req.params.id);
        const errors = validationResult(req);

        if(!errors.isEmpty()){    
            res.render('productEdit' ,{errors: errors.mapped(), product});
            return;
        }

        try {
            const {
                name: nombre,
                price: precio,
                discount: descuento,
                category: tipo_categoria_id,
                food_type: tipo_comida_id,
                description: descripcion
            } = req.body;
    
            const producto = await db.Producto.update({
                nombre,
                precio,
                descuento,
                tipo_categoria_id,
                tipo_comida_id,
                descripcion,
                foto: req.file.filename
            },{
                where:{
                    producto_id: id,
                }
            })
            
            console.log(producto);
            res.redirect('/productos/');
        } catch (error) {
            console.log(error);
        }
    },
    delete: (req, res)=>{
        // TODO: checar si hacemos un alerta para no borrar de golpe el producto o dejarlo de esta forma
    },
    destroy: async(req = request, res = response)=>{
        
        //fs.unlinkSync(path.join(__dirname,`../../public/images/products/${products[post].image}`));
        
        // TODO: realmente hay que eliminar la imagen cuando eliminamos el producto??
        try {
            const id = Number(req.params.id);
            const producto = await db.Producto.update({
                estatus: 0
            },{
                where:{
                    producto_id: id
                }
            });
            console.log(producto);
            res.redirect('/productos');
        } catch (error) {
            console.log(error);
        }
    },
    busqueda: async(req = request, res = response) =>{
        try {
            const busqueda = req.query.search;
            const productos = await db.Producto.findAll({
                where:{
                    nombre:{
                        [Op.like]:`%${busqueda}%`
                    },
                    estatus: 1
                }
            })
            res.render('productSearch',{ productos });
            console.log('Soy busqueda');
        } catch (error) {
            console.log(error);
        }
    }
};

module.exports = productoController;