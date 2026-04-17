document.addEventListener('DOMContentLoaded', () => {
	const config = {
		dotCount: Math.floor(window.innerWidth / 19.2),
		speed: 20,
		minSize: 1,
		maxSize: 6,
		minDistance: 50,
		maxDistance: Math.min(window.innerWidth, window.innerWidth)
	};
	let centerX = window.innerWidth / 2;
	let centerY = window.innerHeight / 2;
	const dots = [];
	function createDots() {
		for (let i = 0; i < config.dotCount; i++) {
			const size = Math.random() * (config.maxSize - config.minSize) + config.minSize;
			const brightness = Math.floor(Math.random() * 80) + 20;
			const distance = Math.random() * (config.maxDistance - config.minDistance) + config.minDistance;
			const initialAngle = Math.random() * Math.PI * 2;
			
			const star = document.createElement('div');
			star.classList.add('star');
			
			star.style.width = `${size}px`;
			star.style.height = `${size}px`;
			star.style.backgroundColor = `rgba(255, 255, 255, ${brightness / 100})`;
			
			const x = centerX + Math.cos(initialAngle) * distance;
			const y = centerY + Math.sin(initialAngle) * distance;
			
			star.style.left = `${x}px`;
			star.style.top = `${y}px`;
			star.style.boxShadow = `0 0 5px rgba(255, 255, 255, ${brightness / 100})`;
			star.style.zIndex = '0';
			
			dots.push({
				element: star,
				distance,
				angle: initialAngle,
				size,
				brightness
			});
			
			document.body.appendChild(star);
		}
	}
	let lastTime = 0;
	function animate(currentTime) {
		const deltaTime = (currentTime - lastTime) / 1000;
		lastTime = currentTime;
		
		if (deltaTime > 1) {
			requestAnimationFrame(animate);
			return;
		}
		
		dots.forEach(star => {
			const arcLength = config.speed * deltaTime;
			const angleDelta = arcLength / star.distance;
			star.angle += angleDelta;
			
			const x = centerX + Math.cos(star.angle) * star.distance;
			const y = centerY + Math.sin(star.angle) * star.distance;
			
			star.element.style.left = `${x}px`;
			star.element.style.top = `${y}px`;
		});
		
		requestAnimationFrame(animate);
	}
	function handleResize() {
		centerX = window.innerWidth / 2;
		centerY = window.innerHeight / 2;
		
		dots.forEach(star => {
			const x = centerX + Math.cos(star.angle) * star.distance;
			const y = centerY + Math.sin(star.angle) * star.distance;
			star.element.style.left = `${x}px`;
			star.element.style.top = `${y}px`;
		});
	}
	function init() {
		createDots();
		lastTime = performance.now();
		requestAnimationFrame(animate);
		
		window.addEventListener('resize', handleResize);
	}
	window.addEventListener('load', init);
})