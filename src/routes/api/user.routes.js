// third party import
const express = require('express');

// import Controller
const userController = require('../../app/controllers/user/userController');
const authController = require('../../app/controllers/auth/authController');

// include middleware 
const checkFeaturePermission = require('../../app/middleware/checkFeaturePermission');
const isAuth = require('../../app/middleware/auth');

const router = express.Router();

router.get('/all', userController.getAllUser);

router.get('/getUser/:id', [checkFeaturePermission('user', 'view')], userController.getUser);
router.post('/activateUser/:id', [checkFeaturePermission('user', 'update')], userController.activateUser);
router.post('/deactivateUser/:id', [checkFeaturePermission('user', 'update')], userController.deactivateUser);
router.get('/getAllUser', [checkFeaturePermission('user', 'view')], userController.getAllUser);
router.post('/addUser', [checkFeaturePermission('user', 'add')], userController.addUser);
router.put('/update/:userId', [checkFeaturePermission('user', 'update')], userController.updateUser);


router.post('/upload', (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send("No files were uploaded.");
    }

    let file = req.files.uploads;
    if(file['mimetype'].split('/')[0] !== 'image'){
        res.status(200).json({
            uploaded: false,
        });
    }

    let uploadPath = __dirname + "/../../../public/uploads/article/" + file.name;
    
    file.mv(uploadPath, function (err) {
        if (err) return res.status(500).send(err);
        res.status(200).json({
            uploaded: true,
            url: `/uploads/${file.name}`,
        });
    });
});

module.exports = router;
