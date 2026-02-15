declare module 'gradient-string' {
  interface Gradient {
    (text: string): string;
    multiline(text: string): string;
  }
  function gradient(colors: string[]): Gradient;
  export default gradient;
}
