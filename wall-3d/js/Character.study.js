function Character({xPos, speed}) {

    this.mainElem = document.createElement('div');
    this.mainElem.classList.add('character');
    this.mainElem.innerHTML = `<div class="character">
        <div class="character-face-con character-head">
            <div class="character-face character-head-face face-front "></div>
            <div class="character-face character-head-face face-back "></div>
        </div>
        <div class="character-face-con character-torso">
            <div class="character-face character-torso-face face-front"></div>
            <div class="character-face character-torso-face face-back"></div>
        </div>
        <div class="character-face-con character-arm character-arm-right">
            <div class="character-face character-arm-face face-front"></div>
            <div class="character-face character-arm-face face-back"></div>
        </div>
        <div class="character-face-con character-arm character-arm-left">
            <div class="character-face character-arm-face face-front"></div>
            <div class="character-face character-arm-face face-back"></div>
        </div>
        <div class="character-face-con character-leg character-leg-right">
            <div class="character-face character-leg-face face-front"></div>
            <div class="character-face character-leg-face face-back"></div>
        </div>
        <div class="character-face-con character-leg character-leg-left">
            <div class="character-face character-leg-face face-front"></div>
            <div class="character-face character-leg-face face-back"></div>
        </div>
    </div>`;

    // console.log(xPos);
    this.mainElem.style.left = `${xPos}%`;
    document.querySelector('.stage').appendChild(this.mainElem);
    // 스크롤 중인지 아닌지 체크
    this.scrollState = false;
    
    // 바로 이전(마지막) 스크롤 위치를 체크하는 변수
    this.lastScrollTop = 0;

    this.xPos = xPos;
    // 캐릭터마다 스피드 셋팅
    this.speed = speed;

    this.direction;

    // 좌우 이동 중인지 아닌지 판별하는 변수(키다운 이벤트 발생을 최소화)
    this.runningState = false;

    // requestAnimationFrame 해제할 변수
    this.rfID;

    this.init();
}

Character.prototype = {
    constructor: Character,
    init() {
        window.addEventListener('scroll', () => {
            // 스크롤이 발생하면 running 클래스를 붙이고, 
            // 스크롤이 멈추면 running 클래스를 제거

            // 스크롤이 발생할때마다 setTimeout 내부 동작을 안하게끔 노력하는 놈
            // 스크롤을 할때마다 클리어를 해주기 때문에 setTimeout 은 한번정도만 실행하게 된다.
            // 즉, 스크롤을 멈추면 그제서야 clearInterval 도 실행을 안하므로 그때 setTimeout 이 동작하게 된다.
            clearInterval(this.scrollState);

            // 처음에 캐릭터생성하고 스크롤멈춤상태이므로 false 이므로
            if( !this.scrollState) {
                this.mainElem.classList.add('running');
                // console.log('클래스 붙었음');
            }

            this.scrollState = setTimeout(() => {
                this.scrollState = false;
                this.mainElem.classList.remove('running');
            }, 500);

            // console.log(this.scrollState);

            // 다음턴 스크롤때  this.lastScrollTop = window.pageYOffset; 를 좀 아래에서 실행하면
            // 그전 스크롤값을 구할 수 있고 현재 일어난 스크롤값은 pageYOffset 이 되게 된다.
            // console.log(`lastScrollTop: ${this.lastScrollTop}`, `====== pageYOffset: ${window.pageYOffset}`);

            // 이전 스크롤 위치와 현재 스크롤 위치를 비교
            if(this.lastScrollTop > window.pageYOffset) {
                // 이전 스크롤 위치가 크다면 : 스크롤 올림
                this.mainElem.setAttribute('data-direction', 'backward');
            } else {
                // 현재 스크롤 위치가 크다면: 스크롤 내림
                this.mainElem.setAttribute('data-direction', 'forward');
            }
            
            
            this.lastScrollTop = window.pageYOffset;
            // 아래값은 동일하게 찍힘 즉, 여기서 전후 스크롤값을 비교하는 로직을 작성하면 안됨
            // console.log(`lastScrollTop: ${this.lastScrollTop}`, `=== pageYOffset: ${window.pageYOffset}`);

        });

        window.addEventListener('keydown', (e) => {
            // console.log(e.code);
            // this.mainElem.classList.add('running');

            // 키다운 이벤트 발생이 얼마나 되는지 체크해보자
            // console.log('키다운');

            if(this.runningState) return;

            if(e.code === 'ArrowLeft') {
                this.mainElem.setAttribute('data-direction', 'left');
                // 맨 마지막에 한번만 실행해도 될것 같음 ㅋ
                // this.mainElem.classList.add('running');

                this.direction = 'left';

                this.run();
                this.runningState = true;
                // console.log(this.runningState);

            } else if(e.code === 'ArrowRight') {
                this.mainElem.setAttribute('data-direction', 'right');
                // this.mainElem.classList.add('running');

                this.direction = 'right';

                this.run();
                this.runningState = true;

            } else if(e.code === 'ArrowUp') {
                this.mainElem.setAttribute('data-direction', 'backward');
                // this.mainElem.classList.add('running');
            } else if(e.code === 'ArrowDown') {
                this.mainElem.setAttribute('data-direction', 'forward');
                // this.mainElem.classList.add('running');
            }
            this.mainElem.classList.add('running');
        });

        window.addEventListener('keyup', () => {
            this.mainElem.classList.remove('running');
            
            cancelAnimationFrame(this.rfID);
            this.runningState = false;
        })

    },
    run () {
        // console.log(this);
        

        if(this.direction === 'left') {
            this.xPos -= this.speed;
            // console.log(this.xPos);
        } else if(this.direction === 'right') {
            this.xPos += this.speed;
        }
        if( this.xPos < 2 ) this.xPos = 2;
        if( this.xPos > 88 ) this.xPos = 88;

        this.mainElem.style.left = `${this.xPos}%`;

        // 방법 1
        // requestAnimationFrame(this.run.bind(this));
        
        // 방법 2
        this.rfID = requestAnimationFrame(() => {
            this.run();
        })
    }
}

