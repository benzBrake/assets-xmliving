<?php if (!defined('__TYPECHO_ROOT_DIR__')) exit;
/*
 * @Author: Ryan
 * @Date: 2021-02-26 11:41:18
 * @LastEditTime: 2021-03-04 10:37:29
 * @LastEditors: Ryan
 * @Description: 
 * @FilePath: \XMLiving\assets\js\xconf.js.php
 */
$gravatarPrefix = Helper::options()->XGravatarPrefix;
if (empty($gravatarPrefix) && defined('__TYPECHO_GRAVATAR_PREFIX__')) {
    $gravatarPrefix = __TYPECHO_GRAVATAR_PREFIX__;
}
if (empty($gravatarPrefix)) {
    $gravatarPrefix = 'https://secure.gravatar.com/avatar/';
}
?>
<script>
    xConf = {
        'header': {
            'mainMenu': {
                'spaceOffset': 120
            },
            'hideOnScroll': true,
        },
        'image': {
            'lazyload': '<?php xLazyLoad(); ?>',
            'maxHeight': <?php echo xConfig('XAutoPhotosHeight', 300); ?>
        },
        'gravatar': {
            'prefix': '<?php echo $gravatarPrefix ?>'
        },
        'comments': {
            'maxLevels': "<?php echo intval(Helper::options()->commentsMaxNestingLevels); ?>",
            'submitText': "<?php _e("回复评论"); ?>",
            'submitNotice': "<?php _e("发射中.."); ?>",
            'submitSuccess': "<?php _e("评论成功"); ?>",
            'error': "<?php _e("评论出错"); ?>",
            'ajaxError': "<?php _e("评论失败，请重试"); ?>",
            'waiting': "<?php _e("您的评论需管理员审核后才能显示！"); ?>"
        },
        'catalog': {
            'offset': 120,
            'sync': true
        },
        'pjax': {
            'isEnabled': <?php echo xIsPjax() ? 'true' : 'false'; ?>,
            'siteUrl': "<?php Helper::options()->siteUrl(); ?>",
            'searchUrl': "<?php Helper::options()->index('/search/'); ?>",
            'refresh': {
                'toLogin': '请刷新后再登录',
                'toRegist': '请刷新后再注册'
            },
            'login': {
                'error': '登录错误！'
            },
            'like': {
                'thankYou': '谢谢点赞',
                'already': '已经点过赞了!'
            }
        },
        'OwO': {
            'imageMirror': '<?php echo trim(xThemeUrl(''), "/"); ?>'
        },

    };
</script>