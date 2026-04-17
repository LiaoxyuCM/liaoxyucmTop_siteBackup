document.addEventListener("DOMContentLoaded", () => {
	function getHashText() {
		const hash = window.location.hash.substring(1);
		return hash || "";
	}
	function setCookie(name, value, days = 30) {
		const date = new Date();
		date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
		const expires = "expires=" + date.toUTCString();
		document.cookie = `${name}=${value}; ${expires}; path=/`;
	}
	function getCookie(name) {
		const nameEQ = `${name}=`;
		const ca = document.cookie.split(';');
		for(let i = 0; i < ca.length; i++) {
			let c = ca[i];
			while (c.charAt(0) === ' ') c = c.substring(1);
			if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
		}
		return null;
	}
	function redirectToHash(newHash) {
		window.location.hash = '#' + newHash;
		handleHashLogic();
	}
	function handleHashLogic() {
		const text = getHashText().trim();
		
		if (text === "") {
			redirectToHash("[StartFromRecent][StartFromScratch]");
		} 
		else if (text.toLowerCase() === "startfromscratch") {
			const curr_number = 0;
			const steps = 1;
			setCookie("number_adder_curr_number", curr_number);
			setCookie("number_adder_steps", steps);
			redirectToHash(`Number:${curr_number},Steps:${steps};[AddNumber][BuySteps]`);
		}
		else if (text.toLowerCase() === "startfromrecent") {
			const curr_number = getCookie("number_adder_curr_number") || 0;
			const steps = getCookie("number_adder_steps") || 1;
			redirectToHash(`Number:${curr_number},Steps:${steps};[AddNumber][BuySteps]`);
		}
		else if (text.toLowerCase() === "addnumber") {
			setCookie("number_adder_returnto", "homepage");
			let curr_number = parseInt(getCookie("number_adder_curr_number")) || 0;
			const steps = parseInt(getCookie("number_adder_steps")) || 1;
			curr_number += steps;
			setCookie("number_adder_curr_number", curr_number);
			setCookie("number_adder_steps", steps);
			redirectToHash(`Number:${curr_number},Steps:${steps};[AddNumber][BuySteps]`);
		}
		else if (text.toLowerCase() === "buysteps") {
			setCookie("number_adder_returnto", "homepage");
			redirectToHash("10numbers=>1step[Buy<Steps:Interger>][Return]");
		}
		else if (/^[Bb][Uu][Yy]([1-9][0-9]*)$/i.test(text)) {
			const matches = text.match(/^Buy([1-9][0-9]*)$/i);
			const option = parseInt(matches[1]);
			let curr_number = parseInt(getCookie("number_adder_curr_number")) || 0;
			let steps = parseInt(getCookie("number_adder_steps")) || 1;
			
			if (curr_number >= (option * 10)) {
				curr_number -= option * 10;
				steps += option;
				setCookie("number_adder_curr_number", curr_number);
				setCookie("number_adder_steps", steps);
				setCookie("number_adder_returnto", "store");
				redirectToHash(`Bought${option}steps|CurrentSteps:${steps};[Return]`);
			} else {
				setCookie("number_adder_returnto", "store");
				redirectToHash("NotEnoughNumbers;[Return]");
			}
		}
		else if (/^[Bb][Uu][Yy]([0123456789\.]*)$/i.test(text)) {
			setCookie("number_adder_returnto", "store");
			redirectToHash("InvalidOption;[Return]");
		}
		else if (text.toLowerCase() === "return") {
			const curr_number = parseInt(getCookie("number_adder_curr_number")) || 0;
			const steps = parseInt(getCookie("number_adder_steps")) || 1;
			const returnTo = getCookie("number_adder_returnto") || "homepage";
			
			if (returnTo === "store") {
				redirectToHash("BuySteps");
			} else {
				redirectToHash(`Number:${curr_number},Steps:${steps};[AddNumber][BuySteps]`);
			}
		}
	}
	window.addEventListener("hashchange", handleHashLogic);
});