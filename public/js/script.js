$(function(){function b(a){$("#teks-error-uploadify").text(a),$("#error-uploadify").fadeIn("fast")}function c(a){$("#foto").prop("src",a),$("#menu").fadeIn("fast"),$("#tombol-foto").fadeOut("fast")}function d(a){$("#teks-error-webcam").text(a),$("#error-webcam").fadeIn("fast")}function e(a){$("#foto").prop("src",a),$("#menu").fadeIn("fast"),$(".modal").modal("hide"),$("#tombol-foto, .modal").remove()}function f(a){$("#w").val(a.w),$("#h").val(a.h),$("#x").val(a.x),$("#y").val(a.y)}function g(){$("#hilang-potong").fadeIn("fast")}function h(){$("#hilang-potong").fadeOut("fast")}function i(a){$("#teks-error-potong").text(a),$("#error-potong").fadeIn("fast"),k()}function j(a){$("#foto").prop("src",a).css("width","").css("height",""),k()}function k(){a.destroy()}function l(){Caman("#foto",function(){this.render()})}function m(a,b){var c=$("#unduh");c.prop("download",b),"revert"==a?c.fadeOut("fast"):c.fadeIn("fast")}var a;webcam.set_swf_url(swf_webcam),webcam.set_api_url(url_webcam),webcam.set_quality(90),webcam.set_shutter_sound(!1),webcam.set_hook("onComplete",function(a){var b=$.parseJSON(a);if("error"==b.status){var c=b.pesan;d(c)}else{var f=b.foto;e(f)}}),webcam.set_hook("onError",function(a){$(".modal-body").html(a)}),$("#input-uploadify").uploadify({swf:swf_uploadify,uploader:url_uploadify,buttonClass:"btn btn-danger",buttonText:"Pilih Foto",fileObjName:"foto",multi:!1,removeTimeout:0,width:100,onUploadSuccess:function(a,d){var f=$.parseJSON(d);if("error"==f.status){var g=f.pesan;b(g)}else{var h=f.foto;c(h)}}}),$("#ambil-foto").click(function(){var a=webcam.get_html(530,330);$(".modal-body").html(a),$(".modal").modal("show")}),$("#pengaturan-webcam").click(function(){webcam.configure("camera")}),$("#unggah-webcam").click(function(){webcam.snap(),webcam.reset()}),$("#batal-webcam").click(function(){$(".modal-body").html(""),$("#teks-error-webcam").text(""),$("#error-webcam").fadeOut("fast")}),$("#potong-foto").click(function(){var b=200,c=200,d=$("#foto").prop("width"),e=$("#foto").prop("height"),i=d/2-b/2,j=e/2-c/2,k=i+b,l=j+c;$("#foto").Jcrop({bgOpacity:.2,minSize:[100,100],setSelect:[i,j,k,l],onChange:f,onSelect:g,onRelease:h},function(){a=this}),g()}),$("#batal-potong").click(function(){k(),h()}),$("#simpan-potong").click(function(){var a=$("#w").val(),b=$("#h").val(),c=$("#x").val(),d=$("#y").val();h(),k(),$.post(url_crop,{w:a,h:b,x:c,y:d},function(a){if("error"==a.status){var b=a.pesan;i(b)}else{var c=a.foto;j(c)}},"json")}),$("#filter-foto").click(function(){l(),$("#filters").fadeIn("fast"),$("#tombol-foto, #menu, .modal").remove()}),$("#filter button").click(function(){var a=$("#filter button"),b=$(this),c=b.prop("id"),d=b.text();return b.is(".active")?!1:(a.removeClass("active"),b.addClass("active"),Caman("#foto",function(){if(c in this)this.revert(),this[c](),this.render(),m(c,d);else{var a=$("#unduh");a.fadeOut("fast")}}),void 0)}),$("#unduh").click(function(){var a=document.getElementById("foto"),b=a.toDataURL("image/png;base64;"),c=$("#unduh");c.prop("href",b)})});