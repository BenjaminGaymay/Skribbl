var WORDS = readTextFile(browser.extension.getURL("words/french.txt")).split("\n");
var me;
var possibilities = [];


function findActivePlayer() {
	var players = document.getElementsByClassName("name");

	for (let elem of players) {
		if (elem.textContent.endsWith("(You)")) {
			me = elem.parentElement.parentElement;
			break;
		};
	};
	return (me ? addWordList() : setTimeout(findActivePlayer, 500));
};


function addWordList() {

	if (!document.getElementById("wordDiv")) {
		var wordDiv = document.createElement("div");
		wordDiv.id = 'wordDiv';
		wordDiv.classList.add("container");
		wordDiv.classList.add("text-center");
		wordDiv.style.marginBottom = "2%";
		var wordInfos = document.createElement("h3");
		wordInfos.id = "wordInfos";
		wordInfos.style.color = "#fff";
		wordInfos.style.marginBottom = "2%";
		var wordList = document.createElement("div");
		wordList.id = 'wordList';

		wordDiv.appendChild(wordInfos);
		wordDiv.appendChild(wordList);
		document.getElementsByTagName('body')[0].appendChild(wordDiv);

	};

	fillWordList(wordInfos, wordList, "");
};


function writeWord() {

	var chat = document.getElementById("inputChat");

	chat.value = this.textContent;
	chat.focus();

	chat.dispatchEvent(new KeyboardEvent("keydown", { keyCode: 13 }));
	chat.dispatchEvent(new KeyboardEvent("keypress", { keyCode: 13 }));
	chat.dispatchEvent(new KeyboardEvent("keyup", { keyCode: 13 }));

};


function fillWordList(wordInfos, wordList, clue) {

	setTimeout(function () {

		if (clue !== document.getElementById("currentWord").textContent.toLowerCase()) {

			while (wordList.firstChild) {
				wordList.removeChild(wordList.firstChild);
			};

			clue = document.getElementById("currentWord").textContent.toLowerCase();
			sortWithClue(clue);

			switch (possibilities.length) {
				case 0: wordInfos.textContent = ""; break;
				case 1: wordInfos.textContent = possibilities[0] === "" ? "" : "Il y 1 mot possible :"; break;
				default: wordInfos.textContent = "Il y a " + possibilities.length.toString() + " mots possibles :";
			};

			for (let word of possibilities) {
				if (word != "") {
					var newWord = document.createElement("button");
					newWord.classList.add("btn");
					newWord.classList.add("btn-primary");
					newWord.style.marginLeft = "5px";
					newWord.style.marginBottom = "3px";
					newWord.textContent = word;
					newWord.onclick = writeWord;
					wordList.appendChild(newWord);
				};
			};
		};

		fillWordList(wordInfos, wordList, clue);

	}, 500);
};


function sortWithClue(clue) {

	if (!document.getElementById("screenGame").offsetParent) {
		possibilities = [];
		return;
	}

	sortByLength(clue);
	sortByLetters(clue);
	sortBySpecialCaracters(clue);
};


function sortByLength(clue) {

	possibilities = [];
	for (let word of WORDS) {
		if (word.length == clue.length) {
			possibilities.push(word);
		};
	};
};


function sortByLetters(clue) {

	var sortPossibilities = [];

	var knownLetters = [];
	for (let i in clue) {
		if (clue[i] != '_') {
			knownLetters.push([i, clue[i]]);
		};
	};

	var tmp = [];
	var goodLetters = 0;
	for (let word of possibilities) {
		stop = false;
		tmp = getLettersIndex(word);
		goodLetters = 0;
		for (var i = 0 ; i < knownLetters.length ; i++) {
			if (isInArray(tmp, knownLetters[i])) {
				goodLetters += 1;
			} else {
				break;
			};
		};
		if (goodLetters == knownLetters.length) {
			sortPossibilities.push(word);
		};
	};
	possibilities = sortPossibilities;
};


function sortBySpecialCaracters(clue) {

	var sortPossibilities = [];
	var knownLetters = [];

	for (let i in clue) {
		knownLetters.push([i, clue[i]]);
	};

	for (let word of possibilities) {
		tmp = getSpecialCharacters(word);
		goodLetters = 0;
		for (var i = 0 ; i < tmp.length ; i++) {
			if (isInArray(knownLetters, tmp[i])) {
				goodLetters += 1;
			} else {
				break;
			};
		};
		if (goodLetters == tmp.length) {
			sortPossibilities.push(word);
		};
	};
	possibilities = sortPossibilities;
};


function isInArray(array, pair) {
	for (let elem of array) {
		if (JSON.stringify(elem) == JSON.stringify(pair)) {
			return true;
		};
	};
	return false;
};


function getLettersIndex(word) {
	var letters = [];

	for (let i in word) {
		letters.push([i, word[i]]);
	};
	return letters;
};


function getSpecialCharacters(word) {
	var letters = [];

	for (let i in word) {
		if (word[i] === " " || word[i] === "-") {
			letters.push([i, word[i]]);
		};
	};
	return letters;
};

function readTextFile(file) {
	var allText = ""
	var rawFile = new XMLHttpRequest();
	rawFile.open("GET", file, false);
	rawFile.onreadystatechange = function () {
		if(rawFile.readyState === 4) {
			if(rawFile.status === 200 || rawFile.status == 0) {
				allText = rawFile.responseText;
			};
		};
	};
	rawFile.send(null);
	return allText;
};

findActivePlayer();
