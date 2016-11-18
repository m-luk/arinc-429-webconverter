//TDD source file 


function test(){
	// message "11001000 00 000000000000001 1111"
	console.log("test1:...");
	
	var arinc_byte =arinc_byte_gen("1100100000000000000000000011111", "11001000", "00", "000000000000001", "111", false);
	
	var arinc_data = ["", "", "", "", "", "", ""];
	
	console.log(arinc_byte);
	console.log(arinc_byte[1]);
	arinc_byte[1] = reverse(arinc_byte[1]);
	console.log(arinc_byte[1]);
	
//	arinc_data[1] = toString(c_sysToDec(arinc_byte[1].slice(0, 2), 2)) + toString(c_sysToDec(arinc_byte[1].slice(3, 5), 2)) + toString(c_sysToDec(arinc_byte[1].slice(6, 7), 2));
	arinc_data[1] = c_sysToDec(arinc_byte[1].slice(0,3), 2) * 100 + c_sysToDec(arinc_byte[1].slice(3, 6), 2) * 10 + c_sysToDec(arinc_byte[1].slice(6, 8), 2);
	
	console.log(arinc_data[1]);
	
	
}

function test2(){
	
	console.log("test2:...");
	
	var arinc_byte =arinc_byte_gen("1100100000000000000000000011111", "11001000", "00", "0000000000000011", "11", true);
	
	var x = process_data(arinc_byte);
	
	console.log(x);
	
}


function runTests(){
	test();
	
	test2();
}