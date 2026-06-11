const geoDb = {
    "119.123.55.141": { country: "China 🇨🇳", isp: "China Telecom", risk: "CRITICAL" },
    "12.104.185.44": { country: "United States 🇺🇸", isp: "AT&T Internet Services", risk: "CRITICAL" },
    "131.33.12.73": { country: "Germany 🇩🇪", isp: "PlusServer GmbH", risk: "CRITICAL" },
    "139.94.203.41": { country: "Australia 🇦🇺", isp: "Telstra Services", risk: "CRITICAL" },
    "14.121.165.122": { country: "Japan 🇯🇵", isp: "NTT Communications", risk: "CRITICAL" },
    "14.252.124.193": { country: "Vietnam 🇻🇳", isp: "Viettel Group", risk: "CRITICAL" },
    "148.9.19.27": { country: "United Kingdom 🇬🇧", isp: "British Telecom", risk: "CRITICAL" },
    "162.240.218.117": { country: "United States 🇺🇸", isp: "Unified Layer", risk: "CRITICAL" },
    "187.91.79.110": { country: "Brazil 🇧🇷", isp: "Claro Brasil", risk: "CRITICAL" },
    "196.45.2.86": { country: "South Africa 🇿🇦", isp: "MTN South Africa", risk: "CRITICAL" },
    "197.82.237.190": { country: "Nigeria 🇳🇬", isp: "Spectranet Ltd", risk: "CRITICAL" },
    "199.242.130.73": { country: "Canada 🇨🇦", isp: "Rogers Communications", risk: "CRITICAL" },
    "199.71.56.65": { country: "United States 🇺🇸", isp: "Verizon Fios", risk: "CRITICAL" },
    "202.129.225.117": { country: "Thailand 🇹🇭", isp: "AIS Fibre", risk: "CRITICAL" },
    "209.103.8.44": { country: "United States 🇺🇸", isp: "Charter Communications", risk: "CRITICAL" },
    "211.92.75.1": { country: "South Korea 🇰🇷", isp: "SK Broadband", risk: "CRITICAL" },
    "215.143.100.205": { country: "United States 🇺🇸", isp: "US DoD Network", risk: "CRITICAL" },
    "80.130.43.26": { country: "Germany 🇩🇪", isp: "Deutsche Telekom AG", risk: "CRITICAL" },
    "95.125.101.128": { country: "Russia 🇷🇺", isp: "Rostechnologies (Rostelecom)", risk: "CRITICAL" }
};

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
    
    // 3.1. Populate Data Analysis & Render Chart
    renderAnalysis();

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

// 5. Data Analysis & Geolocation Function
function renderAnalysis() {
    const ips = dashboardData.ips;
    const totalAttacks = ips.reduce((sum, item) => sum + item.count, 0);
    
    // Find Top Contributor
    const sortedIps = [...ips].sort((a, b) => b.count - a.count);
    const topIP = sortedIps[0];
    document.getElementById('top-contributor').innerHTML = `${topIP.ip} <span class="attack-badge">${topIP.count.toLocaleString()} attacks</span>`;
    
    // Average Accesses
    const avgAccesses = Math.round(totalAttacks / ips.length);
    document.getElementById('avg-accesses').textContent = `${avgAccesses.toLocaleString()} requests`;
    
    // Attack Window
    let earliest = ips[0].first;
    let latest = ips[0].last;
    ips.forEach(item => {
        if (item.first < earliest) earliest = item.first;
        if (item.last > latest) latest = item.last;
    });
    document.getElementById('attack-window').textContent = `${earliest} to ${latest}`;
    
    // Populate Geo Table
    const geoTableBody = document.querySelector('#geo-table tbody');
    sortedIps.forEach(ipData => {
        const geoInfo = geoDb[ipData.ip] || { country: "Unknown", isp: "Unknown Services", risk: "HIGH" };
        const share = ((ipData.count / totalAttacks) * 100).toFixed(2);
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${ipData.ip}</td>
            <td>${geoInfo.country}</td>
            <td>${geoInfo.isp}</td>
            <td><span class="share-text">${share}%</span></td>
            <td><span class="badge ${geoInfo.risk.toLowerCase()}">${geoInfo.risk}</span></td>
        `;
        geoTableBody.appendChild(row);
    });

    // Render Chart.js Chart
    const ctx = document.getElementById('ipChart').getContext('2d');
    
    // Neon gradient colors
    const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim() || '#f72585';
    const secondaryColor = getComputedStyle(document.documentElement).getPropertyValue('--secondary-color').trim() || '#4cc9f0';
    
    const chartLabels = sortedIps.map(item => item.ip);
    const chartDataValues = sortedIps.map(item => item.count);
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: chartLabels,
            datasets: [{
                label: 'Access Count',
                data: chartDataValues,
                backgroundColor: 'rgba(76, 201, 240, 0.15)',
                borderColor: secondaryColor,
                borderWidth: 1.5,
                hoverBackgroundColor: 'rgba(247, 37, 133, 0.35)',
                hoverBorderColor: primaryColor,
                borderRadius: 4
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: '#16181c',
                    titleColor: '#4cc9f0',
                    bodyColor: '#e0e1dd',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderWidth: 1,
                    callbacks: {
                        label: function(context) {
                            return ` Attacks: ${context.parsed.x.toLocaleString()}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)'
                    },
                    ticks: {
                        color: '#8b8c8f',
                        font: {
                            family: 'Inter'
                        },
                        callback: function(value) {
                            return (value / 1000) + 'k';
                        }
                    },
                    min: 280000
                },
                y: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#e0e1dd',
                        font: {
                            family: 'monospace',
                            size: 11
                        }
                    }
                }
            }
        }
    });
}
