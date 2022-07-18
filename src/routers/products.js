const express = require('express');
const { faker } = require('@faker-js/faker');
const router = express.Router();
const daoSelection = require('../helpers/daoSelection').productDaoSelection;
const logger = require('../middlewares/logger');
const middlewares = require('../middlewares/authorization');

router.use(logger);

const product = daoSelection();

// Me permite listar todos los productos disponibles -- (usuarios y administradores)
router.get('/',
  middlewares.checkAuthentication,
  async (req, res) => {
    const allProducts = await product.findAll();
    res.status(200).json(allProducts);
  });

// Me permite listar un producto por su id -- (usuarios y administradores)
router.get(
  '/:productId',
  middlewares.checkAuthentication,
  async (req, res) => {
    const { productId } = req.params;
    const oneProduct = await product.find(productId);
    res.status(200).json(oneProduct);
  });

// Para incorporar productos al listado -- (solo administradores)
router.post('/',
  middlewares.checkAuthentication,
  middlewares.checkAuthorization,
  async (req, res) => {
    const newProduct = await product.create(req.body);
    res.status(201).json(newProduct);
  });

// Actualiza un producto por su id -- (solo administradores)
router.put('/:productId',
  middlewares.checkAuthentication,
  middlewares.checkAuthorization,
  async (req, res) => {
    const { productId } = req.params;
    const modifiedProduct = await product.update(req.body, productId);
    res.status(200).json(modifiedProduct);
  });

// Borra un producto por su id -- (solo administradores)
router.delete('/:productId',
  middlewares.checkAuthentication,
  middlewares.checkAuthorization,
  async (req, res) => {
    const { productId } = req.params;
    const deletedProduct = await product.remove(productId);
    res.status(200).json(deletedProduct);
  });

router.post('/migration',
  async (req, res) => {
    for (let i = 0; i < 10; i++) {
      await product.create({
        nombre: faker.commerce.productName(),
        descripcion: faker.commerce.productDescription(),
        foto: faker.image.imageUrl(),
        precio: faker.commerce.price(),
        stock: faker.random.numeric(2)
      });
    }

    const allProducts = await product.findAll();
    res.status(200).json(allProducts);
  });

module.exports = router;