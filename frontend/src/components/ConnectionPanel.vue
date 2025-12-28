<template>
  <div class="connection-panel">
    <div class="connection-form">
      <h2>Connect to OpenGemini</h2>
      
      <div class="form-group">
        <label>Host</label>
        <input 
          type="text" 
          :value="connectionConfig.host"
          @input="updateConfig('host', ($event.target as HTMLInputElement).value)"
          placeholder="localhost"
        />
      </div>
      
      <div class="form-group">
        <label>Port</label>
        <input 
          type="number" 
          :value="connectionConfig.port"
          @input="updateConfig('port', parseInt(($event.target as HTMLInputElement).value))"
          placeholder="8086"
        />
      </div>
      
      <div class="form-group">
        <label>Username</label>
        <input 
          type="text" 
          :value="connectionConfig.username"
          @input="updateConfig('username', ($event.target as HTMLInputElement).value)"
          placeholder="admin"
        />
      </div>
      
      <div class="form-group">
        <label>Password</label>
        <input 
          type="password" 
          :value="connectionConfig.password"
          @input="updateConfig('password', ($event.target as HTMLInputElement).value)"
          placeholder="••••••••"
        />
      </div>
      
      <div class="form-group">
        <label>Database (Optional)</label>
        <input 
          type="text" 
          :value="connectionConfig.database"
          @input="updateConfig('database', ($event.target as HTMLInputElement).value)"
          placeholder="telegraf"
        />
      </div>
      
      <button @click="$emit('connect')" class="connect-btn">
        Connect to Database
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ConnectionConfig } from '../types'

const props = defineProps<{
  connectionConfig: ConnectionConfig
}>()

const emit = defineEmits<{
  'update:connectionConfig': [config: ConnectionConfig]
  connect: []
}>()

const updateConfig = (key: keyof ConnectionConfig, value: string | number) => {
  emit('update:connectionConfig', {
    ...props.connectionConfig,
    [key]: value
  })
}
</script>

<style scoped>
.connection-panel {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #1a1d23;
}

.connection-form {
  width: 100%;
  max-width: 400px;
  padding: 32px;
  background: #252830;
  border-radius: 12px;
  border: 1px solid #3a3d45;
}

.connection-form h2 {
  margin: 0 0 24px 0;
  font-size: 24px;
  color: #e4e6eb;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #9ca3af;
}

.form-group input {
  width: 100%;
  padding: 10px 12px;
  background: #1a1d23;
  border: 1px solid #3a3d45;
  border-radius: 6px;
  color: #e4e6eb;
  font-size: 14px;
  transition: border-color 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: #3b82f6;
}

.connect-btn {
  width: 100%;
  padding: 12px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.connect-btn:hover {
  background: #2563eb;
}
</style>
