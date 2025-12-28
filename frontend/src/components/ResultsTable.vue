<template>
  <div class="results-table">
    <div class="results-header">
      <span class="header-title">Query Results</span>
      <span v-if="executionTime > 0" class="execution-time">
        Executed in {{ executionTime.toFixed(2) }}ms
      </span>
    </div>
    
    <div v-if="error" class="error-message">
      ❌ {{ error }}
    </div>
    
    <div v-else-if="results.length === 0" class="empty-state">
      No results to display. Execute a query to see results here.
    </div>
    
    <div v-else class="table-container">
      <table>
        <thead>
          <tr>
            <th v-for="column in columns" :key="column">{{ column }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in results" :key="index">
            <td v-for="column in columns" :key="column">{{ row[column] }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { QueryResult } from '../types'

const props = defineProps<{
  results: QueryResult[]
  executionTime: number
  error: string
}>()

const columns = computed(() => {
  if (props.results.length === 0) return []
  return Object.keys(props.results[0])
})
</script>

<style scoped>
.results-table {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
}

.header-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.execution-time {
  font-size: 12px;
  color: #10b981;
}

.error-message {
  padding: 20px;
  color: #ef4444;
  text-align: center;
}

.empty-state {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  font-size: 14px;
}

.table-container {
  flex: 1;
  overflow: auto;
  background: var(--bg-primary);
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  position: sticky;
  top: 0;
  background: var(--bg-secondary);
  z-index: 1;
}

th {
  padding: 12px 16px;
  text-align: left;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
  border-bottom: 1px solid var(--border-color);
}

td {
  padding: 10px 16px;
  font-size: 13px;
  color: var(--text-primary);
  border-bottom: 1px solid var(--border-color);
}

tbody tr:hover {
  background: var(--bg-hover);
}
</style>
