<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport"
          content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet"
    href="captcha.css">
    <link rel="stylesheet" href=
"https://use.fontawesome.com/releases/v5.15.3/css/all.css"
        integrity=
"sha384-SZXxX4whJ79/gErwcOYf+zWLeJdY/qpuqC4cAa9rOGUstPomtqpuNWT9wdPEn2fk"
        crossorigin="anonymous">
    <script src="captcha.js"></script>
</head>
 
<body onload="generate()">
    <div id="user-input" class="inline">
        <input type="text"
               id="submit"
               placeholder="Captcha code" />
    </div>
 
    <div class="inline" onclick="generate()">
        <i class="fas fa-sync"></i>
    </div>
 
    <div id="image"
         class="inline"
         selectable="False">
    </div>
    <input type="submit"
           id="btn"
           onclick="printmsg()" />
 
    <p id="key"></p>
</body>
</html>
