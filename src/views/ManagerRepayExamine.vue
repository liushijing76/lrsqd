<template>
    <div>
        <h1 class="title">借款信息</h1>
        <el-form :inline="true" :model="select" class="demo-form-inline">
            <el-form-item label="部门借款员工姓名">
                <el-input v-model="select.ename" clearable placeholder="请输入部门员工姓名"></el-input>
            </el-form-item>
            <el-form-item label="借款类型">
                <el-date-picker
                        v-model="select.timeinterval"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="search">查询</el-button>
            </el-form-item>
            <!--<el-form-item >
                <el-button type="danger" @click="delRepayInfo">删除</el-button>
            </el-form-item>-->
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
                    prop="rno"
                    label="还款编号"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="lno"
                    label="借款编号"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="ename"
                    label="借款人"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="rtime"
                    label="还款时间">
            </el-table-column>
            <el-table-column
                    prop="rsname"
                    label="还款状态">
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button
                            v-if="scope.row.rsname != '部门审核'"
                            size="mini"
                            type="primary"
                            @click="handleLook(scope.$index, scope.row)">查看</el-button>
                    <el-button
                            v-if="scope.row.rsname == '部门审核'"
                            size="mini"
                            type="warning"
                            @click="handleExamine(scope.$index, scope.row)">审批</el-button>
                    <el-button
                            v-if="scope.row.rsname == '开始'"
                            size="mini"
                            type="success"
                            @click="submitManagerRepay(scope.$index, scope.row)">提交</el-button>
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
            <el-form ref="empRepayForm" :model="empRepayForm" :rules="rules" >
                <el-form-item style="width: 400px" label="借款人" :label-width="formLabelWidth" prop="ename">
                    <el-input  v-model="empRepayForm.ename" autocomplete="off" readonly></el-input>
                </el-form-item>
                <el-form-item style="width: 400px" label="还款金额" :label-width="formLabelWidth" prop="rbalance">
                    <el-input  v-model="empRepayForm.rbalance" autocomplete="off" readonly></el-input>
                </el-form-item>
                <el-form-item style="width: 400px" label="还款时间" :label-width="formLabelWidth" prop="rtime">
                    <el-date-picker
                            style="width: 100%"
                            v-model="empRepayForm.rtime"
                            type="date"
                            placeholder="选择日期"
                            clearable
                            format="yyyy年M月d日"
                            value-format="yyyy-MM-dd"
                            readonly
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item style="width: 400px"  label="是否通过" :label-width="formLabelWidth" prop="rsno">
                    <!--  lable是单选框的value                   -->
                    <el-radio v-model="empRepayForm.rsno" label="3" @change="changeTextTrue()">通过</el-radio>
                    <el-radio v-model="empRepayForm.rsno" label="5" @change="changeTextFalse()">不通过</el-radio>
                </el-form-item>
                <el-form-item style="width: 400px" label="驳回原因" :label-width="formLabelWidth" prop="rrcause">
                    <el-input  style="width: 320px" type="textarea" v-model="empRepayForm.rrcause" :disabled="status"></el-input>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitEmpRepay">提 交</el-button>
            </div>
        </el-dialog>

        <el-dialog width="30%" :title="title" :visible.sync="dialogFormVisible02">
            <el-form :model="empRepayForm" >
                <el-form-item style="width: 400px" label="借款人" :label-width="formLabelWidth" prop="ename">
                    <el-input  v-model="empRepayForm.ename" autocomplete="off" readonly></el-input>
                </el-form-item>

                <el-form-item style="width: 400px" label="还款金额" :label-width="formLabelWidth" prop="rbalance">
                    <el-input  v-model="empRepayForm.rbalance" autocomplete="off" readonly></el-input>
                </el-form-item>
                <el-form-item style="width: 400px"  label="还款时间" :label-width="formLabelWidth" prop="rtime">
                    <el-date-picker
                            style="width: 100%"
                            v-model="empRepayForm.rtime"
                            type="date"
                            placeholder="选择日期"
                            clearable
                            format="yyyy年M月d日"
                            value-format="yyyy-MM-dd"
                            readonly
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item style="width: 400px" label="还款状态" :label-width="formLabelWidth" prop="rsname">
                    <el-input  v-model="empRepayForm.rsname" autocomplete="off" readonly></el-input>
                </el-form-item>
                <el-form-item style="width: 400px" label="驳回原因" :label-width="formLabelWidth" prop="rrcause" v-if="empRepayForm.rsno== 5 || empRepayForm.rsno ==6">
                    <el-input  style="width: 320px" type="textarea" v-model="empRepayForm.rrcause" readonly></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible02 = false">取 消</el-button>

            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "MangerRepayExamine",
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
                    rsno:[
                        {required:true,message:"借款类型不能为空",trigger:"change"}
                    ]

                },

                status:false,
                //查询条件
                select: {
                    timeinterval: '',
                    lbalance: "",
                    ltno: "",
                    ename:"",
                    uname:'',
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

                //新增的表单数据源
                empRepayForm: {
                    lno:'',
                    ltno:'',
                    lbalance: '',
                    ltime:'',
                    lcause: '',
                    lsname: '',
                    lsno:'',
                    rrcause:'',
                    rbalance:'',
                    stillrepay:'',
                    ename:'',
                    ltype:'',
                    rsno:''

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

            cellStyle({row,column,rowIndex,columIndex}){
                if(row[column.property] === '部门审核未通过' || row[column.property] === '财务审核未通过'){
                    return 'color:red'
                }
                if(row[column.property] === '部门审核' || row[column.property] === '财务审核') {
                    return 'color:#FFBC3E'
                }
                if(row[column.property] === '开始' ) {
                    return 'color:blue'
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
            mGetRepayRecordList() {
                this.select.uname = sessionStorage.getItem("uname")
                this.$http.post("/mGetRepayRecordList",this.select).then(res => {
                    this.loanRecord = res.data.data
                    this.total = res.data.count
                }).catch(() => {
                    this.$message.error("借款信息加载失败，请联系管理员")
                })
            },
            //点击查询按钮
            search() {
                this.select.page = 1
                this.mGetRepayRecordList()
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
                this.mGetRepayRecordList()
            },
            //提交经理借款申请
            submitManagerRepay(index,row) {
                this.$confirm('确认提交还款申请吗','提示',{
                    confirmButtonText:'确定',
                    cancelButtonText:'取消',
                    type:'warning'
                }).then(() => {
                    this.$http.post("/submitManagerRepay",row).then(res => {
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

            //提交至财务
            submitEmpRepay() {
                //表单校验
                this.$refs["empRepayForm"].validate(valid => {
                    if(valid) {
                        let url = '/mExamineEmpRepay';
                        let msg = "提交";

                        this.$http.post(url,this.empRepayForm).then(res => {
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
                this.empRepayForm = {
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
                    rsno:""
                }
                //给表单元素赋值
                this.empRepayForm = row
            },

            handleLook(index,row) {
                this.dialogFormVisible02 = true
                this.title = "借款信息"
                this.empRepayForm = {
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
                this.empRepayForm = row
            },
            delRepayInfo() {
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
                        if(selection[i].rsno != 1){
                            this.$message.error( "流程处理中,删除失败");
                            return;
                        }
                        arr.push(selection[i].rno)
                    }
                    this.$http.post("/delBatchEmpRepay",arr).then(res => {
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

        }

    }

</script>

<style scoped>

</style>