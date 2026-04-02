import { isAuth } from './Authentication'
import LoginComponent from './../layouts/login/Index.vue'
// import LoginComponent from './../layouts/login/DeepSeek.vue'
import DashboardComponent from '../components/main/Index.vue'
import DashboardWidget from '../components/main/Dashboard.vue'

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
                    name: 'DashboardWidgets' ,
                    path: '',
                    component: DashboardWidget ,
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
