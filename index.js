const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const connection = require('./database/database') //importando o connection
const Pergunta = require('./database/Pergunta');
const Resposta = require('./database/Resposta')

//conectando ao banco
connection
    .authenticate()
    .then(()=>{
        console.log('Conexão realizada')
    })
    .catch((msgErro)=>{
        console.log('Erro na conexão')
    })

app.set('view engine', 'ejs');
app.use(express.static('public'))

//body-parser
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.get('/',(req,res)=>{
    Pergunta.findAll({raw: true, order:[
        ['id', 'DESC']
    ]}).then(perguntas =>{
        res.render(`index`, {
            perguntas: perguntas
        })
    })
    
})

app.get('/perguntar', (req, res)=>{
    res.render('perguntar')
})

app.get('/pergunta/:id', (req, res)=>{
    const id = req.params.id
    Pergunta.findOne({
        where: {id : id}
    }).then(pergunta=>{
        if(pergunta != undefined){
            Resposta.findAll({
                where: {perguntaId: pergunta.id}
            }).then(respotas=>{
                res.render('pergunta', {
                    pergunta: pergunta,
                    respostas: respotas
                })
            })
            
        }else{
            res.redirect('/')
        }
    })
})

app.post('/salvarPergunta', (req, res)=>{
    const titulo = req.body.titulo
    const description = req.body.descricao
    Pergunta.create({
        titulo: titulo,
        descricao: description
    }).then(()=>{
        res.redirect('/')
    })
})

app.post('/responder', (req, res)=>{
    const corpo = req.body.resposta
    const perguntaId = req.body.pergunta
    Resposta.create({
        corpo: corpo,
        perguntaId: perguntaId
    }).then(()=>{
        res.redirect('/pergunta/' + perguntaId)
    })
})


app.listen(4000, ()=>{
    console.log('Server is running on port 4000');
})