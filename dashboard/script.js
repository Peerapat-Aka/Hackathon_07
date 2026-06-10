document.addEventListener('DOMContentLoaded', () => {
    // 1. Populate Overview Stats
    document.getElementById('total-attacks').textContent = dashboardData.overview.totalAttacks;
    document.getElementById('timeframe').textContent = dashboardData.overview.timeframe;
    document.getElementById('unique-ips').textContent = dashboardData.overview.uniqueIPs;

    // 2. Populate IP Table
    const tableBody = document.querySelector('#ip-table tbody');
    dashboardData.ips.forEach(ipData => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${ipData.ip}</td>
            <td>${ipData.count.toLocaleString()}</td>
            <td>${ipData.first}</td>
            <td>${ipData.last}</td>
        `;
        tableBody.appendChild(row);
    });

    // 3. Populate Pattern
    document.getElementById('pattern-status').textContent = dashboardData.pattern.status;
    document.getElementById('pattern-size').textContent = dashboardData.pattern.size;
    document.getElementById('pattern-desc').textContent = dashboardData.pattern.description;

    // 4. Typing Animation for Hidden Bonus
    const typedTextElement = document.getElementById('typed-message');
    const hackerReveal = document.getElementById('hacker-reveal');
    const hackerNameElement = document.getElementById('hacker-name');
    
    const message = dashboardData.hackerMessage;
    hackerNameElement.textContent = dashboardData.hackerName;
    hackerNameElement.setAttribute('data-text', dashboardData.hackerName);

    let index = 0;
    const typingSpeed = 30; // ms per character

    // Only start typing when the terminal comes into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(typeWriter, 1000);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    observer.observe(document.getElementById('terminal-body'));

    function typeWriter() {
        if (index < message.length) {
            typedTextElement.textContent += message.charAt(index);
            index++;
            setTimeout(typeWriter, typingSpeed);
        } else {
            // Typing finished, reveal hacker name
            setTimeout(() => {
                hackerReveal.classList.remove('hidden');
            }, 500);
        }
    }
});
