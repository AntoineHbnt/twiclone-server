const router = require('express').Router();
const notificationsController  =require('../controllers/notification.controller')
const multer = require('multer');
const upload = multer();

//notifications db
router.get('/:id', notificationsController.getUserNotifications);
router.patch('/:id', notificationsController.addUserNotification)

module.exports = router;