const express = require("express");
const path = require("path");
var bodyParser = require("body-parser");
const { count } = require("console");
const sqlite3 = require("sqlite3").verbose();
const dbFile = __dirname + "/data.db";

let db = new sqlite3.Database(dbFile, sqlite3.OPEN_READWRITE, (err) => {
  if (err) throw err;
});

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use("/", express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  //konfigurasi pagination

  const { name, weight, height, date, status, start, end } = req.query;

  const url = req.url == '/' ? '/?page=1' : req.url;
  const page = parseInt(req.query.page || 1)
  const limit = 3
  const offset = (page-1) * limit

  let params = [];
  if (name) {
    params.push(`nama like '%${name}%'`);
  }

  if (weight) {
    params.push(`berat like '%${weight}%'`);
  }

  if (height) {
    params.push(`tinggi like '%${height}%'`);
  }
  
  if (start && end) {
    params.push(`tanggal between '${start}' and  '${end}'`);
  }
  
  if (status) {
    params.push(`hubungan='${status}'`);
  }
  
  let sql = `SELECT count(*) as total FROM bread`;
  if (params.length > 0) {
    sql += ` where ${params.join(" and ")}`;
  }
  
  console.log(sql)
  db.all(sql, (err, rows) => {
    if (err) {
      return res.send(err)
    }
    const total = rows[0].total
    const pages = Math.ceil(total/limit)
    
    sql = `select * from bread `;
    if (params.length > 0) {
      sql += ` where ${params.join(" and ")}`;
    }
    
    sql += `limit ${limit} offset ${offset}`; 
    
    db.all(sql,(err, rows) => {
      if (err) {
        return res.send(err)
      }
      res.render("index", { nama: rows, page, pages, url, query: req.query });
    })
    
  })
  
})

app.get("/add", (req, res) => res.render("add"));
app.post("/add", (req, res) => {
  let sql = `INSERT INTO bread (nama, berat, tinggi, tanggal, hubungan) VALUES
     ('${req.body.name}', '${req.body.weight}', '${req.body.height}', '${req.body.date}', '${req.body.status}')`;
  db.run(sql, (err) => {
    if (err) throw err;
  });

  res.redirect("/");
});

app.get("/delete/:id", (req, res) => {
  let sql = `DELETE FROM bread WHERE id=${req.params.id}`;

  db.run(sql, (err) => {});
  res.redirect("/");
});

app.get("/edit/:id", (req, res) => {
  let sql = `select * from bread where id='${req.params.id}'`;
  db.get(sql, (err, row) => {
    if (err) throw err;

    if (row) {
      res.render("edit", { nama: row });
    }
  });
});

app.post("/edit/:id", (req, res) => {
  let sql = `UPDATE bread 
        SET nama = '${req.body.name}', berat = '${req.body.weight}', tinggi= '${req.body.height}', tanggal = '${req.body.date}', hubungan = '${req.body.status}'
        WHERE id='${req.params.id}'`;

  db.run(sql, (err) => {});

  res.redirect("/");
});

app.listen(3000, () => {
  console.log(`web ini berjalan di port 3000!`);
});

