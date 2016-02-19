$(function() {
    var inputEle = $('input[type="text"]');
    var submitBtn = $('button[type="submit"]');
    var loginSubmit = $("#loginSubmit");
    var notice = {
        'success': 'has-success',
        'successSpan': '<span class="glyphicon glyphicon-ok form-control-feedback"></span>',
        'err': "has-error",
        'errSpan': '<span class="glyphicon glyphicon-remove form-control-feedback"></span>',
        'formEmpty': '表单项不能为空',
        'loginUserName': null,
        'loginCode': null,
        'nowItemCss': null,
    };
    //用户名检验
    $("#username").on('change', function() {
        var obj = $(this),
            flag =objParent= null,
            promiser = $.ajax({
                type: "post",
                url: "login.php",
                async: true,
                data: 'name=' + obj.val(),
                success: function(data) {
                    flag=checkoutIteam(obj.parent().parent(),data);
                }
        });
        return flag;
    });
    //验证码检验
    $("#code").on('change',function(){
        
    })
    //获取验证码
    $('#btnMesCode').click(function() {
        var timer = obj = null,
            t = 60;
        obj = this;
        $(obj).text(t + ' s').attr("disabled", true);
        timer = setInterval(function() {
            t--;
            if (t <= 0) {
                clearInterval(timer);
                $(obj).text('获取短信验证码').removeAttr("disabled");
            } else {
                $(obj).text(t + ' s');
            }
        }, 100);
    });
    //同意协议注册
    $("#agreeCheck").change(function() {
        $('#registerSubmit').attr("disabled", !this.checked);
    });
    //检证增加样式事件
    function checkoutIteam(obj,data) {
        removeCheckoutCss(obj, notice.nowItemCss)
        if (data == 'ok') {
            notice.nowItemCss = notice.success;
            flag = true;
        } else {
            notice.nowItemCss = notice.err;
            flag = false;
        };
        addCheckoutCss(obj, notice.nowItemCss);
        return flag;
    }
    //添加检验样式
    function addCheckoutCss(obj, className) {
        obj.addClass(className);
    }
    //去除检验样式
    function removeCheckoutCss(obj, className) {
        obj.removeClass(className);
    }
    //注册提交页面
    $("#loginSubmit").on('click', function() {
        if (notice.loginUserName && notice.loginCode) {
            return true;
        } else {
            return false;
        }
    });
});