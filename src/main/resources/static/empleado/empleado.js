function getToken() {
    return localStorage.getItem('token');
}


async function authenticatedFetch(url, options = {}) {
    const token = getToken();
    if (!token) {
        alert('Sesión expirada. Por favor inicia sesión nuevamente.');
        window.location.href = '/index.html';
        return null;
    }

    const headers = {
        ...options.headers,
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
    };

    const response = await fetch(url, { ...options, headers });

    if (response.status === 401) {
        alert('Sesión expirada. Por favor inicia sesión nuevamente.');
        localStorage.removeItem('token');
        localStorage.removeItem('rol');
        window.location.href = '/index.html';
        return null;
    }

    return response;
}


document.querySelectorAll('.sidebar-nav .nav-item').forEach(item => {
    item.addEventListener('click', function (event) {
        event.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const sectionIds = ['inicio', 'nomina', 'solicitudes', 'asistencia', 'notificaciones', 'ayuda-soporte'];
        sectionIds.forEach(id => {
            const section = document.getElementById(id);
            if (section) {
                section.style.display = 'none';
            }
        });
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            targetSection.style.display = 'block';
        }
        document.querySelectorAll('.sidebar-nav .nav-item').forEach(navItem => {
            navItem.classList.remove('active');
        });
        this.classList.add('active');
    });
});


function toggleExpandible(id, event) {
    event.stopPropagation();
    const contentId = 'content-' + id;
    const buttonId = 'btn-' + id;
    const contentElement = document.getElementById(contentId);
    const buttonElement = document.getElementById(buttonId);

    if (contentElement && buttonElement) {
        if (contentElement.style.display === 'none' || contentElement.style.display === '') {
            contentElement.style.display = 'block';
            buttonElement.textContent = 'Cerrar';
        } else {
            contentElement.style.display = 'none';
            buttonElement.textContent = 'Ver';
        }
    }
}

function toggleFormulario(tipo) {
    const formularioId = 'formulario-' + tipo;
    const actionItem = event.target.closest('.action-item');
    let elemento = document.getElementById(formularioId);

    if (!elemento) {
        elemento = document.createElement('div');
        elemento.id = formularioId;
        elemento.classList.add('form-container');
        elemento.style.marginTop = '15px';

        let formulario = '';
        if (tipo === 'vacaciones') {
            formulario = `
                        <h4>Solicitar Vacaciones</h4>
                        <form onsubmit="enviarSolicitud(event, '${tipo}')">
                            <div class="form-group">
                                <label>Fecha de Inicio</label>
                                <input type="date" id="fechaInicio_${tipo}" required>
                            </div>
                            <div class="form-group">
                                <label>Fecha de Fin</label>
                                <input type="date" id="fechaFin_${tipo}" required>
                            </div>
                            <div class="form-group">
                                <label>Motivo</label>
                                <textarea id="motivo_${tipo}" placeholder="Describe el motivo..."></textarea>
                            </div>
                            <button type="submit" class="btn btn-primary">Enviar Solicitud</button>
                        </form>
                    `;
        } else if (tipo === 'permisos') {
            formulario = `
                        <h4>Solicitar Permiso</h4>
                        <form onsubmit="enviarSolicitud(event, '${tipo}')">
                            <div class="form-group">
                                <label>Fecha del Permiso</label>
                                <input type="date" id="fecha_${tipo}" required>
                            </div>
                            <div class="form-group">
                                <label>Horas</label>
                                <input type="number" id="horas_${tipo}" min="1" max="8" required>
                            </div>
                            <div class="form-group">
                                <label>Motivo</label>
                                <textarea id="motivo_${tipo}" placeholder="Describe el motivo..."></textarea>
                            </div>
                            <button type="submit" class="btn btn-primary">Enviar Solicitud</button>
                        </form>
                    `;
        } else if (tipo === 'incapacidad') {
            formulario = `
                        <h4>Reportar Incapacidad</h4>
                        <form onsubmit="enviarSolicitud(event, '${tipo}')">
                            <div class="form-group">
                                <label>Fecha de Inicio</label>
                                <input type="date" id="fechaInicio_${tipo}" required>
                            </div>
                            <div class="form-group">
                                <label>Fecha de Fin</label>
                                <input type="date" id="fechaFin_${tipo}" required>
                            </div>
                            <div class="form-group">
                                <label>Diagnóstico</label>
                                <textarea id="motivo_${tipo}" placeholder="Describe el diagnóstico..."></textarea>
                            </div>
                            <button type="submit" class="btn btn-primary">Enviar</button>
                        </form>
                    `;
        }

        elemento.innerHTML = formulario;
        actionItem.insertAdjacentElement('afterend', elemento);
    } else {
        elemento.style.display = elemento.style.display === 'none' ? 'block' : 'none';
    }
}


async function enviarSolicitud(event, tipo) {
    event.preventDefault();

    const solicitudData = {
        tipoSolicitud: tipo.toUpperCase()
    };

    if (tipo === 'vacaciones') {
        solicitudData.fechaInicio = document.getElementById('fechaInicio_vacaciones').value;
        solicitudData.fechaFin = document.getElementById('fechaFin_vacaciones').value;
        solicitudData.motivo = document.getElementById('motivo_vacaciones').value;
    } else if (tipo === 'permisos') {
        solicitudData.fechaInicio = document.getElementById('fecha_permisos').value;
        solicitudData.horas = document.getElementById('horas_permisos').value;
        solicitudData.motivo = document.getElementById('motivo_permisos').value;
    } else if (tipo === 'incapacidad') {
        solicitudData.fechaInicio = document.getElementById('fechaInicio_incapacidad').value;
        solicitudData.fechaFin = document.getElementById('fechaFin_incapacidad').value;
        solicitudData.motivo = document.getElementById('motivo_incapacidad').value;
    }

    try {
        const response = await authenticatedFetch('/api/solicitudes', {
            method: 'POST',
            body: JSON.stringify(solicitudData)
        });

        if (response && response.ok) {
            alert('Solicitud enviada correctamente');

            const formulario = document.getElementById('formulario-' + tipo);
            if (formulario) formulario.style.display = 'none';
        } else {
            alert('Error al enviar la solicitud');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error de conexión');
    }
}


async function registrarAsistencia() {
    try {
        const response = await authenticatedFetch('/api/asistencia/entrada', {
            method: 'POST'
        });

        if (response && response.ok) {
            alert('Asistencia registrada correctamente');
            cargarHistorialAsistencia();
        } else {
            alert('Error al registrar asistencia');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error de conexión');
    }
}


async function cargarHistorialAsistencia() {
    try {
        const response = await authenticatedFetch('/api/asistencia/mi-asistencia');

        if (response && response.ok) {
            const data = await response.json();
            const tbody = document.getElementById('historialAsistencia');

            if (Array.isArray(data) && data.length > 0) {
                tbody.innerHTML = data.map(a => `
                            <tr>
                                <td><span class="attendance-badge ${a.tipo === 'ENTRADA' ? 'entrada' : 'salida'}">${a.tipo}</span></td>
                                <td>${a.hora || ''}</td>
                                <td>${a.fecha || ''}</td>
                            </tr>
                        `).join('');
            } else {
                tbody.innerHTML = '<tr><td colspan="3" class="text-center">No hay registros</td></tr>';
            }
        }
    } catch (error) {
        console.error('Error:', error);
    }
}


async function initializeProfile() {
    try {
        const response = await authenticatedFetch('/api/perfil');

        if (!response) return;

        const data = await response.json();

        if (data.success) {
            const nombres = data.nombres || '';
            const apellidos = data.apellidos || '';
            const inicial1 = nombres.charAt(0).toUpperCase();
            const inicial2 = apellidos.charAt(0).toUpperCase();
            document.getElementById('avatarInitial').textContent = inicial1 + inicial2;

            const nombreCompleto = (nombres + ' ' + apellidos).trim();
            document.getElementById('userFullName').textContent = nombreCompleto || 'Usuario';

            const rol = localStorage.getItem('rol') || 'empleado';
            document.getElementById('userRole').textContent = rol === 'admin' ? 'Administrador' :
                rol === 'recursos_humanos' ? 'Recursos Humanos' : 'Empleado';

            document.getElementById('nombreView').textContent = nombreCompleto || 'No especificado';
            document.getElementById('cargoView').textContent = data.cargo || 'No especificado';
            document.getElementById('departamentoView').textContent = data.departamento || 'No especificado';
            document.getElementById('fechaView').textContent = data.fechaInicio || 'No especificada';
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function loadProfileData() {
    try {
        const response = await authenticatedFetch('/api/perfil');

        if (!response) return;

        const data = await response.json();

        if (data.success) {
            document.getElementById('nombresEdit').value = data.nombres || '';
            document.getElementById('apellidosEdit').value = data.apellidos || '';
            document.getElementById('correoEdit').value = data.correo || '';
            document.getElementById('telefonoEdit').value = data.telefono || '';
            document.getElementById('direccionEdit').value = data.direccion || '';


            const cargoSelect = document.getElementById('cargoEdit');
            cargoSelect.value = data.cargo || '';


            const deptoSelect = document.getElementById('departamentoEdit');
            deptoSelect.value = data.departamento || '';

            document.getElementById('fechaEdit').textContent = data.fechaInicio || '';
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

function toggleEditMode() {
    document.getElementById('vistaPerfil').style.display = 'none';
    document.getElementById('formEdicion').style.display = 'block';
    loadProfileData();
}

function cancelarEdicion() {
    document.getElementById('vistaPerfil').style.display = 'block';
    document.getElementById('formEdicion').style.display = 'none';
}

async function guardarCambios() {
    const datos = {
        nombres: document.getElementById('nombresEdit').value.trim(),
        apellidos: document.getElementById('apellidosEdit').value.trim(),
        correo: document.getElementById('correoEdit').value.trim(),
        telefono: document.getElementById('telefonoEdit').value.trim(),
        direccion: document.getElementById('direccionEdit').value.trim(),

        cargo: document.getElementById('cargoEdit').value,
        departamento: document.getElementById('departamentoEdit').value
    };

    if (!datos.nombres || !datos.apellidos || !datos.correo) {
        alert('Por favor completa los campos requeridos');
        return;
    }

    try {
        const response = await authenticatedFetch('/api/perfil', {
            method: 'PUT',
            body: JSON.stringify(datos)
        });

        if (response && response.ok) {
            const data = await response.json();
            if (data.success) {
                alert('Cambios guardados exitosamente');
                initializeProfile();
                cancelarEdicion();
            } else {
                alert('Error: ' + data.mensaje);
            }
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error de conexión');
    }
}

async function eliminarPerfil() {
    const confirmacion1 = confirm('¿Estás seguro que deseas eliminar tu perfil?');
    if (!confirmacion1) return;

    const confirmacion2 = confirm('Esta acción es irreversible. ¿Deseas continuar?');
    if (!confirmacion2) return;

    try {
        const response = await authenticatedFetch('/api/perfil', {
            method: 'DELETE'
        });

        if (response && response.ok) {
            const data = await response.json();
            if (data.success) {
                alert('Perfil eliminado');
                cerrarSesion();
            } else {
                alert('Error: ' + data.mensaje);
            }
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error de conexión');
    }
}

function cerrarSesion() {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    localStorage.removeItem('email');
    window.location.href = '/index.html';
}

function descargarPDF(nombre) {
    const url = `/empleado/pdfs/${nombre}`;
    window.open(url, '_blank');
}


document.addEventListener('DOMContentLoaded', function () {

    if (!getToken()) {
        window.location.href = '/index.html';
        return;
    }

    initializeProfile();

    document.getElementById('btnActualizar').addEventListener('click', toggleEditMode);
    document.getElementById('btnCancelar').addEventListener('click', cancelarEdicion);
    document.getElementById('btnGuardar').addEventListener('click', guardarCambios);
    document.getElementById('btnEliminar').addEventListener('click', eliminarPerfil);
});
