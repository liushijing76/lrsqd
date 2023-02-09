<template>
    <div>
        <h1 class="title">借款类型列表</h1>
        <el-form :inline="true" :model="select" class="demo-form-inline">
            <el-form-item style="margin-left: 200px;">
                <el-button type="primary" @click="add">新增</el-button>
                <el-button type="primary" @click="update">修改</el-button>
            </el-form-item>
        </el-form>
        <!--
              data属性：绑定表格数据
              stripe属性：设置隔行变色
              -->
        <el-table
                :data="ltypes"
                stripe
                style="width: 50%;margin-left: 300px"
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
            <el-table-column
                    prop="ltno"
                    label="类型编号"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="ltype"
                    label="部门名称">
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button
                            size="mini"
                            type="danger"
                            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--弹出层-->
        <el-dialog width="30%" :title="title" :visible.sync="dialogFormVisible">
            <el-form ref="ltypeForm" :model="ltypeForm" :rules="rules" >
                <el-form-item v-if="ltypeForm.ltno != ''" style="width: 400px" label="借款类型编号" :label-width="formLabelWidth" prop="ltno">
                    <el-input  v-model="ltypeForm.ltno" autocomplete="off" readonly></el-input>
                </el-form-item>
                <el-form-item style="width: 400px" label="借款类型" :label-width="formLabelWidth" prop="ltype">
                    <el-input  v-model="ltypeForm.ltype" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveLoanType">确 定</el-button>
            </div>

        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "InfoMaintenance",
        data() {
            return {
                rules:{

                    ltype:[
                        {required:true,message:"借款类型不能为空",trigger:"change"}
                    ]
                },
                //查询条件
                select: {
                },
                ltypes:[],

                //弹出层是否显示
                dialogFormVisible: false,
                //新增的表单数据源
                ltypeForm: {
                    ltype:'',
                    ltno:'',
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
            getAllLType() {
                this.$http.post("/getLoanTypeList").then(res => {
                    this.ltypes = res.data
                }).catch(() => {
                    this.$message.error("借款类型信息加载失败，请联系管理员")
                })

            },
            //点击查询按钮
            search() {
                this.getAllLType()
            },
            //打开弹出层
            add() {
                //打开弹出层
                this.dialogFormVisible = true
                this.title = "新增借款类型"

                this.ltypeForm = {
                    ltype:'',
                    ltno:'',
                }
            },

            //保存员工信息
            saveLoanType() {
                //表单校验
                this.$refs["ltypeForm"].validate(valid => {
                    if(valid) {
                        let url = '/updateLoanType';//默认路径为修改
                        let msg = "修改";
                        //判断是在新增还是在修改
                        if(this.ltypeForm.deptno == '') {
                            url="/addLoanType"
                            msg ="新增"
                        }
                        this.$http.post(url,this.ltypeForm).then(res => {
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
                this.title = "修改借款类型"
                //重置表单

                this.ltypeForm  = {
                    ltype:'',
                    ltno:'',
                }
                //给表单元素赋值
                this.ltypeForm = selections[0]
            },
            handleDelete(index, row) {

                this.$confirm('确认要删除该类型吗','提示',{
                    confirmButtonText:'确定',
                    cancelButtonText:'取消',
                    type:'warning'
                }).then(() => {
                    this.ltypeForm = row
                    this.$http.post("/deleteLoanType",row).then(res => {
                        if (res.data == "success") {
                            this.$message.success("删除成功")
                            this.search()
                        } else if( res.date == "error01") {
                            this.$message.error( "借款记录存在该类型，删除失败")
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