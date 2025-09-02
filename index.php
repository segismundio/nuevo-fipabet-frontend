<?php
include "config.php"; // Incluye la conexión y la sesión
include "includes/auth.php"; // Incluye la función de autenticación
?>
<?php include "includes/header.php"; ?>

<nav>
    <a href="index.php">Inicio</a> |
    <?php if (is_logged_in()) { ?>
        <a href="dashboard.php">Mi Panel</a> |
        <a href="ranking.php">Ranking</a> |
        <a href="logout.php">Salir</a>
    <?php } else { ?>
        <a href="login.php">Iniciar Sesión</a> |
        <a href="register.php">Registrarse</a>
    <?php } ?>
</nav>

<div class="content">
    <?php if (is_logged_in()) { ?>
        <h2>Bienvenido de nuevo, <?= htmlspecialchars($_SESSION['username']) ?>!</h2>
        <p>Estás listo para apostar. ¡Accede a tu panel para ver las preguntas!</p>
        <a href="dashboard.php" class="button">Ir al panel de control</a>
    <?php } else { ?>
        <h2>¡Bienvenido a FIPABET!</h2>
        <p>Tu plataforma de apuestas de FIPAS. ¿Estás listo para poner a prueba tu conocimiento?</p>
        <a href="register.php" class="button">Regístrate ahora</a>
        <a href="login.php" class="button">Ya tengo una cuenta</a>
    <?php } ?>
</div>

<style>
    .content {
        text-align: center;
        margin-top: 50px;
    }
    .content a.button {
        display: inline-block;
        padding: 10px 20px;
        margin: 10px;
        background-color: #0056b3;
        color: white;
        text-decoration: none;
        border-radius: 5px;
    }
    .content a.button:hover {
        background-color: #004494;
    }
</style>

<?php include "includes/footer.php"; ?>