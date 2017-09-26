<template>
    <section class="myMusicWrapper">
        <div class="myPage404">
            <p>亲~您还没有制作页面啦！</p>
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

    </section>
</template>

<script>
    import {mapGetters} from 'vuex'
    import songTime from '@/filters/songTime'

    export default {
        name: 'friend',
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

</style>

