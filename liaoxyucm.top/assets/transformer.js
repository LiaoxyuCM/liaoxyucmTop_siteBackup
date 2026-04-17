document.addEventListener("DOMContentLoaded", () => {
	const allTransformers = document.querySelectorAll("transformer");
	const allTransformerRedirects = document.querySelectorAll("transformer-redirect");
	allTransformers.forEach((transformer) => {
		transformer.style.transform = `translate(${transformer.getAttribute("x")*2000-50}%, ${transformer.getAttribute("y")*2000-50}%)`;
	});
	allTransformerRedirects.forEach((transformerredirect) => {
		transformerredirect.addEventListener("click", () => {
			allTransformers.forEach((transformer) => {
				transformer.setAttribute("x", String(Number(transformer.getAttribute("x"))-Number(transformerredirect.getAttribute("x"))));
				transformer.setAttribute("y", String(Number(transformer.getAttribute("y"))-Number(transformerredirect.getAttribute("y"))));
				transformer.style.transform = `translate(${transformer.getAttribute("x")*2000-50}%, ${transformer.getAttribute("y")*2000-50}%)`;
			});
		});
	})
});