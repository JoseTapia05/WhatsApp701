var socket = io.connect('3.17.147.175');

// Elementos del DOM
var persona = document.getElementById('login-usuario'),
    appChat = document.getElementById('app-chat'),
    panelLogin = document.getElementById('login-panel'),
    usuario = document.getElementById('nombre-usuario'),
    password = document.getElementById('login-password'),
    mensaje = document.getElementById('mensaje'),
    botonEnviar = document.getElementById('enviar'),
    escribiendoMensaje = document.getElementById('escribiendo-mensaje'),
    output = document.getElementById('output'),
    loginMensaje = document.getElementById('login-mensaje');

// Función para enviar credenciales de inicio de sesión
function login() {
    if (persona.value && password.value) {
        // Enviar los datos de inicio de sesión al servidor
        socket.emit('login', {
            usuario: persona.value,
            password: password.value
        });
    } else {
        alert("Por favor, ingresa usuario y contraseña.");
    }
}

// Manejar la respuesta del servidor después del login
socket.on('loginResponse', function (data) {
    if (data.success) {
        // Ocultar el panel de login y mostrar la app de chat
        panelLogin.style.display = "none";
        appChat.style.display = "block";
        usuario.textContent = persona.value; // Mostrar el nombre del usuario en la interfaz del chat
    } else if (data.error === 'userNotFound') {
        loginMensaje.innerHTML = '<p style="color:red;">Usuario no encontrado. Intenta de nuevo.</p>';
    } else if (data.error === 'wrongPassword') {
        loginMensaje.innerHTML = '<p style="color:red;">Contraseña incorrecta. Intenta de nuevo.</p>';
    } else {
        loginMensaje.innerHTML = '<p style="color:red;">Error en el servidor. Intenta más tarde.</p>';
    }
});

// Función para enviar un mensaje en el chat
function enviarMensaje() {
    if (mensaje.value) {
        // Enviar el mensaje al servidor
        socket.emit('chat', {
            mensaje: mensaje.value,
            usuario: persona.value
        });
        mensaje.value = ''; // Limpiar el campo de texto después de enviar el mensaje
    }
}

// Notificar cuando el usuario está escribiendo un mensaje
function escribiendoMensaje() {
    if (mensaje.value) {
        socket.emit('typing', {
            nombre: persona.value,
            texto: mensaje.value
        });
    }
}

// Recibir mensajes de chat del servidor y mostrarlos en la interfaz
socket.on('chat', function (data) {
    escribiendoMensaje.innerHTML = ''; // Limpiar la notificación de "escribiendo"
    output.innerHTML += '<p><strong>' + data.usuario + ':</strong> ' + data.mensaje + '</p>'; // Mostrar el mensaje en la pantalla
});

// Mostrar el mensaje de "escribiendo" cuando alguien está redactando un mensaje
socket.on('typing', function (data) {
    if (data.texto) {
        escribiendoMensaje.innerHTML = '<p><em>' + data.nombre + ' está escribiendo un mensaje...</em></p>';
    } else {
        escribiendoMensaje.innerHTML = ''; // Limpiar el mensaje de "escribiendo" si el campo de texto está vacío
    }
});

// Recibir mensajes anteriores cuando el usuario inicia sesión
socket.on('mensajesAnteriores', function (mensajes) {
    mensajes.forEach(function (mensaje) {
        output.innerHTML += '<p><strong>' + mensaje.usuario + ':</strong> ' + mensaje.mensaje + '</p>'; // Mostrar cada mensaje anterior en la pantalla
    });
});
