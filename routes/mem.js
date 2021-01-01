var express = require('express');
var Mem = require('../models').Mem;
var Bank = require('../models').Bank;
var Item = require('../models').Item;
var Planet = require('../models').Planet;
var Main = require('../models').Main;
var Reward = require('../models').Reward;
var socketio = require('socket.io');
// var io = socketio.listen('andamiro-was:server');
// var io = socketio.listen(server);
var io = require("socket.io").listen(999);
var router = express.Router();

//통신 테스트
router.post('/test', function(req, res, next) {
  console.log('✓통신 테스트');
  res.send({
    "result_test": "ok"
  })
});

//아이디 중복 확인(안드 중복 확인 버튼 클릭)
router.post('/idcheck', function(req, res, next) {
  Mem.findOne({
    where: {userid: req.body.mem.userid}
  }).then(mem => {
    if(mem !=null){  //중복된 아이디 있을 때
      console.log('✗아이디 중복'); 
      res.send({
        "result_mem_idcheck": "no"
      })
    }else{  //중복된 아이디 없을 때
      console.log('✓아이디 중복 안됨');
      res.send({
        "result_mem_idcheck": "ok"
      })
    }
  })
});

//회원 가입(안드 회원 가입 버튼 클릭)
router.post('/signup', function(req, res, next) {
  Mem.create({ 
    userid: req.body.mem.userid, 
    pswd: req.body.mem.pswd, 
    email: req.body.mem.email,
    credit: req.body.mem.credit, 
    coin: req.body.mem.coin,
    key_coin: req.body.mem.key_coin
  });
  //모든 테이블에 아이디 만들어주기
  // Item.create({
  //   userid: req.body.mem.userid
  // });
  Reward.create({
    userid: req.body.mem.userid
  });
  Main.create({
    userid: req.body.mem.userid,
    planet: "default"
  });
  Planet.create({
    userid: req.body.mem.userid,
    planet_name: "default"
  });
  console.log('✓가입 성공');
  res.send({
  "result_mem_signup": "ok"
  })
});

//로그인(로그인 버튼 클릭)
router.post('/login', function(req, res, next){
  //아이디가 db에 있는지 확인
  Mem.findOne({
    where: {userid: req.body.mem.userid}
  }).then(mem => {
    //아이디 있을 때
    if(mem !=null){  
      console.log('✓가입된 아이디 입니다.'); 
      //비밀번호 일치 여부 확인
      if(req.body.mem.pswd == mem.pswd){  //패스워드 일치 할 때
        console.log('✓비밀번호가 일치합니다.');
          res.send({
            "result_mem_login": "ok",
            //메인에 뿌릴 사용자 정보 보내기
            // "credit": mem.credit,
            // "coin": mem.coin,
            // "key_coin": mem.key_coin
            //"planet": req.body.main_planet.planet  /*******/
          })
      }
      else{
        //비밀번호 불일치 할 때
        console.log('✗비밀번호가 일치하지 않습니다.');
        res.send({
          "result_mem_login_pswd": "no"
      })
    }
  }
    //아이디 없을 때
    else{  
      console.log('✗가입되지 않은 아이디 입니다.');
      res.send({
        "result_mem_login": "no"
      })
    }
  })
});

//오늘의 퀴즈 정답(정답 버튼 클릭)
router.post('/quizRight', function(req, res, next) {
  //findOne으로 찾아서 +1하고 update하기
  Mem.findOne({
    where: {userid: req.body.mem.userid}
  }).then(mem => {
    if(mem !=null){  //아이디 찾았을 때
      var new_key_coin = mem.key_coin + 1;  //1씩 증가(findOne 했으니 mem에 값이 들어와있다.)
      Mem.update({ 
        key_coin: new_key_coin 
       }, { 
         where: { userid: req.body.mem.userid} 
       });
      console.log('✓오늘의 퀴즈 정답 보상 제공');
      res.send({
      "result_mem_quizRight": "ok"
      })
    }
  })
});

//신용 등급 계산(돈 나가고 들어올 때마다)
router.post('/credit', function(req, res, next){
  Mem.findOne({
    where: {userid: req.body.mem.userid}
  }).then(mem => {
    if(mem !=null){  //아이디 찾았을 때
      if(mem.coin <= 10000){
        Mem.update({ 
          credit: 5,
          coin : mem.coin
         }, { 
           where: { userid: req.body.mem.userid} 
         });
      }
      if(mem.coin <= 100000 && mem.coin >= 10001){
        Mem.update({ 
          credit: 4,
          coin : mem.coin
         }, { 
           where: { userid: req.body.mem.userid} 
         });
      }
      if(mem.coin <= 1000000 && mem.coin >= 100001){
        Mem.update({ 
          credit: 3,
          coin : mem.coin
         }, { 
           where: { userid: req.body.mem.userid} 
         });
      }
      if(mem.coin <= 5000000 && mem.coin >= 1000001){
        Mem.update({ 
          credit: 2,
          coin : mem.coin
         }, { 
           where: { userid: req.body.mem.userid} 
         });
      }
      if(mem.coin <= 10000000 && mem.coin >= 5000001){
        Mem.update({ 
          credit: 1,
          coin : mem.coin
         }, { 
           where: { userid: req.body.mem.userid} 
         });
      }
      console.log('✓신용 등급 변경 완료');
      res.send({
      "result_mem_credit": "ok"
      })
    }
  })
});

//신용 등급 계산(돈 나가고 들어올 때마다) > 신용 등급 업적도 같이 체크 테스트
router.post('/creditTest', function(req, res, next){
  Mem.findOne({
    where: {userid: req.body.mem.userid}
  }).then(mem => {
    if(mem !=null){  //아이디 찾았을 때
      if(mem.coin <= 10000){
        Mem.update({ 
          credit: 5,
          coin : mem.coin
         }, { 
           where: { userid: req.body.mem.userid} 
         });
        Reward.update({
          c5: true
        }, {
          where: {userid: req.body.reward.userid}
        });
      }
      if(mem.coin <= 100000 && mem.coin >= 10001){
        Mem.update({ 
          credit: 4,
          coin : mem.coin
         }, { 
           where: { userid: req.body.mem.userid} 
         });
        Reward.update({
          c4: true
        }, {
          where: {userid: req.body.reward.userid}
        });
      }
      if(mem.coin <= 1000000 && mem.coin >= 100001){
        Mem.update({ 
          credit: 3,
          coin : mem.coin
         }, { 
           where: { userid: req.body.mem.userid} 
         });
        Reward.update({
          c3: true
        }, {
          where: {userid: req.body.reward.userid}
        });
      }
      if(mem.coin <= 5000000 && mem.coin >= 1000001){
        Mem.update({ 
          credit: 2,
          coin : mem.coin
         }, { 
           where: { userid: req.body.mem.userid} 
         });
        Reward.update({
          c2: true
        }, {
          where: {userid: req.body.reward.userid}
        });
      }
      if(mem.coin <= 10000000000 && mem.coin >= 5000001){
        Mem.update({ 
          credit: 1,
          coin : mem.coin
         }, { 
           where: { userid: req.body.mem.userid} 
         });
        Reward.update({
          c1: true
        }, {
          where: {userid: req.body.reward.userid}
        });
      }
      console.log('✓신용 등급 변경 완료');
      console.log('✓신용 등급 업적 체크 완료');
      res.send({
      "result_mem_credit": "ok"
      })
    }
  })
});

//알바비 계산
router.post('/game', function(req, res, next){
  Mem.findOne({
    where: {userid: req.body.mem.userid}
  }).then(mem => {
    if(mem !=null){  //아이디 찾았을 때
      var new_coin = Number(mem.coin) + Number(req.body.mem.game_money);

      Mem.update({ 
        coin: new_coin 
       }, { 
         where: { userid: req.body.mem.userid} 
       });
      console.log('✓알바비 제공');
      res.send({
      "result_mem_game": "ok"
      })
    }
  })
});

//탈퇴
router.post('/signout', function(req, res, next) {
  Mem.destroy({ 
    where: { userid: req.body.mem.userid } 
   });

   Bank.destroy({ 
    where: { userid: req.body.mem.userid } 
   });

   Reward.destroy({ 
    where: { userid: req.body.mem.userid } 
   });

   Main.destroy({ 
    where: { userid: req.body.mem.userid } 
   });

   Planet.destroy({ 
    where: { userid: req.body.mem.userid } 
   });

   Item.destroy({ 
    where: { userid: req.body.mem.userid } 
   });

  console.log('✓탈퇴 성공');
  res.send({
  "result_mem_signout": "ok"
  })
});

//비밀번호 찾기
router.post('/findPW', function(req, res, next) {
  Mem.findOne({
    where: {userid: req.body.mem.userid}
  }).then(mem => {
    if(mem !=null){  //아이디 있을 때

      console.log('✓존재하는 아이디');

      if(req.body.mem.email == mem.email){
        console.log('✓이메일 정보 일치');
        res.send({
          "result_mem_findPW": "ok",
          "pswd": mem.pswd
        })
      }

      else{
        console.log('✗이메일 정보 불일치');
        res.send({
          "result_mem_findPW_email": "no"
        })
      }
      
    }else{  //아이디 없을 때
      console.log('✗존재하지 않는 아이디'); 
      res.send({
        "result_mem_findPW": "no",
      })
    }
  })
});

//프런트 갱신(메인 아직 안만들어서 대신 쓰는 거)
router.post('/front', function(req, res, next){
  Mem.findOne({
    where: {userid: req.body.mem.userid}
  }).then(mem => {
    //아이디 있을 때
    if(mem !=null){  
      console.log('✓프런트 갱신용 코드 전달 완료.');
      res.send({
        "result_mem_front": "ok",
        //메인에 뿌릴 사용자 정보 보내기
        "credit": mem.credit,
        "coin": mem.coin,
        "key_coin": mem.key_coin
        //"planet": req.body.main_planet.planet  /*******/
          })
      }
      
  })
});



/////////////////////알바비 계산(소켓 통신)/////////////////////
//'connection' 메시지를 전달 받았을 때: 클라이언트가 서버로 접속을 했을 때
//자바스크립트 클로저 활용
// var io = socketio.listen(server);

io.sockets.on('connection', function(socket){
  console.log('socket access');
  
  app.post('/gameSocket', function(req, res, next){  //app.post로 써야 하는지 / router.post로 써야 하는지
    // 접속한 클라이언트의 IP 주소를 따 오기 위한 변수. 출력은 "::ffff:127.0.0.1"의 형태가 되며
    // 불필요한 문자열을 함께 제거한다.
    var ClientAddress = socket.conn.remoteAddress;
    ClientAddress = ClientAddress.replace("::ffff:", "");
  
    // 클라이언트가 접속한 즉시 서버에서 로그를 출력 (접속 클라이언트 정보)
    console.log("[Server Log] Client Connected ... IP: " + ClientAddress);

    // 'SendMessageByUnity' 메시지를 전달 받았을 때 서버의 처리 부분
  // 해당 메시지는 테스트용 유니티 클라이언트에서 버튼을 클릭했을 때 전달되도록 한다.
  socket.on('SendMessageByUnity', function(data){
    console.log("[Client Message:" + ClientAddress + "] Click!");
    // console.log("Recieved DATA :" + mem.id);
    Mem.findOne({
      where: {userid: req.body.mem.userid}
    }).then(mem => {
      if(mem !=null){  //아이디 찾았을 때
        var new_coin = Number(mem.coin) + Number(req.body.mem.game_money);
  
        Mem.update({ 
          coin: new_coin 
        }, { 
          where: { userid: req.body.mem.userid} 
        });
         console.log('✓알바비 제공');
         var msg = { result_mem_game : "ok"};
         socket.emit('SendMessageByNode', msg);
       
      }
    })

    
  });

    
  });

 
  app.post('/gameSocket2', function(req, res, next){
  // 'SendMessageByUnity' 메시지를 전달 받았을 때 서버의 처리 부분
  // 해당 메시지는 테스트용 유니티 클라이언트에서 버튼을 클릭했을 때 전달되도록 한다.
  socket.on('SendMessageByUnity', function(data){
    console.log("Client -> Button Click!");

    //유니티에서 받은 제이슨 데이터를 가지고 원래 하던 증가 코드 그대로 쓰기
    Mem.findOne({
      where: {userid: req.body.mem.userid}
    }).then(mem => {
      if(mem !=null){  //아이디 찾았을 때
        var new_coin = Number(mem.coin) + Number(req.body.mem.game_money);
  
        Mem.update({ 
          coin: new_coin 
         }, { 
           where: { userid: req.body.mem.userid} 
         });
         console.log('✓알바비 제공');
         var msg = { result_mem_game : "ok"};
         socket.emit('SendMessageByNode', msg);
       
      }
    })

    
  });

    
  });
  
  
  // 클라이언트의 접속이 끊어졌을 때 서버가 처리할 부분.
  socket.on('disconnect', function() {
      console.log("[Server Log] Client Disconnected ... ");
  });
});


module.exports = router;