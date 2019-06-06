// 页码
let pageNum = 0
// 商品属性
let attribute = ''
// 店铺
let dealerid = $_GET['dealerid']
// 分类id
let cid = $_GET['ids'] || ''

console.log(cid)
// openid
let openid = $_GET['openid']
// 价格(minprice) 销量(salesreal)
let order = ''
// asd 升序  desc 降序
let by = ''
let keywords = ''

// brandsid
let brandsid = ''

$(function () {
  if ($_GET['keywords']) {
    $('.top .search .inner input[type="search"]').val(decodeURI($_GET['keywords']))
  }
})


function getData() {

  console.log({
    pageNum,
    attribute,
    dealerid,
    cid,
    openid,
    order,
    by,
    keywords,
    brandsid
  })

  $.ajax({
    type: "POST",
    url: `${baseUrl}api.category.category`,
    dataType: "json",
    data: {
      openid,
      dealerid,
      cid
    },
    async: true,
    success: function (data) {
      console.log(data);
      if (data.code == 200) {

        // // 分类
        // let strCatalogy = ''
        // let mmsgCata = ''
        // $.each(data.data.category, function (i, e) {
        //   strCatalogy += `
        //   <span data-id="${e.id}" ${e.type ? 'class="on"' : ''}>${e.name}</span>
        //   `
        //   if (e.type) {
        //     mmsgCata += `${e.name},`
        //   }
        //   // console.log(e)
        // })
        // mmsgCata = mmsgCata.substr(0, mmsgCata.length - 1);
        // $('#catalogBox .group .gitem .list').html(strCatalogy)
        // $('#catalogBox .group .gitem .list span').click(function () {
        //   toggle($(this)[0], 'on')
        // })
        // $('.top .search .bg.catalogBg .inner .catalogText text.cname').text(mmsgCata)

        // 分类
        let strCatalogy = ''
        let mmsgCata = ''
        $.each(data.data.list, function (i1, e1) {
          strCatalogy += `
                <div class="gitem">
                <div class="title">${e1.name}</div>
                <div class="list">
                `
          $.each(e1.twotier, function (i2, e2) {
            strCatalogy += `
                    <span data-id="${e2.id}" ${e2.type ? 'class="on"' : ''}>${e2.name}</span>
                    `
            if (e2.type) {
              mmsgCata += `${e2.name},`
            } 
          })
          strCatalogy += `</div>
                    </div>
                `
        })
        mmsgCata = mmsgCata.substr(0, mmsgCata.length - 1);
        $('#catalogBox .group .gitem .list').html(strCatalogy)
        $('#catalogBox .group .gitem .list span').click(function () {
          toggle($(this)[0], 'on')
        })
        $('.top .search .bg.catalogBg .inner .catalogText text.cname').text(mmsgCata)
      }
    }
  })


  $.ajax({
    type: "POST",
    url: `${baseUrl}api.category.categorylist`,
    dataType: "json",
    data: {
      pageNum,
      attribute: attribute,
      dealerid,
      cid,
      openid,
      order,
      by,
      keywords: $('.top .search .inner input[type="search"]').val(),
      brandsid: brandsid
    },
    async: true,
    success: function (data) {
      console.log(data);
      if (pageNum == 0) {
        $('.goods .goodsGroup .list').html('')
      }
      if (data.code == 200 && data.data.list) {

        // 筛选
        let sxi = ''
        let sxl = ''
        $('#selectBox .group').html(sxl)
        $.each(data.data.filtrate, function (i1, e1) {
          sxi = ''
          sxl = ''
          $.each(e1.list, function (i2, e2) {
            console.log(e2)
            sxi += `
          <span data-id="${e2.id}" ${e2.type == true ? 'class="on"' : ''}>${e2.name}</span>
        `
          })
          sxl += `
        <div class="gitem" fields="${e1.fields}" >
        <div class="title">${e1.title} <span><text></text><i class="fa fa-fw fa-angle-down in"></i></span></div>
        <div class="list listL open">
          ${sxi}
        </div>
      </div>
        `

          $('#selectBox .group').append(sxl)
        })


        // 筛选类型 选择
        $('#selectBox span').click(function (e) {

          let t = $(this)
          if (t.hasClass('on')) {
            t.removeClass('on')
            return
          }

          t.parents('.list').find('span').removeClass('on')
          t.addClass('on')
          // toggle($(this)[0], 'on')
          // t.parents('.gitem').find('.title span text').text(t.text())
          // console.log(t.text())
        })





        // 商品
        let str = ''
        $.each(data.data.list, function (i, e) {
          // console.log(e)onclick="appOpenDesc(${e.id})"
          str += `
          <div class="item" data-id="${e.id}">
						<div class="bg">
							<div class="icon"
								style="background:url(${e.thumb}) no-repeat center;background-size:110% auto;">
							</div>
							<div class="title">
								<div class="t">
									${e.title}</div>
							</div>
							<div class="price">
								<div class="group">
									<div class="p1">￥${e.minprice}</div>
									<div class="p2">立即抢购</div>
								</div>
							</div>
						</div>
					</div>
          `
        })
        $('.goods .goodsGroup .list').append(str)
        mui(".goods .goodsGroup .list ").on('tap', '.item', function () {
          //console.log("点击事件");
          appOpenDesc($(this).attr('data-id'))
        })
        mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);
      } else {
        mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
        mui.toast("暂无数据")
      }

      $('#loading').fadeOut(500)

    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      console.log(XMLHttpRequest)
      console.log(textStatus)
      console.log(errorThrown)
    }
  });


}




// 搜索
$('#searchBtn').click(function () {

  // 页码
  pageNum = 0
  // 商品属性
  attribute = ''
  // 店铺
  merchid = $_GET['dealerid']
  // 分类id
  cid = ''
  // openid
  openid = $_GET['openid']
  // 价格(minprice) 销量(salesreal)
  order = ''
  // asd 升序  desc 降序
  by = ''
  keywords = $('#searchVal').val()
  // console.log(keywords)
  $('.goods .goodsGroup .list').html('')
  getData()
})

// 分类点击
$('.top .search .bg.catalogBg .inner #catalog').click(function () {
  toggle('#catalogBox', 'in')
})
// 分类确认
$('#catalogBox .inner .btns .btn.confirm ').click(function () {
  let sp = $('#catalogBox .group .gitem .list span[class="on"]')
  let ids = ''
  let msg = ''
  $.each(sp, function (i, e) {
    ids += `${$(e).attr('data-id')},`
    msg += `${$(e).text()},`
  })
  ids = ids.substr(0, ids.length - 1);
  if (msg.length > 0) {
    msg = msg.substr(0, msg.length - 1);
  } else {
    msg = '全部'
  }

  cid = ids
  $('.goods .goodsGroup .list').html('')
  getData()
  toggle('#catalogBox', 'in')
  $('.top .search .bg.catalogBg .inner .catalogText text.cname').html(msg)
})


// 筛选背景点击
$('#selectBox').click(function (e) {
  e.stopPropagation();
  toggle('#selectBox', 'in')
})
$('#selectBox .inner').click(function (e) {
  e.stopPropagation();
})
// 筛选重置
$('#selectBox .inner .btns .btn#reset').click(function () {
  $('#selectBox .group .gitem .list span').removeClass('on')
  $('#selectBox .group .gitem .title span text').text('')
})



// 筛选确认
$('#selectBox .inner .btns .btn#confirm').click(function () {
  toggleGoods('#selectBox')

  // 商品属性
  attribute = ''
  let propertyid = $('#selectBox .group .gitem[fields="propertyid"]')
  $.each(propertyid.find('.list span'), function (i, e) {
    if ($(e).hasClass('on')) {
      // console.log(`${$(e).html()}  1 -- ${$(e).attr('data-id')}`)
      attribute += `${$(e).attr('data-id')},`
    }
  })
  attribute = attribute.substr(0, attribute.length - 1);
  console.log(attribute)

  // 商品品牌
  brandsid = ''
  let brandsidli = $('#selectBox .group .gitem[fields="brandsid"]')
  $.each(brandsidli.find('.list span'), function (i, e) {
    if ($(e).hasClass('on')) {
      // console.log(`${$(e).html()}  1 -- ${$(e).attr('data-id')}`)
      brandsid += `${$(e).attr('data-id')},`
    }
  })
  brandsid = brandsid.substr(0, brandsid.length - 1);
  console.log(brandsid)
  pageNum = 0
  getData()

})






// 筛选关闭
$('#selectBox .closeBtn').click(function () {
  // $('#selectBox').removeClass('in')
  toggleGoods('#selectBox')
})


// 排序方式点击
$('.top .type .item').click(function (e) {
  by = ''
  pageNum = 0
  let tag = e.currentTarget.dataset.tag
  if (tag == 'type4') {
    toggleGoods('#selectBox')
    return
  } else if (tag == 'type2') {
    priceSort(this)
    order = 'salesreal'
  } else if (tag == 'type3') {
    priceSort(this)
    order = 'minprice'
  } else {
    order = ''
    by = ''
  }

  if (tag != 'type2') {
    let t3 = $('.top .type .item[data-tag=type2]')
    t3.addClass('nor')
    t3.removeClass('up')
    t3.removeClass('down')
  }
  if (tag != 'type3') {
    let t3 = $('.top .type .item[data-tag=type3]')
    t3.addClass('nor')
    t3.removeClass('up')
    t3.removeClass('down')
  }
  $('.top .type .item.on').removeClass('on')
  $(this).addClass('on')

  $('.goods .goodsGroup .list').html('')
  getData()

})

// 筛选 扩展按钮 三角形
$('#selectBox .gitem .title span i').click(function () {

  let i = $(this)
  let li = i.parents('.gitem').find('.list.listL')
  toggleGoods(i[0])


  i.hasClass('in') ? li.addClass('open') : li.removeClass('open')

})

// 价格排序
function priceSort(e) {
  let that = $(e)
  if (!that.hasClass('down') && !that.hasClass('up')) {
    that.addClass('down')
    by = 'desc'
  } else if (that.hasClass('down')) {
    that.addClass('up')
    that.removeClass('down')
    by = 'asc'
  } else if (that.hasClass('up')) {
    that.addClass('down')
    that.removeClass('up')
    by = 'desc'
  }
  that.removeClass('nor')
}

// 上啦刷新
function uppullfresh() {
  pageNum++
  getData()
}


// 下拉刷新
function dowmpullfresh() {
  // console.log('down')
  setTimeout(function () {
    mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
  }, 1500);
}

function toggleGoods(e) {
  let p = $(e)
  p.hasClass('in') ? p.removeClass('in') : p.addClass('in')
}


$('#floatRightBox #topBtn').click(function (e) {
  mui('#pullrefresh').pullRefresh().scrollTo(0, 0, 300);
})


mui.init({
  pullRefresh: {
    container: '#pullrefresh', //待刷新区域标识，querySelector能定位的css选择器均可，比如：id、.class等
    up: {
      auto: true, //可选,默认false.自动上拉加载一次
      contentrefresh: "正在加载...", //可选，正在加载状态时，上拉加载控件上显示的标题内容
      contentnomore: '没有更多数据了', //可选，请求完毕若没有更多数据时显示的提醒内容；
      callback: uppullfresh //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
    },
    // down: {
    //   style: 'circle', //必选，下拉刷新样式，目前支持原生5+ ‘circle’ 样式
    //   color: '#2BD009', //可选，默认“#2BD009” 下拉刷新控件颜色
    //   // auto: false, //可选,默认false.首次加载自动上拉刷新一次
    //   callback: dowmpullfresh //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
    // }
  }
});