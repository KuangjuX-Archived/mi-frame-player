import express from 'express'; 
import { fetchImage, fetchPointCloud } from '../lib';
var router = express.Router();

/* GET home page. */ 
router.get('/', function(req, res, next) { 
  res.render('index', { title: 'Express' }); 
});

router.get('/images/:imageid', fetchImage)

router.get('/pointcloud/:frameid', fetchPointCloud)

export default router;
