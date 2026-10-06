<template>
  <div class="laptop">
    <div class="laptop-screen">
      <slot />
    </div>
    <img
      class="laptop-frame laptop-frame-light"
      src="/laptop.png"
      alt=""
      width="1260"
      height="756"
      draggable="false"
      decoding="async"
    >
    <img
      class="laptop-frame laptop-frame-dark"
      src="/laptop2.png"
      alt=""
      width="1920"
      height="1080"
      draggable="false"
      decoding="async"
    >
  </div>
</template>

<style scoped>
.laptop {
  position: relative;
  width: 100%;
  aspect-ratio: 1.65494;
  filter: drop-shadow(var(--shadow-device));
  --screen-x: 12.51%;
  --screen-y: 6.766%;
  --screen-w: 75.061%;
  --screen-h: 77.943%;
  --frame-x: -1.472%;
  --frame-y: -2.03%;
  --frame-w: 103.025%;
  --frame-h: 102.3%;
}

.laptop-screen {
  position: absolute;
  z-index: 1;
  left: var(--screen-x);
  top: var(--screen-y);
  width: var(--screen-w);
  height: var(--screen-h);
  overflow: hidden;
  background: #0c0e12;
}

.laptop-frame {
  position: absolute;
  z-index: 2;
  left: var(--frame-x);
  top: var(--frame-y);
  width: var(--frame-w);
  height: var(--frame-h);
  max-width: none;
  pointer-events: none;
  user-select: none;
}

.laptop-frame-dark {
  display: none;
}
</style>

