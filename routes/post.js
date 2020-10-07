const router = require('express').Router({ mergeParams: true });
const middleware = require('../middleware/index');
const controller = require('../controllers/post');

router.get('/:postId', controller.getPost);
router.put('/:postId', middleware.isLoggedIn, middleware.checkDiaryOwnership, controller.editPost);
router.delete('/:postId', middleware.isLoggedIn, middleware.checkDiaryOwnership, controller.deletePost);
router.post('/', middleware.isLoggedIn, middleware.checkDiaryOwnership, controller.createPost);

module.exports = router;
