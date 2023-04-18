(()=> {

    const stageElem = document.querySelector('.stage');
    const houseElem = document.querySelector('.house');
    const barElem = document.querySelector('.progress-bar');
    const mousePos = { x: 0, y: 0 };
    let maxScrollValue;


    function resizeHandler() {
        maxScrollValue = document.body.offsetHeight - window.innerHeight;
    }

    window.addEventListener('scroll', () => {
        const scrollPer = window.pageYOffset / maxScrollValue; // 전체에서 얼마나 스크롤했는지에 대한 비율
        const zMove = scrollPer * 980 - 490; 
        // 0부터 1000까지 움직이는데 기본값이 -490 이라서 -490을 해줌
        // 980 적당하게 스크롤 범위를 눈으로 보고 조정함
        // console.log(zMove);
        houseElem.style.transform = `translateZ(${zMove}vw)`;

        // progress bar
        barElem.style.width = `${scrollPer * 100}%`;
    })

    window.addEventListener('mousemove', (e) => {
        // console.log(e.clientX, e.clientY);
        mousePos.x = -1 + (e.clientX / window.innerWidth) * 2;
        mousePos.y = (e.clientY / window.innerHeight) * 2;
        // console.log( mousePos.y, 1- mousePos.y);
        // console.log(mousePos);
        stageElem.style.transform = `rotateX(${(mousePos.y * 5)}deg) rotateY(${(mousePos.x * 5)}deg)`;
    });

    window.addEventListener('resize', resizeHandler);

    // 처음에 문서로드가 되면 일단 한번은 실행함
    resizeHandler();
})();