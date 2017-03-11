//script containing ARINC-429 byte language converter
//remoteVoyager <mlukaszewicz2@gmail.com>
/*

TODO: ARINC-429 description

arinc_byte arrays scheme:
index:	
	0 - checksum (raw message)
	1 - label
	2 - SDI
	3 - DATA
	4 - SSM
	5 - BCD boolean


arinc_data arrays scheme:
index:	
	0 - checksum (raw message)
	1 - label
	2 - SDI
	3 - DATA
	4 - SSM
	5 - p_bit


*/

function ct_parity(arinc_byte){
	//count occurences of '1'
	
	var ct=0;								//variable containg numer of '1' chars in string"
	
	var util = arinc_byte[0].indexOf('1');	//take index of first occurence

	while(util !== -1){						//take all following
		ct++;
		util = arinc_byte[0].indexOf('1', util + 1);	//take next occurence
	}

	//debug
	console.log(ct);

	if(ct%2===0){ return 0; }				//if even number of '1'
	else{ return 1; }						//odd number of 
	
}


function arinc_byte_gen(input, label, SDI, DATA, SSM, BCD_st){
	//create and return concentrated arinc info (in binary state)

	if(input===""){
		console.log("arinc_byte_gen FAILED, Empty input message");
		return false;
	}

	var arinc_byte = [ input, label, SDI, DATA, SSM, BCD_st];	//assign to variable
	
	//debug
	console.log("arinc_byte generated");
	
	return arinc_byte;
}


function get_data(){
	bcd_check = document.getElementById("c_in_tp").value;					//check if BCD flag is active
	str_inp = reverse(document.getElementById("arinc_inp").value);			//take input and reverse it 
	if(str_inp.length!=32){													//check if input word correct length
		console.log("ERROR - Input string diffrent than 32 bit")
		return false;
	}
	var data = ["", "", "", "", "", "", ""];								//created summary array
	if(bcd_check=="BNR"){
		//binary label
		console.log("entered binary get_data");
		data = arinc_byte_gen(reverse(str_inp) , str_inp.slice(0, 8), str_inp.slice(8,10), str_inp.slice(10, 28), str_inp.slice(28, 31), false);
	}
	else{
		//BCD label
		console.log("entered BCD get_data");
		data = arinc_byte_gen(reverse(str_inp), str_inp.slice(0, 8), str_inp.slice(8,10), str_inp.slice(10, 29), str_inp.slice(29, 31), true);
	}
	
	console.log("succesfully prepared data");
	return data;	
}

function process_data(arinc_byte){
	var arinc_data = ["", "", "", "" ,"", "", ""];
	
	arinc_data[0] = arinc_byte[0];						//write the whole message to 'raw message' index
	
	arinc_byte[1] = reverse(arinc_byte[1]);				//label write
	
	//data assign label coded with direct conversion to octal an natural binary 
	arinc_data[1] = c_sysToSys(reverse(arinc_byte[1].slice(0, 8)), 2 ,8);
	arinc_data[1] += "  (<b>in binary from 0 to 7: </b>" + reverse(arinc_byte[1]) +"<b>)</b>";

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

	//
	console.log("chose: " + arinc_byte[5]);
	
	//check conversion type
	if(arinc_byte[5] == true){
		//TODO: bcd value change
		//BCD info
		
		console.log("data processing bcd");
		//check data value
		arinc_data[3] ="<b>In BCD:</b> " + arinc_byte[3] + "&nbsp <b>In decimal:</b> " + String(c_bcdToDec(arinc_byte[3]));


		//SSM
		switch(arinc_byte[4].slice(0, 2)){
			case "00":
				arinc_data[4] = "- 00 - Plus, North, East, Right, To, Over";
				break;
			case "01":
				arinc_data[4] = "- 01 - (NCD – No Computed Data)";
				break;
			case "10":
				arinc_data[4] = "- 10 - (FT - Functionality Test)";
				break;
			case "11":
				arinc_data[4] = "- 11 - Minus, South, West, Left, From, Under";
				break;
		}
		
		arinc_data[3] = "In BCD " + arinc_byte[3];
		
		//debug
		console.log("BCD SSM = " + arinc_data[4]);

		arinc_data[5] = ct_parity(arinc_byte);		//check for parity bit value
		
	}
	else{
		console.log("data processing BNR");
		//check data value
		arinc_data[3] ="<b>In binary:</b> " + arinc_byte[3] + "&nbsp <b>In decimal:</b> " + String(c_sysToDec(arinc_byte[3], 2));
			
		//BNR sign check
		switch(arinc_byte[4].charAt(0)){
			case '0':
				arinc_data[4] = "Plus, North, East, Right, To, Over";
				break;
			case '1':
				arinc_data[4] = "Minus, South, West, Left, From, Under";
				break;
		}
		
		arinc_data[4]+=' ';
		
		//choose SSM
		switch(arinc_byte[4].slice(1, 3)){				
			case "00":
				arinc_data[4] += "- 00 - (FW – Failure Warning)";
				break;
			case "01":
				arinc_data[4] += "- 01 - (NCD – No Computed Data)";
				break;
			case "10":
				arinc_data[4] += "- 10 - (FT - Functionality Test)";
				break;
			case "11":
				arinc_data[4] += "- 11 - (NO – Normal Operation)";
				break;
		}
		
		console.log("BNR SSM = " + arinc_byte[4]);
		
		arinc_data[5] = ct_parity(arinc_byte);		//check for parity bit value
		
	}
	
	console.log("proccessing succes")
	
	return arinc_data;
}

function run_arinc() {
	//main runner for arinc conversion
	
	//clear outboxses values
	clearClassElements("outbox");

	//get output containers
	var boxs = document.getElementsByClassName("outbox");

	//data store
	var data
	
	//get and convert arinc-429 data to data variable
	//check if data import is availible
	if(!get_data()) {
		console.log("ERROR - Unable to collect data");
		displayMsgInClassElements("outbox", "ERROR - Unable to collect data", 0);
		return;
	}
	else { 
		data = get_data(); 
	}		
	
	var out_data = process_data(data);
	
	//debug, data check
	console.log(out_data);
	
	//labels for seperate arinc values
	var box_lb = ["Raw message", "Label", "SDI", "DATA", "SSM", "Parity bit"];
	
	//print value tags with their values

	fillClassElements("outbox", out_data, box_lb, true);
}
