const peer = new Peer(); // Auto-generates a unique ID
let connections = [];

// Display your ID so others can connect to you (standard PeerJS behavior)
peer.on('open', id => {
    document.getElementById('my-id').innerText = id;
});

// Handle incoming link data from other peers
peer.on('connection', conn => {
    conn.on('data', data => {
        addLinkToUI(data.url, false);
    });
});

// Form submission to send a link
document.getElementById('link-form').onsubmit = (e) => {
    e.preventDefault();
    const url = document.getElementById('link-input').value;
    
    // Send to all connected peers
    connections.forEach(conn => conn.send({ url }));
    
    addLinkToUI(url, true);
    document.getElementById('link-input').value = '';
};

function addLinkToUI(url, isSelf) {
    const list = document.getElementById('recent-links');
    const div = document.createElement('div');
    div.className = 'link-item';
    div.innerHTML = `<a href="${url}" target="_blank" onclick="trackClick('${url}')">${url}</a> ${isSelf ? '(You)' : ''}`;
    list.prepend(div);
}

// Trending Logic: Saves click counts in LocalStorage
function trackClick(url) {
    let stats = JSON.parse(localStorage.getItem('linkStats') || '{}');
    stats[url] = (stats[url] || 0) + 1;
    localStorage.setItem('linkStats', JSON.stringify(stats));
    updateTrendingUI();
}

function updateTrendingUI() {
    const stats = JSON.parse(localStorage.getItem('linkStats') || '{}');
    const trendingDiv = document.getElementById('trending-links');
    
    // Sort links by click count
    const sorted = Object.entries(stats)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5); // Top 5

    trendingDiv.innerHTML = sorted.map(([url, count]) => 
        `<div class="link-item">${url} (${count} clicks)</div>`
    ).join('');
}

// Initial load
updateTrendingUI();
