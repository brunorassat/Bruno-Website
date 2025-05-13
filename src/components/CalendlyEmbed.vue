<template>
  <div class="p-6 text-center">
    <h2 class="text-3xl font-bold mb-4">Book a 30-Minute Call</h2>
    <p class="mb-4">Choose a time below that works for you:</p>
    <div 
      class="calendly-inline-widget mx-auto"
      :data-url="url"
      style="min-width:320px;height:630px;">
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
const url = "https://calendly.com/brunorassat/30min"

onMounted(() => {
  if (!document.getElementById('calendly-script')) {
    const script = document.createElement('script')
    script.id = 'calendly-script'
    script.src = 'https://assets.calendly.com/assets/external/widget.js'
    script.async = true
    document.body.appendChild(script)
  }
})
</script>
