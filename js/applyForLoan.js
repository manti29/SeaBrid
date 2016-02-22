$(function(){
    var checkoutObj=$("#checkoutBtn"),
        submitBtnObj=$("#submitBtn"),
        loanBtnObj=$("#loanBtnGroup button");
    //协议复选连动提交按钮
    checkoutObj.on("change",function(){
        var btnSwitch=null;
        if(!this.checked){
            btnSwitch=true;           
        }else{
            btnSwitch=false;           
        }
        submitBtnObj.attr("disabled",btnSwitch);
    })
    //切换贷款按钮
    loanBtnObj.each(function(index,ele){
        var n=index;
        if(index==0){
            n++;
        }else{
            n--;
        }       
    })
})
