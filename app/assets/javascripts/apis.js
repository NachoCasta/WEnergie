$(document).ready(function() {
    $(".repuestos").select2({
        theme: "bootstrap"
    });
});

function addItem(){
    var id = document.getElementById("repuesto").value;
    $.get("/repuestos/"+id.toString()+".json", function(data) {
        console.log(data);
        var tbody = document.getElementById("dynamic-list");
        var tr = document.createElement("tr");
        tr.setAttribute('id', id);
        var td1 = document.createElement("td");
        td1.appendChild(document.createTextNode(data.articulo));
        tr.appendChild(td1);
        var td2 = document.createElement("td");
        td2.appendChild(document.createTextNode(data.descripcion));
        tr.appendChild(td2);
        var td3 = document.createElement("td");
        var cantidad = document.getElementById("cantidad").value;
        td3.appendChild(document.createTextNode(cantidad));
        tr.appendChild(td3);
        var td4 = document.createElement("td");
        td4.appendChild(document.createTextNode("€ "+data.precio));
        tr.appendChild(td4);
        var td4 = document.createElement("td");
        var eliminar = document.createElement("a");
        eliminar.setAttribute("href", "javascript:removeItem("+id+")");
        var cruz = document.createElement("span");
        cruz.setAttribute("class", "glyphicon glyphicon-remove");
        cruz.appendChild(document.createTextNode("Eliminar"));
        eliminar.appendChild(cruz);
        td4.appendChild(eliminar);
        tr.appendChild(td4);
        tbody.appendChild(tr);
        var hidden = document.getElementById("repuestos");
        var repuestos = JSON.parse(hidden.value);
        var i;
        for (i = 0; i < cantidad; i++) { 
            repuestos.push(id);
        }
        hidden.setAttribute("value", "["+repuestos.toString()+"]");
    });
}

function removeItem(id){
    var tbody = document.getElementById("dynamic-list");
    var item = document.getElementById(id);
    tbody.removeChild(item);
    var hidden = document.getElementById("repuestos");
    var repuestos = JSON.parse(hidden.value);
    var i;
    for (i = 0; i < item.cells[2].innerHTML; i++) { 
        repuestos.splice(repuestos.indexOf(id), 1);
    }
    hidden.setAttribute("value", "["+repuestos.toString()+"]");
}