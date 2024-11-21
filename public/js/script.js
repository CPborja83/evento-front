
function eliminarEvento(eventoID) {
    if (confirm('¿Estás seguro de que deseas eliminar este evento?')) {
        // Hacer una solicitud DELETE a tu backend para eliminar el evento
        fetch(`/eliminar/${eventoID}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                alert('Evento eliminado correctamente script');
                // Recargar la página o eliminar la fila de la tabla
                location.reload();
            } else {
                alert('Error al eliminar el evento script');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Ocurrió un error al eliminar el evento script');
        });
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const tipoEventoSelect = document.getElementById('tipoEventoID');
    const url = 'http://christianbm-001-site1.atempurl.com/api/Tipos';

    // Obtener tipos de evento
    fetch(url)
        .then(response => response.json())
        .then(data => {
            tipoEventoSelect.innerHTML = '<option value="">Seleccionar un tipo</option>';
            data.forEach(tipo => {
                const option = document.createElement('option');
                option.value = tipo.tipoEventoID;
                option.textContent = tipo.nombre;
                tipoEventoSelect.appendChild(option);
            });
        })
        .catch(error => console.error("Error al cargar los tipos de evento:", error));

    // Formulario de creación
    const createForm = document.getElementById('createForm');
    if (createForm) {
        createForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const formData = new FormData(createForm);
            const data = {
                nombre: formData.get('nombre'),
                fecha: formData.get('fecha'),
                ubicacion: formData.get('ubicacion'),
                descripcion: formData.get('descripcion'),
                tipoEventoID: formData.get('tipoEventoID'),
                tipoEvento: {
                    tipoEventoID: formData.get('tipoEventoID'),
                    nombre: formData.get('tipoEventoNombre'),
                    descripcion: formData.get('tipoEventoDescripcion')
                }
            };

            try {
                const response = await fetch('http://christianbm-001-site1.atempurl.com/api/Eventos', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });

                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

                alert('Evento creado exitosamente');
                window.location.href = '/';
            } catch (error) {
                console.error('Error al crear evento:', error);
                alert('Error al crear el evento. Intenta de nuevo más tarde.');
            }
        });
    }

    // Formulario de edición
    const editForm = document.getElementById('editForm');
    if (editForm) {
        editForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const formData = new FormData(editForm);
            const data = {
                EventoID: formData.get('eventoID'),
                nombre: formData.get('nombre'),
                fecha: formData.get('fecha'),
                ubicacion: formData.get('ubicacion'),
                descripcion: formData.get('descripcion'),
                tipoEventoID: formData.get('tipoEventoID'),
                tipoEvento: {
                    tipoEventoID: formData.get('tipoEventoID'),
                    nombre: formData.get('tipoEventoNombre'),
                    descripcion: formData.get('tipoEventoDescripcion')
                }
            };

            try {
                const response = await fetch(`http://christianbm-001-site1.atempurl.com/${formData.get('eventoID')}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });

                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

                alert('Evento actualizado exitosamente');
                window.location.reload();
            } catch (error) {
                console.error('Error al actualizar evento:', error);
                alert('Error al actualizar el evento. Intenta de nuevo más tarde.');
            }
        });
    }
});
