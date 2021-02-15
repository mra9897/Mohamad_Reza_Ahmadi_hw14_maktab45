$(function () {
    $('nav').toggleClass('bg-s bg-dark', window.scrollY > 465);
    $(window).scroll(() => {
        $('nav').toggleClass('bg-s bg-dark', window.scrollY > 465);
    });
    $('.card').on('mouseenter', function () {
        $(this).animate({
            boxShadow: "0px 0px 5px 3px hsla(100, 70%, 60%, 0.8)"
        });
    });
    $('#search').on('keyup', function(){
        let searchKey = $(this).val();
        if(!searchKey)
            searchKey = "%%%";
        window.history.pushState(null,null,searchKey === "%%%" ? '/' : `?search=${searchKey}`);
        $.get(`http://localhost:5002/${encodeURI(searchKey)}`, data =>{
            let content = $('#content');
            content.html('');
            JSON.parse(data).forEach(v=>{
                content.append(cartMaker(v));
            });
        });
    });
});


const cartMaker = v => {
    return `
            <div class="col-sm-12 col-md-6 col-lg-4">
                    <div class="card">
                        <div style="background: url('assets/images/${v.image}')" class="card-img card-img-top"></div>
                        <div class="card-body">
                            <h5 class="card-title">${v.name}</h5>
                            <p class="card-text">${v.description}</p>
                            <a href="/food/${v.id}" class="btn btn-primary buy"><i class="bi bi-cart-plus"></i></a>
                            ${v.discount ? `<div class="badge badge-pill badge-danger discount">${v.discount}%</div>` : ""}
                        </div>
                    </div>
                </div>
            `;
}