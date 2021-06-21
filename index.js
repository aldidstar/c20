const express = require("express");
const path = require("path");
var bodyParser = require("body-parser");
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
 
  let sql = `SELECT * FROM bread limit 3 offset 0`;
  let page = parseInt(req.query.page);
  let size = parseInt(req.query.size);
  let offset = page * size;

  if (page && size) {
    sql = `SELECT * FROM bread limit ${size} offset ${offset}`;
  }
  
  
  db.all(sql, (err, rows) => {
    db.all(`SELECT * FROM bread`, (err, row) => {
      let jumlahData = row.length;
  let jumlahHalaman = Math.ceil(jumlahData / 3)
      if (row) {
      }
    if (rows) {
      res.render("index", { nama: rows, jumlahHalaman, page, jumlahData});
    }
  });
  });
});
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

  db.run(sql, (err) => {
   
  });
  res.redirect("/");
  

});

app.get("/edit/:id", (req, res) => {
  let sql = `select * from bread where id='${req.params.id}'`;
  db.get(sql, (err, row) => {
    if (err) throw err;

    if(row){
        
        res.render("edit", {nama: row});
    } 
});
});

app.post("/edit/:id", (req, res) => {
    let sql = `UPDATE bread 
        SET nama = '${req.body.name}', berat = '${req.body.weight}', tinggi= '${req.body.height}', tanggal = '${req.body.date}', hubungan = '${req.body.status}'
        WHERE id='${req.params.id}'`;


    db.run(sql, (err) => {
        
    });


  res.redirect("/");
});




app.listen(3000, () => {
  console.log(`web ini berjalan di port 3000!`);
});
