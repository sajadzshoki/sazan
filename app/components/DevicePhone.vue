<template>
  <div class="phone">
    <div class="phone-screen">
      <slot />
    </div>
    <img
      class="phone-frame"
      src="/mobile.png"
      alt=""
      width="1681"
      height="3386"
      draggable="false"
      decoding="async"
    >
  </div>
</template>

<style scoped>
.phone {
  position: relative;
  width: 17.5rem;
  max-width: 100%;
  margin-inline: auto;
  aspect-ratio: 0.48887;
  filter: drop-shadow(var(--shadow-device));
}

.phone-screen {
  position: absolute;
  z-index: 1;
  left: 4.492%;
  top: 2.165%;
  width: 90.705%;
  height: 95.7%;
  overflow: hidden;
  background: #0c0e12;
}

.phone-frame {
  position: absolute;
  z-index: 2;
  left: -2.807%;
  top: -1.067%;
  width: 104.866%;
  height: 103.263%;
  max-width: none;
  pointer-events: none;
  user-select: none;
}
</style>
