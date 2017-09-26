<template>
    <div id="app">
        <div class="wrap">

            <el-menu theme="dark" class="el-menu-demo" mode="horizontal" :router="true">
                <el-menu-item
                    v-for="menu,index in mainMenu"

                    class="el-menu-item"

                    :index="menu.path"
                    >{{menu.name}}</el-menu-item>

                <!--<el-submenu class="logIn" index="2">-->
                    <!--<template slot="title">登录</template>-->
                    <!--<el-menu-item v-for="log,index in logs" index="2- + index">{{log}}</el-menu-item>-->
                <!--</el-submenu>-->
                <li class="Login">
                    <log-in>

                    </log-in>
                </li>
                <li class="search" ref="ShowControl">
                    <form action="">
                        <input type="text" placeholder="音乐/电台/用户" v-model="inedxValue">
                        <a class="Search" @click="getSearchList"></a>
                    </form>
                </li>
            </el-menu>

        </div>

        <router-view></router-view>

        <section class="musicControlWrap"
                 ref="musicControlWrap"
                 @mouseenter="musicUp"
                 @mouseleave="musicDown"
        >
            <div class="musicControl">
                <div class="chooseTap">
                <span>
                    <icon name="step-backward" class="prev"></icon>
                </span>
                <span id="playBtn" ref="playBtn">
                    <img src="./image/musicPlay.png" alt="" class="playNow" >
                    <img src="./image/musicStop.png" alt="" class="stopNow" >
                </span>
                <span>
                    <icon name="step-forward" class="next"></icon>
                </span>
                </div>
                <img :src="PlayMusicImg" alt="" class="this_musicImg">
                <div class="progress">
                    <p>{{PlayMusicName}}</p>
                    <span class="progressLine">
                        <span class="progressCover"></span>
                        <span class="progressBar"></span>
                    </span>
                    <span class="musicPlayTime">
                        <strong id="Time">00:00</strong> / <strong id="totalTime">00:00</strong>
                    </span>
                </div>
                <div class="volumeControl">
                    <icon name="volume-up" class="volumeTap"></icon>
                    <div class="volume">
                        <span class="volumeLine">
                            <span class="volumeCover"></span>
                            <span class="volumeBar"></span>
                        </span>
                    </div>
                </div>
                <span class="hoverUp"></span>
            </div>
        </section>
<!--给audio添加了Dom事件-->
        <div class="audioNative">
            <audio controls :src="PlayMusicUrl" autoPlay
                class="Audio"
                v-control="isControl"
                   ref="audio"
            >
                <!--<source >-->
            </audio>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue'
    import LogIn from '@/components/LogIn'


//给音乐播放器绑定一些Dom操作
    Vue.directive('control', {
        bind(el) {
            //给音乐一个初始音量
            el.volume = 46 / 67;
            /*
            * 这里有一个坑，只要volume这个进度条是display：none，的就拿不到
            * volumeBarMax这个Dom操作的值，页面一打开就会报错的，所以就将
            * 值写死
            * */
        },
        inserted(el,binding) {
            var time = document.getElementById('Time');
            var totalTime = document.getElementById('totalTime');
            var playBtn = document.getElementById('playBtn');
            var playNow = document.querySelector('.playNow');
            var stopNow = document.querySelector('.stopNow');
            var progressLine = document.querySelector('.progressLine');
            var progressBar = document.querySelector('.progressBar');
            var progressCover = document.querySelector('.progressCover');//进度条
            var volumeTap = document.querySelector('.volumeTap');
            var volume = document.querySelector('.volume');
            var volumeLine = document.querySelector('.volumeLine');
            var volumeCover = document.querySelector('.volumeCover');
            var volumeBar = document.querySelector('.volumeBar');

            //音乐进度条最大值
            var progressBarMax = progressLine.clientWidth - progressBar.offsetWidth;

            //音量进度条最大值
            var volumeBarMax = volumeLine.clientHeight - progressBar.offsetHeight;


            function addZero(nub) {
                return nub = nub < 10? '0' + nub: '' + nub;
            }

            //调节当前播放歌曲进度条时 播放-暂停与否
            function setAudio() {
                if(el.paused) {
                    playNow.style.display = 'none';
                    stopNow.style.display = 'block';
                } else {
                    stopNow.style.display = 'block';
                    playNow.style.display = 'none';
                }
            }
            //设置点击底部播放按钮 播放-暂停与否
            playBtn.addEventListener('click',e => {
                if(el.paused) {
                    el.play();
                    playNow.style.display = 'none';
                    stopNow.style.display = 'block';
                } else {
                    el.pause();
                    playNow.style.display = 'block';
                    stopNow.style.display = 'none';
                }
            })

            /*
            * 当音频/视频的时长已更改时 --------音乐播放/暂停，播放进度条
            * */
            el.ondurationchange = function () {
                console.dir(el.duration);//只能在这里才能获取音乐的总长度

                //ontimeupdate 播放进度发生改变---实时触发
                el.ontimeupdate = function () {
                   time.innerHTML = addZero(parseInt(el.currentTime/60)) + ':' +
                       addZero(parseInt(el.currentTime%60));
                    progressBar.style.left = progressBarMax * el.currentTime / el.duration + "px";
                    progressCover.style.width = (progressBarMax * el.currentTime / el.duration + 3) + "px";
                };

                //音乐总时长
                let audioTime = Math.floor(el.duration);
                audioTime = addZero(parseInt(audioTime / 60)) + ':' +
                    addZero(parseInt(audioTime % 60));

                totalTime.innerHTML = audioTime;

                setAudio();//拖拽播放进度条时的逻辑
            }


    //给音乐一个初始音量
            el.volume = 40 / 67;
            /*
            * 这里有一个坑，只要volume这个进度条是display：none，的就拿不到
            * volumeBarMax这个Dom操作的值，页面一打开就会报错的，所以就将
            * 值写死
            * */

        //点击音量ico  显示音量与否
            volumeTap.addEventListener('click', (e) => {
                e.stopPropagation();//取消下面document的冒泡
                if(volume.style.opacity == 0) {
                    volume.style.opacity = 1;
                } else {
                    volume.style.opacity = 0;
                }
            });

            document.addEventListener('click', (e)=> {
                volume.style.opacity = 0;
            });

    //拖拽调整音量
            volumeBar.addEventListener('mousedown', (e) => {
                e.stopPropagation();
                e.cancelBubble = true;
                var volumeLineRect = volumeLine.getBoundingClientRect();//
                var volumeBarRect = volumeBar.getBoundingClientRect();

                var volumeBarMax = volumeLineRect.height - 13;//音量进度条的最大值

                var dis = 0;
                var start = e.clientY;
                document.addEventListener('mousemove',move);
                document.addEventListener('mouseup',end);

                function move(e) {
                    var now = e.clientY;
            /*
            * 得到当前鼠标点击的位置发生第一次move的位置 - 进度线的底部，因为，进度线的顶部是
            * 正值，底部是负值，所以整体取反。
            * */
                    dis = -(now - volumeLineRect.bottom + volumeBarRect.height / 2);

                    //音量小点的过界处理
                    if(dis > volumeBarMax) {
                        console.log('asdasd');
                        dis = volumeBarMax;
                    } else if(dis < 0) {
                        dis = 0;
                    }
                    volumeBar.style.bottom = dis + 'px';//音量小点的位置
                    volumeCover.style.height = dis + 'px'//音量的进度条高度

            //音量只能是0~1之间的数字，所以用  dis的值 / 音量进度条的总高度 就是一个0~1的数字
                    let scale = dis / volumeBarMax;
                    console.log(el.volume);
                    el.volume = scale.toFixed(1);//调整的音量

                    console.log(volumeBar.style.bottom,volumeBarMax);

                }
                function end() {
                    document.removeEventListener('mousemove',move);
                    document.removeEventListener('mouseup',end);
                }

            });

        }
    });
export default {
  name: 'app',
  data() {
    return {
        inedxValue: '',
        isControl: true,
        isPlaying: false,
      mainMenu: [
        {
          name: 'MUSIC',
          path: '/'
        },
        {
          name: '我的音乐',
          path: '/my'
        },
        {
          name: '朋友',
          path: '/friend'
        },
        {
          name: '商城',
          path: '/store'
        },
        {
          name: '音乐人',
          path: '/recruit'
        },
        {
          name: '下载客户端',
          path: '/download'
        }
      ]
    }
  },
    components: {
        LogIn
    },
    computed: {
        Searchlist() {
            return this.$store.state.searchList;
        },
        SearchCount() {
            return this.$store.state.SearchCount;
        },
  //恭喜这里有一个bug
        PlayMusicUrl() {
            var musicControlWrap = document.querySelector('.musicControlWrap');
            console.log('啦啦啦',musicControlWrap);
            if( musicControlWrap) {
                musicControlWrap.style.bottom = 0;
            }

            return this.$store.state.musicPlaying.musicUrl;

        },
        PlayMusicImg() {
            return this.$store.state.musicPlaying.musicImg;
        },
        PlayMusicName() {
            return this.$store.state.musicPlaying.musicName;
        }
    },
    methods: {
      //顶部导航栏的搜索到的数据
        getSearchList() {
            this.$store.dispatch('getSearchList', this.inedxValue)
                .then(data => {
                    console.log(data,'asdasd asda s');
                    let searchArr = [data.result.songs,this.inedxValue,data.result.songCount];
                    this.$store.commit('setInedxValue', searchArr);
                    this.$router.push('/search/'+ this.inedxValue);
                });
        },
        //恭喜这里有第二个bug
        papa() {
            console.log('啪啪啪',this.$refs.ShowControl);
            var musicControlWrap = document.querySelector('.musicControlWrap');
            console.log('pupupu',musicControlWrap);
            musicControlWrap.style.bottom = 0;
        },
        musicUp() {
            this.$refs.musicControlWrap.style.bottom = 0;
        },
        musicDown() {
            setTimeout(() => {
                this.$refs.musicControlWrap.style.bottom = -60 + 'px';
            });
        }
    },
    mounted() {

    },
    updated() {
        if(this.$refs.audio.paused) {
            this.isPlaying = true;//已经开始播放了
        }
      console.log(this.$refs.audio.paused,'enene enenenenenenenen');

        if(this.isPlaying) {
            setTimeout(() => {
                this.$refs.musicControlWrap.style.bottom = -60 + 'px';
            },3500);
        }
    }
}
</script>

<style>
    body,
    p {
        margin: 0;
    }
    body {
        -webkit-user-select: none;
    }
    .wrap {
        position: relative;
        width: 100%;
        height: 60px;
        background-color: #242424;
    }
    .el-menu-demo {
        width: 1200px;
        margin: 0 auto;
        padding: 0 80px;
        box-sizing: border-box;
        background-color: #242424;
    }
    .el-menu-demo .el-menu-item {
        color: #fff;
    }
    .el-menu-demo >.el-menu-item:nth-of-type(1) {
        position: relative;
        width: 120px;
        height: 0;
        padding-top: 55px;
        overflow: hidden;
    }
    @keyframes logoMove {
        0% {
            transform: rotate(0);
            transform-origin: center;
        }
        100% {
           transform: rotate(360deg);
            transform-origin: center;
        }
    }
    .el-menu-demo >.el-menu-item:nth-of-type(1)::before {
        position: absolute;
        content: '';
        top: 13px;
        left: 5px;
        width: 32px;
        height: 32px;
        background: url(./image/Logo.png) no-repeat;
        animation: logoMove 5s linear infinite;
    }
    .el-menu-demo >.el-menu-item:nth-of-type(1)::after {
        position: absolute;
        content: '';
        top: 8px;
        left: 40px;
        width: 100px;
        height: 60px;
        background: url(./image/Logo-o.png) no-repeat;
    }
    .el-menu-demo .logIn{
        float: right;
        margin: 0 60px 0 20px;
    }
    .el-menu-demo .el-submenu__title {
        color: #fff;
    }
    .search {
        float: right;
    }
    .search form {
        position: relative;
    }
    .search form .Search {
        position: absolute;
        content: '';
        top: 24px;
        left: 14px;
        width: 15px;
        height: 15px;
        background: url(./image/search.png) no-repeat;
        background-size: 15px auto;
        cursor: pointer;
    }
    .search input {
        margin-top: 14px;
        width: 140px;
        height: 26px;
        border-radius: 15px;
        border: none;
        box-shadow: inset 2px 1px 2px #c2c2c2;
        padding: 3px 8px;
        text-align: center;
        font: 12px/20px "微软雅黑";
        background: #f8f8f8;
        outline: none;
    }
    .Login {
        float: right;
        width: 40px;
        margin: 15px 80px 0 30px;
    }
    .Login .el-button--text {
        color: #fff;
    }
    /*自定义音乐控制器*/
    .Audio {
        margin-left: -1000px;
    }
    .musicControlWrap {
        position: fixed;
        z-index: 99999;
        bottom: -60px;
        left: 0;
        width: 100%;
        height: 60px;
        background: #2f2f2f;
        transition: bottom 1s;
    }
    .musicControl {
        width: 1000px;
        margin: 0 auto;
        height: 60px;
        box-sizing: border-box;
        padding: 0 20px;
    }
    .musicControl>* {
        float: left;
    }
    .chooseTap {
        width: 160px;
        height: 40px;
        color: #fff;
    }
    .chooseTap>* {
        cursor: pointer;
        float: left;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        text-align: center;
        line-height: 30px;
        box-sizing: border-box;
        margin: 15px 14px 15px 0;
        border: 1.5px solid #c9c9c9;
        color: #e5e5e5;
    }
    .chooseTap span:nth-of-type(2) {
        position: relative;
        width: 40px;
        height: 40px;
        line-height: 40px;
        text-indent: 3px;
        margin-top: 10px;
        color: #fff;
        border: 1.5px solid #fff;
    }
    .playNow {
        position: absolute;
        top: 50%;
        left: 50%;
        margin: -9px 0 0 -7px;
        width: 18px;
        height: 18px;
    }
    .stopNow {
        display: none;
        position: absolute;
        top: 50%;
        left: 50%;
        margin: -11px 0 0 -10.5px;
        width: 21px;
        height: 21px;
    }
    .this_musicImg {
        cursor: pointer;
        margin-top: 10px;
        width: 36px;
        height: 40px;
        margin-right: 12px;
        background-color: #fff;
        border-radius: 4px;
    }

    .progress {
        position: relative;
        width: 560px;
        height: 40px;
        color: #fff;
        margin-right: 110px;
    }
    .progress p {
        position: absolute;
        top: 6px;
        left: 5px;
        width: 460px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        font: 13px/16px "微软雅黑";
        color: #e8e8e8;
    }
    .progress .progressLine {
        position: absolute;
        top: 32px;
        width: 100%;
        height: 8px;
        border-radius: 6px;
        background-color: #1a1a1a;
    }
    .progressCover {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 599;
        width: 0;
        height: 8px;
        background: #b7000e;
        border-radius: 6px;
    }
    .progressBar {
        cursor: pointer;
        position: absolute;
        z-index: 600;
        top: -4px;
        left: 0;
        width: 16px;
        height: 16px;
        background: #fff;
        border-radius: 50%;
    }
    .progressBar::after {
        position: absolute;
        content: '';
        z-index: 500;
        top: 50%;
        left: 50%;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        margin: -3px 0 0 -3px;
        background-color: #ee000e;
    }
    .progress strong {
        font-weight: normal;
        color: #dfdfdf;
        font: 12px/20px Arial;
    }
    .progress strong:nth-of-type(2) {
        color: #adadad;
    }
    .musicPlayTime {
        position: absolute;
        height: 20px;
        top: 26px;
        right: -80px;
        font: 12px/20px Arial;
    }

    .volumeControl {
        position: relative;
        width: 30px;
        height: 30px;
        box-sizing: border-box;
        color: #fff;
        margin-top: 20px;
        text-align: center;
    }
    .volumeControl .volumeTap {
        width: 22px;
        height: 22px;
    }
    .volumeControl .volume {
        opacity: 0;
        position: absolute;
        top: -120px;
        left: 0;
        width: 31px;
        height: 100px;
        background-color: rgba(47, 47, 47, 0.89);
        cursor: pointer;
    }
    .volumeLine {
        position: absolute;
        top: 10px;
        left: 14px;
        width: 5px;
        height: 80px;
        border-radius: 6px;
        background-color: #1A1A1A;
    }
    .volumeCover {
        position: absolute;
        bottom: 0;
        left: 0px;
        width: 5px;
        height: 40px;
        border-radius: 6px;
        background: #b7000e;
    }
    .volumeLine .volumeBar {
        position: absolute;
        bottom: 40px;
        left: -4px;
        width: 13px;
        height: 13px;
        border-radius: 50%;
        background-color: #fff;
    }
    .volumeLine .volumeBar::after {
        position: absolute;
        content: '';
        z-index: 500;
        top: 50%;
        left: 50%;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        margin: -3px 0 0 -3px;
        background-color: #ee000e;
    }
    .hoverUp {
        position: absolute;
        top: -21px;
        right: 220px;
        width: 40px;
        height: 40px;
        background: url(../static/up.png) no-repeat;
        background-size: 40px auto;
    }
    .audioNative {
        position: absolute;
        botttom: -100px;
        left: 0;
    }
</style>
