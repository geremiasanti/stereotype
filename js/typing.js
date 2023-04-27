// CONSTANTS 
const DEBUG = true;
const ANIMATE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-+/*&%$#@_(){}[]|?!~<>     ';
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
	constructor(char, status, i){
    	this.char = char;
        this.status = status; 
        this.i = i;
        this.htmlElement = null;
    }

    fromHtmlElement(element) {
        this.char = element.text();
        this.status = element.attr('status');
        this.i = element.attr('i');
        this.htmlElement = element;
        return this;
    };

    toHtmlElement() {
        return `<span i="${this.i}" status="${this.status}" what="char">${this.char}</span>`;
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
                color = 'white';
                break;
            case CHAR_STATUSES['wrong']:
                color = 'red'
                break;
        }

        if (DEBUG) console.debug(`New status: ${newStatus}\nColor ${color}`);

        this.htmlElement.css('color', color);
        return this;
    }
  
    animateIn(steps) {
        steps = (typeof(steps) == 'undefined') 
            ? 5 + (parseInt(this.i) % 15)
            : steps;

        if(steps == 0) {
            this.htmlElement.html(this.char);
            return; 
        }

        this.htmlElement.html(
            ANIMATE_CHARS.charAt(
                Math.floor(Math.random() * ANIMATE_CHARS.length)
            )
        );
        
        let this_ = this;
        setTimeout(function() { 
            this_.animateIn(steps - 1)
        }, Math.floor(
            Math.random() * 80 + 30
        ));
    }
}

// GLOABAL VARIABLES
let caret, stringDiv;

// MAIN
$(function() {
    stringDiv = $('div#string');
    
    setupString(stringDiv, getNextString());
    drawCaret();
    
    $(document).on('keypress, keydown', function(event) {
        handleKeypress(event);
        drawCaret();
    }); 
});

// FUNCTIONS
function setupString(element, stringIn) {
    let stringOut = '';

    // every char is surrounded by a span
    for (var i = 0; i < stringIn.length; i++) {
        stringOut += new Char(
            stringIn.charAt(i), 
            CHAR_STATUSES['missing'],
            i
        ).toHtmlElement();
    }
    
    // put the string in the div
    element.css('color', 'gray');
    element.html(stringOut);

    // trigger animation on all Chars
    let chars = getChars();
    chars.forEach(function(char) {
        char.animateIn();
    })

    // set the caret at the beginning of the string
    caret = 0;
}

function handleKeypress(event) {
    let key = event.key;

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

function getChars() {
    let charsOut = [];
    let htmlElements = stringDiv.children('span[what="char"]');
    htmlElements.each(function() {
        charsOut.push(
            new Char().fromHtmlElement($(this))
        )
    })
    return charsOut;
}

function getCharByIndex(i) {
    return new Char().fromHtmlElement(
        stringDiv.children('span[what="char"]').eq(i)
    );
}

function drawCaret() {
    //if ()
    $('<span class="blinking-cursor">|</span>').insertBefore(
        getCharByIndex(caret).htmlElement
    )
}

function getNextString() {
    return 'Cheese and wine macaroni cheese cheese and biscuits. Emmental cheese strings cow cheeseburger cheese strings bocconcini macaroni cheese mascarpone.'
}

