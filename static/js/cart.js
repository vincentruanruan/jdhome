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
// 选中价格
let totalprice = 0
// 实价
let realprice = 0
//  倒计时 
var countdown = 60;
var isSendSms = false;
var timer;

// 员工id
let jobid = ''
// 验证码
let code = ''
// 折扣类型
// 0 没有折扣
// 1 实价
// 2 折扣
let discount_type = 0

let changegoodsprice = 0

$(function () {
    c = getCart()
    console.log(c)
    $.each(c, function (i, e) {
        console.log(e)
        cartids += `${e.id},`
        optionid += `${e.suk},`
        cartnum += `${e.number},`
    })
    cartids = cartids.substr(0, cartids.length - 1);
    optionid = optionid.substr(0, optionid.length - 1);
    cartnum = cartnum.substr(0, cartnum.length - 1);
    getData()
})


// 获取验证码
function getCode() {
    jobid = $('#userid').val()
    $.ajax({
        type: "POST",
        url: `${baseUrl}api.create.change_orderprice_verifycode`,
        dataType: "json",
        data: {
            openid,
            dealerid,
            jobid,
        },
        async: true,
        success: function (data) {
            console.log(data)

        }
    })
}

// 验证验证码
function verifyCode() {
    jobid = $('#userid').val()
    code = $('#userpsw').val()
    $.ajax({
        type: "POST",
        url: `${baseUrl}api.create.check_change_orderprice_verifycode`,
        dataType: "json",
        data: {
            openid,
            dealerid,
            jobid,
            code
        },
        async: true,
        success: function (data) {
            console.log(data)
            if (data.status == '1') {
                $('.youhui-psw').fadeOut()
                discount_type = 1
                youhuiPriceOpen()
            } else {
                swal({
                    title: "提示！",
                    text: data.result.message,
                    icon: "warning",
                });
            }

        }
    })
}


function getData() {

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
        },
        async: true,
        success: function (data) {
            console.log(data);
            if (data.code == 200) {
                let str = ''
                $.each(data.data.list, function (i1, e1) {
                    $.each(e1.list, function (i2, e2) {
                        console.log(e2)
                        str += `
                        <div class="mui-row row">
                        <div class="mui-col-sm-1">
                            <div class="desc descCheck">
                                <div class="bg">
                                    <div class="checkbox" data-id="${e2.goodsid}" data-optionid="${e2.optionid}" data-number="${e2.total}"></div>
                                </div>
                            </div>
                        </div>
                        <div class="mui-col-sm-5">
                            <div class="desc descGoods">
                                <div class="icon"
                                    style="background:url(${e2.thumb}) no-repeat center;background-size: 110% auto;">
                                </div>
                                <div class="info">
                                    ${e2.title}
                                </div>
                                <div class="type">规格：${e2.optiontitle}</div>
                            </div>
                        </div>
                        <div class="mui-col-sm-2">
                            <div class="desc sprice">
                                <div class="bg">￥<text>${e2.marketprice}</text></div>
                            </div>
                        </div>
                        <div class="mui-col-sm-2">
                            <div class="desc number">
                                <div class="bg">
                                    <div class="num">
                                        <input type="button" data-tag="sub" value="-">
                                        <input type="number" data-id="${e2.goodsid}" data-totalmaxbuy="${e2.totalmaxbuy}" data-marketprice="${e2.marketprice}" value="${e2.total}" readonly />
                                        <input type="button" data-tag="plus" value="+">
                                    </div>
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

                $('.cart .list').html(str)
                setItem()
                $('.bottom .left .checkbox.all').click()
            }
            $('#loading').fadeOut(500)
        }
    })
}

// 商品设置
function setItem() {
    // 商品选择
    $('.descCheck .checkbox').click(function (e) {
        let t = $(this)
        let all = $('.bottom .left .checkbox.all')

        t.hasClass('check') ? t.removeClass('check') : t.addClass('check')

        $('.descCheck .checkbox').length == $('.descCheck .checkbox.check').length ? all.addClass('check') : all.removeClass('check')
        editTotalPrice()
    })
    // 修改数量
    $('.num input[type="button"]').click(function (e) {
        let sprice = $(this).parents('.row').find('.desc.price .bg')
        let tag = e.currentTarget.dataset.tag
        let num = $(this).parent().find('input[type="number"]')
        let n = Number(num.val())
        if (tag == 'plus') {
            if (Number(num.attr('data-totalmaxbuy')) > Number(num.val())) {
                num.val(n + 1)
            }
        } else if (tag == 'sub') {
            if (n <= 1)
                return
            num.val(n - 1)
        }
        let pri = `￥${Number(num.attr('data-marketprice')) * Number(num.val())}`
        sprice.html(pri)
        editTotalPrice()
    })
}

// 修改总价
function editTotalPrice() {
    let ck = $('.cart .list .desc.descCheck .checkbox.check')
    let num = ck.parents('.mui-row.row').find('.num input[type="number"]')
    let number = 0
    let total = 0
    $.each(num, function (i, e) {
        number += Number($(e).val())
        total += (Number($(e).attr('data-marketprice')) * Number($(e).val()))
    })
    $('.cart .bottom .right .inner').html(`已经选择 ${number} 件商品 合计 <b>￥${total}</b>`)
    realprice = total
    totalprice = total
    storage.setItem('realprice', realprice)
    console.log(`number: ${number}`)
    console.log(`total: ${total}`)
    console.log(`realprice: ${realprice}`)
}

// 选中全部
$('.bottom .left .checkbox.all').click(function (e) {
    let t = $(this)
    let cbs = $('.descCheck .checkbox')
    if (t.hasClass('check')) {
        t.removeClass('check')
        cbs.removeClass('check')
    } else {
        t.addClass('check')
        cbs.addClass('check')
    }
    editTotalPrice()
})

// 删除选中
$('#removeSelect').click(function () {


    let cbs = $('.descCheck .checkbox.check')
    console.log(`cbs: ${cbs.length}`)

    if (cbs.length > 0) {
        swal({
            title: "提示",
            text: "是否删除选中的商品？",
            icon: "warning",
            buttons: ["否", "是"],
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    // (e.id == goods.id && e.suk == goods.suk) {
                    $.each(cbs, function (i, e) {
                        // console.log(`${$(e).attr('data-id')} -- ${$(e).attr('data-optionid')}`)
                        delSelectCart({
                            id: $(e).attr('data-id'),
                            suk: $(e).attr('data-optionid')
                        })
                    })

                    // console.log(`${}`)
                    cbs.parents('.mui-row.row').remove()
                    editTotalPrice()
                    console.log('removeSelect')
                    swal("商品删除成功", {
                        icon: "success",
                    });
                } else {
                    //   swal("Your imaginary file is safe!");
                }
            });
    } else {
        swal({
            title: "提示！",
            text: "请选择需要删除的商品",
            icon: "warning",
        });
    }

    return


})



// 删除所有
$('#removeAll').click(function () {


    swal({
        title: "提示",
        text: "是否清空购物车？",
        icon: "warning",
        buttons: ["否", "是"],
        dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                console.log('removeAll')
                clearCart()
                $('.cart .list').html('')
                swal("购物车已清空", {
                    icon: "success",
                });
            } else {
                //   swal("Your imaginary file is safe!");
            }
        });


})

// 去结账
function toPay() {
    storage.setItem('discount_type', discount_type)
    if (discount_type == 0) {
        changegoodsprice = 0
    } else if (discount_type == 1) {
        changegoodsprice = $('.price3').val()
    } else if (discount_type == 2) {
        changegoodsprice = Number($('.zkInput').val()) / 10
    }
    storage.setItem('changegoodsprice', changegoodsprice)

    console.log('submit')
    let cbs = $('.descCheck .checkbox.check')

    if (cbs.length <= 0) {
        swal({
            title: "提示",
            text: "请选择商品",
            icon: "warning",
        })
    } else {

        swal({
            title: "提示",
            text: "是否结算？",
            icon: "warning",
            buttons: ["否", "是"],
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {

                    let arr = []
                    $.each(cbs, function (i, e) {
                        arr.push({
                            id: $(e).attr('data-id'),
                            suk: $(e).attr('data-optionid'),
                            number: $(e).attr('data-number')
                        })
                    })
                    let goods = encodeURI(JSON.stringify(arr))
                    console.log(goods)
                    console.log(decodeURI(goods))
                    appOpenOrder(goods)
                } else {
                    //   swal("Your imaginary file is safe!");
                }
            });

        return
        let arr = []
        $.each(cbs, function (i, e) {
            arr.push({
                id: $(e).attr('data-id'),
                suk: $(e).attr('data-optionid'),
                number: $(e).attr('data-number')
            })
        })
        let goods = encodeURI(JSON.stringify(arr))
        console.log(goods)
        console.log(decodeURI(goods))
        appOpenOrder(goods)
    }
}

$('#submit').click(function () {
    // 不使用优惠
    discount_type = 0
    toPay()
})


$('.cart .bottom .left .btns span#youhui').click(function () {
    $('.youhui-psw').fadeIn()
})

$('.youhui-psw').click(function (e) {
    e.stopPropagation();
    $('.youhui-psw').fadeOut()
})
$('.youhui-psw .inner').click(function (e) {
    e.stopPropagation();
})

// 优惠切换 确认按钮
$('.saveAndSubmit').click(function () {
    console.log(realprice)
    storage.setItem('realprice', realprice)
    toPay()
})
$('.price3').on('input  propertychange', function (e) {
    realprice = Number(this.value)
})
$('.zkInput').on('input  propertychange', function (e) {
    let price = $('.youhui-price .inner .bg.dz .item.input')
    realprice = Number(this.value) * totalprice / 10
    price.find('.price2').text(`折后价:  ￥${realprice}`)
    // console.log(realprice)
})
$('#yhyzBtn').click(function () {
    verifyCode()
})
function youhuiPriceOpen() {
    let price = $('.youhui-price .inner .bg.dz .item.input')
    $('.youhui-price').fadeIn()
    $('.price3').val(realprice)
    realprice = totalprice
    price.find('.price1').text(`原价:    ￥${totalprice}`)
    price.find('.price2').text(`折后价:  ￥${realprice}`)
}
$('.youhui-price').click(function (e) {
    e.stopPropagation()
    $('.youhui-price').fadeOut()
})
$('.youhui-price .inner').click(function (e) {
    e.stopPropagation()
})

// 折扣切换按钮
$('.youhui-price .inner .price span').click(function (e) {
    let type = e.currentTarget.dataset.type
    let price = $('.youhui-price .inner .bg.dz .item.input')
    $('.youhui-price .inner .price span').removeClass('on')
    $(this).addClass('on')
    console.log(type)
    realprice = totalprice
    if (type == 'sj') {
        $('.price3').val(realprice)
        // 实价
        discount_type = 1

    } else if (type == 'dz') {
        // 打折
        discount_type = 2

        $('.zkInput').val(10)
        price.find('.price1').text(`原价:    ￥${totalprice}`)
        price.find('.price2').text(`折后价:  ￥${realprice}`)
    }

    $('.youhui-price .inner .bg').removeClass('on')
    $(`.youhui-price .inner .bg.${type}`).addClass('on')

})


//  倒计时 
// var countdown = 60;
// var isSendSms = false;
// var timer;
$('#userBtn').click(function () {
    if ($(this).hasClass('disable')) {
        return
    }
    if ($('#userid').val().length > 0) {
        if (!isSendSms) {
            getCode()
            isSendSms = true;
        }
        timer = setInterval('circul()', 1000)

    } else {
        swal({
            title: "提示！",
            text: "请输入员工号",
            icon: "warning",
        });
    }
})




function circul() {
    var obj = $('#userBtn');
    // console.log(countdown)
    if (countdown == 0) {
        clearInterval(timer);
        isSendSms = false;
        // $(obj).attr('onclick', 'settime(this)');
        $(obj).removeClass('disable');
        $(obj).val("获取验证码");
        countdown = 60;
        timer = null
        return;
    } else {
        $(obj).removeAttr('onclick');
        $(obj).addClass('disable');
        $(obj).val("重新发送(" + countdown + ")");
        countdown--;
    }
}