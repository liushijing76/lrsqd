<template>
    <div>
        <el-row>
            <h1 id="h1" ref="h1" style="margin-top:50px;margin-bottom: 60px">借款还款系统登录</h1>
            <el-col :span="8" :offset="8">
                <!-- ref属性,可以通过这个属性获取DOM元素,是vue的属性
                model属性:表示表单不绑定的数据,是一个对象
        -->
                <el-form ref="form" :rules="rules" :model="loginForm" label-width="80px">
                    <el-form-item label="用户名" prop="uname">
                        <!-- v-model 双向绑定 -->
                        <el-input v-model="loginForm.uname" placeholder="请输入用户名"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <!-- show - password 添加了这属性后,输入框会被渲染为密码框-->
                        <el-input v-model="loginForm.password" placeholder="请输入密码" show-password></el-input>
                    </el-form-item>

                    <el-button type="primary" @click="tologin">登录</el-button>

                </el-form>
            </el-col>
        </el-row>

    </div>
</template>

<script>
    export default {
        name: "Login",
        data() {
            return {
                msg:"你好",
                loginForm: {
                    uname: "",
                    password: ""
                },
                rules: {
                    uname: [
                        { required: true, message: '请输入用户名', trigger: 'blur' },
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                    ]
                }
            }
        },
        methods: {
            tologin() {
                this.$refs["form"].validate((valid) => {
                    //valid为boolean类型,通过校验valid值为true,未通过,值为false
                    if (!valid) {
                        return
                    }
                    this.$http.post("/login", this.loginForm).then((res) => {
                        if (res.data == "success") {

                            //将用户名存储到session中
                            sessionStorage.setItem("uname", this.loginForm.uname)
                            //调到管理员页面
                            this.$router.push("/adminHome")
                        } else if (res.data == "success02") {
                            sessionStorage.setItem("uname", this.loginForm.uname)
                            //调到员工页面
                            this.$router.push("/empHome")
                        } else if (res.data == "success03") {
                            sessionStorage.setItem("uname", this.loginForm.uname)
                            //调到经理页面
                            this.$router.push("/managerHome")
                        } else if (res.data == "success04") {
                            sessionStorage.setItem("uname", this.loginForm.uname)
                            //调到财务页面
                            this.$router.push("/financeHome")
                        } else {
                            this.$message.error('账号或密码错误');
                        }
                    })
                })
            }
        }
    }
</script>

<style scoped>

</style>