$(document).ready(function(){
    $("#addCat").on('click',function(){
        var catVal=$("#cat").val();
        if(catVal=="")
        {
            $.toast({
                heading: 'Error',
                text: 'Please Enter Category Value',
                showHideTransition: 'fade',
                position: 'top-right',
                icon: 'error'
            })
        }
        else{
            
            $.ajax({
                type:"POST",
                url:"http://localhost:3000/admin/addCategory",
                data:"c="+catVal,
                dataType:'json',
                success:function(result){
                    if(result.ok)
                    {
                        $.toast({
                            heading: 'Success',
                            text:result.msg ,
                            showHideTransition: 'fade',
                            position: 'top-right',
                            icon: 'success'
                        });
                        $('#exampleModal1').modal('hide');
                    }
                    else{
                        $.toast({
                            heading: 'Error',
                            text: result.msg,
                            showHideTransition: 'fade',
                            position: 'top-right',
                            icon: 'error'
                        })
                    }
                }
            })
        }
    })
    
})