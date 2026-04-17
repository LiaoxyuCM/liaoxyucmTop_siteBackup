document.addEventListener(
	"DOMContentLoaded", () => {
		const date = new Date();
		if (date.getMonth() === 11 && date.getDate() === 13) { // Dec 13 only
			document.body.classList.add('grayscale-mode');
		document.body.style.backgroundImage = "linear-gradient(#222, #444)"
		};
	}
)