var INTEREST_MODE = DataJson.INTEREST_MODE, //计息方式
  LOAN_TYPE = DataJson.LOAN_TYPE, //贷款方式
  REPAY_PERIOD = DataJson.REPAY_PERIOD; //贷款期限
$(function() {
  var submitBtnObj = $("#submitBtn"), //提交按钮对象
    loanBtnObj = $("#loanBtnGroup"), //贷款选项对象
    userCode = $("#userCode"), //用户代码对象
    loanAmtObj = $("#loanAmt"), //金额输入框对象
    amount = null, //贷款金额
    submitFlag = null, //提交状态
    initialValue = null, //返格式化回的数据
    switchTxtArr = null, //贷款方式数组对象
    nowItemObj = 0; // 当前选择的贷款方式
  promiser = $.ajax({
    type: "get",
    url: "../../api/loan/detail/" + userCode.text() + "/",
    dataType: "json",
    beforeSend: function(XMLHttpRequest) {
      ajasMsgDom(loanBtnObj, $("<span><img src='../../static/images/loading.gif'/> 数据加载中...</span>"));
    },
    error: function(XMLHttpRequest, b, c) {
      console.log(XMLHttpRequest.readyState + "\n" + b + "\n" + c);
    }
  });
  promiser.done(function(data) {
    console.info(data.data);
    var listDom = "";
    switchTxtArr = data.data.curLimits;
    amount = data.data.limit; //贷款金额
    removeObj(loanBtnObj.find("span"));
    //格式化金额输出到页面上
    $("#amount").text("￥ " + fmoney(amount, 2) + " 元");
    //循环贷款选项
    for (var i = 0, len = switchTxtArr.length; i < len; i++) {
      listDom += createSwitchTxt(switchTxtArr[i], i);
    };
    //将选项添加到页面
    loanBtnObj.append(listDom);
    //默认显示第一个
    loanBtnObj.find("p").eq(0).addClass("addSwitchBg");
    //切换还款方式
    loanBtnObj.find("p").on(
      "click",
      function() {
        //当前选择的第几项还款方式
        nowItemObj = parseInt($(this).attr("data-mes"));
        $(this).attr("class", "pull-left addPCs addSwitchBg")
          .siblings().attr("class", "pull-left addPCs");
      });
  });
  //回车事件
  loanAmtObj.keydown(function(e) {
    var e = e || event,
      keycode = e.which || e.keyCode;
    if (keycode == 13) {
      cancelBubble();
      submitBtnObj.click();
      return false;
    }
  });
  //输入框验证信息
  loanAmtObj.on("change", function() {
    var inAmount = parseFloat($(this).val().replace(/,/g, "")), //格式转化成数字保留小数点
      obj = $(this);
    initialValue = inAmount;
    submitFlag = checkNumber(inAmount);
    switch (true) {
      case !submitFlag:
        alertWindow("提示信息", "输入的金额不正确...");
        submitFlag = false;
        clearTxt(obj);
        break;
      case inAmount > amount:
        alertWindow("提示信息", "输入的金额超过可贷额度...");
        submitFlag = false;
        clearTxt(obj);
        break;
      case inAmount < 50000:
        alertWindow("提示信息", "可申请额度不能小于￥50,000.00元");
        submitFlag = false;
        clearTxt(obj);
        break;
      case inAmount > 30000000:
        alertWindow("提示信息", "可申请额度不能大于￥30,000,000.00元");
        submitFlag = false;
        clearTxt(obj);
        break;
      default:
        $(this).val(fmoney(inAmount, 2));
    }
  });
  // 提交按钮
  submitBtnObj.click(function() {
    loanAmtObj.change();
    if (!submitFlag) {
      alertWindow('提示信息', "请输入正确金额...");
      clearTxt(loanAmtObj);
    } else {
      promiser = $.ajax({
        url: "../../api/loan/check/amount/",
        data: {
          userCode: userCode.text(),
          loanAmount: parseFloat(initialValue)
        },
        success: function(data) {
          console.info(data);
        },
        error: function(a, b, c) {
          console.log(a + ":" + b + ":" + c);
        }
      });
      promiser.done(function(data) {
        alert(data.msg + "\n" + data.code);
        if (data.code == 0) {
          $("#l_userCode").val(userCode.text()); // 用户
          $("#l_prodSubCode")
            .val(switchTxtArr[nowItemObj].subPrdCode); //
          $("#amountEntered").val(parseFloat(initialValue)); //
          $("#J_form").attr("action", "../../contract/contract_2/"); //
          $("#J_form").submit(); //
        } else {
          alertWindow("提示信息", data.msg);
        };
      });
    };
  });
});
// 输入金额必须是数字
function checkNumber(num) {
  var reg = /^[0-9]+(.[0-9]{1,4})?$/; //判断数字，１到４位小数
  if (reg.test(num)) {
    return true;
  } else {
    return false;
  };
}
// 遍历json对象
function eachJson(data) {
  $.each(data, function(index, ele) {
    console.log(index + ":" + ele);
  });
}
// 生成贷款信息
function createSwitchTxt(data, i) {
  var dom = '<p class="pull-left addPCs" data-mes="' + i + '">' + "期限：" + REPAY_PERIOD[data.product.loanTerm] + "<br/>" + "方式：" + LOAN_TYPE[data.product.repayType] + "<br/>" + "计息方式：" + INTEREST_MODE[data.product.interestMode] + "<br/>" + "年化利率：" + data.rate + "%" + "<br/>" + "</p>";
  return dom;
};
// 格式化金额
// 优化负数格式化问题
function fmoney(num, digit) {
  var i = null,
    t = "",
    f = null,
    l = null;
  digit = digit > 0 && digit <= 20 ? digit : 2;
  f = num < 0 ? "-" : ""; // 判断是否为负数
  num = parseFloat((Math.abs(num) + "").replace(/[^\d\.-]/g, "")).toFixed(
    digit) + ""; // 取绝对值处理, 更改这里n数也可确定要保留的小数位
  l = num.split(".")[0].split("").reverse(),
    r = num.split(".")[1];
  t = "";
  for (i = 0; i < l.length; i++) {
    t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
  }
  return f + t.split("").reverse().join("") + "." + r.substring(0, 2); // 保留2位小数
  // 如果要改动
  // 把substring
  // 最后一位数改动就可
};
// 弹出窗口
function alertWindow(title, msg, href) {
  $("#myModalBody").text(msg);
  $("#myModalLabel").text(title);
  $('#myModal').modal('show');
  if (href) {
    $('#myModal').on('hidden.bs.modal', function(e) {
      self.location.href = href;
    });
  };
};
// ajax调用提示信息
function ajasMsgDom(prevObj, targetObj) {
  prevObj.append(targetObj);
};
// 移去内容
function removeObj(obj) {
  return obj.detach();
};
//出错信息取消后清除输入框文字内容
function clearTxt(obj) {
  $('#myModal').on('hidden.bs.modal', function(e) {
    obj.val("");
  });
};
//
//得到事件
function getEvent() {
  if (window.event) {
    return window.event;
  };
  var func = getEvent.caller;
  while (func != null) {
    var arg0 = func.arguments[0];
    if (arg0) {
      if ((arg0.constructor == Event || arg0.constructor == MouseEvent || arg0.constructor == KeyboardEvent) || (typeof(arg0) == "object" && arg0.preventDefault && arg0.stopPropagation)) {
        return arg0;
      };
    };
    func = func.caller;
  };
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
  };
};