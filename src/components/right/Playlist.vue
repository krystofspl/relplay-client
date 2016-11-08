<template>
  <div id="playlist">
    <draggable :list="list" :options="{animation: 150, ghostClass: 'draggable-ghost', chosenClass: 'draggable-drag'}"> 
        <!-- @update, @add, ... -->
        <div v-for="element in list" v-bind:key="element.name">
            {{element.name}}
        </div>
    </draggable>
  </div>
</template>

<script>
import Draggable from 'vuedraggable'
export default {
  data: function () {
    return {
      list: [{name: 'a'}, {name: 'b'}, {name: 'c'}]
    }
  },
  components: {
    Draggable
  }
}
</script>

<style lang="sass" scoped>
#playlist
  cursor: default
  .draggable-drag
    background: pink
    opacity: 0.5
  .draggable-ghost
    background: red
</style>