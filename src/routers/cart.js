const express = require('express');
const router = express.Router();
const cartDaoSelection = require('../helpers/daoSelection').cartDaoSelection;
const productDaoSelection = require('../helpers/daoSelection').productDaoSelection;
const logger = require('../middlewares/logger')
const middlewares = require('../middlewares/authorization');
const sendEmail = require('../helpers/emails');
const sendWhatsapp = require('../helpers/whatsapp');

router.use(logger);

const cartDao = cartDaoSelection();
const productDao = productDaoSelection();

// Crea un carrito y devuelve su id -- (usuarios y administradores)
router.post(
  '/',
  middlewares.checkAuthentication,
  async (req, res) => {
    const cart = await cartDao.create({ products: [] });
    res.status(201).json({ id: cart._id.toString() });
  });

// Vacia un carrito y lo elimina -- (usuarios y administradores)
router.delete(
  '/:cartId',
  middlewares.checkAuthentication,
  async (req, res) => {
    const { cartId } = req.params;
    const cart = await cartDao.remove(cartId);
    res.status(200).json(cart)
  });

// Me permite listar todos los productos guardados en un carrito -- (usuarios y administradores)
router.get('/:cartId/products',
  middlewares.checkAuthentication,
  async (req, res, next) => {
    // res.send('Cart GET - Lista todos los productos de un carrito');
    const { cartId } = req.params;
    const cart = await cartDao.find(cartId);
    const { products } = cart;
    res.status(200).json(products);
  });

// Para incorporar productos al carrito por su id de carrito y id de producto -- (usuarios y administradores)
router.post(
  '/:cartId/products/:productId',
  middlewares.checkAuthentication,
  async (req, res) => {
    const { cartId, productId } = req.params;
    const product = await productDao.find(productId);
    const cart = await cartDao.find(cartId);
    cart.products.push(product);
    const updatedCart = await cartDao.update(cart, cartId);
    res.status(200).json(updatedCart);
  });

// Eliminar un producto al carrito por su id de carrito y id de producto -- (usuarios y administradores)
router.delete(
  '/:cartId/products/:productId',
  middlewares.checkAuthentication,
  async (req, res) => {
    const { cartId, productId } = req.params;
    const cart = await cartDao.find(cartId);
    const filteredProducts = cart.products.filter(e => e.id != productId);
    const updatedCart = await cartDao.update({ ...cart, products: filteredProducts }, cartId);
    res.status(200).json(updatedCart);
  });

// Enviar mensaje de whatsapp -- (usuarios y administradores)
router.post(
  '/:cartId/checkout',
  middlewares.checkAuthentication,
  async (req, res) => {
    const { cartId } = req.params;
    const cart = await cartDao.find(cartId);
    const { products } = cart;

    const { user } = req.session.passport

    // envio de mail con el biri biri
    await sendEmail(user.email, 'Checkout', JSON.stringify(products));

    // envio de mensaje de whatsapp con el biri biri
    await sendWhatsapp(user.telefono, `Checkout exitoso ✅`)

    res.status(200).send('Checkout Exitoso 👍🏻');
  })

module.exports = router;