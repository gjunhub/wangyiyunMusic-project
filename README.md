# 仿网易云pc页面
vue,vuex,vue-router,vux,element.eleme.io,fetch，API接口数据来自
https://github.com/Binaryify/NeteaseCloudMusicApi

# 克隆到本地

```
https://github.com/gjunhub/wangyiyunMusic-project
```

# 安装依赖
```
npm install
或者
yarn install
```
# 运行，自动打开服务器
```
npm run dev  --本地服务器localhost:3000
```
# 发布环境
```
npm run build（开发环境不需要执行）
```

# 技术栈
```
vue,vuex,vue-router,fetch,webpack,Es6的解构赋值,箭头函数
```


# 实现项目功能一览

### 跨域请求数据 => 已设置后端代理
- [x] fetch

### 登录
- [x] 利用网易云API登录接口，发送登录请求

### 搜索歌曲
- [x] 首页导航栏填写歌曲名字，既可路由跳转到搜索的歌曲列表


### 推荐歌单
- [x] 点击不同歌单，利用vue中动态路由跳转到同页面不同数据的路由页面

### 分页
- [x] 歌单详情页歌曲数目过多，利用element组件分页组件功能，将歌曲动态划分成多页

### 自定义播放器
- [x] 利用vue自定义指令Vue.directive，使用H5新增音频视频功能，自定义编写音乐控制播放器


## 项目详情--后期还会继续完善
> 1. 多个页面布局，vue-router跳转

> 2. 搭建好页面并分配好各个组件和跑通整个流程，

> 3. 开始编写入口文件和路由还有store仓库

> 4. 仿网易云功能登录、搜索，收藏功能，如下
     - vuex 的store 下，存储各组件共享数据，并管理和维护共享数据的更新，修改；分布式管理和统一导出，方便管理和维护
     - routers 放置配置好的路由
     - filters 放置过滤器(管道副)
     - components 放的是整个项目用到的自定义组件和项目组件
     - assets 是静态资源管理文件

> 5. 搜索/search实现了用户搜索功能

> 6. 用户登录功能
       - 登录:/login

> 7. 模拟收藏歌曲 - 利用vuex来处理多页面共享同一状态or数据



## 一些注意事项

项目中使用了时光网的接口，存在跨域请求的问题，在开发环境下需要在`config/index.js`中的`dev`下添加以下配置即可解决
```
 proxyTable: {
      '/api': {
        target: 'http://localhost:3000',
        pathRewrite: {
          '^/api': '/'
        }
      }
    }
```

实际环境中，请求数据时编写以下代码
```
updateNewAlbum({commit}) {
    fetch('/api/top/album?offset=0&limit=5').then(response => {
        return response.json();
    }).then(data => {
        console.log(data.albums,'新碟上架');
        commit('updateAlbumsLists',data.albums);
    });
}
```

`vuex`状态管理位于`src/store`目录下

`vue-router`路由配置管理位于`src/router`目录下

自定义过滤器位于`src/filters/`目录下

网易云音乐接口来源于[https://github.com/Binaryify/NeteaseCloudMusicApi](https://github.com/Binaryify/NeteaseCloudMusicApi)