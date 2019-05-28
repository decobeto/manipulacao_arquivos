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

// SEARCH

// captura input do campo search

function inputField() {return document.getElementById('field').value}

function search(value){
  console.log(value)
  let registro = JSON.parse(window.localStorage.getItem(value))
  insertTable(value, registro)
}

var input = document.getElementById('field')

input.addEventListener("keyup", function(event) {
	if(event.keyCode === 20) {
		event.preventDefault()

    value = document.getElementById('field').value
    search(value)
		//document.getElementById("btn").click()
	}
})

// retornar valores da busca para a tabela
function insertTable(value, registro) {
  let table = document.getElementById('searchTable')
  let row = table.insertRow(1)
  row.innerHTML = "<td>" + value + "</td> <td>" + registro.Nome + "</td> <td>" + registro.Informação + "</td>"
}

// console.log(JSON.parse(window.localStorage.getItem(item)))
//         var registro = JSON.parse(window.localStorage.getItem(item))
//         console.log(registro.Nome)