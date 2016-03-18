var Data = null,
  LOAN_STAT = DataJson.LOAN_STAT, //贷款状态
  LOAN_TYPE = DataJson.LOAN_TYPE, //贷款方式
  REPAY_PERIOD = DataJson.REPAY_PERIOD; //贷款期限
$(function() {
  var amountObj = $("#amount"), //可贷额度对象
    amount = null, //可贷额度
    userCode = $("#userCode"), //userCode存储对象
    contractObj = $("#contractList"), //合同页面部分
    appBtn = $("#applyBtn"), //申请贷款对象
    promiser = $.ajax({
      type: "get",
      url: "../../my_account/amount/" + userCode.text() + "/",
      dataType: "json",
      error: function(XMLHttpRequest, b, c) {
        console.log(XMLHttpRequest.readyState + "\n" + b + "\n" + c);
      }
    });
  promiser.done(function(data) {
    contractObj.empty();
    prependDom(contractObj, contractData(contractObj, data.data));
    var cropName = data.data.cropName,
      dom = null,
      formatAmount = null,
      domObj = $("#listTableId");
    //全局金额
    amount = parseFloat(data.data.limit).toFixed(2);
    //企业名称
    $("#cropName").text(cropName);
    //格式化
    formatAmount = "可贷额度：￥" + fmoney(amount, 2) + " 元";
    //格式化金融显示
    amountObj.text(formatAmount);
    //额度为50000按钮不可用
    if (amount < 50000) {
      appBtn.removeClass("btn-danger").addClass("btn-default").attr("disabled", true);
    };
    var listFlage = data.data.loanContracts.length,
      tableData = data.data.loanContracts,
      tableDom = "";
    removeObj(domObj.find("span"));
    ajasMsgDom(domObj, dom);
    if (listFlage) {
      for (var i = 0, len = tableData.length; i < len; i++) {
        tableDom += "<tr>" + createDom(tableData[i]) + "</tr>";
      };
      prependDom($("#tableBody"), tableDom);
    } else {
      $("#tableBody").parent().text("无信息");
      $("#contractList").parent().text("无信息");
    };
  });
  //点击融资申请
  appBtn.on("click", function() {
    cancelBubble();
    if (amount < 50000) {
      alertWindow("提示信息", "不可以贷");
    } else {
      location.href = "../../loan/apply_loan/";
    };
  });
  //启动申请按钮
  appBtn.attr("disabled", false);
});
//还款
function repayment(id, obj) {
  cancelBubble();
  $(obj).removeClass("btn-info").addClass("btn-default").attr("disabled", true);
  var promiser = $.ajax({
    url: "../../api/loan/check/repay/",
    data: {
      loanId: id
    },
    error: function(a, b, c) {
      console.log(a.readyState + "\n" + b + "\n" + c);
    }
  });
  promiser.done(function(data) {
    if (data.code >= 0) {
      $.ajax({
        type: "post",
        url: "../../api/loan/repay/" + id + "/",
        error: function(a, b, c) {
          console.log(a.readyState + "\n" + b + "\n" + c);
        }
      }).done(function(data) {
        alertWindow("提示信息", data.msg);
      });
    } else {
      alertWindow("提示信息", data.msg);
    };
  });
};
//优化负数格式化问题  
function fmoney(num, digit) {
  var f = null,
    t = "",
    r = null,
    l = null,
    i = null;
  digit = digit > 0 && digit <= 20 ? digit : 2;
  f = num < 0 ? "-" : ""; //判断是否为负数
  num = parseFloat((Math.abs(num) + "").replace(/[^\d\.-]/g, "")).toFixed(
    digit) + ""; //取绝对值处理, 更改这里n数也可确定要保留的小数位
  l = num.split(".")[0].split("").reverse(),
    r = num.split(".")[1];
  for (i = 0; i < l.length; i++) {
    t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
  };
  return f + t.split("").reverse().join("") + "." + r.substring(0, 2); //保留2位小数  如果要改动 把substring 最后一位数改动就可
};

//生成贷款例表
function createDom(data) {

  //表格项
  var dom = "<td class='text-center'>" + data.applyDate +
    "</td>" + "<td class='text-center'>" + data.contractNo + "</td>" +
    "<td class='text-right'>" + '￥' + data.loanAmount + '元' + "</td>" +
    "<td class='text-center'>" + REPAY_PERIOD[data.product.loanTerm] + "</td>" +
    "<td class='text-center'>" + LOAN_TYPE[data.product.repayType] + "</td>" +
    "<td class='text-center'>" + data.rate + "%" + "</td>";

  //操作项
  switch (data.status) {
    case "0":
      dom += '<td class="text-center"><span class="text-warning">' + LOAN_STAT[data.status] + '</span></td>' + '<td><button type="button" class="btn btn-default btn-xm disabled">还款</button></td>';
      break;
    case "2":
      dom += "<td class='text-center'>" + LOAN_STAT[data.status] + "</td>" + '<td><a href="#" onclick="repayment(\'' + data.applyNo + '\',this)" class="btn btn-info btn-xm">还款</a></td>';;
      break;
    case "6":
      dom += "<td class='text-center'>" + LOAN_STAT[data.status] + "</td>" + '<td><a href="#" onclick="repayment(\'' + data.applyNo + '\',this)" class="btn btn-info btn-xm">还款</a></td>';
      break;
    case "1":
      dom += "<td class='text-center'>" + LOAN_STAT[data.status] + "</td>" + '<td><a href="#" onclick="repayment(\'' + data.applyNo + '\',this)" class="btn btn-default btn-xm disabled">还款</a></td>';
      break;
    case "3":
      dom += "<td class='text-center'>" + LOAN_STAT[data.status] + "</td>" + '<td><a href="#" onclick="repayment(\'' + data.applyNo + '\',this)" class="btn btn-default btn-xm disabled">还款</a></td>';
      break;
    case "4":
      dom += "<td class='text-center'>" + LOAN_STAT[data.status] + "</td>" + '<td><a href="#" onclick="repayment(\'' + data.applyNo + '\',this)" class="btn btn-danger btn-xm">还款</a></td>';
      break;
    case "5":
      dom += "<td class='text-center'>" + LOAN_STAT[data.status] + "</td>" + '<td><a href="#" onclick="repayment(\'' + data.applyNo + '\',this)" class="btn btn-default btn-xm disabled">还款</a></td>';
      break;
    default:
      dom += '<td class="text-center"><span class="text-danger">' + LOAN_STAT[data.status] + '</span></td>' + "<td></td>";
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
    });
  };
};
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
//生成Dom信息
function prependDom(prevObj, targetObj) {
  prevObj.prepend(targetObj);
}
//生成提示信息
function ajasMsgDom(prevObj, targetObj) {
  prevObj.append(targetObj);
}
//移去Dom内容
function removeObj(obj) {
  return obj.detach();
}
//创建
function contractData(contractObj, data) {
  var creditStartDate = data.credit ? data.credit.term.startDate : "无信息",
    creditEndDate = data.credit ? data.credit.term.endDate : "无信息",
    creditContractNo = data.credit ? data.credit.contractNo : "无信息",
    pledgeStartDate = data.pledge ? data.pledge.term.startDate : "无信息",
    pledgeEndDate = data.pledge ? data.pledge.term.endDate : "无信息",
    pledgeContractNo = data.pledge ? data.pledge.contractNo : "无信息",
    dom = '<tr>' +
    '<td align="center">授信合同</td>' +
    '<td align="center">' + creditStartDate + '</td>' +
    '<td align="center">' + creditEndDate + '</td>' +
    '<td align="center">' + creditContractNo + '</td>' +
    '<td align="center"><a href="#">下载</a></td>' +
    '</tr>' +
    '<tr>' +
    '<td align="center">质押合同</td>' +
    '<td align="center">' + pledgeStartDate + '</td>' +
    '<td align="center">' + pledgeEndDate + '</td>' +
    '<td align="center">' + pledgeContractNo + '</td>' +
    '<td align="center"><a href="#">下载</a></td>' +
    '</tr>';
  return dom;
}