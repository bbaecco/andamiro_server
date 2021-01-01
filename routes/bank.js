var express = require('express');
var Mem = require('../models').Mem;
var Bank = require('../models').Bank;
var router = express.Router();

//은행 입장(메인에서 은행 버튼 클릭)
router.post('/bankIn', function(req, res, next) {
  Bank.findOne({
    where: {userid: req.body.bank.userid}
  }).then(bank => {
    if(bank !=null){  //bank 테이블에 아이디 있을 때
      console.log('이미 테이블 있음'); 
      res.send({
        "result_bank_id": "ok",
        "result_bankIn": "ok",
        //은행 메인에 뿌릴 정보 보내기
        //"coin": req.body.mem.coin, //안드에서 /login 한 번 더 요청받으면 됨
        "juckgeum_put": bank.juckgeum_put,
        "juckgeum": bank.juckgeum,
        "juckgeum_ok": bank.juckgeum_ok,
        "juckgeum_day": bank.juckgeum_day,
        "juckgeum_created" : bank.juckgeum_created,
        "yegeum": bank.yegeum,
        "yegeum_ok": bank.yegeum_ok,
        "yegeum_created" : bank.yegeum_created,
        "card": bank.card,
        "card_ok": bank.card_ok
      })
    }else{  //bank 테이블에 아이디 없을 때 생성
      Bank.create({ 
        userid: req.body.bank.userid
      });
      console.log('✓테이블 생성');
      res.send({
        "result_bank_id": "no",
        "result_bankIn": "ok"
        //은행 메인에 뿌릴 정보 보내기
        // "coin": req.body.mem.coin,  //안드에서 /login 한 번 더 요청받으면 됨
        // "juckgeum_put": req.body.bank.juckgeum_put,
        // "juckgeum": req.body.bank.juckgeum,  //userid만 받아서 null값인 것들도 보내줘야 하는지? > 보내야 있는지 없는지 판단해서 개설 가능 여부 따질 수도
        // "juckgeum_ok": req.body.bank.juckgeum_ok,
        // "juckgeum_day": req.body.bank.juckgeum_day,
        // "juckgeum_created" : req.body.bank.juckgeum_created,
        // "yegeum": req.body.bank.yegeum,
        // "yegeum_ok": req.body.bank.yegeum_ok,
        // "yegeum_created" : req.body.yegeum_created,
        // "card": req.body.bank.card,
        // "card_ok": req.body.bank.card_ok
      }) 
    }
  })
});

//적금 개설(적금 개설 버튼 클릭)
router.post('/juckgeum', function(req, res, next) {
  Mem.findOne({
    where: {userid: req.body.mem.userid}
  }).then(mem => {
    if(mem !=null){  //아이디 있을 때
      var pre_coin = mem.coin;   //기존 테이블 코인 값 변수에 넣어두기

      //bank에서 아이디 찾아서 juckgeum_put값 변수에 넣어놓기
      Bank.findOne({
       where: {userid: req.body.bank.userid}
      }).then(bank => {
        if(bank !=null){
          var pre_put = req.body.bank.juckgeum_put;
        }
        var final_coin = pre_coin - pre_put;  //mem 테이블의 코인 값 = 기존 테이블 코인 - 적금 입력 값
      
        //적금 개설로 빠진 돈 계산해서 코인 값 업데이트
        Mem.update({ 
          coin: final_coin
        }, { 
          where: { userid: req.body.mem.userid} 
        });
      });
    }
  })
   //적금 개설 된 값으로 업데이트
   Bank.update({ 
      juckgeum_put: req.body.bank.juckgeum_put,
      juckgeum: req.body.bank.juckgeum_put,   //입력 금액 바로 적금에 넣어주기
      juckgeum_ok: req.body.bank.juckgeum_ok, 
      juckgeum_day: req.body.bank.juckgeum_day,
      juckgeum_created: req.body.bank.juckgeum_created
    }, { 
      where: { userid: req.body.bank.userid } 
    });
    console.log('✓적금 개설 성공');
    res.send({
    "result_juckgeum": "ok"
    })     
});

//아이디를 받아서 원래 있던 적금 값에 적금 put 값 + 이자율 더한 값
//적금 이자율 계산
router.post('/juckgeumPlus', function(req, res, next){
  Bank.findOne({
    where: {userid: req.body.bank.userid}
  }).then(bank => {
    if(bank !=null){  //아이디 있을 때
      //var juckgeum_day_plus = req.body.bank.juckgeum_day * 1.9 + bank.juckgeum_put + bank.juckgeum;  //1.9는 이자율(나중에 변동)
      if(req.body.bank.juckgeum_day == 6){
        //1일 원금 + (넣기로 한 금액 * 0.03 * 1) + 넣기로 한 금액
        //var juckgeum_day_plus = req.body.bank.juckgeum_day * 1.9 + bank.juckgeum_put + bank.juckgeum;  //1.9는 이자율(나중에 변동)
        var juckgeum_day_plus = bank.juckgeum + (bank.juckgeum_put * 0.03 * 1) + bank.juckgeum_put;
        Bank.update({ 
          juckgeum: juckgeum_day_plus, 
          juckgeum_day : req.body.bank.juckgeum_day
        }, { 
          where: { userid: req.body.bank.userid } 
        });
        
      }
      if(req.body.bank.juckgeum_day == 5){
        //2일 원금 + (넣기로 한 금액 * 0.03 * 0.83) + 넣기로 한 금액
        var juckgeum_day_plus = bank.juckgeum + (bank.juckgeum_put * 0.03 * 0.83) + bank.juckgeum_put;
        Bank.update({ 
          juckgeum: juckgeum_day_plus, 
          juckgeum_day : req.body.bank.juckgeum_day
        }, { 
          where: { userid: req.body.bank.userid } 
        });
        
      }
      if(req.body.bank.juckgeum_day == 4){
        //3일 원금 + (넣기로 한 금액 * 0.03 * 0.65) + 넣기로 한 금액
        var juckgeum_day_plus = bank.juckgeum + (bank.juckgeum_put * 0.03 * 0.65) + bank.juckgeum_put;
        Bank.update({ 
          juckgeum: juckgeum_day_plus, 
          juckgeum_day : req.body.bank.juckgeum_day
        }, { 
          where: { userid: req.body.bank.userid } 
        });
        
      }
      if(req.body.bank.juckgeum_day == 3){
        //4일 원금 + (넣기로 한 금액 * 0.03 * 0.5) + 넣기로 한 금액
        var juckgeum_day_plus = bank.juckgeum + (bank.juckgeum_put * 0.03 * 0.5) + bank.juckgeum_put;
        Bank.update({ 
          juckgeum: juckgeum_day_plus, 
          juckgeum_day : req.body.bank.juckgeum_day
        }, { 
          where: { userid: req.body.bank.userid } 
        });
        
      }
      if(req.body.bank.juckgeum_day == 2){
        //5일 원금 + (넣기로 한 금액 * 0.03 * 0.33) + 넣기로 한 금액
        var juckgeum_day_plus = bank.juckgeum + (bank.juckgeum_put * 0.03 * 0.33) + bank.juckgeum_put;
        Bank.update({ 
          juckgeum: juckgeum_day_plus, 
          juckgeum_day : req.body.bank.juckgeum_day
        }, { 
          where: { userid: req.body.bank.userid } 
        });
        
      }
      if(req.body.bank.juckgeum_day == 1){
        //6일 원금 + (넣기로 한 금액 * 0.03 * 0.16) + 넣기로 한 금액
        var juckgeum_day_plus = bank.juckgeum + (bank.juckgeum_put * 0.03 * 0.16) + bank.juckgeum_put;
        Bank.update({ 
          juckgeum: juckgeum_day_plus, 
          juckgeum_day : req.body.bank.juckgeum_day
        }, { 
          where: { userid: req.body.bank.userid } 
        });
        
      }

      console.log('✓적금 계산 완료');
        res.send({
          "result_juckgeum_plus": "ok",
        })
    }
    else{  //아이디 없을 때
      console.log('✓없는 아이디');
      res.send({
        "result_juckgeum_plus": "no"
      })
    }
  })
});

//적금 해지(적금 해지 버튼 클릭)
router.post('/juckgeumCancle', function(req, res, next) {
  //먼저 bank.findOne해서 그 아이디의 card값 변수에 넣어서 mem.coin에서 돈 빼기
  //bank에서 아이디 찾아서 card값 변수에 넣어놓기
  Bank.findOne({
    where: {userid: req.body.bank.userid}
  }).then(bank => {
    if(bank !=null){  //아이디 있을 때
      var pre_juckgeum = bank.juckgeum;   //기존 테이블 적금 값 변수에 넣어두기

      //mem에서 아이디 찾아서 coin값 변수에 넣어놓기
      Mem.findOne({
       where: {userid: req.body.mem.userid}
      }).then(mem => {
        if(mem !=null){
          var pre_coin = mem.coin;
        }
        var final_coin = pre_coin + pre_juckgeum;  //mem 테이블의 코인 값 = 기존 테이블 코인 + 적금 값
        
        //적금 해지로 얻은 돈 계산해서 코인 값 업데이트
        Mem.update({ 
          coin: final_coin
        }, { 
          where: { userid: req.body.mem.userid} 
        });
      });
    }
  })
   //bank 적금 해지해서 적금 통장 0원 된 값으로 업데이트
   Bank.update({ 
      juckgeum_put: req.body.bank.juckgeum_put,
      juckgeum: req.body.bank.juckgeum, 
      juckgeum_ok: req.body.bank.juckgeum_ok, 
      juckgeum_created: req.body.bank.juckgeum_created
    }, { 
      where: { userid: req.body.bank.userid } 
    });
    console.log('✓적금 해지 성공');
    res.send({
    "result_juckgeum_cancle": "ok"
    })     
});

//예금 개설(예금 개설 버튼 클릭)
router.post('/yegeum', function(req, res, next) {
  Mem.findOne({
    where: {userid: req.body.mem.userid}
  }).then(mem => {
    if(mem != null){  //아이디 있을 때
      var pre_coin = mem.coin;   //기존 테이블 코인 값 변수에 넣어두기

      //bank에서 아이디 찾아서 yegeum값 변수에 넣어놓기
      Bank.findOne({
       where: {userid: req.body.bank.userid}
      }).then(bank => {
        if(bank != null){
          var pre_ye = req.body.bank.yegeum;
        }
        var final_coin = pre_coin - pre_ye;  //mem 테이블의 코인 값 = 기존 테이블 코인 - 예금 값
      
        //예금 개설로 빠진 돈 계산해서 코인 값 업데이트
        Mem.update({ 
          coin: final_coin
        }, { 
          where: { userid: req.body.mem.userid} 
        });
      });
    }
  })
   //예금 개설 된 값으로 업데이트
   Bank.update({ 
      yegeum: req.body.bank.yegeum, 
      yegeum_ok: req.body.bank.yegeum_ok, 
      yegeum_created: req.body.bank.yegeum_created
    }, { 
      where: { userid: req.body.bank.userid } 
    });
    console.log('✓예금 개설 성공');
    res.send({
    "result_yegeum": "ok"
    })  
});

//예금 중도 해지(예금 해지 버튼 클릭) -> 예금은 원금만 돌려줌
router.post('/yegeumCancleM', function(req, res, next) {
  Bank.findOne({
    where: {userid: req.body.bank.userid}
  }).then(bank => {
    if(bank !=null){  //아이디 있을 때
      var pre_yegeum = bank.yegeum;   //기존 테이블 예금 값 변수에 넣어두기

      //mem에서 아이디 찾아서 coin값 변수에 넣어놓기
      Mem.findOne({
       where: {userid: req.body.mem.userid}
      }).then(mem => {
        if(mem !=null){
          var pre_coin = mem.coin;
        }
        var final_coin = pre_coin + pre_yegeum;  //mem 테이블의 코인 값 = 기존 테이블 코인 + 예금 값
        
        //예금 해지로 얻은 돈 계산해서 코인 값 업데이트
        Mem.update({ 
          coin: final_coin
        }, { 
          where: { userid: req.body.mem.userid} 
        });
      });
    }
  })
   //bank 예금 해지해서 적금 통장 0원 된 값으로 업데이트
   Bank.update({ 
      yegeum: req.body.bank.yegeum, 
      yegeum_ok: req.body.bank.yegeum_ok, 
      yegeum_created: req.body.bank.yegeum_created
    }, { 
      where: { userid: req.body.bank.userid } 
    });
    console.log('✓예금 중도 해지 성공');
    res.send({
    "result_yegeum_cancle_m": "ok"
    })     
});

//예금 만기 해지(원금에 0.03곱한 거 더해주기) 
router.post('/yegeumCancleF', function(req, res, next) {
  Bank.findOne({
    where: {userid: req.body.bank.userid}
  }).then(bank => {
    if(bank !=null){  //아이디 있을 때
      var pre_yegeum = (bank.yegeum * 0.03) + bank.yegeum;   //만기된 예금 값 * 0.03한 거 원금에 더해서 변수에 넣어두기

      //mem에서 아이디 찾아서 coin값 변수에 넣어놓기
      Mem.findOne({
       where: {userid: req.body.mem.userid}
      }).then(mem => {
        if(mem !=null){
          var pre_coin = mem.coin;
        }
        var final_coin = pre_coin + pre_yegeum;  //mem 테이블의 코인 값 = 기존 테이블 코인 + 0.03배 한 예금 값
        
        //예금 해지로 얻은 돈 계산해서 코인 값 업데이트
        Mem.update({ 
          coin: final_coin
        }, { 
          where: { userid: req.body.mem.userid} 
        });
      });
    }
  })
   //bank 예금 해지해서 적금 통장 0원 된 값으로 업데이트
   Bank.update({ 
      yegeum: req.body.bank.yegeum, 
      yegeum_ok: req.body.bank.yegeum_ok, 
      yegeum_created: req.body.bank.yegeum_created
    }, { 
      where: { userid: req.body.bank.userid } 
    });
    console.log('✓예금 만기 해지 성공');
    res.send({
    "result_yegeum_cancle_f": "ok"
    })
});

//카드 개설(카드 개설 버튼 클릭)
router.post('/card', function(req, res, next) {
  Bank.update({ 
    card: req.body.bank.card, 
    card_ok: req.body.bank.card_ok
  }, { 
    where: { userid: req.body.bank.userid } 
  });
  console.log('✓카드 개설 성공');
  res.send({
  "result_card": "ok"
  }) 
});

//카드 결제 > mem테이블의 coin이 마이너스여도 빠져나가야 함
//위의 거 아니고 그냥 카드 값만 업뎃 해주는 거
router.post('/cardUse', function(req, res, next) {
  Bank.findOne({
    where: {userid: req.body.bank.userid}
  }).then(bank => {
    var final_card = Number(bank.card) + Number(req.body.bank.product);  //기존의 카드 값 + 결제한 물품 값

    Bank.update({
      card: final_card
    }, {
      where: {userid: req.body.bank.userid}
    });
    console.log('✓카드 결제 성공');
    res.send({
    "result_card_use": "ok"
    })     
  });
});

//카드 해지(카드 해지 버튼 클릭), 카드 정산
//"나중에 카드 정산이 ok값이 false여서 문제가 생길 수도 있음
//정산은 해도 카드는 남아있어야 하니까(없어지면 안되니까)"
router.post('/cardCancle', function(req, res, next) {
  //먼저 bank.findOne해서 그 아이디의 card값 변수에 넣어서 mem.coin에서 돈 빼기
  //bank에서 아이디 찾아서 card값 변수에 넣어놓기
  Bank.findOne({
    where: {userid: req.body.bank.userid}
  }).then(bank => {
    if(bank !=null){  //아이디 찾았을 때
      var pre_card = bank.card;   //기존 테이블 카드 값 변수에 넣어두기

      //mem에서 아이디 찾아서 coin값 변수에 넣어놓기
      Mem.findOne({
       where: {userid: req.body.mem.userid}
      }).then(mem => {
        if(mem !=null){
          var pre_coin = mem.coin;
        }
        var final_coin = pre_coin - pre_card;  //코인 - 카드 값(빚 청산)

        //mem의 코인 카드 빚 뺀 값으로 업데이트
        Mem.update({ 
          coin: final_coin
        }, { 
          where: { userid: req.body.mem.userid} 
        });
      });
    }
  })
   //bank의 카드 빚 청산하고 해지한 값으로 업데이트
   Bank.update({ 
      card: req.body.bank.card, 
      card_ok: req.body.bank.card_ok
    }, { 
      where: { userid: req.body.bank.userid } 
    });
    console.log('✓카드 해지 / 정산 성공');
    res.send({
    "result_card_cancle": "ok"
    })     
});

//세금 계산
router.post('/tax', function(req, res, next){
  Mem.findOne({
    where: {userid: req.body.mem.userid}
  }).then(mem => {
    if(mem !=null){  //아이디 찾았을 때
      var final_tax = mem.coin * 0.03;  //세금 계산

      if(mem.coin <= 0){  //자산이 0원 이하일 때
        console.log('✓세금 계산 완료');
        res.send({
          "result_tax": "ok",
          "tax": "0"
      })
      }
      else{  //자산이 0원 초과일 때
        //자산에서 세금 뺀 값이 0원이면 자산도 0 세금도 0
        if(mem.coin - final_tax == 0){  //안되면 변수 저장해서 미리 계산하기
          Mem.update({ 
            coin: 0 
           }, { 
             where: { userid: req.body.mem.userid} 
           });
          console.log('✓세금 계산 완료');
          res.send({
          "result_tax": "ok",
          "tax": "0"
          })
        }
        //자산에서 세금 뺀 값이 0원 미만이면(남는 자산이 마이너스면) 자산은 그대로 세금은 0
        else if(mem.coin - final_tax < 0){
          console.log('✓세금 계산 완료');
          res.send({
          "result_tax": "ok",
          "tax": "0"
          })
        }
        //자산에서 세금 뺀 값이 0원 초과면(플러스면) 자산 - 세금
        else if(mem.coin - final_tax > 0){
          var final_coin = mem.coin - final_tax;

          Mem.update({
            coin: final_coin
          },{
            where: { userid: req.body.mem.userid}
          });
          console.log('✓세금 계산 완료');
          res.send({
          "result_tax": "ok",
          "tax": final_tax
          })
        }

      }
    }
  })
});

module.exports = router;