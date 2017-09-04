import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import My from '@/components/My'
import Friend from '@/components/Friend'
import Store from '@/components/Store'
import Recruit from '@/components/Recruit'
import Download from '@/components/Download'
import Recommedlist from '@/components/Recommedlist'
import LogIn from '@/components/LogIn'
import Search from '@/components/Search'


Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'Index',
            component: Index
        },
        {
            path: '/my',
            name: 'My',
            component: My
        },
        {
            path: '/friend',
            name: 'Friend',
            component: Friend
        },
        {
            path: '/store',
            name: 'Store',
            component: Store
        },
        {
            path: '/recruit',
            name: 'Recruit',
            component: Recruit
        },
        {
            path: '/download',
            name: 'Download',
            component: Download
        },
        {
            path: '/recommedlist/:id',
            name: 'Recommedlist',
            component: Recommedlist
        },
        {
            path: '/login',
            name: 'LogIn',
            component: LogIn
        },
        {
            path: '/search/:value',
            name: 'Search',
            component: Search
        }


    ]
})
