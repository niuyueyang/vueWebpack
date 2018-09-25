<template>
	<div id="texts">
		<span>{{texts}}</span>
		<div class="img"></div>
	</div>
</template>

<script>
	import '../assests/css/test.css';
	export default{
		data(){
			return {
				texts:"vue"
			}
		}
	}
</script>

<style>
	#texts{
		font-size: 18px;
	}
</style>