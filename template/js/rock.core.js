//CSRF enabled
$(function () {
    var token = $("meta[name='_csrf']").attr("content");
    var header = $("meta[name='_csrf_header']").attr("content");
    $(document).ajaxSend(function (e, xhr, options) {
        xhr.setRequestHeader(header, token);
    });
});

//force requested pages not to be cached by the browser
$(function () {
    $.ajaxSetup({
        cache: false,
        dataType: "json"
    });
});

//logout
$(function () {
    $("a#logout").click(function () {
        var contextUrl = $("meta[name='_context_url']").attr("content");
        $.ajax({
            type: 'POST',
            url: contextUrl + '/logout/'
        }).always(function (d) {
            window.location.reload(true);
        });
    });
});

//Enable switch
$(function () {
    if ($(".switch").length > 0) {
        $(".switch").bootstrapSwitch();
    }
    ;
});

//Datetime Picker
$(function () {
    if ($(".pick_datetime").length > 0) {
        $('.pick_datetime').datetimepicker({
            language: 'zh-CN',
            weekStart: 1,
            autoclose: true,
            todayBtn: true,
            todayHighlight: true,
            showMeridian: true
        });
    }
    ;
    if ($(".pick_date").length > 0) {
        $('.pick_date').datetimepicker({
            language: 'zh-CN',
            weekStart: 1,
            autoclose: true,
            todayBtn: true,
            todayHighlight: true,
            startView: 2,
            minView: 2
        });
    }
    ;
    if ($(".pick_time").length > 0) {
        $('.pick_time').datetimepicker({
            language: 'zh-CN',
            weekStart: 1,
            autoclose: true,
            todayBtn: true,
            todayHighlight: true,
            startView: 1,
            minView: 0,
            maxView: 1,
            forceParse: false
        });
    }
    ;
});

//sys-alert
function sysAlert(type, title, body) {
    $('#sys-alert-title').text(title);
    $('#sys-alert-body').text(body);

    var c = '';
    if (type == 'success') {
        c = 'alert-success';
    } else if (type == 'info') {
        c = 'alert-info';
    } else if (type == 'warning') {
        c = 'alert-warning';
    } else if (type == 'error') {
        c = 'alert-danger';
    }
    $(".sys-alert-message").addClass(c).removeClass('hidden').removeClass('hidden');
    setTimeout(function () {
        $(".sys-alert-message").addClass('hidden').removeClass(c);
    }, 4000);
};

//check required input
function checkRequired(div) {
    var clean = true;
    var count = 0;
    $(div).find('input[data-required=true]').each(function () {
        if ($(this).val().trim() == '') {
            clean = false;
            count++;
        }
        ;
    });
    $(div).find('textarea[data-required=true]').each(function () {
        if ($(this).val().trim() == '') {
            clean = false;
            count++;
        }
        ;
    });

    if (!clean) {
        sysAlert('error', '错误！', '有' + count + '项必填项没有内容，请检查。');
    }
    ;

    return clean;
};

//将表单数据转为Object。用法：getFormJson($('any selector'))
function getFormJson(formObj) {
    var a = formObj.serializeArray();
    var o = {};
    $.each(a, function () {
        if (o[this.name]) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

$(function () {
    if (jQuery.fn.dataTableExt != null) {
        //oSort 是排序类型数组, 'chinese-asc' 是自己定义的类型的排序(*-asc || *-desc)名称.
        //插件应该会根据表格中的内容的类型(string, number, chinese :) )，
        //比如: chinese类型的用 oSort['chinese-asc'] 方法进行比较排序。所以下面定义类型的时候要和这里对上。
        //用oSort对应的function 来进行比较排序.
        //所以，function 里是自定义的比较方法.
        jQuery.extend(jQuery.fn.dataTableExt.oSort, {
            "chinese-asc": function (s1, s2) {
                if (s1 != null) {
                    return s1.localeCompare(s2);
                } else {
                    return -1;
                }
                ;
            },
            "chinese-desc": function (s1, s2) {
                if (s2 != null) {
                    return s2.localeCompare(s1);
                } else {
                    return 1;
                }
                ;
            }
        });
    }
    ;
});

function bindEnterHandler($element, $function) {
    $element.keydown(function (event) {
        if (event.keyCode === 13) {
            $function.call();
        }
    });
};