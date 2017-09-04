<template>
    <div class="block tabNav">
        <span class="demonstration"></span>
        <el-pagination
            layout="prev, pager, next"
            :total="pages"
            :page-size="counts"
            @current-change="changePage">
        </el-pagination>
    </div>
</template>

<script>
	export default {
		name: 'page',
        props: ['pages','counts','limitstart','limitend'],
        mounted(){
		    console.log(this.pages)
        },
        methods: {
            changePage(page) {
                this.$emit('update:limitstart',(page - 1) * this.counts);
                this.$emit('update:limitend',(page - 1) * this.counts + this.counts);
            }
        }
	}
</script>

<style>
    .tabNav {
        width: 450px;
        text-align: center;
        margin: 20px auto;
    }
</style>
