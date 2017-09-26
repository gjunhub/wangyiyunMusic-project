<template>
    <section class="searchSection">
        <div class="searchMusic" v-if="SearchCount != ''">
            <p>搜索"{{IndexValue}}"，找到 <span class="musicTotal">{{SearchCount}}</span> 首单曲</p>
            <div id="detail">
                <span v-for="detail,index in details" :key="index">{{detail}}</span>
            </div>
            <ul id="MusicList">
                <li v-for="song ,index in SearchListPage">
                    <span class="music_nub">{{index + 1 | addZero}}</span>
                    <a href="javascript:;">

                        <!--有繁琐的逻辑-->
                        <div class="collect" @click="doLike(song,index)">
                            <span class="unLike" :class="{like:likeOrNot && song.id == likeSongId}"></span>
                        </div>
                        <i
                            class="playSong"
                            @click="PlaySong(song.id,song.artists[0].img1v1Url,song.name)"
                            :class="{playSonging: song.id == songId}"
                        ></i>
                    </a>
                    <div class="music_name">{{song.name}}</div>
                    <p class="singer">{{song.artists[0].name}}</p>
                    <p class="music_brank">{{song.album.name}}</p>
                    <span class="music_time">{{song.duration | songTime}}</span>
                    <div class="hot">
                    <div class="music_hot">
                    <div class="music_hotBar" ></div>
                    </div>
                    </div>
                </li>
            </ul>
            <!--<my-page :pages="SearchCount"-->
                     <!--:counts="count"-->
                     <!--:limitstart.sync="limitFirst"-->
                     <!--:limitend.sync="limitLast">-->
            <!--</my-page>-->
        </div>
        <div class="page404" v-else>
            <p>亲~你还没有搜索歌曲啦！</p>
            <img src="../../static/404.png" alt="">
            <span
               :class="{classHover: Hover}"
               @mouseover="activeClass"
               @mouseout="hideClass"
               @click="toBackIndex"
            >返回首页</span>
        </div>
    </section>
</template>

<script>
    import songTime from '@/filters/songTime'
    import addZero from '@/filters/addZero.js'
    import myPage from '@/components/page'

    import {mapGetters} from 'vuex'

	export default {
		name: 'search',
        props:[''],
        data() {
		    return {
                details: ['','操作','音乐标题','歌手','专辑','时长','热度'],
                SearchSongUrl: '',
                songId: '',//点击播放时，判断点了谁
                Hover: false,
                limitFirst: 0,//分页第一页第一个
                limitLast: 30,//分页第一页的最后个
                playTotal: 0,//音乐总数
                count: 30,//一页显示20个
                likeOrNot: false,//不喜欢就是灰色的爱心，喜欢就是红色的
                likeSongId: '',
            }
        },
        computed: Object.assign({
            Searchlist() {
                return this.$store.state.searchList;
            },
            SearchCount() {
                return this.$store.state.SearchCount;
            },
            IndexValue() {
                return this.$store.state.inedxValue;
            },
            SearchListPage() {
                return this.$store.state.searchList.slice(this.limitFirst,this.limitLast);
            }
        },mapGetters([
            'isLoging',
            'LoginElement',
            'userLikeMusics'
        ])),
        components: {
            myPage
        },
        methods: {
//		    getMusic() {
//                fetch('/api/search?keywords=' + this.searchValue)
//                    .then(response => {
//                        return response.json();
//                    }) .then(data => {
//                        console.log(data);
//                        this.searchList = data.result.songs;
//                        this.SearchCount = data.result.songCount;
//                });
//
//            },
            PlaySong(id,img,name) {
                console.log('id',id);
                fetch('api/music/url?id=' + id)
                    .then(response => {
                        return response.json();
                    }).then( data => {
                        this.SearchSongUrl = data.data[0].url;
                        console.log(data);
                    //下面数组将推荐歌单中的当前播放的歌曲url和img,name传到store中。
                        let songUrl_Img = [this.SearchSongUrl,img,name];
                    this.$store.commit('setMusicUrl',songUrl_Img);
                });
                this.songId = id;
            },
            activeClass() {
                this.Hover = true;
            },
            hideClass() {
                this.Hover = false;
            },
            toBackIndex() {
                this.$router.push('/');
            },
            //喜欢和不喜欢的逻辑
            doLike(song,index) {//将选中的复选框对应数据传到store
                this.likeOrNot = !this.likeOrNot;
                this.likeSongId = song.id;
                if(this.isLoging) {

                    let userLikeMusic = {
                        id: song.id,
                        img: song.artists[0].img1v1Url,
                        name: song.name,
                        singer: song.artists[0].name,
                        time: song.duration
                    };
                    this.$store.commit('updateUserLikeMusics',userLikeMusic);

                } else {
                    this.LoginElement.$el.childNodes[2].click();//先登录
                    this.$store.commit('updateWindowHref','search');//记录登录前是哪个页面

                    /*
                    * 未登录前点击喜欢按钮的话是提醒用户去登录，然后登录成功后，之前点击的那个喜欢
                    * 按钮就会被点亮，因为是label和input搭配的，所以点击一次喜欢按钮，input中的
                    * checked = true了，再点就是false，所以未登录点击喜欢按钮弹出登录，然后登录了，
                    * 随之喜欢按钮就因为checked这个属性被点亮了，之后两种判断，一种就是点亮了，但是
                    * 喜欢的这个歌曲数据没有带到store中。第二种就是让点击喜欢按钮登录后，让那个按钮
                    * 不点亮，但是checked属性问题，所以第二种不考虑，所以呢用第一种，就直接是点亮了
                    * 然后就把数据带到store中.下面的代码就是。
                    * */
                    let userLikeMusic = {
                        id: song.id,
                        img: song.artists[0].img1v1Url,
                        name: song.name,
                        singer: song.artists[0].name,
                        time: song.duration
                    };
                    this.$store.commit('updateUserLikeMusics',userLikeMusic);
                }
            }
        },
        created() {
		    console.log(this.$route,'aaa');
//		    console.log('qaz',this.$store.state.searchList);
		    /*
		    * 获取上方链接url中的信息
		    * */
//		    var arr = window.location.href.split('/');
//		    console.log(arr[arr.length-1],'asdasd');
        },
        mounted() {

        },
        filters: {
		    songTime,
            addZero
        }
	}
</script>

<style>
    ul {
        padding: 0;
        margin: 0;
        list-style: none;
    }
    p {
        margin: 0;
    }
    .searchSection {
        width: 920px;
        padding: 0 20px;
        box-sizing: border-box;
        margin: 0 auto;
        box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);
    }
    .searchMusic>p {
        padding: 10px 0;
        text-indent: 15px;
    }
    .musicTotal {
        color: #e33333;
    }
    #detail {
        width: 100%;
        height: 30px;
        border: 1px solid #dedede;
        border-top: 2px solid #e12121;
        border-bottom: 0;
        box-sizing: border-box;
    }
    #detail span {
        float: left;
        width: 80px;
        height: 100%;
        box-sizing: border-box;
        padding: 5px 8px;
        font: 12px/20px "微软雅黑";
        color: #666;
        border: 1px solid #dedede;
        border-top: none;
        border-left: none;
    }
    #detail span:nth-of-type(1) {
        width: 60px;
    }
    #detail span:nth-of-type(2) {
        width: 80px;
    }
    #detail span:nth-of-type(3) {
        width: 200px;
    }
    #detail span:nth-of-type(4) {
        width: 120px;
    }
    #detail span:nth-of-type(5) {
        width: 220px;
    }
    #detail span:nth-of-type(6) {
        width: 70px;
    }
    #detail span:nth-of-type(7) {
        width: 126px;
        border-right: none;
    }
    /*喜欢按钮的表单美化*/
    .unLike {
        position: absolute;
        top: 0;
        left: 0;
        width: 23px;
        height: 23px;
        background: url(../../static/unlike.png) no-repeat;
        background-size: 23px auto;
    }
    .like {
        position: absolute;
        top: 0;
        left: 0;
        width: 23px;
        height: 23px;
        background: url(../../static/like.png) no-repeat;
        background-size: 23px auto;
    }
   .collect {
       position: absolute;
       top: 6px;
       left: 10px;
       width: 22px;
       height: 22px;
    }

    .playSong {
        display: inline-block;
        margin: 5px 0 0 36px;
        width: 24px;
        height: 24px;
        background-image: url(../image/play.png);
        background-size: 24px auto;
    }
    .playSong.playSonging {
        background-image: url(../image/playing.png);
        background-size: 24px auto;
    }
    #MusicList {
        position: relative;
        top: 0;
        left: 0;
        width: 100%;
        height: auto;
        border: 1px solid #dedede;
        border-top: none;
        box-sizing: border-box;
    }
    #MusicList li {
        width: 100%;
        height: 34px;
        font: 10px/34px "微软雅黑";
        color: #333;
    }
    #MusicList li:nth-of-type(even) {
        background: #efeff1;
    }
    #MusicList li:nth-of-type(odd) {
        background: #fafafa;
    }
    #MusicList li * {
        float: left;
    }
    #MusicList li .music_nub {
        width: 60px;
        height: 100%;
        text-indent: 18px;
    }
    #MusicList li p {
        margin: 0 !important;
    }
    #MusicList li a {
        position: relative;
        width: 80px;
        height: 100%;
        padding: 0 10px;
        box-sizing: border-box;
    }
    #MusicList li .music_name {
        width: 200px;
        height: 100%;
        box-sizing: border-box;
        padding: 0 10px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    #MusicList li .singer {
        width: 120px;
        height: 100%;
        box-sizing: border-box;
        padding: 0 10px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    #MusicList li .music_brank {
        width: 220px;
        height: 100%;
        box-sizing: border-box;
        padding: 0 10px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    #MusicList li .music_time {
        width: 70px;
        height: 100%;
        box-sizing: border-box;
        padding: 0 10px;
    }
    #MusicList li .hot {
        position: relative;
        width: 126px;
        height: 100%;
        box-sizing: border-box;
        padding: 0 10px;
    }
    #MusicList li .music_hot {
        position: absolute;
        top: 15px;
        left: 12px;
        width: 80px;
        height: 4px;
        border-radius: 5px;
        background-color: rgba(209, 209, 209, 0.4);
    }
    #MusicList li .music_hotBar {
        position: absolute;
        top: 0;
        left: 0;
        width: 0;
        height: 100%;
        border-radius: 5px;
        background-color: rgba(209, 209, 209,1);
    }
    .musicListSrcoll {
        position: absolute;
        top: 0;
        right: 0;
        width: 4px;
        height: 100%;
    }
    .musicListBar {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 0;
        border-radius: 5px;
        background: rgba(224, 5, 15, 0.3);
    }
    .musicListBar:hover {
        background: rgba(224, 5, 15, 0.6);
    }
    /*404页面*/
    .page404 {
        position: relative;
        width: 100%;
        height: 340px;
        text-align: center;
        border: 1px solid transparent;
        color: #fe2929;
    }
    .page404 p {
        margin-top: 24px;
        width: 100%;
        font: 20px/50px '微软雅黑';
        color: #fe2929;
    }
    .page404 img {
        margin-top: 20px;
        width: 500px;
        height: 177px;
    }
    .page404 span {
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
    .classHover {
        background-color: #fe2929;
        color: #fff;
    }
</style>
