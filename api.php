<?php
header("Content-Type: application/json");

// Database configuration
$dbHost = "localhost";
$dbName = "ionic_perpus";
$dbUser = "root";
$dbPassword = "";


// Create a MySQLi connection
$mysqli = new mysqli($dbHost, $dbUser, $dbPassword, $dbName);

// Check connection
if ($mysqli->connect_error) {
    die("Connection failed: " . $mysqli->connect_error);
}

// Get Buku list
if ($_SERVER["REQUEST_METHOD"] === "GET" && $_GET['type'] === 'buku') {
    $result = $mysqli->query("SELECT * FROM buku");
    $buku = [];

    while ($row = $result->fetch_assoc()) {
        $buku[] = $row;
    }

    echo json_encode($buku);
}


if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $data = json_decode(file_get_contents("php://input"), true);
    /// Add new Buku
    if ($data['type'] === 'insertBuku' && isset($data["nama_buku"], $data["pengarang"], $data["penerbit"])) {
        $judul = $data["nama_buku"];
        $pengarang = $data["pengarang"];
        $penerbit = $data["penerbit"];

        if ($mysqli->query("INSERT INTO buku (nama_buku, pengarang, penerbit) VALUES ('$judul', '$pengarang', '$penerbit')")) {
            echo json_encode(["message" => "Buku added successfully"]);
        } else {
            echo json_encode(["error" => "All book data is required"]);
        }
    } else if ($data['type'] === 'insertPeminjaman' && isset($data["nama_peminjam"], $data["nama_buku"], $data["waktu_peminjaman"], $data["waktu_pengembalian"], $data["status_peminjaman"])) {
        $nama_peminjam = $data["nama_peminjam"];
        $nama_buku = $data["nama_buku"];
        $waktu_peminjaman = $data["waktu_peminjaman"];
        $waktu_pengembalian = $data["waktu_pengembalian"];
        $status_peminjaman = $data["status_peminjaman"];


        if ($mysqli->query("INSERT INTO peminjaman (nama_peminjam, nama_buku, waktu_peminjaman, waktu_pengembalian, status_peminjaman) VALUES ('$nama_peminjam', '$nama_buku', '$waktu_peminjaman', '$waktu_pengembalian', '$status_peminjaman')")) {
            echo json_encode(["message" => "Peminjaman added successfully"]);
        } else {
            echo json_encode(["error" => "All loan data is required"]);
        }
    } else {
        echo json_encode(["error" => "Cannot Sync with API!"]);
    }
}

// Update buku
if ($_SERVER["REQUEST_METHOD"] === "PUT") {
    $data = json_decode(file_get_contents("php://input"), true);

    if ($data['type'] === 'updateBuku' && isset($data["id_buku"], $data["nama_buku"], $data["pengarang"], $data["penerbit"])) {
        $id = $data["id_buku"];
        $judul = $data["nama_buku"];
        $pengarang = $data["pengarang"];
        $penerbit = $data["penerbit"];

        if ($mysqli->query("UPDATE buku SET nama_buku = '$judul', pengarang = '$pengarang', penerbit = '$penerbit' WHERE id_buku = $id")) {
            echo json_encode(["message" => "Buku updated successfully"]);
        } else {
            echo json_encode(["error" => "All book data is required"]);
        }
    } else if ($data['type'] === 'updatePinjam' && isset($data["id_peminjaman"], $data["status_peminjaman"])) {
        $id = $data["id_peminjaman"];
        $status_peminjaman = $data["status_peminjaman"];

        if ($mysqli->query("UPDATE peminjaman SET status_peminjaman = '$status_peminjaman' WHERE id_peminjaman = $id")) {
            echo json_encode(["message" => "Peminjaman updated successfully"]);
        } else {
            echo json_encode(["error" => "All loan data is required"]);
        }
    } else {
        echo json_encode(["error" => "Cannot Sync with API!"]);
    }
}

if ($_SERVER["REQUEST_METHOD"] === "DELETE") {
    $data = json_decode(file_get_contents("php://input"), true);

    if ($data['type'] === 'deleteBuku' && isset($data["id_buku"])) {
        $id = $data["id_buku"];

        if ($mysqli->query("DELETE FROM buku WHERE id_buku = $id")) {
            echo json_encode(["message" => "Buku deleted successfully"]);
        } else {
            echo json_encode(["error" => "All book data is required"]);
        }
    } else if ($data['type'] === 'deletePinjam' && isset($data["id_peminjaman"])) {
        $id = $data["id_peminjaman"];

        if ($mysqli->query("DELETE FROM peminjaman WHERE id_peminjaman = $id")) {
            echo json_encode(["message" => "Peminjaman deleted successfully"]);
        } else {
            echo json_encode(["error" => "All loan data is required"]);
        }
    } else {
        echo json_encode(["error" => "Cannot Sync with API!"]);
    }
}





// // Close the MySQLi connection
$mysqli->close();
