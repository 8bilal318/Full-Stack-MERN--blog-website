const express = require('express');
const router = express.Router();

const articleController = require('../controllers/articleController');
const categoryController = require('../controllers/categoryController');
const commentController = require('../controllers/commentController');
const UserController = require('../controllers/userController');
const isLoggedin = require('../middleware/isLoggedin');
const isAdmin = require('../middleware/isAdmin');
const upload = require('../middleware/multer');


//login Routes
router.get('/', UserController.loginPage);
router.post('/index', UserController.adminLogin);
router.get('/logout', UserController.logout);
router.get('/dashboard', isLoggedin, UserController.dashboard);
router.get('/settings', isLoggedin, isAdmin,  UserController.settings);
router.post('/save-settings', isLoggedin, isAdmin, upload.single('website_logo'),  UserController.saveSettings);



//user CRUD Routes
router.get('/users', isLoggedin, isAdmin,  UserController.alluser);
router.get('/add-user', isLoggedin,isAdmin,  UserController.addUserPage);
router.post('/add-user', isLoggedin, isAdmin, UserController.addUser);
router.get('/update-user/:id', isLoggedin, isAdmin, UserController.updateUserPage);
router.post('/update-user/:id', isLoggedin, isAdmin, UserController.updateUser);
router.delete('/delete-user/:id', isLoggedin, isAdmin, UserController.deleteUser);

//Category CRUD Routes
router.get('/category', isLoggedin, isAdmin, categoryController.allCategory);
router.get('/add-category', isLoggedin, isAdmin, categoryController.addCategoryPage);
router.post('/add-category', isLoggedin, isAdmin, categoryController.addCategory);
router.get('/update-category/:id',isLoggedin, isAdmin, categoryController.updateCategoryPage);
router.post('/update-category/:id',isLoggedin, isAdmin, categoryController.updateCategory);
router.delete('/delete-category/:id',isLoggedin, isAdmin, categoryController.deleteCategory);

//Article CRUD Routes
router.get('/article',isLoggedin, articleController.allArticle);
router.get('/add-article', isLoggedin, articleController.addArticlePage);
router.post('/add-article',isLoggedin, upload.single('image'),  articleController.addArticle);
router.get('/update-article/:id',isLoggedin, articleController.updateArticlePage);
router.post('/update-article/:id', isLoggedin, upload.single('image'), articleController.updateArticle);
router.delete('/delete-article/:id', isLoggedin, articleController.deleteArticle);

//Comment  Routes
router.get('/comments', isLoggedin, commentController.allComments);
module.exports = router;


