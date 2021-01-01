var express = require('express');
var Mem = require('../models').Mem;
var Bank = require('../models').Bank;
var Main = require('../models').Main;
var Reward = require('../models').Reward;
var Planet = require('../models').Planet;
var Item = require('../models').Item;
var router = express.Router();

//아이템 구매
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
            "result_item_buy_storage": "no"
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
              console.log('✗아이템 현금이 모자랍니다.');
              res.send({
                "result_item_buy": "no"
              })
            } 
            else{
              Mem.update({ 
                coin: final_coin
              }, { 
                where: { userid: req.body.mem.userid} 
              });
              
              Item.create({ 
                userid: req.body.buy.userid, 
                item_name: req.body.buy.item_name
              });
              console.log('✓아이템 현금 결제 완료.');
              res.send({
                "result_item_buy": "yes"
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
                
                Item.create({ 
                  userid: req.body.buy.userid, 
                  item_name: req.body.buy.item_name
                });
                console.log('✓아이템 카드 결제 완료.');
                res.send({
                "result_item_buy": "yes"
              })
              }
            })
           }

           else if(req.body.buy.payMethod == 'key'){

            var final_key = mem.key_coin - req.body.buy.key;
            Mem.update({ 
              key_coin: final_key
            }, { 
              where: { userid: req.body.mem.userid} 
            });
            Item.create({ 
              userid: req.body.buy.userid, 
              item_name: req.body.buy.item_name
            });
            console.log('✓아이템 키 결제 완료.');
            res.send({
            "result_item_buy": "yes"
            })
              
            
           }
            
          }
        })
      }
    
    })
  })
   
});

//보관함에 어떤 아이템 들어있는지 보내주기
//아이템 이름만 빼서 보내는 방법 더 생각해보기
router.post('/storage', function(req, res, next) {
  //json 배열 사용
  Item.findAll()
  .then((item) => {

    Item.findAll({
      where:{userid: req.body.item.userid}
    }).then(result => {
      jsonObject = new Object();
    
      jsonObject.result_item_storage ="ok";
      //jsonObject.items = item;  //item 테이블에 있는 정보 다 보내짐
      jsonObject.userid = result;  //item 테이블 중 통신 받은 userid가 같은 정보만 보내짐
        
      console.log('✓행꾸 아이템 리스트 보내주기 완료');
      res.send(jsonObject);
  
   })  
    .catch((err) => {
      jsonObject = new Object();
    
      jsonObject.result_item_storage ="no";

      console.log('✗행꾸 아이템 리스트 보내주기 실패');
      res.status(500).json(jsonObject);
  });
   
  })  
  
  
});

//메인에 아이템 적용하기
router.post('/apply', function(req, res, next){
  //main 테이블에서 아이템 개수 확인 > 어케 하지?
  //item1~5가 채워져있는지 확인 > 빈 곳에 넣기
 Main.findOne({
   where: {userid: req.body.main.userid}
 }).then(main => {
   if(main !=null){  //아이디 있을 때
     
     if(main.item1 == 0 || main.item1 == null){  //item1에 아이템이 적용되어 있지 않을 때
       Main.update({ 
         item1: req.body.main.item,
         item1_id: req.body.main.item_id,
         item1_location: req.body.main.item_location
        }, { 
          where: { userid: req.body.main.userid} 
        });
       
       Item.findOne({
         where: {userid: req.body.item.userid,
                 id: req.body.main.item_id}    //메인 아이템의 아이디랑 아이템 테이블의 아이디가 같은지 체크 되나?
       }).then(item => {
         if(item !=null){
           //메인에 적용 됐다고 바꿔주기 > 이거 필요 없으면 이 필드 자체를 삭제해도 됨
           Item.update({
             is_main: "1"
           }, {
             where: {userid: req.body.item.userid,
                     id: req.body.main.item_id}
           });
         }
       })
        
       console.log('✓아이템1 적용 완료');
       res.send({
         "result_item_apply" : "ok"
       })

     }

     else if(main.item2 == 0 || main.item2 == null){  //item2에 아이템이 적용되어 있지 않을 때
       Main.update({ 
         item2: req.body.main.item,
         item2_id: req.body.main.item_id,
         item2_location: req.body.main.item_location
        }, { 
          where: { userid: req.body.main.userid} 
        });

        Item.findOne({
         where: {userid: req.body.item.userid,
                 id: req.body.main.item_id}    //메인 아이템의 아이디랑 아이템 테이블의 아이디가 같은지 체크 되나?
       }).then(item => {
         if(item !=null){
           //메인에 적용 됐다고 바꿔주기 > 이거 필요 없으면 이 필드 자체를 삭제해도 됨
           Item.update({
             is_main: "1"
           }, {
             where: {userid: req.body.item.userid,
                     id: req.body.main.item_id}
           });
         }
       })

       console.log('✓아이템2 적용 완료');
       res.send({
         "result_item_apply" : "ok"
       })
     }

     else if(main.item3 == 0 || main.item3 == null){  //item3에 아이템이 적용되어 있지 않을 때
       Main.update({ 
         item3: req.body.main.item,
         item3_id: req.body.main.item_id,
         item3_location: req.body.main.item_location
        }, { 
          where: { userid: req.body.main.userid} 
        });

       Item.findOne({
         where: {userid: req.body.item.userid,
                 id: req.body.main.item_id}    //메인 아이템의 아이디랑 아이템 테이블의 아이디가 같은지 체크 되나?
       }).then(item => {
         if(item !=null){
           //메인에 적용 됐다고 바꿔주기 > 이거 필요 없으면 이 필드 자체를 삭제해도 됨
           Item.update({
             is_main: "1"
           }, {
             where: {userid: req.body.item.userid,
                     id: req.body.main.item_id}
           });
         }
       })

       console.log('✓아이템3 적용 완료');
       res.send({
         "result_item_apply" : "ok"
       })
     }

     else if(main.item4 == 0 || main.item4 == null){  //item4에 아이템이 적용되어 있지 않을 때
       Main.update({ 
         item4: req.body.main.item,
         item4_id: req.body.main.item_id,
         item4_location: req.body.main.item_location
        }, { 
          where: { userid: req.body.main.userid} 
        });

        Item.findOne({
         where: {userid: req.body.item.userid,
                 id: req.body.main.item_id}    //메인 아이템의 아이디랑 아이템 테이블의 아이디가 같은지 체크 되나?
       }).then(item => {
         if(item !=null){
           //메인에 적용 됐다고 바꿔주기 > 이거 필요 없으면 이 필드 자체를 삭제해도 됨
           Item.update({
             is_main: "1"
           }, {
             where: {userid: req.body.item.userid,
                     id: req.body.main.item_id}
           });
         }
       })

       console.log('✓아이템4 적용 완료');
       res.send({
         "result_item_apply" : "ok"
       })
     }

     else if(main.item5 == 0 || main.item5 == null){  //item5에 아이템이 적용되어 있지 않을 때
       Main.update({ 
         item5: req.body.main.item,
         item5_id: req.body.main.item_id,
         item5_location: req.body.main.item_location
        }, { 
          where: { userid: req.body.main.userid} 
        });

        Item.findOne({
         where: {userid: req.body.item.userid,
                 id: req.body.main.item_id}    //메인 아이템의 아이디랑 아이템 테이블의 아이디가 같은지 체크 되나?
       }).then(item => {
         if(item !=null){
           //메인에 적용 됐다고 바꿔주기 > 이거 필요 없으면 이 필드 자체를 삭제해도 됨
           Item.update({
             is_main: "1"
           }, {
             where: {userid: req.body.item.userid,
                     id: req.body.main.item_id}
           });
         }
       })

       console.log('✓아이템5 적용 완료');
       res.send({
         "result_item_apply" : "ok"
       })
     }

     else{  //이게 item1~5가 다 비워져있을 때로 잡는게 맞나? 확인 필요
       console.log('✗아이템 다 참');
       res.send({
         "result_item_apply" : "no"
       })
     }
   }
 
 })
   

});

//메인 아이템 해제하기
router.post('/delete', function(req, res, next){
  Main.findOne({
    where: {userid: req.body.main.userid}
  }).then(main => {
    if(main !=null){
      //아이디랑 아이템 이름 받아서 지우기
      if(req.body.main.itemNo == "item1"){
        Main.update({ 
          item1: "",
          item1_id : "",
          item1_location: ""
         }, { 
           where: { userid: req.body.main.userid} 
         });
         
        
         Item.findOne({
          where: {userid: req.body.item.userid,
                  id: req.body.main.item1_id}    //메인 아이템1의 아이디랑 아이템 테이블의 아이디가 같은지 체크 되나?
        }).then(item => {
          if(item !=null){
            //메인에 적용 안됐다고 바꿔주기 > 이거 필요 없으면 이 필드 자체를 삭제해도 됨
            Item.update({
              is_main: "0"
            }, {
              where: {userid: req.body.item.userid,
                      id: req.body.main.item1_id}
            });
          }
        })

      }

      else if(req.body.main.itemNo == "item2"){
        Main.update({ 
          item2: "",
          item2_id : "",
          item2_location: ""
         }, { 
           where: { userid: req.body.main.userid} 
         });

         Item.findOne({
          where: {userid: req.body.item.userid,
                  id: req.body.main.item2_id}    //메인 아이템1의 아이디랑 아이템 테이블의 아이디가 같은지 체크 되나?
        }).then(item => {
          if(item !=null){
            //메인에 적용 안됐다고 바꿔주기 > 이거 필요 없으면 이 필드 자체를 삭제해도 됨
            Item.update({
              is_main: "0"
            }, {
              where: {userid: req.body.item.userid,
                      id: req.body.main.item2_id}
            });
          }
        })

      }

      else if(req.body.main.itemNo == "item3"){
        Main.update({ 
          item3: "",
          item3_id : "",
          item3_location: ""
         }, { 
           where: { userid: req.body.main.userid} 
         });

         Item.findOne({
          where: {userid: req.body.item.userid,
                  id: req.body.main.item3_id}    //메인 아이템1의 아이디랑 아이템 테이블의 아이디가 같은지 체크 되나?
        }).then(item => {
          if(item !=null){
            //메인에 적용 안됐다고 바꿔주기 > 이거 필요 없으면 이 필드 자체를 삭제해도 됨
            Item.update({
              is_main: "0"
            }, {
              where: {userid: req.body.item.userid,
                      id: req.body.main.item3_id}
            });
          }
        })

      }

      else if(req.body.main.itemNo == "item4"){
        Main.update({ 
          item4: "",
          item4_id : "",
          item4_location: ""
         }, { 
           where: { userid: req.body.main.userid} 
         });

         Item.findOne({
          where: {userid: req.body.item.userid,
                  id: req.body.main.item4_id}    //메인 아이템1의 아이디랑 아이템 테이블의 아이디가 같은지 체크 되나?
        }).then(item => {
          if(item !=null){
            //메인에 적용 안됐다고 바꿔주기 > 이거 필요 없으면 이 필드 자체를 삭제해도 됨
            Item.update({
              is_main: "0"
            }, {
              where: {userid: req.body.item.userid,
                      id: req.body.main.item4_id}
            });
          }
        })

      }

      else if(req.body.main.itemNo == "item5"){
        Main.update({ 
          item5: "",
          item5_id : "",
          item5_location: ""
         }, { 
           where: { userid: req.body.main.userid} 
         });

         Item.findOne({
          where: {userid: req.body.item.userid,
                  id: req.body.main.item5_id}    //메인 아이템1의 아이디랑 아이템 테이블의 아이디가 같은지 체크 되나?
        }).then(item => {
          if(item !=null){
            //메인에 적용 안됐다고 바꿔주기 > 이거 필요 없으면 이 필드 자체를 삭제해도 됨
            Item.update({
              is_main: "0"
            }, {
              where: {userid: req.body.item.userid,
                      id: req.body.main.item5_id}
            });
          }
        })

      }

      console.log('✓메인 아이템 해제 완료');
      res.send({
        "result_item_delete" : "ok"
      })
      
    }
  })
   

});

//아이템 되팔기
router.post('/sell', function(req, res, next){
  Main.findOne({
    where: {userid: req.body.main.userid}
  }).then(main => {
    if(main !=null){
      Item.findOne({
        where: {userid: req.body.item.userid}
      }). then(item => {
        if(item !=null){
          Mem.findOne({
            where: {userid: req.body.mem.userid}
          }).then(mem => {
            if(mem !=null){
              //item1~5에 적용된 행성인지 판단 필요
              if(main.item1_id == req.body.item.item_id || main.item2_id == req.body.item.item_id
                 || main.item3_id == req.body.item.item_id || main.item4_id == req.body.item.item_id 
                 || main.item5_id == req.body.item.item_id){  //메인에 적용된 아이템이면
               
                if(req.body.item.payMethod == "cash"){  //현금으로 산 아이템
                  var sell_coin = req.body.item.money - (req.body.item.money * 0.5);
                  var final_coin = Number(mem.coin) + Number(sell_coin);
                  Mem.update({
                    coin: final_coin
                  }, {
                    where: { userid: req.body.mem.userid} 
                  })

                  if(req.body.item.itemNo == "item1"){  //item1을 파는거면
                    //메인 테이블 아이템 0으로 업데이트
                    Main.update({
                      item1: "",
                      item1_id: "",
                      item1_location: ""
                    }, {
                    where: { userid: req.body.main.userid} 
                    })
                  }
                  else if(req.body.item.itemNo == "item2"){  //item2를 파는거면
                    //메인 테이블 아이템 0으로 업데이트
                    Main.update({
                      item2: "",
                      item2_id: "",
                      item2_location: ""
                    }, {
                    where: { userid: req.body.main.userid} 
                    })
                  }
                  else if(req.body.item.itemNo == "item3"){  //item3을 파는거면
                    //메인 테이블 아이템 0으로 업데이트
                    Main.update({
                      item3: "",
                      item3_id: "",
                      item3_location: ""
                    }, {
                    where: { userid: req.body.main.userid} 
                    })
                  }
                  else if(req.body.item.itemNo == "item4"){  //item4를 파는거면
                    //메인 테이블 아이템 0으로 업데이트
                    Main.update({
                      item4: "",
                      item4_id: "",
                      item4_location: ""
                    }, {
                    where: { userid: req.body.main.userid} 
                    })
                  }
                  else if(req.body.item.itemNo == "item5"){  //item5를 파는거면
                    //메인 테이블 아이템 0으로 업데이트
                    Main.update({
                      item5: "",
                      item5_id: "",
                      item5_location: ""
                    }, {
                    where: { userid: req.body.main.userid} 
                    })
                  }

                }  //end cash

                else{  //키로 산 아이템
                  var final_key = Number(mem.key_coin) + Number(req.body.item.key);
                  Mem.update({
                    key_coin: final_key
                  }, {
                    where: { userid: req.body.mem.userid} 
                  })

                  if(req.body.item.itemNo == "item1"){  //item1을 파는거면
                    //메인 테이블 아이템 0으로 업데이트
                    Main.update({
                      item1: "",
                      item1_id: "",
                      item1_location: ""
                    }, {
                    where: { userid: req.body.main.userid} 
                    })
                  }
                  else if(req.body.item.itemNo == "item2"){  //item2를 파는거면
                    //메인 테이블 아이템 0으로 업데이트
                    Main.update({
                      item2: "",
                      item2_id: "",
                      item2_location: ""
                    }, {
                    where: { userid: req.body.main.userid} 
                    })
                  }
                  else if(req.body.item.itemNo == "item3"){  //item3을 파는거면
                    //메인 테이블 아이템 0으로 업데이트
                    Main.update({
                      item3: "",
                      item3_id: "",
                      item3_location: ""
                    }, {
                    where: { userid: req.body.main.userid} 
                    })
                  }
                  else if(req.body.item.itemNo == "item4"){  //item4를 파는거면
                    //메인 테이블 아이템 0으로 업데이트
                    Main.update({
                      item4: "",
                      item4_id: "",
                      item4_location: ""
                    }, {
                    where: { userid: req.body.main.userid} 
                    })
                  }
                  else if(req.body.item.itemNo == "item5"){  //item5를 파는거면
                    //메인 테이블 아이템 0으로 업데이트
                    Main.update({
                      item5: "",
                      item5_id: "",
                      item5_location: ""
                    }, {
                    where: { userid: req.body.main.userid} 
                    })
                  }

                }  //end key

                
                
                //아이템 테이블에서 삭제
                Item.destroy({ 
                  where: { userid: req.body.item.userid,
                           id : req.body.item.item_id} 
                 });

                console.log('✓메인에 적용된 아이템 되팔기 완료');
                res.send({
                  "result_item_sell" : "ok"
                })

              }  //메인에 적용된 아이템

              else{  //메인에 적용 안된 아이템
                if(req.body.item.payMethod == "cash"){  //현금으로 산 아이템
                  var sell_coin = req.body.item.money - (req.body.item.money * 0.5);
                  var final_coin = Number(mem.coin) + Number(sell_coin);
                  Mem.update({
                    coin: final_coin
                  }, {
                    where: { userid: req.body.mem.userid} 
                  })
                }
                else{  //키로 산 아이템
                  var final_key = Number(mem.key_coin) + Number(req.body.item.key);
                  Mem.update({
                    key_coin: final_key
                  }, {
                    where: { userid: req.body.mem.userid} 
                  })
                }

                //아이템 테이블에서 삭제
                Item.destroy({ 
                  where: { userid: req.body.item.userid,
                           id : req.body.item.item_id} 
                 });

                 console.log('✓메인에 적용 안된 아이템 되팔기 완료');
                 res.send({
                   "result_item_sell" : "ok"
                 })
              }

            }
          })  //mem

          


        }
      })  //item

     
    
    }
  })  //main
   

});

















//이 밑의 코드들이 다 필요 없었다는 사실~

//선택한 아이템이 메인에 적용된 상태인지 확인
/////////////////////////////////하는 중/////////////////////////////////
router.post('/isMain', function(req, res, next){
  Item.findOne({
    where: {userid: req.body.item.userid}
  }).then(item => {
    //아이디 있을 때
    if(item !=null){  

      Main.findOne({
        where: {userid: req.body.main.userid}
      }).then(main => {
        if(main != null){
          //item.id 값을 어떻게 받아오지...?
          if(main.item1 == req.body.item.item_name && main.item1_id == item.id){
            console.log('✓메인에 적용된 아이템');
            res.send({
              "result_item_isMain" : "ok"
            })
          }
          else if(main.item2 == req.body.item.item_name){
            console.log('✓메인에 적용된 아이템');
            res.send({
              "result_item_isMain" : "ok"
            })
          }
          else if(main.item3 == req.body.item.item_name){
            console.log('✓메인에 적용된 아이템');
            res.send({
              "result_item_isMain" : "ok"
            })
          }
          else if(main.item4 == req.body.item.item_name){
            console.log('✓메인에 적용된 아이템');
            res.send({
              "result_item_isMain" : "ok"
            })
          }
          else if(main.item5 == req.body.item.item_name){
            console.log('✓메인에 적용된 아이템');
            res.send({
              "result_item_isMain" : "ok"
            })
          }
          else{
            console.log('✗메인에 적용 안된 아이템');
            res.send({
              "result_item_isMain" : "no"
            })
          }
        }
      })



      
      
    }
  
  })
});


//선택한 아이템이 메인에 적용된 상태인지 확인
/////////////////////////////////테스트 하는 중/////////////////////////////////
router.post('/isMainTest', function(req, res, next){
  Item.findOne({
    where: {userid: req.body.item.userid}
  }).then(item => {
    //아이디 있을 때
    if(item !=null){  

      Main.findOne({  //여기서부터 끝나버림.. 왜..?
        where: {userid: req.body.main.userid}
      }).then(main => {
        if(main !=null){
          if(main.item1 == req.body.item.item_name && main.item1_id == req.body.item.id){
            console.log('✓메인에 적용된 아이템');
            res.send({
              "result_item_isMain" : "ok"
            })
          }
          else if(main.item2 == req.body.item.item_name && main.item2_id == req.body.item.id){
            console.log('✓메인에 적용된 아이템');
            res.send({
              "result_item_isMain" : "ok"
            })
          }
          else if(main.item3 == req.body.item.item_name && main.item3_id == req.body.item.id){
            console.log('✓메인에 적용된 아이템');
            res.send({
              "result_item_isMain" : "ok"
            })
          }
          else if(main.item4 == req.body.item.item_name && main.item4_id == req.body.item.id){
            console.log('✓메인에 적용된 아이템');
            res.send({
              "result_item_isMain" : "ok"
            })
          }
          else if(main.item5 == req.body.item.item_name && main.item5_id == req.body.item.id){
            console.log('✓메인에 적용된 아이템');
            res.send({
              "result_item_isMain" : "ok"
            })
          }
          else{
            console.log('✗메인에 적용 안된 아이템');
            res.send({
              "result_item_isMain" : "no"
            })
          }
        }
      })



      
      
    }
  
  })
});

router.post('/isMainTest2', function(req, res, next){
  try {
    Item.findOne({
      where: {userid: req.body.item.userid}
    }).then(item => {
      //아이디 있을 때
      if(item !=null){  
  
        Main.findOne({  //여기서부터 끝나버림.. 왜..?
          where: {userid: req.body.main.userid}
        }).then(main => {
          if(main !=null){
            if(main.item1 == req.body.item.item_name && main.item1_id == req.body.item.id){
              console.log('✓메인에 적용된 아이템');
              res.send({
                "result_item_isMain" : "ok"
              })
            }
            else if(main.item2 == req.body.item.item_name && main.item2_id == req.body.item.id){
              console.log('✓메인에 적용된 아이템');
              res.send({
                "result_item_isMain" : "ok"
              })
            }
            else if(main.item3 == req.body.item.item_name && main.item3_id == req.body.item.id){
              console.log('✓메인에 적용된 아이템');
              res.send({
                "result_item_isMain" : "ok"
              })
            }
            else if(main.item4 == req.body.item.item_name && main.item4_id == req.body.item.id){
              console.log('✓메인에 적용된 아이템');
              res.send({
                "result_item_isMain" : "ok"
              })
            }
            else if(main.item5 == req.body.item.item_name && main.item5_id == req.body.item.id){
              console.log('✓메인에 적용된 아이템');
              res.send({
                "result_item_isMain" : "ok"
              })
            }
            else{
              console.log('✗메인에 적용 안된 아이템');
              res.send({
                "result_item_isMain" : "no"
              })
            }
          }
        })
  
  
  
        
        
      }
    
    })
  } catch (error) {
    logMyErrors(e);
    console.log(error);
  }
  
});

module.exports = router;