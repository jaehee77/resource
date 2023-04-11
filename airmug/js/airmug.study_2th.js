(() => {

    let yOffset = 0; // window.pageYOffset 대신 쓸 변수
    let prevScrollHeight = 0; // 현재 스크롤 위치(pageYOffset)보다 이전에 위치한 섹션들의 스크롤 높이값의 합
    let currentScene = 0; // 현재 활성화된(뷰포트에 보이고 있는) 씬(scroll-section)
    let enterNewScene = false; // 새로운 씬에 진입하는 순간 true

    // 각 스크롤 구간의 높이에 따라 애니메이션 속도를 제어,조절할 수 있음
    // 즉, 스크롤 구간의 높이가 크면 애니메이션이 천천히 실행될 수 있다.
    const sceneInfo = [
        {   // 첫번째 스크롤 섹션
            type: 'sticky', // 스크롤이 sticky 되는 구간
            // 애니메이션 구간 높이을 설정, 여러 디바이스(창 사이즈변경)를 고려해야함.
            heightNum: 5, // 브라우저의 높이 5배로 scrollHeight 세팅(창 사이즈 변경에 대응)
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-0'),
                messageA: document.querySelector('#scroll-section-0 .main-message.a'),
                messageB: document.querySelector('#scroll-section-0 .main-message.b'),
                messageC: document.querySelector('#scroll-section-0 .main-message.c'),
                messageD: document.querySelector('#scroll-section-0 .main-message.d'),
            },
            values: {
                messageA_opacity_in: [0, 1, {start: 0.1, end: 0.2}], // 0,1 시작값, 끝나는 값
                messageB_opacity_in: [0, 1, {start: 0.3, end: 0.4}], // start, end 애니메이션이 시작되고 끝나는 값(10% 구간에서 애니메이션적용)
                messageC_opacity_in: [0, 1, { start: 0.5, end: 0.6 }],
                messageD_opacity_in: [0, 1, { start: 0.7, end: 0.8 }],

                messageA_translateY_in: [20, 0, {start: 0.1, end: 0.2}],
                messageB_translateY_in: [20, 0, { start: 0.3, end: 0.4 }],
                messageC_translateY_in: [20, 0, { start: 0.5, end: 0.6 }],
                messageD_translateY_in: [20, 0, { start: 0.7, end: 0.8 }],

                messageA_opacity_out: [1, 0, { start: 0.25, end: 0.3 }],
                messageB_opacity_out: [1, 0, { start: 0.45, end: 0.5 }],
                messageC_opacity_out: [1, 0, { start: 0.65, end: 0.7 }],
                messageD_opacity_out: [1, 0, { start: 0.85, end: 0.9 }],

                messageA_translateY_out: [0, -20, { start: 0.25, end: 0.3 }],
                messageB_translateY_out: [0, -20, { start: 0.45, end: 0.5 }],
                messageC_translateY_out: [0, -20, { start: 0.65, end: 0.7 }],
                messageD_translateY_out: [0, -20, { start: 0.85, end: 0.9 }],
            }
        },
        {
            // 2
            type: 'normal', // sticky 가 되지않고 일반적으로 스크롤되는 보통 스크롤구간
            // heightNum: 5, // type normal에서는 필요 없음
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-1'),
                content: document.querySelector('#scroll-section-1 .description')
            },
        },
        {
            // 3
            type: 'sticky',
            heightNum: 5, 
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-2'),
                messageA: document.querySelector('#scroll-section-2 .a'),
                messageB: document.querySelector('#scroll-section-2 .b'),
                messageC: document.querySelector('#scroll-section-2 .c'),
                pinB: document.querySelector('#scroll-section-2 .b .pin'),
                pinC: document.querySelector('#scroll-section-2 .c .pin')
            },
            values: {
                messageA_translateY_in: [20, 0, { start: 0.15, end: 0.2 }],
                messageB_translateY_in: [30, 0, { start: 0.5, end: 0.55 }],
                messageC_translateY_in: [30, 0, { start: 0.72, end: 0.77 }],
                messageA_opacity_in: [0, 1, { start: 0.15, end: 0.2 }],
                messageB_opacity_in: [0, 1, { start: 0.5, end: 0.55 }],
                messageC_opacity_in: [0, 1, { start: 0.72, end: 0.77 }],
                messageA_translateY_out: [0, -20, { start: 0.3, end: 0.35 }],
                messageB_translateY_out: [0, -20, { start: 0.58, end: 0.63 }],
                messageC_translateY_out: [0, -20, { start: 0.85, end: 0.9 }],
                messageA_opacity_out: [1, 0, { start: 0.3, end: 0.35 }],
                messageB_opacity_out: [1, 0, { start: 0.58, end: 0.63 }],
                messageC_opacity_out: [1, 0, { start: 0.85, end: 0.9 }],
                pinB_scaleY: [0.5, 1, { start: 0.5, end: 0.55 }],
                pinC_scaleY: [0.5, 1, { start: 0.72, end: 0.77 }],
                pinB_opacity_in: [0, 1, { start: 0.5, end: 0.55 }],
                pinC_opacity_in: [0, 1, { start: 0.72, end: 0.77 }],
                pinB_opacity_out: [1, 0, { start: 0.58, end: 0.63 }],
                pinC_opacity_out: [1, 0, { start: 0.85, end: 0.9 }]
            }
        },
        {
            // 4
            type: 'sticky',
            heightNum: 5, 
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-3'),
                canvasCaption: document.querySelector('.canvas-caption')
            },
            values: {

            }
        }
    ];

    function setLayout() {
        // 각 스크롤 섹션의 높이 세팅
        for ( let i = 0; i < sceneInfo.length; i++) {
            if(sceneInfo[i].type === 'sticky') {
                sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
            } else if(sceneInfo[i].type === 'normal') {
                sceneInfo[i].scrollHeight = sceneInfo[i].objs.container.offsetHeight;
            }
            sceneInfo[i].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`;
        }
        // console.log(sceneInfo)

        // 페이지 중간에서 새로고침할 경우에도 해당씬을 활성화시켜주기 위함
        yOffset = window.pageYOffset;
        
        let totalScrollHeight = 0;
        for(let i = 0; i < sceneInfo.length; i++) {
            totalScrollHeight += sceneInfo[i].scrollHeight;
            if(totalScrollHeight >= yOffset) {
                currentScene = i;
                break;
            }
        }
        document.body.setAttribute('id', `show-scene-${currentScene}`);
        // sceneInfo[currentScene].objs.container.classList.add('is-actived');
    }

    function calcValues(values, currentYoffset) { // values : [0, 1]...
        let rv;

        const scrollHeight = sceneInfo[currentScene].scrollHeight;

        // 뷰포트 보이고 있는 현재 씬(스크롤 섹션)에서 스크롤된 범위를 비율로 구하기
        const scrollRatio = currentYoffset / scrollHeight;
        // console.log(scrollRatio)
        // console.log(scrollRatio * 400) // 범위를 설정
        // Ex) 0 * (900 - 200) + 200 : 처음을 200부터 시작할 수 있도록

        if(values.length === 3) {
            // start ~ end 사이에 애니메이션 실행
            const partScrollStart = values[2].start * scrollHeight;
            const partScrollEnd = values[2].end * scrollHeight;
            const partScrollHeight = partScrollEnd - partScrollStart;

            if(currentYoffset >= partScrollStart && currentYoffset <= partScrollEnd) {
                rv = (currentYoffset - partScrollStart) / partScrollHeight * (values[1] - values[0]) + values[0];
            } else if(currentYoffset < partScrollStart) {
                rv = values[0];
            } else if(currentYoffset > partScrollEnd) {
                rv = values[1];
            }


        } else {
            rv = scrollRatio * (values[1] - values[0]) + values[0];
        }

        
        // console.log(rv)
        return rv;
    }

    function playAnimation() {
        const objs = sceneInfo[currentScene].objs;
        const values = sceneInfo[currentScene].values;
        
        const scrollHeight = sceneInfo[currentScene].scrollHeight;

        // 각 섹션마다 시작하는 스크롤값이 0으로 초기화된 값을 구함
        const currentYOffset = yOffset - prevScrollHeight;
        // console.log(currentScene, currentYoffset); 

        const scrollRatio = currentYOffset / scrollHeight;
        
        switch(currentScene) {
            case 0:
                // console.log('0 play');

                if(scrollRatio <= 0.22) {
                    // in
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
                    objs.messageA.style.transform = `translateY(${calcValues(values.messageA_translateY_in, currentYOffset)}%)`;
                } else {
                    // out
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
                    objs.messageA.style.transform = `translateY(${calcValues(values.messageA_translateY_out, currentYOffset)}%)`;
                }

                if (scrollRatio <= 0.42) {
                    // in
                    objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYOffset);
                    objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_in, currentYOffset)}%, 0)`;
                } else {
                    // out
                    objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYOffset);
                    objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_out, currentYOffset)}%, 0)`;
                }
    
                if (scrollRatio <= 0.62) {
                    // in
                    objs.messageC.style.opacity = calcValues(values.messageC_opacity_in, currentYOffset);
                    objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_in, currentYOffset)}%, 0)`;
                } else {
                    // out
                    objs.messageC.style.opacity = calcValues(values.messageC_opacity_out, currentYOffset);
                    objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_out, currentYOffset)}%, 0)`;
                }
    
                if (scrollRatio <= 0.82) {
                    // in
                    objs.messageD.style.opacity = calcValues(values.messageD_opacity_in, currentYOffset);
                    objs.messageD.style.transform = `translate3d(0, ${calcValues(values.messageD_translateY_in, currentYOffset)}%, 0)`;
                } else {
                    // out
                    objs.messageD.style.opacity = calcValues(values.messageD_opacity_out, currentYOffset);
                    objs.messageD.style.transform = `translate3d(0, ${calcValues(values.messageD_translateY_out, currentYOffset)}%, 0)`;
                }

                
                // console.log(messageA_opacity_in);
                break;
            case 2:
                // console.log('2 play');

                if (scrollRatio <= 0.25) {
                    // in
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
                    objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in, currentYOffset)}%, 0)`;
                } else {
                    // out
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
                    objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currentYOffset)}%, 0)`;
                }
    
                if (scrollRatio <= 0.57) {
                    // in
                    objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_in, currentYOffset)}%, 0)`;
                    objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYOffset);
                    objs.pinB.style.transform = `scaleY(${calcValues(values.pinB_scaleY, currentYOffset)})`;
                } else {
                    // out
                    objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_out, currentYOffset)}%, 0)`;
                    objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYOffset);
                    objs.pinB.style.transform = `scaleY(${calcValues(values.pinB_scaleY, currentYOffset)})`;
                }
    
                if (scrollRatio <= 0.83) {
                    // in
                    objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_in, currentYOffset)}%, 0)`;
                    objs.messageC.style.opacity = calcValues(values.messageC_opacity_in, currentYOffset);
                    objs.pinC.style.transform = `scaleY(${calcValues(values.pinC_scaleY, currentYOffset)})`;
                } else {
                    // out
                    objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_out, currentYOffset)}%, 0)`;
                    objs.messageC.style.opacity = calcValues(values.messageC_opacity_out, currentYOffset);
                    objs.pinC.style.transform = `scaleY(${calcValues(values.pinC_scaleY, currentYOffset)})`;
                }

                break;
            case 3:
                // console.log('3 play');
                break;
           
        }
    }

    // 몇 번째 섹션이 스크롤되고 있는지 판별
    function scrollLoop() {
        enterNewScene = false; // 기본적으로 스크롤이 될때마다 false 씬이 바뀔때 true
        prevScrollHeight = 0; // 스크롤할때마다 아래식에서 += prevScrollHeight 값이 누적되므로 0 으로 초기화

        // 처음 0일경우에는 실행 X, 
        // 1로 증가할 때 0,1 반복하면서 0번째의 스크롤값을 넣고, 1 은 반복조건에 맞지 않으므로 실행 안되므로 0번째 높이값을 저장하게 됨
        // 2로 증가할 때  0,1,2 반복하면서 0,1 번째 스크롤값을 넣게됨
        // 3로 증가할 때  0,1,2,3 반복하면서 0,1,2 번째 스크롤값을 넣게됨
        for(let i = 0; i < currentScene; i++) { 
            prevScrollHeight += sceneInfo[i].scrollHeight;
        }
        // console.log(prevScrollHeight)

        if(yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {

            // currentScene 증가 전 요소를 remove 시키게 됨
            // sceneInfo[currentScene].objs.container.classList.remove('is-actived');
            // console.log(currentScene);

            enterNewScene = true;
            currentScene++;
            document.body.setAttribute('id', `show-scene-${currentScene}`);
        }
        if(yOffset < prevScrollHeight) {
            // 맥 브라우저나 기타 디바이스의 바운스될때 마이너스값 나올 경우를 방지
            if(currentScene === 0) return;

            // currentScene 감소되기전의 증가값 요소를 remove 시키게 됨
            // sceneInfo[currentScene].objs.container.classList.remove('is-actived');
            // console.log(currentScene)
            
            enterNewScene = true;
            currentScene--;
            document.body.setAttribute('id', `show-scene-${currentScene}`);
        }
        
        // currentScene 마지막 증가 또는 감소시에 활성화 클래스 
        // sceneInfo[currentScene].objs.container.classList.add('is-actived');
        // console.log(currentScene);
        
        if(enterNewScene) return; // 찰나의 순간(씬이 바뀔때)에 playAnimation 을 실행안함(음수값방지)
        playAnimation();
    }

    window.addEventListener('resize', setLayout);
    window.addEventListener('scroll', () => {
        // console.log(window.pageYOffset);// 스크롤시 스크롤된 높이값
        yOffset = window.pageYOffset;
        scrollLoop();
    })

    window.addEventListener('resize', setLayout);
    window.addEventListener('load', setLayout);
    

})();