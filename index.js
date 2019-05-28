function convert() {
  /* set up XMLHttpRequest */
  var url = "arquivos-planilhas/1.xlsx";
  var oReq = new XMLHttpRequest();
  oReq.open("GET", url, true);
  oReq.responseType = "arraybuffer";

  oReq.onload = function (e) {
    var arraybuffer = oReq.response;

    /* convert data to binary string */
    var data = new Uint8Array(arraybuffer);
    var arr = new Array();
    for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
    var bstr = arr.join("");

    /* Call XLSX */
    var workbook = XLSX.read(bstr, {
      type: "binary"
    });

    /* DO SOMETHING WITH workbook HERE */
    var first_sheet_name = workbook.SheetNames[0];
    /* Get worksheet */
    var worksheet = workbook.Sheets[first_sheet_name];
    var dados = XLSX.utils.sheet_to_json(worksheet, {
      raw: true
    });

    setLocalStorage(dados)
  }

  oReq.send();
}

function setLocalStorage(dados) {
  for (var item = 0; item <= dados.length; item++) {
    // armazenando dados convertidos
    window.localStorage.setItem(item, JSON.stringify(dados[item]))
  }
}

function clearLocalStorage() {
  window.localStorage.clear()
}

function salvandoNoArmazenamento(){
  event.preventDefault();
  let ultimaKey = localStorage.length;
  let keyDoItemSalvo = ultimaKey + 1;
  let campos = { "Nome": document.querySelector('#nome').value, "Informação": document.querySelector('#informacao').value};
  window.localStorage.setItem(keyDoItemSalvo, JSON.stringify(campos));
  console.log(campos)
}

// SEARCH
// captura input do campo search

var input = document.getElementById('field')

input.addEventListener("keyup", function(event) {
	if(event.keyCode === 20) {
		event.preventDefault()

    value = document.getElementById('field').value
    search(value)
		//document.getElementById("btn").click()
	}
})

function inputField() {return document.getElementById('field').value}

function search(value){
  let registro = JSON.parse(window.localStorage.getItem(value))

  cleanTable()
  insertTable(value, registro)
}

// retornar valores da busca para a tabela
function insertTable(value, registro) {
  let table = document.getElementById('searchTable')
  let row = table.insertRow(1)
  if(registro != null) {
    row.innerHTML = "<td>" + value + "</td> <td>" + registro.Nome + "</td> <td>" + registro.Informações + "</td>"
  } else {
    row.innerHTML = "<td>" + "Registro não encontrador" + "<td>"
  }
}

var count = 0

// remove todos os nós filhos de um elemento
function cleanTable() {
  console.log("limpar")
  // var tabela = document.getElementById('tabelaPesquisa');
  // tabela.innerHTML = ''

  // var elemento = document.getElementById("tabelaPesquisa");
  // while (elemento.firstChild) {
  //   elemento.removeChild(elemento.lastChild);
  //   console.log('limpou' + elemento.removeChild(elemento.lastChild))
  // }

  var elemento = document.getElementById("searchTable");
    
    if( count > 0 ) {
      elemento.deleteRow(1)
      console.log("limpou")
    }
    count++
}
// console.log(JSON.parse(window.localStorage.getItem(item)))
//         var registro = JSON.parse(window.localStorage.getItem(item))
//         console.log(registro.Nome)