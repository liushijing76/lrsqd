<template>
    <div>
        <el-container>
            <el-header class="el-header">
                <span>&nbsp;&nbsp;&nbsp;借款还款系统</span>
                <span style="float: right">欢迎您管理员:{{uname}}</span>
            </el-header>
            <el-container>
                <el-aside width="200px" >
                    <!--  :router="true  开启vue-router,以index的值作为path进行路由跳转 -->
                    <el-menu
                            default-active="/empManage"
                            class="el-menu-vertical-demo"
                            :router="true"
                    >
                        <el-menu-item index="/empManage">
                            <!--通过修改class可以修改图标-->
                            <i class="el-icon-user"></i>
                            <span slot="title">员工管理</span>
                        </el-menu-item>

                        <el-menu-item index="/deptManage">
                            <i class="el-icon-s-home"></i>
                            <span slot="title">部门管理</span>
                        </el-menu-item>
                        <el-submenu index="1">
                            <template slot="title">
                                <i class="el-icon-location"></i>
                                <span>信息维护</span>
                            </template>
                            <el-menu-item-group>

                                <el-menu-item index="/infoMaintenance"><i class="el-icon-s-tools"></i>借款类型</el-menu-item>
                            </el-menu-item-group>
                        </el-submenu>

                    </el-menu>
                </el-aside>
                <el-container>
                    <el-main>
                        <router-view></router-view>
                    </el-main>
                </el-container>
            </el-container>
        </el-container>
    </div>
</template>

<script>
    export default {
        name: "AdminHome.vue",
        data() {
            return {
                uname:sessionStorage.getItem("uname")
            }
        },
    }
</script>

<style scoped>
    .el-main {
        background-color: #eaedf1;
    }
    .el-container {
        height: 100%;
    }
    /*头部样式*/
    .el-header {
        background-color: #65caff;
        display: flex;
        /*左右贴边*/
        justify-content: space-between;
        padding-left: 0;
        align-items: center;
        color: black;
        font-size: 20px;
    }
    .el-header>div {
        display: flex;
        align-items: center;
    }
    .el-header>div>span {
        cursor: pointer;
    }
    .el-header span {
        margin-left: 15px;
    }
    .el-aside {
        height: 500px;
    }
</style>