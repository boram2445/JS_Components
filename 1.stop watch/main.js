"use strict";
const textTime = document.querySelector('.txt-time')
const resetBtn = document.querySelector('.btn-reset');
const lapBtn = document.querySelector('.btn-lap');
const startBtn = document.querySelector('.btn-start');
const stopBtn = document.querySelector('.btn-stop');
const lists = document.querySelector('.lists');
let hour = 0, min = 0, sec = 0; 
let order = 0; 
let intervalId;

//1. 시작 버튼 - 타이머 동작
startBtn.addEventListener('click', ()=>{
  //1-1. 100ms단위로 타이머 동작함수 호출
  clearInterval(intervalId); //의도치 않게 두번 이상 누르는 경우, 동작이 겹칠 수 있기때문에 setInterval사용전에는 초기화를 해주는 과정이 필요
  intervalId = setInterval(operateTimer,1000);
  //1-2. stop, lap 버튼 추가 
  startBtn.classList.add('non');
  resetBtn.classList.add('non');
  stopBtn.classList.add('on');
  lapBtn.classList.add('on');
})

//2. 멈춤 버튼 - 타이머 중지
stopBtn.addEventListener('click', ()=>{
  clearInterval(intervalId); //setInterval이 반환한 id를 인자로 전달하면 그 id를 가진 setInterval이 중지하게 된다.
  startBtn.classList.remove('non');
  resetBtn.classList.remove('non');
  stopBtn.classList.remove('on');
  lapBtn.classList.remove('on');
})

//3. 리셋 버튼 - 타이며 리셋
resetBtn.addEventListener('click',()=>{
  clearInterval(intervalId);
  //3-1. 모든 값 초기화 
  order = 0; 
  hour = 0, min = 0, sec = 0;
  laphour = 0, lastmin=0, lastsec=0;
  max_lap=0, min_lap=100000;
  textTime.textContent='00:00:00';
  lists.innerHTML='';
})

//4. 랩 버튼 -순간 시간 기록
lapBtn.addEventListener('click', ()=>{
  addRecord(hour,min,sec);
})

//시간 계산 함수 - 60sec면 min++
function operateTimer(){
  sec++; 
  if(sec > 59){
    min++;
    sec=0;
  }
  if(min > 59){
    hour++;
    min=0;
  }
  textTime.textContent=`${hour<10?'0'+hour:hour}:${min<10?'0'+min:min}:${sec<10?'0'+sec:sec}`;
}

// lap 기록 함수 - 이전값과의 차를 구하기 
let lasthour = 0, lastmin = 0, lastsec=0;
let laphour=0, lapmin=0, lapsec=0; 
function addRecord(nowhour, nowmin, nowsec){
  order++;
  lapsec=nowsec-lastsec;
  lapmin=nowmin-lastmin;
  laphour=nowhour-lasthour;
  //음수값이 나오는 경우 처리 
  if(lapsec < 0){
    lapsec = 60+nowsec-lastsec;
    lapmin--;
  }
  if(lapmin < 0){
    lapmin = 60+nowmin-lastmin;
    laphour--;
  }
  createlist(laphour,lapmin,lapsec);
  lasthour=nowhour;
  lastmin=nowmin;
  lastsec=nowsec;
}

//lap list 생성 함수 
function createlist(laphour, lapmin, lapsec){
  const li = document.createElement('li');
  li.setAttribute('class', 'list');
  li.innerHTML = `
  <span class="list-order">${order} Lap</span>
  <span class="list-record">${laphour<10?"0"+laphour:laphour}:${lapmin<10?"0"+lapmin:lapmin}.${lapsec<10?"0"+lapsec:lapsec}</span>`;
   //max, min 판별값 받아오기 
  let result = selectMaxMin(laphour, lapmin, lapsec);
  //클래스 초기화 
  for(let list of lists.children){
    list.classList.remove(result);
  }
  if(result === 'first'){
    li.classList.add('min', 'max');
  }
  if(result === 'max'){
    li.classList.add('max');
  } 
  if(result === 'min'){
    li.classList.add('min');
  }
  lists.prepend(li);
  li.scrollIntoView();
}

//max, min
let max_lap = 0; 
let min_lap = 1000000;
function selectMaxMin(laphour, lapmin, lapsec){
  let laptime = laphour*60*60+lapmin*60+lapsec; 
  //첫번째 요소 예외처리 
  if(max_lap === 0 && min_lap === 1000000){
    max_lap = laptime;
    min_lap = laptime;
    return 'first';
  }
  if(max_lap < laptime){
    max_lap = laptime;
    return 'max';
  }
  if( min_lap > laptime){
    min_lap = laptime;
    return 'min';
  }
  return;
}
