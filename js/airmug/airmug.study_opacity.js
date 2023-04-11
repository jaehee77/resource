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
                
                messageA_translateY_in: [20, 0, {start: 0.1, end: 0.2}],
                
                messageA_opacity_out: [1, 0, {start: 0.25, end: 0.3}],
                messageA_translateY_out: [0, -20, {start: 0.25, end: 0.3}],
            }
        },
        {
            // 2
            type: 'normal', // sticky 가 되지않고 일반적으로 스크롤되는 보통 스크롤구간
            heightNum: 5, 
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-1'),
            },
        },
        {
            // 3
            type: 'sticky',
            heightNum: 5, 
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-2'),
            },
        },
        {
            // 4
            type: 'sticky',
            heightNum: 5, 
            scrollHeight: 0,
            objs: {
                container: document.querySelector('#scroll-section-3'),
            },
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
        const currentYoffset = yOffset - prevScrollHeight;
        // console.log(currentScene, currentYoffset); 

        const scrollRatio = currentYoffset / scrollHeight;
        
        switch(currentScene) {
            case 0:
                // console.log('0 play');

                if(scrollRatio <= 0.22) {
                    // in
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYoffset);
                    objs.messageA.style.transform = `translateY(${calcValues(values.messageA_translateY_in, currentYoffset)}%)`;
                } else {
                    // out
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYoffset);
                    objs.messageA.style.transform = `translateY(${calcValues(values.messageA_translateY_out, currentYoffset)}%)`;
                }

                
                // console.log(messageA_opacity_in);
                break;
            case 1:
                // console.log('1 play');
                break;
            case 2:
                // console.log('2 play');
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

        // 처음에 0 은 실행자체를 하지 않기 때문에 prevScrollHeight 은 0 
        for(let i = 0; i < currentScene; i++) { 
            prevScrollHeight += sceneInfo[i].scrollHeight;
        }
        // console.log(prevScrollHeight)

        // sceneInfo[currentScene].scrollHeight
        // 맨 처음 0일 경우 초기 셋팅된 값이 있음
        // 그래서 맨처음 prevScrollHeight 0 이고 처음요소의 scrollHeight 값을 더하게 되어
        // 처음 요소의 높이와 yOffset 를 비교하게 됨

        // currentScene 이 1로 증가하면 그제서야  (i < 1) 0 조건이 만족해서 
        // sceneInfo[0].scrollHeight 의 값이 prevScrollHeight 로 셋팅됨
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