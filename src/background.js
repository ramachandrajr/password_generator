/*
 *  This script does all the calculations.
 *  This script can only listen to messages
 * and send response.
*/



// ==========
// 1 - PASSWORD CREATOR.
// ==========

// MAKING PASSWORD

/*  This function returns random characters.
 *  @params {String} charType  This is used to specify the character type to select.
 */
 
var randChar = (function (charType) {

	// character data
	var alpha = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"],		
		numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
		alphaNumers = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
		symbols = ["!", "@", "#", "$", "%", "^", "&", "*", "(", ")"],
		allChars = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "*", "(", ")", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "1", "2", "3", "4", "5", "#", "$", "%", "6", "7", "8", "9", "!", "@", "^", "&"];
	// Will hold the selected charset.
	var selectedCharset = [];

	// Select characters according to chartype.
	switch (charType) {
		case "alpha":
			selectedCharset = alpha;
			break;
		case "alpha-numeric":
			selectedCharset = alphaNumers;		
			break;
		case "numeric":
			selectedCharset = numbers;
			break;
		case "symbol":
			selectedCharset = symbols;
			break;
		case "all":
			selectedCharset = allChars;		
			break;
		default: 
			selectedCharset = allChars;		
	}

	// Choose a random number.
	var randNum = Math.floor(Math.random() * selectedCharset.length);
	// Return that random character.
	return (selectedCharset[randNum]);
});


/*  Creates a password.
 *  @params {Number} len       This specifies the length of the password.
 *  @params {String} charType  This is used to specify the character type to select.
 */

var makePassword = (function (len, charType) {

	// Set password.len to 10.
	password.len = len 
	// Set password value to null.
	password.value = "";
	// Iterate multiple times.
	for (var i = 0; i < password.len; i++) {
		password.value += randChar(charType);
	}
	// addListeners();

});



/*  SEND PASSWORD
 *  @param {Object} sendRes Method to send response to the requester.
 *  We will be carrying this object all script long to avoid confusion.
*/

// Calling make password.
var init = function(sendRes) {

	// Create password.
	makePassword(10, "all");
	// Fill in password in data property.
	msgObj.msg.data = password.value;
	// Send data to popup.js
	sendRes(msgObj);

	// Injecting our own scripts, these will display password in a
	// div directly appended to page body.
	// Get tab details.
	chrome.tabs.query(tabsQuery, function(tabs) {
		var activeTab = tabs[0];
		// Inject main script.
		chrome.tabs.executeScript(activeTab.id, {
			file: "password.js"
		});	
		// Inject CSS
		chrome.tabs.insertCSS(activeTab.id, {
			file: "content.css"
		})
	});

};





	

// ==========
// 0 - DEAL WIH MESSAGES.
// ==========

// GLOBALS

// Message structure.
var msgObj = {
	src: "background.js",
	msg: {
		value: null,
		data: null
	},
	error: {
		value: null
	}
};
// Password object.
var password = {
	value: "",
	len: 0
};
// Declare an object, this will be used to query,
// present tab id.
tabsQuery = {
	currentWindow: true,
	active: true
};




/* MESSAGE EVENT LISTENER
 *  @param {Object} req     Holds the structured message from any script.
 *  @param {Object} n       Request sender data. But we'll use our own structure.
 *  @param {Object} sendRes Method to send response to the requester.
 */
// Event listener for messages.
chrome.runtime.onMessage.addListener(function(req, n, sendRes) {
	try {

		// IF SRC IS POPUP JS.
		if (req.src === "popup.js") {
			// Looking at message.
			switch (req.msg.value) {
				// If popup says - INIT
				case "init":
					init(sendRes);
					break;
				case "get-existing-pass":
					// Fill in password in data property.
					msgObj.msg.data = password.value;
					sendRes(msgObj);
					break;
			}			
		} 
		// If src is password.
		else if (req.src === "password.js") {
			// Looking at message.
			switch (req.msg.value) {
				// If popup says - need 
				case "need-pass":
					// Fill in password in data property.
					msgObj.msg.data = password.value;
					sendRes(msgObj);
					break;
			}
		}
		// If not any of the above.
		else {
			throw "Password request from an unknown source.";
		}

	}
	catch(err) {
		console.warn("Error: " + err);
	}

});


