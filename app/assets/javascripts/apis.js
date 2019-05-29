$(document).ready(function() {
    $(".repuestos").select2({
        theme:
            "bootstrap" /*,
        language: {
            noResults: function() {
                return "<input type='button' value='Agregar nuevo...' onclick='addCustom()'>";
            }
        },
        escapeMarkup: function (markup) {
            return markup;
        }*/
    });
});

function getPromise(path) {
    return new Promise(resolve => {
        $.get(path, response => resolve(response));
    });
}

function sleep(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

function addItem(tipo) {
    var id = document.getElementById(tipo.slice(0, -1)).value;
    $.get("/" + tipo + "/" + id.toString() + ".json", function(data) {
        if (data.nombre.startsWith("Pack")) {
            var articulos = data.descripcion.replace(/ /g, "").split(",");
            var promise = Promise.resolve();
            articulos.forEach(articulo => {
                var [articuloId, cantidad] = articulo
                    .replace(/ /g, "")
                    .split("*");
                const path = `/${tipo}/articulo/${articuloId}.json`;
                promise = promise
                    .then(() => getPromise(path))
                    .then(data => addItemFromData(data, tipo, cantidad));
            });
        } else {
            var cantidad = document.getElementById("cantidad").value;
            addItemFromData(data, tipo, cantidad);
        }
    });
}

function addItemFromData(data, tipo, cantidad = 1) {
    var { id } = data;
    var tbody = document.getElementById("dynamic-list");
    var tr = document.createElement("tr");
    tr.setAttribute("id", id);
    var td1 = document.createElement("td");
    td1.appendChild(document.createTextNode(data.articulo));
    tr.appendChild(td1);
    var td2 = document.createElement("td");
    if (tipo == "repuestos") {
        td2.appendChild(document.createTextNode(data.descripcion));
    } else {
        td2.appendChild(document.createTextNode(data.nombre));
    }
    tr.appendChild(td2);
    var td3 = document.createElement("td");
    td3.appendChild(document.createTextNode(cantidad));
    tr.appendChild(td3);
    var td4 = document.createElement("td");
    var iprecio = document.createElement("input");
    iprecio.setAttribute("class", "form-control");
    iprecio.setAttribute("name", "precio" + id.toString());
    iprecio.setAttribute("type", "number");
    iprecio.setAttribute("step", "0.01");
    iprecio.setAttribute("min", "0");
    iprecio.setAttribute("value", data.precio);
    td4.appendChild(iprecio);
    tr.appendChild(td4);
    var td4 = document.createElement("td");
    var eliminar = document.createElement("a");
    eliminar.setAttribute("href", "javascript:removeItem(" + id + ")");
    var cruz = document.createElement("span");
    cruz.setAttribute("class", "glyphicon glyphicon-remove");
    cruz.appendChild(document.createTextNode("Eliminar"));
    eliminar.appendChild(cruz);
    td4.appendChild(eliminar);
    tr.appendChild(td4);
    tbody.appendChild(tr);
    var hidden = document.getElementById("lista");
    var repuestos = JSON.parse(hidden.value);
    var i;
    for (i = 0; i < cantidad; i++) {
        repuestos.push(id);
    }
    hidden.setAttribute("value", "[" + repuestos.toString() + "]");
    return true;
}

function removeItem(id) {
    var tbody = document.getElementById("dynamic-list");
    var item = document.getElementById(id);
    tbody.removeChild(item);
    var hidden = document.getElementById("lista");
    var lista = JSON.parse(hidden.value);
    var i;
    for (i = 0; i < item.cells[2].innerHTML; i++) {
        lista.splice(lista.indexOf(id), 1);
    }
    hidden.setAttribute("value", "[" + lista.toString() + "]");
}
