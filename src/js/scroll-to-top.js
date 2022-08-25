// import throttle from "lodash.throttle";

// const THROTTLE_DELAY = 250;

// const throttle = require("lodash.throttle");

export const calcScrollValue = throttle(() => {
    const scrollProgress = document.getElementById("progress");
    const progressValue = document.getElementById("progress-value");
    const position = document.documentElement.scrollTop;
    const calcHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollValue = Math.round((position * 100) / calcHeight);
    console.log(scrollValue);
  
    if (position > 100) {
        scrollProgress.style.display = "grid";
    } else {
        scrollProgress.style.display = "none"
    };
  
    scrollProgress.addEventListener("click", () => {
        document.documentElement.scrollTop = 0;

    });
  
    scrollProgress.style.background = `conic-gradient(#545454 ${scrollValue}%, #bbbbbb ${scrollValue}%)`
},THROTTLE_DELAY);

window.onscroll = calcScrollValue;
window.onload = calcScrollValue;



