// openid	是	string	用户openid
let openid = $_GET['openid']
let dealerid = $_GET['dealerid']
// cartids	是	string	购物车id (1,2,3)
let cartids = ''
// optionid	是	string	规格id （1,2,3）
let optionid = ''
// cartnum	是	string	商品数量 （1,2,3）
let c = []
let cartnum = ''
let isnow = $_GET['isnow'] || false
let goods = $_GET['goods'] || ''
// 时间戳
let temp_ordersn = ''


//  倒计时 
var countdown = 60;
var isSendSms = false;
var timer = null;
// paytype
let paytype = 'wechat'

let ajaxTimer = null

let istype = $_GET['istype'] || 'cart'

let realprice = storage.getItem('realprice')

// 商品原价
let price1 = 0
// 商品实付价格
let price2 = storage.getItem('realprice')
// 优惠价
let price3 = 0

let discount_type = storage.getItem('discount_type')
let changegoodsprice = storage.getItem('changegoodsprice')


$(function () {

    // console.log(goods)
    c = JSON.parse(decodeURI(goods))
    console.log(c)
    // return
    // c = getCart()
    console.log(c)
    $.each(c, function (i, e) {
        // console.log(e)
        cartids += `${e.id},`
        optionid += `${e.suk},`
        cartnum += `${e.number},`
    })
    cartids = cartids.substr(0, cartids.length - 1);
    optionid = optionid.substr(0, optionid.length - 1);
    cartnum = cartnum.substr(0, cartnum.length - 1);
    // console.log(`cartids: ${cartids}`)
    // console.log(`optionid: ${optionid}`)
    // console.log(`cartnum: ${cartnum}`)
    getData()


})


function ajax_check_order_pay() {
    ajaxTimer = setInterval(function () {
        $.ajax({
            type: "POST",
            url: `${baseUrl}api.create.ajax_check_order_pay`,
            dataType: "json",
            data: {
                openid,
                dealerid,
                temp_ordersn
            },
            async: true,
            success: function (data) {
                console.log(data);

                if (data.result.pay_status == '1') {
                    let ok = `
                    <i class="fa fa-check-circle"></i>
                        支付成功
                    `
                    $('.order .qrcode .bg .title').html(ok)
                    clearInterval(ajaxTimer)
                    ajaxTimer = null
                    swal({
                        title: "提示",
                        text: "支付成功，返回首页",
                        icon: "success",

                    }).then((e) => {
                        clearCart()
                        appHome()
                    })
                }


            }, error: function (a, s, d) {
                console.log(a)
                console.log(s)
                console.log(d)
            }
        })
    }, 1000)

}


function getData() {
    console.log({
        openid,
        dealerid,
        cartids,
        optionid,
        cartnum
    })
    $.ajax({
        type: "POST",
        url: `${baseUrl}api.cart.get_cart`,
        dataType: "json",
        data: {
            openid,
            dealerid,
            cartids,
            optionid,
            cartnum,
            temp_ordersn
        },
        async: true,
        success: function (data) {
            console.log(data);
            if (data.code == 200) {
                
                let str = ''
                $.each(data.data.list, function (i1, e1) {
                    $.each(e1.list, function (i2, e2) {
                        // console.log(e2)
                        price1+=Number(e2.marketprice) * Number(e2.total)
                        str += `
                        <div class="mui-row row">
                        <div class="mui-col-sm-5">
                            <div class="desc descGoods">
                                <div class="icon"
                                    style="background:url(${e2.thumb}) no-repeat center;background-size: 110% auto;">
                                </div>
                                <div class="info">
                                    ${e2.title}
                                </div>
                                <div class="type" ${e2.optiontitle.length > 0 ? '' : 'hidden '}>规格：${e2.optiontitle}</div>
                            </div>
                        </div>
                        <div class="mui-col-sm-2">
                            <div class="desc sprice">
                                <div class="bg">￥<text>${e2.marketprice}</text></div>
                            </div>
                        </div>
                        <div class="mui-col-sm-1">
					<div class="desc number">
						<div class="bg">
							x${e2.total}
						</div>
					</div>
				    </div>
                    <div class="mui-col-sm-2">
                        <div class="desc">
                            <div class="bg">
                                
                            </div>
                        </div>
                    </div>
                        <div class="mui-col-sm-2">
                            <div class="desc price">
                                <div class="bg">￥${Number(e2.marketprice) * Number(e2.total)}</div>
                            </div>
                        </div>
                    </div>
                        `
                    })
                })
                price3 = (price1 - price2).toFixed(2)
                $('.price1 b').text(price1) 
                $('.price2 b').text(price2) 
                $('.price3 b').text(price3) 

                $('.order .list').html(str)
                $('#loading').fadeOut(500)
            }
        }
    })
}

function zhifu(type) {
    temp_ordersn = String(dealerid) + String(Date.parse(new Date()))
    console.log({
        openid,
        dealerid,
        cartids,
        optionid,
        cartnum,
        type,
        mobile: $('#mobileNum').val(),
        verifycode: $('#codeNum').val(),
        temp_ordersn,
        paytype,
        istype,
        realprice,
        changeprice:price3
    })
    $.ajax({
        type: "POST",
        url: `${baseUrl}api.create.operating`,
        dataType: "json",
        data: {
            openid,
            dealerid,
            cartids,
            optionid,
            cartnum,
            type,
            mobile: $('#mobileNum').val(),
            verifycode: $('#codeNum').val(),
            temp_ordersn,
            paytype,
            istype,
            id: cartids,
            total:cartnum,
            realprice,
            changeprice:price3,
            realprice,
            changegoodsprice,
            discount_type
        },
        async: true,
        success: function (data) {
            console.log(data);


            if (type == 'express') {
                if (data.code == 200) {
                    $('.order .qrcode #qrcodeImage').attr('src', data.data.url)
                    toggle('.qrcode')
                    ajax_check_order_pay()
                } else {

                }
            } else if (type == 'afhalen') {
                $('.order .qrcode #qrcodeImage').attr('src', data.result.code)
                toggle('.phone')
                toggle('.qrcode')
                ajax_check_order_pay()
            }

        }

    })
}

function getSMS() {
    $.ajax({
        type: "POST",
        url: `${baseUrl}api.create.verifycode`,
        dataType: "json",
        data: {
            openid,
            dealerid,
            mobile: $('#mobileNum').val(),
            temp: 'sms_reg'
        },
        async: true,
        success: function (data) {
            console.log(data);
            if (data.code == 200) {
                // mui.toast(data.msg);
                // swal({
                //     title: "提示",
                //     text: "支付成功，返回首页",
                //     icon: "success",

                // })

            } else {
                // mui.toast(data.msg);
                swal({
                    title: "提示",
                    text: data.msg,
                    icon: "warning",
                    button: false,
                })
            }
        }
    })
}


$('#ziti').click(function () {
    toggle('.phone')
})
$('#kuaidi').click(function () {

    zhifu('express')
})

$('.phone').click(function () {
    toggle('.phone')
})
$('.qrcode').click(function () {
    toggle('.qrcode')
    clearInterval(ajaxTimer)
    ajaxTimer = null
})

$('.phone .inner').click(function (e) {
    e.stopPropagation()
})
// 获取短信按钮
$('#getSMSBtn').click(function () {
    if ($(this).hasClass('disable')) {
        return
    }
    if ($('#mobileNum').val()) {
        // getSMS()
        if (!isSendSms) {
            getSMS();
            isSendSms = true;
        }
        timer = setInterval('circul()', 1000)
    } else {
        // mui.toast('请输入手机号');
        swal({
            title: "提示",
            text: '请输入手机号',
            icon: "warning",
            button: false,
        })
    }

})
function circul() {
    var obj = $('#getSMSBtn');
    // console.log(countdown)
    if (countdown == 0) {
        clearInterval(timer);
        timer = null
        isSendSms = false;
        // $(obj).attr('onclick', 'settime(this)');
        $(obj).removeClass('disable');
        $(obj).val("获取验证码");
        countdown = 60;
        return;
    } else {
        $(obj).removeAttr('onclick');
        $(obj).addClass('disable');
        $(obj).val("重新发送(" + countdown + ")");
        countdown--;
    }
}
// 确定按钮
$('#confirm').click(function () {


    zhifu('afhalen')

    return
    toggle('.phone')
    toggle('.qrcode')
})

$('.order .phone .inner .bg .item.paytype span').click(function (e) {
    let s = $('.order .phone .inner .bg .item.paytype span')
    s.removeClass('on')
    $(this).addClass('on')
    let p = e.currentTarget.dataset.pay
    // console.log(p)
    paytype = p
})


function toggle(e) {
    let p = $(e)
    p.hasClass('in') ? p.removeClass('in') : p.addClass('in')
}