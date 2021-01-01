var express = require('express');
var Mem = require('../models').Mem;
var Bank = require('../models').Bank;
var Reward = require('../models').Reward;
var Planet = require('../models').Planet;
var Item = require('../models').Item;
var Main = require('../models').Main;
var router = express.Router();

//메인
router.post('/', function(req, res, next){
  Mem.findOne({
    where: {userid: req.body.mem.userid}
  }).then(mem => {
    //아이디 있을 때
    if(mem !=null){ 

      Main.findOne({
        where: {userid: req.body.main.userid}
      }).then(main => {
        //아이디 있을 때
        if(main !=null){  
          console.log('✓메인 정보 전달 완료.');
          res.send({
            "result_main": "ok",
            //메인에 뿌릴 사용자 정보 보내기
            "credit": mem.credit,
            "coin": mem.coin,
            "key_coin": mem.key_coin,
            "planet": main.planet,
            "item1": main.item1,
            "item1_id": main.item1_id,
            "item1_location": main.item1_location,
            "item2": main.item2,
            "item2_id": main.item2_id,
            "item2_location": main.item2_location,
            "item3": main.item3,
            "item3_id": main.item3_id,
            "item3_location": main.item3_location,
            "item4": main.item4,
            "item4_id": main.item4_id,
            "item4_location": main.item4_location,
            "item5": main.item5,
            "item5_id": main.item5_id,
            "item5_location": main.item5_location
          })
        }
      })
      
      }
      
  })
});

module.exports = router;