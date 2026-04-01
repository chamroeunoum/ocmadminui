import { createRouter, createWebHashHistory } from 'vue-router'
import { getRoutes } from './plugins/Route'
let routes = getRoutes()
const router = createRouter({
    history: createWebHashHistory(),
    routes
})

// Meta Handling
router.beforeEach((to, from) => {
    // Return false to cancel navigation
    // if (!isAuthenticated) {
    //     return false
    // }
    // Return true to allow navigation
    return true
})

router.beforeResolve(async to => {
    if (to.meta.requiresCamera) {
        try {
        await askForCameraPermission()
        } catch (error) {
        if (error instanceof NotAllowedError) {
            // ... handle the error and then cancel the navigation
            return false
        } else {
            // unexpected error, cancel the navigation and pass the error to the global handler
            throw error
        }
        }
    }
})

export default router