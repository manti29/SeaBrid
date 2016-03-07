$(function() {
    var fomatAmount = null;   
        formatAmount="￥"+toThousands($("#amount").text())+"元";
        $("#amount").text(formatAmount);
    //金额格式化代码
    function toThousands(num) {
        return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
    }
})