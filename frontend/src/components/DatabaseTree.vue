<template>
  <div class="database-tree">
    <div class="tree-header">
      <h3>Databases</h3>
      <input 
        type="text" 
        :value="searchQuery"
        @input="$emit('update:searchQuery', ($event.target as HTMLInputElement).value)"
        placeholder="Search..." 
        class="search-input"
      />
    </div>
    
    <div class="tree-content">
      <div v-for="db in filteredDatabases" :key="db.name" class="tree-item">
        <div class="tree-node database-node" @click="toggleDatabase(db)">
          <span class="icon">{{ db.expanded ? '▼' : '▶' }}</span>
          <span class="icon">🗄️</span>
          <span class="name">{{ db.name }}</span>
        </div>
        
        <div v-if="db.expanded" class="tree-children">
          <div 
            v-for="measurement in db.measurements" 
            :key="measurement.name"
            class="tree-item"
          >
            <div 
              class="tree-node measurement-node"
              @click="selectMeasurement(measurement.name, db.name)"
            >
              <span class="icon indent">📊</span>
              <span class="name">{{ measurement.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Database } from '../types'

const props = defineProps<{
  databases: Database[]
  searchQuery: string
}>()

const emit = defineEmits<{
  'update:searchQuery': [query: string]
  'select-item': [item: { type: string; name: string; parent?: string }]
}>()

const filteredDatabases = computed(() => {
  if (!props.searchQuery) return props.databases
  
  const query = props.searchQuery.toLowerCase()
  return props.databases.filter(db => 
    db.name.toLowerCase().includes(query) ||
    db.measurements.some(m => m.name.toLowerCase().includes(query))
  )
})

const toggleDatabase = (db: Database) => {
  db.expanded = !db.expanded
  if (db.expanded) {
    emit('select-item', { type: 'database', name: db.name })
  }
}

const selectMeasurement = (name: string, parent: string) => {
  emit('select-item', { type: 'measurement', name, parent })
}
</script>

<style scoped>
.database-tree {
  width: 280px;
  background: #252830;
  border-right: 1px solid #3a3d45;
  display: flex;
  flex-direction: column;
}

.tree-header {
  padding: 16px;
  border-bottom: 1px solid #3a3d45;
}

.tree-header h3 {
  margin: 0 0 12px 0;
  font-size: 16px;
  color: #e4e6eb;
}

.search-input {
  width: 100%;
  padding: 8px 12px;
  background: #1a1d23;
  border: 1px solid #3a3d45;
  border-radius: 6px;
  color: #e4e6eb;
  font-size: 13px;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
}

.tree-content {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.tree-node {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 8px;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.2s;
}

.tree-node:hover {
  background: #2a2d35;
}

.tree-node .icon {
  font-size: 14px;
}

.tree-node .icon.indent {
  margin-left: 20px;
}

.tree-node .name {
  font-size: 13px;
  color: #e4e6eb;
}

.database-node {
  font-weight: 500;
}

.measurement-node {
  font-weight: 400;
}

.tree-children {
  margin-left: 8px;
}
</style>
