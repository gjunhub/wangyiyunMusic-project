<template>
    <div>
        <el-button type="text" @click="dialogFormVisible = false" v-if="userInfo.id">
            <img :src="userInfo.profile.avatarUrl" alt="" class="avatarUrl">
            {{userInfo.profile.nickname}}</el-button>
        <el-button type="text" @click="dialogFormVisible = true" v-else >登录</el-button>

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
        computed: {
            userInfo() {
                return this.$store.state.userInfo;
            }
        },
        methods: {
            doLogin() {
                this.$store.dispatch('doLogin', this.loginInfo)
                    .then(data => {
                        if (data.code != 200) {
                            this.msg = data.msg || '登录失败';
                            this.dialogFormVisible = true;
                        } else {

                            this.msg = '登录成功';

                            this.$store.commit('updateUserInfo', data);


                            setTimeout(() =>  {
                                this.dialogFormVisible = false;
                                this.$router.push('/');
                            }, 1000);
                        }
                        console.log(1,this.userInfo.profile);
                    });
            }
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
