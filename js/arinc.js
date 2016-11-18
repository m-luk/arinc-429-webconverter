//script containing ARINC-429 byte language converter
/*

TODO: ARINC-429 description


mluakaszewicz

2016

*/


//arrays scheme
//0 checksum
//1 label:"",
//2 SDI:"",
//3 DATA:"",
//4 SSM:"",
//5 p_bit:"",
//6 BCD_val:false


//var arinc_byte;
//var arinc_data;

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

	var arinc_byte = [ input, label, SDI, DATA, SSM, BCD_st ];	//assign to variable
	
	//debug
	console.log("arinc_byte generated");

	//debug info print
	//console.log("arinc_byte: " + arinc_byte);

	return arinc_byte;
}


function get_data(){
	bcd_check = document.getElementById("c_in_tp").value;					//check if BCD flag is active
	str_inp = reverse(document.getElementById("arinc_inp").value);			//take input and reverse it 
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
	
	//debug
	//console.log(data);
	
	return data;
}

function process_data(arinc_byte){
	var arinc_data = ["", "", "", "" ,"", "", ""];
	
	arinc_data[0] = arinc_byte[0];						//write the whole message to first place in data arr
	
	arinc_byte[1] = reverse(arinc_byte[1]);				//label write
	//arinc_data[1] = c_sysToDec(arinc_byte[1].slice(0,3), 2) * 100 + c_sysToDec(arinc_byte[1].slice(3, 6), 2) * 10 + c_sysToDec(arinc_byte[1].slice(6, 8), 2);
	
	//label coded with direct conversion to octal an reverse
	arinc_data[1] = c_sysToSys(reverse(arinc_byte[1].slice(0, 8)), 2 ,8) + " (<b>in binary from 0 to 7: </b>" + reverse(arinc_byte[1]) +"<b>)</b>";


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

	
	console.log("chose: " + arinc_byte[5]);
	
	if(arinc_byte[5] == true){
		//TODO: bcd value change
		//BCD info
		
		console.log("processing bcd");
		
		//SSM
		switch(arinc_byte[4].slice(0, 2)){
			case "00":
				arinc_data[4] = "- 00 - Plus, Północ, Wschód, Prawo, Do, Powyżej";
				break;
			case "01":
				arinc_data[4] = "- 01 - Brak danych (NCD – No Computed Data)";
				break;
			case "10":
				arinc_data[4] = "- 10 - Test funkcjonalny (FT)";
				break;
			case "11":
				arinc_data[4] = "- 11 - Minus, Południe, Zachód, Lewo, Od, Poniżej";
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
		arinc_data[3] ="IN binary: " + arinc_byte[3] + "&nbsp In decimal: " + String(c_sysToDec(arinc_byte[3], 2));
		
		//BNR sign check
		switch(arinc_byte[4].charAt(0)){
			case '0':
				arinc_data[4] = "Plus, Północ, Wschód, Prawo, Do, Powyżej";
				break;
			case '1':
				arinc_data[4] = "Minus, Południe, Zachód, Lewo, Od, Poniżej";
				break;
		}
		
		arinc_data[4]+=' ';
		
		switch(arinc_byte[4].slice(1, 3)){
			case "00":
				arinc_data[4] += "- 00 - Ostrzeżenie o błędzie (FW – Failure Warning)";
				break;
			case "01":
				arinc_data[4] += "- 01 - Brak danych (NCD – No Computed Data)";
				break;
			case "10":
				arinc_data[4] += "- 10 - Test funkcjonalny (FT)";
				break;
			case "11":
				arinc_data[4] += "- 11 - Dane prawidłowe (NO – Normal Operation)";
				break;
		}
		
		console.log("BNR SSM = " + arinc_byte[4]);
		
		arinc_data[5] = ct_parity(arinc_byte);		//check for parity bit value

		
	}
	
	console.log("proccessing succes")
	
	return arinc_data;
}

function run_arinc(){
	//var inp = document.getElementById("arinc_inp").value;
	
	//get and convert arinc-429 data to data variable
	var out_data =process_data(get_data());
	
	//debug, data check
	console.log(out_data);
	
	//get output containers
	var boxs = document.getElementsByClassName("outbox");
	
	//labels for seperate arinc values
	var box_lb = ["Raw message", "Label", "SDI", "DATA", "SSM", "Bit parzystości"]
	

	//print value tags with their values
	for(var i=0; i<boxs.length; i++){
		boxs[i].innerHTML ="<b>" + box_lb[i] + ":</b> " + out_data[i];
	}
	
	
}








