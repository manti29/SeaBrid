$(function() {
var checkoutObj = $("#checkoutBtn"),
    submitBtnObj = $("#submitBtn"),
    loanBtnObj = $("#loanBtnGroup a"),
    cssArry = ['btn-warning', 'btn-default'];
//协议复选连动提交按钮
checkoutObj.on("change", function() {
        var btnSwitch = null;
        if (!this.checked) {
            btnSwitch = true;
        } else {
            btnSwitch = false;
        }
        submitBtnObj.attr("disabled", btnSwitch);
    })
    //切换贷款按钮
$("#loanBtnGroup a").on('click', function() {
        var selectOptionObj = $('.form-group select'),
            num = null;
        if ($(this).attr("id") === "selectBtn1") {
            num = 0;
        } else {
            num = 1;
        }
        changeCs($(this));
        selectOption(selectOptionObj, num);
    })
    //
$("#amountEntered").on("change", function() {
        checkNumber($(this).val());
    })
    //
function selectOption(obj, num) {
    obj.each(function(index, ele) {
        $(ele).find("option").eq(num).attr('selected', 'true');
    });
}
//
function changeCs(obj) {
    event.preventDefault();
    obj.addClass(cssArry[0]).siblings().removeClass(cssArry[0]);
}
//金额格式化代码
function toThousands(num) {
    return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
}
//输入金额必须是数字
function checkNumber(obj) {
    var reg = /^[0-9]+(.[0-9]{2})?$/;
    if (reg.test(obj)) {
        alert("right");
    } else {
        alert("wrong");
    }
}
//提交按钮
submitBtnObj.click(function(){
	alert("Hello");
	$.ajax({
	    type:"POST",
		url:"../../api/loan/apply",
		data:{userCode:"10000",loanAmt:100000.00,prodSubCode:"10020384"},
		dataType:"json",
		success:function(data,txt){
			alert(data);
		},
		error:function(a,b,c){
			console.log("error");
		}
	})
});
})