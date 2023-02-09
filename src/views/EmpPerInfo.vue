<template>
    <div>
        <h1 class="title">个人信息</h1>
        <el-form :inline="true" class="demo-form-inline">

            <el-form-item style="margin-left:400px;">
                <el-button type="primary" @click="updatePwd">修改密码</el-button>
                <el-button type="primary" @click="updateMpno">修改手机号</el-button>
            </el-form-item>
        </el-form>
        <table width="60%"  height="200px" border="1px" bgcolor="white" cellspacing="0" style="text-align: left;margin-left:200px;color:#999999;">
            <tr>
                <td>工号：{{empPerInfo.empno}}</td>
                <td>姓名：{{empPerInfo.ename}}</td>
            </tr>
            <tr>
                <td>部门：{{empPerInfo.dname}}</td>
                <td>工作：{{empPerInfo.jname}}</td>
            </tr>
            <tr>
                <td>手机号：{{empPerInfo.mpno}}</td>
                <td>身份证号：{{empPerInfo.idno}}</td>
            </tr>
        </table>
        <!--弹出层-->
        <el-dialog width="40%" :title="title" :visible.sync="dialogFormVisible">
            <el-form ref="mpnoForm" :model="mpnoForm" :rules="rules" >
                <el-form-item   style="width: 400px"  label="请输入密码" :label-width="formLabelWidth" prop="password">
                    <el-input  type="password" v-model="mpnoForm.password" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item  style="width: 400px"  label="请再次输入密码" :label-width="formLabelWidth" prop="password02">
                    <el-input  type="password" v-model="mpnoForm.password02" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEmpMpno">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog width="40%" :title="title" :visible.sync="dialogFormVisible02">
            <el-form ref="mpnoForm" :model="mpnoForm" :rules="rules" >
                <el-form-item  style="width: 400px"  label="联系方式" :label-width="formLabelWidth" prop="mpno">
                    <el-input  v-model="mpnoForm.mpno" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible02 = false">取 消</el-button>
                <el-button type="primary" @click="saveEmpMpno">确 定</el-button>
            </div>
        </el-dialog>
    </div>

</template>

<script>
    export default {
        name: "EmpPerInfo",
        data() {
            var validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                } else {
                    if (this.mpnoForm.password02 !== '') {
                        this.$refs.mpnoForm.validateField('checkPass');
                    }
                    callback();
                }
            };
            var validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.mpnoForm.password) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };


            var checkPhone = (rule, value, callback) => {
                let regEn = /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/
                if (!regEn.test(value)) {
                    callback(new Error('请输入正确号码'))
                } else {
                    callback()
                }
            }


            return {

                empPerInfo:[],
                uname:sessionStorage.getItem("uname"),
                rules:{
                    mpno:[
                        {validator:checkPhone,trigger:"blur"}
                    ],
                    password: [
                        { validator: validatePass, trigger: 'blur' }
                    ],
                    password02: [
                        { validator: validatePass2, trigger: 'blur' }
                    ],
                },
                //弹出层是否显示
                dialogFormVisible: false,
                dialogFormVisible02: false,
                //新增的表单数据源
                mpnoForm: {
                    mpno:'',
                    password:'',
                    password02:'',
                    empno:''
                },
                //弹出层表单的左侧提示文字的宽度
                formLabelWidth: '100px',

                //弹出层标题
                title:''
            }

        },
        methods: {
            //查询个人信息
            getPerInfo() {
                this.$http.get("/getPerInfo",{params:{uname:this.uname}}).then(res => {
                    this.empPerInfo = res.data
                }).catch(() => {
                    this.$message.error("个人信息加载失败，请联系管理员")
                })
            },
            saveEmpMpno() {
                //表单校验
                this.$refs["mpnoForm"].validate(valid => {
                    if(valid) {
                        let url = '/updateMpno';//默认路径为修改
                        let msg = "修改手机号";
                        if(this.mpnoForm.mpno == ''){
                            url = '/updatePwd';//默认路径为修改
                            msg = "修改密码";
                            this.$http.post(url,this.mpnoForm).then(res => {
                                if (res.data == "success") {
                                    this.$message.success(msg+ "成功")
                                    this.dialogFormVisible = false
                                    this.$router.push("/")
                                } else  {
                                    this.$message.error(msg+ "失败")
                                    this.dialogFormVisible = false
                                }
                                //关闭弹出层

                            }).catch(() => {
                                this.$message.error(msg + "失败,请联系管理员")
                            })
                        }else {
                            this.$http.post(url,this.mpnoForm).then(res => {
                                if (res.data == "success") {
                                    this.$message.success(msg+ "成功")
                                } else  {
                                    this.$message.error(msg+ "失败")
                                }
                                //关闭弹出层
                                this.dialogFormVisible = false
                                this.getPerInfo()
                            }).catch(() => {
                                this.$message.error(msg + "失败,请联系管理员")
                            })
                        }

                    }
                })

            },
            updateMpno() {

                //打开弹出层
                this.dialogFormVisible02 = true
                this.title = "修改手机号"

                this.mpnoForm = {
                    mpno:'',
                    //控制弹出层
                    password:'',
                    password02:'',
                    empno:'',
                }
                //给表单元素赋值
                this.mpnoForm.mpno = this.empPerInfo.mpno
                this.mpnoForm.empno = this.empPerInfo.empno
            },
            updatePwd() {

                //打开弹出层
                this.dialogFormVisible = true
                this.title = "修改密码"
                //重置表单
                /* if (this.$refs["empForm"] != null) {
                     this.$refs["empForm"].resetFields()
                 }*/
                this.mpnoForm = {
                    mpno:'',
                    password:'',
                    password02:'',
                    empno:''
                }
                //给表单元素赋值
                this.mpnoForm.empno = this.empPerInfo.empno
            },
        },
        created() {
            //在页面一加载时就去请求部门信息
            this.getPerInfo()
        }
    }
</script>

<style scoped>

</style>