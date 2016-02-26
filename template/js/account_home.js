$(function() {
    var fomatAmount = null, //格式化可贷额度
        amountObj = $("#amount"), //可贷额度
        amount = cropName = mes = dom = tableData = listFlage = ajaxStartDom = null,
        userCode = $("#userCode"),
        appBtn = $("#applyBtn"),
        promiser = $.ajax({
            type: "get",
            url: "../../my_account/amount/" + userCode.text() + "/",
            dataType: "json",
            success: function(data) {
                cropName = data.data.cropName;
                amount = parseFloat(data.data.amount).toFixed(2);
                amountObj.text(amount);
            },
            error: function(XMLHttpRequest, b, c) {
                console.log(XMLHttpRequest.readyState + "\n" + b + "\n" + c);
            }
        });
    promiser.done(function() {
        var dom = null,
            domObj = $("#listTableId");
        formatAmount = "可贷额度：￥" + fmoney(amount, 2) + " 元";
        //额度为50000按钮不可用
        if (amount < 50000) {
            appBtn.removeClass("btn-danger").addClass("btn-default").attr("disabled", true);
        }
        $("#cropName").text(cropName);
        amountObj.text(formatAmount);
        $.ajax({
            type: "get",
            url: "../../my_account/loan_details/" + userCode.text() + "/",
            data: {
                userCode: userCode.text()
            },
            dataType: "json",
            beforeSend: function(XMLHttpRequest) {
                dom = removeObj(domObj.find("table"));
                ajasMsgDom(domObj, $("<span>例表数据加载中...</span>"));
            },
            success: function(data) {
                listFlage = data.recordsTotal;
                tableData = data.data;
                removeObj(domObj.find("span"));
                ajasMsgDom(domObj, dom);
            },
            error: function(XMLHttpRequest, b, c) {
                console.log(XMLHttpRequest.readyState + "\n" + b + "\n" + c);
            }
        }).done(function() {
            var dom = "";
            if (listFlage) {
                for (var i = tableData.length - 1, len = 0; i >= len; i--) {
                    dom += "<tr>" + createDom(tableData[i]) + "</tr>";
                };
                $("#tableBody").prepend(dom);
            } else {
                $("#tableBody").parent().text("无信息");
            }
        });
    });
    //点击融资申请
    appBtn.on("click", function(event) {
        event.preventDefault();
        if (amount == 0) {
            alertWindow("提示信息", "不可以贷");
        } else {
            location.href = "../../loan/apply_loan/";
        }
    });
    //启动申请按钮
    appBtn.attr("disabled", false);
});
//遍历json对象
function eachJson(data) {
    $.each(data, function(index, ele) {
        console.log(index + ":" + ele);
    });
}
//还款
function repayment(id, obj) {
    cancelBubble();
    $(obj).removeClass("btn-info").addClass("btn-default").attr("disabled", true);
    var dataObj = null,
        promiser = $.ajax({
            url: "../../api/load/check/repay/",
            data: {
                loanId: id
            },
            success: function(data) {
                dataObj = data;
            },
            error: function(a, b, c) {
                console.log(a.readyState + "\n" + b + "\n" + c);
            }
        });
    promiser.done(function() {
        var subDataObj = null;
        if (dataObj.code >= 0) {
            $.ajax({
                type: "post",
                url: "../../api/loan/repay/" + id + "/",
                success: function(data) {
                    subDataObj = data;
                }
            }).done(function() {
                alertWindow("提示信息", subDataObj.msg);
            });
        } else {
            alertWindow("提示信息", dataObj.msg);
        }
    });
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
};
//生成贷款例表
function createDom(data) {
    var dom = "<td class='text-center'>" + data.applyDate + "</td>" +
        "<td class='text-center'>" + data.contractNo + "</td>" +
        "<td class='text-right'>" + '￥' + fmoney(data.loanAmt, 2) + '元' + "</td>" +
        "<td class='text-center'>" + data.repayPeriod + "</td>" +
        "<td class='text-center'>" + data.loanType + "</td>" +
        "<td class='text-center'>" + data.rate + "%" + "</td>";
    switch (data.stat) {
        case "待审核":
            dom += '<td class="text-center"><span class="text-warning">' + data.stat + '</span></td>' +
                '<td><button type="button" class="btn btn-default btn-xm disabled">还款</button></td>';
            break;
        case "还款中":
            dom += "<td class='text-center'>" + data.stat + "</td>" +
                '<td><a href="#" onclick="repayment(' + data.id + ',this)" class="btn btn-info btn-xm">还款</a></td>';
            break;
        case "未通过":
            dom += "<td class='text-center'>" + data.stat + "</td>" +
                '<td><a href="#" onclick="repayment(' + data.id + ',this)" class="btn btn-default btn-xm disabled">还款</a></td>';
            break;
        case "已还款":
            dom += "<td class='text-center'>" + data.stat + "</td>" +
                '<td><a href="#" onclick="repayment(' + data.id + ',this)" class="btn btn-default btn-xm disabled">还款</a></td>';
            break;
        case "已逾期":
            dom += "<td class='text-center'>" + data.stat + "</td>" +
                '<td><a href="#" onclick="repayment(' + data.id + ',this)" class="btn btn-danger btn-xm">还款</a></td>';
            break;
        case "逾期结清":
            dom += "<td class='text-center'>" + data.stat + "</td>" +
                '<td><a href="#" onclick="repayment(' + data.id + ',this)" class="btn btn-default btn-xm disabled">还款</a></td>';
            break;
        default:
            dom += '<td class="text-center"><span class="text-danger">' + data.stat + '</span></td>' +
                "<td></td>";
    };
    return dom;
};
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
};
//得到事件
function getEvent() {
    if (window.event) {
        return window.event;
    }
    func = getEvent.caller;
    while (func != null) {
        var arg0 = func.arguments[0];
        if (arg0) {
            if ((arg0.constructor == Event || arg0.constructor == MouseEvent || arg0.constructor == KeyboardEvent) || (typeof(arg0) == "object" && arg0.preventDefault && arg0.stopPropagation)) {
                return arg0;
            }
        }
        func = func.caller;
    }
    return null;
};
//阻止冒泡
function cancelBubble() {
    var e = getEvent();
    if (window.event) {
        e.returnValue = false; //阻止自身行为
        e.cancelBubble = true; //阻止冒泡
    } else if (e.preventDefault) {
        e.preventDefault(); //阻止自身行为
        e.stopPropagation(); //阻止冒泡
    }
};
//ajax调用提示信息
function ajasMsgDom(prevObj, targetObj) {
    prevObj.append(targetObj);
}
//移去内容
function removeObj(obj) {
    return obj.detach();
}