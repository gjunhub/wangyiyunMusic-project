<template>
    <div id="footers" name="footers">
        <div class="control">
            <img class="prev" src="../assets/music_pre.png" alt="">
            <img class="play" src="../assets/music_play.png" alt="">
            <img class="play" src="../assets/music_stop.png" alt="">
            <img class="next" src="../assets/music_next.png" alt="">
        </div>

        <div class="progress">
            <span class="current"></span>
            <span class="playProgress"></span>
            <span class="end"></span>
            <img src="../assets/volume.png" alt="">
            <span class="volumeprogress"></span>
            <audio src=""></audio>
        </div>

    </div>
</template>

<script>
    import Vue from 'vue'

	export default {
		name: 'playNow'
	}
</script>

<style>

</style>
