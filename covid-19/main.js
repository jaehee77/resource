(() => {

	// 무엇을 기준으로 visible 클래스를 제어할 것인가.
	// 말풍선이 뷰포트에 나타났을 때 해당하는 이미지에 visible 을 붙여준다.

	const stepElems = document.querySelectorAll('.step');
	const graphicElems = document.querySelectorAll('.graphic-item');

	// 현재 활성화된(visible 클래스가 붙은) .graphic-item 을 지정
	let currentItem = graphicElems[0];
	
	// function setIndex(targetElems) {
	// 	targetElems.forEach(( targetElem, idx ) => targetElem.dataset.index = idx);
	// }
	// setIndex(stepElems);
	// setIndex(graphicElems);


	let ioIndex; // 현재 보이는 세팅된 인덱스

	const io = new IntersectionObserver((entries, observer) => {
		// console.log(entries);

		// 현재 보이는 세팅된 인덱스를 기준으로 체크하기
		// console.log(entries[0].target.dataset.index);
		ioIndex = entries[0].target.dataset.index * 1; // 곱하기 1을 해줘서 number 타입으로 형변환시킴

		// console.log(ioIndex);
	});

	

	for (let i = 0; i < stepElems.length; i++) {
		stepElems[i].dataset.index = i;
		graphicElems[i].dataset.index = i;

		// stepElems[i] 요소들을 관찰대상으로 등록
		io.observe(stepElems[i]);
	}

	function activate() {
		currentItem.classList.add('visible');
	}

	function inactivate() {
		currentItem.classList.remove('visible');
	}

	window.addEventListener('scroll', () => {
		let step;
		let boundingRect;

		// let temp = 0;

		// for (let i = 0; i < stepElems.length; i++) {
		for (let i = ioIndex -1; i < ioIndex + 2; i++) { // 현재 인덱스의 바로전 인덱스와 현재인덱스에서 + 2(부등호가 < 이므로)
			
			step = stepElems[i];
			if(!step) continue;
			
			boundingRect = step.getBoundingClientRect();

			// temp++;
			
			// console.log(step.dataset.index, '====', boundingRect.top);
			if(boundingRect.top > window.innerHeight * 0.1 && boundingRect.top < window.innerHeight * 0.8) {
				// console.log(step.dataset.index);
				
				// graphicElems[step.dataset.index].classList.add('visible');
				
				
				inactivate()

				currentItem = graphicElems[step.dataset.index];
				activate();

			} 
		}

		// console.log(temp);
	})

	activate();

})();