'use strict';



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
      return '<a class="btn btn-primary editarbtn" href=http://localhost/php/modificar_doctor.php?id_clinica=' + data + '>Editar</a><a data-toggle="modal" data-target="#vmodal_borrar" class="btn btn-warning borrarbtn" href=http://localhost/php/borrar_doctor.php?id_clinica=' + data + '>Borrar</a>';
    }
  }]
});


/*Accion de Borrar Doctor, disparará una Ventana Modal para confirmar*/
$('#miTabla').on('click', '.borrarbtn', function(e) {
 //e.preventDefault();
 var nRow = $(this).parents('tr')[0];
 var aData = miTabla.row(nRow).data();
 idDoctor = aData.idDoctor;
 alert(idDoctor);
});

/*Control de Ventana Modal Borrar Doctor*/
$('#vmodal_borrar').on('click','#aceptar_borrar',function(e){
  alert(idDoctor);
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
    alert("Ha entrado en error");
    /*Manejo del plugion de growl*/
    /*Primero descargue el jgrowl de
        https://github.com/stanlemon/jGrowl
      Pero el bootstrap-notify me gusta más
      Convierte las alertas bootstrap en notificaciones estilo Growl
      https://github.com/mouse0270/bootstrap-notify*/

      $.growl({
        icon: "glyphicon glyphicon-remove",
        message: "ERROR. No se ha podido borrar el Doctor"
      },{
        type: "danger"
      });
    },

    success: function(data) {
      alert("Borrado Completado");
      /*Visto en clase*/
      /*obtenemos el mensaje del servidor, es un array!!!
        var mensaje = (data["mensaje"]) //o data[0], en función del tipo de array!!
        actualizamos datatables:
        para volver a pedir vía ajax los datos de la tabla*/
        var $mitabla =  $("#miTabla").dataTable( { bRetrieve : true } );
        $mitabla.fnDraw();
        $.growl({
          icon: "glyphicon glyphicon-remove",
          message: "Borrado de Doctor Completado"
        },{
          type: "success"
        });
      },
      complete: {
        /*si queremos hacer algo al terminar la petición ajax*/
      }
    });
  $('#tabla').fadeIn(100);
  //$('#formulario').fadeOut(100);
});




});