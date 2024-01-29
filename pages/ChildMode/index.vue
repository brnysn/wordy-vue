<template lang="pug">
.page.child-mode-page
  // Game Scene
  ChildModeGameScene
</template>

<script>
import { defineComponent, useContext } from '@nuxtjs/composition-api'
import { ChildModeGameScene } from '@/components/Scene'

export default defineComponent({
  components: {
    ChildModeGameScene
  },
  layout: 'Default/Default.layout',
  setup() {
    const { i18n, redirect, localePath } = useContext()

    if (i18n.locale !== i18n.defaultLocale) {
      redirect(localePath({ name: 'Main' }))
    }
  }
})
</script>

<style lang="scss" src="./ChildMode.page.scss"></style>
