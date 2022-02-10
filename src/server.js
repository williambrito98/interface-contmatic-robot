const express = require('express')
const routes = require('./routes.js')
const { join, resolve } = require('path')
const { config } = require('dotenv')
const { existsSync, mkdir, mkdirSync } = require('fs')

config({
    path: join(resolve('./'), '.env')
})

if (!existsSync(resolve('./uploads'))) {
    mkdirSync(resolve('./uploads'))
}

const app = express()


app.use(express.json())
app.use(express.urlencoded({
    extended: true

}))

app.use(express.static(join(resolve('./src'), 'public', 'assets')))

app.use(routes)

app.listen(process.env.SERVER_PORT, () => {
    console.log('SERVER RUNNING IN PORT 3333')
})