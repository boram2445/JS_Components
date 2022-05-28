"use strict";
const textTime = document.querySelector('.txt-time')
const resetBtn = document.querySelector('.btn-reset');
const lapBtn = document.querySelector('.btn-lap');
const startBtn = document.querySelector('.btn-start');
const stopBtn = document.querySelector('.btn-stop');
const lists = document.querySelector('.lists');

let _interval; //setInterval이 리턴하는 intervalID
let _centisecond = 0;
let _lapCount = 0; //현재 스톱워치의 누적 Lap 갯수
let _prevLap = 0;

startBtn.addEventListener('click', start);
stopBtn.addEventListener('click', pause);
resetBtn.addEventListener('click', reset);
lapBtn.addEventListener('click', updateLap);
window.addEventListener('keydown', (e)=>{
  let key = e.key.toLowerCase();
  if(key === 'l'){
    if(lapBtn.classList.contains('on')){
      updateLap(); 
    } else{
      reset()
    }
  }
  if(key === 's'){
    if(startBtn.classList.contains('non')){
      pause();
    } else{
      start();
    }
  }
})

//1.스톱워치 시작하기
function start(){
  clearInterval(_interval);
  _interval = setInterval(updateTimer,10);
  startBtn.classList.add('non');
  resetBtn.classList.add('non');
  stopBtn.classList.add('on');
  lapBtn.classList.add('on');
}

//시간 업데이트
function updateTimer(){
  _centisecond++;
  //100centi -> 1s
  let [minute, second, centisecond] = getTime(_centisecond);
  textTime.textContent = `${minute<10?'0'+minute:minute}:${second<10?'0'+second:second}.${centisecond<10?'0'+centisecond:centisecond}`;
}

//시간 계산 
function getTime(time){
  let minute = Math.floor(time/(100*60)%60);
  let second = Math.floor((time/100)%60); //100centi = 1s
  let centisecond = time%100;
  return [minute, second, centisecond];
}

//2.스톱워치 중단(일시정지)하기
function pause(){
  clearInterval(_interval);
  startBtn.classList.remove('non');
  resetBtn.classList.remove('non');
  stopBtn.classList.remove('on');
  lapBtn.classList.remove('on');
}

//3. Lap 추가하기 
let resLap = []; 
function updateLap(){
  _lapCount++; 
  let [order, nowLap] = createLap();
  let [minute, second, centisecond] = getTime(nowLap);
  resLap.push(nowLap);
  let classLap = getMinMax(nowLap); 
  //li 요소 생성
  const li = document.createElement('li');
  li.classList.add('list');
  li.innerHTML = `
    <span class="list-order">${order} Lap</span>
    <span class="list-record">${minute<10?'0'+minute:minute}:${second<10?'0'+second:second}.${centisecond<10?'0'+centisecond:centisecond}</span>
  `;
  //li에 max나 min class 추가할 경우
  if(classLap!==''){
    if(resLap.length === 1){
      li.classList.add('max', 'min');
    } else{
      for(let list of lists.children){
        list.classList.remove(classLap);
      }
      li.classList.add(classLap);
    }
  }
  lists.prepend(li);
  li.scrollIntoView();
}

//스톱워치 Lap 시간 계산 
function createLap(){
  let nowLap = _centisecond-_prevLap; 
  _prevLap = _centisecond;
  return [_lapCount, nowLap];
}

//Lap 최대, 최솟값 계산 
function getMinMax(nowLap){
  let classLap = '';
  let maxLap = Math.max(...resLap);
  let minLap = Math.min(...resLap);
  if(maxLap === nowLap) classLap = 'max';
  if(minLap === nowLap) classLap = 'min';
  return classLap;
}

//4.스톱워치 리셋하기
function reset(){
  _centisecond = 0;
  _lapCount = 0;
  _prevLap = 0;
  textTime.textContent='00:00.00';
  resLap=[];
  lists.innerHTML = '';
  pause();
}
