CREATE TABLE bread(
    id INTEGER primary key AUTOINCREMENT,
    nama varChar(50) NOT NULL,
    berat number NOT NULL,
    tinggi number NOT NULL,
    tanggal date,
    hubungan boolean NOT NULL

);
insert into bread(nama, berat, tinggi, tanggal, hubungan)
VALUES('Messi', 63, 163, '2021-06-06','true');

{nama: "aldi", berat: 53, tinggi: 163, tanggal: "2021-06-07", hubungan: "true"},
{nama: "ares", berat: 73, tinggi: 173, tanggal: "2021-06-05", hubungan: "false"},