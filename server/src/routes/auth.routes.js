const express=require('express');
const authcontroller=require('../controllers/auth.controller');
const authMiddleware=require('../middlewares/auth.middleware');
const router=express.Router();
router.post('/register',authcontroller.register);
router.post('/login',authcontroller.login);
router.get('/me',authMiddleware,authcontroller.getCurrentUser );
// router.get(
//     '/',
//     authMiddleware,
//     requirePermission('TICKET_VIEW'),
//     getTickets
// );
module.exports=router;