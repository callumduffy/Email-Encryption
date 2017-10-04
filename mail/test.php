<!DOCTYPE html>
<?php
  $serverName = "localhost";
  $username = "root";
  $password = "";
  $dbname = "keys";
  $email = htmlspecialchars($_POST['email']);
  $pubkey = htmlspecialchars($_POST['public']);
  $privkey = htmlspecialchars($_POST['private']);
?>

<?php
  $file = "keys.json";
  $json = json_decode(file_get_contents($file),TRUE);
  echo "$email";
  $json["keys"] = array("email"=> $email, "pub" => $pubkey, "priv" => $privkey);
  file_put_contents($file, json_encode($json));
 ?>

<html>
  <body>
      <h1>Mail Encryption</h1>
      <form method ="post" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]);?>">
        Email:<br><input type="text" name="email" value=""><br>
        Public key:<br><input type="password" name="public" value=""><br><br>
        Private key:<br><input type="password" name="private" value=""><br><br>
          <input type="submit" value="Submit">
        </form>
  </body>
</html>
