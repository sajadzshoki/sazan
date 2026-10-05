<template>
  <div class="tablet">
    <span class="tablet-camera" aria-hidden="true" />
    <div class="tablet-screen">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.tablet {
  position: relative;
  width: min(100%, 28rem);
  margin-inline: auto;
  padding: 0.85rem;
  border: 1px solid rgb(255 255 255 / 0.12);
  border-radius: 1.6rem;
  background: linear-gradient(180deg, #313744 0%, #171b22 100%);
  box-shadow: var(--shadow-device);
}

.tablet-camera {
  position: absolute;
  z-index: 2;
  top: 0.38rem;
  left: 50%;
  width: 0.38rem;
  height: 0.38rem;
  border-radius: 999px;
  background: #8b93a3;
  transform: translateX(-50%);
}

.tablet-screen {
  overflow: hidden;
  aspect-ratio: 4 / 3;
  border-radius: 0.7rem;
  background: rgb(var(--color-surface));
}
</style>
