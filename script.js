const map = document.getElementById('map');
const form = document.getElementById('confessionForm');
const loadingText = document.getElementById('loadingText');
const sendBtn = document.getElementById('sendBtn');
const initialLoader = document.getElementById('initialLoader');
const reloadBtn = document.getElementById('reloadBtn');
const SHEET_URL = 'https://script.google.com/macros/s/AKfycbywbVt5sOtbgQ5qa_VTiL5RFb5b177rSqsZ5ZmMbRhwLHuEGnMAP-97p-3hR8MwosMt/exec';

let placedRects = [];

function checkuser() {
    if (!localStorage.getItem('visited')) {
        localStorage.setItem('visited', 'true');
        alert(`Welcome to ConCon \nAn anonymous memory board (2026-2029) \n\nShare secrets & reviews. Be respectful. \n\n * INSTRUCTIONS \n 1. Click the reload button on the top right to reload confessions \n 2. Use desktop mode on mobile to have a good experience \n 3. Click on send and wait for the confession to be posted \n 4. Scroll and check every nook and corner for anonymous confessions \n\n- By TRVD`);
    }
}

function start() {
    checkuser();
}

function isOverlapping(rect) {
    for (let r of placedRects) {
        if (!(rect.x + rect.w < r.x || rect.x > r.x + r.w || rect.y + rect.h < r.y || rect.y > r.y + r.h)) {
            return true;
        }
    }
    return false;
}

function scatterText(text) {
    const el = document.createElement('div');
    el.className = 'confession-item';
    el.innerText = text;
    map.appendChild(el);

    const w = el.offsetWidth + 20;
    const h = el.offsetHeight + 20;
    let x, y, rect, attempts = 0;

    do {
        x = Math.floor(Math.random() * 2500) + 1750;
        y = Math.floor(Math.random() * 2500) + 1750;
        rect = { x, y, w, h };
        attempts++;
    } while (isOverlapping(rect) && attempts < 100);

    placedRects.push(rect);
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.style.fontSize = `${Math.floor(Math.random() * 6) + 15}px`;
    const colors = ['#333', '#555', '#2c3e50', '#446688', '#884444', '#0bff0f'];
    el.style.color = colors[Math.floor(Math.random() * colors.length)];

    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const input = document.getElementById('confessionInput');
    const val = input.value.trim();
    if (input.value.includes('beshiba') || input.value.includes('bejoy') || input.value.includes('aadithyan.d') || input.value.includes('dinesh')) {
        alert("the confession contains something that shouldn't be there");
        input.value = '';
        return;
    }
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
            console.error(err);
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
        placedRects = [];
        const res = await fetch(SHEET_URL);
        const data = await res.json();
        data.forEach(item => {
            if (item.text) {
                const el = document.createElement('div');
                el.className = 'confession-item';
                el.innerText = item.text;
                map.appendChild(el);
                const w = el.offsetWidth + 20;
                const h = el.offsetHeight + 20;
                let x, y, rect, attempts = 0;
                do {
                    x = Math.floor(Math.random() * 2500) + 1750;
                    y = Math.floor(Math.random() * 2500) + 1750;
                    rect = { x, y, w, h };
                    attempts++;
                } while (isOverlapping(rect) && attempts < 50);
                placedRects.push(rect);
                el.style.left = `${x}px`;
                el.style.top = `${y}px`;
                el.style.fontSize = `${Math.floor(Math.random() * 6) + 15}px`;
                const colors = ['#555', '#333', '#446688', '#884444'];
                el.style.color = colors[Math.floor(Math.random() * colors.length)];
            }
        });
    } catch (e) {
        console.log(e);
    } finally {
        if (initialLoader) initialLoader.style.display = 'none';
        const viewport = document.getElementById('viewport');
        viewport.scrollLeft = 2600;
        viewport.scrollTop = 2600;
    }
}

reloadBtn.addEventListener('click', () => {
    reloadBtn.style.transform = 'rotate(360deg)';
    map.innerHTML = '';
    init();
    setTimeout(() => { reloadBtn.style.transform = ''; }, 500);
});
async function report() {
    const reason = prompt("Please enter the confession that you want to be removed:");
    if (reason) {
        const phone = prompt("Please enter your phone number:");
        if (phone && phone.length >= 10) {
            try {
                await fetch(SHEET_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    body: JSON.stringify({
                        type: "report",
                        reason: reason,
                        phone: phone
                    })
                });

                alert(`Thank you for your report. It has been logged in our system.\n\nRemoval costs 5rs. Payment UPI: 9605905371@fam.\nSend screenshot to the same ID on UPI and we'll remove it asap.\n\nReview time: 24-48 hours.`);
            } catch (err) {
                console.error("Report submission failed:", err);
                alert("There was an error submitting your report. Please try again later.");
            }

        } else {
            alert("Invalid phone number. Please enter a valid phone number to proceed.");
        }
    } else {
        alert("Report cancelled.");
    }
}
init();