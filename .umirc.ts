import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  dva:{},
  antd:{},
  dynamicImport:{
},
metas: [
  {
    httpEquiv: 'Cache-Control',
    content: 'no-cache',
  },
  {
    httpEquiv: 'Pragma',
    content: 'no-cache',
  },
  {
    httpEquiv: 'Expires',
    content: '0',
  },
],
hash:true,
  routes: [
    {
        path:'/login',
        component:'@/pages/login'
    },
    { 
        path: '/', 
        component: '@/pages/index',
        routes:[
            { path:'/', component:'@/pages/monitor_index'},
            { path:'/ceshi', component:'@/pages/monitor_index/Ceshi2'},
            { path:'/ele_monitor', component:'@/pages/ele_monitor'},
            // { 
            //     path:'/ele_monitor', 
            //     component:'@/pages/ele_monitor',
            //     routes:[
            //         { path:'/ele_monitor/transformer', component:'@/pages/monitor_index/transformer' },
            //         { path:'/ele_monitor/high_voltage', component:'@/pages/ele_monitor/high_voltage'}
            //     ]
            // },
            // { path:'/safe_monitor', component:'@/pages/safe_monitor'},
            { path:'/cost_monitor', component:'@/pages/cost_monitor'},
            { path:'/env_monitor', component:'@/pages/env_monitor'},
            { path:'/sys_setting', component:'@/pages/sys_setting'},
            { path:'/data_report', component:'@/pages/data_report'},
            { path:'/model', component:'@/pages/self_model/objLoader' }
        ]
    }
    
    // { 
    //     path:'/a', 
    //     component:'@/pages/pageA/index',
    //     routes:[
    //         { path:'/a/list', component:'@/pages/pageA/List',
    //             routes:[
    //                 { path:'/a/list/1', component:'@/pages/pageA/1'},
    //                 { path:'/a/list/2', component:'@/pages/pageA/2'}
    //             ]
    //         },
    //         { path:'/a/table', component:'@/pages/pageA/Table'}
    //     ]
    // },
    // { path:'/b', component:'@/pages/pageB/index'}
  ],
//   fastRefresh: {},
});
