'use strict';

/*Validacion solo letras alfabeto español*/
$.validator.addMethod("spanishletters", function(value, element) {
  return this.optional(element) || /^[a-zA-ZñÑáéíóúÁÉÍÓÚ]+$/i.test(value);
}, "Por favor, solo letras");


/*Validacion solo letras y espacios alfabeto español*/
$.validator.addMethod("spanishlettersspace", function(value, element) {
  return this.optional(element) || /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]*$/i.test(value);
}, "Por favor, solo letras y espacios");


/*
 * Translated default messages for the jQuery validation plugin.
 * Locale: ES (Spanish; Español)
 */
 jQuery.extend(jQuery.validator.messages, {
  required: "Este campo es obligatorio",
  spanishletters:"Introduzca solo letras",
  spanishlettersspace: "Introduzca solo letras y espacios",
  digits: "Introduzca sólo carácteres numéricos",
  minlength: "Es necesario seleccionar al menos una clinica"
});


$(document).ready(function() {
  var miTabla = $('#miTabla').DataTable({
    'processing': true,
    'serverSide': true,
    'ajax': 'php/cargar_vdoctores.php',
    'language': {
      'sProcessing': 'Procesando...',
      'sLengthMenu': 'Mostrar _MENU_ registros',
      'sZeroRecords': 'No se encontraron resultados',
      'sEmptyTable': 'Ningún dato disponible en esta tabla',
      'sInfo': 'Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros',
      'sInfoEmpty': 'Mostrando registros del 0 al 0 de un total de 0 registros',
      'sInfoFiltered': '(filtrado de un total de _MAX_ registros)',
      'sInfoPostFix': '',
      'sSearch': 'Buscar:',
      'sUrl': '',
      'sInfoThousands': ',',
      'sLoadingRecords': 'Cargando...',
      'oPaginate': {
        'sFirst': 'Primero',
        'sLast': 'Último',
        'sNext': 'Siguiente',
        'sPrevious': 'Anterior'
      },
      'oAria': {
        'sSortAscending': ': Activar para ordenar la columna de manera ascendente',
        'sSortDescending': ': Activar para ordenar la columna de manera descendente'
      }
    },
    'columns': [{
      'data': 'nombre'
    }, {
     'data': 'numcolegiado'
   }, {
    'data': 'nombreClinica',
    'render': function(data) {
      return '<li>' + data + '</li><br>';
    }
  }, {
    'data': 'idClinica',
    "visible": false
  }, {
    'data': 'idDoctor',
    /*añadimos las clases editarbtn y borrarbtn para procesar los eventos click de los botones. No lo hacemos mediante id ya que habrá más de un
    botón de edición o borrado*/
    'render': function(data) {
      return '<a class="btn btn-primary editarbtn" href=http://localhost/php/modificar_doctor.php?id_doctor=' + data + '>Editar</a><a data-toggle="modal" data-target="#vmodal_borrar"  class="btn btn-warning borrarbtn" href=http://localhost/php/borrar_doctor.php?id_doctor=' + data + '>Borrar</a>';
    }
  }]
});


/*Accion de BORRAR Doctor, disparará una Ventana Modal para confirmar*/
$('#miTabla').on('click', '.borrarbtn', function(e) {
 e.preventDefault();
 var nRow = $(this).parents('tr')[0];
 var aData = miTabla.row(nRow).data();
 idDoctor = aData.idDoctor;
 nombre = aData.nombre;
 $('#nombre').val(nombre);
});

/*Control de Ventana Modal BORRAR Doctor*/
$('#vmodal_borrar').on('click','#aceptar_borrar',function(e){
  $.ajax({
    /*Visto en clase*/
    /*En principio el type para api restful sería DELETE
    pero no lo recogeríamos en $_REQUEST, así que queda como POST*/
    type: 'POST',
    dataType: 'json',
    url: 'php/borrar_doctor.php',
    /*Estos son los datos que queremos actualizar, en json:*/
    data: {
     id_doctor: idDoctor
   },
   error: function(xhr, status, error) {
    /*Mostraríamos alguna ventana de alerta con el error*/
    /*Manejo del plugion de growl*/
    /*https://github.com/ksylvest/jquery-growl*/
    $.growl.error({ title: "ERROR", message: "No se ha podido borrar el Doctor" });
  },

  success: function(data) {
      //alert("Borrado Completado");
      /*Visto en clase*/
      /*obtenemos el mensaje del servidor, es un array!!!
        var mensaje = (data["mensaje"]) //o data[0], en función del tipo de array!!
        actualizamos datatables:
        para volver a pedir vía ajax los datos de la tabla*/
        var $mitabla =  $("#miTabla").dataTable( { bRetrieve : true } );
        $mitabla.fnDraw();
        $.growl.notice({ title: "OK", message: "Borrado de Doctor Completado" });
      },
      complete: {
        /*si queremos hacer algo al terminar la petición ajax*/
      }
    });
$('#tabla').fadeIn(100);
});



/*Cargamos los clinicas para que aparezcan en el select:*/
function cargarClinicas() {
 $.ajax({
   type: 'POST',
   dataType: 'json',
   url: 'php/listar_clinicas.php',
   async: false,
   error: function(xhr, status, error) {
    //mostraríamos alguna ventana de alerta con el error
  },
  success: function(data) {
   $('#clinicas_n,#clinicas_e').empty();
   $.each(data, function() {
     $('#clinicas_n,#clinicas_e').append(
       $('<option ></option>').val(this.id_clinica).html(this.nombre)
       );
   });
 },
 complete: {
    //si queremos hacer algo al terminar la petición ajax
  }
});
}




/*Formulario para CREAR NUEVO Doctor*/
$('#form_crear').validate({
  rules: {
   nombre_n: {
    required: true,
    spanishlettersspace: true 
  },
  numcolegiado_n: {
    digits: true
  },
  clinicas_n:{
    required:true,
    minlength: 1
  }
},
submitHandler: function() {
  nombre_n = $('#nombre_n').val();
  numcolegiado_n = $('#numcolegiado_n').val();
  clinicas_n = $('#clinicas_n').val();


  $.ajax({
   type: 'POST',
   dataType: 'json',
   url: 'php/crear_doctor.php',

   data: {
     nombre_n: nombre_n,
     numcolegiado_n: numcolegiado_n,
     clinicas_n: clinicas_n

   },
   error: function(xhr, status, error) {
    $.growl.error({ title: "ERROR", message: "No se ha podido añadir el Doctor" });
  },
  success: function(data) {
    var $mitabla =  $("#miTabla").dataTable( { bRetrieve : true } );
    $mitabla.fnDraw();
    if(data[0].estado==0){
     $.growl.notice({ title: "OK", message: "Doctor añadido correctamente" });
   }
 },
 complete: {
 }
});
  $('#form_nuevo_doctor').fadeOut(100);
  $('#tabla').fadeIn(100);
}

});



/*Accion de CREAR NUEVO Doctor*/
$('#nuevo_doctor').click(function(e) {
 e.preventDefault();
 $('#nombre_n').val("");
 $('#numcolegiado_n').val("");
 $('#tabla').fadeOut(100);
 $('#form_nuevo_doctor').fadeIn(100);
 cargarClinicas();
});




/*Formulario para EDITAR un Doctor ya creado*/
$('#form_editar').validate({
  rules: {
    nombre_e: {
      required: true,
      spanishlettersspace: true
    },
    numcolegiado_e: {
      digits: true
    },
    clinicas_e:{
      required:true,
      minlength: 1
    }
  },
  submitHandler: function() {
    id_doctor_e = $('#id_doctor_e').val();
    nombre_e = $('#nombre_e').val();
    numcolegiado_e = $('#numcolegiado_e').val();
    clinicas_e = $('#clinicas_e').val();

    $.ajax({
     type: 'POST',
     dataType: 'json',
     url: 'php/modificar_doctor.php',
     data: {
       id_doctor_e: id_doctor_e,
       nombre_e: nombre_e,
       numcolegiado_e: numcolegiado_e,
       clinicas_e:clinicas_e

     },
     error: function(xhr, status, error) {
      $.growl.error({ title: "ERROR", message: "No se ha podido editar el Doctor" });
    },
    success: function(data) {
      var $mitabla =  $("#miTabla").dataTable( { bRetrieve : true } );
      $mitabla.fnDraw();

      if(data[0].estado==0){
       $.growl.notice({ title: "OK", message: "Doctor editado correctamente" });
     }
   },
   complete: {
    //si queremos hacer algo al terminar la petición ajax
  }
});

    $('#tabla').fadeIn(100);
    $('#form_edita_doctor').fadeOut(100);
  }

});




/*Accion de EDITAR un Doctor*/
$('#miTabla').on('click', '.editarbtn', function(e) {
  e.preventDefault();
  $('#tabla').fadeOut(100);
  $('#form_edita_doctor').fadeIn(100);
  var nRow = $(this).parents('tr')[0];
  var aData = miTabla.row(nRow).data();
  $('#id_doctor_e').val(aData.idDoctor);
  $('#nombre_e').val(aData.nombre);
  $('#numcolegiado_e').val(aData.numcolegiado);
  $('#clinicas_e').val(aData.nombreClinica);
  cargarClinicas();
  var str = aData.idClinica;
  /*Separo los id de las clinicas*/
  str = str.split(",");
  /*cargo el select con las que ya estaban*/
  $('#clinicas_e').val(str);

});









});