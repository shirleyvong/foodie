const router = require('express').Router();
const middleware = require('../middleware/index');
const controller = require('../controllers/index');

router.get('/search', controller.search);
router.post('/register', controller.register);
router.post('/login', middleware.usernameToLower, controller.login);
router.get('/login', controller.loginPage);
router.get('/register', controller.registerPage);
router.get('/logout', controller.logout);
router.get('/:username', controller.userPage);
router.get('/', controller.homePage);

module.exports = router;
