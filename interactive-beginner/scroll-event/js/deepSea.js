const depthWrap = document.querySelector(".depthWrap");
const progressBar = document.querySelector(".bar");
const submarine = document.querySelector(".submarine");
const octopus = document.querySelector(".octopus");
// h1.innerText = "1";
let scrollNum = 0;
let documentHeight = 0;
let per = 0;

let widthValueByScroll = 0;

// console.log(submarine);

// body 의 scrollHeight, offsetHeight 는 같음
// console.log( document.body.scrollHeight, document.body.offsetHeight);
window.addEventListener("scroll", () => {
    scrollNum = window.scrollY;

    // 실제 스크롤만 되는 높이
    documentHeight = document.body.scrollHeight - window.innerHeight;

    per = percent(scrollNum, documentHeight);

    depthWrap.querySelector("span").innerText = scrollNum.toFixed(0);
    progressBar.style.width = per + "%";

    // submarine.style.transform = `translateX(${per}%)`;
    widthValueByScroll = (scrollNum) / documentHeight * innerWidth;
    console.log(widthValueByScroll - 80)
    if(widthValueByScroll >= innerWidth - 100) { 
        widthValueByScroll = innerWidth - 100;
    }
    submarine.style.transform = `translateX(${ widthValueByScroll -= 50 }px)`;
    octopus.style.transform = `translateY(${-per / 3}%)`;

    // console.log( scrollNum / documentHeight * innerWidth );
});

const percent = (num, totalNum) => {
    return ((num / totalNum) * 100).toFixed(0);
};
