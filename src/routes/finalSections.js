const express = require('express');
const router = express.Router();
const FinalSectionsController = require('../controllers/finalSectionsController');
const { authenticateToken, requireManager } = require('../middleware/auth');

router.use(authenticateToken);

router.get('/me', FinalSectionsController.getMyFinalSections);
router.post('/', FinalSectionsController.createFinalSections);
router.get('/:id', FinalSectionsController.getFinalSectionsById);
router.put('/:id', FinalSectionsController.updateFinalSections);
router.delete('/:id', requireManager, FinalSectionsController.deleteFinalSections);
router.get('/user/:user_id', FinalSectionsController.getFinalSectionsByUserId);

module.exports = router;
