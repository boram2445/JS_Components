"use strict";

const textTime = document.querySelector('.txt-time')
const minutes = document.querySelector('.minute');
const seconds = document.querySelector('.seconds');
const tenMiillis = document.querySelector('.tenMillis');
const resetBtn = document.querySelector('.btn-reset');
const lapBtn = document.querySelector('.btn-lap');
const startBtn = document.querySelector('.btn-start');
const stopBtn = document.querySelector('.btn-stop');
const lists = document.querySelector('.lists');
let min = 0, sec = 0, milli = 0; 
let intervalId;
let order = 0; 
let state = false; 

stopBtn.classList.add('non');
lapBtn.classList.add('non');
//1. 시작 버튼 누르면 타이머 동작
startBtn.addEventListener('click', ()=>{
  clearInterval(intervalId); //의도치 않게 두번 이상 누르는 경우, 동작이 겹칠 수 있다.(setInterval사용전에는 초기화를 해주는 과정이 필요하다)
  intervalId = setInterval(operateTimer,10);
  state = !state;
  startBtn.classList.add('non');
  resetBtn.classList.add('non');
  stopBtn.classList.remove('non');
  lapBtn.classList.remove('non');
})

//2. 멈춤 버튼 누르면 타이머 중지
stopBtn.addEventListener('click', ()=>{
  clearInterval(intervalId); //setInterval이 반환한 id를 인자로 전달하면 그 id를 가진 setInterval이 중지하게 된다.
  state = !state;
  startBtn.classList.remove('non');
  resetBtn.classList.remove('non');
  stopBtn.classList.add('non');
  lapBtn.classList.add('non');
})

//3. 리셋 버튼 누르면 타이며 리셋
resetBtn.addEventListener('click',()=>{
  clearInterval(intervalId);
  order = 0;
  min = 0;
  sec = 0;
  milli = 0;
  tenMiillis.textContent = "00";
  seconds.textContent="00";
  minutes.textContent="00";
  lists.innerHTML='';
  state = false;
})

//4. 랩 버튼 누르면 순간 시간 기록
lapBtn.addEventListener('click', ()=>{
  if(state===false) return;
  addRecord(min,sec,milli);
})

//시간 계산 함수 
function operateTimer(){
  milli++;
  tenMiillis.textContent = milli < 10 ? '0'+milli : milli;
  if(milli > 99){  //1000ms = 1s
    sec++;
    seconds.textContent = sec < 10 ?'0'+sec : sec;
    milli = 0;
    tenMiillis.textContent = "00";
  }
  if(sec > 59){
    min++;
    min.textContent = min < 10 ? '0'+min : min;
    sec = 0;
    seconds.textContent="00";
  }
}

// lap 기록 함수
let lastmin = 0, lastsec=0, lastmilli=0;
let lapmin=0, lapsec=0, lapmilli=0;
function addRecord(datamin, datasec, datamilli){
  order++;
  lapmilli=datamilli-lastmilli;
  if(lapmilli < 0){
    lapmilli = 100-lastmilli;
    lapsec--;
  }
  lapsec=datasec-lastsec;
  if(lapsec < 0){
    lapsec = 60-lastsec;
    lapmin--;
  }
  lapmin=datamin-lastmin;
  createlist(lapmin,lapsec,lapmilli);
  lastmin=datamin;
  lastsec=datasec;
  lastmilli=datamilli;
}

//list item 생성 함수 
function createlist(lapmin, lapsec, lapmilli){
  const li = document.createElement('li');
  li.setAttribute('class', 'list');
  li.innerHTML = `
  <span class="list-order">${order} Lap</span>
  <span class="list-record">${lapmin<10?"0"+lapmin:lapmin}:${lapsec<10?"0"+lapsec:lapsec}.${lapmilli<10?"0"+lapmilli:lapmilli}</span>`;
  lists.prepend(li);
}

/*더 구현해야 할 부분
1. lap max, min 값 
2. 코드 간결하게 해보기 
*/