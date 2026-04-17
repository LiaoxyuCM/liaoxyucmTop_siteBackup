import { Trawpaw } from "./trawpaw.js";

document.addEventListener("DOMContentLoaded", () => {
	const trawpaw = new Trawpaw();
	const inputbar = document.querySelector(".eng-c");
	const executebutton = document.querySelector(".execute");
	const clhisbutton = document.querySelector(".clhis");
	const resultbar = document.querySelector(".eng-d");

	executebutton.addEventListener("click", async() => {
		let result = await trawpaw.execute(inputbar.value);
		if (result["status"] === 1) {
			resultbar.style.color = "#f22";
			resultbar.value = result["message"];
		} else {
			resultbar.style.color = "#fff";
			resultbar.value = result["result"];
		};
	});
	clhisbutton.addEventListener("click", () => {
		trawpaw.clearHistory();
		resultbar.style.color = "#2f2";
		resultbar.value = "Cleared History";
	});
});