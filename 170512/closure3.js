var counter = (function() {
  var privateCounter = 0;
  function changeBy(val) {
    privateCounter += val;
  }
  return {
    increment: function() {
      changeBy(1);
    },
    decrement: function() {
      changeBy(-1);
    },
    value: function() {
      return privateCounter;
    }
  };   
})();

var makeCounter = function() {
  var privateCounter = 0;
  function changeBy(val) {
    privateCounter += val;
  }
  return {
    increment: function() {
      changeBy(1);
    },
    decrement: function() {
      changeBy(-1);
    },
    value: function() {
      return privateCounter;
    }
  }  
};

console.log(counter.value()); // logs 0
counter.increment();
counter.increment();
console.log(counter.value()); // logs 2
counter.decrement();
console.log(counter.value()); // logs 1

// private 변수 : privateCounter, changeBy
// 둘 다 외부에서 직접적으로 익명 함수에 접근할 수 없다. 
// 대신에 익명 래퍼에서 반환된 세 개의 퍼블릭 함수를 통해서만 접근되어야만 한다. (value, increment, decrement)
// 위 3개의 퍼블릭 함수는 같은 환경(counter)을 공유하는 클로저