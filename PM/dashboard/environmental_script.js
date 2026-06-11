document.addEventListener('DOMContentLoaded', () => {
    // 1. Populate Overview Stats
    const summary = environmentalData.summary;
    document.getElementById('total-rows').textContent = summary.totalRows.toLocaleString();
    document.getElementById('anomalies-count').textContent = `${summary.anomaliesCount.toLocaleString()} (${summary.anomalyPercent}%)`;
    document.getElementById('temp-bounds').textContent = `${summary.tempBounds.low.toFixed(2)} - ${summary.tempBounds.high.toFixed(2)} °C`;
    document.getElementById('rh-bounds').textContent = `${summary.rhBounds.low.toFixed(2)} - ${summary.rhBounds.high.toFixed(2)} %`;

    // 2. Populate Insight Panel
    const totalTemp = summary.tempHighCount + summary.tempLowCount;
    const totalRh = summary.rhHighCount + summary.rhLowCount;
    document.getElementById('temp-anomalies-count').textContent = `${totalTemp.toLocaleString()} Rows`;
    document.getElementById('rh-anomalies-count').textContent = `${totalRh.toLocaleString()} Rows`;
    
    // Count unique smells in anomalies
    const smellCounts = {};
    environmentalData.anomalies.forEach(item => {
        const smell = item.smell || 'Ambient';
        smellCounts[smell] = (smellCounts[smell] || 0) + 1;
    });
    
    const smellTypes = Object.keys(smellCounts);
    document.getElementById('smell-detections').textContent = smellTypes.join(' & ');

    // 3. Set Filter Counters
    document.getElementById('count-all').textContent = environmentalData.anomalies.length;
    document.getElementById('count-temp-high').textContent = summary.tempHighCount;
    document.getElementById('count-temp-low').textContent = summary.tempLowCount;
    document.getElementById('count-rh-low').textContent = summary.rhLowCount;
    document.getElementById('count-rh-high').textContent = summary.rhHighCount;

    // 4. Pagination & Filtering State
    let currentFilter = 'all';
    let currentPage = 1;
    const pageSize = 15;
    let filteredData = [...environmentalData.anomalies];

    const tableBody = document.querySelector('#anomaly-table tbody');
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');
    const pageInfo = document.getElementById('page-info');

    // Filter Function
    function applyFilter(filterType) {
        currentFilter = filterType;
        currentPage = 1;

        if (filterType === 'all') {
            filteredData = [...environmentalData.anomalies];
        } else if (filterType === 'temp-high') {
            filteredData = environmentalData.anomalies.filter(item => item.temp > summary.tempBounds.high);
        } else if (filterType === 'temp-low') {
            filteredData = environmentalData.anomalies.filter(item => item.temp < summary.tempBounds.low);
        } else if (filterType === 'rh-low') {
            filteredData = environmentalData.anomalies.filter(item => item.rh < summary.rhBounds.low);
        } else if (filterType === 'rh-high') {
            filteredData = environmentalData.anomalies.filter(item => item.rh > summary.rhBounds.high);
        }

        renderTable();
    }

    // Table Rendering
    function renderTable() {
        tableBody.innerHTML = '';
        
        const totalItems = filteredData.length;
        const totalPages = Math.ceil(totalItems / pageSize) || 1;
        
        if (currentPage > totalPages) currentPage = totalPages;
        
        const startIdx = (currentPage - 1) * pageSize;
        const endIdx = Math.min(startIdx + pageSize, totalItems);
        
        const pageItems = filteredData.slice(startIdx, endIdx);

        if (pageItems.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted);">No anomalies found for this filter.</td></tr>`;
        } else {
            pageItems.forEach(item => {
                const tr = document.createElement('tr');
                
                // Classify type for badge
                let classificationBadge = '';
                if (item.type.includes('อุณหภูมิสูง')) {
                    classificationBadge = '<span class="badge danger">🌡️ TEMP HIGH</span>';
                } else if (item.type.includes('อุณหภูมิต่ำ')) {
                    classificationBadge = '<span class="badge high">🥶 TEMP LOW</span>';
                } else if (item.type.includes('ความชื้นต่ำ')) {
                    classificationBadge = '<span class="badge warning">🏜️ HUMIDITY LOW</span>';
                } else if (item.type.includes('ความชื้นสูง')) {
                    classificationBadge = '<span class="badge danger">💧 HUMIDITY HIGH</span>';
                } else {
                    classificationBadge = `<span class="badge success">ANOMALY</span>`;
                }

                // Smell Badge
                let smellBadgeClass = 'success'; // Ambient
                if (item.smell.toLowerCase() !== 'ambient') {
                    smellBadgeClass = 'warning';
                }

                tr.innerHTML = `
                    <td>${item.time}</td>
                    <td>${item.temp.toFixed(2)} °C</td>
                    <td>${item.rh.toFixed(2)} %</td>
                    <td>${item.pm25.toFixed(2)}</td>
                    <td><span class="badge ${smellBadgeClass}">${item.smell}</span></td>
                    <td>${classificationBadge}</td>
                `;
                tableBody.appendChild(tr);
            });
        }

        // Update pagination buttons & labels
        pageInfo.textContent = totalItems > 0 
            ? `Showing ${startIdx + 1} to ${endIdx} of ${totalItems} outliers` 
            : `Showing 0 to 0 of 0 outliers`;
        
        btnPrev.disabled = currentPage === 1;
        btnNext.disabled = currentPage === totalPages;
    }

    // Set up filter click events
    const filterButtons = document.querySelectorAll('.btn-filter');
    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const filter = button.getAttribute('data-filter');
            applyFilter(filter);
        });
    });

    // Set up pagination events
    btnPrev.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderTable();
        }
    });

    btnNext.addEventListener('click', () => {
        const totalPages = Math.ceil(filteredData.length / pageSize);
        if (currentPage < totalPages) {
            currentPage++;
            renderTable();
        }
    });

    // Initial table render
    applyFilter('all');

    // 5. Render Chart.js
    renderChart(summary, smellCounts);
});

// Render chart combining Anomaly categories and Smell Predictions
function renderChart(summary, smellCounts) {
    const ctx = document.getElementById('envChart').getContext('2d');
    
    const envPrimary = getComputedStyle(document.documentElement).getPropertyValue('--env-primary').trim() || '#00f5d4';
    const envSecondary = getComputedStyle(document.documentElement).getPropertyValue('--env-secondary').trim() || '#00bbf9';
    const envWarning = getComputedStyle(document.documentElement).getPropertyValue('--env-warning').trim() || '#ffb703';
    
    // Data labels & values
    const labels = [
        '🥶 Temp Low Outliers',
        '🌡️ Temp High Outliers',
        '🏜️ Humidity Low Outliers',
        '💧 Humidity High Outliers'
    ];
    
    const dataValues = [
        summary.tempLowCount,
        summary.tempHighCount,
        summary.rhLowCount,
        summary.rhHighCount
    ];

    // Append smell predictions to show additional context
    Object.keys(smellCounts).forEach(smell => {
        labels.push(`👃 Smell: ${smell}`);
        dataValues.push(smellCounts[smell]);
    });

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Log Row Count',
                data: dataValues,
                backgroundColor: [
                    'rgba(0, 187, 249, 0.2)', // Temp Low (Blue)
                    'rgba(255, 0, 60, 0.2)',  // Temp High (Red)
                    'rgba(255, 183, 3, 0.2)', // Humidity Low (Orange)
                    'rgba(0, 245, 212, 0.2)', // Humidity High (Teal)
                    'rgba(141, 153, 174, 0.2)', // Smells...
                    'rgba(141, 153, 174, 0.2)',
                    'rgba(141, 153, 174, 0.2)'
                ],
                borderColor: [
                    '#00bbf9',
                    '#ff003c',
                    '#ffb703',
                    '#00f5d4',
                    '#8d99ae',
                    '#8d99ae',
                    '#8d99ae'
                ],
                borderWidth: 1.5,
                borderRadius: 4,
                hoverBackgroundColor: [
                    'rgba(0, 187, 249, 0.4)',
                    'rgba(255, 0, 60, 0.4)',
                    'rgba(255, 183, 3, 0.4)',
                    'rgba(0, 245, 212, 0.4)',
                    'rgba(141, 153, 174, 0.4)',
                    'rgba(141, 153, 174, 0.4)',
                    'rgba(141, 153, 174, 0.4)'
                ]
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
                    titleColor: '#00f5d4',
                    bodyColor: '#e0e1dd',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderWidth: 1
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
                        }
                    }
                },
                y: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#e0e1dd',
                        font: {
                            family: 'Inter',
                            size: 11
                        }
                    }
                }
            }
        }
    });
}
