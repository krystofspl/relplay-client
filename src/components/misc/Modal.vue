<template>
  <transition name="modal">
    <div class="modal-mask-wrapper">
      <div class="modal-mask">
        <div class="modal-wrapper">
          <div class="modal-container">
            <div class="modal-header">
              <slot name="header">
              </slot>
            </div>
            <div class="modal-actions">
              <slot name="actions"></slot>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <div @click="$emit('close')" class="action">
                <icon scale="1.3" name="times-circle"></icon>
              </div>
            </div>
            <div class="modal-body">
              <slot name="body">
              </slot>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import Icon from 'vue-awesome/components/Icon'
  import 'vue-awesome/icons/times'
  export default {
    components: {
      Icon
    }
  }
</script>

<style lang="sass">
.modal-mask-wrapper
  position: absolute
  top: 0
  left: 0
  width: 100%
  height: 100%
  z-index: 110
  transition: opacity .3s ease
  .modal-mask
    position: fixed
    top: 0
    left: 0
    width: 100%
    height: 100%
    background-color: rgba(0, 0, 0, 0.7)
    display: table

    .modal-wrapper
      display: table-cell
      vertical-align: middle
      .modal-container
        min-width: 50%
        max-width: 70%
        min-height: 30%
        max-height: 70%
        overflow: auto
        margin: 0px auto
        padding: 10px 15px 20px 15px
        background-color: #666
        border-radius: 4px
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33)
        transition: all .3s ease
        .modal-header
          margin: 0
          padding: 0 0 1px 0
          float: left
          h2
            margin: 0
            padding: 0
            text-shadow: 3px 2px 3px rgba(0,0,0,0.1)
        .modal-actions
          float: right
          .action
            display: inline
            &:hover
              color: #FFF
        .modal-body
          width: 100%
          float: left
          margin: 0
          padding-top: 10px
          border-top: 1px solid #606060
  /*
   * The following styles are auto-applied to elements with
   * transition="modal" when their visibility is toggled
   * by Vue.js.
   */

.modal-enter, .modal-leave-active
  opacity: 0

.modal-enter .modal-container, .modal-leave-active .modal-container
  -webkit-transform: scale(1.1)
  transform: scale(1.1)
</style>