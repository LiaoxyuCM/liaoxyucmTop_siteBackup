document.addEventListener("DOMContentLoaded", () => {
    const register = (target, id, suffix, abs_required) => {
        const targetDate = new Date(target);
        const secondsElement = document.getElementById(id);
        
        function updateCountdown() {
            const timeDiff = targetDate - new Date();
            
            const totalSeconds = abs_required ? Math.abs(Math.floor(timeDiff / 1000)) : Math.floor(timeDiff / 1000);
            
            secondsElement.textContent = totalSeconds.toLocaleString() + suffix;
        }
        
        updateCountdown();
        
        setInterval(updateCountdown, 1000);
    };
    register('2025-11-22T08:32:00', 'rthe_issue_report', 's', true);
})