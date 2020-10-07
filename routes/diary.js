const router = require('express').Router({ mergeParams: true });
const controller = require('../controllers/diary');
const middleware = require('../middleware/index');

router.post('/', middleware.isLoggedIn, middleware.checkDiaryOwnership, controller.createDiary);
router.put('/:id', middleware.isLoggedIn, middleware.checkDiaryOwnership, controller.editDiary);
router.delete('/:id', middleware.isLoggedIn, middleware.checkDiaryOwnership, controller.deleteDiary);
router.get('/:id', controller.getDiary);

module.exports = router;
