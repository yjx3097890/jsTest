var i=0;
function count(){
	i++;
	postMessage(i);
	setTimeout("count()",500);
}
setTimeout("count()",500);


onmessage=function(event){
	postMessage(event.data);
}