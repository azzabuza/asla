/**
 * styles.js
 * Berisi semua logika manipulasi DOM dan UI untuk admin.html
 */

const pageHeaders = {
    monitoring: 'Monitoring Perjalanan',
    users: 'Manajemen Karyawan',
    kinerja: 'Kinerja Role'
};

/**
 * Menginisialisasi navigasi Single Page Application (SPA).
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
 * Merender tabel daftar pengguna berdasarkan data dan filter.
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
                : `<button class="delete-user-btn" data-uid="${uid}" data-name="${u.name || 'tanpa nama'}">Hapus</button>`;
            
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
