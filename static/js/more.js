// 页码
let pageNum = 0
// 商品属性
let attribute = $_GET['attribute'] || ''
// 店铺
let dealerid = $_GET['dealerid']
// 分类id
let cid = $_GET['cid'] || ''

console.log(cid)
// openid
let openid = $_GET['openid']
// 价格(minprice) 销量(salesreal)
let order = ''
// asd 升序  desc 降序
let by = ''
let keywords = ''
let title = $_GET['title']

// brandsid
let brandsid = ''

$(function () {
  $('.top .search').text(decodeURI(title))
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
        $('#loading').fadeOut(500)
      } else {
        mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
        mui.toast("暂无数据")
      }

    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      console.log(XMLHttpRequest)
      console.log(textStatus)
      console.log(errorThrown)
    }
  });


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