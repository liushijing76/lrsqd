<template>
    <div>
        <h1 class="title">借款信息</h1>
        <el-form :inline="true" :model="select" class="demo-form-inline">
            <el-form-item label="部门借款员工姓名">
                <el-input v-model="select.ename" clearable placeholder="请输入部门员工姓名"></el-input>
            </el-form-item>
            <el-form-item label="借款类型">
                <el-select v-model="select.ltno" clearable placeholder="请选择借款类型">
                    <!--   借款类型列表      -->
                    <el-option v-for="lType in lTypeList" :label="lType.ltype" :value="lType.ltno"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="search">查询</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="addLoan">借款</el-button>
                <el-button type="danger" @click="delLoanInfo">删除</el-button>
            </el-form-item>
        </el-form>
        <!--
              data属性：绑定表格数据
              stripe属性：设置隔行变色
              -->
        <el-table :cell-style="cellStyle"
                :data="loanRecord"
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
                    label="序号"
            >
            </el-table-column>
            <!--    prop属性：数据源的属性名一致     -->
            <el-table-column
                    prop="lno"
                    label="借款编号"
                    width="85">
            </el-table-column>
            <el-table-column
                    prop="lbalance"
                    label="借款金额"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="ename"
                    label="借款人"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="ltype"
                    label="借款类型">
            </el-table-column>
            <el-table-column
                    prop="ltime"
                    label="借款时间">
            </el-table-column>
            <el-table-column
                    prop="lsname"
                    label="借款状态">
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button
                            v-if="scope.row.lsname != '开始'"
                            size="mini"
                            type="primary"
                            @click="handleLook(scope.$index, scope.row)">查看</el-button>
                    <el-button
                            v-if="scope.row.lsname == '部门审核'"
                            size="mini"
                            type="warning"
                            @click="handleExamine(scope.$index, scope.row)">审批</el-button>
                    <el-button
                            v-if="(scope.row.lsname == '未还款' ||scope.row.lsname == '部分还款')&& scope.row.ename == empPerInfo.ename"
                            size="mini"
                            type="primary"
                            @click="handleRepay(scope.$index, scope.row)">还款</el-button>
                    <el-button
                            v-if="scope.row.lsname == '员工确认'&& scope.row.ename == empPerInfo.ename "
                            size="mini"
                            type="success"
                            plain
                            @click="handleVerify(scope.$index, scope.row)">确认</el-button>
                    <el-button
                            v-if="scope.row.lsname == '开始'"
                            size="mini"
                            type="warning"
                            @click="handleUpdate(scope.$index, scope.row)">修改</el-button>
                    <el-button
                            v-if="scope.row.lsname == '开始'"
                            size="mini"
                            type="success"
                            @click="submitMangerLoan(scope.$index, scope.row)">提交</el-button>
                </template>
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
        <el-dialog width="30%" :title="title" :visible.sync="dialogFormVisible">
            <el-form ref="empLoanForm" :model="empLoanForm" :rules="rules" >
                <el-form-item style="width: 400px" label="借款人" :label-width="formLabelWidth" prop="ename">
                    <el-input  v-model="empLoanForm.ename" autocomplete="off" readonly></el-input>
                </el-form-item>
                <el-form-item style="width: 400px" label="借款类型" :label-width="formLabelWidth" prop="ltype">
                    <el-input  v-model="empLoanForm.ltype" autocomplete="off" readonly></el-input>
                </el-form-item>
                <el-form-item style="width: 400px" label="借款金额" :label-width="formLabelWidth" prop="lbalance">
                    <el-input  v-model="empLoanForm.lbalance" autocomplete="off" readonly></el-input>
                </el-form-item>
                <el-form-item style="width: 400px"  label="借款时间" :label-width="formLabelWidth" prop="ltime">
                    <el-date-picker
                            style="width: 100%"
                            v-model="empLoanForm.ltime"
                            type="date"
                            placeholder="选择日期"
                            clearable
                            format="yyyy年M月d日"
                            value-format="yyyy-MM-dd"
                            readonly
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item style="width: 400px" label="借款原因" :label-width="formLabelWidth" prop="lcause">
                    <el-input  style="width: 320px" type="textarea" v-model="empLoanForm.lcause" readonly></el-input>
                </el-form-item>
                <el-form-item style="width: 400px"  label="是否通过" :label-width="formLabelWidth" prop="lsno">
                    <!--  lable是单选框的value                   -->
                    <el-radio v-model="empLoanForm.lsno" label="3" @change="changeTextTrue()">通过</el-radio>
                    <el-radio v-model="empLoanForm.lsno" label="8" @change="changeTextFalse()">不通过</el-radio>
                </el-form-item>
                <el-form-item style="width: 400px" label="" :label-width="formLabelWidth" prop="lrcause">
                    <el-input  style="width: 320px" type="textarea" v-model="empLoanForm.lrcause" :disabled="status" ></el-input>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitEmpLoan">提 交</el-button>
            </div>
        </el-dialog>

        <el-dialog width="30%" :title="title" :visible.sync="dialogFormVisible02">
            <el-form  :model="empLoanForm" >
                <el-form-item style="width: 400px" label="借款人" :label-width="formLabelWidth" prop="ename">
                    <el-input  v-model="empLoanForm.ename" autocomplete="off" readonly></el-input>
                </el-form-item>
                <el-form-item style="width: 400px" label="借款类型" :label-width="formLabelWidth" prop="ltype">
                    <el-input  v-model="empLoanForm.ltype" autocomplete="off" readonly></el-input>
                </el-form-item>
                <el-form-item style="width: 400px" label="借款金额" :label-width="formLabelWidth" prop="lbalance">
                    <el-input  v-model="empLoanForm.lbalance" autocomplete="off" readonly></el-input>
                </el-form-item>
                <el-form-item style="width: 400px"  label="借款时间" :label-width="formLabelWidth" prop="ltime">
                    <el-date-picker
                            style="width: 100%"
                            v-model="empLoanForm.ltime"
                            type="date"
                            placeholder="选择日期"
                            clearable
                            format="yyyy年M月d日"
                            value-format="yyyy-MM-dd"
                            readonly
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item style="width: 400px" label="借款原因" :label-width="formLabelWidth" prop="lcause">
                    <el-input  style="width: 320px" type="textarea" v-model="empLoanForm.lcause" readonly></el-input>
                </el-form-item>
                <el-form-item style="width: 400px" label="驳回原因" :label-width="formLabelWidth" prop="lrcause" v-if="empLoanForm.lsno== 8 || empLoanForm.lsno ==9">
                    <el-input  style="width: 320px" type="textarea" v-model="empLoanForm.lrcause" readonly></el-input>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible02 = false">取 消</el-button>
            </div>
        </el-dialog>

        <el-dialog width="30%" :title="title" :visible.sync="dialogFormVisible03">
            <el-form ref="empLoanForm" :model="empLoanForm" :rules="rules" >
                <el-form-item style="width: 400px"  label="借款类型" :label-width="formLabelWidth" prop="ltno">
                    <el-select style="width: 320px" v-model="empLoanForm.ltno" placeholder="请选择借款类型" clearable>
                        <el-option v-for="ltname in lTypeList" :label="ltname.ltype" :value="ltname.ltno"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item style="width: 400px" label="借款金额" :label-width="formLabelWidth" prop="lbalance">
                    <el-input  v-model="empLoanForm.lbalance" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item style="width: 400px"  label="借款时间" :label-width="formLabelWidth" prop="ltime">
                    <el-date-picker
                            style="width: 100%"
                            v-model="empLoanForm.ltime"
                            type="date"
                            placeholder="选择日期"
                            clearable
                            format="yyyy年M月d日"
                            value-format="yyyy-MM-dd"
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item style="width: 400px" label="借款原因" :label-width="formLabelWidth" prop="lcause">
                    <el-input  style="width: 320px" type="textarea" v-model="empLoanForm.lcause"></el-input>
                </el-form-item>
                <el-form-item style="width: 400px"  label="借款状态" :label-width="formLabelWidth" prop="lsname">
                    <el-input  v-model="empLoanForm.lsname" autocomplete="off" readonly></el-input>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible03 = false">取 消</el-button>
                <el-button type="primary" @click="saveManagerLoan">保 存</el-button>
            </div>
        </el-dialog>

        <el-dialog width="30%" :title="title" :visible.sync="dialogFormVisible04">
            <el-form ref="empLoanForm" :model="empLoanForm" :rules="rules03" >
                <el-form-item style="width: 400px" label="借款金额" :label-width="formLabelWidth04" prop="lbalance">
                    <el-input  v-model="empLoanForm.lbalance" autocomplete="off" readonly></el-input>
                </el-form-item>
                <el-form-item style="width: 400px" label="待还款金额" :label-width="formLabelWidth04" prop="stillrepay">
                    <el-input  v-model="empLoanForm.stillrepay" autocomplete="off" readonly></el-input>
                </el-form-item>
                <el-form-item style="width: 400px" label="请输入还款金额" :label-width="formLabelWidth04" prop="rbalance">
                    <el-input  v-model="empLoanForm.rbalance" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible04 = false">取 消</el-button>
                <el-button type="primary" @click="saveManagerRepay">保 存</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "MangerLoanExamine",
        data() {
            return {
                rules:{

                    ltno:[
                        {required:true,message:"借款类型不能为空",trigger:"change"}
                    ],
                    lbalance: [
                        {required:true,message:"借款金额不能为空",trigger:"blur"}
                    ],
                    rbalance: [
                        {required:true,message:"还款金额不能为空",trigger:"blur"}
                    ],

                },
                uname:sessionStorage.getItem("uname"),
                status:true,
                //查询条件
                select: {
                    lbalance: "",
                    ltno: "",
                    uname:"",
                    page: 1,
                    limit: 10
                },
                jobList:[],
                lTypeList:[],
                loanRecord:[],
                total:0,
                //弹出层是否显示
                dialogFormVisible: false,
                dialogFormVisible02: false,
                dialogFormVisible03: false,
                dialogFormVisible04: false,
                //新增的表单数据源
                empLoanForm: {
                    lno:'',
                    ltno:'',
                    lbalance: '',
                    ltime:'',
                    lcause: '',
                    lsname: '',
                    lsno:'3',
                    lrcause:'',
                    rbalance:'',
                    stillrepay:'',
                    ename:'',
                    ltype:''
                },

                //弹出层表单的左侧提示文字的宽度
                formLabelWidth: '80px',
                formLabelWidth04: '80px',
                //被选中的集合
                selectionItems:[],
                //弹出层标题
                title:'',
                empPerInfo:[],
            }
        },
        methods: {
            cellStyle({row,column,rowIndex,columIndex}){
                console.log(row[column.property])
                if(row[column.property] === '部门审核未通过' || row[column.property] === '财务审核未通过'){
                    return 'color:red'
                }
                if(row[column.property] === '部门审核' || row[column.property] === '财务审核') {
                    return 'color:#FFBC3E'
                }
                if(row[column.property] === '开始' || row[column.property] === '未还款' || row[column.property] === '部分还款') {
                    return 'color:blue'
                }
                if(row[column.property] === '员工确认'){
                    return 'color:green'
                }
            },

            /*驳回原因只读状态*/
            changeTextTrue(){
                this.status = true
            },
            changeTextFalse(){
                this.status = false
            },
            //条件查询借款信息
            fGetLoanRecordList() {
                this.select.uname = sessionStorage.getItem("uname")
                this.$http.post("/mGetLoanRecordList",this.select).then(res => {
                    this.loanRecord = res.data.data
                    this.total = res.data.count
                }).catch(() => {
                    this.$message.error("借款信息加载失败，请联系管理员")
                })
            },
            //点击查询按钮
            search() {
                this.select.page = 1
                this.fGetLoanRecordList()
            },
            //获取全部借款的类型
            getAllLType() {
                this.$http.post("/getLoanTypeList").then(res => {
                    this.lTypeList = res.data
                }).catch(() => {
                    this.$message.error("借款类型信息加载失败，请联系管理员")
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
                this.mGetLoanRecordList()
            },
            addLoan() {
                //打开弹出层
                this.dialogFormVisible03 = true
                this.title = "新增借款"

                //重置表单
                this.empLoanForm = {
                    lno:'',
                    ltno:'',
                    lbalance: '',
                    ltime:'',
                    lcause: '',
                    lsname:'开始',
                    lsno:'1',
                    uname:'',
                }
                this.empLoanForm.uname = sessionStorage.getItem("uname")
            },


            //保存员工借款信息
            saveManagerLoan() {
                //表单校验
                this.$refs["empLoanForm"].validate(valid => {
                    if(valid) {
                        let url = '/updateLoanRecord';//默认路径为修改
                        let msg = "修改";
                        if(this.empLoanForm.lno == '') {
                            url="/addLoanRecord";
                            msg ="保存";
                        }
                        this.$http.post(url,this.empLoanForm).then(res => {
                            if (res.data == "success") {
                                this.$message.success(msg+ "成功")
                            } else  {
                                this.$message.error(msg+ "失败")
                            }
                            //关闭弹出层
                            this.dialogFormVisible03 = false
                            this.search()
                        }).catch(() => {
                            this.$message.error(msg + "失败,请联系管理员")
                        })
                    }
                })
            },
            getPerInfo() {
                this.$http.get("/getPerInfo",{params:{uname:this.uname}}).then(res => {
                    this.empPerInfo = res.data
                }).catch(() => {
                    this.$message.error("个人信息加载失败，请联系管理员")
                })
            },
            //提交经理借款信息
            submitMangerLoan(index,row) {
                this.$confirm('确认提交借款信息吗','提示',{
                    confirmButtonText:'确定',
                    cancelButtonText:'取消',
                    type:'warning'
                }).then(() => {
                    row.lsno = '3'
                    this.$http.post("/updateLoanRecord",row).then(res => {
                        if (res.data == "success") {
                            this.$message.success("提交成功")
                            this.search()
                        } else  {
                            this.$message.error( "提交失败")
                        }
                        this.dialogFormVisible04 = false
                    }).catch(() => {
                        this.$message.error("提交失败,请联系管理员")
                    })
                })
            },
            //保存还款信息
            saveManagerRepay() {
                //表单校验
                this.$refs["empLoanForm"].validate(valid => {
                    if(valid) {
                        let url = '/addRepayRecord';
                        let msg = "保存";

                        this.$http.post(url,this.empLoanForm).then(res => {
                            if (res.data == "success") {
                                this.$message.success(msg+ "成功")
                            } else  {
                                this.$message.error(msg+ "失败")
                            }
                            //关闭弹出层
                            this.dialogFormVisible04 = false
                            this.search()
                        }).catch(() => {
                            this.$message.error(msg + "失败,请联系管理员")
                        })
                    }
                })
            },
            //审批
            submitEmpLoan() {
                //表单校验
                this.$refs["empLoanForm"].validate(valid => {
                    if(valid) {
                        let url = '/mExamineEmpLoan';
                        let msg = "提交";
                        this.$http.post(url,this.empLoanForm).then(res => {
                            if (res.data == "success") {
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

            handleExamine(index, row) {
                //打开弹出层
                this.dialogFormVisible = true
                this.title = "借款记录"
                this.empLoanForm = {
                    lno:'',
                    ltno:'',
                    lbalance: '',
                    ltime:'',
                    lcause: '',
                    lsname: '',
                    lsno:'',
                    lrcause:'',
                    rbalance:'',
                    stillrepay:'',
                    ltype:'',
                    empno:'',
                }
                //给表单元素赋值
                this.empLoanForm = row
                this.empLoanForm.lsno = '3'

            },
            //还款
            handleRepay(index,row) {

                this.empLoanForm = {
                    lno:'',
                    ltno:'',
                    lbalance: '',
                    ltime:'',
                    lcause: '',
                    lsname:'',
                    lsno:'',
                    uname:'',
                    rcause:'',
                    stillrepay:''
                }
                this.empLoanForm = row
                this.$http.post("/judgeProcess",row).then(res => {
                    if(res.data == "error"){
                        this.$message.error("当前存在还款流程,请流程结束后再提交")
                    } else {
                        this.$http.post("/selectRepay",row).then(res => {
                            this.empLoanForm.stillrepay =  res.data.stillrepay
                            this.dialogFormVisible04 = true
                            this.title = "还款"
                        }).catch(() => {
                            this.$message.error("获取还款金额失败,请联系管理员")
                        })
                    }
                }).catch(() => {
                    this.$message.error("获取还款金额失败,请联系管理员")
                })


            },
            //确认收到借款
            handleVerify(index,row) {
                this.$confirm('确认收到借款吗','提示',{
                    confirmButtonText:'确定',
                    cancelButtonText:'取消',
                    type:'warning'
                }).then(() => {
                    row.lsno = '5';
                    this.$http.post("/updateLoanRecord",row).then(res => {
                        if (res.data == "success") {
                            this.$message.success("提交成功")
                            this.search()
                        } else  {
                            this.$message.error( "提交失败")
                        }
                    }).catch(() => {
                        this.$message.error("提交失败,请联系管理员")
                    })
                })
            },
            handleLook(index,row) {
                this.dialogFormVisible02 = true
                this.title = "借款信息"
                this.empLoanForm = {
                    lno:'',
                    ltno:'',
                    lbalance: '',
                    ltime:'',
                    lcause: '',
                    lsname:'',
                    lsno:'',
                    uname:'',
                    lrcause:'',
                    ename:'',
                }
                this.empLoanForm = row
            },
            delLoanInfo() {
                let selection = this.selectionItems

                if (selection.length == 0) {
                    this.$message.warning("请选择至少一条数据")
                    return
                }
                this.$confirm('确认要删除选中借款信息吗','提示',{
                    confirmButtonText:'确定',
                    cancelButtonText:'取消',
                    type:'warning'
                }).then(() => {
                    let arr = [];
                    for (let i = 0; i < selection.length ; i++) {
                        if(selection[i].lsno > 1 && selection[i].lsno < 7){
                            this.$message.error( "流程处理中,删除失败");
                            return;
                        }
                        arr.push(selection[i].lno)
                    }
                    this.$http.post("/delBatchEmpLoan",arr).then(res => {
                        if (res.data == "success") {
                            this.$message.success("删除成功")
                            this.search()
                        } else  {
                            this.$message.error( "删除失败")
                        }
                    }).catch(() => {
                        this.$message.error("删除失败,请联系管理员")
                    })
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
            this.search()
            this.getAllLType()
            this.getPerInfo()
        }

    }

</script>

<style scoped>

</style>