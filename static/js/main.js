// ===================== NAVBAR =====================
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
});

function toggleMenu() {
    document.querySelector('.nav-links').classList.toggle('open');
}
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        document.querySelector('.nav-links').classList.remove('open');
    });
});

// ===================== SMOOTH SCROLL =====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
        }
    });
});

// ===================== SCROLL ANIMATIONS =====================
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.service-card, .stat-card, .team-card, .service-full-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
});

// ===================== FLASH AUTO-DISMISS =====================
setTimeout(() => {
    document.querySelectorAll('.flash').forEach(el => {
        el.style.transition = 'opacity 0.5s';
        el.style.opacity = '0';
        setTimeout(() => el.remove(), 500);
    });
}, 4000);

// ===================== DATE PICKER – set min to today =====================
const dateInput = document.getElementById('booking-date');
const slotSelect = document.getElementById('slot-select');
const slotLoading = document.getElementById('slot-loading');

if (dateInput) {
    // Prevent past dates
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);

    dateInput.addEventListener('change', async () => {
        const selectedDate = dateInput.value;
        if (!selectedDate) return;

        // Show loading state
        slotSelect.disabled = true;
        slotSelect.innerHTML = '<option value="">Loading...</option>';
        if (slotLoading) slotLoading.style.display = 'block';

        try {
            const res = await fetch(`/api/available-slots?date=${selectedDate}`);
            const data = await res.json();

            slotSelect.innerHTML = '<option value="">Select a time slot ▾</option>';

            let hasAvailable = false;
            data.slots.forEach(slot => {
                const opt = document.createElement('option');
                opt.value = slot.time;

                if (slot.available) {
                    opt.textContent = `🕐 ${slot.time}`;
                    hasAvailable = true;
                } else {
                    opt.textContent = `❌ ${slot.time} — Booked`;
                    opt.disabled = true;
                    opt.classList.add('booked');
                }
                slotSelect.appendChild(opt);
            });

            slotSelect.disabled = false;

            if (!hasAvailable) {
                slotSelect.innerHTML = '<option value="">No slots available on this date</option>';
                slotSelect.disabled = true;
            }
        } catch (err) {
            slotSelect.innerHTML = '<option value="">Error loading slots</option>';
            console.error('Slot fetch error:', err);
        } finally {
            if (slotLoading) slotLoading.style.display = 'none';
        }
    });
}
