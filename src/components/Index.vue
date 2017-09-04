<template>
  <div class="index">
    <el-carousel :interval="4000" type="card" height="200px">
      <el-carousel-item v-for="item,index in carousel" :key="index" class="el-carousel-banner">
        <img :src="item.pic" alt="" class="el-carousel-img">
      </el-carousel-item>
    </el-carousel>
    <el-row>
      <el-col :span="3" v-for="(song,index) in recommendMusic" :key="song.id" :offset="index == 0 ? 0 : 1">
        <el-card :body-style="{ padding: '0px' }">
          <img :src="song.picUrl" class="image">
          <div style="padding: 14px;">
            <span>{{song.name}}</span>
            <div class="bottom clearfix">
              <time class="time">{{song.playCount | musicTime}}</time>
              <router-link :to="{name:'Recommedlist', params:{id: song.id}}">查看歌单</router-link>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>


<script>

    import musicTime from '@/filters/musicTime';

export default {
  name: 'index',
  data() {
    return {
      carousel: [],
      recommendMusic: []
    }
  },
  created() {
    fetch('/api/banner').then(response => {//获取banner
      return response.json();
    }).then(data => {
      console.log(data);
      this.carousel = data.banners;
    });

    fetch('/api/personalized').then( response => {
      return response.json();
    }).then( data => {
      console.log(data);
      this.recommendMusic = data.result;
    });
  },
    filters: {
        musicTime
    }
}
</script>

<style>
  .el-carousel-banner {
    height: 200px;
    width: 760px;
  }
  .el-carousel-img {
    width: auto;
    height: auto;
  }
  .el-carousel__item h3 {
    color: #475669;
    font-size: 18px;
    opacity: 0.75;
    line-height: 300px;
    margin: 0;
  }
  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }

  .el-col {
    height: 300px;
  }

  .el-card {
    height: 280px;
  }

  .carousel-img {
    width: 100%;
  }

  .time {
    font-size: 13px;
    color: #999;
  }

  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    width: 100%;
    display: block;
  }
</style>
