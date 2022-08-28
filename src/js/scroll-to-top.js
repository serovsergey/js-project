// import throttle from "lodash.throttle";
import throttle from "lodash.throttle";

const THROTTLE_DELAY = 250;

// const throttle = require("lodash.throttle");

export const calcScrollValue = throttle(() => {

  const scrollProgress = document.getElementById("progress");
  const progressValue = document.getElementById("progress-value");
  const position = document.documentElement.scrollTop;
  const calcHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrollValue = Math.round((position * 100) / calcHeight);
  // console.log(scrollValue);

  if (position > 100) {
    scrollProgress.style.display = "grid";
  } else {
    scrollProgress.style.display = "none"
  };

  scrollProgress.addEventListener("click", () => {
    document.documentElement.scrollTop = 0;

  });

  scrollProgress.style.background = `conic-gradient(#545454 ${scrollValue}%, #bbbbbb ${scrollValue}%)`;
}, THROTTLE_DELAY);


window.onscroll = calcScrollValue;
window.onload = calcScrollValue;


// QUOTES

const btn = document.querySelector('.quote-btn');
const output = document.querySelector('.qoute-output');
let quote = [
    `"I'm as mad as hell, and I'm not going to take this anymore!" - Network`,
    `"Love means never having to say you're sorry." - Love Story`,
    `"Bond. James Bond." - Dr. No`,
    `"There's no place like home." - The Wizard of Oz`,
  `"After all, tomorrow is another day!" - Gone With the Wind`,
  `“May the Force be with you.” - Star Wars`,
  `“I'm the king of the world!” - Titanic`,
  `“It's alive! It's alive!” - Frankenstein`,
  `“I'll be back.” - The Terminator`,
  `“Houston, we have a problem.” - Apollo 13`,
  `“Just keep swimming.” - Finding Nemo`,
  `“Well, nobody's perfect.” - Some Like it Hot`,
  `“To infinity and beyond!” - Toy Story`,
     
];

btn.addEventListener('click', function (){
    let randomQuote = quote[Math.floor(Math.random() * quote.length)]
    output.innerHTML = randomQuote;
})