// middlewares/middlewares.js
const mostrarConsulta = require('./mostrarconsulta')

const loggerMiddleware = (req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`)
    next();
}
module.exports = { loggerMiddleware, mostrarConsulta };