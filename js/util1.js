//script containing main engine of numeral systems converter
//nightspired.dev 2016

function reverse(s) {
	//reverses string
	var o = "";
	
	for (var i = s.length - 1; i >= 0; i--)
		o += s[i];
	
	return o;
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

function BCD_toDec(inp){
	util ="";
	out = "";
	ct =0;	
	for(var i=0; i<inp.length; i++, ct++){
		if(ct==3){
			out += c_sysToDec(util, 2).toString();
			ct=0;
			continue;
		}
		else if(i==(inp.length-1)){
			util += inp[i];
			out += c_sysToDec(util, 2).toString();
			ct=0;
			break;
			
		}
		else{
			util += inp[i];
		}
	}
	
	return out;
}

function c_sysToSys(input, in_sys, out_sys){
	//converts one numeric system string to another numeric system stirng
	return c_decToSys(c_sysToDec(input, in_sys), out_sys);
}




function c_submitConverter(){
	
	//clear stream
	document.getElementById("out").innerHTML="";
	
	
	
	//get variables
	var inp = document.getElementById("inp").value;
	var i_sys_root = parseInt(document.getElementById("s_in").value);
	var o_sys_root = parseInt(document.getElementById("s_out").value);
	var c_out;
	
	if(inp==""){
		document.getElementById("out").innerHTML = "Input box empty";
		return;
	}
	//choosing operation
	if(i_sys_root==10)
	{
		c_out = c_decToSys(inp, o_sys_root);
	}
	else if(i_sys_root=="bcd"){
		c_out = BCD_toDec(inp);
	}
	else if(o_sys_root == 10)
	{
		c_out = c_sysToDec(inp, i_sys_root);
	}
	else
	{
		var util = c_sysToDec(inp, i_sys_root);
		c_out = c_decToSys(util, o_sys_root);
	}
	
	//coorect function return check
	if(c_out!=false)
		document.getElementById("out").innerHTML = c_out;
	else
		document.getElementById("out").innerHTML = "Error occured"
	

}


//decor part

function decor(input, marker){
	//TODO: decoring via JS
}