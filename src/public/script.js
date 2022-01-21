$(document).ready(function(){
        $("#changeQuote").on("submit",function(event){
            event.preventDefault();
            let value =$("#value-name").val();

            $.ajax({
                url:"/ajax",
                method:"POST",
                contentType:"application/json",
                data: JSON.stringify({quote:value}),
                success:function(res){
                    $("h1").html(`Quote: ${res.response}`);
                    window.location.href='http://localhost:1234/';
                }


            })
        })
})
