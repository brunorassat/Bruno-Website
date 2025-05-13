<template>
  <Transition name="fade">
    <div
      v-show="$show"
      class="bg-dark-blur z-1000 dialog pointer-events-auto fixed inset-0 grid w-full cursor-pointer place-items-center"
      @click.self="hide"
    >
      <div @click.stop class="container-md relative">
        <div
          class="surface-base dialog__inner dialog-grid relative overflow-hidden rounded-2xl shadow-xl"
        >

          <!-- Left: Image -->
          <div class="overflow-hidden md:block">
            <img
              :src="contact?.thumbnail || '/src/assets/cosmic_contact.jpg'"
              alt="Contact"
              class="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          <!-- Right: Calendly -->
          <div class="hide-scrollbar dialog__content flex items-center justify-center p-6 w-full h-full">
            <div
              class="calendly-inline-widget w-full h-full"
              data-url="https://calendly.com/brunorassat/30min"
              style="min-width:320px;height:100%;"
            ></div>
          </div>
        </div>

        <!-- Close button -->
        <button
          class="btn btn-icon surface-dark btn-absolute -right-3 -top-3 z-10"
          @click="hide"
        >
          <slot />
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { onMounted } from 'vue'
import { useStore } from '@nanostores/vue'
import { showContact } from '@src/store'

const props = defineProps({
  contact: Object
})

const $show = useStore(showContact)

const hide = () => {
  showContact.set(false)
}

onMounted(() => {
  if (!document.getElementById('calendly-script')) {
    const script = document.createElement('script')
    script.id = 'calendly-script'
    script.src = 'https://assets.calendly.com/assets/external/widget.js'
    script.async = true
    document.body.appendChild(script)
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') hide()
  })
})
</script>

<style lang="postcss">
.z-1000 {
  z-index: 1000;
}
.dialog-grid {
  @apply grid grid-cols-1;
  @screen md {
    grid-template-columns: 4fr 5fr;
  }
}
.bg-dark-blur {
  @apply bg-dark bg-opacity-50 backdrop-blur-sm;
}
.dialog {
  &__inner {
    max-height: calc(100vh - 2rem);
    overflow-x: hidden;
    overflow-y: auto;
    @screen md {
      height: min(100vh - 2rem, 40rem);
    }
  }
  &__content {
    @screen md {
      max-height: calc(100vh - 2rem);
      height: min(100vh - 2rem, 40rem);
      overflow-x: hidden;
      overflow-y: auto;
    }
  }
}
</style>