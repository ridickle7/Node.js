function outer(a) {
  var b = "test";

  setTimeout(function () {
    alert(a);
    alert(b);
  }, 2000);
}
// 외부 함수에 있는 변수를 내부 함수에서 접근할 수 있다. (생명주기가 끝났어도..)




function makeFunc() {
  var name2 = "Mozilla";
  function displayName() {
    console.log(name2);
  }
  return displayName;
}

var myFunc = makeFunc();
myFunc();   // Mozilla

//  name 변수에 더 이상 접근할 수 없게 될 것으로 예상하는 것이 합리적이다. 
// 하지만 name 값을 뽑아낼 수 있다. (undefined가 안 나온다)

// 자바스크립트의 함수가 클로저를 형성하기 때문이다. 
// 클로저 = 함수(displayName()) + 함수가 선언된 문법적 환경(name2)
// 이 환경은 클로저가 생성된 시점의 범위 내에 있는 모든 지역 변수로 구성된다. 

// 위의 경우, myFunc은 makeFunc이 실행될 때 생성된 displayName 함수의 인스턴스에 대한 참조다. 
// displayName의 인스턴스는 그 변수, name 이 있는 문법적 환경에 대한 참조를 유지한다. (중요)
// 그러므로 myFunc가 호출될 때 그 변수, name은 사용할 수 있는 상태로 남게 되고 "Mozilla" 가 console.log 에 전달된다.