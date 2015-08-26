<?php
//contact -> Number
//location -> Hospital
//Qualification
//Images type=File

date_default_timezone_set('Africa/Lagos');

$app_id="bWBg10fbvRRs1E6DLjSTQNVoctDfp5UU7oZXNaNx";


$rest_key="Q5v87W4z4C0j6yO7tzrPoAuaWQt3GYWuoYxn2Mox";
$master_key="9i46pyKHaPkRiN0LFFerOjbczve7tnZjIt4ISn6K";

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


class Doctor {
       public $name = "";
       public $type  = "";
       public $gender = "";
       public $location = "";
	   public $qualifications = "";
	   public $schedule = "";
	   public $schedule1 = "";
   }
   
class Sched {
       public $day = "";
       public $timeperiod  = "";

   }
	$results = "";
	
	$name = $_POST["name"];
	$gender = $_POST["gender"];
	$hospital = $_POST["hospital"];  //Not Needed for Now
	
	
	$query = new ParseQuery("DoctorsTable");
	
	$query->addAscending("Name");
	$query->addAscending("Job");
	
	if($name != "null")	$query->equalTo("Name", $name);
	if($gender != "Both")	$query->equalTo("Gender", $gender);
	
	$results = $query->find();
	

	echo recordSetToJson($results);


				
function recordSetToJson($results) { //Converts the result set into JSON row by row - return type: Array
	$resultsArr = array();
	for ($i = 0; $i < count($results); $i++) {

		$object = $results[$i];
		$d = new Doctor();
		 
		$d->name = $object->get('Name');
		$d->type = $object->get('Job');
		$d->gender = $object->get('Gender');
		$d->location = $object->get('Hospital');
		$d->qualifications = $object->get('Qualifications');
		
		  $d->schedule  = $object->get('Scehdule');
		  $d->schedule = str_replace(")", "", $d->schedule);
		  $pieces = explode("/", $d->schedule );
			
		   for ($j = 0; $j < sizeof($pieces )-1; $j++){
			$parts = explode("(", $pieces[$j]);
			$s = new Sched();
			$s->day = $parts[0];
			$s->timeperiod = $parts[1];

			$d->schedule1[] = $s;
			
		   }
			
		$profilePhoto = $object->get("Images");
		$d->photoUrl = $profilePhoto->getUrl();
		  
		$resultsArr[] = $d;
		
	}
	return json_encode($resultsArr,JSON_UNESCAPED_SLASHES);
 
} 


?>