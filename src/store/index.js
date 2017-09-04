
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
            musicName: ''
        }
    },

    getters: {

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
            return fetch('/api/search?keywords=' + data + '&limit=22')
                .then(res => {
                    return res.json();
                });
        }
    }


});

export default store
