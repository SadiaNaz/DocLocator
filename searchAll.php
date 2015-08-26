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
	$type = $_POST["docType"];
    $datetime= $_POST["datetime"];
	$hospital = $_POST["hospital"]; 
	
	if($datetime != "null"){
	$pieces = explode("T", $datetime );
	$date = $pieces[0];
	$time = ((float)($pieces[1][0].$pieces[1][1])*100) + (float)($pieces[1][3].$pieces[1][4]);
	}
	
	else{
			$date = "null";
			$time = "null";

	}
	
	if 		($type == "Plastic ") 
					$type = "Plastic & Burn Surgeon";
	elseif  ($type == "General ") 
				$type = "General & Laparoscopic Surgeons";
	elseif  ($type == "Anesthesia ") 
				$type = "Anesthesia & Intensive Care";
	
	
	$query = new ParseQuery("DoctorsTable");
	
	if($name != "null")	$query->equalTo("Name", $name);
	if($gender != "Both")	$query->equalTo("Gender", $gender);
	if($type != "All")	$query->equalTo("Job", $type);
	
	$results = $query->find();

	echo recordSetToJson($results,$date,$time);


				
function recordSetToJson($results,$date,$time) { //Converts the result set into JSON row by row - return type: Array
	$resultsArr = array();
	$dt = strtotime($date);
	$day = date("D", $dt);
	
	for ($i = 0; $i < count($results); $i++) {

	  $object = $results[$i];

	  
		$d = new Doctor();
		$d->name = $object->get('Name');
		$d->type = $object->get('Job');
		$d->gender = $object->get('Gender');
		$d->location = $object->get('Hospital');
		
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
				
		
		$d->schedule = $object->get('Scehdule');
		$d->qualifications = $object->get('Qualifications');
		$profilePhoto = $object->get("Images");
		$d->photoUrl = $profilePhoto->getUrl();
		
		if($date != "null"){
		$pieces = explode("/", $d->schedule );
		//$d->schedule = $pieces;
		$d->schedule = str_replace("/", "\r\n ", $d->schedule);
		$d->schedule = str_replace("(", "\t\t ", $d->schedule);
		$d->schedule = str_replace(")", "\t\t ", $d->schedule);
		$isValid = 0;
		
		for ($j = 0; $j < sizeof($pieces )-1; $j++){
			
			if  ( $pieces[$j][0] == $day[0] &&  $pieces[$j][1] == $day[1]){
				$snum = (float)$pieces[$j][4];
					if($pieces[$j][9] == 'P'){
						$snum = 12 + (float)$pieces[$j][4];
					}
					$snum = ($snum*100) + (float)($pieces[$j][6].$pieces[$j][7]) ;
					
					$fnum = (float)$pieces[$j][12];
					
					if($pieces[$j][17] == 'P'){
						$fnum = 12 + (float)$pieces[$j][12];
					}
					$fnum = ($fnum*100) + (float)($pieces[$j][14].$pieces[$j][15]) ;
					
					if($fnum < $snum){
						if(($time < $fnum && $time <= $snum) || ($time > $fnum && $time >= $snum)) $isValid = 1;
					}
					else {
						if($time < $fnum && $time >= $snum)  $isValid = 1;
						
					}	
				}
			}
			
			if($isValid ==1)
		  $resultsArr[] = $d;
		}
		else {
			$resultsArr[] = $d;
			
		}

	}
	return json_encode($resultsArr,JSON_UNESCAPED_SLASHES);
 
} 



?>