// === KODE JS UNTUK TOGGLE SIDEBAR ===
const menuToggle = document.getElementById('menu-toggle');
const sidebar = document.querySelector('.sidebar');
const mainContent = document.querySelector('.main-content');

menuToggle.addEventListener('click', () => {
  sidebar.classList.toggle('active');
});

// Klik di luar sidebar untuk menutupnya (opsional, tapi sangat baik untuk UX)
mainContent.addEventListener('click', (). => {
    if (sidebar.classList.contains('active')) {
        sidebar.classList.remove('active');
    }
});
