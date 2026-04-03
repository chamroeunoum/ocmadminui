import { isAuth } from './Authentication'
import LoginComponent from './../layouts/login/Index.vue'
// import LoginComponent from './../layouts/login/DeepSeek.vue'
import DashboardComponent from '../components/main/Index.vue'
import DashboardWidget from '../components/main/Dashboard.vue'
import DashboardSelector from '../components/main/DashboardSelector.vue'
import OrganizationV11 from '../components/main/OrganizationV11.vue'
import RoleManagementComponent from '@components/role/Index.vue'
import RoleContentComponent from '@components/role/list/Content.vue'
import OrganizationWithHRPage from '../components/main/OrganizationWithHRPage.vue'

/**
 * Error
 */
import Page404 from '@/components/errors/404.vue'

export const getRoutes = () => {
    return [
        { 
            path: '', 
            name: "EmptyURI" ,
            redirect: to => {
                return isAuth() ? '/dashboard' : '/login'
            }
        },
        { 
            path: '/', 
            name: "RootURI" ,
            redirect: to => {
                return isAuth() ? '/dashboard' : '/login'
            }
        },
        {
            name: 'Login',
            path: '/login',
            component: LoginComponent ,
            meta: {
                // transition: 'fade'
            }
        },
        /**
         * Dashboard
         */
        {
            name: "DashboardPage" ,
            path: '/dashboard',
            component: DashboardComponent,
            meta: {
                transition: 'slide-left' ,
                requiresAuth: true
            },
            children: [
                {
                    name: 'DashboardSelector' ,
                    path: '',
                    component: DashboardSelector ,
                    meta : {
                        transition: 'slide-left' ,
                        requiresAuth: true
                    }
                },
                {
                    name: 'DashboardWidgets' ,
                    path: 'organization-v1',
                    component: DashboardWidget ,
                    meta : {
                        transition: 'slide-left' ,
                        requiresAuth: true
                    }
                },
                {
                    name: 'DashboardWidgetsV11' ,
                    path: 'organization-v1-1',
                    component: OrganizationV11 ,
                    meta : {
                        transition: 'slide-left' ,
                        requiresAuth: true
                    }
                },
                {
                    name: 'DashboardHR' ,
                    path: 'hr',
                    component: OrganizationWithHRPage ,
                    meta : {
                        transition: 'slide-left' ,
                        requiresAuth: true
                    }
                }
            ]
        },/**
         * Dashboard
         */
        {
            name: "RoleManagement" ,
            path: '/role',
            component: RoleManagementComponent,
            meta: {
                transition: 'slide-left' ,
                requiresAuth: true
            },
            children: [
                {
                    name: 'RoleContent' ,
                    path: '',
                    component: RoleContentComponent ,
                    meta : {
                        transition: 'slide-left' ,
                        requiresAuth: true
                    }
                }
            ]
        },
        // will match everything and put it under `$route.params.pathMatch`
        { path: '/:pathMatch(.*)*', name: 'NotFound', component: Page404 }
    ]
}
