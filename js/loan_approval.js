var Data = null,
  LOAN_STAT = DataJson.LOAN_STAT, //贷款状态
  LOAN_TYPE = DataJson.LOAN_TYPE, //贷款方式
  REPAY_PERIOD = DataJson.REPAY_PERIOD, //贷款期限
  applyNo = null; //放款ID
$(function() {
  var url = "../../api/loan_info/status/";
  //点击tab切换内容
  $('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
    var nowEle = e.target,
      nowTitle = $(nowEle).html(),
      urlSuffix = null,
      id = "";
    switch (nowTitle) {
      case "审核中":
        id = "apply";
        urlSuffix = url;
        ajaxData(id, nowEle, urlSuffix);
        break;
      case "已放款":
        id = "pass";
        urlSuffix = url;
        ajaxData(id, nowEle, urlSuffix);
        break;
      case "未通过":
        id = "nopass";
        urlSuffix = url;
        ajaxData(id, nowEle, urlSuffix);
        break;
      default:
        alertWindow("提示信息", "没有你想要信息...");
    };
  });
  //首次加载页面数据
  ajaxData("apply", null, url);
  //弹出窗口的确定按钮事件
  $("#modlCloseBtn").on("click", function() {
    var title = $("#myModalLabel").text();
    switch (title) {
      case "确定放款":
        passAjaxFun(applyNo);
        break;
      case "提交原因":
        $(this).addClass = "disabled";
        noPassAjaxFun(applyNo);
        break;
      default:
        break;
    };
  });
});

//ajax取数据
function ajaxData(id, ele, urlSuffix) {
  $("#" + id).find("table tbody").empty();
  var obj = null,
    promiser = $.ajax({
      type: "get",
      url: urlSuffix + id + "/",
      dataType: "json",
      beforeSend: function(XMLHttpRequest) {
        obj = removeObj($("#" + id).find("table"));
        ajasMsgDom($("#" + id), $("<p><img src='../../static/images/loading.gif'/> 数据加载中...</p>"));
      },
      success: function(data) {
        removeObj($("#" + id).find("p"));
        ajasMsgDom($("#" + id), obj);
      },
      error: function(XMLHttpRequest, b, c) {
        console.log(XMLHttpRequest.readyState + "\n" + b + "\n" + c);
      }
    });
  promiser.done(function(data) {
    $("#" + id).find("table tbody").empty(),
      Data = data.data;
    var len = data.data.length,
      tableData = data.data,
      tableDom = "";
    if (len) {
      for (var i = 0; i < len; i++) {
        tableDom += "<tr onclick='parentEvent(event,this)' data-num='" + i + "' data-applyNo='" + tableData[i].applyNo + "'>" + createDom(tableData[i], i + 1, id) + "</tr>";
      };
      $("#" + id).find("table tbody").prepend(tableDom);
    } else {
      $("#tableBody").parent().text("无信息");
    };
  });
};
//生成数据例表
function createDom(data, serNo, id) {
  console.info(data);
  var dom = "",
    applyDate = data.applyDate,
    contractNo = data.contractNo,
    userCode = data.owner.userCode,
    cropName = data.owner.cropName,
    taxId = data.owner.taxId,
    loanAmount = data.loanAmount,
    loanTerm = data.product.loanTerm,
    repayType = data.product.repayType,
    rate = data.rate,
    status = data.status;
  switch (id) {
    case "apply":
      dom = "<td class='text-center'>" + serNo + "</td>" +
        "<td class='text-center'>" + applyDate + "</td>" +
        "<td class='text-center'>" + contractNo + "</td>" +
        "<td class='text-center'>" + userCode + "</td>" +
        "<td class='text-center'>" + cropName + "</td>" +
        "<td class='text-center'>" + taxId + "</td>" +
        "<td class='text-right'>" + '￥' + loanAmount + "</td>" +
        "<td class='text-center'>" + REPAY_PERIOD[loanTerm] + "</td>" +
        "<td class='text-center'>" + LOAN_TYPE[repayType] + "</td>" +
        "<td class='text-center'>" + rate + "%" + "</td>" +
        "<td class='text-center'>" + '<a href="javascript:void(0)"><span class="glyphicon glyphicon-share"></span> 放款</a> | ' +
        '<a href="javascript:void(0)"><span class="glyphicon glyphicon-remove"></span> 不通过</a>' + "</td>";
      break;
    case "pass":
      var optDate = data.approvals.length == 0 ? "" : data.approvals[0].optDate;
      dom = "<td class='text-center'>" + serNo + "</td>" +
        "<td class='text-center'>" + applyDate + "</td>" +
        "<td class='text-center'>" + optDate + "</td>" +
        "<td class='text-center'>" + contractNo + "</td>" +
        "<td class='text-center'>" + userCode + "</td>" +
        "<td class='text-center'>" + cropName + "</td>" +
        "<td class='text-center'>" + taxId + "</td>" +
        "<td class='text-right'>" + '￥' + loanAmount + "</td>" +
        "<td class='text-center'>" + REPAY_PERIOD[loanTerm] + "</td>" +
        "<td class='text-center'>" + LOAN_TYPE[repayType] + "</td>" +
        "<td class='text-center'>" + rate + "%" + "</td>" +
        "<td class='text-center'>" + data.loanTerm.endDate + "</td>" +
        "<td class='text-center'>" + LOAN_STAT[status] + "</td>";
      break;
    case "nopass":
      var optDate = data.approvals.length == 0 ? "" : data.approvals[0].optDate,
        optReason = data.approvals.length == 0 ? "" : data.approvals[0].optReason;
      dom = "<td class='text-center'>" + serNo + "</td>" +
        "<td class='text-center'>" + applyDate + "</td>" +
        "<td class='text-center'>" + optDate + "</td>" +
        "<td class='text-center'>" + contractNo + "</td>" +
        "<td class='text-center'>" + userCode + "</td>" +
        "<td class='text-center'>" + cropName + "</td>" +
        "<td class='text-center'>" + taxId + "</td>" +
        "<td class='text-right'>" + '￥' + loanAmount + "</td>" +
        "<td class='text-center'>" + REPAY_PERIOD[loanTerm] + "</td>" +
        "<td class='text-center'>" + LOAN_TYPE[repayType] + "</td>" +
        "<td class='text-center'>" + rate + "%" + "</td>" +
        "<td class='text-center'>" + optReason + "</td>";
      break;
    default:
      alertWindow("提示信息", "数据出错...");
  }
  return dom;
};
//ajax调用提示信息
function ajasMsgDom(prevObj, targetObj) {
  prevObj.append(targetObj);
};
// 移去内容
function removeObj(obj) {
  return obj.detach();
};
//通过提示
function applyFun(num) {
  alertWindow("myModal", "myModalLabel", "myModalBody", "确定放款", createWinData(Data[num]));
};
//不通过提示
function onPassFun() {
  var dom = '<textarea class="form-control" id="textId" rows="3" placeholder="输入不通过信息..."></textarea>';
  alertWindow("myModal", "myModalLabel", "myModalBody", "提交原因", dom);
}
//生成弹出详细信息窗口
function createWinData(data) {
  var dom = '<div class="row addWinListCs">' +
    '<div class="col-xs-3 text-right">公司名称：</div>' +
    '<div class="col-xs-9">' + data.owner.cropName + '</div>' +
    '</div>' +
    '<div class="row addWinListCs">' +
    '<div class="col-xs-3 text-right">申请时间：</div>' +
    '<div class="col-xs-9">' + data.applyDate + '</div>' +
    '</div>' +
    '<div class="row addWinListCs">' +
    '<div class="col-xs-3 text-right">申请金额：</div>' +
    '<div class="col-xs-9"> ￥' + data.loanAmount + '</div>' +
    '</div>' +
    '<div class="row addWinListCs">' +
    '<div class="col-xs-3 text-right">贷款方式：</div>' +
    '<div class="col-xs-9">' + LOAN_TYPE[data.product.repayType] + '</div>' +
    '</div>' +
    '<div class="row addWinListCs">' +
    '<div class="col-xs-3 text-right">贷款期限：</div>' +
    '<div class="col-xs-9">' + REPAY_PERIOD[data.product.loanTerm] + '</div>' +
    '</div>' +
    '<div class="row addWinListCs">' +
    '<div class="col-xs-3 text-right">利率：</div>' +
    '<div class="col-xs-9">' + data.rate + "%" + '</div>' +
    '</div>';
  return dom;
};
//放款ajax数据
function passAjaxFun(applyNo) {
  var promiser = $.ajax({
    type: "post",
    url: "../../api/loan_approval/" + applyNo + "/pass/",
    beforeSend: function() {
      $("#modlCloseBtn").addClass("disabled");
    },
    error: function(a, b, c) {
      console.info(a.status + "\n" + b + "\n" + c);
    }
  });
  promiser.done(function(data) {
    $("#modlCloseBtn").removeClass("disabled");
    $('#myModal').modal('hide');
    var msg = null;
    if (data.code == 0) {
      msg = "放款成功...";
      ajaxData("apply", null, "../../api/loan_info/status/");
    } else {
      msg = data.msg;
    };
    hideWinMes("myModalMsg", "myModalLabelMsg", "myModalBodyMsg", "提示信息", msg);
  });
};
//不通过ajax数据
function noPassAjaxFun(applyNo) {
  var textMsg = $("#textId").val(),
    promiser = $.ajax({
      type: "post",
      url: "../../api/loan_approval/" + applyNo + "/nopass/",
      data: "reason=" + textMsg,
      error: function(a, b, c) {
        console.info(a.status + "\n" + b + "\n" + c);
      }
    });
  promiser.done(function(data) {
    $('#myModal').modal('hide');
    var msg = null;
    if (data.msg == "success") {
      msg = "提交成功...";
      ajaxData("apply", null, "../../api/loan_info/status/");
    } else {
      msg = "出错...";
    };
    hideWinMes("myModalMsg", "myModalLabelMsg", "myModalBodyMsg", "提示信息", msg);
  });
};
//父亲对象事件
function parentEvent(e, obj) {
  var nowObj = $(e.target),
    title = nowObj.text(),
    itemNum = $(obj).attr("data-num"); //例表序号
  applyNo = $(obj).attr("data-applyNo"); //放款号
  switch (title) {
    case " 放款":
      applyFun(itemNum);
      break;
    case " 不通过":
      onPassFun();
      break;
    default:
      break;
  };
};
//弹出窗口
function alertWindow(id, idLable, idBody, title, msg) {
  $("#" + idBody).html(msg);
  $("#" + idLable).text(title);
  $("#" + id).modal('show');
};
//沿缓显示
function hideWinMes(id, idLabel, idBodyMsg, title, msg) {
  setTimeout(function() {
    alertWindow(id, idLabel, idBodyMsg, title, msg);
  }, 600);
}