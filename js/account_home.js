$(function() {
    var fomatAmount = null,//格式化可贷额度
        amountObj=$("#amount"),//可贷额度
        amount=null,//后台返回的可贷额度
        promiser = $.ajax({
            type: "get",
            url: "../../my_account/amount/0007001748",
            dataType: "json",
            success: function(data) {
               amount=parseFloat(data.data.amount).toFixed(2);
               amountObj.text(amount);
            },
            error: function(XMLHttpRequest, b, c) {
                console.log(XMLHttpRequest.readyState + "\n" + b + "\n" + c);
            }
        });
        promiser.done(function(){
            formatAmount = "￥" + toThousands(parseFloat(amount)) + " 元";
            amountObj.text(formatAmount);
        })    
});
//遍历json对象
function eachJson(data) {
    $.each(data.data, function(index, ele) {
        console.log(index + ":" + ele);
    });
}
//金额格式化代码
    function toThousands(num) {
        return (num|| 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
    }