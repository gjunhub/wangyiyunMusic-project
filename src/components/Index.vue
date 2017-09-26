<template>
  <div class="index">
      <div class="indexContainer">
             <div class="indexBanner">
                 <el-carousel :interval="5000" arrow="always">
                     <el-carousel-item v-for="item,index in carousel" :key="index">
                         <img :src="item.pic" alt="" class="el-carousel-img">
                     </el-carousel-item>
                 </el-carousel>
             </div>
            <div class="indexComment">
                <h3>热门推荐</h3>
                <ul>
                    <li v-for="song, index in recommendMusic" :key="index">
                        <img :src="song.picUrl" alt="" class="recommendMusicImg">
                        <p
                          class="recommendMusicDesc"
                          @click="toRecommendMusic(song.id)"
                      >{{song.name}}</p>
                        <span class="play"></span>
                        <span class="recommendMusicMask"></span>
                        <time class="time">{{song.playCount | musicTime}}</time>
                        <router-link
                          :to="{name:'Recommedlist',params:{id:song.id}}"
                          class="toRecommendMusic"
                      ></router-link>
                    </li>
                </ul>
            </div>
          <div class="newAlbum">
            <h3>榜单</h3>
              <a href="javascript:;" class="arrowL"></a>
              <a href="javascript:;" class="arrowR"></a>
            <ul>
                <li v-for="album ,index in AlbumLists"
                    :key="index"
                    @mouseover="show(index)"
                    @mouseout="hide"
                >
                    <img :src="album.blurPicUrl" alt="">
                    <span></span>
                    <em class="play"
                        v-show="hoverIndex == index"
                    ></em>
                    <p>{{album.name}}</p>
                    <strong>{{album.artist.name}}</strong>
                    <router-link
                        :to="{name: 'Recommedlist',params:{id: album.id}}"
                        class="albumTotoRecommendMusic"
                    ></router-link>
                </li>
            </ul>
          </div>
      </div>
      <footer class="mscFooter">
          <div class="Footer clearFix">
              <a href="#" class="joinUs">
                  <span class="joinUsSpan">独立音乐人招募计划</span>
                  <span class="joinUsSpan2">加入我们 即将与超过亿万乐迷互动</span>
              </a>
              <a href="#" class="subJoinUs">
                  <span class="joinUsSpan">音乐专栏招募计划</span>
                  <span class="joinUsSpan2">加入我们 与同道中人交流心得</span>
              </a>
              <a href="#">
                  <div class="about">
                      <p>
                          <a href="#">关于网易</a>-<a href="#">客户服务</a>-<a href="#">服务条款</a>-<a href="#">网站导航</a> <span>网易公司版权所有©1997-2017</span>
                      </p>
                      <p>
                          <span>杭州乐读科技有限公司运营：</span><a href="#">浙网文[2015]0415-135号</a><a href="#" class="aboutA">意见反馈</a>
                      </p>
                  </div>
              </a>
          </div>
      </footer>
  </div>
</template>


<script>

    import {mapGetters} from 'vuex'
    import musicTime from '@/filters/musicTime';

export default {
  name: 'index',
  data() {
    return {
      carousel: [],
      recommendMusic: [],
        hoverIndex: -1,
    }
  },
    computed: mapGetters([
        'AlbumLists'
    ]),
  created() {
      //首页的banner
    fetch('/api/banner').then(response => {//获取banner
      return response.json();
    }).then(data => {
      console.log(data);
      this.carousel = data.banners;
    });

    //首页的推荐歌单
    fetch('/api/personalized').then( response => {
      return response.json();
    }).then( data => {
      console.log(data);
      console.log(data,'推荐歌单');
      this.recommendMusic = data.result;
    });

    //首页新碟上架
    this.$store.dispatch('updateNewAlbum');
  },
    methods: {
        toRecommendMusic(id) {
            this.$router.push('Recommedlist/' + id);
        },
        show(index) {
            this.hoverIndex = index;
        },
        hide() {
            this.hoverIndex = -1;
        }
    },
    filters: {
        musicTime
    }
}
</script>

<style>
    h3 {
        margin: 0;
    }
    ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }
    .index {
       width: 100%;
        background-color: #f5f5f5;
    }
    .indexContainer {
        width: 1000px;
        margin: 0 auto;
        height: auto;
    }
    .indexBanner {
        width: 100%;
        height: 300px;
    }
    .el-carousel__item {
        width: 100%;
        height: 300px;
    }
    .el-carousel-img {
        width: 100%;
        height: auto;
    }
    .indexComment {
        width: 100%;
        height: auto;
        background-color: #fff;
        padding: 0 15px 15px;
        box-sizing: border-box;
    }
    .indexComment h3 {
        width: 100%;
        text-indent: 10px;
        font: 18px/50px '微软雅黑';
    }
    .indexComment ul {
        width: 100%;
        height: 560px;
        border-top: 2px solid #c10d0c;
    }
    .indexComment ul li {
        position: relative;
        float: left;
        width: 20%;
        height: 280px;
        box-sizing: border-box;
        padding: 20px 0;
        margin: 0 2.4%;
    }
    .recommendMusicImg {
        position: relative;
        display: block;
        width: 100%;
        height: auto;
        border: 1px solid #ccc;
        box-sizing: border-box;
        padding: 1px;
    }
    .indexComment ul li::after {
        content: '';
        position: absolute;
        z-index: 97;
        top: 20px;
        left: 0;
        width: 194px;
        height: 194px;
        background: url(../../static/opacity.png) no-repeat;
        background-size: 194px auto;
    }
    .recommendMusicDesc {
        display: block;
        margin-top: 8px;
        padding: 0 8px;
        box-sizing: border-box;
        letter-spacing: 1px;
        font: 18px/26px '微软雅黑';
    }
    .recommendMusicDesc:hover {
        text-decoration: underline;
    }
    .recommendMusicMask {
        position: absolute;
        z-index: 99;
        width: 190px;
        top: 172px;
        left: 2px;
        height: 40px;
        background: rgba(0, 0, 0, .4);
    }
    .indexComment .time {
        position: absolute;
        z-index: 100;
        top: 180px;
        left: 16px;
        font: 18px/26px '微软雅黑';
        color: #fff;
    }
    .indexComment ul li .play {
        position: absolute;
        z-index: 100;
        top: 182px;
        right: 16px;
        width: 20px;
        height: 20px;
        background: url(../../static/play-hover.png) no-repeat;
        background-size: 20px auto;
    }
    .toRecommendMusic {
        opacity: 0;
        position: absolute;
        top: 20px;
        z-index: 101;
        width: 100%;
        height: 220px;
        top: 0;
        left: 0;
    }
    /*新碟上架*/
    .newAlbum {
        width: 100%;
        height: auto;
        background-color: #fff;
        padding: 0 15px;
        box-sizing: border-box;
    }
    .newAlbum h3 {
        width: 100%;
        text-indent: 10px;
        font: 18px/50px '微软雅黑';
        border-bottom: 2px solid #c10d0c;
    }
    .newAlbum ul {
        margin-top: 20px;
        width: 100%;
        height: 260px;
        padding: 25px;
        box-sizing: border-box;
        background-color: #f9f9f9;
        border: 1px solid #eee;
    }
    .newAlbum ul li {
        position: relative;
        float: left;
        width: 18%;
        padding: 0 2.5% 0 0;
    }
    .newAlbum ul li:nth-of-type(5) {
        padding: 0;
    }
    .newAlbum li img {
        width: 94%;
        height: auto;
    }
    .newAlbum span {
        position: absolute;
        z-index: 100;
        top: 0;
        left: 0;
        width: 178px;
        height: 178px;
        background: url(../../static/CD.png) no-repeat;
        background-size: 178px auto;
    }
    .newAlbum p {
        display: block;
        padding: 0 8px;
        box-sizing: border-box;
        letter-spacing: 1px;
        text-align: center;
        font: 18px/26px '微软雅黑';
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .newAlbum strong {
        display: block;
        padding: 0 8px;
        width: 100%;
        box-sizing: border-box;
        font-weight: normal;
        font: 16px/26px '微软雅黑';
        text-align: center;
        color: #999;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .newAlbum .play {
        position: absolute;
        top: 124px;
        left: 16px;
        height: 30px;
        width: 30px;
        background: url(../../static/play1.png) no-repeat;
    }
    .albumTotoRecommendMusic {
        opacity: 0;
        position: absolute;
        z-index: 1000;
        top: 0;
        left: 0;
        width: 100%;
        height: 186px;
        background-color: #fff;
    }

    /*footer的代码开始*/
    .mscFooter {
        background: #f9f9f9;
    }
    .mscFooter .Footer {
        font: 12px/22px "微软雅黑";
        width: 982px;
        padding: 29px 60px 52px 58px;
        margin: 0 auto;
    }
    .Footer .joinUs {
        float: left;
        width: 270px;
        margin-right: 31px;
        background: url(../../static/plan.png) no-repeat 6px 5px;
        color: #666;
    }
    .joinUsSpan {
        display: inline-block;
        padding: 0 105px 0 54px;
    }
    .joinUsSpan2 {
        display: inline-block;
        padding: 0 0 0 54px;
        color: #999;
    }
    .Footer .subJoinUs {
        float: left;
        width: 270px;
        margin-right: 29px;
        background: url(../../static/plan2.png) no-repeat 6px 3px;
        color: #666;
    }
    .Footer .about {
        float: right;
        width: 382px;
    }
    .about span {
        color: #999;
    }
    .about a {
        color: #666;
    }
    .aboutA {
        display: inline-block;
        width: 48px;
        padding-left: 22px;
        margin-left: 15px;
        background: url(../../static/view.png) no-repeat left 5px;
    }
</style>
