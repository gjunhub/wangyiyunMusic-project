<template>
    <section class="myMusicWrapper">
        <div class="myPage404" v-if="isLoging == false">
            <p>亲~您还没有登录啦！</p>
            <img src="../../static/404.png" alt="">
            <span
                :class="{myPageHover: myPageHover}"
                @mouseover="activeClass"
                @mouseout="hideClass"
                @click="toBackIndex"
            >返回首页</span>
            <span
                :class="{myPageHover: myPageLogHover}"
                @mouseover="LogClass"
                @mouseout="hideLogClass"
                @click="showLogInpage"
            >
                立即登录
            </span>
        </div>
        <div class="myCollection" v-else>
            <p>我的收藏</p>
            <div class="musicDesc">
                <span>歌曲</span>
                <span>歌手</span>
                <span>时长</span>
            </div>
            <ul class="myCollectionMusic">
                <li v-for="userMusic,index in userLikeMusics"
                    :key="index"
                    @mouseenter="hoverUserMusic(userMusic)"
                    @mouseleave="hideUserMusic"
                >
                    <em>{{index + 1}}</em>
                    <img :src="userMusic.img" alt="" class="collectImg">
                    <span class="collectName">{{userMusic.name}}</span>
                    <span class="collectSinger">{{userMusic.singer}}</span>
                    <time>{{userMusic.time | songTime}}</time>
                    <strong class="userPlay"
                            v-if="userSongId == userMusic.id"
                            @click="userPlay(userMusic)"
                    ></strong>
                    <strong class="userPlaying"
                        v-if="clickSongId == userMusic.id"
                    ></strong>
                </li>
            </ul>
        </div>
    </section>
</template>

<script>
    import {mapGetters} from 'vuex'
    import songTime from '@/filters/songTime'

    export default {
        name: 'my',
        data() {
            return {
                myPageHover: false,
                myPageLogHover: false,
                userSongId: '',
                clickSongId: ''//判断点了哪一个
            }
        },
        computed: mapGetters([
            'LoginElement',//子组件中的登录按钮元素
            'isLoging',
            'userLikeMusics'//用户点击喜欢按钮后 喜欢的歌曲
        ]),
        methods: {
            activeClass() {
                this.myPageHover = true;
            },
            hideClass() {
                this.myPageHover = false;
            },
            toBackIndex() {
                this.$router.push({name: 'Index'});
            },
            LogClass() {
                this.myPageLogHover = true;
            },
            hideLogClass() {
                this.myPageLogHover = false;
            },
            showLogInpage() {//click后在当前页面获取Login子组件中的登录按钮，并让其自动点击，弹出登录页
                console.log(this.LoginElement.$el.childNodes[2],'LogIn');
                this.LoginElement.$el.childNodes[2].click();
            },
            hoverUserMusic(song) {
                this.userSongId = song.id;
            },
            hideUserMusic() {
                this.userSongId = '';
            },
            userPlay(song) {
                //播放点击的歌曲
                fetch('api/music/url?id=' + song.id)
                    .then(response => {
                        return response.json();
                    }).then( data => {
                    this.SearchSongUrl = data.data[0].url;
                    console.log(data);
                    //下面数组将推荐歌单中的当前播放的歌曲url和img,name传到store中。
                    let songUrl_Img = [this.SearchSongUrl,song.img,song.name];
                    this.$store.commit('setMusicUrl',songUrl_Img);
                });
                this.clickSongId = song.id;
            }
        },
        mounted() {

        },
        filters: {
            songTime
        }
    }
</script>

<style>
    ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }
    .myMusicWrapper {
        width: 920px;
        padding: 0 20px;
        box-sizing: border-box;
        margin: 0 auto;
        box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);
    }
    /*404页面*/
    .myPage404 {
        position: relative;
        width: 100%;
        height: 340px;
        text-align: center;
        border: 1px solid transparent;
        color: #fe2929;
    }
    .myPage404 p {
        margin-top: 24px;
        width: 100%;
        font: 20px/50px '微软雅黑';
        color: #fe2929;
    }
    .myPage404 img {
        margin-top: 20px;
        width: 500px;
        height: 177px;
    }
    .myPage404 span {
        text-decoration: none;
        position: absolute;
        bottom: 20px;
        left: 50%;
        width: 100px;
        height: 42px;
        margin: -21px 0 0 -50px;
        line-height: 42px;
        text-align: center;
        border: 1.5px solid #fe2929;
        border-radius: 28px;
        cursor: pointer;
    }
    .myPage404 span:nth-of-type(1) {
        left: 40%;
    }
    .myPage404 span:nth-of-type(2) {
        left: 60%;
    }
    .myPageHover {
        background-color: #fe2929;
        color: #fff;
    }

    /*已经登录后的*/
    .myCollection {
        width: 100%;
        line-height: 50px;
        font: 20px/50px '微软雅黑';
    }
    .musicDesc {
        width: 100%;
        height: 50px;
        background: linear-gradient(#ffffff, #f6f6f6);
        border-top: 3px solid #ee000e;
        font: 18px/50px '微软雅黑';
        color: #999;
    }
    .musicDesc * {
        float: left;
        height: 50px;
    }
    .musicDesc span:nth-of-type(1) {
        width: 520px;
        text-indent: 20px;
    }
    .musicDesc span:nth-of-type(2) {
        width: 260px;
    }
    .musicDesc span:nth-of-type(3) {
        width: 100px;
    }
    .myCollectionMusic {
        width: 100%;
        height: auto;
    }
    .myCollectionMusic li {
        position: relative;
        width: 100%;
        height: 100px;
        padding: 10px 0;
        box-sizing: border-box;
    }
    .myCollectionMusic li * {
        float: left;
        line-height: 80px;
        font: 18px/80px '微软雅黑';
        font-weight: lighter;
    }
    .myCollectionMusic li:nth-of-type(even) {
        background-color: #fdfdfd;
    }
    .myCollectionMusic li:nth-of-type(odd) {
        background-color: #fbfbfd;
    }
    .myCollectionMusic em {
        font-style: normal;
        width: 70px;
        text-align: center;
        color: #333;
    }
    .myCollectionMusic .collectImg {
        width: 80px;
        height: 80px;
        margin-left: 10px;
        background-color: #000;
    }
    .myCollectionMusic .collectName {
        text-indent: 30px;
        width: 340px;
        margin-right: 10px;
        height: 80px;
        color: #333;
        overflow: hidden;
        white-space: nowrap;
        -ms-text-overflow: ellipsis;
        text-overflow: ellipsis;
        font-weight: normal;
    }
    .myCollectionMusic .collectName:hover {
        text-decoration: underline;
    }
    .myCollectionMusic .collectSinger {
        width: 260px;
        height: 80px;
        text-indent: 20px;
        margin-right: 10px;
        height: 80px;
        color: #333;
        overflow: hidden;
        white-space: nowrap;
        -ms-text-overflow: ellipsis;
        text-overflow: ellipsis;
    }
    .myCollectionMusic time {
        width: 100px;
        height: 80px;
        text-indent: 20px;
    }
    .userPlay {
        position: absolute;
        top: 35px;
        z-index: 9;
        left: 360px;
        width: 30px;
        height: 30px;
        background: url(../../static/userplay.png) no-repeat;
        background-size: 30px auto;
        cursor: pointer;
    }
    .userPlaying {
        position: absolute;
        z-index: 10;
        top: 35px;
        left: 360px;
        width: 30px;
        height: 30px;
        background: url(../../static/userplaying.png) no-repeat;
        background-size: 30px auto;
        cursor: pointer;
    }
</style>
