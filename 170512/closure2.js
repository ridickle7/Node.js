function makeAdder(x) {
  return function(y) {
    return x + y;
  };
}

var add5 = makeAdder(5);
var add10 = makeAdder(10);

console.log(add5(2));  // 7
console.log(add10(2)); // 12

// x라는 문법적 환경 정보가 살아남는다.

// add5와 add10은 둘 다 클로저다. 
// 이들은 같은 함수 본문 정의를 공유하지만 서로 다른 문법적 환경을 저장한다. 
// add5의 환경에서 x는 5이지만 add10의 환경에서 x는 10이다.