<template>
  <div class="phone">
    <span class="phone-island" aria-hidden="true" />
    <div class="phone-screen">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.phone {
  position: relative;
  width: min(100%, 17.5rem);
  margin-inline: auto;
  padding: 0.62rem;
  border: 1px solid rgb(255 255 255 / 0.14);
  border-radius: 2.15rem;
  background: linear-gradient(180deg, #2a303b 0%, #12151b 100%);
  box-shadow: var(--shadow-device);
}

.phone-island {
  position: absolute;
  z-index: 2;
  top: 0.95rem;
  left: 50%;
  width: 28%;
  height: 0.85rem;
  border-radius: 999px;
  background: #0d1015;
  transform: translateX(-50%);
}

.phone-screen {
  overflow: hidden;
  aspect-ratio: 9 / 19.2;
  border-radius: 1.6rem;
  background: rgb(var(--color-surface));
}
</style>
