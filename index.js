

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
    console.log(dados);
    window.localStorage.setItem
    console.log(dados[1].Informação)

    insertLocalStorage(dados)
    }

    oReq.send();
}

function insertLocalStorage(dados) {
    for(var item = 0; item <= dados.length; item++) {
        window.localStorage.setItem(dados[item].Nome, dados[item].Informação)
    }
}