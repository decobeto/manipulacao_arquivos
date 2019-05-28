function convert() {
    /* set up XMLHttpRequest */
    var url = "arquivos-planilhas/1.xlsx";
    var oReq = new XMLHttpRequest();
    oReq.open("GET", url, true);
    oReq.responseType = "arraybuffer";

    oReq.onload = function(e) {
        var arraybuffer = oReq.response;

        /* convert data to binary string */
        var data = new Uint8Array(arraybuffer);
        var arr = new Array();
        for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
        var bstr = arr.join("");

        /* Call XLSX */
        var workbook = XLSX.read(bstr, {type:"binary"});

        /* DO SOMETHING WITH workbook HERE */
        var first_sheet_name = workbook.SheetNames[0];
        /* Get worksheet */
        var worksheet = workbook.Sheets[first_sheet_name];
        var dados = XLSX.utils.sheet_to_json(worksheet,{raw:true});

        setLocalStorage(dados)
    }

    oReq.send();
}

function setLocalStorage(dados) {
    for(var item = 0; item <= dados.length; item++) {
        // armazenando dados convertidos
        window.localStorage.setItem(item, JSON.stringify(dados[item]))
    }
}

function clearLocalStorage() {
    window.localStorage.clear()
}

// Gravando novos registros

var campos = [
    document.querySelector('#key'),
    document.querySelector('#name'),
    document.querySelector('#description')
]

console.log(campos)

var tbody = document.querySelector('table tbody')

document.querySelector('.form').addEventListener('submit', function(event) {
    
    // cancelando a submissão do formulário
    event.preventDefault()

    var tr = document.createElement('tr')

    campos.forEach(function(campo) {
        // cria uma td sem informações
        var td = document.createElement('td')

        // atribui o valor do campo à td
        td.textContent = campo.value

        //adiciona a td na tr
        tr.appendChild(td)
    })

    // limpa o campo da data
    campos[0].value = 1
    // limpa o campo da quantidade
    campos[1].value = ''
    // limpa o campo do valor
    campos[2].value = ''
})

// console.log(JSON.parse(window.localStorage.getItem(item)))
//         var registro = JSON.parse(window.localStorage.getItem(item))
//         console.log(registro.Nome)