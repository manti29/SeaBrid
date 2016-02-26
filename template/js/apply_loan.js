$(function() {
    var checkoutObj = $("#checkoutBtn"),
        submitBtnObj = $("#submitBtn"),
        loanBtnObj = $("#loanBtnGroup"),
        userCode = $("#userCode"),
        cssArry = ['btn-warning', 'btn-default'],
        inputTxtObj = $("#amountEntered"),
        amount = switchTxtArr = submitFlag = initialValue=dom = null,
        nowItemObj = 0; //当前选择的贷款方式        
    //协议复选连动提交按钮
    checkoutObj.on("change", function() {
        var btnSwitch = null;
        if (!this.checked) {
            btnSwitch = true;
        } else {
            btnSwitch = false;
        };
        submitBtnObj.attr("disabled", btnSwitch);
    });
    //
    promiser = $.ajax({
        type: "get",
        url: "../../api/loan/detail/" + userCode.text()+"/",
        dataType: "json",
        beforeSend: function(XMLHttpRequest) {
            ajasMsgDom(loanBtnObj, $("<span>数据加载中...</span>"));
        },
        success: function(data) {
            amount = data.data.limit; //贷款金额
            switchTxtArr = data.data.loanLimitInfos;
            removeObj(loanBtnObj.find("span"));
        },
        error: function(XMLHttpRequest, b, c) {
            console.log(XMLHttpRequest.readyState + "\n" + b + "\n" + c);
        }
    });
    promiser.done(function() {
        var dom = "";
        $("#countNum").text("￥ " + fmoney(amount, 2) + " 元");
        for (var i = 0, len = switchTxtArr.length; i < len; i++) {
            dom += createSwitchTxt(switchTxtArr[i], i);
        };
        loanBtnObj.append(dom);
        //
        loanBtnObj.find("p").eq(0).addClass("addSwitchBg");
        //切换还款方式
        loanBtnObj.find("p").on("click", function() {
            nowItemObj = parseInt($(this).attr("data-mes"));
            $(this).attr("class", "pull-left addPCs addSwitchBg").siblings().attr("class", "pull-left addPCs");
        });
    });
    //提交按钮
    submitBtnObj.click(function() {
        var amount = inputTxtObj.val(),
            promise = sendData = null;
        if (amount == '' || amount < 50000 || !submitFlag) {
            alertWindow('提示信息', '请输入正确金额..');
            inputTxtObj.select();
        } else {
            promise = $.ajax({
                url: "../../api/loan/check/amount/",
                data: {
                    userCode: userCode.text(),
                    loanAmount: parseFloat(initialValue)
                },
                success: function(data) {
                    sendData = data;
                    console.info(data);
                },
                error: function(a, b, c) {
                    console.log(a + ":" + b + ":" + c);
                }
            });
            promise.done(function() {
                switch (sendData.code) {
                    case 0:
                        $.ajax({
                            type: "post",
                            url: "../../api/loan/apply/",
                            data: {
                                userCode: userCode.text(),
                                prodSubCode: switchTxtArr[nowItemObj].subPrdCode,
                                loanAmt: parseFloat(initialValue)
                            },
                            dataType: "json",
                            success: function(data) {
                                alertWindow('提示信息', data.msg, "../../my_account/" + userCode.text()+"/");
                            },
                            error: function(a, b, c) {
                                console.log(a + "\n" + b + "\n" + c + "\n");
                            }
                        });
                        break;
                    default:
                        alertWindow('提示信息', sendData.msg);
                }
            });
        };
    });
    //输入框验证信息
    inputTxtObj.on("change", function() {
        var inAmount = $(this).val(),
            obj = $(this);
        initialValue = inAmount;
        submitFlag = checkNumber(inAmount);
        switch (true) {
            case !submitFlag:
                alertWindow("提示信息", "输入的金额不正确...");
                submitFlag = null;
                this.select();
                $('#myModal').on('hidden.bs.modal', function(e) {
                    obj.val("");
                })
                break;
            case inAmount > amount:
                alertWindow("提示信息", "输入的金额超过可贷额度...");
                submitFlag = null;
                $(this).select();
                $('#myModal').on('hidden.bs.modal', function(e) {
                    obj.val("");
                })
                break;
            case inAmount < 50000:
                alertWindow("提示信息", "可申请额度不能小于￥50,000.00元");
                submitFlag = null;
                $(this).select();
                $('#myModal').on('hidden.bs.modal', function(e) {
                    obj.val("");
                })
                break;
            case inAmount > 30000000:
                alertWindow("提示信息", "可申请额度不能小于￥30,000,000.00元");
                submitFlag = null;
                $(this).select();
                $('#myModal').on('hidden.bs.modal', function(e) {
                    obj.val("");
                })
                break;
            default:
                $(this).val(fmoney(inAmount, 2));
        }
    });
});
//输入金额必须是数字
function checkNumber(num) {
    var reg = /^[0-9]+(.[0-9]{2})?$/;
    if (reg.test(num)) {
        return true;
    } else {
        return false;
    };
}
//遍历json对象
function eachJson(data) {
    $.each(data, function(index, ele) {
        console.log(index + ":" + ele);
    });
}
//生成贷款信息
function createSwitchTxt(data, i) {
    var dom = '<p class="pull-left addPCs" data-mes="' + i + '">' +
        "期限：" + data.repayTypeName + "<br/>" +
        "方式：" + data.loanTypeName + "<br/>" +
        "计息方式：" + data.interestModeName + "<br/>" +
        "利率：" + data.rate + "%" + "<br/>" +
        "</p>";
    return dom;
};
//格式化金额  
//优化负数格式化问题  
function fmoney(num, digit) {
    digit = digit > 0 && digit <= 20 ? digit : 2;
    f = num < 0 ? "-" : ""; //判断是否为负数  
    num = parseFloat((Math.abs(num) + "").replace(/[^\d\.-]/g, "")).toFixed(digit) + ""; //取绝对值处理, 更改这里n数也可确定要保留的小数位  
    var l = num.split(".")[0].split("").reverse(),
        r = num.split(".")[1];
    t = "";
    for (i = 0; i < l.length; i++) {
        t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
    }
    return f + t.split("").reverse().join("") + "." + r.substring(0, 2); //保留2位小数  如果要改动 把substring 最后一位数改动就可  
}
//弹出窗口
function alertWindow(title, msg, href) {
    $("#myModalBody").text(msg);
    $("#myModalLabel").text(title);
    $('#myModal').modal('show');
    if (href) {
        $('#myModal').on('hidden.bs.modal', function(e) {
            location.href = href;
        })
    };
}
//ajax调用提示信息
function ajasMsgDom(prevObj, targetObj) {
    prevObj.append(targetObj);
}
//移去内容
function removeObj(obj) {
    return obj.detach();
}