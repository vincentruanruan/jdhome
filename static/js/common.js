let baseUrl = 'https://wx.jddengju.com/app/index.php?i=1&c=entry&r=dealer.'
let storage = window.localStorage;

// 左浮动 begin ------------------------
// 首页
$('#floatRightBox #homeBtn').click(function(){
    appHome()
})
$('#floatRightBox').click(function (e) {
    e.stopPropagation();
})
// 查询
$('#floatRightBox #searchBtn').click(function (e) {
    console.log('searchBtn')
    
    toggle('#searchBox', 'on')

    
})
// 查询确认
$('#searchBox .inner .btn input').click(function(){
    let key = $('#searchBox .inner .key input').val()
    console.log(encodeURI(key))
    appOpenGoods(encodeURI(key))
})
// 购物车
$('#floatRightBox #cartBtn').click(function (e) {
    console.log('cartBtn')
    appOpenCart()

})
// 分类
$('#floatRightBox #catalogBtn').click(function (e) {
    console.log('catalogBtn')
    appOpenGoodsids()
})
// 返回
$('#floatRightBox #backBtn').click(function (e) {
    console.log('backBtn')
    appBack()
})
// 回到顶部
$('#floatRightBox #topBtn').click(function (e) {
    console.log('topBtn')
    $('html,body').animate({
        scrollTop: '0px'
    }, 500);
})

// 左浮动 end ------------------------



// 搜索框 begin ------------------------
$('#searchBox').click(function (e) {
    e.stopPropagation();
    toggle('#searchBox', 'on')
})
$('#searchBox .inner').click(function (e) {
    e.stopPropagation();
})
$('#searchBox .inner .clostBtn').click(function (e) {
    toggle('#searchBox', 'on')
})
// 搜索框 end ------------------------




// 商品分类 end ------------------------
$('#catalogBox .group .gitem .list span').click(function () {
    toggle($(this)[0], 'on')
})
$('#catalogBox').click(function (e) {
    e.stopPropagation();
    toggle('#catalogBox', 'in')
})
$('#catalogBox .inner').click(function (e) {
    e.stopPropagation();
})
// 重置
$('#catalogBox .inner .btns .btn.reset ').click(function () {
    $('#catalogBox .group .gitem .list span').removeClass('on')
})
// 确定
$('#catalogBox .inner .btns .btn.confirm ').click(function () {

})
$('#catalogBox .header i').click(function () {
    toggle('#catalogBox.in', 'in')
})
// 商品分类 end ------------------------











// 通用 begin ------------------------
$(function () {
    setCartNumber()
})

function toggle(e, c) {
    let p = $(e)
    p.hasClass(c) ? p.removeClass(c) : p.addClass(c)
}

let $_GET = (function () {
    var url = window.document.location.href.toString();
    var u = url.split("?");
    if (typeof (u[1]) == "string") {
        u = u[1].split("&");
        var get = {};
        for (var i in u) {
            var j = u[i].split("=");
            get[j[0]] = j[1];
        }
        return get;
    } else {
        return {};
    }
})();

// 获取购物车
function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || []
}
// 添加购物车
function addCart(goods) {
    let is = false
    let c = getCart()
    $.each(c, function (i, e) {
        console.log(e)
        if (e.id == goods.id && e.suk == goods.suk) {
            c[i].suk = goods.suk
            c[i].number = Number(c[i].number) + Number(goods.number)
            c[i].select = true
            is = true
            return
        }
    })
    is ? {} : c.unshift(goods)
    storage.setItem('cart', JSON.stringify(c))
    setCartNumber()
}
// 删除选中
function delSelectCart(goods) {
    let c = getCart()
    console.log(c)
    $.each(c, function (i, e) {
        if (e.id == goods.id && e.suk == goods.suk) {
            c.splice(i, 1)
            console.log(c)
            return false
        }
    })
    storage.setItem('cart', JSON.stringify(c))
}
// 清空购物车
function clearCart() {
    storage.setItem('cart', JSON.stringify([]))
}
// 设置购物车数字
function setCartNumber() {
    let c = getCart()
    let n = 0
    $.each(c, function (i, e) {
        // console.log(e)
        n = Number(e.number) + Number(n)
    })
    $('#floatRightBox li b#cartnumber').html(n)

}
// 通用 end ------------------------










// app方法 begin ------------------------
// 首页
function appHome(){
    let url  = `index.html?dealerid=${$_GET['dealerid']}&openid=${$_GET['openid']}`
    jumpto(url)
}

// app返回
function appBack() {
    // app.back()
    window.history.go(-1);
}
// 打开购物车 cart
function appOpenCart() {
    // app.openCart(JSON.stringify({

    // }))
    jumpto(`
        cart.html?dealerid=${$_GET['dealerid']}&openid=${$_GET['openid']}
    `)
}
// 打开商品列表 goods
function appOpenGoods(keywords) {
    // app.openGoods(JSON.stringify({
    //     'keywords':keywords 
    // }))
    let url  = `goods.html?dealerid=${$_GET['dealerid']}&openid=${$_GET['openid']}`
    if(keywords){
        url+=`&keywords=${keywords}`
    }
    jumpto(url)
}
function appOpenGoodsids(ids) {
    // app.openGoods(JSON.stringify({
    //     'keywords':keywords 
    // }))
    let url  = `goods.html?dealerid=${$_GET['dealerid']}&openid=${$_GET['openid']}`

    if(ids){
        url+=`&ids=${ids}`
    }
    jumpto(url)
}
// 打开更多 more
function appOpenmore(id,title,attribute) {
    // app.openGoods(JSON.stringify({
    //     'keywords':keywords 
    // }))
    let url  = `more.html?dealerid=${$_GET['dealerid']}&openid=${$_GET['openid']}`
    if(id){
        url+=`&cid=${id}`
    }
    if(title){
        url+=`&title=${title}`
    }
    if(attribute){
        url+=`&attribute=${attribute}`
    }

    jumpto(url)
}
// 打开商品详情 desc
function appOpenDesc(id) {
    // app.openDesc(JSON.stringify({
    //     'id': id
    // }))
    jumpto(`
        desc.html?dealerid=${$_GET['dealerid']}&openid=${$_GET['openid']}&id=${id}
    `)
}
// 结算打开 order
function appOpenOrder(goods) {
    // app.openDesc(JSON.stringify({
    //     'goods': goods
    // }))
    let url = `order.html?dealerid=${$_GET['dealerid']}&openid=${$_GET['openid']}`
    if(goods){
        url+=`&goods=${goods}`
    }
    jumpto(url)
 }

 // 结算打开 order 立即购买
function appOpenOrderNow(goods) {
    // app.openDesc(JSON.stringify({
    //     'goods': goods
    // }))
    let url = `order.html?dealerid=${$_GET['dealerid']}&openid=${$_GET['openid']}&istype=detail`
    if(goods){
        url+=`&goods=${goods}`
    }
    jumpto(url)
 }
 

 function jumpto(url){
    window.location.href = url
 }

 $('#loading').click(function(e){
    e.stopPropagation()
 })
// app方法 end ------------------------