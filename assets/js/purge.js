function serverdetailload()
{
var oReq = new XMLHttpRequest(); 
oReq.onload = reqListener;
oReq.open("get", "vservers.json", true);
oReq.overrideMimeType("application/json");
oReq.send();

}
var length;
var vserver;
function reqListener () {

  vserver = JSON.parse(this.responseText);

 length=vserver.servers.length;   //count the number of varnish servers

for ( i=0; i<length; i++ )
{

        
        var input = document.createElement("input");
        input.type ="checkbox";
        input.id ="s" + i;
        input.name=vserver.servers[i].servername;
        input.value="false";
        input.onchange=function(){
                                 if(this.value == "false")
                                       this.value="true";
                                 else
                                       this.value="false";
                                };
        var para=document.createElement("p");

        var node=document.createTextNode("Server Details :"+"Running at  "+vserver.servers[i].ipadress+":"+vserver.servers[i].port );
        para.appendChild(node);
        document.getElementById("f1").appendChild(para);
        document.getElementById("f1").appendChild(input);
        document.getElementById("f1").appendChild(document.createElement("br"));

     
}

};
document.getElementById("f1").addEventListener("submit", function(event){
    event.preventDefault();
    if(document.getElementById("purgefilename").value != "") 
     ajaxcall();
    else
  document.getElementById("p1").innerHTML="<strong>filename cannot be empty</strong>";
});

var result;
function ajaxcall()
{
var name=document.getElementById("purgefilename").value;
var xhttp;
var URL="http://172.26.4.120:8080/purgereq.php?"+"purgefilename"+"="+name+"&";
xhttp=new XMLHttpRequest();
var string;
var i;
          for(i=0;i<length-1;i++)
           {
             URL=URL+vserver.servers[i].servername;
             var id ="s"+i
             URL=URL+"="+document.getElementById(id).value;
             URL=URL+"&";
           }
URL=URL+vserver.servers[i].servername;
var id="s"+i;
URL=URL+"="+document.getElementById(id).value;

xhttp.onreadystatechange = function() {//Call a function when the state changes.
  if( this.status== 200 )
   {
    var result=this.responseText;
    document.getElementById("p1").innerHTML=result;
    }    
}
xhttp.open("GET",URL,true);
xhttp.send();
};

