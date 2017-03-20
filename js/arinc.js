//script containing ARINC-429 byte language converter
//remoteVoyager <mlukaszewicz2@gmail.com>
/*

ARINC-429 is technical standard for the majority of avionics data bus used on commerical and transport aircraft.

arinc_byte arrays scheme:
index:
	0 - checksum (raw message)
	1 - label
	2 - SDI
	3 - DATA
	4 - SSM + parity bit
	5 - BCD boolean


arinc_data arrays scheme:
index:	
	0 - checksum (raw message)
	1 - label
	2 - SDI
	3 - DATA
	4 - SSM
	5 - parity bit

*/

function countParity(arinc_byte){
	//count occurences of "1"
	
	//number of "1" chars in string"
	var ct=0;
	//slice without parity bit
	var arinc_string = arinc_byte[0].slice(0, 30);

	//take index of first occurence
	var util = arinc_string.indexOf("1");

	//take all following
	while(util !== -1){
		ct++;

		//take next occurence
		util = arinc_string.indexOf("1", util + 1);
	}

	if(ct%2===0){ return 0; }
	else{ return 1; }
}

function checkIfValuesCorrect(str, values_set){
	//check if all characters of string are equal to at least one number from values_set
	for(var i = 0; i < str.length; i++){
		for(var j=0; j < values_set.length; j++){
			if(str[i]==values_set[j]){
				break;
			}
			else if(j==(values_set.length-1) && str[i] != values_set[j]){
				return false;
			}
		}
	}
	return true;
}


function arinc_byte_gen(input, label, SDI, DATA, SSM, BCD_st){
	//create and return concentrated arinc info (in binary state)

	if(input===""){
		return false;
	}

	var arinc_byte = [ input, label, SDI, DATA, SSM, BCD_st];
		
	return arinc_byte;
}


function getData(){
	//import data and check if it matches ARINC-429 standard

	//check if BCD flag is active
	var bcd_check = document.getElementById("c_in_tp").value;
	var str_inp = reverse(document.getElementById("arinc_inp").value);
	
	//check if inserted string is correct
	if(!checkIfValuesCorrect(str_inp, [0, 1])){
		console.log("ERROR - Inserted string contains non-binary characters");
		displayMsgInClassElements("outbox", "ERROR - Inserted string contains non-binary characters", 1, true);
		return false;
	}	
	else if(str_inp.length!=32){
		if(str_inp.length<32){
			console.log("ERROR - Inserted string shorter than 32 bits");
			displayMsgInClassElements("outbox", "ERROR - Inserted string shorter than 32 bits", 1, true);
		}
		else if(str_inp.length>32){
			console.log("ERROR - Inserted string longer than 32 bits");
			displayMsgInClassElements("outbox", "ERROR - Inserted string longer than 32 bits", 1, true);
		}
		else{
			console.log("ERROR - Input empty");
			displayMsgInClassElements("outbox", "ERROR - Input empty", 1, true);
		}
		return false;
	}

	var data = ["", "", "", "", "", "", ""];

	if(bcd_check=="BNR"){
		//BNR slicing
		data = arinc_byte_gen(str_inp, str_inp.slice(0, 8), str_inp.slice(8,10), str_inp.slice(10, 28), str_inp.slice(28, 32), false);
	}
	else{
		//BCD slicing
		data = arinc_byte_gen(str_inp, str_inp.slice(0, 8), str_inp.slice(8,10), str_inp.slice(10, 29), str_inp.slice(29, 32), true);
	}
	return data;	
}

function processData(arinc_byte){
	//convert data from arinc_byte binary (or BCD) strings to decoded form.

	var arinc_data = ["", "", "", "" ,"", "", ""];
	
	//write the whole message to "raw message" index
	arinc_data[0] = arinc_byte[0];
	
	//data assign label coded with direct conversion to octal an natural binary 
	arinc_data[1] = c_sysToSys(arinc_byte[1].slice(0, 8), 2 ,8);
	arinc_data[1] += "  (<b>in binary from 0 to 7: </b>" + arinc_byte[1] +"<b>)</b>";

	//check SDI value
	switch(arinc_byte[2]){
	case "00":
		arinc_data[2]="CALL ALL";
		break;
	case "10":
		arinc_data[2]="1";
		break;
	case "01":
		arinc_data[2]="2";
		break;
	case "11":
		arinc_data[2]="3";
		break;
	}

	//check conversion type
	if(arinc_byte[5] == true){	
		//BCD notation

		//check data value
		arinc_data[3] ="<b>In BCD:</b> " + arinc_byte[3] + "<b>&nbsp In decimal:</b> " + String(c_bcdToDec(arinc_byte[3]));

		//select SSM
		switch(arinc_byte[4].slice(0, 2)){
		case "00":
			arinc_data[4] = " 00 - Plus, North, East, Right, To, Over";
			break;
		case "01":
			arinc_data[4] = " 01 - (NCD – No Computed Data)";
			break;
		case "10":
			arinc_data[4] = " 10 - (FT - Functionality Test)";
			break;
		case "11":
			arinc_data[4] = " 11 - Minus, South, West, Left, From, Under";
			break;
		}

		//check for parity bit value
		arinc_data[5] = countParity(arinc_byte);
	}
	else{
		//BNR notation

		//check data value
		arinc_data[3] ="<b>In binary:</b> " + arinc_byte[3] + "&nbsp <b>In decimal:</b> " + String(c_sysToDec(arinc_byte[3], 2));
			
		//BNR sign check
		switch(arinc_byte[4].charAt(0)){
		case "0":
			arinc_data[4] = "Plus, North, East, Right, To, Over";
			break;
		case "1":
			arinc_data[4] = "Minus, South, West, Left, From, Under";
			break;
		}
		
		//sign-SSM spacing
		arinc_data[4]+=" ";
		
		//select SSM
		switch(arinc_byte[4].slice(1, 3)){				
		case "00":
			arinc_data[4] += " 00 - (FW – Failure Warning)";
			break;
		case "01":
			arinc_data[4] += " 01 - (NCD – No Computed Data)";
			break;
		case "10":
			arinc_data[4] += " 10 - (FT - Functionality Test)";
			break;
		case "11":
			arinc_data[4] += " 11 - (NO – Normal Operation)";
			break;
		}

		//check for parity bit value
		arinc_data[5] = countParity(arinc_byte);	
	}	
	return arinc_data;
}

function runArinc() {
	//main trigger for arinc conversion
	
	//clear outboxses values
	clearClassElements("outbox");
	
	//get and convert arinc-429 data to data variable
	//check if data import is availible
	var data = getData();

	//check for errors
	if(!data) {
		console.log("ERROR - Unable to collect data");
		return;
	}

	var out_data = processData(data);
	
	//labels for seperate arinc values
	var box_lb = ["Raw message", "Label", "SDI", "DATA", "SSM", "Parity bit"];
	
	//print value tags with their values	
	fillClassElements("outbox", out_data, box_lb, true);
}
