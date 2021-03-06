// 设置 rem 函数
function setRem() {
    // 320 默认大小16px; 320px = 20rem ;每个元素px基础上/16
    let htmlWidth = document.documentElement.clientWidth || document.body.clientWidth;
    //得到html的Dom元素
    let htmlDom = document.getElementsByTagName('html')[0];
    //设置根元素字体大小
    htmlDom.style.fontSize = htmlWidth / 20 + 'px';
}

if (window.screen.width < 768) {
    setRem();
}
window.onresize = function () {
    if (window.screen.width < 768) {
        setRem();
    }
}