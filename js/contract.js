$(function() {
  var obj = $("#dataMsg span"),
    objData = {
      userCode: $(obj[0]).text(), //用户代码
      prodSubCode: $(obj[1]).text(), //子产品代码
      loanAmt: parseFloat($(obj[2]).text().replace(/,/g, "")), //贷款金额
      loanContract: $(obj[3]).text(), //借款合同号
      creditContract: $(obj[4]).text(), //综合授信合同号
      limitContract: $(obj[5]).text() //最高限额质押合同号
    }; //页面数据提取
  heightFun($(".addWordCs")); //中间内容高度
  $("#submitBtn").on("click", function() {
    var promiser = $.ajax({
      type: "post",
      url: "../../api/loan/apply/",
      data: {
        userCode: objData.userCode,
        prodSubCode: objData.prodSubCode,
        loanAmt: objData.loanAmt,
        loanContract: objData.loanContract,
        creditContract: objData.creditContract,
        limitContract: objData.limitContract,
        token: $("#token").val()
      },
      dataType: "json",
      error: function(a, b, c) {
        console.log(a + "\n" + b + "\n" + c + "\n");
      }
    });
    promiser.done(function(data) {
      alertWindow('提示信息', data.msg, "../../my_account/" + objData.userCode + "/");
    });
  });
});
//弹出窗口
function alertWindow(title, msg, href) {
  $("#myModalBody").text(msg);
  $("#myModalLabel").text(title);
  $('#myModal').modal('show');
  if (href) {
    $('#myModal').on('hidden.bs.modal', function(e) {
      window.location.href = href;
    });
  };
};
//高度
function heightFun(obj) {
  $(obj).each(function(index, ele) {
    console.log(ele);
    $(ele).height($(window).height() - 350);
  });
}