const dashboardData = {
    overview: {
        totalAttacks: "5,373,634",
        timeframe: "16 Jun 2024 - 10 Jun 2026",
        uniqueIPs: 19
    },
    ips: [
        { ip: "119.123.55.141", count: 283334, first: "2024-06-16 10:25:32", last: "2026-06-10 04:16:30" },
        { ip: "12.104.185.44", count: 282388, first: "2024-06-16 10:28:22", last: "2026-06-10 04:13:31" },
        { ip: "131.33.12.73", count: 281577, first: "2024-06-16 10:29:44", last: "2026-06-10 04:17:28" },
        { ip: "139.94.203.41", count: 282356, first: "2024-06-16 10:25:48", last: "2026-06-10 04:17:38" },
        { ip: "14.121.165.122", count: 282954, first: "2024-06-16 10:25:33", last: "2026-06-10 04:17:24" },
        { ip: "14.252.124.193", count: 282223, first: "2024-06-16 10:25:50", last: "2026-06-10 04:16:47" },
        { ip: "148.9.19.27", count: 283018, first: "2024-06-16 10:25:43", last: "2026-06-10 04:17:42" },
        { ip: "162.240.218.117", count: 283390, first: "2024-06-16 10:26:37", last: "2026-06-10 04:14:00" },
        { ip: "187.91.79.110", count: 282711, first: "2024-06-16 10:26:14", last: "2026-06-10 04:17:15" },
        { ip: "196.45.2.86", count: 282853, first: "2024-06-16 10:25:40", last: "2026-06-10 04:16:18" },
        { ip: "197.82.237.190", count: 283400, first: "2024-06-16 10:25:42", last: "2026-06-10 04:17:27" },
        { ip: "199.242.130.73", count: 282983, first: "2024-06-16 10:26:28", last: "2026-06-10 04:16:31" },
        { ip: "199.71.56.65", count: 282769, first: "2024-06-16 10:27:25", last: "2026-06-10 04:17:23" },
        { ip: "202.129.225.117", count: 282591, first: "2024-06-16 10:26:26", last: "2026-06-10 04:17:41" },
        { ip: "209.103.8.44", count: 283699, first: "2024-06-16 10:25:29", last: "2026-06-10 04:17:04" },
        { ip: "211.92.75.1", count: 282802, first: "2024-06-16 10:29:19", last: "2026-06-10 04:17:32" },
        { ip: "215.143.100.205", count: 283012, first: "2024-06-16 10:25:31", last: "2026-06-10 04:15:15" },
        { ip: "80.130.43.26", count: 282335, first: "2024-06-16 10:26:50", last: "2026-06-10 04:17:38" },
        { ip: "95.125.101.128", count: 282507, first: "2024-06-16 10:26:01", last: "2026-06-10 04:17:05" }
    ],
    pattern: {
        status: "HTTP 500 (Internal Server Error) / 504 (Gateway Timeout)",
        size: "Unusually large response sizes (6,000 - 12,000 Bytes)",
        description: "Attackers requested normal paths but appended a single uppercase letter or underscore at the very end of the endpoint (e.g., /productsG, /indexE.html). When extracting these appended characters chronologically across millions of requests, they form a hidden message."
    },
    latencyData: {
        overallAvg: 2437.71,
        maxLatency: 12000,
        minLatency: 10,
        distribution: {
            "0-50": 3467223,
            "51-100": 4231142,
            "101-150": 4231045,
            "151-200": 1780934,
            "200+": 7436053
        },
        endpoints: [
            { path: "Normal (/checkout, /cart, etc)", avg: 107.75, max: 250, count: 12913363 },
            { path: "Normal (/search)", avg: 629.41, max: 8000, count: 2859400 },
            { path: "Anomalous (Hacker IPs)", avg: 9001.25, max: 12000, count: 5373634 }
        ]
    },
    timelineData: {
        "2024-06": { "system_down": 208835, "system_slow": 7031 },
        "2024-07": { "system_down": 242359, "system_slow": 13718 },
        "2024-08": { "system_down": 248999, "system_slow": 16533 },
        "2024-09": { "system_down": 175395, "system_slow": 16042 },
        "2024-10": { "system_down": 141794, "system_slow": 4557 },
        "2024-11": { "system_down": 280398, "system_slow": 6968 },
        "2024-12": { "system_down": 173912, "system_slow": 6968 },
        "2025-01": { "system_down": 439876, "system_slow": 11356 },
        "2025-02": { "system_down": 27365, "system_slow": 6854 },
        "2025-03": { "system_down": 197829, "system_slow": 14749 },
        "2025-04": { "system_down": 251153, "system_slow": 11497 },
        "2025-05": { "system_down": 229942, "system_slow": 14217 },
        "2025-06": { "system_down": 160501, "system_slow": 14531 },
        "2025-07": { "system_down": 268825, "system_slow": 18266 },
        "2025-08": { "system_down": 144141, "system_slow": 5459 },
        "2025-09": { "system_down": 301476, "system_slow": 8782 },
        "2025-10": { "system_down": 281968, "system_slow": 9147 },
        "2025-11": { "system_down": 232253, "system_slow": 10783 },
        "2025-12": { "system_down": 287113, "system_slow": 15972 },
        "2026-01": { "system_down": 144608, "system_slow": 15603 },
        "2026-02": { "system_down": 220193, "system_slow": 8064 },
        "2026-03": { "system_down": 228148, "system_slow": 13150 },
        "2026-04": { "system_down": 199856, "system_slow": 11634 },
        "2026-05": { "system_down": 233488, "system_slow": 10281 },
        "2026-06": { "system_down": 52474, "system_slow": 4506 }
    },
    hackerName: "GOEMON",
    hackerMessage: "NEXUS_CART_WAS_TO_EASY_YOUR_SYSTEM_WAS_ALREADY_FALING_APART_BEFORE_YOU_EVEN_REALIZED_IT_WAS_ME_GOEMON"
};
