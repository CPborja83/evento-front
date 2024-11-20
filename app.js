const express = require('express');
const axios = require('axios');
const path = require('path');
const https = require('https'); // Necesario para solicitudes HTTPS

const httpsAgent = require('https').Agent({ rejectUnauthorized: false });

const app = express();
const port = 3000;
const cors = require('cors');
app.use(cors()); // Permite solicitudes desde otros dominios



// Configurar EJS como motor de plantillas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Usar path.join para manejar rutas

// Ruta para renderizar la página de creación
app.get('/crear', (req, res) => {
    res.render('crear');  // Asegúrate de que el archivo 'crear.ejs' exista en la carpeta 'views'
});

// Servir archivos estáticos (CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Parsear datos de formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta principal para mostrar los eventos
app.get('/', async (req, res) => {
    try {
        // Hacemos la solicitud a la API de eventos
        const response = await axios.get('https://localhost:7275/api/eventos', { httpsAgent });
        const eventos = response.data; // Obtenemos los eventos de la respuesta
        res.render('index', { eventos }); // Pasamos los eventos a la vista EJS
    } catch (error) {
        console.error('Error al obtener los eventos: ', error.message);
        res.send('Error al obtener los eventos'); // Muestra un mensaje en caso de error
    }
});


app.put('/editar/:id', async (req, res) => {
    const eventoID = req.params.id;  // Obtiene el ID del evento desde la URL
    const { nombre, fecha, ubicacion, descripcion, tipoEventoID, tipoEventoNombre, tipoEventoDescripcion } = req.body; // Añadir los campos del cuerpo de la solicitud

    console.log(`Recibida solicitud PUT para evento con ID: ${eventoID}`);
    console.log('Datos recibidos:', req.body);

    try {
        // Realiza la solicitud PUT a la API de .NET Core para actualizar el evento
        const response = await axios.put(`https://localhost:7275/api/eventos/${eventoID}`, {
            eventoID: eventoID,
            nombre: nombre,
            fecha: fecha,
            ubicacion: ubicacion,
            descripcion: descripcion,
            tipoEventoID: tipoEventoID,
            tipoEvento: {  // Añadir el objeto anidado tipoEvento
                tipoEventoID: tipoEventoID,  // ID del tipo de evento
                nombre: tipoEventoNombre,    // Nombre del tipo de evento
                descripcion: tipoEventoDescripcion // Descripción del tipo de evento
            }
        });

        res.json(response.data); // Enviar la respuesta de vuelta al cliente
    } catch (error) {
        console.error('Error al actualizar el evento:', error.message);
        res.status(500).send(`Error al actualizar el evento: ${error.message}`);
    }
});


app.post('/crear', async (req, res) => {
    const nuevoEvento = {
        nombre: req.body.nombre,
        fecha: req.body.fecha,
        ubicacion: req.body.ubicacion,
        tipoEventoID: req.body.tipoEventoID,
        descripcion: req.body.descripcion,
        tipoEvento: req.body.tipoEvento  // Asegúrate de que esta parte sea necesaria
    };

    try {
        await axios.post('https://localhost:7275/api/eventos', nuevoEvento, { httpsAgent });
        res.redirect('/');  // Redirige a la página principal después de crear el evento
    } catch (error) {
        console.error('Error al crear el evento:', error.message);
        res.send(`Error al crear el evento: ${error.message}`);
    }
});

app.delete('/eliminar/:id', async (req, res) => {
    const eventoID = req.params.id;
    console.log(`Recibida solicitud DELETE para eliminar el evento con ID: ${eventoID}`);

    try {
        const response = await axios.delete(`https://localhost:7275/api/Eventos/${eventoID}`, { httpsAgent });
        console.log('Respuesta de la API:', response.status);  // Para ver la respuesta
        if (response.status === 200) {
            console.log(`Evento con ID ${eventoID} eliminado correctamente a`);
            res.status(200).send({ message: 'Evento eliminado correctamente aa' });
        } else {
            console.error('No se pudo eliminar el evento en el backend aa');
            res.status(response.status).send({ message: 'Error al eliminar el evento a' });
        }
    } catch (error) {
        console.error('Error al eliminar el evento aa:', error.message);
        res.status(500).send(`Error al eliminar el evento aaa: ${error.message}`);
    }
});


// Servir el servidor en el puerto 3000
app.listen(port, () => {
    console.log(`Servidor de frontend corriendo en http://localhost:${port}`);
});
