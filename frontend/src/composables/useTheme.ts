"use client"

import { ref, watch } from "vue"

export type Theme = "light" | "dark"

let themeInstance: ReturnType<typeof createTheme> | null = null

function createTheme() {
  const theme = ref<Theme>("light")
  const isInitialized = ref(false)

  // 应用主题到 document
  const applyTheme = (newTheme: Theme) => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", newTheme)
    }
  }

  // 初始化主题
  const initTheme = () => {
    if (typeof localStorage !== "undefined" && !isInitialized.value) {
      const savedTheme = localStorage.getItem("theme") as Theme | null
      if (savedTheme) {
        theme.value = savedTheme
      }
      applyTheme(theme.value)
      isInitialized.value = true
    }
  }

  // 立即初始化
  initTheme()

  const toggleTheme = () => {
    theme.value = theme.value === "dark" ? "light" : "dark"
  }

  watch(theme, (newTheme) => {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("theme", newTheme)
    }
    applyTheme(newTheme)
  })

  return {
    theme,
    toggleTheme,
    initTheme,
  }
}

export function useTheme() {
  if (!themeInstance) {
    themeInstance = createTheme()
  }
  return themeInstance
}
