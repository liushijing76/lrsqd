<template>
    <div>
        <h1 class="title">员工列表</h1>
        <el-form :inline="true" :model="select" class="demo-form-inline">
            <el-form-item label="姓名">
                <el-input v-model="select.ename" clearable placeholder="姓名"></el-input>
            </el-form-item>
            <el-form-item label="部门">
                <el-select v-model="select.deptno" clearable placeholder="部门">
                    <!--   循环遍历 deptList，生成下拉列表的列表项      -->
                    <el-option v-for="dept in deptList" :label="dept.dname" :value="dept.deptno"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="search">查询</el-button>
            </el-form-item>
            <el-form-item style="margin-left: 70px;">
                <el-button type="primary" @click="add">新增</el-button>
                <el-button type="primary" @click="update">修改</el-button>
                <el-button type="danger" @click="del">删除</el-button>
                <el-button type="primary" @click="resetUserPwd">重置员工密码</el-button>
            </el-form-item>
        </el-form>
        <!--
              data属性：绑定表格数据
              stripe属性：设置隔行变色
              -->
        <el-table
                :data="emps"
                stripe
                style="width: 100%"
                heigth="450px"
                @select = "selectRow"
                @select-all = "selectAll"
        >
            <!--type="selection"复选框-->
            <el-table-column
                    type="selection"
                    width="55">
            </el-table-column>
            <!--type="index" 索引列-->
            <el-table-column
                    type="index"
                    width="85"
                    prop="empno"
                    label="序号"
            >
            </el-table-column>
            <!--    prop属性：数据源的属性名一致     -->
            <!--<el-table-column
                    prop="empno"
                    label="员工编号"
                    width="180">
            </el-table-column>-->
            <el-table-column
                    prop="ename"
                    label="员工姓名"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="sex"
                    label="性别">
            </el-table-column>
            <el-table-column
                    prop="jname"
                    label="工作">
            </el-table-column>
            <el-table-column
                    prop="hiredate"
                    label="入职日期">
            </el-table-column>
            <el-table-column
                    prop="dname"
                    label="部门名称">
            </el-table-column>
            <el-table-column
                    prop="mpno"
                    label="联系方式">
            </el-table-column>
            <el-table-column
                    prop="idno"
                    label="身份证号"
                    width="200">
            </el-table-column>
        </el-table>
        <!--
                @size-change 当每页条数被改变时触发，参数是每页条数
                @current-change 页码改变时触发
                current-page 当前页
                page-sizes 用户可选择的每页条数
                page-size 每页条数
                total总条数
            -->
        <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="select.page"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="select.limit"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
        </el-pagination>
        <!--弹出层-->
        <el-dialog width="30%" :title="title" :visible.sync="dialogFormVisible">
            <el-form ref="empForm" :model="empForm" :rules="rules" >
                <el-form-item v-if="empForm.empno != ''" style="width: 400px" label="员工编号" :label-width="formLabelWidth" prop="empno">
                    <el-input  v-model="empForm.empno" autocomplete="off" readonly></el-input>
                </el-form-item>
                <el-form-item v-if="empForm.empno == ''" style="width: 400px" label="用户名" :label-width="formLabelWidth" prop="uname">
                    <el-input  v-model="empForm.uname" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item style="width: 400px" label="姓名" :label-width="formLabelWidth" prop="ename">
                    <el-input  v-model="empForm.ename" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item style="width: 400px"  label="性别" :label-width="formLabelWidth" prop="sex">
                    <!--  lable是单选框的value                   -->
                    <el-radio v-model="empForm.sex" label="男">男</el-radio>
                    <el-radio v-model="empForm.sex" label="女">女</el-radio>
                </el-form-item>
                <el-form-item style="width: 400px"  label="入职日期" :label-width="formLabelWidth" prop="hiredate">
                    <el-date-picker
                            style="width: 100%"
                            v-model="empForm.hiredate"
                            type="date"
                            placeholder="选择日期"
                            clearable
                            format="yyyy年M月d日"
                            value-format="yyyy-MM-dd"
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item style="width: 400px"  label="职位" :label-width="formLabelWidth" prop="jobno">
                    <el-select style="width: 300px" v-model="empForm.jobno" placeholder="请选择职位" clearable>
                        <el-option v-for="job in jobList" :label="job.jname" :value="job.jobno"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item style="width: 400px" label="部门" :label-width="formLabelWidth" prop="deptno">
                    <el-select style="width: 300px" v-model="empForm.deptno" placeholder="请选择部门" clearable>
                        <el-option v-for="dept in deptList" :label="dept.dname" :value="dept.deptno"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item style="width: 400px"  label="联系方式" :label-width="formLabelWidth" prop="mpno">
                    <el-input  v-model="empForm.mpno" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item style="width: 400px"  label="身份证号" :label-width="formLabelWidth" prop="idno">
                    <el-input  v-model="empForm.idno" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEmp">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "EmpManager",
        data() {

            var checkPhone = (rule, value, callback) => {
                let regEn = /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/
                if (!regEn.test(value)) {
                    callback(new Error('请输入正确号码'))
                } else {
                    callback()
                }
            }

            /*var checkIdCard = (rule, value, callback) => {
                let regEn = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
                if (!regEn.test(value)) {
                    callback(new Error('请输入正确身份证'))
                } else {
                    // 校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10
                    // 下面分别分析出生日期和校验位
                    let num = value.toUpperCase()
                    let len, re
                    len = num.length
                    if (len === 15) {
                        re = new RegExp(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/)
                        let arrSplit = num.match(re) // 检查生日日期是否正确
                        let dtmBirth = new Date('19' + arrSplit[2] + '/' + arrSplit[3] + '/' + arrSplit[4])
                        let bGoodDay
                        bGoodDay = (dtmBirth.getYear() === Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) === Number(arrSplit[3])) && (dtmBirth.getDate() === Number(arrSplit[4]))
                        if (!bGoodDay) {
                            callback(new Error('请输入正确身份证'))
                        } else { // 将15位身份证转成18位 //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10
                            let arrInt = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
                            let arrCh = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']
                            var nTemp = 0, i
                            num = num.substr(0, 6) + '19' + num.substr(6, num.length - 6)
                            for (i = 0; i < 17; i++) {
                                nTemp += num.substr(i, 1) * arrInt[i]
                            }
                            num += arrCh[nTemp % 11]
                            callback()
                        }
                    }
                    if (len === 18) {
                        re = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/)
                        let arrSplit = num.match(re) // 检查生日日期是否正确
                        let dtmBirth = new Date(arrSplit[2] + '/' + arrSplit[3] + '/' + arrSplit[4])
                        let bGoodDay
                        bGoodDay = (dtmBirth.getFullYear() === Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) === Number(arrSplit[3])) && (dtmBirth.getDate() === Number(arrSplit[4]))
                        if (!bGoodDay) {
                            callback(new Error('请输入正确身份证'))
                        } else { // 检验18位身份证的校验码是否正确。 //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10
                            let valnum
                            let arrInt = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
                            let arrCh = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']
                            var nTemp = 0, i
                            for (i = 0; i < 17; i++) {
                                nTemp += num.substr(i, 1) * arrInt[i]
                            }
                            valnum = arrCh[nTemp % 11]

                            if (valnum !== num.substr(17, 1)) {
                                callback(new Error('请输入正确身份证'))
                            } else {
                                callback()
                            }
                        }
                    }
                }
            }*/
            return {
                rules:{
                    uname: [
                        {required:true,message:"员工姓名不能为空",trigger:"blur"}
                    ],
                    ename: [
                        {required:true,message:"员工姓名不能为空",trigger:"blur"}
                    ],
                    hiredate:[
                        {required:true,message:"入职日期不能为空",trigger:"change"}
                    ],
                    jobno:[
                        {required:true,message:"工作不能为空",trigger:"change"}
                    ],
                    deptno: [
                        {required:true,message:"部门不能为空",trigger:"change"}
                    ],
                    mpno:[
                        {validator:checkPhone,trigger:"blur"}
                    ],
                    idno:[
                        {required:true,message:"不能为空",trigger:"blur"}
                    ]
                },
                //查询条件
                select: {
                    ename: "",
                    deptno: "",
                    page: 1,
                    limit: 10
                },
                jobList:[],
                deptList:[],
                emps:[],
                total:0,
                //弹出层是否显示
                dialogFormVisible: false,
                //新增的表单数据源
                empForm: {
                    empno:'',
                    ename: '',
                    uname:'',
                    sex: '男',
                    hiredate: '',
                    jobno: '',
                    deptno: '',
                    mpno:'',
                    idno:'',
                },
                //弹出层表单的左侧提示文字的宽度
                formLabelWidth: '80px',
                //被选中的集合
                selectionItems:[],
                //弹出层标题
                title:''
            }
        },
        methods: {
            //条件查询员工信息
            getEmpList() {
                this.$http.post("/list",this.select).then(res => {
                    this.emps = res.data.data
                    this.total = res.data.count
                }).catch(() => {
                    this.$message.error("员工信息加载失败，请联系管理员")
                })
            },
            //点击查询按钮
            search() {
                this.select.page = 1
                this.getEmpList()
            },
            //获取全部的部门信息
            getAllDept() {
                this.$http.post("/deptList").then(res => {
                    this.deptList = res.data
                }).catch(() => {
                    this.$message.error("部门信息加载失败，请联系管理员")
                })

            },
            //获取全部职位信息
            getAllJob() {
                this.$http.post("/jobList").then(res => {
                    this.jobList = res.data
                }).catch(() => {
                    this.$message.error("职位信息加载失败，请联系管理员")
                })
            },
            //当每页多少条被改变时，val代表改变后的每页条数
            handleSizeChange(val) {
                this.select.limit = val
                this.search()
            },
            //当当前页被改变时,val代表当前页
            handleCurrentChange(val) {
                this.select.page = val
                this.getEmpList()
            },
            //打开弹出层
            add() {
                //打开弹出层
                this.dialogFormVisible = true
                this.title = "新增员工"
                //重置表单
                if ( this.$refs["empForm"] != null) {
                    this.$refs["empForm"].resetFields()
                }
                this.empForm = {
                    empno:'',
                    uname:'',
                    ename: '',
                    sex: '男',
                    hiredate: '',
                    jobno: '',
                    deptno: ''
                }
            },

            //保存员工信息
            saveEmp() {
                //表单校验
                this.$refs["empForm"].validate(valid => {
                    if(valid) {
                        let url = '/updateEmp';//默认路径为修改
                        let msg = "修改";
                        //判断是在新增还是在修改
                        if(this.empForm.empno == '') {
                            url="/addEmp"
                            msg ="新增"
                        }
                        this.$http.post(url,this.empForm).then(res => {
                            if(res.data == "error01") {
                                this.$message.error("用户名已存在" + msg + "失败")
                            } else if (res.data == "success") {
                                this.$message.success(msg+ "成功")
                            } else  {
                                this.$message.error(msg+ "失败")
                            }
                            //关闭弹出层
                            this.dialogFormVisible = false
                            this.search()
                        }).catch(() => {
                            this.$message.error(msg + "失败,请联系管理员")
                        })
                    }
                })

            },
            update() {
                //判断是否选中了一条
                let selections = this.selectionItems
                if (selections.length != 1) {
                    this.$message.warning("请选择一条数据")
                    return
                }
                //打开弹出层
                this.dialogFormVisible = true
                this.title = "修改员工信息"
                //重置表单
                /* if (this.$refs["empForm"] != null) {
                     this.$refs["empForm"].resetFields()
                 }*/
                this.empForm = {
                    empno:'',
                    uname:'',
                    ename: '',
                    sex: '男',
                    hiredate: '',
                    jobno: '',
                    deptno: ''
                }
                //给表单元素赋值
                this.empForm = selections[0]
            },
            resetUserPwd() {
                //判断是否选中了一条
                let selections = this.selectionItems
                if (selections.length != 1) {
                    this.$message.warning("请选择一条数据")
                    return
                }
                let empno = selections[0].empno
                this.$confirm('确认要重置该员工密码吗','提示',{
                    confirmButtonText:'确定',
                    cancelButtonText:'取消',
                    type:'warning'
                }).then(() => {
                this.$http.get("/resetUserPwd",{params:{empno:empno}}).then(res => {
                    if (res.data == "success") {
                        this.$message.success("重置成功")
                        this.search()
                    } else  {
                        this.$message.error( "重置失败")
                    }
                }).catch(() => {
                    this.$message.error("重置失败,请联系管理员")
                })
                })
            },
            del() {
                let selection = this.selectionItems

                if (selection.length == 0) {
                    this.$message.warning("请选择至少一条数据")
                    return
                }
                this.$confirm('确认要删除员工吗','提示',{
                    confirmButtonText:'确定',
                    cancelButtonText:'取消',
                    type:'warning'
                }).then(() => {
                    let arr = [];
                    for (let i = 0; i < selection.length ; i++) {
                        arr.push(selection[i].empno)
                    }
                    this.$http.post("/delBatchEmp",arr).then(res => {
                        if (res.data == "success") {
                            this.$message.success("删除成功")
                            this.search()
                        } else if(res.data == "error02") {
                            this.$message.error( "员工有借还款流程,删除失败")
                        } else {
                            this.$message.error( "删除失败")
                        }
                    })
                }).catch(() => {
                    this.$message.error("删除失败,请联系管理员")
                })
            },
            //当对某行数据选中或取消时
            //selection 被选中集合
            //row 当前行
            selectRow(selection,row) {
                this.selectionItems = selection
            },
            selectAll(selection) {
                this.selectionItems = selection
            }

        },
        created() {
            //在页面一加载时就去请求部门信息
            this.getAllDept()
            this.search()
            this.getAllJob()
        }
    }
</script>

<style scoped>

</style>