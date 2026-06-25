// --- System Clock Engine ---
function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    
    // Add leading zero if single digit (e.g., 9:05 instead of 9:5)
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    
    // Push the time to the HTML
    document.getElementById('system-clock').textContent = hours + ':' + minutes;
}

// Start the clock immediately, then update every 1000 milliseconds (1 second)
updateClock();
setInterval(updateClock, 1000);

