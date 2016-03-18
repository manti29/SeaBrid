$(function() {
  var subBtn = $("#submitBtn"),
    form = $("#subFom"),
    repayAmount = $("#repayAmount"),
    applyNo = $("#applyNo"),
    webDataItem = $("#webDataItem span"),
    userCode = webDataItem.eq(0).text(), //用户号
    totalRepayAmount = webDataItem.eq(2).text(), //总金额
    minRepayAmount = webDataItem.eq(3).text(); //最低还款金额
  $(".tooltip").css("z-index", 0);
  //回车事件
  repayAmount.keydown(function(e) {
    var e = e || event,
      keycode = e.which || e.keyCode;
    if (keycode == 13) {
      subBtn.click();
      return false;
    }
  });
  subBtn.on("click", function() {
    repayAmount.change();
    $.ajax({
      type: "post",
      url: "../../../api/loan/repay/",
      data: {
        "applyNo": applyNo.val(),
        "repayAmount": repayAmount.val()
      },
      error: function(a, b, c) {
        console.log(a.readyState + "\n" + b + "\n" + c);
      }
    }).done(function(data) {
      console.info(data);
      if (data.code == 0) {
        location.href = "../../../api/loan/repay/" + userCode + '/';
      } else {
        alertWindow("提示信息", data.msg);
      }
    });
  });
  //输入框验证信息
  repayAmount.on("change", function() {
    var obj = $(this),
      num = parseFloat(obj),
      submitFlag = checkNumber(num);
    switch (true) {
      case !submitFlag:
        alertWindow("提示信息", "输入的金额不正确...");
        clearTxt(obj);
        break;
      case num == 0:
        alertWindow("提示信息", "还款式金额不能为0");
        clearTxt(obj);
        break;
      case num > totalRepayAmount:
        alertWindow("提示信息", "输入的金额超过未还总金额...");
        clearTxt(obj);
        break;
      case inAmount < minRepayAmount:
        alertWindow("提示信息", "可申请额度不能小于最低还款金额");
        clearTxt(obj);
        break;
      default:
        break;
    }
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
};
//弹出窗口
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
//出错信息取消后清除输入框文字内容
function clearTxt(obj) {
  $('#myModal').on('hidden.bs.modal', function(e) {
    obj.val("");
  });
};