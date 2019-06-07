function convert() {
  clearLocalStorage()

  /* set up XMLHttpRequest */
  var url = ""
  if (document.getElementById('arquivo').value === " ") {
    url = "arquivos-planilhas/1.xlsx"
  } else {
    url = "arquivos-planilhas/" + document.getElementById('arquivo').value
  }

  // verifica se extensão é igual a .xlsx
  if((url.substr(url.length - 4, 4)) !== "xlsx") {
    M.toast({
      html: 'É necessário selecionar uma planilha com extensão .xlsx'
    })
    return 
  }

  M.toast({
    html: 'Planilha convertida com sucesso!'
  })

  var oReq = new XMLHttpRequest()
  oReq.open("GET", url, true)
  oReq.responseType = "arraybuffer"

  // cria array de objetos com registros
  oReq.onload = function (e) {
    var arraybuffer = oReq.response

    /* convert data to binary string */
    var data = new Uint8Array(arraybuffer)
    var arr = new Array()
    for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
    var bstr = arr.join("")

    /* Call XLSX */
    var workbook = XLSX.read(bstr, {
      type: "binary"
    })

    /* DO SOMETHING WITH workbook HERE */
    var first_sheet_name = workbook.SheetNames[0]
    /* Get worksheet */
    var worksheet = workbook.Sheets[first_sheet_name]
    var dados = XLSX.utils.sheet_to_json(worksheet, {
      raw: true
    })

    // manipulação do array de objetos criado
    setLocalStorage(dados)
  }

  oReq.send()
}

// percorre array de objetos de registros
function setLocalStorage(dados) {
  for (var item = 0; item < dados.length; item++) {
    // armazenando dados convertidos
    window.localStorage.setItem(item, JSON.stringify(dados[item]))
  }
}

function clearLocalStorage() {
  window.localStorage.length > 0 ? M.toast({ html: 'localStorage limpo com sucesso!' }) : M.toast({ html: 'localStorage está vazio!' })
  
  window.localStorage.clear()
}

// ---------------------- FORMULÁRIO ----------------------

function savingLocalStorage() {
  event.preventDefault()
  let ultimaKey = localStorage.length
  let keyDoItemSalvo = ultimaKey
  let campos = {
    "Nome": document.querySelector('#nome').value,
    "Informação": document.querySelector('#informacao').value
  }
  
  window.localStorage.setItem(keyDoItemSalvo, JSON.stringify(campos))
  document.querySelector('#nome').value = " "
  document.querySelector('#informacao').value = " "
  M.toast({ html: 'Registro adicionado com sucesso!' })
}

// ---------------------- PESQUISA ----------------------

// captura input do campo search
var input = document.getElementById('field')
var countRegistro = 0

input.addEventListener("keyup", function (event) {
  if (event.keyCode === 20) {
    event.preventDefault()
    countRegistro = 0

    value = document.getElementById('field').value
    searchKey(value)
    //document.getElementById("btn").click()
  }
})
// window.localStorage.forEach(function(item){

// })

function searchKey(value) {
  let registro = JSON.parse(window.localStorage.getItem(value))

  cleanTable()
 
  insertTable(value, registro)
  searchWord(value)
}

// pesquisa por nome
function searchWord(word) {
  search: for (var item = 0; item < window.localStorage.length; item++) {
    // converte registro em objeto
    let reg = JSON.parse(window.localStorage.getItem(item))

    if (reg === null) {
      item++
      continue search
    }

    // busca nome ignorando maisculas e minusculas
    
    if (reg.Nome.search(word) > -1) {
      insertTable(item, reg)
      countRegistro++
    } else if (reg.Informação.search(word) > -1) {
      insertTable(item, reg)
      countRegistro++
    }
  }

  if (countRegistro === 0) {
    insertTableNull('Não existe registro correspondente ao valor informado')
  }
}

// retornar valores da busca para a tabela
function insertTable(value, registro) {
  let table = document.getElementById('searchTable')
  let row = table.insertRow(1)

  if (registro != null) {
    // imprime todo o registro na tabela
    row.innerHTML = "<td>" + value + "</td> <td>" + registro.Nome + "</td> <td>" + registro.Informação + "</td>" + 
      "<a onclick=\"editItem(" + value + ")\" title=\"Editar\" class=\"waves-effect waves-light btn-small scrollLink\" href=\"#editar\" style=\"margin-top: 0.6rem;margin-right: 1rem;\"><i class=\"material-icons\">edit</i></a>" +
      "<a onclick=\"removeItem(" + value + ")\" title=\"Remover\" class=\"waves-effect waves-light btn-small red lighten-1\" style=\"margin-top: 0.6rem;margin-right: 1rem;\"><i class=\"material-icons\">delete</i></a>"
    countRegistro++
  }
  init()
}

function insertTableNull(value) {
  let table = document.getElementById('searchTable')
  let row = table.insertRow(1)

  row.innerHTML = "<td>" + value + "</td>"
}

var count = 0

// remove todos os nós filhos de um elemento
function cleanTable(table) {
  var tabela = document.getElementById('searchTable')
  if (count > 0) {
    while (tabela.rows.length > 1) {
      tabela.deleteRow(1)
    }
    // M.toast({
    //   html: 'localStorage limpo com sucesso!'
    // }) 
  }
  count++
  init()
}

// pesquisa por nome
// window.localStorage.forEach(function(item){

// })

function searchWord(word) {
  search: for (var item = 0; item < window.localStorage.length; item++) {
    // converte registro em objeto
    let reg = JSON.parse(window.localStorage.getItem(item))

    if (reg === null) {
      item++
      continue search
    }

    // busca nome ignorando maisculas e minusculas
    if (reg.Nome.search(word) > -1) {
      insertTable(item, reg)
      countRegistro++
    } else if (reg.Informação.search(word) > -1) {
      insertTable(item, reg)
      countRegistro++
    }
  }

  if (countRegistro === 0) {
    insertTableNull('Não existe registro correspondente ao valor informado')
  }
}

// EDITAR ITEM
function editItem(value) {
  cleanTable('searchTable')
  removeChildren('record')
  removeChildren('name')
  removeChildren('information')

  let reg = JSON.parse(window.localStorage.getItem(value))
  
  document.getElementById('editar').style.display = "block"
  
  let record = document.getElementById('record')
  input = document.createElement('input')
  input.setAttribute('type', 'text')
  input.setAttribute('id', 'recordEdit')
  input.setAttribute('value', value)
  input.setAttribute('disabled', 'disabled')
  input.setAttribute('class', 'materialize-textarea')
  record.appendChild(input)
  input.innerHTML += "<label for=\"recordEdit\">Registro</label>"

  let name = document.getElementById('name')
  input = document.createElement('input')
  input.setAttribute('type','text')
  input.setAttribute('id','nomeEdit')
  input.setAttribute('value', reg.Nome)
  input.setAttribute('class','materialize-textarea')
  name.appendChild(input)
  input.innerHTML += "<label for=\"nomeEdit\">Nome</label>"

  let information = document.getElementById('information')
  input = document.createElement('input')
  input.setAttribute('type', 'text')
  input.setAttribute('id', 'informacaoEdit')
  input.setAttribute('value', reg.Informação)
  input.setAttribute('class', 'materialize-textarea')
  information.appendChild(input)
  input.innerHTML += "<label for=\"informacaoEdit\">Informação</label>"
}

// remover todos os nós filhos de um elemento
function removeChildren(node) {
  let element = document.getElementById(node)
  while (element.firstChild) {
    element.removeChild(element.firstChild)
  }
}


function editar(value) {
  document.getElementById('editar').style.display = "none"
  event.preventDefault()
  let campos = {
    "Nome": document.querySelector('#nomeEdit').value,
    "Informação": document.querySelector('#informacaoEdit').value
  }
  window.localStorage.setItem(value, JSON.stringify(campos))

  M.toast({
    html: 'Registro ' + value + ' editado!'
  })
}

function cancelar(value) {
  document.getElementById('editar').style.display = "none"
  document.querySelector('#nomeEdit').value = " "
  document.querySelector('#informacaoEdit').value = " "

  M.toast({
    html: 'Registro ' + value + ' não editado!'
  })
}

// removendo item

function removeItem(value) {
  window.localStorage.removeItem(value)

  cleanTable('searchTable')
  M.toast({
    html: 'Registro ' + value + ' removido!'
  })
}

function init() {
  M.AutoInit()
}

function ordenar() {
  cleanTable('tabelaOrdenada')

  if (localStorage.length > 0) {
    document.getElementById('botaoDownload').style.display = "inline"
    let localStorageArray = new Array()
    for (i = 0; i < localStorage.length; i++) {
      localStorageArray[i] = localStorage.getItem(localStorage.key(i))
    }

    let ArrayOrdenado = localStorageArray.sort()
    let ArrayOrdenadoObj = new Array()
    for (i = 0; i < ArrayOrdenado.length; i++) {
      ArrayOrdenadoObj[i] = JSON.parse(ArrayOrdenado[i])
    }

    montaTabelaOrdenada(ArrayOrdenadoObj)
  } else {
    M.toast({
      html: 'É necessário clicar em Converter \'Planilha\' primeiro'
    })
  }
}

function montaTabelaOrdenada(arrayOrdenado) {
  let tbody = document.querySelector('#tabelaOrdenadaTbody')
  let count = 0
  arrayOrdenado.forEach(function (campo) {
    let tr = document.createElement('tr')
    let tdRegistro = document.createElement('td')
    let tdNome = document.createElement('td')    
    let tdInformacao = document.createElement('td')

    tdRegistro.textContent = count
    tdNome.textContent = campo.Nome
    tdInformacao.textContent = campo.Informação
    
    tr.appendChild(tdRegistro)
    tr.appendChild(tdNome)
    tr.appendChild(tdInformacao)
    
    tbody.appendChild(tr)
    count++
  })
}

function download_csv(csv, filename) {
  var csvFile
  var downloadLink

  // CSV FILE
  csvFile = new Blob([csv], {type: "text/csv"})

  // Download link
  downloadLink = document.createElement("a")

  // File name
  downloadLink.download = filename

  // We have to create a link to the file
  downloadLink.href = window.URL.createObjectURL(csvFile)

  // Make sure that the link is not displayed
  downloadLink.style.display = "none"

  // Add the link to your DOM
  document.body.appendChild(downloadLink)

  // Lanzamos
  downloadLink.click()
}

function export_table_to_csv(html, filename) {
var csv = []
var rows = document.querySelectorAll("#tabelaOrdenada tr");

  for (var i = 0; i < rows.length; i++) {
  var row = [], cols = rows[i].querySelectorAll("td, th");
  
      for (var j = 0; j < cols.length; j++) 
          row.push(cols[j].innerText)
      
  csv.push(row.join(","));	
}

  // Download CSV
  download_csv(csv.join("\n"), filename)
}

document.querySelector("#botaoDownload").addEventListener("click", function () {
  var html = document.querySelector("#tabelaOrdenada").outerHTML
  export_table_to_csv(html, "tabelaOrdenada.csv")
  document.getElementById('botaoDownload').style.display = "none"
});

function apagar() {
  document.getElementById('field').value = " "
}