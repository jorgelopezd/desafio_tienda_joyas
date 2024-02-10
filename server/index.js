const express = require('express')
const cors = require('cors')
const { loggerMiddleware, mostrarConsulta } = require('../middlewares/middlewares')
const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())
app.use(loggerMiddleware)
app.use(mostrarConsulta)

app.get("/joyas", async (req, res) => {
  try {
    const queryStrings = req.query;
    const { clausulas, rows } = await prepararGetHATEOS("id", queryStrings);
    const joyasHATEOAS = unificar(rows);
    res.json(joyasHATEOAS);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
})


app.get("/joyas/filtros", async (req, res) => {
  try {
    const queryStrings = req.query;
    const [filtros, value] = obtenerJoyasFiltros(queryStrings)
    const query = {
      text: `SELECT * FROM inventario ${filtros}`,
      values: value,
    }
    const { rows } = await pool.query(query)
    res.json(rows)
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error")
  }
});

app.listen(PORT, () => {
  console.log("server encendido", PORT)
});
