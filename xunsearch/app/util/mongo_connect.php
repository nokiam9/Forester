<?php

ini_set('display_errors','1');
error_reporting(E_ALL);

$uri = getenv("MONGODB_URI");
$manager = new MongoDB\Driver\Manager($uri);

$rp = new MongoDB\Driver\ReadPreference(MongoDB\Driver\ReadPreference::RP_PRIMARY);
$server = $manager->selectServer($rp);

var_dump($server->getInfo());

?>