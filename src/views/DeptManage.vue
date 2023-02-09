<template>
    <div>
        <h1 class="title">部门列表</h1>
        <el-form :inline="true" :model="select" class="demo-form-inline">
            <el-form-item label="部门名称">
                <el-input v-model="select.dname" clearable placeholder="部门名称"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button style="margin-right: 200px;" type="primary" @click="search">查询</el-button>
            </el-form-item>
            <el-form-item style="margin-left: 200px;">
                <el-button type="primary" @click="add">新增</el-button>
                <el-button type="primary" @click="update">修改</el-button>
                <!--<el-button type="danger" @click="del">删除</el-button>-->
            </el-form-item>
        </el-form>
        <!--
              data属性：绑定表格数据
              stripe属性：设置隔行变色
              -->
        <el-table
                :data="depts"
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
                    prop="deptno"
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
                    prop="dname"
                    label="部门名称">
            </el-table-column>
            <el-table-column
                    prop="ctime"
                    label="创建时间">
            </el-table-column>
            <el-table-column
                    prop="count_emp"
                    label="员工数量"
                    width="200">
            </el-table-column>
            <!--<el-table-column
                    prop="operate"
                    label="操作"
                    width="200">
            </el-table-column>-->
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button
                            size="mini"
                            type="danger"
                            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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
        <!--弹出层-->
        <el-dialog width="30%" :title="title" :visible.sync="dialogFormVisible">
            <el-form ref="deptForm" :model="deptForm" :rules="rules" >
                <el-form-item v-if="deptForm.deptno != ''" style="width: 400px" label="部门编号" :label-width="formLabelWidth" prop="deptno">
                    <el-input  v-model="deptForm.deptno" autocomplete="off" readonly></el-input>
                </el-form-item>
                <el-form-item style="width: 400px" label="部门名称" :label-width="formLabelWidth" prop="dname">
                    <el-input  v-model="deptForm.dname" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item style="width: 400px"  label="创建日期" :label-width="formLabelWidth" prop="ctime">
                    <el-date-picker
                            style="width: 100%"
                            v-model="deptForm.ctime"
                            type="date"
                            placeholder="选择日期"
                            clearable
                            format="yyyy年M月d日"
                            value-format="yyyy-MM-dd"
                    >
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveDept">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "DeptManager",
        data() {
            return {
                rules:{
                    dname: [
                        {required:true,message:"部门名称不能为空",trigger:"blur"}
                    ],
                    ctime:[
                        {required:true,message:"创建时间不能为空",trigger:"change"}
                    ]
                },
                //查询条件
                select: {
                    dname: "",
                    page: 1,
                    limit: 10
                },
                deptList:[],
                depts:[],
                total:0,
                //弹出层是否显示
                dialogFormVisible: false,
                //新增的表单数据源
                deptForm: {
                    deptno: '',
                    dname:'',
                    ctime:'',
                    count_emp:'',
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
            getDeptList() {
                this.$http.post("/deptInfo",this.select).then(res => {
                    this.depts = res.data.data
                    this.total = res.data.count
                }).catch(() => {
                    this.$message.error("部门信息加载失败，请联系管理员")
                })
            },
            //点击查询按钮
            search() {
                this.select.page = 1
                this.getDeptList()
            },

            //当每页多少条被改变时，val代表改变后的每页条数
            handleSizeChange(val) {
                this.select.limit = val
                this.search()
            },
            //当当前页被改变时,val代表当前页
            handleCurrentChange(val) {
                this.select.page = val
                this.getDeptList()
            },
            //打开弹出层
            add() {
                //打开弹出层
                this.dialogFormVisible = true
                this.title = "新增部门"
                //重置表单
                if ( this.$refs["deptForm"] != null) {
                    this.$refs["deptForm"].resetFields()
                }
                this.deptForm = {
                    deptno:'',
                    dname: '',
                    ctime: '',
                    count_emp:''
                }
            },

            //保存员工信息
            saveDept() {
                //表单校验
                this.$refs["deptForm"].validate(valid => {
                    if(valid) {
                        let url = '/updateDept';//默认路径为修改
                        let msg = "修改";
                        //判断是在新增还是在修改
                        if(this.deptForm.deptno == '') {
                            url="/addDept"
                            msg ="新增"
                        }
                        this.$http.post(url,this.deptForm).then(res => {
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
            update() {
                //判断是否选中了一条
                let selections = this.selectionItems
                if (selections.length != 1) {
                    this.$message.warning("请选择一条数据")
                    return
                }
                //打开弹出层
                this.dialogFormVisible = true
                this.title = "修改部门信息"
                //重置表单

                this.deptForm  = {
                    deptno:'',
                    dname: '',
                    ctime: '',
                    count_emp: ''
                }
                //给表单元素赋值
                this.deptForm = selections[0]
            },
           /* del() {
                let selection = this.selectionItems

                if (selection.length == 0) {
                    this.$message.warning("请选择一条数据")
                    return
                }
                this.$confirm('确认要删除部门吗','提示',{
                    confirmButtonText:'确定',
                    cancelButtonText:'取消',
                    type:'warning'
                }).then(() => {
                    let arr = [];
                    for (let i = 0; i < selection.length ; i++) {
                        arr.push(selection[i].deptno)
                    }
                    this.$http.post("/delBatchDept",arr).then(res => {
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
            },*/
            handleDelete(index, row) {

                this.$confirm('确认要删除该部门吗','提示',{
                    confirmButtonText:'确定',
                    cancelButtonText:'取消',
                    type:'warning'
                }).then(() => {
                    this.$http.get("/delDept",{params:{deptno:row.deptno}}).then(res => {
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
            this.search()
        }
    }
</script>

<style scoped>

</style>