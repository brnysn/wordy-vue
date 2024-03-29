<template lang="pug">
.scene.game-scene.child-mode-game-scene(
  ref="rootRef"
  tabindex="1"
  :class="{ 'game-scene--isMobileDevice': $ua.isFromMobilephone(), 'game-scene--gameOver': isGameOver, 'game-scene--osk': answer.isFocused }"
)
  // Scene Inner
  .scene__inner.game-scene__inner
    // Alphabet
    .alphabet.value.swiper.alphabet-carousel
      .alphabet__inner.swiper-wrapper
        .swiper-slide(v-for="(item, index) in alphabet.items")
          .alphabet__item(:class="[alphabetItemClasses(item, index)]") {{ item.letter }}

    // Countdown
    .countdown.game-scene__countdown(:class="{ 'd-none': fetchState.pending || fetchState.error }")
      AppIcon.countdown__icon(name="tabler:clock" color="var(--color-icon-01)")
      CountDown.countdown__timer(
        ref="countdownTimerRef"
        format="mm:ss"
        :auto-start="false"
        :time="countdown.time"
        @change="listenCountdown"
        @finish="handleCountdownFinish"
      )

    // Fetch State
    template(v-if="fetchState.pending")
      Empty(:description="$t('gameScene.pendingQuestions')")

    template(v-else-if="fetchState.error")
      Empty(image="error" :description="$t('gameScene.error.fetchQuestions.description')")
        Button(@click="reFetch") {{ $t('gameScene.error.fetchQuestions.action') }}

    template(v-else)
      // Questions
      .questions
        .question(
          v-for="(question, index) in questions"
          v-show="index === alphabet.activeIndex"
          :class="{ 'question--active': index === alphabet.activeIndex, 'question--osk': answer.isFocused }"
        )
          strong.question__title {{ question.question }}
          small.question__answer {{ question.answer }}

      // Field Section
      section.game-scene__fieldSection(:class="{ 'game-scene__fieldSection--disabled': !isGameStarted }")
        // Answer Field
        .answer-field
          .child_buttons
            // Optional action buttons
            Button.answer-field__child_button.answer-field__button--correct(
              color="var(--color-success-01)"
              icon="guide-o"
              @click="correctAnswer"
            ) DOĞRU

            Button.answer-field__child_button.answer-field__button--wrong(
              color="var(--color-brand-02)"
              icon="guide-o"
              @click="wrongAnswer"
            ) YANLIŞ

            Button.answer-field__child_button.answer-field__button--pass.do-not-hide-keyboard.do-not-hide-keyboard--pass(
              color="var(--color-warning-01)"
              icon="arrow"
              @click="pass"
            ) {{ $t('gameScene.answerField.pass') }}

            Button.answer-field__child_button.answer-field__button--pass.do-not-hide-keyboard.do-not-hide-keyboard--pass(
              color="var(--color-warning-01)"
              icon="arrow"
              @click="endGame"
            ) BİTİR

  // How To Play Dialog
  HowToPlayDialog(v-if="!isGameOver" :isOpen="dialog.howToPlay.isOpen" @closed="startGame")
  // Stats Dialog
  ChildModeStatsDialog(:isOpen="dialog.stats.isOpen")
</template>

<script>
import { defineComponent, useStore, useFetch, ref, onMounted, onUnmounted } from '@nuxtjs/composition-api'
import { ANSWER_CHAR_LENGTH } from '@/system/constant'
import { useGameScene } from '@/hooks'
import { Button, Field, Empty, CountDown } from 'vant'
import { AppIcon } from '@/components/Icon'
import { HowToPlayDialog, ChildModeStatsDialog } from '@/components/Dialog'

export default defineComponent({
  components: {
    Button,
    Field,
    Empty,
    CountDown,
    AppIcon,
    HowToPlayDialog,
    ChildModeStatsDialog
  },
  setup() {
    const rootRef = ref(null)

    const store = useStore()
    const persistStore = JSON.parse(window.localStorage.getItem('persistStore'))

    const {
      setRootRef,
      isGameStarted,
      isGameOver,
      alphabet,
      alphabetItemClasses,
      questions,
      answer,
      countdown,
      countdownTimerRef,
      handleTabKey,
      correctAnswer,
      wrongAnswer,
      pass,
      initCarousels,
      dialog,
      startGame,
      endGame,
      listenCountdown,
      handleCountdownFinish,
      questionFitText,
      handleBeforeUnload,
      scrollTop,
      checkUnsupportedHeight
    } = useGameScene()

    // Fetch Questions
    const { fetch, fetchState } = useFetch(async () => {
      await store.dispatch('child/fetchQuestions')
    })

    const reFetch = async () => {
      await resetGame()

      if (questions.value.length > 0) {
        startGame()
      }
    }

    const resetGame = async () => {
      await fetch()
      await store.commit('child/SET_IS_GAME_OVER', {
        isGameOver: false
      })
      await store.commit('child/RESET_COUNTDOWN_TIMER')
      await store.commit('child/RESET_ALPHABET')
      await store.commit('child/SET_IS_OPEN_STATS_DIALOG', false)

      dialog.howToPlay.isOpen = true
    }

    onMounted(() => {
      setRootRef(rootRef.value)
      resetGame()

      initCarousels()

      window.addEventListener('keyup', event => handleTabKey(event))

      window.addEventListener('resize', questionFitText)
      window.addEventListener('beforeunload', event => handleBeforeUnload(event))

      window.addEventListener('scroll', scrollTop)

      // Unsupported screen height
      checkUnsupportedHeight()
    })

    onUnmounted(() => {
      window.removeEventListener('resize', questionFitText)
      window.removeEventListener('beforeunload', handleBeforeUnload)

      window.removeEventListener('scroll', scrollTop)
    })

    return {
      rootRef,
      ANSWER_CHAR_LENGTH,
      fetch,
      fetchState,
      reFetch,
      isGameStarted,
      isGameOver,
      alphabet,
      questions,
      answer,
      dialog,
      countdown,
      countdownTimerRef,
      alphabetItemClasses,
      pass,
      correctAnswer,
      wrongAnswer,
      startGame,
      endGame,
      listenCountdown,
      handleCountdownFinish,
      resetGame
    }
  }
})
</script>

<style lang="scss" src="./ChildModeGameScene.component.scss"></style>
