const http = require('http');
const fs = require('fs');
const apps = require("express");
const app = apps();
const { engine } = require("express-handlebars");

const port = 3000;
const portInterface = 8486;
const host = '127.0.0.1';
const authToken = 'MYTOKENHERE';

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set("views", "./views");

app.get('/', function (req, res){
    res.render("home", {play: players});
});

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });

    req.on('data', (data) => {
        players = selectPlayerData(JSON.parse(data.toString()));
    });

    req.on('end', () => {
        if (eventInfo !== '') {
            console.log(eventInfo);
        }

        res.end('');
    });
});

function selectPlayerData(data) {
    if (!validaToken(data)) {
        return '';
    }

    let dados = getDados(data, 'allplayers');
    let players = [];

    Object.keys(dados).forEach((item) => {
        let player = {
            name: dados[item].name,
            id: item
        };
        players.push(player);
    });
    return players;
    // let data = JSON.stringify(student);
    // fs.writeFileSync('student-2.json', data);
    // let rawdata = fs.readFileSync('student.json');
    // let student = JSON.parse(rawdata);
}

function validaToken(data) {
    return getDados(data, 'auth.token') === authToken;
}

function getDados(conteudo, dadosTotal) {
    let resposta = null;
    const dados = dadosTotal.split('.');

    for (const dado of dados) {
        if (!conteudo.hasOwnProperty(dado)) {
            return null;
        }

        resposta = conteudo[dado];
        conteudo = conteudo[dado];
    }

    return resposta;
}

app.listen(portInterface, function (){
    console.log("Servidor online\nAcesse http://localhst:"+portInterface+" para ver o ranking!")
});

server.listen(port, host);