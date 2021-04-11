/*
 * @Author: Ryan
 * @Date: 2021-02-27 19:26:19
 * @LastEditTime: 2021-03-05 09:55:35
 * @LastEditors: Ryan
 * @Description: 
 * @FilePath: \XMLiving\assets\js\xTheme.js
 */
window.$ = jQuery;
// 弹窗提示 来自 NiceTheme
function xPopupTips(type, msg) {
    var ico = type ? '<div class="text-center text-success mb-2"><span class="svg-success"></span></div>' : '<div class="text-center text-danger mb-2"><span class="svg-error"></span></div>';
    var c = type ? 'tips-success' : 'tips-error';
    var html = '<section class="x-tips ' + c + ' x-tips-sm x-tips-open">' + '<div class="x-tips-overlay"></div>' + '<div class="x-tips-body text-center">' + '<div class="x-tips-content px-5">' + ico + '<div class="text-sm text-muted">' + msg + '</div>' + '</div>' + '</div>' + '</section>';
    var tips = $(html);
    $('body').append(tips);
    $('body').addClass('modal-open');
    if (typeof lazyLoadInstance !== "undefined") {
        lazyLoadInstance.update();
    }
    setTimeout(function () {
        $('body').removeClass('modal-open');
        tips.removeClass('x-tips-open');
        tips.addClass('x-tips-close');
        setTimeout(function () {
            tips.removeClass('x-tips-close');
            setTimeout(function () {
                tips.remove();
            },
                200);
        },
            400);
    },
        1200);
}

function xPopup(type, html, maskStyle, btnCallBack) {
    var maskStyle = maskStyle ? 'style="' + maskStyle + '"' : '';
    var size = '';
    if (type == 'big') {
        size = 'x-tips-lg';
    } else if (type == 'no-padding') {
        size = 'x-tips-nopd';
    } else if (type == 'cover') {
        size = 'x-tips-cover x-tips-nopd';
    } else if (type == 'full') {
        size = 'x-tips-xl';
    } else if (type == 'scroll') {
        size = 'x-tips-scroll';
    } else if (type == 'middle') {
        size = 'x-tips-md';
    } else if (type == 'small') {
        size = 'x-tips-sm';
    }
    var template = '\
 <div class="x-tips ' + size + ' x-tips-open">\
  <div class="x-tips-overlay" ' + maskStyle + '></div>\
  <div class="x-tips-body">\
   <div class="x-tips-close">\
    <span class="svg-white"></span>\
    <span class="svg-dark"></span>\
   </div>\
   <div class="x-tips-content">\
    ' + html + '\
   </div>\
  </div>\
 </div>\
 ';
    var popup = $(template);
    $('body').append(popup);
    $('body').addClass('modal-open');
    if (typeof lazyLoadInstance !== "undefined") {
        lazyLoadInstance.update();
    }
    var close = function () {
        $('body').removeClass('modal-open');
        $(popup).removeClass('x-tips-open');
        $(popup).addClass('x-tips-close');
        setTimeout(function () {
            $(popup).removeClass('x-tips-close');
            setTimeout(function () {
                popup.remove();
            },
                200);
        },
            600);
    }
    $(popup).on('click touchstart', '.x-tips-close, .x-tips-overlay',
        function (event) {
            event.preventDefault();
            close();
        });
    if (typeof btnCallBack == 'object') {
        Object.keys(btnCallBack).forEach(function (key) {
            $(popup).on('click touchstart', key,
                function (event) {
                    var ret = btnCallBack[key](event, close);
                });
        });
    }
    return popup;
}

/**
 * 滚动功能函数
 * @param {String} selector CSS选择器
 * @param {int} offset 偏移，防止 Header 盖住想要看到的部分
 * @param {int} ms 滚动时间
 */
function scrollTo(selector, offset, ms = 500) {
    if ($(selector).length === 0) return;
    var $body = (window.opera) ? (document.compatMode == "CSS1Compat" ? $('html') : $('body')) : $('html,body');
    $body.animate({
        scrollTop: $(selector).offset().top + offset
    }, ms);
}
/**
 * 滚动事件
 */
function scrollInit() {
    var sidebar = $(".stickySidebar"),
        sbOffset = sidebar.offset(),
        sbTopPadding = $('.header').height() + 10,
        catalogLinks = $(".x-catalog a");
    if (sidebar.length > 0) {
        if (scrollY > sbOffset.top) {
            // 修正侧边栏位置
            sidebar.css('margin-top', scrollY - sbOffset.top + sbTopPadding);
        }
    }
    if (catalogLinks.length > 0) {
        // 目录点击滚动跳转
        catalogLinks.unbind().on('click', function (event) {
            scrollTo(decodeURI($(this).data('href')), -$('header').height(), 280);
            event.preventDefault();
            return false;
        });
    }
    $(window).scroll(function () {
        var scrollY = window.pageYOffset || document.documentElement.scrollTop;
        if (xConf.header.hideOnScroll) {
            var $header = $('.header');
            height = $('.breadcrumbs').length > 0 ? $('.navbar').outerHeight() : $('.header').outerHeight();

            if (scrollY <= Math.max(this.lastScroll, 350) || this.loaded === undefined) {
                $header.css('transform', ' translateY(0px)');
            } else {
                $header.css('transform', ' translateY(-' + height + 'px)');
            }
            this.lastScroll = scrollY;
            this.loaded = true;
        }
        if (sidebar.length > 0) {
            // 固定侧边栏，代替 theiaStickySidebar 插件
            if (scrollY > sbOffset.top) {
                sidebar.css({
                    marginTop: scrollY - sbOffset.top + sbTopPadding
                });
            } else {
                sidebar.css({
                    marginTop: 0
                });
            }
        }
        if (xConf.catalog.sync && catalogLinks.length > 0) {
            // 目录选中当前节点
            let fromTop = window.scrollY + xConf.catalog.offset;
            for (i = 0; i < catalogLinks.length; i++) {
                var link = catalogLinks.eq(i),
                    section = $(decodeURI(link.data('href'))),
                    nextSection = null;
                if (catalogLinks.eq(i + 1)) {
                    nextSection = $(decodeURI(catalogLinks.eq(i + 1).data('href')));
                }
                if (section.length > 0 && section.offset().top <= fromTop) {
                    if (nextSection.length > 0) {
                        if (nextSection.offset().top > fromTop) {
                            link.addClass("current");
                        } else {
                            link.removeClass("current");
                        }
                    } else {
                        link.addClass("current");
                    }
                } else {
                    link.removeClass("current");
                }
            }
        }
    });
}

/**
 * 根据宽度显示主菜单
 */
function menuItemMove() {
    var navbar = jQuery('.navbar'),
        collapse = jQuery('.navbar-collapse', navbar),
        maxWidth = collapse.width(),
        mainMenu = jQuery('.main-menu', navbar),
        subItem = jQuery('.sub-item', mainMenu),
        subMenu = jQuery('.sub-menu.default', subItem);
    // 移动菜单
    mainMenu.addClass('resize');
    subItem.fadeOut();
    while ($('>li:first-child', subMenu).length > 0 && (maxWidth - xConf.header.mainMenu.spaceOffset) > (mainMenu.width() + $('>li:first-child', subMenu).width())) {
        $('>li:first-child', subMenu).appendTo(mainMenu);
    }
    $('>.sub-item', mainMenu).detach().appendTo(mainMenu);
    if ($('>li:first-child', subMenu).length > 0) {
        subItem.fadeIn();
    }
    mainMenu.removeClass('resize');
}


function menuItemHidden() {
    jQuery('.main-menu').addClass('resize');
    var right = jQuery('.navbar').width() + jQuery('.navbar').offset().left;
    if (right < jQuery('.main-menu > li:nth-last-child(-n+1)').offset().left + xConf.header.mainMenu.spaceOffset) {
        var i = 1;
        while (true) {
            var hiddenMenus = jQuery('.main-menu > li:nth-last-child(-n+' + i + ')');
            if (hiddenMenus.offset().left + xConf.header.mainMenu.spaceOffset < right) {
                hiddenMenus.remove();
                break;
            }
            i++;
        }
        var collapseMenus = '<li class="menu-item"><a href="#"><i class="text-lg text-primary las la-ellipsis-v"></i></a>' +
            '<ul class="sub-menu">' +
            $("<div/>").append(hiddenMenus.clone()).html() +
            '</ul>' +
            '</li>';
        jQuery('.main-menu').append(collapseMenus);
    }
    jQuery('.main-menu').removeClass('resize');
}

// 微信二维码，来自NiceTheme
$(document).on('click', '.single-popup', function (event) {
    event.preventDefault();
    var img = $(this).data("img");
    var title = $(this).data("title");
    var desc = $(this).data("desc");
    var html = '<div class="text-center"><h6 class="py-2">' + title + '</h6>\
				<img src="' + img + '" alt="' + title + '" style="width:100%;height:auto;">\
				<p class="text-muted text-xs">(' + desc + ')</p></div>'
    xPopup('small', html)
});

// 评论 感谢jiangmuzi
window.TypechoComment = {
    reply: function (theId, coid) {
        scrollTo('#' + theId, -280, 500);

        // 父子评论区分
        var $commentForm = $('#commentform');
        if ($commentForm.find("#comment-parent").length > 0) {
            $('#comment-parent').val(coid);
        } else {
            $(".form-submit", $commentForm).prepend('<input name="parent" id="comment-parent" value="' + coid + '" type="hidden">')
        }

        // 使用 detach 可以保留事件
        var respond = $(".comment-respond").hide().detach();

        // 增加新的评论框
        $('#' + theId + ' > .comment-body').after(respond);
        respond.fadeIn();

        // 回复/取消 交替显示
        $('#div-comment-' + coid + ' .comment-reply-link').fadeOut();
        $("#cancel-comment-reply-link").fadeIn();

        // 评论框聚焦
        $("#comment").focus();
        return false;
    },
    cancelReply: function () {
        $("#comment").val();
        // 默认无父评论
        var $commentForm = $('#commentform');
        if ($commentForm.find("#comment-parent").length > 0) {
            $('#comment-parent').remove();
        }

        // 使用 detach 可以保留事件
        $('#comments > .comments-list').before($(".comment-respond").detach());

        // 回复/取消 交替显示
        $('#comments .comment-reply-link').fadeIn();
        $("#cancel-comment-reply-link").fadeOut();

        scrollTo('.comment-respond', -280, 500);
        return false;
    },
}

/**
 * 无刷新提交评论 感谢jiangmuzi
 */
function bindCommentSubmit() {
    var $form = $('.commentform');
    if (typeof $form == undefined) return;

    $("#email").blur(function () {
        if (
            /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(
                $("#email").val()
            )
        )
            $(".avatar", $form).attr(
                "src",
                xConf.gravatar.prefix +
                hex_md5($("#email").val()) +
                "?d=mm&s=50"
            );
    });

    $form.submit(function () {
        var form = $(this),
            params = form.serialize();
        // 添加functions.php中定义的判断参数
        params += "&themeAction=comment";
        // 解析新评论并附加到评论列表

        replyButton = '<a class="comment-reply-link" rel="nofollow" onclick="return TypechoComment.reply("comment-{coid}", {coid});">回复</a>';

        var appendComment = function (comment) {
            // 默认评论 Class
            commentClass = "comment-parent";
            // 评论列表
            var el = $("#comments > .comments-list");
            if (0 != comment.parent) {
                // 子评论 Class 不一样
                commentClass = "comment-child";
                // 子评论则重新定位评论列表
                var el = $("#comment-" + comment.parent);
                if (el.parents('.comments-list').length >= (xConf.comments.maxLevels - 1)) {
                    replyButton = "";
                }
                // 父评论不存在子评论时
                if (el.find(".comment-children").length < 1) {
                    $('<div class="children"><ul class="comments-list"></ul></div>').appendTo(el);
                } else if (el.find(".comment-children > .comments-list").length < 1) {
                    $('<ul class="comments-list"></ul>').appendTo(el.find(".children"));
                }
                el = $("#comment-" + comment.parent).find(".children").find(".comments-list");
            }
            if (0 == el.length) {
                $('<ul class="comments-list"></ul>').appendTo($("#comments"));
                el = $("#comments > .comments-list");
            }
            var tips = comment.status === 'waiting' ? '<p class="tip-comment-check">' + xConf.comments.waiting + '</p>' : '';
            // 评论html模板，根据具体主题定制
            var html = '<li id="comment-{coid}" class="comment comment-child"><article id="div-comment-{coid}" class="d-flex flex-fill comment-body mt-4"><div class="d-flex flex-shrink-0 mr-3 comment-avatar-author vcard"><img alt="{author}" src="{avatar}" class="avatar avatar-50 photo" width="50" height="50"></div><div class="flex-fill flex-column comment-text"><div class="d-flex align-items-center comment-info mb-2"><div class="comment-author text-sm"><a href="{url}" target="_blank" rel="external nofollow ugc" class="url">{author}</a></div></div><div class="comment-content d-inline-block text-sm bg-light p-2 rounded">{content}' + tips + '</div><div class="text-xs text-muted pt-2"><time class="comment-date">{datetime}</time>' + replyButton + '</div></div></article></li>';
            $.each(comment,
                function (k, v) {
                    regExp = new RegExp("{" + k + "}", "g");
                    html = html.replace(regExp, v);
                });
            $(el).append($(html));
            document.querySelectorAll("pre code").forEach((block) => {
                hljs.highlightBlock(block);
            });
            lazyload();
            $("pre code").each(function () {
                $(this).html("<ul><li>" + $(this).html().replace(/\n/g, "\n</li><li>") + "\n</li></ul>");
            });
        };
        // ajax提交评论
        $.ajax({
            url: $(this).attr('action'),
            type: "POST",
            data: params,
            dataType: "json",
            beforeSend: function () {
                xPopupTips(1, xConf.comments.submitNotice);
                $("#submit").addClass("loading").val(xConf.comments.submitNotice).attr("disabled", "disabled");
            },
            complete: function () {
                $("#submit").removeClass("loading").val(xConf.comments.submitText).removeAttr("disabled");
            },
            success: function (result) {
                if (1 == result.status) {
                    // 新评论附加到评论列表
                    appendComment(result.comment);
                    $("#secret-comment").prop('checked', false);
                    form.find("textarea").val("");
                    TypechoComment.cancelReply();
                    xPopupTips('1', xConf.comments.submitSuccess);
                    scrollTo('#comment-' + result.comment.coid, -200, 1000)
                    return false;
                } else {
                    xPopupTips(0, undefined === result.msg ? xConf.comments.error : result.msg);
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(thrownError);
                console.log(xhr.responseText);
                xPopupTips(0, xConf.comments.ajaxError);
            },
        });
        return false;
    });
}

function bindSearchEvent() {
    $('.search-input input').on('input', function (e) {
        var $input = jQuery(this);
        var query = $input.val();
        if (query != '') {
            jQuery.ajax({
                url: xConf.pjax.searchUrl + encodeURI(query) + '/?type=instant',
                type: 'GET',
                data: [],
                dataType: "json",
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log(thrownError);
                    console.log(xhr.responseText);
                },
                success: function (result) {
                    if (query === '') result = '';
                    var ulNode = jQuery(".search-result ul");
                    var loadMoreNode = jQuery(".search-result .loadmore");
                    var html = '';
                    result.forEach(element => {
                        html += '<li class="border-bottom py-2 text-sm"><a href="' + element.permalink + '">' + element.title + '</a></li>';
                    });
                    ulNode.html(html);
                    var items = ulNode.find("li") || [];
                    jQuery(".widget-search .count").html('(' + items.length + ')');
                    if (items.length < 5) {
                        loadMoreNode.hide()
                    } else {
                        loadMoreNode.show()
                        loadMoreNode.find('a').attr('href', xConf.pjax.searchUrl + encodeURI(query) + '/');
                    }
                }
            });
        }
        return false;
    });
}

function owoInit() {
    if ($('#OwO_Container').length > 0 && $('.OwO-textarea').length > 0) {
        $.ajax({
            url: xConf.OwO.imageMirror + '/assets/json/x.owo.json',
            success(res) {
                let barStr = '';
                let scrollStr = '';
                for (let key in res) {
                    barStr += `<div class="item" data-index="${res[key].index}">${key}</div>`;
                    scrollStr += `
                        <ul class="scroll" data-index="${res[key].index}">
                            ${res[key].container.map(_ => `<li class="item" data-text="${_.data}">${_.icon}</li>`).join('')} 
                        </ul>
                    `;

                }
                regExp = new RegExp("{imageMirror}", "g");
                scrollStr = scrollStr.replace(regExp, xConf.OwO.imageMirror);
                $('#OwO_Container').html(`
                    <div class="box">
                        ${scrollStr}
                        <div class="bar">${barStr}</div>
                    </div>
                `);
                $(document).on('click', function () {
                    $('#OwO_Container .box').stop().slideUp('fast');
                });
                $('.emoji-button').on('click', function (e) {
                    e.stopPropagation();
                    $('#OwO_Container .box').stop().slideToggle('fast');
                });
                $('#OwO_Container .box .bar .item').on('click', function (e) {
                    e.stopPropagation();
                    $(this).addClass('active').siblings().removeClass('active');
                    const scrollIndx = '#OwO_Container .box .scroll[data-index="' + $(this).attr('data-index') + '"]';
                    $(scrollIndx).show().siblings('.scroll').hide();
                });
                /* 点击表情，向文本框插入内容 */
                $('#OwO_Container .scroll .item').on('click', function () {
                    const text = $(this).attr('data-text');
                    $('.OwO-textarea').insertContent(text);
                });
                /* 默认激活第一个 */
                $('#OwO_Container .box .bar .item').first().click();
            }
        });
    }
}

$(document).on('click', '.action-menu', function (event) {
    event.preventDefault();
    $('.mobile-navbar').toggleClass('active');
    $('body').toggleClass('active');
});

$(document).on('click', '.bg-overlay', function (event) {
    event.preventDefault();
    $('.mobile-navbar').removeClass('active');
    $('.sidebar-collapse').removeClass('active');
    $('body').removeClass('active-sidebar').removeClass('active');

});

$(document).on('click', '.action-search', function (event) {
    event.preventDefault();
    $('.sidebar-collapse').toggleClass('active');
    $('body').toggleClass('active-sidebar');
});

$(document).on("click", '.post-like[data-action="like"]', function () {
    event.preventDefault();
    var $this = $(this);
    var posturl = $(location).attr("href").split("?")[0] + "?themeAction=promo";

    if ($this.hasClass('requesting')) {
        return false;
    }

    $this.addClass('requesting');
    $.ajax({
        url: posturl,
        type: 'POST',
        data: {
            operate: 'trigger',
            field: 'agree'
        },
    })
        .done(function (res) {
            $this.addClass('current');
            $this.attr('data-action', 'unlike');
            xPopupTips(1, xConf.pjax.like.thankYou);
            $('.like-count').html('(' + res.value + ')');
        })
        .always(function () {
            $this.removeClass('requesting');
        });
    return false;
});

$(document).on("click", '.post-like[data-action="unlike"]', function () {
    xPopupTips(0, xConf.pjax.like.already);
});

/** 回到顶部 */
function scrollTop() {
    var $window = $(window),
        $window_width = $window.width(),
        $window_height = $window.height(),
        scroll = $window.scrollTop(),
        startPoint = $window_height / 2,
        scrTopBtn = $("#x-back-to-top");
    if (scroll >= startPoint && $window_width >= 1024) {
        scrTopBtn.addClass('active');
    } else {
        scrTopBtn.removeClass('active');
    }
    scrTopBtn.on("click", function () {
        $("html, body").stop().animate({
            scrollTop: 0
        },
            600);
    });
};
jQuery(document).scroll(function ($) {
    scrollTop()
});

function reload() {
    scrollInit();
    menuItemMove();
    document.querySelectorAll('pre code').forEach((block) => {
        block.className = '';
        hljs.highlightBlock(block);
        $(block).html("<ul><li>" + $(block).html().replace(/\n/g, "\n</li><li>") + "\n</li></ul>");
    });
    bindCommentSubmit();
    bindSearchEvent();
    $('.mobile-menu .menu-icon').on('click', null, function () {
        var $submenu = $(this).closest('.menu-has-children').find(' > .sub-menu');
        $submenu.slideToggle(500);
        return false;
    });
    lazyload();
    owoInit();
    $('.x-form .referer').val(location.href);
    $('.x-form').on('submit', function (event) {
        event.preventDefault();
        if ($(this).hasClass('ban-login')) {
            $('.fancybox-container').find('button[data-fancybox-close]').trigger('click');
            if ($(this).hasClass('signin')) {
                xPopupTips(0, xConf.pjax.refresh.toLogin);
            } else {
                xPopupTips(0, xConf.pjax.refresh.toRegist);
            }
        } else {
            $.ajax({
                url: $(this).attr("action"),
                type: $(this).attr("method"),
                data: $(this).serializeArray(),
                success: function (data) {
                    location.reload();
                },
                error: function () {
                    xPopupTips(0, xConf.pjax.login.error);
                }
            });
        }
    });
    $('[data-fancybox]').fancybox({
        protect: true
    });
    // 回到顶部
    var hash = window.location.hash;
    if (hash) {
        $("html, body").stop().animate({
            scrollTop: $(hash).offset().top - 120
        },
            600);
    } else {
        $("html, body").stop().animate({
            scrollTop: 0
        },
            600);
    }
}

$(document).ready(function () {
    reload();
    if (xConf.pjax.isEnabled) {
        $(document.body).on('submit', '.pjax-form', function (event) {
            event.preventDefault();
            $.pjax.submit(event, 'body');
        });
        $(document).pjax(':not(#comments) a[href^="' + xConf.pjax.siteUrl + '"][rel!=gallery][target!=_blank]:not(a[no-pjax], a[onclick])', {
            container: "body",
            fragment: "body",
            timeout: 8000,
        }).on("pjax:send", function () {
            NProgress.start(); //加载动画效果开始
        }).on("pjax:complete", function () {
            NProgress.done(); // 加载动画效果结束
            if ($('photos').length > 0) {
                $('body').addClass('full-width');
                $('.header > .container  > .row > .col-12').removeClass('col-lg-9');
            } else {
                $('body').removeClass('full-width');
                $('.header > .container  > .row > .col-12').addClass('col-lg-9');
            }
            reload();
            $('.x-form').addClass('ban-login');
            // 关闭移动端导航遮罩层
            $('.mobile-navbar').removeClass('active');
            $('body').removeClass('active');
            // 关闭搜索遮罩层
            $("body").removeClass("active-sidebar");
            if (typeof _hmt !== 'undefined') {
                _hmt.push(['_trackPageview', location.pathname + location.search]);
            }
        });
    }
});
console.log("\n%c xTheme %c https://doufu.ru ", "color:#fff;background:#000;padding:5px 0", "color:#fff;background:#666;padding:5px 0")