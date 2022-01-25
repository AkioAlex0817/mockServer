const express = require('express');
const router = express.Router();

const home = require('../controllers/home');
const migrate = require('../controllers/migrate');
const redeem = require('../controllers/redeem');

router.get('/status', home.serverStatus);
router.get('/migrate', migrate.migrate);
router.get('/redeem', redeem.redeem);

// Period Collection Records
router.get('/daily-works', home.dailyWorks);
router.get('/period-collection-records', home.getPeriodCollectionRecords);
router.get('/period-collection-records/:id', home.getPeriodCollectionDetail);
router.get('/period-collection-records/:id/contents', home.getPeriodCollectionContent);
router.delete('/period-collection-records/:id1/contents/:id2', home.removePeriodCollectionContent);
router.patch('/period-collection-records/:id1/photos/:id2/reasons', home.collectionPhotoReasonPatch);
router.delete('/period-collection-records/:id1/photos/:id2', home.collectionPhotoRemove);
router.patch('/period-collection-records/:id', home.collectionPatch);

// User
router.get('/user', home.getUsers);

// User Group
router.get('/user-groups', home.getGroups);
router.post('/user-groups', home.addGroup);
router.get('/user-groups/:id', home.getGroupOne);

//Disposal
router.get('/disposal-facilities', home.getDisposals);





module.exports = router;
