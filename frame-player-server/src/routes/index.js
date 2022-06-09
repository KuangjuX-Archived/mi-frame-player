import express from 'express'; 
import { fetchImage } from '../lib';
var router = express.Router();

/* GET home page. */ 
router.get('/', function(req, res, next) { 
  res.render('index', { title: 'Express' }); 
});

router.get('/images/:imageid', fetchImage)

export default router;
