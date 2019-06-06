// openid	是	string	用户openid
let openid = $_GET['openid']
let dealerid = $_GET['dealerid']
let imgs = []
mui.init();


$(function () {

    // $.fakeLoader({
    //     timeToHide:1200,
    //     bgColor:"#9b59b6",
    //     spinner:"spinner7"
    // });

    getData()




})

// 分类确认
$('#catalogBox .inner .btns .btn.confirm ').click(function () {
    let sp = $('#catalogBox .group .gitem .list span')
    let ids = ''

    $.each(sp, function (i, e) {

        if ($(e).hasClass('on')) {
            ids += `${$(e).attr('data-id')},`
        } 

        

    })
    ids = ids.substr(0, ids.length - 1);

    appOpenGoodsids(ids)
    // console.log(ids)
    // $('.goods .goodsGroup .list').html('')
    // getData()
    // toggle('#catalogBox', 'in')
    // $('.top .search .bg.catalogBg .inner .catalogText text.cname').html(msg)
})


function getData() {

    // dealer.api.category.category 

    $.ajax({
        type: "POST",
        url: `${baseUrl}api.category.category`,
        dataType: "json",
        data: {
            openid,
            dealerid,
        },
        async: true,
        success: function (data) {
            console.log(data);
            if (data.code == 200) {

                // 分类
                let strCatalogy = ''
                $.each(data.data.list, function (i1, e1) {
                    strCatalogy+=`
                    <div class="gitem">
                    <div class="title">${e1.name}</div>
                    <div class="list">
                    `
                    $.each(e1.twotier,function(i2,e2){
                        strCatalogy += `
                        <span data-id="${e2.id}" ${e2.type?'class="on"':''}>${e2.name}</span>
                        `
                    })
                strCatalogy+=`</div>
                        </div>
                    `
                })
                $('#catalogBox .group .gitem .list').html(strCatalogy)
                $('#catalogBox .group .gitem .list span').click(function () {
                    toggle($(this)[0], 'on')
                })
            }
        }
    })

    $.ajax({
        type: "POST",
        url: `${baseUrl}api.home`,
        dataType: "json",
        data: {
            openid,
            dealerid,
        },
        async: true,
        success: function (data) {
            console.log(data);
            if (data.code == 200) {

                

                let listStr = ''
                $.each(data.data.categorylist, function (i1, e1) {
                    // console.log(e1)
                    listStr += `<div class="list">
                    <div class="ltitle">${e1.title} <span class="more" onclick="appOpenmore(${e1.id},'${e1.title}','')">MORE>></span></div>`
                    $.each(e1.list, function (i2, e2) {
                        listStr += `
                        <div class="item" onclick="appOpenDesc(${e2.id})">
                        <div class="bg">
                            <div class="icon"
                                style="background:url(${e2.thumb}) no-repeat center;background-size:110% auto;">
                            </div>
                            <div class="title">
                                <div class="t">
                                    ${e2.title}</div>
                            </div>
                            <div class="price">
                                <div class="group">
                                    <div class="p1">￥${e2.productprice}</div>
                                    <div class="p2">立即抢购</div>
                                </div>
                            </div>
                        </div>
                    </div>
                        `
                    })
                    listStr += '</div>'
                })
                $('.catalogs').html(listStr)


                // 热销
                let jsStr = ''
                let js = [data.data.hot, data.data.new, data.data.recommand]
                console.log(js)
                $.each(js, function (i1, e1) {
                    jsStr += `
                    <div class="mui-col-sm-4">
					<div class="in">
                        <div class="mui-content list" >
                        
                            <div class="mui-row ttMore" onclick="appOpenmore('','${e1.title}','${e1.id}')">
                            <i class="fa fa-angle-right"></i>
								<div class="mui-col-sm-6 ">
									<div class="ltitle">
                                        ${e1.title}
                                        
									</div>
								</div>
							</div>
							<div class="mui-row">
                                `
                    $.each(e1.list.list, function (i2, e2) {
                        jsStr += `
                    <div class="mui-col-sm-6">
                    <div class="item" onclick="appOpenDesc(${e2.id})">
                        <div class="bg">
                            <div class="icon"
                                style="background:url(${e2.thumb}) no-repeat center;background-size:110% auto;;">
                            </div>
                            <div class="title">
                                <div class="t">
                                    ${e2.title}</div>
                            </div>
                            <div class="price">
                                <div class="group">
                                    <div class="p1">￥${e2.productprice}</div>
                                    <div class="p2">立即抢购</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                    `
                    })
                    jsStr += `
							</div>
						</div>
					</div>
				</div>
                    `
                })

                $('.goodsGroup .mui-row').html(jsStr)



            //     let msliderStr = ''

            //     msliderStr+=`<div class="mui-slider-item mui-slider-item-duplicate">
            //     <div class="item"
            //         style="background:url(${data.data.thumbs[data.data.thumbs.length-1]}) no-repeat center;background-size: auto 110%;">
            //     </div>
            // </div>`
            //     $.each(data.data.thumbs, function (i, e) {
            //         // console.log(e)
            //         msliderStr += `
            //         <div class="mui-slider-item mui-slider-item-duplicate">
            //         <div class="item"
            //             style="background:url(${e}) no-repeat center;background-size: auto 110%;">
            //         </div>
            //     </div>
            //         `
            //     })

            //     msliderStr+=`<div class="mui-slider-item mui-slider-item-duplicate">
            //     <div class="item"
            //         style="background:url(${data.data.thumbs[0]}) no-repeat center;background-size: auto 110%;">
            //     </div>
            // </div>`
            //     $('#mslider').html(msliderStr)

            //     var gallery = mui('.mui-slider');
            //     gallery.slider({
            //         interval: 5000 //自动轮播周期，若为0则不自动播放，默认为0；
            //     });
                imgs = data.data.thumbs
                initSwiper()


                let discountStr = ''
                $('.index .top .left .ltitle span').text(data.data.discount.title)
                $.each(data.data.discount.list.list, function (i, e) {
                    discountStr += `
                    <div class="item" onclick="appOpenDesc(${e.id})">
                    <div class="icon"
                        style="background:url(${e.thumb}) no-repeat center;background-size: 110% auto;">
                    </div>
                    <div class="title">
                        <div class="t">
                            ${e.title}</div>
                    </div>
                    <div class="price">
                        <div class="group">
                            <div class="p1">￥${e.marketprice}</div>
                            <div class="p2">￥${e.productprice}</div>
                        </div>
                    </div>
                </div>
                    `
                })
                $('.index .top .left').append(discountStr)
                $('#loading').fadeOut(500)
            }
        }
    })
}


$('.index .top .right .btns ul li span.w').click(function () {
    toggle('#catalogBox', 'in')
})
$('.index .top .right .btns ul li span.s').click(function () {
    toggle('#searchBox', 'on')
})


// 初始化轮播
function initSwiper() {

    let sw = $('#swiper')
    let wp = sw.find('.swiper-wrapper')

    let wpStr = ''

    $.each(imgs, function (i, e) {

        wpStr += `
        <div class="swiper-slide" style="background: url(${e}) no-repeat center;background-size: auto 100%; "></div>
        `

    })
    wp.html(wpStr)

    mySwiper = new Swiper('#swiper', {
        autoplay: {
            delay: 3000, //1秒切换一次
            stopOnLastSlide: false,
            disableOnInteraction: false,
        },
        // direction: 'vertical', // 垂直切换选项
        loop: true, // 循环模式选项

        // 如果需要分页器
        pagination: {
            el: '.swiper-pagination',
        },

    })



}