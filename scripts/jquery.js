// ------------------------------ JQUERY-------------------------------- //

// VALIDACION FORMULARIO

let formNombre = $("#formNombre");
let formTexto = $("#formTexto");
let formEmail = $("#formEmail");
let formulario = $("#form").on ('submit', function(e){

    e.preventDefault();

    if ((formNombre.val() == "") || (formTexto.val() == "") || (formEmail.val() == "")){
        
        Swal.fire({
            icon: 'info',
            title: 'Faltan completar campos',
          });

    }else{  
        Swal.fire(
            'Gracias por contactarte!',
            'Te responderemos a la brevedad',
            'success'
        );
        this.reset();
    }   
});


// ALERTA COMPRA FINALIZADA

$("#botonFinalizarCompra").on('click', function() {

    Swal.fire(
        'Gracias por comprar en nuestra página!',
        'Su pedido será enviado a la brevedad',
        'success'
    );

    vaciarCarrito();
    cerrarModal();
});

// CAMBIOS EN CARRITO

function mostrarBadge(){
    $("#badge").show();
};

function habilitarBotonPago(){
    $("#botonDePago").prop('disabled', false);
};

function deshabilitarBotonPago(){
    $("#botonDePago").prop('disabled', true);
    $("#badge").hide();
};

function vaciarCarrito(){
    $("#tablaBody").empty();
    $("#totalCarrito").hide();
    deshabilitarBotonPago();
}

function cerrarModal(){
    $("#staticBackdrop").hide();
}


// ----------------------------- ANIMACIONES -------------------------------- //

    
function mostrarDetalles(){
    $(".botonDetalles").click((e)=>{
        let hermanos = $(e.target).parent().children(".hidden");
        hermanos.slideDown("slow")
                .delay(4000)
                .slideUp("slow");
    })
};







