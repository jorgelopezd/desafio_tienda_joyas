require("dotenv").config()
const { Pool } = require("pg")
const QueryString = require("qs")

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
});

const prepararGetHATEOS = async (nombre, queryStrings) => {
  const result = `SELECT * FROM inventario WHERE ${nombre} = $1`;
  let clausulas = ""
  const { limits, order_by, page } = queryStrings
  if (limits) clausulas += `LIMIT ${limits}`;
  if (order_by) {
    const [order, detalle] = order_by.split("_")
    clausulas += ` ORDER BY ${detalle} ${order}`;
  }
  if (page && limits) {
    const offset = (page - 1) * limits
    clausulas += ` OFFSET ${offset}`
  }
  const value = [nombre];
  const { rows } = await pool.query(result, value);
  return { clausulas, rows };
};

const obtenerGetHATEOS = async (id) => {
  const result = `SELECT * FROM inventario WHERE id =$1`;
  const value = [id]
  const {
    rows: [joyas],
  } = await pool.query(result, value)
  return joyas
};

const obtenerJoyasFiltros = (queryStrings) => {
  let filtros = []
  const value = []
  const agregarFiltros = (detalle, valor, comparador) => {
    value.push(valor)
    const { length } = filtros
    filtros.push(`${detalle} ${comparador} $${length + 1}`)
  }
  const { precio_max, precio_min, categoria, metal } = queryStrings;
  if (precio_max) agregarFiltros("precio", precio_max, "<=")
  if (precio_min) agregarFiltros("precio", precio_min, ">=")
  if (categoria) agregarFiltros("categoria", categoria, "=")
  if (metal) agregarFiltros("metal", metal, "=")
  filtros = filtros.join(" AND ");
  filtros = `WHERE ${filtros}`;
  return [filtros, value]
};

const unificar = (joyas) => {
  const results = joyas.map((j) => {
    return {
      name: j.name,
      href: `/joyas/joya/${j.id}`,
    };
  });

  const totalJoyas = joyas.length;
  const stockTotal = joyas.reduce((a, b) => a + b.stock, 0);
  const HATEOAS = {
    totalJoyas,
    stockTotal,
    results,
  }
  return HATEOAS
}

module.exports = { prepararGetHATEOS, obtenerGetHATEOS, obtenerJoyasFiltros };