<template>
    <div class="absolute left-1 top-1 w-14 text-4xl font-tacteing text-yellow-800" >*</div>
    <div class="absolute right-1 top-1 w-14 text-4xl font-tacteing text-yellow-800" >&</div>
    <div class="absolute right-1 bottom-1 w-14 text-4xl font-tacteing text-yellow-800" >-</div>
    <div class="absolute left-1 bottom-1 w-14 text-4xl font-tacteing text-yellow-800" >,</div>
</template>
<script>

export default {
    components: {
        
    },
    props: [
        'size'
    ],
    data() {
        return {
            icon: {
                size: this.size
            }
        }
    },
    computed: {
    
    },
    mounted() {
        
    },
    methods: {
        /** Get total documents of the user */
    },
}
</script>