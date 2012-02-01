<?php
if (isset($GLOBALS["HTTP_RAW_POST_DATA"]))
{
// Get the data like you would with traditional post
$rawImage=$GLOBALS['HTTP_RAW_POST_DATA'];

// Remove the headers  
$removeHeaders=substr($rawImage, strpos($rawImage, ",")+1);

// decode it from base 64 and into image data only
$decode=base64_decode($removeHeaders);

// save to your server
$random = mt_rand();
$fopen = fopen( $random . '.png', 'wb' );
fwrite( $fopen, $decode);
fclose( $fopen );
echo $random;
}
?>
