<?php
$rand = $_GET["rand"];
$fileName = $rand . '.png';
unlink($fileName);
?>
