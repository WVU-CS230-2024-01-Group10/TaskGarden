<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>User Login</title>
    <link rel="stylesheet" href="style.css" />
</head>
<body>
    <div className="container">
        <form id="loginForm" action="login.php" method="POST">
            <h2>User Login</h2>
            <input type="email" name="email" placeholder="Email" required />
            <input type="password" name="password" placeholder="Password" required />
            <button type="submit">Login</button>
            <a href="register.html">New User? Register Here</a>
            <a href="forgot_password.html">Forgot Password?</a>
            <a href="forgot_username.html">Forgot Username?</a>
        </form>
    </div>
    <script src="script.js"></script>
</body>
</html>




