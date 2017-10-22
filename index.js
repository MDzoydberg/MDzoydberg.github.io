var canvas = document.getElementById('canvas-box'),
	ctx = canvas.getContext('2d'),
	term1sm, //переменная для хранения первого слогаемого в см
	term2sm, //переменная для хранения второго слогаемого в см
	summSm, //переменная для хранения суммы в см 
	term1px, //переменная для хранения первого слогаемого в px
	term2px; //переменная для хранения второго слогаемого в px

function startTest (){ //запуск теста
	var input1 = document.getElementById('term1-input'),
		input2 = document.getElementById('term2-input'),
		input3 = document.getElementById('summ-input'), 
		term1Condition= document.getElementById('term1-task-text'),
		term2Condition= document.getElementById('term2-task-text'),
		stageId = 1, //Стадия решения: 1 - первая стрелка 1 инпут, 2 - вторая стрелка второй импут,  3- ввести ответ. 
		resultVerification = false; //Результат проверки решения

	function NextStage(stageId) { //функция запускающая стадии
		var start, 
			shift,
			element,
			type,
			answer = 0;

		switch(stageId){
			case 1:
				start = term1px;
				shift = 0;
				element = input1;
				type = 'term1';
				answer = term1sm;
			break;
			case 2:
				start = term2px;
				shift = term1px;
				element = input2;
				type = 'term2';
				answer = term2sm;
			break;
			case 3:
				element = input3;
				type = 'summ';
				answer = summSm;
			break;
			default:
					return
				break;
		}
		outputArr(start, shift, element);
		element.addEventListener('input', function(){
			verificationState(stageId, element, type, answer);
		});
	}

	function verificationState(stageId, element, type, answer){
		resultVerification = verificationValue(element.value, answer, type);
		if (resultVerification == true){
			element.removeEventListener('input', function(){
				verificationState(stageId, element, type, answer);
			});
			stageId ++;
			console.log(stageId);
			NextStage(stageId);
		}
	}
	term1sm = Math.floor(Math.random() * (10 - 6)) + 6; //генерируем первое слогаемое в сантиметрах
	summSm = Math.floor(Math.random() * (15 - 11)) + 11; //генерируем сумму в сантиметрах
	term2sm = summSm - term1sm; //считаем второеслогаемое в сантиметрах
	term1px = 39*term1sm; // переводим первое слогаемое в пиксели
	term2px = 39*term2sm; // переводим второе слогаемое в пиксели
	// должно быть 37.7952755905511px в см, но поскольку предоставленное изоражение линейки не точно, приходится использовать 39 что бы убрать погрешность.
	term1Condition.textContent = term1sm;// выводим первое слогаемое
	term2Condition.textContent = term2sm;// выводим второе слогаемое
	

	NextStage(stageId);
}


function outputArr (start, shift, input){
	var	marginSide = (start/2 - 10),
		marginBott = 234 - start/3.7;

	function drawArr(start, shift){
		ctx.beginPath();
		ctx.strokeStyle = '#cc0073';
		ctx.lineWidth = 1.5;
		ctx.moveTo(shift, 234);
		ctx.quadraticCurveTo(start/2 + shift, 234-start/2, start+shift, 234);
		ctx.lineTo(start+shift-4, 224);
		ctx.moveTo(start+shift, 234);
		ctx.lineTo(start+shift-11, 228);
		ctx.closePath();
		ctx.stroke();
	};
	if(input.id == 'summ-input'){
		document.getElementById('summ-text').classList.toggle('task-list__item_visible');
		input.classList.toggle('task-list__item_visible');
	}
	else {
		drawArr(start, shift);
		input.style.margin = marginBott + 'px ' +  marginSide + 'px ' + '-' + marginBott + "px";
		input.classList.add('canvas-box__item_visible');
	}
};



function verificationValue (value, answer, type) {
	var id, 
		element,
		marginSide = answer*39/2 -10,
		marginBott = 234 - answer*39/3.7;
		console.log(value, answer);
	function classToggle(element, classId){
		var	className;
		className = element.classList[0] + classId;
		switch(classId){

		case '_visible':
			console.log(classId)
			element.classList.toggle(className);
			console.log(className, element.className)
			break;
		case '_fixed-error': 
			className = element.classList[0] + '_output-error';
			element.classList.remove(className);
			break;
		default:
			element.classList.add(className);
			break;
		}
	}
	console.log('start verification')
	if (value == answer) {
		id = type + "-input";
		element = document.getElementById(id)
		console.log(element, type, id);
		classToggle(element, '_visible');
		id = type + "-text";

		element = document.getElementById(id)
		element.textContent = answer;
		if(type != 'summ'){
			element.style.margin = marginBott + 'px ' +  marginSide + 'px ' + '-' + marginBott + "px";

		}
		classToggle(element, '_visible');
		console.log('verification true')
		if(type != 'summ'){
			id = type + '-task-text';
			element = document.getElementById(id);
			classToggle(element, '_fixed-error');
		}
		return true;
	}
	else {
		id = type + '-input';
		console.log(id, typeof(id));
		element = document.getElementById(id);
		classToggle(element, '_input-error');
		if (type != 'summ') {
			id = type + '-task-text';
			element = document.getElementById(id);
			classToggle(element, '_output-error');
		}
		return false;
	}
};

startTest();
