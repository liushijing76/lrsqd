import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import AdminHome from '../views/AdminHome.vue'
import EmpHome from '../views/EmpHome.vue'
import ManagerHome from '../views/ManagerHome.vue'
import EmpManage from '../views/EmpManage.vue'
import DeptManage from '../views/DeptManage.vue'
import FinanceHome from '../views/FinanceHome.vue'
import EmpLoanInfo from '../views/EmpLoanInfo.vue'
import EmpRepayInfo from '../views/EmpRepayInfo.vue'
import EmpPerInfo from '../views/EmpPerInfo.vue'
import FinanceLoanExamine from '../views/FinanceLoanExamine.vue'
import FinanceRepayExamine from '../views/FinanceRepayExamine.vue'
import ManagerLoanExamine from '../views/ManagerLoanExamine.vue'
import ManagerRepayExamine from '../views/ManagerRepayExamine.vue'
import InfoMaintenance from '../views/InfoMaintenance.vue'
Vue.use(VueRouter)

const routes = [
  {
    path:'/',
    component: Login
  },
  {
    path:'/adminHome',
    component: AdminHome,
    redirect:"/empManage",
    children: [
      {
        path:'/empManage',
        component:EmpManage
      },
      {
        path:'/deptManage',
        component:DeptManage
      },
      {
        path:'/infoMaintenance',
        component:InfoMaintenance
      }
    ]
  },
  {
    path:'/empHome',
    component: EmpHome,
    redirect: "/empLoanInfo",
    children: [
      {
        path:'/empLoanInfo',
        component:EmpLoanInfo
      },
      {
        path:'/empRepayInfo',
        component:EmpRepayInfo
      },
      {
        path:'/empPerInfo',
        component:EmpPerInfo
      },

    ]
  },
  {
    path:'/managerHome',
    component: ManagerHome,
    redirect: "/managerLoanExamine",
    children: [
      {
        path:'/managerLoanExamine',
        component:ManagerLoanExamine
      },
      {
        path:'/managerRepayExamine',
        component:ManagerRepayExamine
      },
      {
        path:'/empPerInfo2',
        component:EmpPerInfo
      },
    ]
  },
  {
    path:'/financeHome',
    component: FinanceHome,
    redirect: "/financeLoanExamine",
    children: [
      {
        path:'/financeLoanExamine',
        component:FinanceLoanExamine
      },
      {
        path:'/financeRepayExamine',
        component:FinanceRepayExamine
      },
      {
        path:'/empPerInfo3',
        component:EmpPerInfo
      },
    ]
  }
]

const router = new VueRouter({
  routes
})
router.beforeEach((to,from,next) =>{
  //检查session中是否有uname
  let path = to.fullPath

  if(path == "/" || sessionStorage.getItem("uname") != null) {
    next()
    return;
  }
  //如果没有登录,跳到登录页面
  next("/")
})

export default router
