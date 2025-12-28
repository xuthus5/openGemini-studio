<template>
  <div class="h-screen flex flex-col bg-background text-foreground">
     Top Toolbar 
    <div class="h-12 bg-card border-b border-border flex items-center justify-between px-4">
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-2">
          <Database class="w-5 h-5 text-primary" />
          <span class="font-semibold text-lg">OpenGemini Client</span>
        </div>
        <div class="flex items-center gap-2">
          <button
            @click="showConnectionDialog = true"
            class="px-3 py-1.5 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors text-sm font-medium flex items-center gap-2"
          >
            <Plus class="w-4 h-4" />
            New Connection
          </button>
          <button
            v-if="currentConnection"
            @click="disconnect"
            class="px-3 py-1.5 bg-destructive/10 text-destructive rounded hover:bg-destructive/20 transition-colors text-sm font-medium flex items-center gap-2"
          >
            <X class="w-4 h-4" />
            Disconnect
          </button>
        </div>
      </div>
      <div class="flex items-center gap-3 text-sm text-muted-foreground">
        <div v-if="currentConnection" class="flex items-center gap-2">
          <div class="w-2 h-2 rounded-full bg-success animate-pulse"></div>
          <span>{{ currentConnection.host }}:{{ currentConnection.port }}</span>
        </div>
        <button class="hover:text-foreground transition-colors">
          <Settings class="w-4 h-4" />
        </button>
      </div>
    </div>

     Main Content Area 
    <div class="flex-1 flex overflow-hidden">
       Left Sidebar - Database Navigator 
      <div class="w-64 bg-card border-r border-border flex flex-col">
        <div class="p-3 border-b border-border">
          <div class="relative">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search databases..."
              class="w-full pl-9 pr-3 py-2 bg-background border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>
        
        <div class="flex-1 overflow-y-auto p-2">
          <div v-if="!currentConnection" class="text-center text-muted-foreground text-sm py-8">
            <Database class="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No connection</p>
            <p class="text-xs mt-1">Click "New Connection" to start</p>
          </div>
          
          <div v-else class="space-y-1">
            <div
              v-for="db in filteredDatabases"
              :key="db.name"
              class="group"
            >
              <div
                @click="toggleDatabase(db.name)"
                class="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-accent cursor-pointer transition-colors"
              >
                <ChevronRight
                  :class="['w-4 h-4 transition-transform', expandedDatabases.includes(db.name) ? 'rotate-90' : '']"
                />
                <Database class="w-4 h-4 text-primary" />
                <span class="text-sm font-medium flex-1">{{ db.name }}</span>
                <span class="text-xs text-muted-foreground opacity-0 group-hover:opacity-100">
                  {{ db.measurements.length }}
                </span>
              </div>
              
              <div v-if="expandedDatabases.includes(db.name)" class="ml-6 mt-1 space-y-1">
                <div
                  v-for="measurement in db.measurements"
                  :key="measurement"
                  @click="selectMeasurement(db.name, measurement)"
                  :class="[
                    'flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer transition-colors text-sm',
                    selectedMeasurement?.db === db.name && selectedMeasurement?.name === measurement
                      ? 'bg-primary/20 text-primary'
                      : 'hover:bg-accent'
                  ]"
                >
                  <Table2 class="w-4 h-4" />
                  <span>{{ measurement }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

       Center & Right - Query Editor and Results 
      <div class="flex-1 flex flex-col">
         Query Editor 
        <div class="h-1/2 border-b border-border flex flex-col">
          <div class="h-10 bg-card border-b border-border flex items-center justify-between px-4">
            <div class="flex items-center gap-2 text-sm font-medium">
              <FileCode class="w-4 h-4" />
              <span>Query Editor</span>
            </div>
            <div class="flex items-center gap-2">
              <button
                @click="executeQuery"
                :disabled="!currentConnection || isExecuting"
                class="px-3 py-1 bg-success text-success-foreground rounded hover:bg-success/90 transition-colors text-sm font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Play class="w-3 h-3" />
                Execute
              </button>
              <button
                @click="clearQuery"
                class="px-3 py-1 bg-muted hover:bg-muted/80 rounded transition-colors text-sm"
              >
                Clear
              </button>
            </div>
          </div>
          
          <div class="flex-1 relative">
            <textarea
              v-model="query"
              placeholder="Enter your InfluxQL query here...&#10;&#10;Example:&#10;SELECT * FROM cpu_usage WHERE time > now() - 1h&#10;SHOW DATABASES&#10;SHOW MEASUREMENTS"
              class="w-full h-full p-4 bg-background font-mono text-sm resize-none focus:outline-none"
              spellcheck="false"
            ></textarea>
            <div class="absolute bottom-2 right-2 text-xs text-muted-foreground bg-card px-2 py-1 rounded border border-border">
              {{ query.length }} characters
            </div>
          </div>
        </div>

         Results Panel 
        <div class="flex-1 flex flex-col bg-background">
          <div class="h-10 bg-card border-b border-border flex items-center justify-between px-4">
            <div class="flex items-center gap-4">
              <div class="flex items-center gap-2 text-sm font-medium">
                <TableIcon class="w-4 h-4" />
                <span>Results</span>
              </div>
              <div v-if="queryResult" class="text-xs text-muted-foreground">
                {{ queryResult.rows.length }} rows in {{ queryResult.executionTime }}ms
              </div>
            </div>
            <div class="flex items-center gap-2">
              <button
                v-if="queryResult"
                @click="exportResults"
                class="px-2 py-1 hover:bg-accent rounded transition-colors text-sm flex items-center gap-1"
              >
                <Download class="w-3 h-3" />
                Export
              </button>
            </div>
          </div>
          
          <div class="flex-1 overflow-auto">
            <div v-if="!queryResult" class="flex items-center justify-center h-full text-muted-foreground">
              <div class="text-center">
                <TableIcon class="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p class="text-sm">No results to display</p>
                <p class="text-xs mt-1">Execute a query to see results here</p>
              </div>
            </div>
            
            <div v-else-if="queryResult.error" class="p-4">
              <div class="bg-destructive/10 border border-destructive/30 rounded p-4">
                <div class="flex items-start gap-3">
                  <AlertCircle class="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 class="font-semibold text-destructive mb-1">Query Error</h4>
                    <p class="text-sm text-destructive/90">{{ queryResult.error }}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <table v-else class="w-full text-sm">
              <thead class="bg-card sticky top-0 border-b border-border">
                <tr>
                  <th
                    v-for="column in queryResult.columns"
                    :key="column"
                    class="px-4 py-2 text-left font-semibold text-xs uppercase tracking-wider"
                  >
                    {{ column }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(row, index) in queryResult.rows"
                  :key="index"
                  class="border-b border-border hover:bg-accent/50 transition-colors"
                >
                  <td
                    v-for="column in queryResult.columns"
                    :key="column"
                    class="px-4 py-2 font-mono text-xs"
                  >
                    {{ formatValue(row[column]) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

     Connection Dialog 
    <div
      v-if="showConnectionDialog"
      class="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      @click.self="showConnectionDialog = false"
    >
      <div class="bg-card border border-border rounded-lg w-full max-w-md p-6 shadow-2xl">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold">New Connection</h2>
          <button
            @click="showConnectionDialog = false"
            class="hover:bg-accent rounded p-1 transition-colors"
          >
            <X class="w-5 h-5" />
          </button>
        </div>
        
        <form @submit.prevent="connect" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-2">Connection Name</label>
            <input
              v-model="connectionForm.name"
              type="text"
              placeholder="My OpenGemini Server"
              class="w-full px-3 py-2 bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary/50"
              required
            />
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-2">Host</label>
              <input
                v-model="connectionForm.host"
                type="text"
                placeholder="localhost"
                class="w-full px-3 py-2 bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary/50"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">Port</label>
              <input
                v-model="connectionForm.port"
                type="number"
                placeholder="8086"
                class="w-full px-3 py-2 bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary/50"
                required
              />
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-2">Username (Optional)</label>
            <input
              v-model="connectionForm.username"
              type="text"
              placeholder="admin"
              class="w-full px-3 py-2 bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-2">Password (Optional)</label>
            <input
              v-model="connectionForm.password"
              type="password"
              placeholder="••••••••"
              class="w-full px-3 py-2 bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          
          <div class="flex gap-3 pt-4">
            <button
              type="submit"
              class="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors font-medium"
            >
              Connect
            </button>
            <button
              type="button"
              @click="showConnectionDialog = false"
              class="px-4 py-2 bg-muted hover:bg-muted/80 rounded transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  Database,
  Table2,
  Search,
  ChevronRight,
  Settings,
  Plus,
  X,
  FileCode,
  Play,
  Download,
  AlertCircle,
  Table as TableIcon
} from 'lucide-vue-next'

// Connection state
const showConnectionDialog = ref(false)
const currentConnection = ref(null)
const connectionForm = ref({
  name: '',
  host: 'localhost',
  port: 8086,
  username: '',
  password: ''
})

// Database state
const databases = ref([
  {
    name: 'telegraf',
    measurements: ['cpu', 'disk', 'mem', 'processes', 'system']
  },
  {
    name: 'monitoring',
    measurements: ['http_requests', 'api_latency', 'error_rate']
  },
  {
    name: 'iot_sensors',
    measurements: ['temperature', 'humidity', 'pressure']
  }
])

const expandedDatabases = ref([])
const selectedMeasurement = ref(null)
const searchQuery = ref('')

// Query state
const query = ref('')
const queryResult = ref(null)
const isExecuting = ref(false)

// Computed
const filteredDatabases = computed(() => {
  if (!searchQuery.value) return databases.value
  const search = searchQuery.value.toLowerCase()
  return databases.value.filter(db =>
    db.name.toLowerCase().includes(search) ||
    db.measurements.some(m => m.toLowerCase().includes(search))
  )
})

// Methods
const connect = () => {
  currentConnection.value = { ...connectionForm.value }
  showConnectionDialog.value = false
  
  // Reset form
  connectionForm.value = {
    name: '',
    host: 'localhost',
    port: 8086,
    username: '',
    password: ''
  }
}

const disconnect = () => {
  currentConnection.value = null
  expandedDatabases.value = []
  selectedMeasurement.value = null
  queryResult.value = null
}

const toggleDatabase = (dbName) => {
  const index = expandedDatabases.value.indexOf(dbName)
  if (index > -1) {
    expandedDatabases.value.splice(index, 1)
  } else {
    expandedDatabases.value.push(dbName)
  }
}

const selectMeasurement = (dbName, measurement) => {
  selectedMeasurement.value = { db: dbName, name: measurement }
  query.value = `SELECT * FROM "${measurement}" LIMIT 100`
}

const executeQuery = async () => {
  if (!query.value.trim()) return
  
  isExecuting.value = true
  
  // Simulate query execution
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // Mock results
  if (query.value.toLowerCase().includes('show databases')) {
    queryResult.value = {
      columns: ['name'],
      rows: databases.value.map(db => ({ name: db.name })),
      executionTime: 23
    }
  } else if (query.value.toLowerCase().includes('show measurements')) {
    const db = databases.value[0]
    queryResult.value = {
      columns: ['name'],
      rows: db.measurements.map(m => ({ name: m })),
      executionTime: 18
    }
  } else {
    queryResult.value = {
      columns: ['time', 'host', 'value', 'region'],
      rows: Array.from({ length: 50 }, (_, i) => ({
        time: new Date(Date.now() - i * 60000).toISOString(),
        host: `server-${(i % 5) + 1}`,
        value: (Math.random() * 100).toFixed(2),
        region: ['us-east', 'us-west', 'eu-central'][i % 3]
      })),
      executionTime: 45
    }
  }
  
  isExecuting.value = false
}

const clearQuery = () => {
  query.value = ''
}

const exportResults = () => {
  if (!queryResult.value) return
  
  // Convert to CSV
  const csv = [
    queryResult.value.columns.join(','),
    ...queryResult.value.rows.map(row =>
      queryResult.value.columns.map(col => row[col]).join(',')
    )
  ].join('\n')
  
  // Download
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'query-results.csv'
  a.click()
  URL.revokeObjectURL(url)
}

const formatValue = (value) => {
  if (value === null || value === undefined) return 'NULL'
  if (typeof value === 'number') return value.toLocaleString()
  return value
}
</script>

<style scoped>
/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: hsl(var(--background));
}

::-webkit-scrollbar-thumb {
  background: hsl(var(--border));
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: hsl(var(--muted-foreground));
}

/* Syntax highlighting hint */
textarea {
  tab-size: 2;
}
</style>
