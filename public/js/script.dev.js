/**
 * jQuery load
 */
$(function() {
  /**
   * jcrop api
   * 
   * @var jcrop_api
   */
  var jcrop_api;

  /**
   * konfigurasi webcam
   */
  webcam.set_swf_url(swf_webcam);
  webcam.set_api_url(url_webcam);
  webcam.set_quality(90);
  webcam.set_shutter_sound(false);

  
  /**
   * unggah snapshot selesai
   * 
   * @param  json respon
   * @return void
   */
  webcam.set_hook("onComplete", function(respon) {
    // parse json
    var parse = $.parseJSON(respon);

    // blank
    if (parse.status == "error") {
      // pesan dari server
      var pesan = parse.pesan;
      errorWebcam(pesan);

    //  tidak blank
    } else {
      // url snapshot yang diunggah
      var foto = parse.foto;
      suksesWebcam(foto);
    };
  });

  /**
   * error unggah snapshot
   * 
   * @param  string error
   * @return void
   */
  webcam.set_hook("onError", function(error) {
    $(".modal-body").html(error);
  });

  /**
   * konfigurasi uploadify
   */
  $("#input-uploadify").uploadify({
    swf: swf_uploadify,
    uploader: url_uploadify,
    buttonClass: "btn btn-danger",
    buttonText: "Pilih Foto",
    fileObjName: "foto",
    multi: false,
    removeTimeout: 0,
    width: 100,
    "onUploadSuccess": function(file, data, response) {
      // parse json
      var parse = $.parseJSON(data);

      // tidak valid
      if (parse.status == "error") {
        // pesan dari server
        var pesan = parse.pesan;
        errorUploadify(pesan);

      // valid
      } else {
        // url foto yang diunggah
        var foto = parse.foto;
        suksesUploadify(foto);
      };
    }
  });

  /**
   * error uploadify
   * 
   * @param  string pesan
   * @return void
   */
  function errorUploadify(pesan) {
    // tampilkan pesan error uploadify
    $("#teks-error-uploadify").text(pesan);
    $("#error-uploadify").fadeIn("fast");

  }

  /**
   * sukses uploadify
   * 
   * @param  string foto
   * @return void
   */
  function suksesUploadify(foto) {
    // update foto
    $("#foto").prop("src", foto);

    // tampilkan menu
    $("#menu").fadeIn("fast");

    // hilangkan tombol foto
    $("#tombol-foto").fadeOut("fast");
  }
  
  /**
   * event klik tombol ambil foto
   * 
   * @return void
   */
  $("#ambil-foto").click(function() {
    // buat webcam pada modal
    var html = webcam.get_html(530, 330);
    $(".modal-body").html(html);

    // tampilkan modal
    $(".modal").modal("show");
  });

  /**
   * event klik pengaturan webcam
   * 
   * @return void
   */
  $("#pengaturan-webcam").click(function() {
    // konfigurasi webcam
    webcam.configure("camera");
  });

  /**
   * event klik unggah webcam
   * 
   * @return void
   */
  $("#unggah-webcam").click(function() {
    // unggah snapshot
    webcam.snap();

    // reset webcam
    webcam.reset();
  });

  /**
   * event klik tombol batal webcam
   * @return {[type]} [description]
   */
  $("#batal-webcam").click(function() {
    // kosongkan konten modal
    $(".modal-body").html("");
    $("#teks-error-webcam").text("");
    $("#error-webcam").fadeOut("fast");
  });

  /**
   * error unggah webcam (snapshot)
   * 
   * @param  string pesan
   * @return void
   */
  function errorWebcam(pesan) {
    // tampilkan pesan error webcam
    $("#teks-error-webcam").text(pesan);
    $("#error-webcam").fadeIn("fast");
  }

  /**
   * sukses unggah webcam (snapshot)
   * 
   * @param  string foto
   * @return void
   */
  function suksesWebcam(foto) {
    // update foto
    $("#foto").prop("src", foto);

    // tampilkan menu
    $("#menu").fadeIn("fast");

    // sembunyikan modal
    $(".modal").modal("hide");

    // hapus tombol foto & modal
    $("#tombol-foto, .modal").remove();
  }

  /**
   * event klik tombol potong
   * 
   * @return void
   */
  $("#potong-foto").click(function() {
    // tentukan area seleksi
    var lebar_seleksi = 200;
    var tinggi_seleksi = 200;
    var lebar_gambar = $("#foto").prop("width");
    var tinggi_gambar = $("#foto").prop("height");
    var x = (lebar_gambar / 2) - (lebar_seleksi / 2);
    var y = (tinggi_gambar / 2) - (tinggi_seleksi / 2);
    var x1 = x + lebar_seleksi;
    var y1 = y + tinggi_seleksi;

    // konfigurasi jcrop
    $("#foto").Jcrop({
      bgOpacity: .2,
      minSize: [100, 100],
      setSelect: [x, y, x1, y1],
      onChange: koordinat,
      onSelect: tampilPotong,
      onRelease: hilangPotong
    }, function() {
      jcrop_api = this;
    });

    // tampilkan tombol batal & simpan potong
    tampilPotong();
  });

  /**
   * event klik tombol batal potong
   * 
   * @return void
   */
  $("#batal-potong").click(function() {
    // hilangkan jcrop
    musnah();

    // hilangkan tombol
    hilangPotong();
  });

  /**
   * event klik tombol simpan potong
   * 
   * @return void
   */
  $("#simpan-potong").click(function() {
    // data
    var w = $("#w").val();
    var h = $("#h").val();
    var x = $("#x").val();
    var y = $("#y").val();

    // hilangkan tombol
    hilangPotong();

    // musnah
    musnah();

    // kirim koordinat ke server
    $.post(url_crop, { w: w, h: h, x: x, y: y }, function(respon) {
      // tidak valid
      if (respon.status == "error") {
        // pesan dari server
        var pesan = respon.pesan;
        errorPotong(pesan);

      // valid
      } else {
        // url foto yang sudah dipotong
        var foto = respon.foto;
        suksesPotong(foto);
      };
    }, "json");
  });

  /**
   * koordinat
   * 
   * @param object c
   * @return void
   */
  function koordinat(c) {
    // data koordinat
    $("#w").val(c.w);
    $("#h").val(c.h);
    $("#x").val(c.x);
    $("#y").val(c.y);
  }

  /**
   * tampilkan tombol potong
   * 
   * @return void
   */
  function tampilPotong() {
    // tampilkan tombol simpan & batal potong
    $("#hilang-potong").fadeIn("fast");
  }

  /**
   * hilangkan tombol potong foto
   * 
   * @return void
   */
  function hilangPotong() {
    // hilangkan tombol simpan & batal potong
    $("#hilang-potong").fadeOut("fast");
  }

  /**
   * penanganan error potong foto
   * 
   * @param  string pesan
   * @return void
   */
  function errorPotong(pesan) {
    // tampilkan pesan error potong
    $("#teks-error-potong").text(pesan);
    $("#error-potong").fadeIn("fast");

    // musnah
    musnah();
  }

  /**
   * penanganan sukses potong foto
   * 
   * @param  string foto
   * @return void
   */
  function suksesPotong(foto) {
    // update foto
    $("#foto").prop("src", foto).css("width", "").css("height", "");
    
    // musnah
    musnah();
  }

  /**
   * event klik tombol filter
   * 
   * @return void
   */
  $("#filter-foto").click(function() {
    // inisialisasi canvas
    initCanvas();

    // tampilkan filter
    $("#filters").fadeIn("fast");

    // hapus tombol foto, menu & modal
    $("#tombol-foto, #menu, .modal").remove();
  });

  /**
   * musnahkan (destroy) Jcrop API
   * 
   * @return void
   */
  function musnah() {
    // musnahkan jcrop
    jcrop_api.destroy();
  }

  /**
   * inisialisasi canvas
   * 
   * @return void
   */
  function initCanvas() {
    // rubah foto menjadi canvas
    Caman("#foto", function() {
      this.render();
    });
   }

  /**
   * event klik tombol efek filter
   * 
   * @return void
   */
  $("#filter button").click(function() {
    // data
    var filters = $("#filter button");
    var filter = $(this);
    var id = filter.prop("id");
    var teks = filter.text();

    // cek link filter
    if (filter.is(".active")) {
      return false;
    };

    // hapus & tambah class pada tombol
    filters.removeClass("active");
    filter.addClass("active");

    // cek efek filter
    Caman("#foto", function() {
      // efek ada
      if (id in this) {
        // hilangkan efek
        this.revert();

        // terapkan efek
        this[id]();
        this.render();

        // link unduh
        linkUnduh(id, teks);

      // efek tidak ada
      } else {
        // hilangkan link unduh
        var unduh = $("#unduh");        
        unduh.fadeOut("fast");
      };
    });
  });

  /**
   * link unduh gambar
   * 
   * @param  string id
   * @param  string teks
   * @return void
   */
  function linkUnduh(id, teks) {
    // rubah nama gambar untuk diunduh
    var unduh = $("#unduh");
    unduh.prop("download", teks);

    // tidak ada filter yang dipakai
    if (id == "revert") {
      // hilangkan link unduh
      unduh.fadeOut("fast");

    } else {
      // tampilkan link unduh
      unduh.fadeIn("fast");
    };
  }

  /**
   * event klik unduh gambar
   * 
   * @return void
   */
  $("#unduh").click(function() {
    // data canvas
    var canvas = document.getElementById("foto");
    var url = canvas.toDataURL("image/png;base64;");

    // rubah link unduh
    var unduh = $("#unduh");
    unduh.prop("href", url);
  });
});