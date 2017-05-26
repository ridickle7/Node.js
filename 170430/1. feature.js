// 구글 크롬의 자바스크립트 엔진(v8) 으로 빌드 된 서버 플랫폼.
// 노드 자체는 웹 서버가 아님 - 직접 작성해주어야 함 (라이브러리를 활용하여)
// (node.js는 일반 javascript 런타임)

// 주된 특징 (아래 페이지로 한 큐에 이해하자)
// http://mohwaproject.tistory.com/entry/Nodejs-%EC%8B%A4%ED%96%89%EC%8A%A4%ED%83%9DExecution-Stack-%EC%9D%B4%EB%B2%A4%ED%8A%B8-%EC%B2%98%EB%A6%AC-%EA%B3%BC%EC%A0%95)
// 1. 비동기 + 이벤트 위주
//    멈추지 않음 (nonblocking I/O)
// 2. 빠른 속도
// 3. 단일 쓰레드 (EventLoop)

// 헷갈리지 말자
// 1. EventLoop는 싱글Thread 기반
// 2. 


// example code
var server = require('http'); 
var fs = require('fs'); 
var url = require('url'); 
var reqUrl = ''; 
server.createServer(function(req, res){ 
    fs.readFile('./nodeHtml.html', encoding='utf-8', function(err, data){ 
        if (err){ 
            throw err; 
        } 
        else{ 
            res.write(data); 
            res.end(); 
        } 
    });
}).listen(3000);


// 3. 실행 스택(Execution Stack) 이벤트 처리 과정

// 1. 노드는 Single Thread를 사용하므로, 실행 스택(Execution Stack)도 하나만 존재한다.(실행 Stack = Event Loop)
// 2. 한번에 하나의 이벤트(Node API에 포함된 각 이벤트)와 관련된 Stack만 추가된다.
//    즉, Event Loop를 통한 서로 간의 간섭(Dead Lock(리소스 병목현상))은 일어나지 않는다.(한번에 하나의 이벤트만 추가되기 때문에..) 
//    "실행 스택 " 최하단 에는 Event Loop를 처리하는 ev_loop()가 존재하며, 계속 실행되고 있다가 이벤트 발생하면 감지 후 필요한 Stack을 실행 스택에 추가시킨다.

// 3.1 "실행스택" 이 추가되는 이벤트를 처리하는 과정
//  1. 첫 번째 사용자가 웹 서버(Node.js로 구현된..)에 index.html을 요청한다.
//  2. 이벤트 루프(Event Loop)는 이를 감지 후 요청 소켓을 읽기 위해 "scket_readble Stack"을 추가한다.(현재 Stack: 1개)
//  3. HTTP 요청을 해석하는 "http_parse Stack"을 추가 하고(현재 Stack: 2개) index.html 파일에 대한 요청이므로 "load('index.html') Stack"을 추가하고(현재 Stack: 3개) index.html 파일 읽기를 요청한다.
//  4. index.html을 읽어 들이는 I/O를 요청했으므로 그로 인해 추가된 Stack 3개(scket_readble Stack, http_parse Stack, load('index.html') Stack)를 추가한 순서대로 제거해 나간다.(모두 제거되면 실행스택은 이벤트 루프만 돌고 있는 대기 상태에 있게 된다.)
//  
//  *** 아직까지는 첫 번째 사용자가 요청한 index.html의 응답을 보내기 위해 파일 I/O를 요청만 완료된 상태이며, 응답을 기다리는 중이다.!!!! ***
//
//  5. 이 상태(상황)에서 메모리상에 존재하는 두번째 사용자의 index.html 요청이 들어온다.
//  6. 두 번째 요청 또한, 첫 사용자와 동일한 과정을 거쳐 실행 스택에 해당 Stack(각 이벤트에 대한 Stack 3개)들을 추가 시켜 나간다.
//  7. "두 번쨰 요청을 처리하는 중!!" 첫 번째 사용자 요청인 index.html 파일을 읽는 I/O 처리가 완료되었다.!!!!
//  "해당 이벤트가 발생했지만 현재 두 번째 "요청에 대한 Stack이 존재"하므로 바로 처리되지 않고 이벤트를 대기 시킨다.
//      설명: 
//      Non-Blocking I/O 방식은 요청 이벤트를 blocking 하지 않는다.
//      즉, 두 번째 요청에 대한 Stack이 모두 제거(추가된 순서대로...)돼야 이벤트 루프는 다음 이벤트를 처리해 나간다.
//  8. 대기 중이던 첫 번째 사용자 요청에 대한 응답(로드된 index.html 파일 읽기 이벤트)을 처리하기 위해 "file_loaded() Stack"을 추가(현재 Stack: 1개)해 I/O가 돌려준 index.html 파일을 받는다.
//  9. 첫 번째 요청에 응답하기 위해 "http_respond Stack"을 추가 후(현재 Stack: 2) 사용자에게 받은 index.html 파일로 응답을 생성해 사용자에게 응답을 보낸다.
//  10. 응답이 완료됐으며, 그에 따라 첫 번째 사용자의 응답을 위해 추가된 모든 Stack은 모두 순차적(추가된 순서)으로 제거된다.
//  11. 두 번째 사용자 또한 이 과정을 통해 해당 사용자 응답을 보낸 후 스택에서 제거된다.
//      단 비동기 방식(이벤트 방식)은 응답에 대한 순서를 보장하지 않는다. 
//      즉, 요청은 순차적으로 이루어지나, 그에 대한 응답은 순서를 보장하지 않는다는 뜻이다.

// 참고
// 1.[무하프로젝트] 
// http://mohwaproject.tistory.com/entry/Nodejs-실행스택Execution-Stack-이벤트-처리-과정
// 2.[NodeJSㅇ와 비동기]
// https://qkraudghgh.github.io/node/2016/10/23/node-async.html