<template>
  <div class="layout">
    <AppHeader />
    <main class="layout__main">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.layout__main {
  flex: 1;
  width: 100%;
  max-width: 960px;
  margin: 0 auto;
  padding: var(--space-page) var(--space-3);
}
</style>
