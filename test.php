<!DOCTYPE html>
<?php
$serverName = "localhost";
$username = "root";
$password = "";
$dbname = "keys";
$email = "";
$pubkey = "";
$privkey = "";
?>

<?php
$connection = new sqli($serverName,$username,$password,$dbname);
if($connection->connect_error){
  die("Connect failed" . $conn-> connect_error);
}

$sql = "INSERT INTO keys(email,pub_key,priv_key), VALUES ('".$email. "', '".$pubkey."', '" .$privkey."')";

if($connection->query($sql) === TRUE){
  echo "Added";
}else{
  echo "Mistake here boss";
}
 ?>

<html>
  <body>
      <h1>Mail Encryption</h1>
      <form method ="post" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]);?>">
        Email:<br><input type="text" name="email" value="<?php echo $email;?>"><br>
        Public key:<br><input type="password" name="public" value="<?php echo $pubkey;?>"><br><br>
        Private key:<br><input type="password" name="private" value="<?php echo $privkey;?>"><br><br>
          <input type="submit" value="Submit">
        </form>
  </body>
</html>
