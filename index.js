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

	function NextStage(stageId) { //Функция запускающая стадии решения 
		var start,  //Длина первой стрелки
			shift,  //Отсутп от начал 
			element, 
			type, // Стадия решения
			answer; //Правильный ответ

		switch(stageId){
			case 1:
				start = term1px;
				shift = 0;
				element = input1;
				type = 'term1'; //Стадия нахождения првого слогаемого
				answer = term1sm;
			break;
			case 2:
				start = term2px;
				shift = term1px;
				element = input2;
				type = 'term2'; //Стадия нахождения второго слогаемого
				answer = term2sm;
			break;
			case 3:
				element = input3;
				type = 'summ'; //Стадия нахождения решения
				answer = summSm;
			break;
			default:
					return
				break;
		}
		outputArr(start, shift, element); //Запускаем отрисовку инпута и стрелки
		element.addEventListener('input', function(){ // Можно заменить на change, из условий точно не понятно как лучше
			verificationState(stageId, element, type, answer); //Проверка стадии решения 
		});
	}

	function verificationState(stageId, element, type, answer){ //Проверка стадии решения
		resultVerification = verificationValue(element.value, answer, type); //Проверка введенного ответа
		if (resultVerification == true){ 
			element.removeEventListener('input', function(){
				verificationState(stageId, element, type, answer);
			});
			stageId ++; //Увеличеваем номер стадии 
			NextStage(stageId); //Запускаем следующую стадию
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
	

	NextStage(stageId); //Запускаем первую стадию решения 
}

 
function outputArr (start, shift, input){ //Отрисовка функии 
	var	marginSide = (start/2 - 10),  //Считаем отступ сверху/снизу от инпута 
		marginBott = 234 - start/3.7; //Считаем отступ слева/справа от инпута 

	function drawArr(start, shift){ //Функция отрисовки стрелки 
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

	if(input.id == 'summ-input'){  //Если элемент интпут для ввода ответа выводм только его без стрелки и не меняем отсутп 
		document.getElementById('summ-text').classList.toggle('task-list__item_visible');
		input.classList.toggle('task-list__item_visible');
	}
	else { 
		drawArr(start, shift);  //Выводим сттрелку 
		input.style.margin = marginBott + 'px ' +  marginSide + 'px ' + '-' + marginBott + "px"; //Задаем отсутуп инпута 
		input.classList.add('canvas-box__item_visible'); //Выводим инпут
	}
};



function verificationValue (value, answer, type) { //Проверка ответа 
	var id,  
		element,
		marginSide = answer*39/2 -10,
		marginBott = 234 - answer*39/3.7;
		console.log(value, answer);
	function classToggle(element, classId){ //Функция переключения классов 
		var	className;
		className = element.classList[0] + classId; //Получаем класс элемента 
		 //(Так как классы названы по БЭМ первый клас всегда название блока и элемента далее добовляем к нему название модификатора из classId)
		switch(classId){  // В зависимости от идификатора класса преключаем/удаляем нужные 
 
		case '_visible': //Класс убирает видимость блока 
			console.log(classId)
			element.classList.toggle(className);
			console.log(className, element.className)
			break;
		case '_fixed-error': //Клас исправленной ошибки 
			className = element.classList[0] + '_output-error';
			element.classList.remove(className);
			break;
		default: //Все классы ошибок 
			element.classList.add(className);
			break;
		}
	}
	if (value == answer) { //Проверка верности ответа 
		id = type + "-input"; //Плучем id элемента 
		element = document.getElementById(id)
		classToggle(element, '_visible'); //Запускаем переключение класа _visible
		
		id = type + "-text";
		element = document.getElementById(id)
		element.textContent = answer;
		if(type != 'summ'){ //Задаем отсуп для вывода правильного ответа 
			element.style.margin = marginBott + 'px ' +  marginSide + 'px ' + '-' + marginBott + "px";

		} 
		classToggle(element, '_visible'); 
		if(type != 'summ'){ // выключаем подсветку ошибки 
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
		classToggle(element, '_input-error'); // Меняем цвет текса ипута в случае ошибки на красный 
		if (type != 'summ') { //Подсвечиваем ошибку в примере 
			id = type + '-task-text';
			element = document.getElementById(id);
			classToggle(element, '_output-error'); 
		}
		return false;
	}
};

startTest();
