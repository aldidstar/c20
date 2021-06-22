app.get("/", (req, res) => {
    //konfigurasi pagination
  
    const { name, weight, height, date, status } = req.query;
  
    const url = req.url == '/' ? '/?page=1' : req.url;
    const page = req.query.page || 1
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
  
    // if (date) {
    //   params.push(`date=${date}`);
    // }

    if (status) {
      params.push(`hubungan='${status}'`);
    }
  
  
    let sql = `SELECT count(*) FROM bread`;
  if (params.length > 0) {
    sql += ` where ${params.join(" and ")}`;
  }
  
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