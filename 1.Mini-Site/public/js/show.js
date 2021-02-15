$(function(){
    $('nav').toggleClass('bg-s bg-dark');
    $('li').removeClass('active');
    let page = window.location.pathname;
    $(`a[data-url='${page}']`).parent().addClass('active');

    
    $('span i').on('click', function(){
        setTimeout(()=>{
            let id = $(this).attr('id');
            $(this).toggleClass(`bi-${id} bi-${id}-fill`);
            $(this).toggleClass('activeIcon');
        }, 200);
    });
    $('#up').on('click', ()=>{
        let count = $('#count');
        count.animate({
            opacity: '0'
        }, 100, ()=>{
            count.animate({opacity: '1'});
            count.text(+count.text()+1);
        });
    });
    $('#down').on('click', ()=>{
        let count = $('#count');
        if(count.text() !== "1") {
            count.animate({
                opacity: '0'
            }, 100, ()=>{
                count.animate({opacity: '1'});
                count.text(+count.text()-1);
            });
        }
    });
});