<template lang="pug">
.how-to-play-child-mode-content
  i18n(tag="p" path="dialog.howToPlay.body")
    template(#description)
      div(v-html="$t('dialog.howToPlay.description')")
    template(#extra)
      div(v-html="$t('dialog.howToPlay.child.extra', { questionCount: String(ALPHABET_LENGTH) })")
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'
import { ALPHABET_LENGTH } from '@/system/constant'

export default defineComponent({
  setup() {
    return {
      ALPHABET_LENGTH
    }
  }
})
</script>

<style lang="scss" src="./HowToPlayChildModeContent.component.scss"></style>
