// CONSTANTS 
const DEBUG = true;
const KEYS_TO_IGNORE = [
    'Alt',
    'Control',
    'Shift',
    'CapsLock',
];
const CHAR_STATUSES = {
    'missing': 0,
    'correct': 1,
    'wrong': 2,
};

// CLASSES
class Char{
	constructor(char, status){
    	this.char = char;
        this.status = status; 
        this.htmlElement = null;
    }

    fromHtmlElement(element) {
        this.char = element.text();
        this.status = element.attr('status');
        this.htmlElement = element;
        return this;
    };

    toHtmlElement() {
        return `<span status="${this.status}">${this.char}</span>`;
    };

    updateStatus(newStatus) {
        if (this.htmlElement == null) throw new Error(
            'Called update status but htmlElement is not set'
        ); 

        this.status = newStatus;
        this.htmlElement.attr('status', newStatus);
        let color;
        switch (newStatus) {
            case CHAR_STATUSES['missing']:
                color = 'gray';
                break;
            case CHAR_STATUSES['correct']:
                color = 'green';
                break;
            case CHAR_STATUSES['wrong']:
                color = 'red'
                break;
        }

        if (DEBUG) console.debug(`New status: ${newStatus}\nColor ${color}`);

        this.htmlElement.css('color', color);
        return this;
    }
}

// GLOABAL VARIABLES
let caret, stringDiv;

// MAIN
$(function() {
    stringDiv = $('div#string');
    
    setupString(stringDiv, getNextString());
    
    $(document).on('keypress, keydown', function(event) {
        handleKeypress(event.key, event);
    }); 
});

// FUNCTIONS
function setupString(element, stringIn) {
    let stringOut = '';

    //every char is surrounded by a span
    for (var i = 0; i < stringIn.length; i++) {
        stringOut += new Char(
            stringIn.charAt(i), 
            CHAR_STATUSES['missing']
        ).toHtmlElement();
    }
    
    //put the string in the div
    element.css('color', 'gray');
    element.html(stringOut);

    //set the caret at the beginning of the string
    caret = 0;
}

function handleKeypress(key, event) {
    if (KEYS_TO_IGNORE.includes(key)) return;

    let nextChar = getCharByIndex(caret); 
    let prevChar = (caret > 0) ? getCharByIndex(caret - 1) : new Char();

    if (DEBUG) console.debug(`Prev char: ${prevChar.char} - ${caret} - Next char: ${nextChar.char}`);
    if (DEBUG) console.debug(`Typed key: ${key}\n`);

    switch (key) {
        // reset
        case 'Tab':
            event.preventDefault();
            setupString(stringDiv, getNextString());
            break
        // delete
        case 'Backspace':
            if (caret <= 0) break;
            prevChar.updateStatus(CHAR_STATUSES['missing']); 
            caret--;
            break
        default:
            if(key == nextChar.char) {
                nextChar.updateStatus(CHAR_STATUSES['correct']); 
            } else {
                nextChar.updateStatus(CHAR_STATUSES['wrong']); 
            }
            caret++;
            break;
    }
}

function getCharByIndex(i) {
    return new Char().fromHtmlElement(
        stringDiv.children('span').eq(i)
    );
}

function getNextString() {
    return 'Cheese and wine macaroni cheese cheese and biscuits. Emmental cheese strings cow cheeseburger cheese strings bocconcini macaroni cheese mascarpone.'
}

