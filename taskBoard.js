let currentNoteDivId = "note-div";
let currentNoteDivIdNumber = 1;
let notesMap = new Map();

let titleElement = document.getElementById("title-input");
let textAreaElement = document.getElementById("note-book-text");
let dateElement = document.getElementById("date");
let timeElement = document.getElementById("time");

loadNotesMap();
loadCurrentNoteDivIdNum();
updateCurrentDiv();
createInitialNotes();
getCurrentDate();

function loadNotesMap() {
    let stringOfNoteMap = localStorage.getItem("notesMap");
    if (stringOfNoteMap != null) {
        notesMap = new Map(JSON.parse(stringOfNoteMap));
    }
}

function loadCurrentNoteDivIdNum() {
    let stringOfCurrentNoteDivIdNum = localStorage.getItem("currentNoteDivIdNumber");
    if (stringOfCurrentNoteDivIdNum != null) {
        currentNoteDivIdNumber = JSON.parse(stringOfCurrentNoteDivIdNum);
    }
}

function createInitialNotes() {
    for (let [noteDivId, noteId] of notesMap.entries()) {
        addNoteToScreen(noteDivId, noteId);
    }
}

function onCreateNoteClicked() {
    let titleValue = titleElement.value;
    let textAreaValue = textAreaElement.value;
    let dateValue = dateElement.value;
    let timeValue = timeElement.value;

    let note = {
        title: titleValue,
        textArea: textAreaValue,
        date: dateValue,
        time: timeValue
    }

    try {
        validateInput(titleElement, titleValue, textAreaElement, textAreaValue, dateElement, dateValue, timeElement, timeValue);
        addNote(note);
        onResetNoteClicked();
    }

    catch (e) {
        console.error(e);
        writeErrorsDetailsToUser(e.message);
    }

}

function writeErrorsDetailsToUser(errorMessage) {

    let errorsParagraphElement = document.createElement("p");
    errorsParagraphElement.setAttribute("id", "errors-paragraph");
    errorsParagraphElement.innerHTML = errorMessage;

    let errorsDivElement = document.getElementById("errors-div");
    errorsDivElement.append(errorsParagraphElement);
}

function validateInput(titleElement, titleValue, textAreaElement, textAreaValue, dateElement, dateValue, timeElement, timeValue) {
    let errorsParagraphElement = document.getElementById("errors-paragraph");
    if (errorsParagraphElement != null) {
        errorsParagraphElement.remove();
    }

    titleElement.style.border = "";
    textAreaElement.style.border = "";
    dateElement.style.border = "";
    timeElement.style.border = "";


    let errorMessage = '';
    if (titleValue == '') {
        errorMessage = errorMessage + "Title can not be empty. <br>";
        titleElement.style.border = "3px solid red";
    }
    else if (titleValue.length < 3) {
        errorMessage = errorMessage + "Title can not be shorter than 3 charthers. <br>";
        titleElement.style.border = "3px solid red";
    }
    else if (titleValue.trim().length < 3) {
        errorMessage = errorMessage + "Invalid title, must contain letters,<br> (at least 3).<br>";
        titleElement.style.border = "3px solid red";
    }
    else if (!isValidTitle(titleValue)) {
        errorMessage = errorMessage + "Invalid title, must contain letters.<br>";
        titleElement.style.border = "3px solid red";
    }

    if (textAreaValue == '') {
        errorMessage = errorMessage + "Note Book can not be empty. <br>";
        textAreaElement.style.border = "3px solid red";
    }
    else if (textAreaValue.length < 3) {
        errorMessage = errorMessage + "Note Book can not be shorter than 3 charthers. <br>";
        textAreaElement.style.border = "3px solid red";
    }
    else if (textAreaValue.trim().length < 3) {
        errorMessage = errorMessage + "Invalid note book, must contain numbers or letters,<br> (at least 3).<br>";
        textAreaElement.style.border = "3px solid red";
    }
    else if (!isValidTextAreaFill(textAreaValue)) {
        errorMessage = errorMessage + "Invalid note book, must contain numbers or letters.<br>";
        titleElement.style.border = "3px solid red";
    }

    if (dateValue == '') {
        errorMessage = errorMessage + "Date can not be empty. <br>";
        dateElement.style.border = "3px solid red";
    }
    else {
        let tempDate = new Date(dateValue);
        if (tempDate.getFullYear() < 2022) {
            errorMessage = errorMessage + "date is invalid. <br>"
        }
    }
    if (timeValue == '') {
        errorMessage = errorMessage + "Time can not be empty. <br>";
        timeElement.style.border = "3px solid red";
    }
    if (errorMessage != '') {
        throw new Error(errorMessage);
    }

}

function isChar(char) {
    return RegExp(/^\p{L}/, 'u').test(char);
}

function isValidTitle(titleValue) {
    let isCharFound = false;
    for (let index = 0; index < titleValue.length; index++) {
        if (isChar(titleValue.charAt(index))) {
            isCharFound = true;
        }
        if (isCharFound) {
            return true;
        }
    }
    return false;
}


function isValidTextAreaFill(textAreaValue) {
    let isCharFound = false;
    let isDigitFound = false;
    for (let index = 0; index < textAreaValue.length; index++) {
        if (+textAreaValue.charAt(index) >= 0 && +textAreaValue.charAt(index) <= 9) {
            isDigitFound = true;
        }
        else if (isChar(textAreaValue.charAt(index))) {
            isCharFound = true;
        }
        if (isCharFound || isDigitFound) {
            return true;
        }
    }
    return false;
}

function addNote(note) {
    notesMap.set(currentNoteDivId, note);
    saveNotesMapToDisk();
    addNoteToScreen(currentNoteDivId, note);
    currentNoteDivIdNumber++;
    updateCurrentDiv();
    saveCurrentDivIdNumToDisk();
}

function addNoteToScreen(currentNoteDivId, note) {

    let noteDivElement = document.createElement("div");
    noteDivElement.setAttribute("class", "note");
    noteDivElement.setAttribute("id", currentNoteDivId);
    noteDivElement.addEventListener("mouseenter", function (event) {
        event.currentTarget.classList.add("my-note");

    })

    let noteImgElement = document.createElement("img");
    noteImgElement.setAttribute("src", "pictures/resizedNote.png");

    let noteTitleElement = document.createElement("p");
    noteTitleElement.setAttribute("id", "note-title");
    noteTitleElement.innerHTML = note.title;

    let noteTextElement = document.createElement("p");
    noteTextElement.setAttribute("id", "note-text");
    noteTextElement.innerHTML = note.textArea;

    let noteDateElement = document.createElement("p");
    noteDateElement.setAttribute("id", "note-date");
    noteDateElement.innerHTML = note.date;


    let noteTimeElement = document.createElement("p");
    noteTimeElement.setAttribute("id", "note-time");
    noteTimeElement.innerHTML = note.time;

    let noteEraseLogoElement = document.createElement("span");
    noteEraseLogoElement.setAttribute("class", "glyphicon glyphicon-remove-circle")

    let noteEraseButtonElement = document.createElement("button");
    noteEraseButtonElement.setAttribute("class", "remove-note");
    noteEraseButtonElement.setAttribute("onclick", "onEraseNoteClicked(this)");

    noteEraseButtonElement.append(noteEraseLogoElement);

    noteDivElement.append(noteImgElement);
    noteDivElement.append(noteTitleElement);
    noteDivElement.append(noteTextElement);
    noteDivElement.append(noteDateElement);
    noteDivElement.append(noteTimeElement);
    noteDivElement.append(noteEraseButtonElement)

    let notesDivElement = document.getElementById("notes");

    notesDivElement.append(noteDivElement);
}

function updateCurrentDiv() {
    currentNoteDivId = "note-div" + currentNoteDivIdNumber;

}

function saveNotesMapToDisk() {
    localStorage.setItem("notesMap", JSON.stringify(Array.from(notesMap.entries())));
}

function saveCurrentDivIdNumToDisk() {
    localStorage.setItem("currentNoteDivIdNumber", JSON.stringify(currentNoteDivIdNumber));
}

function onResetNoteClicked() {
    let errorsParagraphElement = document.getElementById("errors-paragraph");
    if (errorsParagraphElement != null) {
        errorsParagraphElement.remove();
    }

    titleElement.value = "";
    titleElement.style.border = "";
    textAreaElement.value = "";
    textAreaElement.style.border = "";
    dateElement.value = "";
    dateElement.style.border = "";
    timeElement.value = "";
    timeElement.style.border = "";

}

function onEraseNoteClicked(buttonElement) {
    let noteDivElement = buttonElement.parentElement;
    let noteDivId = noteDivElement.id;

    notesMap.delete(noteDivId);
    noteDivElement.remove();
    saveNotesMapToDisk();
}

function getCurrentDate() {
    let today = new Date();
    let day = String(today.getDate()).padStart(2, '0');
    let month = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let year = today.getFullYear();

    today = year + '-' + month + '-' + day;

    dateElement.setAttribute("min", today);
}
