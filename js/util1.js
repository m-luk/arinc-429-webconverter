//script containing main engine of numeric systems converter
//remoteVoyager <mlukaszewicz2@gmail.com>

//constants
var BCD = "BCD";

function reverse(str) {
	//reverses string
	
	var out = "";
	for (var i = str.length - 1; i >= 0; i--)
		out += str[i];
	return out;
}

function pow(inp, root){
	//returns inp to the power of root
	f_inp = inp;
	if(root==0)
		return 1;
	
	for(var i=1; i<root; i++)
	{
	 inp*=f_inp;	 
	}
	return inp;
}

function checkIfHex(inp) {
	//checks if char is hex letter, if true returns its decimal representation, else returns false
	
	//comparision arrays
	var hex_arr = ['A', 'B', 'C', 'D', 'E', 'F', 'a', 'b', 'c', 'd', 'e', 'f'];
	
	for(var i = 0; i<12; i++)
	{
		
		if(inp==hex_arr[i] && i<=5)
			return (i+10);
		else if(inp==hex_arr[i])
			return (i+10-6);
	}
	return false;
}

function c_decToSys(inp, sys_root) {
	//converts decimal int to numeral system based on sys_root string 
	
	var out = "";
	var hex_arr = ['A', 'B', 'C', 'D', 'E', 'F'];
	
	while(inp>=1){
		//when 1
		if(inp==1) 
		{	
			out += '1';
			break;
		}
		//when no remainder
		else if(inp%sys_root==0)
		{
			out+='0';
			inp/=sys_root;
		}
		//when with remainder
		else
		{
			var util = 0;
			while(inp%sys_root!=0)
			{
				inp--;
				util++;
			}
			inp/=sys_root;
			if(util<10)
				out += util.toString();
			else
				out += hex_arr[(util-10)];
		}	
	}
	return reverse(out);
}

function c_sysToDec(inp, sys_root){
	//converts inp from numeral system based on sys_root to int decimal value
	
	inp = reverse(inp);
	var out = 0;
		
	for(var i =0; i<inp.length; i++){
		
		var k = checkIfHex(inp[i]);
		
		if(k!=false){
			j = k;
		} 
		else {
			j = parseInt(inp[i]);	
		}
		if(j>=sys_root){
			return false;
		}
		
		out += (pow(sys_root, i) * j);
	}
	return out;
}

function c_bcdToDec(inp, grouped = false){
	//conversion from BCD to decimal value

	if(grouped) { inp = inp.replace(/[^0-9]/g, '')};

	var quartet = "";
	var dec_out = "";
	var ct = 0;

	for(var i=0; i<=inp.length; i++, ct++){
		if(i==inp.length){
			dec_out += String(c_sysToDec(quartet, 2));
		}
		else if(ct==4){
			dec_out += String(c_sysToDec(quartet, 2));
			quartet = "";
			ct=0
			quartet += inp[i];
		}
		else{
			quartet += inp[i];
		}
	}
	return parseInt(dec_out);
}

function c_sysToSys(input, in_sys, out_sys){
	//converts one numeric system string to another numeric system stirng
	//no support for BCD
	
	return c_decToSys(c_sysToDec(input, in_sys), out_sys);
}