/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */

var fileStr="";


function reset()
{
    //alert("reset");
    $('#db').val("");
    $('#rel').val("");
    var select1=document.getElementById('colsep');
    var select2=document.getElementById('rowsep');
    var select3=document.getElementById('stenc');
    var select4=document.getElementById('endenc');
    
    select1.value=',';
    select2.value='\n';
    select3.value='\"';
    select4.value='\"';
    
    document.getElementById("FirstRow").checked = true;
    document.getElementById("ForceImp").checked = false;
    
    return;
}

function checktoken()
{
            //alert("check token");
    var tok=$('#token').val();
    localStorage.setItem("token",tok);
    var str={
        token: tok,
        cmd: "GET_ALL_DB"
    };
    jQuery.ajaxSetup({async: false});
    var res=executeCommand(JSON.stringify(str),"/api/irl");
    jQuery.ajaxSetup({async: true});
    if(res.status===200)
    {
        window.location.href="form.html";
    }
    else{
        alert("Invalid Token Entered");
        $('#token').val("");
        $('#token').focus();
        return;
    }
    
}

function readCSV(file) {
      //e.preventDefault();
      //alert("readcsv");
      const input = file;
      const reader = new FileReader();

      reader.onload = function (e) {
        const text = e.target.result;
        console.log(text);
        fileStr+=text;
      };

      reader.readAsText(input);
    
}

function updateList() {
    //alert("update list");
    var input = document.getElementById('customFile');
    var output = document.getElementById('files');
    var children = "";
    for (var i = 0; i < input.files.length; ++i) {
        if(!input.files.item(i).name.endsWith(".csv"))
        {
            alert(input.files.item(i).name+" is not a CSV file");
        }
        else{
        children += '<li>' + input.files.item(i).name + '</li>';
        console.log(input.files.item(i));
        readCSV(input.files.item(i));
    }
    }
    output.innerHTML += '<ul>'+children+'</ul>';
}

function createRequest()
{
    //alert("create req");
    var tok=localStorage.getItem("token");
    var db=$('#db').val();
    if(db==="")
    {
        alert("Database Name required!");
        $('#db').focus();
        return "";
    }
    var rel=$('#rel').val();
    if(rel==="")
    {
        alert("Relation Name required!");
        $('#rel').focus();
        return "";
    }
    
    var Scol=$('#colsep').val();
    var Srow=$('#rowsep').val();
    var Senc=$('#stenc').val();
    var Eenc=$('#endenc').val();
    
    var checkBox1 = document.getElementById("FirstRow");
    var frRow;
    if (checkBox1.checked === true){
        frRow=true;
  } else {
    frRow=false;
  }
  //alert(db + rel+ Scol+ Srow+ Senc+ Eenc);
  var checkBox2 = document.getElementById("ForceImp");
    var frImp;
    if (checkBox2.checked === true){
        frImp=true;
  } else {
    frImp=false;
  }
  console.log("before file\n" + fileStr);
  var file=JSON.stringify(fileStr);
  console.log("file\n" + file);
  var req="{\n"
  +"\"token\" : \""
  + tok + "\",\n \"dbName\" : \""
  + db + "\", \n \"rel\" : \""
  + rel + "\", \"jsonStr\" : {\n \"firstRowColName\" :"
  + frRow + ",\n \"colSeparator\" : \""
  + Scol +"\",\n \"rowSeparator\" : \""
  + Srow +"\",\n \"startEncloser\" : \""
  + Senc +"\",\n \"endEncloser\" : \""
  + Eenc +"\",\n \"fileStr\" : \""
  + fileStr +"\",\n \"forceImport\" :"
  +frImp +"\n  \"modifyDataType\" : false} \n}";
  console.log("request:\n"+req);
  return req;
  
}

function submitcsv()
{
    //alert("submit");
    
  var jsonObj=createRequest();
  if(jsonObj==="")
  {
      //alert("empty");
      return;
  }
  jQuery.ajaxSetup({async: false});
    var resObj=executeCommand(jsonObj, "/jpdb/etl/csv/v01/import");
    alert(resObj.status + "\n" + resObj.message);
    jQuery.ajax({async: true});
   return;
    
}