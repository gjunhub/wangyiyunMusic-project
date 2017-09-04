<template>
    <div class="mt20">

        <el-row :gutter="24">
            <el-col :span="22" :offset="1">

                <el-card class="box-card" style="height: auto;">
                    <div slot="header" class="clearfix">

                        <div class="cover">
                            <img :src="playList.coverImgUrl">
                        </div>
                        <div class="detail">
                            <span @click="know">歌单</span>

                            <img src="../image/m-tab.png" alt="" class="songList">

                            <h1>{{playList.name}}</h1>
                            <p>
                                <img :src="playList.creator && playList.creator.avatarUrl" class="avatar" alt="">
                                <strong>{{playList.creator && playList.creator.nickname}}</strong><time>{{playList.createTime | transform('y年m月d日 H:i:s')}} 创建</time>
                            </p>
                            <div class="songMessage">
                                <div class="tableTag">标签:
                                    <a href="javascript:;" v-for="tag in playList.tags">{{tag}}</a>
                                </div>
                                <p>
                                    <b>介绍:</b>
                                    {{playList.description}}
                                </p>
                            </div>

                        </div>


                    </div>

                    <el-tabs v-model="activeName" @tab-click="handleClick">
                        <el-tab-pane label="歌曲列表" name="list">

                           <div class="commentList">
                               <header>
                                   <span v-for="nav in headerNav">{{nav}}</span>
                               </header>
                               <ul id="musicList">
                                   <li  v-for="track,index in showList" :key="track.id" >
                                       <span class="nowPlay">{{index + limitStart + 1}}
                                           <i class="ico"
                                              @click="playMusic(track.id,track.al.picUrl,track.name)"
                                              :class="{nowPlaying: track.id == musicClickID}"
                                           ></i>
                                       </span>
                                       <strong>{{track.name}}</strong>
                                       <span class="playTime">{{track.dt | songTime}}</span>
                                       <span class="singer">{{track.ar[0].name}}</span>
                                       <span class="albums">{{track.al.name}}</span>
                                   </li>
                               </ul>
                           </div>

                        </el-tab-pane>

                        <el-tab-pane label="评论" name="comment">
                            <ul class="commentList">
                                <li v-for="comment,index in comments">
                                    <img :src="comment.user && comment.user.avatarUrl" alt="" style="width: 30px;">
                                    <span>{{comment.user && comment.user.nickname}}:</span>
                                    <span>{{comment.content}}</span>
                                </li>
                            </ul>
                        </el-tab-pane>

                    </el-tabs>

                </el-card>

            </el-col>
        </el-row>
        <my-page :pages="playCount"
                 :counts="count"
                 :limitstart.sync="limitStart"
                 :limitend.sync="limitEnd">
        </my-page>
    </div>

</template>

<script>

    import transform from '@/filters/transform'
    import songTime from '@/filters/songTime'
    import myPage from '@/components/page'
    import playNow from '@/components/playNow'

    export default {
        name: 'Personalized',

        data() {
            return {
                headerNav: [' ','歌曲标题','时长','歌手','专辑'],
                activeName: 'list',
                playList: {
                        name: '正在获取中……',
                        createTime: '获取中…'
                },
                comments: {
                    content: '精彩评论加载中'
                },
                limitStart: 0,//分页第一页第一个
                limitEnd: 20,//分页第一页的最后个
                playCount: 0,//音乐总数
                count: 20,//一页显示20个
                RecommedmusicUrl: '',//获取当前这首歌的url
                musicClickID: ''//检测点击了哪一首歌，让这首歌的播放按钮点亮
            }
        },
        components: {
            myPage
        },
        computed: {
            showList() {
                let nowList = this.playList.tracks || [];
                return nowList.slice(this.limitStart,this.limitEnd);

            }
        },
        created() {

            fetch('/api/playlist/detail?id=' + this.$route.params.id)
                .then( response => {
                    return response.json();

                } )
                .then( result => {
                    console.log('d',result);

                    this.playList = result.playlist;
                    this.playCount = result.playlist.tracks.length;
                    console.log('a',this.playList,this.playCount,'e',this.limit);
                });//获取歌单音乐列表

            fetch('/api/comment/playlist?id=' + this.$route.params.id)
                .then( response => {
                    return response.json();

                } )
                .then( data => {
                    console.log('c',data);

                    this.comments = data.comments;
                    console.log(this.comments);
                });//获取歌单评论
        },
        methods: {
            handleClick() {
                console.log(this.activeName);
            },
            know() {
                console.log(this.limitStart,this.limitEnd);
            },
            //根据音乐id获取对应的URl
            playMusic(id,img,name) {
                console.log(1);
                fetch('api/music/url?id=' + id)
                    .then(response => {
                        return response.json();
                    }).then(data => {
                    this.RecommedmusicUrl = data.data[0].url;
                    console.log('x',this.RecommedmusicUrl,data);
                //下面数组将推荐歌单中的当前播放的歌曲url和img,name传到store中。
                    let musicUrl_Img = [this.RecommedmusicUrl,img,name];
                    this.$store.commit('setMusicUrl',musicUrl_Img);
                    console.log(musicUrl_Img,'139');
                });
                this.musicClickID = id;
            }
        },
        filters: {
            transform,
            songTime
        }
    }
</script>

<style>
    img {
        vertical-align: top;
    }
    a {
        text-decoration: none;
    }
    .clearfix:after {
        content: '';
        display: block;
        clear: both;
    }
    .mt20 .el-col {
        height: auto;
    }
    .mt20 {
        width: 1000px;
        margin: 0 auto;
    }
    .cover {
        float: left;
    }
    .cover img {
        width: 200px;
        padding: 4px;
        border: 1px solid #e3e3e3;
    }
    .commentList {
        border: 1px solid #ddd;
        border-top: 3px solid #ee000e;
    }
    .commentList header {
        width: auto;
        height: 40px;
        color: #333;
        border-bottom: 1.5px solid #e1e1e1;
        background: linear-gradient(#ffffff, #f1f1f1);
    }
    .commentList header span {
        float: left;
        width: 80px;
        height: 100%;
        text-indent: 10px;
        border-right: 1.5px solid #e1e1e1;
        font: 13px/40px "微软雅黑";
    }
    .commentList header span:nth-of-type(2) {
        width: 200px;
    }
    .commentList header span:nth-of-type(3) {
        width: 140px;
    }
    .commentList header span:nth-of-type(4) {
        width: 150px;
    }
    .commentList header span:nth-of-type(5) {
        width: 120px;
        border-right: none;
    }
    .detail {
        position: relative;
        float: left;
        margin-left: 20px;
    }
    .detail .songList {
        margin-right: 5px;
        float: left;
    }
    .detail h1 {
        float: left;
        font: 20px "微软雅黑";
        margin: 0;
    }
    .detail p {
        margin: 42px 0 0 0 ;
    }
    .detail p strong {
        font: 12px/36px "微软雅黑";
        margin: 0 14px 0 14px;
        color: #0c73c2;
        cursor: pointer;
    }
    .detail p time {
        font: 12px/20px '微软雅黑';
    }
    .detail span:nth-of-type(1) {
        position: absolute;
        top: 3px;
        left: 6px;
        color: #fff;
        font: lighter 12px/20px "微软雅黑";
    }
    .songMessage {
        margin-top: 10px;
        width: 428px;
        height: 130px;
        font: 12px/20px '微软雅黑';
        overflow: hidden;
    }
    .songMessage a {
        display: inline-block;
        padding: 0 8px;
        height: 18px;
        font: 12px/18px '微软雅黑';
        color: #666;
        border-radius: 15px;
        border: 1px solid #ccc;
        margin-right: 8px;
        text-align: center;
        background: linear-gradient(#f8f8f8, #dcdcdc);
    }
    .songMessage p {
        margin: 0;
    }
    .songMessage .tableTag {
        margin: 5px;
        margin-left: 0;
    }
    .avatar {
        width: 36px;
    }
    #musicList {
        list-style: none;
        padding: 0;
        margin: 0;
    }
    #musicList li {
        width: 100%;
        height: 40px;
        padding-right: 30px;
        box-sizing: border-box;
        line-height: 40px;
        color: #333;
    }
    #musicList li * {
        float: left;
        text-indent: 14px;
    }
    #musicList li .nowPlay {
        position: relative;
        width: 80px;
        color: #333;
    }
    #musicList li .albums {
        width: 200px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }
    #musicList li .singer {
        width: 150px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }
    #musicList li .playTime {
        width: 140px;
    }
    #musicList .nowPlay .ico {
        position: absolute;
        content: '';
        top: 8px;
        left: 40px;
        width: 24px;
        height: 24px;
        background-image: url(../image/play.png);
        background-size: 24px auto;
        cursor: pointer;
    }
    #musicList .nowPlay .ico:hover,
    #musicList .ico.nowPlaying {
        background-image: url(../image/playing.png);
        background-size: 24px auto;
    }
    #musicList li strong {
        width: 200px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-weight: normal;
    }
    #musicList li i {
        float: right;
        line-height: 40px;
        color: #ff7071;
        cursor: pointer;
    }
    #musicList li:nth-of-type(odd) {
        background: #fafafa;
    }
    .commentList {
        list-style: none;
        padding: 0;
        margin: 0;
    }
    .commentList li {
        width: 100%;
        height: 40px;
        padding-bottom: 8px;
        font: 12px/20px '微软雅黑';
    }
    .commentList li span:nth-of-type(1) {
        color: #ee000e;
    }
    .commentList li span:nth-of-type(2) {
        margin-top: -5px;
    }
    .commentList li img {
        float: left;
        vertical-align: top;
        margin-right: 5px;
    }
    .el-menu--horizontal>.el-menu-item:hover, .el-menu--horizontal>.el-submenu.is-active .el-submenu__title, .el-menu--horizontal>.el-submenu:hover .el-submenu__title {
        border-bottom: 4px solid #ee000e;
    }
</style>

