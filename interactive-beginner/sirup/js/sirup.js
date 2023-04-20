let x = 0;
let targetX = 0;
const speed = 0.1;

const contentAll = document.querySelectorAll(".contWrap img");
const shadow = contentAll[0];
const date = contentAll[1];
const human = contentAll[2];
const textImg = contentAll[3];

window.addEventListener("mousemove", (event) => {
    // pageX 값이 0 부터 시작하는데 반을 기준으로 0으로 놓게되면 
    // 절반 위치에서 0부터 시작되도록하면 좌측은 마이너스 우측은 플러스게 되게 된다.
    x = event.pageX - window.innerWidth / 2;
});

const loop = () => {
    targetX += (x - targetX) * speed;

    // targetX 을 1 기준으로 본다면 35, 20, 10 등의 값으로 나누면
    // 큰 숫자일 수록 작은값 작은 숫자일수록 큰 수가 나오게 된다.
    shadow.style.transform = `translateX(${targetX / 35}px)`;
    date.style.transform = `translateX(${targetX / 20}px)`;
    human.style.transform = `translateX(${-targetX / 20}px)`;
    textImg.style.transform = `translateX(${-targetX / 10}px)`;
    window.requestAnimationFrame(loop);
};
loop();
