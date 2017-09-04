<template>
    <section class="searchSection">
        <div class="musicSearch">
            <input type="text" :value="IndexValue" class="S_text" placeholder="请输入单曲">
            <a href="javascript:;" class="toSearch"></a>
        </div>
        <div class="searchMusic">
            <p v-if="SearchCount != ''">搜索"{{IndexValue}}"，找到 <span class="musicTotal">{{SearchCount}}</span> 首单曲</p>
            <div id="detail">
                <span v-for="detail,index in details" :key="index">{{detail}}</span>
            </div>
            <ul id="MusicList">
                <li v-for="song ,index in SearchListPage">
                    <span class="music_nub">{{index + 1 | addZero}}</span>
                    <a href="javascript:;">
                        <input type="checkbox">
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
            <my-page :pages="SearchCount"
                     :counts="count"
                     :limitstart.sync="limitFirst"
                     :limitend.sync="limitLast">
            </my-page>
        </div>
    </section>
</template>

<script>
    import songTime from '@/filters/songTime'
    import addZero from '@/filters/addZero.js'
    import myPage from '@/components/page'

	export default {
		name: 'search',
        props:[''],
        data() {
		    return {
                details: ['','操作','音乐标题','歌手','专辑','时长','热度'],
                SearchSongUrl: '',
                songId: '',
                limitFirst: 0,//分页第一页第一个
                limitLast: 30,//分页第一页的最后个
                playTotal: 0,//音乐总数
                count: 30,//一页显示20个
            }
        },
        computed: {
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
        },
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
    .musicSearch {
        width: 100%;
        height: 80px;
        padding: 50px 0 15px;
        text-align: center;
    }
    .S_text {
        outline: none;
        display: inline-block;
        vertical-align: top;
        width: 240px;
        height: 42px;
        border-radius: 8px 0 0 8px;
        border: none;
        border: 1.25px solid #c7c7c7;
        border-right: none;
        padding: 5px 20px;
        box-sizing: border-box;
        text-align: center;
    }
    .toSearch {
        display: inline-block;
        vertical-align: top;
        width: 50px;
        height: 42px;
        border: 1.25px solid #c7c7c7;
        border-radius: 0 8px 8px 0;
        margin-left: -5px;
        box-sizing: border-box;
        background: rgba(199, 199, 199, 0.85) url(../image/search.png) no-repeat center ;
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
    .playSong {
        display: inline-block;
        margin-top: 6px;
        width: 22px;
        height: 22px;
        background-image: url(../image/play.png);
        background-size: 22px auto;
    }
    .playSong.playSonging {
        background-image: url(../image/playing.png);
        background-size: 22px auto;
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
</style>
