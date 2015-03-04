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
      'data': 'nombreClinica',
      'render': function(data) {
        return '<li>' + data + '</li><br>';
      }
    }, {
      'data': 'idDoctor',
    /*añadimos las clases editarbtn y borrarbtn para procesar los eventos click de los botones. No lo hacemos mediante id ya que habrá más de un
    botón de edición o borrado*/
    'render': function(data) {
      return '<a class="btn btn-primary editarbtn" href=http://localhost/php/modificar_doctor.php?id_clinica=' + data + '>Editar</a><a class="btn btn-warning borrarbtn" href=http://localhost/php/borrar_doctor.php?id_clinica=' + data + '>Borrar</a>';
    }
  }]
});

});