declare module 'vite-plugin-seo-prerender' {
  interface SeoPrerenderOptions {
    routes?: string[];
    [key: string]: any;
  }
  
  function seoPrerender(options?: SeoPrerenderOptions): any;
  export default seoPrerender;
}
