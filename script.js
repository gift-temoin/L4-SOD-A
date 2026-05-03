/**
 * PREMIUM EVENT REGISTRATION SYSTEM LOGIC
 * Handles Form Validation, Local Storage, UI Rendering, Filtering, and Micro-Animations
 */

// --- State Management ---
const STORAGE_KEY = 'wmhs_cultural_day_premium';
let participants = [];

// --- DOM Elements ---
const form = document.getElementById('registration-form');
const formMessage = document.getElementById('form-message');
const participantsList = document.getElementById('participants-list');
const totalParticipantsSpan = document.getElementById('total-participants');
const statRegisteredSpan = document.getElementById('stat-registered');
const searchInput = document.getElementById('searchName');
const filterSelect = document.getElementById('filterType');
const submitBtn = document.getElementById('submit-btn');
const btnText = submitBtn.querySelector('.btn-text');
const btnLoader = submitBtn.querySelector('.btn-loader');

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    renderParticipants();
});

// --- Local Storage ---
function loadData() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        try {
            participants = JSON.parse(stored);
        } catch (e) {
            participants = [];
        }
    }
}

function saveData() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(participants));
}

// --- Validation Helpers ---
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase());
const validatePhone = (phone) => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    return cleanPhone.length >= 10 && cleanPhone.length <= 15 && /^[0-9\-\+\s()]+$/.test(phone);
};

function showError(id, message) {
    const errEl = document.getElementById(id + 'Error');
    if (errEl) {
        errEl.textContent = message;
        // Shake animation for error inputs
        const inputEl = document.getElementById(id) || document.querySelector(`[name="${id}"]`)?.closest('.radio-pill-group') || document.querySelector(`[for="${id}"]`);
        if (inputEl) {
            inputEl.style.animation = 'none';
            inputEl.offsetHeight; // trigger reflow
            inputEl.style.animation = 'shake 0.4s ease';
        }
    }
}

function clearErrors() {
    document.querySelectorAll('.err-msg').forEach(el => el.textContent = '');
}

// Global shake animation injection
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);

// --- Form Submission ---
form.addEventListener('submit', function(event) {
    event.preventDefault();
    clearErrors();
    formMessage.classList.add('hidden');

    // Gather Values
    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const country = document.getElementById('country').value.trim();
    const participation = document.getElementById('participation').value;
    const requests = document.getElementById('requests').value.trim();
    const terms = document.getElementById('terms').checked;
    
    // Get checked radio
    let gender = '';
    const genderRadios = document.getElementsByName('gender');
    for (const radio of genderRadios) {
        if (radio.checked) {
            gender = radio.value;
            break;
        }
    }

    let isValid = true;

    // Strict Validation Checks
    if (!fullName) { showError('fullName', 'Full Name is required.'); isValid = false; }
    
    if (!email) { showError('email', 'Email is required.'); isValid = false; }
    else if (!validateEmail(email)) { showError('email', 'Enter a valid email address.'); isValid = false; }
    
    if (!phone) { showError('phone', 'Phone number is required.'); isValid = false; }
    else if (!validatePhone(phone)) { showError('phone', 'Enter a valid 10-15 digit number.'); isValid = false; }
    
    if (!gender) { showError('gender', 'Select a gender.'); isValid = false; }
    if (!country) { showError('country', 'Country/Culture is required.'); isValid = false; }
    if (!participation) { showError('participation', 'Select a participation type.'); isValid = false; }
    if (!terms) { showError('terms', 'You must agree to the Terms & Conditions.'); isValid = false; }

    if (!isValid) return;

    // Simulate Network Request for Premium Feel
    setLoadingState(true);

    setTimeout(() => {
        const newParticipant = {
            id: Date.now().toString(),
            fullName,
            email,
            phone,
            gender,
            country,
            participation,
            requests,
            timestamp: new Date().toISOString()
        };

        // Update State
        participants.unshift(newParticipant);
        saveData();
        
        // Reset UI
        form.reset();
        setLoadingState(false);
        showFormMessage('Awesome! Your registration is confirmed.', 'success');
        renderParticipants();
        
        // Scroll to participants list smoothly
        document.getElementById('participants-heading').scrollIntoView({ behavior: 'smooth', block: 'start' });

    }, 800); // 800ms artificial delay
});

function setLoadingState(isLoading) {
    if (isLoading) {
        submitBtn.disabled = true;
        btnText.textContent = 'Processing...';
        btnLoader.classList.remove('hidden');
    } else {
        submitBtn.disabled = false;
        btnText.textContent = '🚀 Submit Registration';
        btnLoader.classList.add('hidden');
    }
}

function showFormMessage(message, type) {
    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;
    formMessage.classList.remove('hidden');
    
    setTimeout(() => {
        formMessage.classList.add('hidden');
    }, 4000);
}

// --- Render Participants ---
function renderParticipants() {
    const searchTerm = searchInput.value.toLowerCase();
    const filterValue = filterSelect.value;

    participantsList.innerHTML = '';

    // Apply Filters
    const filteredParticipants = participants.filter(p => {
        const matchesName = p.fullName.toLowerCase().includes(searchTerm);
        const matchesType = filterValue === 'All' || p.participation === filterValue;
        return matchesName && matchesType;
    });

    // Update Counters
    totalParticipantsSpan.textContent = filteredParticipants.length;
    
    // Animate hero counter update
    animateCounter(statRegisteredSpan, parseInt(statRegisteredSpan.textContent), participants.length, 500);

    // Empty State
    if (filteredParticipants.length === 0) {
        participantsList.innerHTML = `
            <div class="empty-state">
                <span>📭</span>
                <p>No participants found.</p>
                <small>Be the first to register or adjust your filters.</small>
            </div>
        `;
        return;
    }

    // Build DOM
    filteredParticipants.forEach(p => {
        const card = document.createElement('div');
        card.className = 'participant-card';
        card.dataset.id = p.id;
        card.dataset.role = p.participation; // Used for CSS border coloring

        // Determine icon based on role
        let roleIcon = '🎟';
        if (p.participation === 'Performer') roleIcon = '🎤';
        if (p.participation === 'Volunteer') roleIcon = '🤝';

        card.innerHTML = `
            <div class="p-info">
                <h4>${escapeHTML(p.fullName)}</h4>
                <div class="p-tags">
                    <span class="p-tag role-${p.participation}">${roleIcon} ${p.participation}</span>
                    <span class="p-tag culture">🌍 ${escapeHTML(p.country)}</span>
                </div>
            </div>
            <button class="del-btn" onclick="deleteParticipant('${p.id}')" aria-label="Delete participant" title="Remove Entry">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
            </button>
        `;

        participantsList.appendChild(card);
    });
}

// --- Delete Handler ---
window.deleteParticipant = function(id) {
    if(!confirm("Are you sure you want to remove this registration?")) return;

    const card = document.querySelector(`.participant-card[data-id="${id}"]`);
    if (card) {
        card.classList.add('fade-out');
        
        setTimeout(() => {
            participants = participants.filter(p => p.id !== id);
            saveData();
            renderParticipants();
        }, 300);
    }
};

// --- Counter Animation Utility ---
function animateCounter(element, start, end, duration) {
    if(start === end) return element.textContent = end;
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        element.textContent = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            element.textContent = end;
        }
    };
    window.requestAnimationFrame(step);
}

// --- Event Listeners ---
searchInput.addEventListener('input', renderParticipants);
filterSelect.addEventListener('change', renderParticipants);

// Prevent XSS
function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}
