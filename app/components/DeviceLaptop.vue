<template>
  <div class="laptop">
    <div class="laptop-lid">
      <span class="laptop-camera" aria-hidden="true" />
      <div class="laptop-screen">
        <slot />
      </div>
    </div>
    <div class="laptop-base" aria-hidden="true">
      <span class="laptop-notch" />
    </div>
  </div>
</template>

<style scoped>
.laptop {
  width: 100%;
  filter: drop-shadow(var(--shadow-device));
}

.laptop-lid {
  position: relative;
  padding: 0.7rem 0.7rem 0.85rem;
  border: 1px solid rgb(255 255 255 / 0.08);
  border-radius: 0.9rem 0.9rem 0.35rem 0.35rem;
  background: linear-gradient(180deg, #343a46 0%, #1b1f28 100%);
}

.laptop-camera {
  position: absolute;
  top: 0.28rem;
  left: 50%;
  width: 0.32rem;
  height: 0.32rem;
  border-radius: 999px;
  background: #6d7482;
  transform: translateX(-50%);
}

.laptop-screen {
  overflow: hidden;
  aspect-ratio: 16 / 10;
  border-radius: 0.25rem;
  background: rgb(var(--color-background-soft));
}

.laptop-base {
  position: relative;
  height: 0.85rem;
  margin-inline: 8%;
  border-radius: 0 0 0.7rem 0.7rem;
  background: linear-gradient(180deg, #4a5160 0%, #2a303b 100%);
}

.laptop-notch {
  position: absolute;
  top: 0;
  left: 50%;
  width: 16%;
  height: 0.32rem;
  border-radius: 0 0 0.4rem 0.4rem;
  background: #171b22;
  transform: translateX(-50%);
}
</style>
