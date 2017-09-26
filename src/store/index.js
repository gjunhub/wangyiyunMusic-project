
import Vue from 'vue';
import Vuex from 'vuex'

Vue.use(Vuex)


const store = new Vuex.Store({

    state: {
        userInfo: {
            id: '',
            userName: '',
            profile: {}
        },
        inedxValue: '',
        SearchCount: '',
        searchList: [],
        musicPlaying: {//歌单页面 + 搜索页面的点击播放当前歌曲的信息 链接地址 图 歌名
            musicUrl: '',
            musicImg: '',
            musicName: '',
        },
        AlbumLists: [],//新碟上架数据 - 数组
        isLoging: false,//是否登录成功
        LoginElement: '',//获取子组件的登录按钮这个元素,给我的音乐中的立即登录绑定在一起
        userLikeMusics: [],//用户喜欢的歌曲 - 数组
        windowHref: '',//记录登陆成功前的那个页面
    },

    getters: {
        AlbumLists:state => state.AlbumLists,//新碟上架数据 - 数组
        LoginElement:state => state.LoginElement,//获取子组件的登录按钮这个元素,给我的音乐中的立即登录绑定
        // 在一起
        inedxValue:state => state.inedxValue,
        isLoging:state => state.isLoging,

        userLikeMusics: state => state.userLikeMusics,//用户喜欢的歌曲 - 数组

        windowHref:state => state.windowHref, //记录登陆成功前的那个页面
    },

    mutations: {
        updateUserInfo(state, data) {
            state.userInfo = {
                id: data.account.id,
                userName: data.account.userName,
                profile: data.profile
            };
        },
        setInedxValue(state,data) {
            state.searchList = data[0];
            state.inedxValue = data[1];
            state.SearchCount = data[2];
        },
        setMusicUrl(state,data) {
            state.musicPlaying.musicUrl = data[0];
            state.musicPlaying.musicImg = data[1];
            state.musicPlaying.musicName = data[2];
        },
        //新碟上架
        updateAlbumsLists(state,data) {
            state.AlbumLists = data;
        },
        //获取子组件的登录按钮这个元素,给我的音乐中的立即登录绑定在一起
        updateLogInElement(state,ele) {
            state.LoginElement = ele;
        },
        //是否登录成功
        updateIsLog(state,data) {
            state.isLoging = data;
        },
        //用户点击喜欢按钮后，将喜欢的歌曲存进数组
        updateUserLikeMusics(state,data) {

/*
* 因为用户可能重复喜欢同一首歌，所以逻辑：(1)forEach循环每一项，和传进来的一样就return，不一样就push。
* (2)每次传进来先大清洗，将传进来的这项和元数组比较，用filter，不管有没有都清掉，然后在后面再重新添加
* 这样也不会重复.----嘿嘿~个人喜欢第二种(哟吼吼比较粗暴的写法)
* */
            state.userLikeMusics = state.userLikeMusics.filter(item => {
                if(item.id == data.id) {
                    return false;
                }
                return true;
            });

            state.userLikeMusics = [...state.userLikeMusics,...[data]];
            console.log(state.userLikeMusics,'用户喜欢的歌曲');
        },
//已经喜欢后，用户又点击喜欢按钮，将之前喜欢的歌曲在数组移除
        removeUserLikeMusics(state,id) {
           state.userLikeMusics = state.userLikeMusics.filter(item => {
               if(item.id == id) {
                   return false;
               }
               return true;
           });
        },
        //记录登陆成功前的那个页面
        updateWindowHref(state,data) {
            state.windowHref = data;
        }
    },

    actions: {
        doLogin(store, data) {
            return fetch('/api/login/cellphone?phone='+ data.phone +'&password=' + data.password)
                .then(res => {
                    return res.json();
                });
        },
        getSearchList(store, data) {
            //api中搜索的offset不起作用
            return fetch('/api/search?keywords=' + data + '&limit=20' + '&offset=' + 50)
                .then(res => {
                    return res.json();
                });
        },

        //首页的新碟上架
        updateNewAlbum({commit}) {
            fetch('/api/top/album?offset=0&limit=5').then(response => {
                return response.json();
            }).then(data => {
                console.log(data.albums,'新碟上架');
                commit('updateAlbumsLists',data.albums);
            });
        },
    }


});

export default store
