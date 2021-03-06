const { Router } = require('express')
const { resolve, extname } = require('path')
const { Worker } = require('worker_threads')
const multer = require('multer')
const res = require('express/lib/response')
const { readdirSync, unlinkSync } = require('fs')
const route = Router()

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        // Extração da extensão do arquivo original:
        const extensaoArquivo = extname(file.originalname);

        // Cria um código randômico que será o nome do arquivo
        const novoNomeArquivo = require('crypto')
            .randomBytes(64)
            .toString('hex');

        // Indica o novo nome do arquivo:
        cb(null, `${novoNomeArquivo}.${extensaoArquivo}`)
    }
});


const upload = multer({ dest: 'uploads/', storage });

const statusWorker = {
    status: 'Parado'
}

route.get('/', (req, res) => {
    return res.sendFile('./public/index.html', { root: resolve('./src') })
})

route.get('/form', (req, res) => {
    return res.sendFile('./public/form.html', { root: resolve('./src') })
})

route.post('/run', (req, res) => {
    if (statusWorker.status === 'Rodando') {
        return res.send({
            status: 500,
            message: 'Erro ao iniciar o robo: Ja existe uma instancia rodando'
        }).end()
    }
    const file = readdirSync(resolve('./uploads')).pop()
    file ? unlinkSync(resolve('./uploads', file)) : ''
    const w = new Worker(process.env.PATH_ROBOT, { workerData: req.body })
    statusWorker.status = 'Rodando'
    w.on('exit', (code) => {
        statusWorker.status = 'Parado'
    })
    return res.send({ status: 200 }).end()
})

route.get('/status', (req, res) => {
    return res.send({ statusRobot: statusWorker.status }).end()
})


route.post('/uploadZip', upload.single('zip'), (req, res) => {
    return res.sendStatus(200).end()
})

route.get('/downloadZip', function (req, res) {
    const file = readdirSync(resolve('./uploads')).pop()
    if (file) {
        return res.download(resolve('./uploads', file));
    }
    return res.end();

});

module.exports = route