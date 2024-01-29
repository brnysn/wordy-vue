export default {
  async fetchQuestions({ commit }) {
    const questionsResponse = await fetch(`${process.env.API}/modes/unlimited?level=1`)
    const questionsResult = await questionsResponse.json()

    commit('SET_QUESTIONS', {
      questions: questionsResult.data.questions
    })
  }
}
