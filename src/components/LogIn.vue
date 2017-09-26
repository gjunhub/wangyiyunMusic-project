<template>
    <div>
        <el-button type="text" @click="dialogFormVisible = false" v-if="userInfo.id">
            <img :src="userInfo.profile.avatarUrl" alt="" class="avatarUrl">
            {{userInfo.profile.nickname}}</el-button>
        <el-button type="text" @click="dialogFormVisible = true" v-else  ref="LogIn">登录</el-button>

        <el-dialog title="手机号登录" :visible.sync="dialogFormVisible" :top="top">
            <span class="logInDetail">{{msg}}</span>
            <el-form :model="form">
                <el-form-item label="手机号 :" :label-width="formLabelWidth">
                    <el-input v-model="loginInfo.phone" auto-complete="off" placeholder="请输入手机号"></el-input>
                </el-form-item>

                <el-form-item label="密码 :" :label-width="formLabelWidth">
                    <el-input v-model="loginInfo.password" auto-complete="off" type="password" placeholder="请输入密码"></el-input>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="doLogin">登录</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>

    import {mapGetters} from 'vuex'
	export default {
		name: 'logIn',
        props: [],
		data() {
			return {
                dialogFormVisible: false,
                loginInfo: {
                    phone: '',
                    password: ''
                },
                msg: '',
                form: {
                    date1: '',
                    date2: '',
                    delivery: false,
                    type: [],
                    resource: '',
                    desc: ''
                },
                formLabelWidth: '70px',
                top: '45%'
            }
		},
        computed: Object.assign({
            userInfo() {
                return this.$store.state.userInfo;
            }
        },mapGetters([
            'windowHref'
        ])),
        methods: {
            doLogin() {
                this.$store.dispatch('doLogin', this.loginInfo)
                    .then(data => {
                        if (data.code != 200) {
                            this.msg = data.msg || '登录失败';
                            this.dialogFormVisible = true;
                            this.$store.commit('updateIsLog',false);//表示没有登录
                        } else {

                            this.msg = '登录成功';

                            this.$store.commit('updateUserInfo', data);
                            this.$store.commit('updateIsLog',true);//表示已经登录了

                            setTimeout(() =>  {
                                this.dialogFormVisible = false;
//                                this.$router.push('/' + this.windowHref);
                            }, 1000);
                        }
                        console.log(1,this.userInfo.profile);
                    });
            }
        },
        mounted() {
//		    console.log('asdasd',this.$refs.LogIn);
            /*
            * 在这个子组件中将这个ref登录元素给存到store管理中，方便其他页面能用获取到
            * 这个元素，并且其他页面能点击到这个子组件的登录按钮，--例：我的音乐页面未登录
            * 按钮点击后，让其点击的功能和当前页面的登录按钮一致--说白了，就是子组件的元素
            * 其他页面获取不到，就要在store存一下，给其他页面调用
            * */
		    this.$store.commit('updateLogInElement',this.$refs.LogIn);
        }
	}
</script>

<style>
    .el-dialog__body {
        padding: 30px 30px 5px;
    }
    .el-dialog {
        border-radius: 8px;
    }
    .el-dialog__wrapper {
        background: rgba(7, 3, 3, 0.47);
    }
    /*登录框的宽度*/
    .el-dialog--small {
        min-width: 300px;
        position: relative;
        top: 50%;
        width: 28%;
        transform: translate(-50%,-50%);
    }
    .el-input__inner {
        width: 85%;
    }
    .el-dialog__footer {
        text-align: center;
        padding: 10px 15px 20px;
    }
    .el-button--primary {
        background: linear-gradient(rgba(254, 99, 97, 0.93),#ee000e);
        border-color: #ee000e;
    }
    .el-button--primary:hover {
        background: linear-gradient(#ee000e, rgba(254, 54, 56, 0.93));
        border-color: #ee000e;
    }
    .logInDetail {
        position: absolute;
        top: 10%;
        left: 50%;
        width: 60px;
        transform: translateX(-50%);
    }
    .el-button--text {
        text-indent: 36px;
        width: 50px;
        position: relative;
    }
    .el-button--text:hover {
        text-decoration: underline;
    }
    .avatarUrl {
        position: absolute;
        top: 0;
        left: 0;
        width: 28px;
        height: 28px;
        vertical-align: top;
        border-radius: 50%;
        padding: 1.5px;
        border: 1px solid #fff;
    }
</style>
