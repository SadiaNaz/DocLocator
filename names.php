<?php
date_default_timezone_set('Africa/Lagos');

$app_id="0vowIPPDvIl9dRt8bp8aJdLRByU7C1HTebd8bGV8";
$rest_key="7oigdPK1ooyO7vkZWg5lqnLQgXmGJiD6OYOtlbEJ";
$master_key="As27lE5nPzgTMJrYA5Fpyc5T9duavmYT257Qz7z3";

require 'autoload.php';
Parse\ParseClient::initialize( $app_id, $rest_key, $master_key );


use Parse\ParseObject;
use Parse\ParseQuery;
use Parse\ParseACL;
use Parse\ParsePush;
use Parse\ParseUser;
use Parse\ParseInstallation;
use Parse\ParseException;
use Parse\ParseAnalytics;
use Parse\ParseFile;
use Parse\ParseCloud;
use Parse\ParseClient;


class DocName {
       public $name = "";
   }


	$name = $_POST["name"];
	$results = "";
	$name1 = $name;
	
	if(strlen($name) > 0){
		$name[0] = strtoupper($name[0]); 
		
		$ind = strpos($name1, ' ');
		if ($ind === true) {
			$name[$ind + 1] = strtoupper($name[$ind + 1]);
		}
	}
	 
	
	$query = new ParseQuery("Doctor");
	$query->startsWith("Name", $name);
	
	$results = $query->find();
	
	echo recordSetToJson($results);


				
function recordSetToJson($results) { //Converts the result set into JSON row by row - return type: Array
	$resultsArr = array();
	for ($i = 0; $i < count($results); $i++) {

	  $object = $results[$i];

	  $d = new DocName();
	  $d->name = $object->get('Name');
	  
	  $resultsArr[] = $object->get('Name');

	}
	return json_encode($resultsArr);
 
} 

?>