import { reactive, readonly } from 'vue'

const state = reactive(new Map())

export const eventBus = {
  emit(event, data) {
    //console.log("[EVENTBUS] Running emit")
    if (!state.has(event)) {
      state.set(event, [])
    }
    state.get(event).forEach((callback) => callback(data))
  },
  on(event, callback) {
    //console.log("[EVENTBUS] Received emit")
    if (!state.has(event)) {
      state.set(event, [])
    }
    const eventListeners = state.get(event)
    eventListeners.push(callback)
    state.set(event, eventListeners)

    // Return a cleanup function to remove the listener
    return () => {
      const index = eventListeners.indexOf(callback)
      if (index > -1) {
        eventListeners.splice(index, 1)
      }
    }
  }
}

export default readonly(eventBus)
