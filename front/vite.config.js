import { defineConfig, loadEnv } from 'vite';
export default ({ mode }) => {
    process.env = {...process.env, ...loadEnv(mode, process.cwd())};
    const port = process.env.VITE_PORT;
    return defineConfig({
      base:"/home",
      server: {
      watch:{
        usePolling:true,
      },
      host:true,
      strictPort:true,
      port:port,
      },
    });
}