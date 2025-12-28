<template>
  <div class="query-history">
    <div class="history-header">
      <span class="header-title">{{ $t('history.title') }}</span>
      <button @click="$emit('clear')" class="clear-btn" title="Clear History">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
        </svg>
      </button>
    </div>
    <div class="history-list">
      <div 
        v-for="item in history" 
        :key="item.id"
        class="history-item"
        :class="{ 'error': !item.success }"
        @click="$emit('select', item.query)"
      >
        <div class="item-header">
          <span class="item-time">{{ formatTime(item.timestamp) }}</span>
          <span class="item-duration">{{ item.executionTime.toFixed(2) }}ms</span>
        </div>
        <div class="item-query">{{ truncateQuery(item.query) }}</div>
        <div v-if="item.database || item.retentionPolicy" class="item-meta">
          <span v-if="item.database">DB: {{ item.database }}</span>
          <span v-if="item.retentionPolicy">RP: {{ item.retentionPolicy }}</span>
        </div>
        <div v-if="item.error" class="item-error">{{ item.error }}</div>
      </div>
      <div v-if="history.length === 0" class="empty-state">
        No query history yet
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { QueryHistoryItem } from '../types'

defineProps<{
  history: QueryHistoryItem[]
}>()

defineEmits<{
  select: [query: string]
  clear: []
}>()

const formatTime = (date: Date) => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  
  if (hours > 0) return `${hours}h ago`
  if (minutes > 0) return `${minutes}m ago`
  return `${seconds}s ago`
}

const truncateQuery = (query: string) => {
  const maxLength = 100
  if (query.length <= maxLength) return query
  return query.substring(0, maxLength) + '...'
}
</script>

<style scoped>
.query-history {
  display: flex;
  flex-direction: column;
  width: 300px;
  border-left: 1px solid var(--border-color);
  background: var(--bg-secondary);
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-color);
}

.header-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.clear-btn {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s;
}

.clear-btn:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.history-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.history-item {
  padding: 12px;
  margin-bottom: 8px;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.history-item:hover {
  border-color: var(--accent-color);
  background: var(--bg-hover);
}

.history-item.error {
  border-color: #ef4444;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.item-time {
  font-size: 11px;
  color: var(--text-secondary);
}

.item-duration {
  font-size: 11px;
  color: var(--accent-color);
  font-weight: 600;
}

.item-query {
  font-size: 12px;
  color: var(--text-primary);
  font-family: 'JetBrains Mono', 'LXGW WenKai Lite', 'Consolas', 'Monaco', 'Courier New', monospace;
  line-height: 1.4;
  word-break: break-all;
}

.item-meta {
  display: flex;
  gap: 12px;
  margin-top: 6px;
  font-size: 11px;
  color: var(--text-secondary);
}

.item-error {
  margin-top: 6px;
  font-size: 11px;
  color: #ef4444;
}

.empty-state {
  text-align: center;
  padding: 32px 16px;
  color: var(--text-secondary);
  font-size: 13px;
}
</style>
