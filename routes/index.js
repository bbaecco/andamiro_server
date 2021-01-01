var express = require('express');
var Mem = require('../models').Mem;
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});  //test

router.post('/', function(req, res, next) {
  // console.log(req.body);
  // console.log(req.body.mem.userid);  //json parsing
  // console.log(req.body.mem.pswd);
  
 // const { Mem } = require('../models') 
  // Mem.create({ 
  //   userid: req.body.mem.userid, 
  //   pswd: req.body.mem.pswd, 
  //   credit: req.body.mem.credit, 
  //  coin: req.body.mem.coin,
  //   key_coin: req.body.mem.key_coin
  // });

  // const { Mem, Sequelize: { Op }} = require('../models'); 
  // Mem.findAll({ 
  //   attributes: ['userid'], 
  //   where: { 
  //     credit: { [Op.gte]: 1 }
  //   }
  // });

  //  Mem.update({ 
  //    credit: 5, 
  //   }, { 
  //     where: { userid: 'anda' } 
  //   });

  Mem.destroy({ 
    where: { userid: 'anda2' } 
  });
  
});



module.exports = router;