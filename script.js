const map = document.getElementById('map');
const form = document.getElementById('confessionForm');
const loadingText = document.getElementById('loadingText');
const sendBtn = document.getElementById('sendBtn');
const initialLoader = document.getElementById('initialLoader'); // Moved up for clarity

const SHEET_URL = 'https://script.google.com/macros/s/AKfycbwE7t7ZcdxHOtkfD5Zwh41Qj0yTkk8by-zhhAbYk7mUcY4SQyDd8opZmG6p6LzuwLrl/exec';

function checkuser() {
    if (localStorage.getItem('visited')) {
        console.log("Welcome back!");
    } else {
        localStorage.setItem('visited', 'true');
        console.log("Welcome, new visitor!");
        alert(`Welcome to ConCon \n an anonymous confession board \n\n Please be respectful and kind (monitored) \n\n Your confession will appear on the map immediately after submission. \n - By ulloord`);
    }
}
function adduser() {
    if (!localStorage.getItem('visited')) {
        localStorage.setItem('visited', 'true');
    } else {
        console.log("User already exists.");
    }
}
function start() {
   
    checkuser();
}
function scatterText(text) {
    const el = document.createElement('div');
    el.className = 'confession-item';
    el.innerText = text;

    const x = Math.random() * 800 + 50;
    const y = Math.random() * 800 + 50;

    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.style.fontSize = `${Math.floor(Math.random() * 10) + 16}px`;

    const colors = ['#555', '#888', '#222', '#446688', '#884444'];
    el.style.color = colors[Math.floor(Math.random() * colors.length)];

    map.appendChild(el);

    el.scrollIntoView({ behavior: 'smooth', block: 'center' });

}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const input = document.getElementById('confessionInput');
    const val = input.value.trim();

    if (val) {
        loadingText.style.display = 'inline';
        sendBtn.disabled = true;

        scatterText(val); 

        try {
            await fetch(SHEET_URL, {
                method: 'POST',
                mode: 'no-cors',
                body: JSON.stringify({ confession: val })
            });
        } catch (err) {
            console.error("Upload failed", err);
        } finally {
            loadingText.style.display = 'none';
            sendBtn.disabled = false;
            input.value = '';
        }
    }
});

async function init() {
    try {
        if (initialLoader) initialLoader.style.display = 'block';

        const res = await fetch(SHEET_URL);
        const data = await res.json();

        data.forEach(item => {
            if (item.text) scatterText(item.text);
        });

        console.log("All data loaded!");
    } catch (e) {
        console.log("No data found, starting fresh.");
    } finally {
        if (initialLoader) initialLoader.style.display = 'none';
    }
}

init();