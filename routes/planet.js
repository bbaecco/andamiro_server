var express = require('express');
var Mem = require('../models').Mem;
var Bank = require('../models').Bank;
var Reward = require('../models').Reward;
var Main = require('../models').Main;
var Planet = require('../models').Planet;
var Item = require('../models').Item;
var router = express.Router();



// Planet.findAndCountAll = (callback) => {
  //   return Planet.findAndCountAll({
  //     where : {userid: req.body.buy.userid},
  //   })
  //   .then(result => {
  //     console.log(result.count)
  //     console.log(result.rows)
  //     callback(result)
  //   })
  // }  //findAndCountAll의 기본 코드(아래 코드는 내가 변형시킨 것)

//보관함에 한 아이디에 할당된 필드가 31개면 더 이상 구매할 수 없어야 함
//planet의 개수랑 item의 개수를 먼저 찾은 후에 그 수를 더한게 31 이상이면 살 수 없게 해야 함
//카드 결제 현금 결제 나눠야 함
//행성 구매
router.post('/buy', function(req, res, next) {
  Planet.findAndCountAll({  //planet 테이블에서 먼저 개수 확인
    where: {userid: req.body.buy.userid},
  })
  .then(planet => {
    console.log(planet.count)
    console.log(planet.rows)

    Item.findAndCountAll({  //그 다음 item 테이블에서 개수 확인
      where: {userid: req.body.buy.userid},
    })
    .then(item => {
      console.log(item.count)
      console.log(item.rows)

      var final_count = Number(planet.count) + Number(item.count);

      if(final_count >= 31){
        console.log('✗보관함이 꽉 찼습니다.');
          res.send({
            "result_planet_buy_storage": "no"
          })
      }
      else{
        Mem.findOne({
          where: {userid: req.body.mem.userid}
        }).then(mem => {
          //아이디 있을 때
          if(mem !=null){  
           if(req.body.buy.payMethod == 'cash'){
             var final_coin = mem.coin - req.body.buy.money;  //자산 - 물건 값
            if(mem.coin <= 0 || final_coin <= 0){  //기존 coin이 0이거나 계산한 값이 0일 때
              console.log('✗행성 현금이 모자랍니다.');
              res.send({
                "result_planet_buy": "no"
              })
            } 
            else{
              Mem.update({ 
                coin: final_coin
              }, { 
                where: { userid: req.body.mem.userid} 
              });
              ////////////////이미 산 행성 또 살 수 없어야 함//////////////
              Planet.create({ 
                userid: req.body.buy.userid, 
                planet_name: req.body.buy.planet_name
              });
              console.log('✓행성 현금 결제 완료.');
              res.send({
                "result_planet_buy": "yes"
              })
            }
           }
           //카드 개설 안되어있으면 결제가 안됨(안드에서 함)
           else if(req.body.buy.payMethod == 'card'){
            Bank.findOne({
              where: {userid: req.body.bank.userid}
            }).then(bank => {
              //아이디 있을 때
              if(bank !=null){  
                var final_card = Number(bank.card) + Number(req.body.buy.money);
                Bank.update({ 
                  card: final_card
                }, { 
                  where: { userid: req.body.bank.userid} 
                });
                ////////////이미 산 행성 또 살 수 없어야 함////////////////
                Planet.create({ 
                  userid: req.body.buy.userid, 
                  planet_name: req.body.buy.planet_name
                });
                console.log('✓행성 카드 결제 완료.');
                res.send({
                "result_planet_buy": "yes"
              })
              }
            })
           }
            
           else if(req.body.buy.payMethod == 'key'){

            var final_key = Number(mem.key_coin) + Number(req.body.buy.key);
            Mem.update({ 
              key_coin: final_key
            }, { 
              where: { userid: req.body.mem.userid} 
            });
            ////////////이미 산 행성 또 살 수 없어야 함////////////////
            Planet.create({ 
              userid: req.body.buy.userid, 
              planet_name: req.body.buy.planet_name
            });
            console.log('✓행성 키 결제 완료.');
            res.send({
            "result_planet_buy": "yes"
            })
              
            
           }


          }
        })
      }
    
    })
  })
   
});

//행성 구매
// -> 행성 구매시 업적 체크도 같이 하게 해보기
///////////////////////하는 중//////////////////////
router.post('/buy2', function(req, res, next) {
  Planet.findAndCountAll({  //planet 테이블에서 먼저 개수 확인
    where: {userid: req.body.buy.userid},
  })
  .then(planet => {
    console.log(planet.count)
    console.log(planet.rows)

    Item.findAndCountAll({  //그 다음 item 테이블에서 개수 확인
      where: {userid: req.body.buy.userid},
    })
    .then(item => {
      console.log(item.count)
      console.log(item.rows)

      var final_count = Number(planet.count) + Number(item.count);

      if(final_count >= 31){
        console.log('✗보관함이 꽉 찼습니다.');
          res.send({
            "result_planet_buy_storage": "no"
          })
      }
      else{
        Mem.findOne({
          where: {userid: req.body.mem.userid}
        }).then(mem => {
          //아이디 있을 때
          if(mem !=null){  
           if(req.body.buy.payMethod == 'cash'){
             var final_coin = mem.coin - req.body.buy.money;  //자산 - 물건 값
            if(mem.coin <= 0 || final_coin <= 0){  //기존 coin이 0이거나 계산한 값이 0일 때
              console.log('✗행성 현금이 모자랍니다.');
              res.send({
                "result_planet_buy": "no"
              })
            } 
            else{
              Mem.update({ 
                coin: final_coin
              }, { 
                where: { userid: req.body.mem.userid} 
              });
              ////////////////이미 산 행성 또 살 수 없어야 함//////////////
              Planet.create({ 
                userid: req.body.buy.userid, 
                planet_name: req.body.buy.planet_name
              });
              
              console.log('✓행성 현금 결제 완료.');
              res.send({
                "result_planet_buy": "yes"
              })
            }
           }
           //카드 개설 안되어있으면 결제가 안됨(안드에서 함)
           else if(req.body.buy.payMethod == 'card'){
            Bank.findOne({
              where: {userid: req.body.bank.userid}
            }).then(bank => {
              //아이디 있을 때
              if(bank !=null){  
                var final_card = Number(bank.card) + Number(req.body.buy.money);
                Bank.update({ 
                  card: final_card
                }, { 
                  where: { userid: req.body.bank.userid} 
                });
                ////////////이미 산 행성 또 살 수 없어야 함////////////////
                Planet.create({ 
                  userid: req.body.buy.userid, 
                  planet_name: req.body.buy.planet_name
                });
                console.log('✓행성 카드 결제 완료.');
                res.send({
                "result_planet_buy": "yes"
              })
              }
            })
           }
            
           else if(req.body.buy.payMethod == 'key'){

            var final_key = Number(mem.key_coin) + Number(req.body.buy.key);
            Mem.update({ 
              key_coin: final_key
            }, { 
              where: { userid: req.body.mem.userid} 
            });
            ////////////이미 산 행성 또 살 수 없어야 함////////////////
            Planet.create({ 
              userid: req.body.buy.userid, 
              planet_name: req.body.buy.planet_name
            });
            console.log('✓행성 키 결제 완료.');
            res.send({
            "result_planet_buy": "yes"
            })
              
            
           }

           //행성별로 if문 > 각 행성 업적이 0인지 1인지 판단 해야 함

          Reward.findOne({
            where: {userid: req.body.reward.userid}
          }).then(reward => {
            if(reward !=null){
              if(req.body.buy.planet_name == "sea"){
                if(reward.sea == 1){  //이미 sea 행성이 있음
                  console.log('✗이미 달성한 업적(sea)');
                  res.send({
                    "result_planet_buy_planet": "no"
                  })
                }
                else{  //sea 행성 없음
                   Reward.update({ 
                    sea : 1
                  }, { 
                    where: { userid: req.body.reward.userid } 
                  });
                  console.log('✓sea 행성 업적 달성');
                  res.send({
                    "result_planet_buy_planet": "yes"
                  })
                }
              }
              if(req.body.buy.planet_name == "oasis"){
                if(reward.oasis == 1){  //이미 oasis 행성이 있음
                  console.log('✗이미 달성한 업적(oasis)');
                  res.send({
                    "result_planet_buy_planet": "no"
                  })
                }
                else{  //oasis 행성 없음
                   Reward.update({ 
                    oasis : 1
                  }, { 
                    where: { userid: req.body.reward.userid } 
                  });
                  console.log('✓oasis 행성 업적 달성');
                  res.send({
                    "result_planet_buy_planet": "yes"
                  })
                }
              }
              if(req.body.buy.planet_name == "forest"){
                if(reward.forest == 1){  //이미 forest 행성이 있음
                  console.log('✗이미 달성한 업적(forest)');
                  res.send({
                    "result_planet_buy_planet": "no"
                  })
                }
                else{  //forest 행성 없음
                   Reward.update({ 
                    forest : 1
                  }, { 
                    where: { userid: req.body.reward.userid } 
                  });
                  console.log('forest 행성 업적 달성');
                  res.send({
                    "result_planet_buy_planet": "yes"
                  })
                }
              }
              if(req.body.buy.planet_name == "rose"){
                if(reward.rose == 1){  //이미 rose 행성이 있음
                  console.log('✗이미 달성한 업적(rose)');
                  res.send({
                    "result_planet_buy_planet": "no"
                  })
                }
                else{  //rose 행성 없음
                   Reward.update({ 
                    rose : 1
                  }, { 
                    where: { userid: req.body.reward.userid } 
                  });
                  console.log('rose 행성 업적 달성');
                  res.send({
                    "result_planet_buy_planet": "yes"
                  })
                }
              }
              if(req.body.buy.planet_name == "tako"){
                if(reward.tako == 1){  //이미 tako 행성이 있음
                  console.log('✗이미 달성한 업적(tako)');
                  res.send({
                    "result_planet_buy_planet": "no"
                  })
                }
                else{  //tako 행성 없음
                   Reward.update({ 
                    tako : 1
                  }, { 
                    where: { userid: req.body.reward.userid } 
                  });
                  console.log('tako 행성 업적 달성');
                  res.send({
                    "result_planet_buy_planet": "yes"
                  })
                }
              }
              if(req.body.buy.planet_name == "apple"){
                if(reward.apple == 1){  //이미 apple 행성이 있음
                  console.log('✗이미 달성한 업적(apple)');
                  res.send({
                    "result_planet_buy_planet": "no"
                  })
                }
                else{  //apple 행성 없음
                   Reward.update({ 
                    apple : 1
                  }, { 
                    where: { userid: req.body.reward.userid } 
                  });
                  console.log('apple 행성 업적 달성');
                  res.send({
                    "result_planet_buy_planet": "yes"
                  })
                }
              }
              if(req.body.buy.planet_name == "waffle"){
                if(reward.waffle == 1){  //이미 waffle 행성이 있음
                  console.log('✗이미 달성한 업적(waffle)');
                  res.send({
                    "result_planet_buy_planet": "no"
                  })
                }
                else{  //waffle 행성 없음
                   Reward.update({ 
                    waffle : 1
                  }, { 
                    where: { userid: req.body.reward.userid } 
                  });
                  console.log('waffle 행성 업적 달성');
                  res.send({
                    "result_planet_buy_planet": "yes"
                  })
                }
              }
              if(req.body.buy.planet_name == "donut"){
                if(reward.donut == 1){  //이미 donut 행성이 있음
                  console.log('✗이미 달성한 업적(donut)');
                  res.send({
                    "result_planet_buy_planet": "no"
                  })
                }
                else{  //donut 행성 없음
                   Reward.update({ 
                    donut : 1
                  }, { 
                    where: { userid: req.body.reward.userid } 
                  });
                  console.log('donut 행성 업적 달성');
                  res.send({
                    "result_planet_buy_planet": "yes"
                  })
                }
              }
              if(req.body.buy.planet_name == "ice"){
                if(reward.ice == 1){  //이미 ice 행성이 있음
                  console.log('✗이미 달성한 업적(ice)');
                  res.send({
                    "result_planet_buy_planet": "no"
                  })
                }
                else{  //ice 행성 없음
                   Reward.update({ 
                    ice : 1
                  }, { 
                    where: { userid: req.body.reward.userid } 
                  });
                  console.log('ice 행성 업적 달성');
                  res.send({
                    "result_planet_buy_planet": "yes"
                  })
                }
              }
              if(req.body.buy.planet_name == "cheese"){
                if(reward.cheese == 1){  //이미 cheese 행성이 있음
                  console.log('✗이미 달성한 업적(cheese)');
                  res.send({
                    "result_planet_buy_planet": "no"
                  })
                }
                else{  //cheese 행성 없음
                   Reward.update({ 
                    cheese : 1
                  }, { 
                    where: { userid: req.body.reward.userid } 
                  });
                  console.log('cheese 행성 업적 달성');
                  res.send({
                    "result_planet_buy_planet": "yes"
                  })
                }
              }

            }
          })
          
          }
        })
      }
    
    })
  })
   
});  

//cash / card / key 별로 행성 넣기
router.post('/buy3', function(req, res, next) {
  Planet.findAndCountAll({  //planet 테이블에서 먼저 개수 확인
    where: {userid: req.body.buy.userid},
  })
  .then(planet => {
    console.log(planet.count)
    console.log(planet.rows)

    Item.findAndCountAll({  //그 다음 item 테이블에서 개수 확인
      where: {userid: req.body.buy.userid},
    })
    .then(item => {
      console.log(item.count)
      console.log(item.rows)

      var final_count = Number(planet.count) + Number(item.count);

      if(final_count >= 31){
        console.log('✗보관함이 꽉 찼습니다.');
          res.send({
            "result_planet_buy_storage": "no"
          })
      }
      else{
        Mem.findOne({
          where: {userid: req.body.mem.userid}
        }).then(mem => {
          //아이디 있을 때
          if(mem !=null){  
            Reward.findOne({
              where: {userid: req.body.reward.userid}
            }).then(reward => {
              if(reward !=null){
                //행성별로 if문 > 각 행성 업적이 0인지 1인지 판단 해야 함
                if(req.body.buy.payMethod == 'cash'){
                  var final_coin = mem.coin - req.body.buy.money;  //자산 - 물건 값
                 if(mem.coin <= 0 || final_coin <= 0){  //기존 coin이 0이거나 계산한 값이 0일 때
                   console.log('✗행성 현금이 모자랍니다.');
                   res.send({
                     "result_planet_buy": "no"
                   })
                 } 
                 else{
                   
                   ////////////////이미 산 행성 또 살 수 없어야 함//////////////
                   if(req.body.buy.planet_name == "sea"){
                    if(reward.sea == 1){  //이미 sea 행성이 있음
                      console.log('✗이미 달성한 업적(sea)');
                      res.send({
                        "result_planet_buy_reward": "no"
                      })
                    }
                    else{  //sea 행성 없음
                      Mem.update({ 
                        coin: final_coin
                      }, { 
                        where: { userid: req.body.mem.userid} 
                      });

                       Reward.update({ 
                        sea : 1
                      }, { 
                        where: { userid: req.body.reward.userid } 
                      });

                      Planet.create({ 
                        userid: req.body.buy.userid, 
                        planet_name: req.body.buy.planet_name
                      });
                      console.log('✓sea 행성 업적 달성');
                      console.log('✓행성 현금 결제 완료.');
                      res.send({
                        "result_planet_buy": "yes"
                      })
                    }
                  }
                  if(req.body.buy.planet_name == "oasis"){
                    if(reward.oasis == 1){  //이미 oasis 행성이 있음
                      console.log('✗이미 달성한 업적(oasis)');
                      res.send({
                        "result_planet_buy_planet": "no"
                      })
                    }
                    else{  //oasis 행성 없음
                       Reward.update({ 
                        oasis : 1
                      }, { 
                        where: { userid: req.body.reward.userid } 
                      });
                      console.log('✓oasis 행성 업적 달성');
                      res.send({
                        "result_planet_buy_planet": "yes"
                      })
                    }
                  }
                  if(req.body.buy.planet_name == "forest"){
                    if(reward.forest == 1){  //이미 forest 행성이 있음
                      console.log('✗이미 달성한 업적(forest)');
                      res.send({
                        "result_planet_buy_planet": "no"
                      })
                    }
                    else{  //forest 행성 없음
                       Reward.update({ 
                        forest : 1
                      }, { 
                        where: { userid: req.body.reward.userid } 
                      });
                      console.log('forest 행성 업적 달성');
                      res.send({
                        "result_planet_buy_planet": "yes"
                      })
                    }
                  }
                  if(req.body.buy.planet_name == "rose"){
                    if(reward.rose == 1){  //이미 rose 행성이 있음
                      console.log('✗이미 달성한 업적(rose)');
                      res.send({
                        "result_planet_buy_planet": "no"
                      })
                    }
                    else{  //rose 행성 없음
                       Reward.update({ 
                        rose : 1
                      }, { 
                        where: { userid: req.body.reward.userid } 
                      });
                      console.log('rose 행성 업적 달성');
                      res.send({
                        "result_planet_buy_planet": "yes"
                      })
                    }
                  }
                  if(req.body.buy.planet_name == "tako"){
                    if(reward.tako == 1){  //이미 tako 행성이 있음
                      console.log('✗이미 달성한 업적(tako)');
                      res.send({
                        "result_planet_buy_planet": "no"
                      })
                    }
                    else{  //tako 행성 없음
                       Reward.update({ 
                        tako : 1
                      }, { 
                        where: { userid: req.body.reward.userid } 
                      });
                      console.log('tako 행성 업적 달성');
                      res.send({
                        "result_planet_buy_planet": "yes"
                      })
                    }
                  }
                  if(req.body.buy.planet_name == "apple"){
                    if(reward.apple == 1){  //이미 apple 행성이 있음
                      console.log('✗이미 달성한 업적(apple)');
                      res.send({
                        "result_planet_buy_planet": "no"
                      })
                    }
                    else{  //apple 행성 없음
                       Reward.update({ 
                        apple : 1
                      }, { 
                        where: { userid: req.body.reward.userid } 
                      });
                      console.log('apple 행성 업적 달성');
                      res.send({
                        "result_planet_buy_planet": "yes"
                      })
                    }
                  }
                  if(req.body.buy.planet_name == "waffle"){
                    if(reward.waffle == 1){  //이미 waffle 행성이 있음
                      console.log('✗이미 달성한 업적(waffle)');
                      res.send({
                        "result_planet_buy_planet": "no"
                      })
                    }
                    else{  //waffle 행성 없음
                       Reward.update({ 
                        waffle : 1
                      }, { 
                        where: { userid: req.body.reward.userid } 
                      });
                      console.log('waffle 행성 업적 달성');
                      res.send({
                        "result_planet_buy_planet": "yes"
                      })
                    }
                  }
                  if(req.body.buy.planet_name == "donut"){
                    if(reward.donut == 1){  //이미 donut 행성이 있음
                      console.log('✗이미 달성한 업적(donut)');
                      res.send({
                        "result_planet_buy_planet": "no"
                      })
                    }
                    else{  //donut 행성 없음
                       Reward.update({ 
                        donut : 1
                      }, { 
                        where: { userid: req.body.reward.userid } 
                      });
                      console.log('donut 행성 업적 달성');
                      res.send({
                        "result_planet_buy_planet": "yes"
                      })
                    }
                  }
                  if(req.body.buy.planet_name == "ice"){
                    if(reward.ice == 1){  //이미 ice 행성이 있음
                      console.log('✗이미 달성한 업적(ice)');
                      res.send({
                        "result_planet_buy_planet": "no"
                      })
                    }
                    else{  //ice 행성 없음
                       Reward.update({ 
                        ice : 1
                      }, { 
                        where: { userid: req.body.reward.userid } 
                      });
                      console.log('ice 행성 업적 달성');
                      res.send({
                        "result_planet_buy_planet": "yes"
                      })
                    }
                  }
                  if(req.body.buy.planet_name == "cheese"){
                    if(reward.cheese == 1){  //이미 cheese 행성이 있음
                      console.log('✗이미 달성한 업적(cheese)');
                      res.send({
                        "result_planet_buy_planet": "no"
                      })
                    }
                    else{  //cheese 행성 없음
                       Reward.update({ 
                        cheese : 1
                      }, { 
                        where: { userid: req.body.reward.userid } 
                      });
                      console.log('cheese 행성 업적 달성');
                      res.send({
                        "result_planet_buy_planet": "yes"
                      })
                    }
                  }



                   
                   
                
                 }
                }
                //카드 개설 안되어있으면 결제가 안됨(안드에서 함)
                else if(req.body.buy.payMethod == 'card'){
                 Bank.findOne({
                   where: {userid: req.body.bank.userid}
                 }).then(bank => {
                   //아이디 있을 때
                   if(bank !=null){  
                     var final_card = Number(bank.card) + Number(req.body.buy.money);
                     Bank.update({ 
                       card: final_card
                     }, { 
                       where: { userid: req.body.bank.userid} 
                     });
                     ////////////이미 산 행성 또 살 수 없어야 함////////////////
                     Planet.create({ 
                       userid: req.body.buy.userid, 
                       planet_name: req.body.buy.planet_name
                     });
                     console.log('✓행성 카드 결제 완료.');
                     res.send({
                     "result_planet_buy": "yes"
                   })
                   }
                 })
                }
                 
                else if(req.body.buy.payMethod == 'key'){
     
                 var final_key = Number(mem.key_coin) + Number(req.body.buy.key);
                 Mem.update({ 
                   key_coin: final_key
                 }, { 
                   where: { userid: req.body.mem.userid} 
                 });
                 ////////////이미 산 행성 또 살 수 없어야 함////////////////
                 Planet.create({ 
                   userid: req.body.buy.userid, 
                   planet_name: req.body.buy.planet_name
                 });
                 console.log('✓행성 키 결제 완료.');
                 res.send({
                 "result_planet_buy": "yes"
                 })
                   
                 
                }
  
              }
            })
           

           

          
          
          }
        })
      }
    
    })
  })
   
}); 

//행성 별로 cash / card / key 나누기
router.post('/buy4', function(req, res, next) {
  Planet.findAndCountAll({  //planet 테이블에서 먼저 개수 확인
    where: {userid: req.body.buy.userid},
  })
  .then(planet => {
    console.log(planet.count)
    console.log(planet.rows)

    Item.findAndCountAll({  //그 다음 item 테이블에서 개수 확인
      where: {userid: req.body.buy.userid},
    })
    .then(item => {
      console.log(item.count)
      console.log(item.rows)

      var final_count = Number(planet.count) + Number(item.count);

      if(final_count >= 31){
        console.log('✗보관함이 꽉 찼습니다.');
          res.send({
            "result_planet_buy_storage": "no"
          })
      }
      else{
        Mem.findOne({
          where: {userid: req.body.mem.userid}
        }).then(mem => {
          //아이디 있을 때
          if(mem !=null){  
           

           //행성별로 if문 > 각 행성 업적이 0인지 1인지 판단 해야 함

          Reward.findOne({
            where: {userid: req.body.reward.userid}
          }).then(reward => {
            if(reward !=null){
              if(req.body.buy.planet_name == "sea"){
                if(reward.sea == 1){  //이미 sea 행성이 있음
                  console.log('✗이미 달성한 업적(sea)');
                  res.send({
                    "result_planet_buy": "no"
                  })
                }
                else{  //sea 행성 없음

                  if(req.body.buy.payMethod == 'cash'){
                    var final_coin = mem.coin - req.body.buy.money;  //자산 - 물건 값
                   if(mem.coin <= 0 || final_coin <= 0){  //기존 coin이 0이거나 계산한 값이 0일 때
                     console.log('✗행성 현금이 모자랍니다.');
                     res.send({
                       "result_planet_buy_cash": "no"
                     })
                   } 
                   else{
                     Mem.update({ 
                       coin: final_coin
                     }, { 
                       where: { userid: req.body.mem.userid} 
                     });

                     Planet.create({ 
                       userid: req.body.buy.userid, 
                       planet_name: req.body.buy.planet_name
                     });

                     Reward.update({ 
                      sea : 1
                    }, { 
                      where: { userid: req.body.reward.userid } 
                    });
                    
                    console.log('✓sea 행성 업적 달성');
                     console.log('✓행성 현금 결제 완료.');
                     res.send({
                       "result_planet_buy": "yes"
                     })
                   }
                  }
                  //카드 개설 안되어있으면 결제가 안됨(안드에서 함)
                  else if(req.body.buy.payMethod == 'card'){
                   Bank.findOne({
                     where: {userid: req.body.bank.userid}
                   }).then(bank => {
                     //아이디 있을 때
                     if(bank !=null){  
                       var final_card = Number(bank.card) + Number(req.body.buy.money);
                       Bank.update({ 
                         card: final_card
                       }, { 
                         where: { userid: req.body.bank.userid} 
                       });
                   
                       Planet.create({ 
                         userid: req.body.buy.userid, 
                         planet_name: req.body.buy.planet_name
                       });

                       Reward.update({ 
                        sea : 1
                      }, { 
                        where: { userid: req.body.reward.userid } 
                      });
                      
                      console.log('✓sea 행성 업적 달성');

                       console.log('✓행성 카드 결제 완료.');
                       res.send({
                       "result_planet_buy": "yes"
                     })
                     }
                   })
                  }
                  

                   

                }
              }
              if(req.body.buy.planet_name == "oasis"){
                if(reward.oasis == 1){  //이미 oasis 행성이 있음
                  console.log('✗이미 달성한 업적(oasis)');
                  res.send({
                    "result_planet_buy": "no"
                  })
                }
                else{  //oasis 행성 없음

                  if(req.body.buy.payMethod == 'cash'){
                    var final_coin = mem.coin - req.body.buy.money;  //자산 - 물건 값
                   if(mem.coin <= 0 || final_coin <= 0){  //기존 coin이 0이거나 계산한 값이 0일 때
                     console.log('✗행성 현금이 모자랍니다.');
                     res.send({
                       "result_planet_buy_cash": "no"
                     })
                   } 
                   else{
                     Mem.update({ 
                       coin: final_coin
                     }, { 
                       where: { userid: req.body.mem.userid} 
                     });

                     Planet.create({ 
                       userid: req.body.buy.userid, 
                       planet_name: req.body.buy.planet_name
                     });
                     
                   Reward.update({ 
                    oasis : 1
                  }, { 
                    where: { userid: req.body.reward.userid } 
                  });
                  console.log('✓oasis 행성 업적 달성');
                     
                     console.log('✓행성 현금 결제 완료.');
                     res.send({
                       "result_planet_buy": "yes"
                     })
                   }
                  }
                  //카드 개설 안되어있으면 결제가 안됨(안드에서 함)
                  else if(req.body.buy.payMethod == 'card'){
                   Bank.findOne({
                     where: {userid: req.body.bank.userid}
                   }).then(bank => {
                     //아이디 있을 때
                     if(bank !=null){  
                       var final_card = Number(bank.card) + Number(req.body.buy.money);
                       Bank.update({ 
                         card: final_card
                       }, { 
                         where: { userid: req.body.bank.userid} 
                       });
                   
                       Planet.create({ 
                         userid: req.body.buy.userid, 
                         planet_name: req.body.buy.planet_name
                       });

                       
                      Reward.update({ 
                        oasis : 1
                      }, { 
                        where: { userid: req.body.reward.userid } 
                      });
                      console.log('✓oasis 행성 업적 달성');
                       console.log('✓행성 카드 결제 완료.');
                       res.send({
                       "result_planet_buy": "yes"
                     })
                     }
                   })
                  }
                   
                

                 
                }
              }
              if(req.body.buy.planet_name == "forest"){
                if(reward.forest == 1){  //이미 forest 행성이 있음
                  console.log('✗이미 달성한 업적(forest)');
                  res.send({
                    "result_planet_buy": "no"
                  })
                }
                else{  //forest 행성 없음
                  if(req.body.buy.payMethod == 'cash'){
                    var final_coin = mem.coin - req.body.buy.money;  //자산 - 물건 값
                   if(mem.coin <= 0 || final_coin <= 0){  //기존 coin이 0이거나 계산한 값이 0일 때
                     console.log('✗행성 현금이 모자랍니다.');
                     res.send({
                       "result_planet_buy_cash": "no"
                     })
                   } 
                   else{
                     Mem.update({ 
                       coin: final_coin
                     }, { 
                       where: { userid: req.body.mem.userid} 
                     });

                     Planet.create({ 
                       userid: req.body.buy.userid, 
                       planet_name: req.body.buy.planet_name
                     });

                     Reward.update({ 
                      forest : 1
                    }, { 
                      where: { userid: req.body.reward.userid } 
                    });
                    console.log('forest 행성 업적 달성');
                     
                     console.log('✓행성 현금 결제 완료.');
                     res.send({
                       "result_planet_buy": "yes"
                     })
                   }
                  }
                  //카드 개설 안되어있으면 결제가 안됨(안드에서 함)
                  else if(req.body.buy.payMethod == 'card'){
                   Bank.findOne({
                     where: {userid: req.body.bank.userid}
                   }).then(bank => {
                     //아이디 있을 때
                     if(bank !=null){  
                       var final_card = Number(bank.card) + Number(req.body.buy.money);
                       Bank.update({ 
                         card: final_card
                       }, { 
                         where: { userid: req.body.bank.userid} 
                       });
                   
                       Planet.create({ 
                         userid: req.body.buy.userid, 
                         planet_name: req.body.buy.planet_name
                       });

                       Reward.update({ 
                        forest : 1
                      }, { 
                        where: { userid: req.body.reward.userid } 
                      });
                      console.log('forest 행성 업적 달성');
                       console.log('✓행성 카드 결제 완료.');
                       res.send({
                       "result_planet_buy": "yes"
                     })
                     }
                   })
                  }
                   

                   
                  
                }
              }
              if(req.body.buy.planet_name == "rose"){
                if(reward.rose == 1){  //이미 rose 행성이 있음
                  console.log('✗이미 달성한 업적(rose)');
                  res.send({
                    "result_planet_buy": "no"
                  })
                }
                else{  //rose 행성 없음

                  if(req.body.buy.payMethod == 'cash'){
                    var final_coin = mem.coin - req.body.buy.money;  //자산 - 물건 값
                   if(mem.coin <= 0 || final_coin <= 0){  //기존 coin이 0이거나 계산한 값이 0일 때
                     console.log('✗행성 현금이 모자랍니다.');
                     res.send({
                       "result_planet_buy_cash": "no"
                     })
                   } 
                   else{
                     Mem.update({ 
                       coin: final_coin
                     }, { 
                       where: { userid: req.body.mem.userid} 
                     });

                     Planet.create({ 
                       userid: req.body.buy.userid, 
                       planet_name: req.body.buy.planet_name
                     });

                     Reward.update({ 
                      rose : 1
                    }, { 
                      where: { userid: req.body.reward.userid } 
                    });
                    console.log('rose 행성 업적 달성');
                     
                     console.log('✓행성 현금 결제 완료.');
                     res.send({
                       "result_planet_buy": "yes"
                     })
                   }
                  }
                  //카드 개설 안되어있으면 결제가 안됨(안드에서 함)
                  else if(req.body.buy.payMethod == 'card'){
                   Bank.findOne({
                     where: {userid: req.body.bank.userid}
                   }).then(bank => {
                     //아이디 있을 때
                     if(bank !=null){  
                       var final_card = Number(bank.card) + Number(req.body.buy.money);
                       Bank.update({ 
                         card: final_card
                       }, { 
                         where: { userid: req.body.bank.userid} 
                       });
                   
                       Planet.create({ 
                         userid: req.body.buy.userid, 
                         planet_name: req.body.buy.planet_name
                       });

                       Reward.update({ 
                        rose : 1
                      }, { 
                        where: { userid: req.body.reward.userid } 
                      });
                      console.log('rose 행성 업적 달성');
                       console.log('✓행성 카드 결제 완료.');
                       res.send({
                       "result_planet_buy": "yes"
                     })
                     }
                   })
                  }
                 

                   
                  
                }
              }
              if(req.body.buy.planet_name == "tako"){
                if(reward.tako == 1){  //이미 tako 행성이 있음
                  console.log('✗이미 달성한 업적(tako)');
                  res.send({
                    "result_planet_buy": "no"
                  })
                }
                else{  //tako 행성 없음

                  if(req.body.buy.payMethod == 'cash'){
                    var final_coin = mem.coin - req.body.buy.money;  //자산 - 물건 값
                   if(mem.coin <= 0 || final_coin <= 0){  //기존 coin이 0이거나 계산한 값이 0일 때
                     console.log('✗행성 현금이 모자랍니다.');
                     res.send({
                       "result_planet_buy_cash": "no"
                     })
                   } 
                   else{
                     Mem.update({ 
                       coin: final_coin
                     }, { 
                       where: { userid: req.body.mem.userid} 
                     });

                     Planet.create({ 
                       userid: req.body.buy.userid, 
                       planet_name: req.body.buy.planet_name
                     });
                     
                     Reward.update({ 
                      tako : 1
                    }, { 
                      where: { userid: req.body.reward.userid } 
                    });
                    console.log('tako 행성 업적 달성');
                     console.log('✓행성 현금 결제 완료.');
                     res.send({
                       "result_planet_buy": "yes"
                     })
                   }
                  }
                  //카드 개설 안되어있으면 결제가 안됨(안드에서 함)
                  else if(req.body.buy.payMethod == 'card'){
                   Bank.findOne({
                     where: {userid: req.body.bank.userid}
                   }).then(bank => {
                     //아이디 있을 때
                     if(bank !=null){  
                       var final_card = Number(bank.card) + Number(req.body.buy.money);
                       Bank.update({ 
                         card: final_card
                       }, { 
                         where: { userid: req.body.bank.userid} 
                       });
                   
                       Planet.create({ 
                         userid: req.body.buy.userid, 
                         planet_name: req.body.buy.planet_name
                       });

                       Reward.update({ 
                        tako : 1
                      }, { 
                        where: { userid: req.body.reward.userid } 
                      });
                      console.log('tako 행성 업적 달성');
                       console.log('✓행성 카드 결제 완료.');
                       res.send({
                       "result_planet_buy": "yes"
                     })
                     }
                   })
                  }
                  

                   
            
                }
              }
              if(req.body.buy.planet_name == "apple"){
                if(reward.apple == 1){  //이미 apple 행성이 있음
                  console.log('✗이미 달성한 업적(apple)');
                  res.send({
                    "result_planet_buy": "no"
                  })
                }
                else{  //apple 행성 없음

                  if(req.body.buy.payMethod == 'cash'){
                    var final_coin = mem.coin - req.body.buy.money;  //자산 - 물건 값
                   if(mem.coin <= 0 || final_coin <= 0){  //기존 coin이 0이거나 계산한 값이 0일 때
                     console.log('✗행성 현금이 모자랍니다.');
                     res.send({
                       "result_planet_buy_cash": "no"
                     })
                   } 
                   else{
                     Mem.update({ 
                       coin: final_coin
                     }, { 
                       where: { userid: req.body.mem.userid} 
                     });

                     Planet.create({ 
                       userid: req.body.buy.userid, 
                       planet_name: req.body.buy.planet_name
                     });

                     Reward.update({ 
                      apple : 1
                    }, { 
                      where: { userid: req.body.reward.userid } 
                    });
                    console.log('apple 행성 업적 달성');
                   
                     console.log('✓행성 현금 결제 완료.');
                     res.send({
                       "result_planet_buy": "yes"
                     })
                   }
                  }
                  //카드 개설 안되어있으면 결제가 안됨(안드에서 함)
                  else if(req.body.buy.payMethod == 'card'){
                   Bank.findOne({
                     where: {userid: req.body.bank.userid}
                   }).then(bank => {
                     //아이디 있을 때
                     if(bank !=null){  
                       var final_card = Number(bank.card) + Number(req.body.buy.money);
                       Bank.update({ 
                         card: final_card
                       }, { 
                         where: { userid: req.body.bank.userid} 
                       });
                   
                       Planet.create({ 
                         userid: req.body.buy.userid, 
                         planet_name: req.body.buy.planet_name
                       });

                       Reward.update({ 
                        apple : 1
                      }, { 
                        where: { userid: req.body.reward.userid } 
                      });
                      console.log('apple 행성 업적 달성');
                     
                       console.log('✓행성 카드 결제 완료.');
                       res.send({
                       "result_planet_buy": "yes"
                     })
                     }
                   })
                  }
                   

                   
                }
              }
              if(req.body.buy.planet_name == "waffle"){
                if(reward.waffle == 1){  //이미 waffle 행성이 있음
                  console.log('✗이미 달성한 업적(waffle)');
                  res.send({
                    "result_planet_buy": "no"
                  })
                }
                else{  //waffle 행성 없음


                  if(req.body.buy.payMethod == 'cash'){
                    var final_coin = mem.coin - req.body.buy.money;  //자산 - 물건 값
                   if(mem.coin <= 0 || final_coin <= 0){  //기존 coin이 0이거나 계산한 값이 0일 때
                     console.log('✗행성 현금이 모자랍니다.');
                     res.send({
                       "result_planet_buy_cash": "no"
                     })
                   } 
                   else{
                     Mem.update({ 
                       coin: final_coin
                     }, { 
                       where: { userid: req.body.mem.userid} 
                     });

                     Planet.create({ 
                       userid: req.body.buy.userid, 
                       planet_name: req.body.buy.planet_name
                     });
                     
                     Reward.update({ 
                      waffle : 1
                    }, { 
                      where: { userid: req.body.reward.userid } 
                    });
                    console.log('waffle 행성 업적 달성');
                     console.log('✓행성 현금 결제 완료.');
                     res.send({
                       "result_planet_buy": "yes"
                     })
                   }
                  }
                  //카드 개설 안되어있으면 결제가 안됨(안드에서 함)
                  else if(req.body.buy.payMethod == 'card'){
                   Bank.findOne({
                     where: {userid: req.body.bank.userid}
                   }).then(bank => {
                     //아이디 있을 때
                     if(bank !=null){  
                       var final_card = Number(bank.card) + Number(req.body.buy.money);
                       Bank.update({ 
                         card: final_card
                       }, { 
                         where: { userid: req.body.bank.userid} 
                       });
                   
                       Planet.create({ 
                         userid: req.body.buy.userid, 
                         planet_name: req.body.buy.planet_name
                       });

                       Reward.update({ 
                        waffle : 1
                      }, { 
                        where: { userid: req.body.reward.userid } 
                      });
                      console.log('waffle 행성 업적 달성');
                       console.log('✓행성 카드 결제 완료.');
                       res.send({
                       "result_planet_buy": "yes"
                     })
                     }
                   })
                  }
                   
              
                   
                 
                }
              }
              if(req.body.buy.planet_name == "donut"){
                if(reward.donut == 1){  //이미 donut 행성이 있음
                  console.log('✗이미 달성한 업적(donut)');
                  res.send({
                    "result_planet_buy": "no"
                  })
                }
                else{  //donut 행성 없음

                  if(req.body.buy.payMethod == 'cash'){
                    var final_coin = mem.coin - req.body.buy.money;  //자산 - 물건 값
                   if(mem.coin <= 0 || final_coin <= 0){  //기존 coin이 0이거나 계산한 값이 0일 때
                     console.log('✗행성 현금이 모자랍니다.');
                     res.send({
                       "result_planet_buy_cash": "no"
                     })
                   } 
                   else{
                     Mem.update({ 
                       coin: final_coin
                     }, { 
                       where: { userid: req.body.mem.userid} 
                     });

                     Planet.create({ 
                       userid: req.body.buy.userid, 
                       planet_name: req.body.buy.planet_name
                     });

                     Reward.update({ 
                      donut : 1
                    }, { 
                      where: { userid: req.body.reward.userid } 
                    });
                    console.log('donut 행성 업적 달성');
                     
                     console.log('✓행성 현금 결제 완료.');
                     res.send({
                       "result_planet_buy": "yes"
                     })
                   }
                  }
                  //카드 개설 안되어있으면 결제가 안됨(안드에서 함)
                  else if(req.body.buy.payMethod == 'card'){
                   Bank.findOne({
                     where: {userid: req.body.bank.userid}
                   }).then(bank => {
                     //아이디 있을 때
                     if(bank !=null){  
                       var final_card = Number(bank.card) + Number(req.body.buy.money);
                       Bank.update({ 
                         card: final_card
                       }, { 
                         where: { userid: req.body.bank.userid} 
                       });
                   
                       Planet.create({ 
                         userid: req.body.buy.userid, 
                         planet_name: req.body.buy.planet_name
                       });

                       Reward.update({ 
                        donut : 1
                      }, { 
                        where: { userid: req.body.reward.userid } 
                      });
                      console.log('donut 행성 업적 달성');
                       console.log('✓행성 카드 결제 완료.');
                       res.send({
                       "result_planet_buy": "yes"
                     })
                     }
                   })
                  }
                 

                   
                  
                }
              }
              if(req.body.buy.planet_name == "ice"){
                if(reward.ice == 1){  //이미 ice 행성이 있음
                  console.log('✗이미 달성한 업적(ice)');
                  res.send({
                    "result_planet_buy": "no"
                  })
                }
                else{  //ice 행성 없음

                   
                  if(req.body.buy.payMethod == 'key'){
       
                   var final_key = mem.key_coin - req.body.buy.key;
                   Mem.update({ 
                     key_coin: final_key
                   }, { 
                     where: { userid: req.body.mem.userid} 
                   });
                   
                   Planet.create({ 
                     userid: req.body.buy.userid, 
                     planet_name: req.body.buy.planet_name
                   });

                   Reward.update({ 
                    ice : 1
                  }, { 
                    where: { userid: req.body.reward.userid } 
                  });
                  console.log('ice 행성 업적 달성');
                   console.log('✓행성 키 결제 완료.');
                   res.send({
                   "result_planet_buy": "yes"
                   })
                     
                   
                  }

                   
               
                }
              }
              if(req.body.buy.planet_name == "cheese"){
                if(reward.cheese == 1){  //이미 cheese 행성이 있음
                  console.log('✗이미 달성한 업적(cheese)');
                  res.send({
                    "result_planet_buy": "no"
                  })
                }
                else{  //cheese 행성 없음
                   if(req.body.buy.payMethod == 'key'){
       
                   var final_key = mem.key_coin - req.body.buy.key;
                   Mem.update({ 
                     key_coin: final_key
                   }, { 
                     where: { userid: req.body.mem.userid} 
                   });
                   
                   Planet.create({ 
                     userid: req.body.buy.userid, 
                     planet_name: req.body.buy.planet_name
                   });

                   Reward.update({ 
                    cheese : 1
                  }, { 
                    where: { userid: req.body.reward.userid } 
                  });
                  console.log('cheese 행성 업적 달성');
                   console.log('✓행성 키 결제 완료.');
                   res.send({
                   "result_planet_buy": "yes"
                   })
                     
                   
                  }

                  
                  
                }
              }

            }
          })
          
          }
        })
      }
    
    })
  })
   
});  


//
//행성 별로 cash / card / key 나누기
router.post('/buy4Test', function(req, res, next) {
  Planet.findAndCountAll({  //planet 테이블에서 먼저 개수 확인
    where: {userid: req.body.buy.userid},
  })
  .then(planet => {
    console.log(planet.count)
    console.log(planet.rows)

    Item.findAndCountAll({  //그 다음 item 테이블에서 개수 확인
      where: {userid: req.body.buy.userid},
    })
    .then(item => {
      console.log(item.count)
      console.log(item.rows)

      var final_count = Number(planet.count) + Number(item.count);

      if(final_count >= 31){
        console.log('✗보관함이 꽉 찼습니다.');
          res.send({
            "result_planet_buy_storage": "no"
          })
      }
      else{
        Mem.findOne({
          where: {userid: req.body.mem.userid}
        }).then(mem => {
          //아이디 있을 때
          if(mem !=null){  
           

           //행성별로 if문 > 각 행성 업적이 0인지 1인지 판단 해야 함

          Reward.findOne({
            where: {userid: req.body.reward.userid}
          }).then(reward => {
            if(reward !=null){
              if(req.body.buy.planet_name == "sea"){
                if(reward.sea == 1){  //이미 sea 행성이 있음
                  console.log('✗이미 달성한 업적(sea)');
                  res.send({
                    "result_planet_buy": "no"
                  })
                }
                else{  //sea 행성 없음

                  if(req.body.buy.payMethod == 'cash'){
                    var final_coin = mem.coin - req.body.buy.money;  //자산 - 물건 값
                   if(mem.coin <= 0 || final_coin <= 0){  //기존 coin이 0이거나 계산한 값이 0일 때
                     console.log('✗행성 현금이 모자랍니다.');
                     res.send({
                       "result_planet_buy_cash": "no"
                     })
                   } 
                   else{
                     Mem.update({ 
                       coin: final_coin
                     }, { 
                       where: { userid: req.body.mem.userid} 
                     });

                     Planet.create({ 
                       userid: req.body.buy.userid, 
                       planet_name: req.body.buy.planet_name
                     });

                     Reward.update({ 
                      sea : 1
                    }, { 
                      where: { userid: req.body.reward.userid } 
                    });
                    
                    console.log('✓sea 행성 업적 달성');
                     console.log('✓행성 현금 결제 완료.');
                     res.send({
                       "result_planet_buy": "yes"
                     })
                   }
                  }
                  //카드 개설 안되어있으면 결제가 안됨(안드에서 함)
                  else if(req.body.buy.payMethod == 'card'){
                   Bank.findOne({
                     where: {userid: req.body.bank.userid}
                   }).then(bank => {
                     //아이디 있을 때
                     if(bank !=null){  
                       var final_card = Number(bank.card) + Number(req.body.buy.money);
                       Bank.update({ 
                         card: final_card
                       }, { 
                         where: { userid: req.body.bank.userid} 
                       });
                   
                       Planet.create({ 
                         userid: req.body.buy.userid, 
                         planet_name: req.body.buy.planet_name
                       });

                       Reward.update({ 
                        sea : 1
                      }, { 
                        where: { userid: req.body.reward.userid } 
                      });
                      
                      console.log('✓sea 행성 업적 달성');

                       console.log('✓행성 카드 결제 완료.');
                       res.send({
                       "result_planet_buy": "yes"
                     })
                     }
                   })
                  }
                  

                   

                }
              }
              if(req.body.buy.planet_name == "oasis"){
                if(reward.oasis == 1){  //이미 oasis 행성이 있음
                  console.log('✗이미 달성한 업적(oasis)');
                  res.send({
                    "result_planet_buy": "no"
                  })
                }
                else{  //oasis 행성 없음

                  if(req.body.buy.payMethod == 'cash'){
                    var final_coin = mem.coin - req.body.buy.money;  //자산 - 물건 값
                   if(mem.coin <= 0 || final_coin <= 0){  //기존 coin이 0이거나 계산한 값이 0일 때
                     console.log('✗행성 현금이 모자랍니다.');
                     res.send({
                       "result_planet_buy_cash": "no"
                     })
                   } 
                   else{
                     Mem.update({ 
                       coin: final_coin
                     }, { 
                       where: { userid: req.body.mem.userid} 
                     });

                     Planet.create({ 
                       userid: req.body.buy.userid, 
                       planet_name: req.body.buy.planet_name
                     });
                     
                   Reward.update({ 
                    oasis : 1
                  }, { 
                    where: { userid: req.body.reward.userid } 
                  });
                  console.log('✓oasis 행성 업적 달성');
                     
                     console.log('✓행성 현금 결제 완료.');
                     res.send({
                       "result_planet_buy": "yes"
                     })
                   }
                  }
                  //카드 개설 안되어있으면 결제가 안됨(안드에서 함)
                  else if(req.body.buy.payMethod == 'card'){
                   Bank.findOne({
                     where: {userid: req.body.bank.userid}
                   }).then(bank => {
                     //아이디 있을 때
                     if(bank !=null){  
                       var final_card = Number(bank.card) + Number(req.body.buy.money);
                       Bank.update({ 
                         card: final_card
                       }, { 
                         where: { userid: req.body.bank.userid} 
                       });
                   
                       Planet.create({ 
                         userid: req.body.buy.userid, 
                         planet_name: req.body.buy.planet_name
                       });

                       
                      Reward.update({ 
                        oasis : 1
                      }, { 
                        where: { userid: req.body.reward.userid } 
                      });
                      console.log('✓oasis 행성 업적 달성');
                       console.log('✓행성 카드 결제 완료.');
                       res.send({
                       "result_planet_buy": "yes"
                     })
                     }
                   })
                  }
                   
                

                 
                }
              }
              if(req.body.buy.planet_name == "forest"){
                if(reward.forest == 1){  //이미 forest 행성이 있음
                  console.log('✗이미 달성한 업적(forest)');
                  res.send({
                    "result_planet_buy": "no"
                  })
                }
                else{  //forest 행성 없음
                  if(req.body.buy.payMethod == 'cash'){
                    var final_coin = mem.coin - req.body.buy.money;  //자산 - 물건 값
                   if(mem.coin <= 0 || final_coin <= 0){  //기존 coin이 0이거나 계산한 값이 0일 때
                     console.log('✗행성 현금이 모자랍니다.');
                     res.send({
                       "result_planet_buy_cash": "no"
                     })
                   } 
                   else{
                     Mem.update({ 
                       coin: final_coin
                     }, { 
                       where: { userid: req.body.mem.userid} 
                     });

                     Planet.create({ 
                       userid: req.body.buy.userid, 
                       planet_name: req.body.buy.planet_name
                     });

                     Reward.update({ 
                      forest : 1
                    }, { 
                      where: { userid: req.body.reward.userid } 
                    });
                    console.log('forest 행성 업적 달성');
                     
                     console.log('✓행성 현금 결제 완료.');
                     res.send({
                       "result_planet_buy": "yes"
                     })
                   }
                  }
                  //카드 개설 안되어있으면 결제가 안됨(안드에서 함)
                  else if(req.body.buy.payMethod == 'card'){
                   Bank.findOne({
                     where: {userid: req.body.bank.userid}
                   }).then(bank => {
                     //아이디 있을 때
                     if(bank !=null){  
                       var final_card = Number(bank.card) + Number(req.body.buy.money);
                       Bank.update({ 
                         card: final_card
                       }, { 
                         where: { userid: req.body.bank.userid} 
                       });
                   
                       Planet.create({ 
                         userid: req.body.buy.userid, 
                         planet_name: req.body.buy.planet_name
                       });

                       Reward.update({ 
                        forest : 1
                      }, { 
                        where: { userid: req.body.reward.userid } 
                      });
                      console.log('forest 행성 업적 달성');
                       console.log('✓행성 카드 결제 완료.');
                       res.send({
                       "result_planet_buy": "yes"
                     })
                     }
                   })
                  }
                   

                   
                  
                }
              }
              if(req.body.buy.planet_name == "rose"){
                if(reward.rose == 1){  //이미 rose 행성이 있음
                  console.log('✗이미 달성한 업적(rose)');
                  res.send({
                    "result_planet_buy": "no"
                  })
                }
                else{  //rose 행성 없음

                  if(req.body.buy.payMethod == 'cash'){
                    var final_coin = mem.coin - req.body.buy.money;  //자산 - 물건 값
                   if(mem.coin <= 0 || final_coin <= 0){  //기존 coin이 0이거나 계산한 값이 0일 때
                     console.log('✗행성 현금이 모자랍니다.');
                     res.send({
                       "result_planet_buy_cash": "no"
                     })
                   } 
                   else{
                     Mem.update({ 
                       coin: final_coin
                     }, { 
                       where: { userid: req.body.mem.userid} 
                     });

                     Planet.create({ 
                       userid: req.body.buy.userid, 
                       planet_name: req.body.buy.planet_name
                     });

                     Reward.update({ 
                      rose : 1
                    }, { 
                      where: { userid: req.body.reward.userid } 
                    });
                    console.log('rose 행성 업적 달성');
                     
                     console.log('✓행성 현금 결제 완료.');
                     res.send({
                       "result_planet_buy": "yes"
                     })
                   }
                  }
                  //카드 개설 안되어있으면 결제가 안됨(안드에서 함)
                  else if(req.body.buy.payMethod == 'card'){
                   Bank.findOne({
                     where: {userid: req.body.bank.userid}
                   }).then(bank => {
                     //아이디 있을 때
                     if(bank !=null){  
                       var final_card = Number(bank.card) + Number(req.body.buy.money);
                       Bank.update({ 
                         card: final_card
                       }, { 
                         where: { userid: req.body.bank.userid} 
                       });
                   
                       Planet.create({ 
                         userid: req.body.buy.userid, 
                         planet_name: req.body.buy.planet_name
                       });

                       Reward.update({ 
                        rose : 1
                      }, { 
                        where: { userid: req.body.reward.userid } 
                      });
                      console.log('rose 행성 업적 달성');
                       console.log('✓행성 카드 결제 완료.');
                       res.send({
                       "result_planet_buy": "yes"
                     })
                     }
                   })
                  }
                 

                   
                  
                }
              }
              if(req.body.buy.planet_name == "tako"){
                if(reward.tako == 1){  //이미 tako 행성이 있음
                  console.log('✗이미 달성한 업적(tako)');
                  res.send({
                    "result_planet_buy": "no"
                  })
                }
                else{  //tako 행성 없음

                  if(req.body.buy.payMethod == 'cash'){
                    var final_coin = mem.coin - req.body.buy.money;  //자산 - 물건 값
                   if(mem.coin <= 0 || final_coin <= 0){  //기존 coin이 0이거나 계산한 값이 0일 때
                     console.log('✗행성 현금이 모자랍니다.');
                     res.send({
                       "result_planet_buy_cash": "no"
                     })
                   } 
                   else{
                     Mem.update({ 
                       coin: final_coin
                     }, { 
                       where: { userid: req.body.mem.userid} 
                     });

                     Planet.create({ 
                       userid: req.body.buy.userid, 
                       planet_name: req.body.buy.planet_name
                     });
                     
                     Reward.update({ 
                      tako : 1
                    }, { 
                      where: { userid: req.body.reward.userid } 
                    });
                    console.log('tako 행성 업적 달성');
                     console.log('✓행성 현금 결제 완료.');
                     res.send({
                       "result_planet_buy": "yes"
                     })
                   }
                  }
                  //카드 개설 안되어있으면 결제가 안됨(안드에서 함)
                  else if(req.body.buy.payMethod == 'card'){
                   Bank.findOne({
                     where: {userid: req.body.bank.userid}
                   }).then(bank => {
                     //아이디 있을 때
                     if(bank !=null){  
                       var final_card = Number(bank.card) + Number(req.body.buy.money);
                       Bank.update({ 
                         card: final_card
                       }, { 
                         where: { userid: req.body.bank.userid} 
                       });
                   
                       Planet.create({ 
                         userid: req.body.buy.userid, 
                         planet_name: req.body.buy.planet_name
                       });

                       Reward.update({ 
                        tako : 1
                      }, { 
                        where: { userid: req.body.reward.userid } 
                      });
                      console.log('tako 행성 업적 달성');
                       console.log('✓행성 카드 결제 완료.');
                       res.send({
                       "result_planet_buy": "yes"
                     })
                     }
                   })
                  }
                  

                   
            
                }
              }
              if(req.body.buy.planet_name == "apple"){
                if(reward.apple == 1){  //이미 apple 행성이 있음
                  console.log('✗이미 달성한 업적(apple)');
                  res.send({
                    "result_planet_buy": "no"
                  })
                }
                else{  //apple 행성 없음

                  if(req.body.buy.payMethod == 'cash'){
                    var final_coin = mem.coin - req.body.buy.money;  //자산 - 물건 값
                   if(mem.coin <= 0 || final_coin <= 0){  //기존 coin이 0이거나 계산한 값이 0일 때
                     console.log('✗행성 현금이 모자랍니다.');
                     res.send({
                       "result_planet_buy_cash": "no"
                     })
                   } 
                   else{
                     Mem.update({ 
                       coin: final_coin
                     }, { 
                       where: { userid: req.body.mem.userid} 
                     });

                     Planet.create({ 
                       userid: req.body.buy.userid, 
                       planet_name: req.body.buy.planet_name
                     });

                     Reward.update({ 
                      apple : 1
                    }, { 
                      where: { userid: req.body.reward.userid } 
                    });
                    console.log('apple 행성 업적 달성');
                   
                     console.log('✓행성 현금 결제 완료.');
                     res.send({
                       "result_planet_buy": "yes"
                     })
                   }
                  }
                  //카드 개설 안되어있으면 결제가 안됨(안드에서 함)
                  else if(req.body.buy.payMethod == 'card'){
                   Bank.findOne({
                     where: {userid: req.body.bank.userid}
                   }).then(bank => {
                     //아이디 있을 때
                     if(bank !=null){  
                       var final_card = Number(bank.card) + Number(req.body.buy.money);
                       Bank.update({ 
                         card: final_card
                       }, { 
                         where: { userid: req.body.bank.userid} 
                       });
                   
                       Planet.create({ 
                         userid: req.body.buy.userid, 
                         planet_name: req.body.buy.planet_name
                       });

                       Reward.update({ 
                        apple : 1
                      }, { 
                        where: { userid: req.body.reward.userid } 
                      });
                      console.log('apple 행성 업적 달성');
                     
                       console.log('✓행성 카드 결제 완료.');
                       res.send({
                       "result_planet_buy": "yes"
                     })
                     }
                   })
                  }
                   

                   
                }
              }
              if(req.body.buy.planet_name == "waffle"){
                if(reward.waffle == 1){  //이미 waffle 행성이 있음
                  console.log('✗이미 달성한 업적(waffle)');
                  res.send({
                    "result_planet_buy": "no"
                  })
                }
                else{  //waffle 행성 없음


                  if(req.body.buy.payMethod == 'cash'){
                    var final_coin = mem.coin - req.body.buy.money;  //자산 - 물건 값
                   if(mem.coin <= 0 || final_coin <= 0){  //기존 coin이 0이거나 계산한 값이 0일 때
                     console.log('✗행성 현금이 모자랍니다.');
                     res.send({
                       "result_planet_buy_cash": "no"
                     })
                   } 
                   else{
                     Mem.update({ 
                       coin: final_coin
                     }, { 
                       where: { userid: req.body.mem.userid} 
                     });

                     Planet.create({ 
                       userid: req.body.buy.userid, 
                       planet_name: req.body.buy.planet_name
                     });
                     
                     Reward.update({ 
                      waffle : 1
                    }, { 
                      where: { userid: req.body.reward.userid } 
                    });
                    console.log('waffle 행성 업적 달성');
                     console.log('✓행성 현금 결제 완료.');
                     res.send({
                       "result_planet_buy": "yes"
                     })
                   }
                  }
                  //카드 개설 안되어있으면 결제가 안됨(안드에서 함)
                  else if(req.body.buy.payMethod == 'card'){
                   Bank.findOne({
                     where: {userid: req.body.bank.userid}
                   }).then(bank => {
                     //아이디 있을 때
                     if(bank !=null){  
                       var final_card = Number(bank.card) + Number(req.body.buy.money);
                       Bank.update({ 
                         card: final_card
                       }, { 
                         where: { userid: req.body.bank.userid} 
                       });
                   
                       Planet.create({ 
                         userid: req.body.buy.userid, 
                         planet_name: req.body.buy.planet_name
                       });

                       Reward.update({ 
                        waffle : 1
                      }, { 
                        where: { userid: req.body.reward.userid } 
                      });
                      console.log('waffle 행성 업적 달성');
                       console.log('✓행성 카드 결제 완료.');
                       res.send({
                       "result_planet_buy": "yes"
                     })
                     }
                   })
                  }
                   
              
                   
                 
                }
              }
              if(req.body.buy.planet_name == "donut"){
                if(reward.donut == 1){  //이미 donut 행성이 있음
                  console.log('✗이미 달성한 업적(donut)');
                  res.send({
                    "result_planet_buy": "no"
                  })
                }
                else{  //donut 행성 없음

                  if(req.body.buy.payMethod == 'cash'){
                    var final_coin = mem.coin - req.body.buy.money;  //자산 - 물건 값
                   if(mem.coin <= 0 || final_coin <= 0){  //기존 coin이 0이거나 계산한 값이 0일 때
                     console.log('✗행성 현금이 모자랍니다.');
                     res.send({
                       "result_planet_buy_cash": "no"
                     })
                   } 
                   else{
                     Mem.update({ 
                       coin: final_coin
                     }, { 
                       where: { userid: req.body.mem.userid} 
                     });

                     Planet.create({ 
                       userid: req.body.buy.userid, 
                       planet_name: req.body.buy.planet_name
                     });

                     Reward.update({ 
                      donut : 1
                    }, { 
                      where: { userid: req.body.reward.userid } 
                    });
                    console.log('donut 행성 업적 달성');
                     
                     console.log('✓행성 현금 결제 완료.');
                     res.send({
                       "result_planet_buy": "yes"
                     })
                   }
                  }
                  //카드 개설 안되어있으면 결제가 안됨(안드에서 함)
                  else if(req.body.buy.payMethod == 'card'){
                   Bank.findOne({
                     where: {userid: req.body.bank.userid}
                   }).then(bank => {
                     //아이디 있을 때
                     if(bank !=null){  
                       var final_card = Number(bank.card) + Number(req.body.buy.money);
                       Bank.update({ 
                         card: final_card
                       }, { 
                         where: { userid: req.body.bank.userid} 
                       });
                   
                       Planet.create({ 
                         userid: req.body.buy.userid, 
                         planet_name: req.body.buy.planet_name
                       });

                       Reward.update({ 
                        donut : 1
                      }, { 
                        where: { userid: req.body.reward.userid } 
                      });
                      console.log('donut 행성 업적 달성');
                       console.log('✓행성 카드 결제 완료.');
                       res.send({
                       "result_planet_buy": "yes"
                     })
                     }
                   })
                  }
                 

                   
                  
                }
              }
              if(req.body.buy.planet_name == "ice"){
                if(reward.ice == 1){  //이미 ice 행성이 있음
                  console.log('✗이미 달성한 업적(ice)');
                  res.send({
                    "result_planet_buy": "no"
                  })
                }
                else{  //ice 행성 없음

                   
                  if(req.body.buy.payMethod == 'key'){
       
                   var final_key = mem.key_coin - req.body.buy.key;
                   Mem.update({ 
                     key_coin: final_key
                   }, { 
                     where: { userid: req.body.mem.userid} 
                   });
                   
                   Planet.create({ 
                     userid: req.body.buy.userid, 
                     planet_name: req.body.buy.planet_name
                   });

                   Reward.update({ 
                    ice : 1
                  }, { 
                    where: { userid: req.body.reward.userid } 
                  });
                  console.log('ice 행성 업적 달성');
                   console.log('✓행성 키 결제 완료.');
                   res.send({
                   "result_planet_buy": "yes"
                   })
                     
                   
                  }

                   
               
                }
              }
              if(req.body.buy.planet_name == "cheese"){
                if(reward.cheese == 1){  //이미 cheese 행성이 있음
                  console.log('✗이미 달성한 업적(cheese)');
                  res.send({
                    "result_planet_buy": "no"
                  })
                }
                else{  //cheese 행성 없음
                   if(req.body.buy.payMethod == 'key'){
       
                   var final_key = mem.key_coin - req.body.buy.key;
                   Mem.update({ 
                     key_coin: final_key
                   }, { 
                     where: { userid: req.body.mem.userid} 
                   });
                   
                   Planet.create({ 
                     userid: req.body.buy.userid, 
                     planet_name: req.body.buy.planet_name
                   });

                   Reward.update({ 
                    cheese : 1
                  }, { 
                    where: { userid: req.body.reward.userid } 
                  });
                  console.log('cheese 행성 업적 달성');
                   console.log('✓행성 키 결제 완료.');
                   res.send({
                   "result_planet_buy": "yes"
                   })
                     
                   
                  }

                  
                  
                }
              }

            }
          })
          
          }
        })
      }
    
    })
  })
   
});  










//보관함에 어떤 행성 들어있는지 보내주기
//행성 이름만 빼서 보내는 방법 더 생각해보기 > 안해도 될 듯
router.post('/storage', function(req, res, next) {
  //json 배열 사용
  Planet.findAll()
  .then((planet) => {

    Planet.findAll({
      where:{userid: req.body.planet.userid}
    }).then(result => {
      jsonObject = new Object();
    
      jsonObject.result_planet_storage ="ok";
      //jsonObject.planets = planet;  //planet 테이블에 있는 정보 다 보내짐
      jsonObject.userid = result;  //planet 테이블 중 통신 받은 userid가 같은 정보만 보내짐
        
      console.log('✓행꾸 행성 리스트 보내주기 완료');
      res.send(jsonObject);
  
   })  
   .catch((err) => {
    jsonObject = new Object();
    
    jsonObject.result_planet_storage ="no";

    console.log('✗행꾸 행성 리스트 보내주기 실패');
    res.status(500).json(jsonObject);
  });
   
  })  
  
});

//이거 필요 없음^^
//선택한 행성이 메인에 적용된 상태인지 확인
router.post('/isMain', function(req, res, next){
  Planet.findOne({
    where: {userid: req.body.planet.userid}
  }).then(planet => {
    //아이디 있을 때
    if(planet !=null){  
      if(main.planet == req.body.planet.planet_name){
        console.log('✓메인에 적용된 행성');
        res.send({
          "result_planet_isMain" : "ok"
        })
      }
      else{
        console.log('✗메인에 적용 안된 행성');
        res.send({
          "result_planet_isMain" : "no"
        })
      }
      
    }
  
  })
});

//메인에 행성 적용하기
router.post('/apply', function(req, res, next){
  Planet.findOne({
    where: {userid: req.body.planet.userid}
  }).then(planet => {
    //아이디 있을 때
    if(planet !=null){  
      Main.findOne({
        where: {userid: req.body.main.userid}
      }).then(main => {
        if(main !=null){
          if(main.planet == "default"){
            Main.update({ 
              planet: req.body.main.planet_name
             }, { 
               where: { userid: req.body.main.userid} 
             });
            console.log('✓메인 행성 적용 완료');
            res.send({
              "result_planet_apply" : "ok"
            })
          }
          else{
            console.log('✗메인 행성이 디폴트가 아님');
            res.send({
              "result_planet_apply" : "no"
            })
          }
        }
      })
      
      
    }
  
  })
});

//메인 행성 해제하기
router.post('/delete', function(req, res, next){
  Main.findOne({
    where: {userid: req.body.main.userid}
  }).then(main => {
    if(main !=null){
      Main.update({ 
        planet: "default"
       }, { 
         where: { userid: req.body.main.userid} 
       });
      console.log('✓메인 행성 해제 완료');
      res.send({
        "result_planet_delete" : "ok"
      })
    
    }
  })
   

});

//행성 되팔기
router.post('/sell', function(req, res, next){
  Main.findOne({
    where: {userid: req.body.main.userid}
  }).then(main => {
    if(main !=null){
      Planet.findOne({
        where: {userid: req.body.planet.userid}
      }). then(planet => {
        if(planet !=null){
          Mem.findOne({
            where: {userid: req.body.mem.userid}
          }).then(mem => {
            if(mem !=null){

              if(main.planet == req.body.planet.planet_name){  //메인에 적용된 행성이면
                if(req.body.planet.payMethod == "cash"){  //현금으로 산 행성
                  var sell_coin = req.body.planet.money - (req.body.planet.money * 0.5);
                  var final_coin = Number(mem.coin) + Number(sell_coin);
                  Mem.update({
                    coin: final_coin
                  }, {
                    where: { userid: req.body.mem.userid} 
                  })
                }
                else{  //키로 산 행성
                  var final_key = Number(mem.key_coin) + Number(req.body.planet.key);
                  Mem.update({
                    key_coin: final_key
                  }, {
                    where: { userid: req.body.mem.userid} 
                  })
                }

                //메인 테이블 행성 디폴트 행성으로 업데이트
                Main.update({
                  planet: "default"
                }, {
                  where: { userid: req.body.main.userid} 
                })
                //행성 테이블에서 삭제
                Planet.destroy({ 
                  where: { userid: req.body.planet.userid,
                           planet_name : req.body.planet.planet_name} 
                 });

                console.log('✓메인에 적용된 행성 되팔기 완료');
                res.send({
                  "result_planet_sell" : "ok"
                })

              }

              else{  //메인에 적용 안된 행성이면
                if(req.body.planet.payMethod == "cash"){  //현금으로 산 행성
                  var sell_coin = req.body.planet.money - (req.body.planet.money * 0.5);
                  var final_coin = Number(mem.coin) + Number(sell_coin);
                  Mem.update({
                    coin: final_coin
                  }, {
                    where: { userid: req.body.mem.userid} 
                  })
                }
                else{  //키로 산 행성
                  var final_key = Number(mem.key_coin) + Number(req.body.planet.key);
                  Mem.update({
                    key_coin: final_key
                  }, {
                    where: { userid: req.body.mem.userid} 
                  })
                }

                //행성 테이블에서 삭제
                Planet.destroy({ 
                  where: { userid: req.body.planet.userid,
                           planet_name : req.body.planet.planet_name} 
                 });

                console.log('✓메인에 적용 안된 행성 되팔기 완료');
                res.send({
                  "result_planet_sell" : "ok"
                })
              }
            }
          })

          


        }
      })

     
    
    }
  })
   

});



//테스트용 main테이블에 필드 만들 때 쓰려고 함
router.post('/plus', function(req, res, next){
  Mem.findOne({
    where: {userid: req.body.mem.userid}
  }).then(mem => {
    //아이디 있을 때
    if(mem !=null){  
      Main.create({ 
        userid: req.body.mem.userid, 
        planet: "cheese", 
        item1: "kiwi", 
        item1_id: "3",
        item1_location: "30, 40",
        item2: "cloud1",
        item2_id: "6",
        item2_location: "32.3, 34.9",
        item3: "cloud1",
        item3_id: "7",
        item3_location: "3.3, 34.9",
        item4: "kiwi",
        item4_id: "1",
        item4_location: "13.3, 3"
      });
  }
  console.log('✓필드 추가 완료.');
  res.send({
    "result_plus": "ok"
  })
    
  })
});













module.exports = router;