<?php

header('Access-Control-Allow-Origin: *');
header('Acess-Control-Allow-Method :POST,GET');
header( 'Content-Type: text/plain' );
header( 'Cache-Control: max-age=0' );
if ($_SERVER["REQUEST_METHOD"] == "GET") 
{
  $name = $_GET["purgefilename"];
  $jsonfile=file_get_contents("varnish-dashboard/vservers.json");
  $serverdetail=json_decode($jsonfile);
  $ip_array=$serverdetail->servers;
  $URL="/".$name;
  $debug= true;
  echo "<p><br>---- Curl debug -----<br></p>"; 
        foreach ($ip_array as $hostname) {
                  if($_GET[$hostname->servername] == "true")
                   {
                     
                purgeURL( $hostname->ipadress, $hostname->port, $URL, $debug );
                   }
              }
}
function purgeURL( $hostname, $port, $purgeURL, $debug )
{

$finalURL = sprintf("http://%s:%d%s", $hostname, $port, $purgeURL);
$curlOptionList = array(
CURLOPT_RETURNTRANSFER =>true,
CURLOPT_CUSTOMREQUEST =>'PURGE',
CURLOPT_HEADER =>true,
CURLOPT_NOBODY =>true,
CURLOPT_URL =>$finalURL,
CURLOPT_CONNECTTIMEOUT_MS =>2000
);


if( $debug == true ) {
$curlOptionList[CURLOPT_VERBOSE] = true;
}
$curlHandler = curl_init();
curl_setopt_array( $curlHandler, $curlOptionList );
$result=curl_exec( $curlHandler );
$response=curl_getinfo($curlHandler);
if($response['http_code']==200)//based on the response code from vcl
echo "<strong>purged<br></strong>".$finalURL."<br>";
if($response['http_code']==405)
echo "<strong>Can't purge using this ip address<br></strong>".$finalURL."<br>";
else
echo "<strong>Varnish Isn't running at this instance so can't send a purge request<br></strong>".$finalURL."<br>";
curl_close( $curlHandler );


}
?>
