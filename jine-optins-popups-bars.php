<?php
/*
Plugin Name: Jine Optins Popups & Bars
Description: Optin plugin that adds Exit popups and Bars on a website
Author: Jayasri Nagrale
Version: 0.0.1
*/

/*
- this is the very first file that is called when the plugin loads on admin side
- during automated release, this file is replaced by another file of the same name
from the deploments folder where the error display are commented (first 3 lines below)
*/

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

set_include_path("./");

//adding only if the class has not been loaded already.
//useful if there are multiple plugins of yetience family being used.
if(!class_exists("Yetience")){
	include 'wordpress/yetience-class.php';
}

//read product.json - file had details on this product (yeloni exit popup)
$product = json_decode(file_get_contents('product.json', true), true); // decode the JSON into an associative array

//read deployment.json
$deployment_json = json_decode(file_get_contents('deployment.json', true), true); // decode the JSON into an associative array
$deployment = $deployment_json['deployment'];
$yetience_plugin_version = $deployment_json['version'];

//calling the class yetience-class.php
new Yetience($product['label'], $product['title'], $product['folder'], dirname(__FILE__), $deployment, $yetience_plugin_version);

?>
