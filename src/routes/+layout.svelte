<script>
    import { sessionStore } from '$lib/auth';
  </script>
  
  <nav>
    <a href="/">Home</a>
    {#if $sessionStore.user}
      <a href="/projects">Projects</a>
      <button on:click={() => $sessionStore.logout()}>Logout</button>
    {:else}
      <a href="/auth">Login/Register</a>
    {/if}
  </nav>
  
  <main>
    <slot />
  </main>