/**
 * styles.js
 * Berisi semua logika manipulasi DOM dan UI untuk admin.html
 */

// Objek untuk menyimpan judul halaman
const pageHeaders = {
    monitoring: 'Monitoring Perjalanan',
    users: 'Manajemen User',
    kinerja: 'Kinerja Role'
};

/**
 * Menginisialisasi navigasi Single Page Application (SPA).
 * @param {NodeList} navLinks - Kumpulan elemen link navigasi.
 * @param {NodeList} pages - Kumpulan elemen halaman.
 * @param {HTMLElement} pageTitle - Elemen H1 untuk judul halaman.
 */
export function setupNavigation(navLinks, pages, pageTitle) {
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);

            pages.forEach(page => page.classList.remove('active'));
            navLinks.forEach(nav => nav.classList.remove('active'));

            document.getElementById(`page-${targetId}`).classList.add('active');
            link.classList.add('active');
            
            pageTitle.textContent = pageHeaders[targetId] || 'Dashboard';
        });
    });
}

/**
 * Menginisialisasi fungsionalitas dasar modal (tombol tutup).
 * @param {HTMLElement} modal - Elemen modal.
 * @param {HTMLElement} closeModalBtn - Tombol untuk menutup modal.
 */
export function setupModal(modal, closeModalBtn) {
    closeModalBtn.onclick = () => modal.style.display = "none";
    window.onclick = (e) => {
        if (e.target == modal) {
            modal.style.display = "none";
        }
    };
}

/**
 * Merender tabel daftar pengguna berdasarkan data dan filter.
 * @param {HTMLElement} userListBody - Elemen tbody dari tabel user.
 * @param {Object} allUsers - Objek berisi semua data pengguna.
 * @param {Object} filters - Objek berisi filter (role, name).
 * @param {Object} currentUser - Objek pengguna yang sedang login.
 */
export function renderUsersTable(userListBody, allUsers, filters, currentUser) {
    userListBody.innerHTML = '';
    let found = false;
    Object.entries(allUsers).forEach(([uid, u]) => {
        const nameMatch = !filters.name || (u.name || '').toLowerCase().includes(filters.name.toLowerCase());
        const roleMatch = filters.role === 'all' || u.role === filters.role;

        if (nameMatch && roleMatch) {
            found = true;
            const tr = document.createElement('tr');
            const isCurrentUser = (uid === currentUser.uid);
            const deleteButton = isCurrentUser
                ? `<button class="delete-user-btn" disabled title="Tidak dapat menghapus diri sendiri">Hapus</button>`
                : `<button class="delete-user-btn" data-uid="${uid}" data-name="${u.name || ''}">Hapus</button>`;
            
            tr.innerHTML = `
                <td data-label="UID"><small>${uid}</small></td>
                <td data-label="Nama">${u.name || '-'}</td>
                <td data-label="Role"><span class="role-badge role-${u.role}">${u.role || '-'}</span></td>
                <td data-label="Login Terakhir">${u.lastLogin ? new Date(u.lastLogin).toLocaleString('id-ID') : '-'}</td>
                <td data-label="Status" class="${u.online ? 'status-online' : 'status-offline'}"><i class="fas fa-circle"></i> ${u.online ? 'Online' : 'Offline'}</td>
                <td data-label="Aksi">${deleteButton}</td>`;
            userListBody.appendChild(tr);
        }
    });
    if (!found) {
        userListBody.innerHTML = '<tr><td colspan="6">Tidak ada user ditemukan.</td></tr>';
    }
}

/**
 * Merender ringkasan kinerja role di halaman utama.
 * @param {HTMLElement} container - Elemen div untuk menampung ringkasan.
 * @param {Object} allActivities - Objek berisi semua aktivitas.
 */
export function renderRoleSummary(container, allActivities) {
    container.innerHTML = `
      <ul class="kinerja-summary-list">
        <li><a href="#" data-role="admin">Aktivitas Admin <span>(${allActivities.admin.length} Aksi)</span></a></li>
        <li><a href="#" data-role="koordinator">Aktivitas Koordinator <span>(${allActivities.koordinator.length} Aksi)</span></a></li>
        <li><a href="#" data-role="driver">Aktivitas Driver <span>(${allActivities.driver.length} Aksi)</span></a></li>
      </ul>`;
}

/**
 * Menampilkan detail aktivitas di dalam modal.
 * @param {string} role - Role yang akan ditampilkan ('admin', 'koordinator', 'driver').
 * @param {Object} allActivities - Objek berisi semua aktivitas.
 * @param {Object} allUsers - Objek berisi semua data pengguna.
 * @param {HTMLElement} modal - Elemen modal.
 * @param {HTMLElement} modalTitle - Elemen judul modal.
 * @param {HTMLElement} modalBody - Elemen body modal.
 */
export function showActivityDetails(role, allActivities, allUsers, modal, modalTitle, modalBody) {
    modalTitle.textContent = pageHeaders[role] || 'Detail Aktivitas';
    
    let detailHtml = '<ul class="kinerja-detail-list">';
    const activities = allActivities[role] ? [...allActivities[role]].sort((a, b) => b.time - a.time) : [];
    
    if (activities.length === 0) {
        detailHtml = '<p>Belum ada aktivitas untuk role ini.</p>';
    } else {
        activities.forEach(act => {
            const userName = allUsers[act.userId]?.name || 'User Dihapus';
            const actionTime = new Date(act.time).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });
            detailHtml += `<li><span class="user-name">${userName}</span><span class="action-time">${actionTime}</span></li>`;
        });
        detailHtml += '</ul>';
    }
    
    modalBody.innerHTML = detailHtml;
    modal.style.display = "block";
}
