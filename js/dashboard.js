// Variables globales
let vehicles = [];
let editingVehicleId = null;

// Verificar autenticación al cargar la página
window.addEventListener('load', function() {
    const session = localStorage.getItem('session') || sessionStorage.getItem('session');

    if (!session) {
        window.location.href = 'index.html';
        return;
    }

    const sessionData = JSON.parse(session);

    // Verificar expiración de sesión
    const loginTime = new Date(sessionData.loginTime);
    const now = new Date();
    const hoursDiff = (now - loginTime) / (1000 * 60 * 60);

    if (hoursDiff >= 24) {
        localStorage.removeItem('session');
        sessionStorage.removeItem('session');
        window.location.href = 'index.html';
        return;
    }

    // Mostrar nombre de usuario
    document.getElementById('userGreeting').textContent = `Hola, ${sessionData.username}`;

    // Cargar vehículos
    loadVehicles();
});

// Cerrar sesión
document.getElementById('logoutBtn').addEventListener('click', function() {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
        localStorage.removeItem('session');
        sessionStorage.removeItem('session');
        window.location.href = 'index.html';
    }
});

// Cargar vehículos del usuario
function loadVehicles() {
    const session = JSON.parse(localStorage.getItem('session') || sessionStorage.getItem('session'));
    const username = session.username;

    // Obtener vehículos del localStorage
    const allVehicles = JSON.parse(localStorage.getItem('vehicles') || '{}');
    vehicles = allVehicles[username] || [];

    updateStats();
    renderVehicles();
}

// Guardar vehículos
function saveVehicles() {
    const session = JSON.parse(localStorage.getItem('session') || sessionStorage.getItem('session'));
    const username = session.username;

    const allVehicles = JSON.parse(localStorage.getItem('vehicles') || '{}');
    allVehicles[username] = vehicles;
    localStorage.setItem('vehicles', JSON.stringify(allVehicles));

    updateStats();
    renderVehicles();
}

// Actualizar estadísticas
function updateStats() {
    const total = vehicles.length;
    let activeCount = 0;
    let pendingCount = 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    vehicles.forEach(vehicle => {
        if (vehicle.nextITV) {
            const itvDate = new Date(vehicle.nextITV);
            itvDate.setHours(0, 0, 0, 0);

            if (itvDate >= today) {
                activeCount++;
            } else {
                pendingCount++;
            }
        } else {
            pendingCount++;
        }
    });

    document.getElementById('totalVehicles').textContent = total;
    document.getElementById('activeVehicles').textContent = activeCount;
    document.getElementById('pendingITV').textContent = pendingCount;
}

// Renderizar vehículos
function renderVehicles() {
    const grid = document.getElementById('vehiclesGrid');
    const emptyState = document.getElementById('emptyState');

    if (vehicles.length === 0) {
        grid.style.display = 'none';
        emptyState.classList.add('show');
        return;
    }

    grid.style.display = 'grid';
    emptyState.classList.remove('show');
    grid.innerHTML = '';

    vehicles.forEach((vehicle, index) => {
        const card = createVehicleCard(vehicle, index);
        grid.appendChild(card);
    });
}

// Crear tarjeta de vehículo
function createVehicleCard(vehicle, index) {
    const card = document.createElement('div');
    card.className = 'vehicle-card';

    // Calcular estado de ITV
    const itvStatus = getITVStatus(vehicle.nextITV);

    card.innerHTML = `
        <div class="vehicle-header">
            <div class="vehicle-title">
                <h3>${vehicle.brand} ${vehicle.model}</h3>
                <span class="plate">${vehicle.plate}</span>
            </div>
            <div class="vehicle-actions">
                <button class="edit-btn" onclick="editVehicle(${index})">
                    <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                    </svg>
                </button>
                <button class="delete-btn" onclick="deleteVehicle(${index})">
                    <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                    </svg>
                </button>
            </div>
        </div>

        <div class="vehicle-details">
            <div class="detail-item">
                <label>Año</label>
                <span>${vehicle.year}</span>
            </div>
            <div class="detail-item">
                <label>Color</label>
                <span>${vehicle.color || 'N/A'}</span>
            </div>
            <div class="detail-item">
                <label>Kilometraje</label>
                <span>${vehicle.km ? formatNumber(vehicle.km) + ' km' : 'N/A'}</span>
            </div>
            <div class="detail-item">
                <label>Última ITV</label>
                <span>${vehicle.lastITV ? formatDate(vehicle.lastITV) : 'N/A'}</span>
            </div>
        </div>

        <div class="itv-status ${itvStatus.class}">
            ${itvStatus.text}
        </div>

        ${vehicle.notes ? `<div class="vehicle-notes">${vehicle.notes}</div>` : ''}
    `;

    return card;
}

// Obtener estado de ITV
function getITVStatus(nextITV) {
    if (!nextITV) {
        return {
            class: 'expired',
            text: 'Sin fecha de ITV registrada'
        };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const itvDate = new Date(nextITV);
    itvDate.setHours(0, 0, 0, 0);

    const diffTime = itvDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
        return {
            class: 'expired',
            text: `ITV vencida hace ${Math.abs(diffDays)} días`
        };
    } else if (diffDays <= 30) {
        return {
            class: 'warning',
            text: `Próxima ITV: ${formatDate(nextITV)} (${diffDays} días)`
        };
    } else {
        return {
            class: 'valid',
            text: `Próxima ITV: ${formatDate(nextITV)}`
        };
    }
}

// Abrir modal para añadir vehículo
document.getElementById('addVehicleBtn').addEventListener('click', function() {
    editingVehicleId = null;
    document.getElementById('modalTitle').textContent = 'Añadir Vehículo';
    document.getElementById('vehicleForm').reset();
    document.getElementById('vehicleModal').classList.add('show');
});

// Cerrar modal
document.getElementById('closeModal').addEventListener('click', closeModal);
document.getElementById('cancelBtn').addEventListener('click', closeModal);

function closeModal() {
    document.getElementById('vehicleModal').classList.remove('show');
    document.getElementById('vehicleForm').reset();
    editingVehicleId = null;
}

// Cerrar modal al hacer click fuera
document.getElementById('vehicleModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeModal();
    }
});

// Guardar vehículo (añadir o editar)
document.getElementById('vehicleForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const vehicleData = {
        brand: document.getElementById('brand').value.trim(),
        model: document.getElementById('model').value.trim(),
        year: parseInt(document.getElementById('year').value),
        plate: document.getElementById('plate').value.trim().toUpperCase(),
        color: document.getElementById('color').value.trim(),
        km: document.getElementById('km').value ? parseInt(document.getElementById('km').value) : null,
        lastITV: document.getElementById('lastITV').value,
        nextITV: document.getElementById('nextITV').value,
        notes: document.getElementById('notes').value.trim()
    };

    if (editingVehicleId !== null) {
        // Editar vehículo existente
        vehicles[editingVehicleId] = vehicleData;
        showNotification('Vehículo actualizado correctamente', 'success');
    } else {
        // Añadir nuevo vehículo
        vehicles.push(vehicleData);
        showNotification('Vehículo añadido correctamente', 'success');
    }

    saveVehicles();
    closeModal();
});

// Editar vehículo
function editVehicle(index) {
    editingVehicleId = index;
    const vehicle = vehicles[index];

    document.getElementById('modalTitle').textContent = 'Editar Vehículo';
    document.getElementById('brand').value = vehicle.brand;
    document.getElementById('model').value = vehicle.model;
    document.getElementById('year').value = vehicle.year;
    document.getElementById('plate').value = vehicle.plate;
    document.getElementById('color').value = vehicle.color || '';
    document.getElementById('km').value = vehicle.km || '';
    document.getElementById('lastITV').value = vehicle.lastITV || '';
    document.getElementById('nextITV').value = vehicle.nextITV || '';
    document.getElementById('notes').value = vehicle.notes || '';

    document.getElementById('vehicleModal').classList.add('show');
}

// Eliminar vehículo
function deleteVehicle(index) {
    const vehicle = vehicles[index];
    if (confirm(`¿Estás seguro de que quieres eliminar ${vehicle.brand} ${vehicle.model}?`)) {
        vehicles.splice(index, 1);
        saveVehicles();
        showNotification('Vehículo eliminado correctamente', 'success');
    }
}

// Mostrar notificación
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 12px;
        color: white;
        font-weight: 500;
        z-index: 2000;
        animation: slideInRight 0.3s ease-out;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        max-width: 300px;
        ${type === 'success'
            ? 'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);'
            : 'background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);'}
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Funciones auxiliares
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
}

function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Añadir estilos de animación
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
`;
document.head.appendChild(style);
