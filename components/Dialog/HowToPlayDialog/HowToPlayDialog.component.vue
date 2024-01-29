<template lang="pug">
Dialog.dialog.how-to-play-dialog(
  v-model="state.isOpen"
  :title="$t('dialog.howToPlay.title')"
  :cancel-button-text="cancelButtonText || $t('dialog.howToPlay.cancelButtonText')"
  :show-confirm-button="false"
  :show-cancel-button="true"
  :close-on-click-overlay="false"
  @closed="$emit('closed')"
)
  .how-to-play-dialog__explain
    HowToPlayDailyModeContent(v-if="activeGameMode === gameModeKeyEnum.DAILY")
    HowToPlayUnlimitedModeContent(v-if="activeGameMode === gameModeKeyEnum.UNLIMITED")
    HowToPlayCreatorModeContent(v-if="activeGameMode === gameModeKeyEnum.CREATOR")
    HowToPlayChildModeContent(v-if="activeGameMode === gameModeKeyEnum.CHILD")
</template>

<script>
import { defineComponent, reactive, watch } from '@nuxtjs/composition-api'
import { ALPHABET_LENGTH } from '@/system/constant'
import { gameModeKeyEnum } from '@/enums'
import { useGameMode } from '@/hooks'
import { Dialog } from 'vant'
import { HowToPlayDailyModeContent, HowToPlayUnlimitedModeContent, HowToPlayCreatorModeContent, HowToPlayChildModeContent } from '@/components/Content'

export default defineComponent({
  components: {
    Dialog: Dialog.Component,
    HowToPlayDailyModeContent,
    HowToPlayUnlimitedModeContent,
    HowToPlayCreatorModeContent,
    HowToPlayChildModeContent
  },
  props: {
    isOpen: {
      type: Boolean,
      required: false,
      default: false
    },
    cancelButtonText: {
      type: String,
      required: false,
      default: null
    }
  },
  setup(props) {
    const { activeGameMode } = useGameMode()

    const state = reactive({
      isOpen: props.isOpen
    })

    watch(
      () => props.isOpen,
      value => {
        state.isOpen = value
      }
    )

    return {
      ALPHABET_LENGTH,
      gameModeKeyEnum,
      activeGameMode,
      state
    }
  }
})
</script>

<style lang="scss" src="./HowToPlayDialog.component.scss"></style>
