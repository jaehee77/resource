let scrollNum = 0;

const imageAll = document.querySelectorAll(".imageWrap .parallaxImage");
const totalNum = imageAll.length;
const subPageImage = document.querySelector(".subPage .parallaxImage");
let x = 0;
let targetX = 0;
const speed = 0.1;

window.addEventListener("scroll", () => {
    scrollNum = window.scrollY;

    imageAll.forEach((item, index) => {
        // -scrollNum / 10 => 스크롤 100픽셀 움직일때 10픽셀만 움직임
        // 각 이미지 모두 따로 움직여야 함
        // 뒤에 있는게 적게 움직이고 앞에 보이는 이미지가 좀더 많이 움직여야 함
        if (index < 4) {
            item.style.transform = `translateY(${
                -scrollNum / (2 * (totalNum - index))
            }px)`;
        }
    });
});

window.addEventListener("mousemove", (e) => {
    // 가운데를 기점으로 -, + 값이 나오도록 설정
    x = e.pageX - window.innerWidth / 2;
});

const loop = () => {
    targetX += (x - targetX) * speed;

    // 위에서 세팅된 translateY 값을 재정의해야함 ${-scrollNum / (2 * (totalNum - 4))}
    imageAll[4].style.transform = `scale(1.05) translate( ${-targetX / 200}px, ${-scrollNum / (2 * (totalNum - 4))}px)`;

    imageAll[5].style.transform = `scale(1.05) translate( ${-targetX / 100}px,${ -scrollNum / (2 * (totalNum - 5))}px )`;

    // 좌,우로 이미지가 움직일때 가장자리가  짤려보여서 스케일로 키움
    subPageImage.style.transform = `scale(1.1) translateX( ${-targetX / 20}px )`;
    
    window.requestAnimationFrame(loop);
    
};
loop();
