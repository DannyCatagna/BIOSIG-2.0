import { Component, type ReactNode } from "react";
export class PageErrorBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (this.state.failed)
      return (
        <section className="container page-content" role="alert">
          <h1>No pudimos cargar esta página.</h1>
          <p>
            Comprueba tu conexión y vuelve a intentarlo. Tus lecturas no se han
            eliminado.
          </p>
          <button className="button" onClick={() => window.location.reload()}>
            Volver a cargar
          </button>
          <a className="text-link" href="/">
            Regresar al inicio
          </a>
        </section>
      );
    return this.props.children;
  }
}
