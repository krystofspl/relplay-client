<template>
  <transition name="modal">
    <div class="modal-mask-wrapper">
      <div class="modal-mask">
        <div class="modal-wrapper">
          <div class="modal-container">
            <div class="modal-header">
              <slot name="header">
                default header
              </slot>
            </div>
            <div class="modal-actions">
              <slot name="actions">
                <div @click="$emit('close')">
                  <icon class="action" scale="1.5" name="times-circle"></icon>
                </div>
              </slot>
            </div>
            <div class="modal-body">
              <slot name="body">
                default body
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
  import 'vue-awesome/icons'
  export default {
    components: {
      Icon
    }
  }
</script>

<style lang="sass" scoped>
.modal-mask-wrapper
  position: fixed
  top: 0
  left: 0
  width: 100%
  height: 100%
  z-index: 1
  transition: opacity .3s ease
  .modal-mask
    position: fixed
    top: 0
    left: 0
    width: 100%
    height: 100%
    background-color: rgba(0, 0, 0, 0.5)
    display: table

    .modal-wrapper
      display: table-cell
      vertical-align: middle
      .modal-container
        width: 70%
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
          padding: 0
          float: left
        .modal-actions
          float: right
          .action
            &:hover
              color: #FFF
        .modal-body
          width: 100%
          float: left
          margin: 0 0

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