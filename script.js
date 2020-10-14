const inputContainer = document.getElementById('input-container');
const countdownForm = document.getElementById('countdownForm');
const dateEl = document.getElementById('date-picker');

const countdownEl = document.getElementById('countdown');
const countdownElTitle =document.getElementById('countdown-title');
const countdownBtn = document.getElementById('countdown-button');
const timeElements = document.querySelectorAll('span');

const completeEl =document.getElementById('complete');
const completeElInfo = document.getElementById('complete-info');
const completeBtn = document.getElementById('complete-button');


let countdownTitle = '';
let countdownDate = '';
let countdownValue = new Date();
let countdownActive;
let savedCountdown;

const second = 1000;
const minute = second * 60;
const hour = minute *60;
const day = hour * 24;

//set the minium end point for the date picker
const today = new Date().toISOString().split('T')[0];
dateEl.setAttribute('min', today);

//Populate the countdown/ complete uI
function updateDOM(){
 countdownActive = setInterval(() => {
  const now = new Date().getTime();
  const distance  = countdownValue - now;
  
  const days = Math.floor(distance/day);
  const hours = Math.floor((distance % day) / hour);
  const minutes = Math.floor((distance % hour) / minute);
  const seconds = Math.floor((distance % minute) / second);

  //Hide input
  inputContainer.hidden= true;
  
  //if the countdown has ended show complete info
  if(distance < 0){
    countdownEl.hidden = true;
    clearInterval(countdownActive);
    completeElInfo.textContent = `${countdownTitle} finished on ${countdownDate}`;
    completeEl.hidden = false;
  }else{
    //show the countdown in progress
    //populating countdown
    countdownElTitle.textContent = `${countdownTitle}`;
    timeElements[0].textContent = `${days}`;
    timeElements[1].textContent = `${hours}`;
    timeElements[2].textContent = `${minutes}`;
    timeElements[3].textContent = `${seconds}`;

    completeEl.hidden = true;

    countdownEl.hidden = false;

  }
 }, second);
}


//take values from form input
function updateCountdown(e){
  e.preventDefault();
  countdownTitle = e.srcElement[0].value;
  countdownDate = e.srcElement[1].value;
  savedCountdown = {
    title: countdownTitle,
    date: countdownDate,
  }

  localStorage.setItem('countdown', JSON.stringify(savedCountdown));
  //check for valid date
  if(countdownDate === ''){
    alert('Please select a date for the countdown.')
  }else{
    //Get number version of current date, update dom
    countdownValue = new Date(countdownDate).getTime();
    updateDOM();
  }
}

//reset countdown and all values
function reset(){
  //hide countdown, show input
  countdownEl.hidden= true;
  completeEl.hidden= true;
  inputContainer.hidden = false;

  //stop countdown
  clearInterval(countdownActive);

  //reset values
  countdownTitle = '';
  countdownDate = '';

  localStorage.removeItem('countdown');

}

//restore countdown from local storage
function restorePreviousCountdown(){
  if(localStorage.getItem('countdown')){
    inputContainer.hidden = true;
    savedCountdown  = JSON.parse(localStorage.getItem('countdown'));
    countdownTitle = savedCountdown.title;
    countdownDate = savedCountdown.date;

    //Get number version of current date, update dom
    countdownValue = new Date(countdownDate).getTime();
    updateDOM();
  }
}

//event listeners
countdownForm.addEventListener('submit', updateCountdown);
countdownBtn.addEventListener('click', reset);
completeBtn.addEventListener('click', reset);


//onload , check local storage
restorePreviousCountdown();