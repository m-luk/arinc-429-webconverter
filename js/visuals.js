//script handling all visualisation of converted data
//remoteVoyager <mlukaszewicz2@gmail.com>

//TODO: exepction handling for wrong types

function clearClassElements(className){

    elements = document.getElementsByClassName(className);

    for(var i=0; i<elements.length; i++){
        elements[i].innerHTML = "";
    }
}

function fillClassElements(className, data, labels=false, boldLabel = false){
    //fill all class elements with data, optionaly bold boldLabel
    elements = document.getElementsByClassName(className);

    for(var i = 0; i < elements.length; i++){
        if(labels){
            if(boldLabel){
                elements[i].innerHTML = "<b>" + labels[i] + ":</b> " + data[i]; 
            }
            else{
                elements[i].innerHTML = labels[i] + ": " + data[i]; 
            }
        }
        else{
            elements[i].innerHTML = data[i]
        }
    }
}

function displayMsgInClassElements(className, msg, index){
    //displays message on class element array[index], if index 'all' is given, on all
    document.getElementsByClassName(className)[index].innerHTML = msg;
}