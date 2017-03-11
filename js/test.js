//test source file

function equal(expected, get){
	if(expected==get){

	}
}

function getTime(){
	var current = new Date()
	return current.getHours() + ":" + current.getMinutes() + ":" + current.getSeconds()
}

function test1(){
	// message "11001000 00 000000000000001 1111"

	//prompt messages
	var prmpt = "test1==>";
	var prmptt = "test1==time: "+ getTime() + " ==>";
	
	//reference names array
	var attrNames = ["checksum", "label", "SDI", "DATA", "SSM", "BCD_check"];

	//start log
	console.log("test1==>start: " + getTime() + "\n");
	
	//generate arinc_byte check
	var arinc_byte = arinc_byte_gen("11001000000000000000000000111111", "11001000", "00", "000000000000001", "111", false);

	if(arinc_byte===false){ console.log("test1==>arinc_byte_gen failed\n");}
	else {console.log("test1==>arinc_byte_gen passed\n");}

	arinc_byte_checkArray = ["11001000000000000000000000111111", "11001000", "00", "000000000000001", "111", false];
	for(var i=0; i<arinc_byte_checkArray.length; ++i){
		if(arinc_byte[i] !== arinc_byte_checkArray[i]){
			console.log(prmpt + "arinc_byte>creation>value_fail>"+attrNames[i]);
		}
		else{console.log(prmpt + "arinc_byte>creation>value_pass>"+attrNames[i]);}
	}
}

function test2(){
	
	console.log("test2:...");
	
	var arinc_byte =arinc_byte_gen("11001000000000000000000000111111", "11001000", "00", "0000000000000011", "11", true);
	
	var x = process_data(arinc_byte);
	
	console.log(x);
	
}

function runTests(){
	//test runner

	test();
	test2();
}