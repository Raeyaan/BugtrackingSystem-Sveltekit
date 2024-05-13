<script>
    import { authenticate, getSession } from '$lib/auth';
  
    let email = '';
    let password = '';
    let isLogin = true;
  
    const handleSubmit = async () => {
      const session = await authenticate(email, password, isLogin);
      if (session) {
        // Handle successful authentication
      } else {
        // Handle authentication error
      }
    };
  </script>
  
  <h2>{isLogin ? 'Login' : 'Register'}</h2>
  <form on:submit|preventDefault={handleSubmit}>
    <input type="email" placeholder="Email" bind:value={email} required />
    <input type="password" placeholder="Password" bind:value={password} required />
    <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
  </form>
  <button on:click={() => (isLogin = !isLogin)}>
    {isLogin ? 'Create an account' : 'Back to login'}
  </button>