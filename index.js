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
  for (var item = 0; item < dados.length; item++) {
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
  document.querySelector('#nome').value = " ";
  document.querySelector('#informacao').value = " ";
}

// SEARCH
// captura input do campo search
var input = document.getElementById('field')
var countRegistro = 0

input.addEventListener("keyup", function(event) {
	if(event.keyCode === 20) {
    event.preventDefault()
    countRegistro = 0

    value = document.getElementById('field').value
    searchKey(value)
		//document.getElementById("btn").click()
	}
})

function inputField() {return document.getElementById('field').value}

function searchKey(value){
  let registro = JSON.parse(window.localStorage.getItem(value))

  cleanTable()

  // typeof(value) === 'number' ? insertTable(value,registro) : searchWord(value) 
  insertTable(value,registro)
  searchWord(value) 
}

// retornar valores da busca para a tabela
function insertTable(value, registro) {
  let table = document.getElementById('searchTable')
  let row = table.insertRow(1)
  
  if(registro != null) {
    // imprime todo o registro na tabela
    row.innerHTML = "<td>" + value + "</td> <td>" + registro.Nome + "</td> <td>" + registro.Informação + "</td>"
    + "<a onclick=\"editItem(" + value + ")\" class=\"waves-effect waves-light btn-small tooltipped scrollLink\" href=\"#editar\" data-position=\"right\" data-tooltip=\"Editar registro\" style=\"margin-top: 0.6rem;margin-right: 1rem;\"><i class=\"material-icons\">edit</i></a>"
    + "<a onclick=\"removeItem(" + value + ")\" class=\"waves-effect waves-light btn-small tooltipped red lighten-1\" data-position=\"right\" data-tooltip=\"Remover registro\" style=\"margin-top: 0.6rem;margin-right: 1rem;\"><i class=\"material-icons\">delete</i></a>"
    countRegistro++
  }
  init()
}

function insertTableNull (value) {
  let table = document.getElementById('searchTable')
  let row = table.insertRow(1)

  row.innerHTML = "<td>" + value + "</td>"
}

var count = 0

// remove todos os nós filhos de um elemento
function cleanTable() {
  console.log("limpar")

  var tabela = document.getElementById("searchTable");
    if( count > 0 ) {
      while (tabela.rows.length > 1) {
        tabela.deleteRow(1)
      }
      console.log("limpou")
    }
    count++
    init()
}

// pesquisa por nome
function searchWord(word) {
  search: for (var item = 0; item < localStorage.length; item++) {
    // converte registro em objeto
    let reg = JSON.parse(window.localStorage.getItem(item))
    
    if(reg === null) {
      item++
      continue search
    }

    // busca nome ignorando maisculas e minusculas
    var resultName = reg.Nome.search(word) > -1
    var resultInform = reg.Informação.search(word) > -1
    if(resultName === true) {
      insertTable(item, reg)
      countRegistro++
    } else if(resultInform === true) {
      insertTable(item, reg)
      countRegistro++
    }
  }

  if(countRegistro === 0) {
    insertTableNull('Não existe registro correspondente ao valor informado')
  }
} 

// EDITAR ITEM

function editItem(value) {
  cleanTable()

  document.getElementById('editar').style.display = "block"
  document.getElementById('value').innerHTML = "<input type=\"text\" disabled id=\"valueEdit\" value=" + value + " class=\"materialize-textarea\" /><label for=\"value\"></label>"
}

function editar(value){
  document.getElementById('editar').style.display = "none"
  event.preventDefault();
  let campos = { "Nome": document.querySelector('#nomeEdit').value, "Informação": document.querySelector('#informacaoEdit').value};
  window.localStorage.setItem(value, JSON.stringify(campos));

  document.querySelector('#nomeEdit').value = " ";
  document.querySelector('#informacaoEdit').value = " ";
  
  M.toast({html: 'Registro ' + value + ' editado!'})
}

function cancelar(value) {
  document.getElementById('editar').style.display = "none"
  document.querySelector('#nomeEdit').value = " ";
  document.querySelector('#informacaoEdit').value = " ";

  M.toast({html: 'Registro ' + value + ' não editado!'})
}

// removendo item

function removeItem(value) {
  window.localStorage.removeItem(value)

  cleanTable()
  M.toast({html: 'Registro ' + value + ' removido!'})
}

function init() { M.AutoInit() }

// console.log(JSON.parse(window.localStorage.getItem(item)))
//         var registro = JSON.parse(window.localStorage.getItem(item))
//         console.log(registro.Nome)