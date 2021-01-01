var express = require('express');
var Mem = require('../models').Mem;
var Bank = require('../models').Bank;
var Reward = require('../models').Reward;
var router = express.Router();


//업적 달성 여부
//신용 등급 따로 안받아도 바로 여부 확인하게 하기(디비에서 불러오기)
router.post('/achieve', function(req, res, next) {
  Reward.findOne({
    where: {userid: req.body.reward.userid}
  }).then(reward => {
    if(reward !=null){  //아이디 찾았을 때
      Mem.findOne({
        where: {userid: req.body.mem.userid}
      }).then(mem => {
        if(mem !=null){  //아이디 찾았을 때  //신용 등급 업적 달성 여부 체크용
          //현재 mem의 신용 등급 체크하는 코드에서 신용 등급 업적 체크도 같이 하도록
          //구현해놔서 밑에 신용 등급 업적 체크 코드는 주석 처리 해놨음
          // if(mem.credit == 1){  //신용등급 1 달성
          //   Reward.update({ 
          //     c1: true
          //   }, { 
          //   where: { userid: req.body.reward.userid} 
          //   });
          // }
          // if(mem.credit == 2){  //신용등급 2 달성
          //   Reward.update({ 
          //     c2: true
          //   }, { 
          //   where: { userid: req.body.reward.userid} 
          //   });
          // }
          // if(mem.credit == 3){  //신용등급 3 달성
          //   Reward.update({ 
          //     c3: true
          //   }, { 
          //   where: { userid: req.body.reward.userid} 
          //   });
          // }
          // if(mem.credit == 4){  //신용등급 4 달성
          //   Reward.update({ 
          //     c4: true
          //   }, { 
          // where: { userid: req.body.reward.userid} 
          // });
          // }
          // if(mem.credit == 5){  //신용등급 5 달성
          //   Reward.update({ 
          //     c5: true
          //   }, { 
          //   where: { userid: req.body.reward.userid} 
          //   });
          // }
          
          //행성 업적
          if(req.body.reward.sea){  //머메이드씨 행성 획득
            Reward.update({ 
              sea: true
            }, { 
            where: { userid: req.body.reward.userid} 
            });
          }
          if(req.body.reward.oasis){  //모래 오아시스 행성 획득
            Reward.update({ 
              oasis: true
            }, { 
            where: { userid: req.body.reward.userid} 
            });
          }
          if(req.body.reward.forest){  //수수께끼 숲 행성 획득
            Reward.update({ 
              forest: true
            }, { 
            where: { userid: req.body.reward.userid} 
            });
          }
          if(req.body.reward.rose){  //붉은 장미 행성 획득
            Reward.update({ 
              rose: true
            }, { 
            where: { userid: req.body.reward.userid} 
            });
          }
          if(req.body.reward.tako){  //다코야키키 행성 획득
            Reward.update({ 
              tako: true
            }, { 
            where: { userid: req.body.reward.userid} 
            });
          }
          if(req.body.reward.apple){  //허니애플 행성 획득
            Reward.update({ 
               apple: true
            }, { 
            where: { userid: req.body.reward.userid} 
            });
          }
          if(req.body.reward.waffle){  //나나와플 행성 획득
            Reward.update({ 
              waffle: true
            }, { 
            where: { userid: req.body.reward.userid} 
            });
          }
          if(req.body.reward.donut){  //오리진 도넛 행성 획득
            Reward.update({ 
              donut: true
            }, { 
            where: { userid: req.body.reward.userid} 
            });
          }
          if(req.body.reward.ice){  //피스풀 아이스 행성 획득
            Reward.update({ 
              ice: true
            }, { 
            where: { userid: req.body.reward.userid} 
            });
          }
          if(req.body.reward.cheese){  //멜팅 치즈문 행성 획득
            Reward.update({ 
              cheese: true
            }, { 
            where: { userid: req.body.reward.userid} 
            });
          }
        }
      })
    }
  })
  console.log('✓업적 달성 성공');
  res.send({
  "result_reward_achieve": "ok"
  })     
});

//업적 달성 보상 획득
router.post('/getReward', function(req, res, next) {
  Reward.findOne({
    where: {userid: req.body.reward.userid}
  }).then(reward => {
    if(reward !=null){  //아이디 찾았을 때
      Mem.findOne({
        where: {userid: req.body.mem.userid}
      }).then(mem => {
        if(mem !=null){  //아이디 찾았을 때  
          var final_key = mem.key_coin + 1;
          Mem.update({ 
            key_coin: final_key
           }, { 
             where: { userid: req.body.mem.userid} 
           });
        }
      })
    }
  })
  console.log('✓업적 보상 제공 완료');
  res.send({
  "result_reward_getReward": "ok"
  })     
});

//업적 갱신 코드
router.post('/', function(req, res, next){
  Mem.findOne({
    where: {userid: req.body.mem.userid}
  }).then(mem => {
    //아이디 있을 때
    if(mem !=null){ 

      Reward.findOne({
        where: {userid: req.body.reward.userid}
      }).then(reward => {
        //아이디 있을 때
        if(reward !=null){  
          console.log('✓업적 정보 전달 완료.');
          res.send({
            "result_reward": "ok",
            //업적 갱신
            "c1": reward.c1,
            "c2": reward.c2,
            "c3": reward.c3,
            "c4": reward.c4,
            "c5": reward.c5,
            "sea": reward.sea,
            "oasis": reward.oasis,
            "forest": reward.forest,
            "rose": reward.rose,
            "tako": reward.tako,
            "apple": reward.apple,
            "waffle": reward.waffle,
            "donut": reward.donut,
            "ice": reward.ice,
            "cheese": reward.cheese
          })
        }
      })
      
      }
      
  })
});
 


module.exports = router;