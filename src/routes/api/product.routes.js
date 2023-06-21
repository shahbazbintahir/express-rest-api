// third party import
const express = require('express');
// import Controller
const productController = require('../../app/controllers/product/productController');

// include middleware 
const checkFeaturePermission = require('../../app/middleware/checkFeaturePermission');
const fileMiddleware = require('../../app/middleware/upload')

const router = express.Router();

router.get('/getAllProduct', productController.getAllProduct);
router.get('/getProduct/:id', productController.getProduct);
router.post('/addProduct', [checkFeaturePermission('product', 'add'), fileMiddleware], productController.addProduct);
router.post('/updateProduct/:productId', [checkFeaturePermission('product', 'update'), fileMiddleware], productController.updateProduct);
router.post('/activateProduct/:productId', [checkFeaturePermission('product', 'delete'),], productController.activateProduct);
router.post('/deactivateProduct/:productId', [checkFeaturePermission('product', 'delete'),], productController.deactivateProduct);
router.delete('/deleteProduct/:productId', [checkFeaturePermission('product', 'delete'),], productController.deleteProduct);

module.exports = router;
