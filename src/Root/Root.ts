import { store } from "../flux/Store";
import { StoreActions } from "../flux/Actions";

class Root extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  async connectedCallback() {
    store.load();
    store.subscribe(this.handleStateChange.bind(this));
    this.addEventListener(
      "navigate",
      this.handleNavigation.bind(this) as EventListener
    );

    await StoreActions.loadPlants();

    this.render();
  }

  private handleStateChange = () => {
    this.render();
  };

  private handleNavigation(event: CustomEvent) {
    if (event.detail && event.detail.page) {
      StoreActions.navigate(event.detail.page);
    }
  }

  render() {
    if (!this.shadowRoot) return;

    const state = store.getState();
    const gardenName = state.gardenName || "Mi Jardín Virtual";
    const currentPage = state.currentPage || "home";

    this.shadowRoot.innerHTML = `
      <style>
       @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap');

        :host {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          display: block;
          font-family: 'Montserrat', sans-serif;
          --color-background: #121212;
          --color-surface: #1E1E1E;
          --color-surface-lighter: #2D2D2D;
          --color-primary: rgb(214, 107, 200);
          --color-primary-dark:rgb(142, 56, 115);
          --color-primary-light:rgb(214, 165, 199);
          --color-accent:rgb(195, 74, 153);
          --color-text-light: #FFFFFF;
          --color-text-secondary: #B3B3B3;
          --color-text-tertiary: #737373;
          --shadow-sm: 0 2px 8px rgba(0,0,0,0.3);
          --shadow-md: 0 4px 12px rgba(0,0,0,0.4);
          --shadow-lg: 0 8px 24px rgba(0,0,0,0.5);
          background-color: var(--color-background);
          color: var(--color-text-light);
          min-height: 100vh;
        }

        header {
          border-radius: 20px;
          background: var(--color-surface);
          color: var(--color-text-light);
          padding: 1.5rem;
          text-align: center;
          box-shadow: var(--shadow-md);
          position: relative;
          z-index: 100;
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        h1 {
          margin: 0;
          font-size: 2rem;
          font-weight: 600;
          letter-spacing: 0.5px;
        }

        nav {
          background-color: var(--color-surface);
          padding: 0;
          display: flex;
          justify-content: center;
          position: sticky;
          top: 0;
          z-index: 90;
          box-shadow: var(--shadow-sm);
          overflow: hidden;
          border-radius: 0 0 20px 20px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .nav-container {
          font-family: 'Montserrat', sans-serif;
          display: flex;
          width: 100%;
          max-width: 1200px;
          justify-content: space-between;
          align-items: center;
          padding: 0 1rem;
        }

        .nav-links {
          display: flex;
          gap: 0.5rem;
        }

        nav button {
          padding: 1rem 1.5rem;
          background-color: transparent;
          color: var(--color-text-secondary);
          border: none;
          border-bottom: 3px solid transparent;
          cursor: pointer;
          font-weight: 500;
          font-size: 1rem;
          transition: all 0.3s ease;
          position: relative;
        }

        nav button.active {
          color: var(--color-accent);
          border-bottom: 3px solid var(--color-accent);
        }

        nav button:hover {
          color: var(--color-primary-light);
          background-color: var(--color-surface-lighter);
        }

        main {
          padding: 0;
          min-height: calc(100vh - 110px);
          margin-top: 20px;
        }

        @media (max-width: 768px) {
          .nav-container {
            font-family: 'Montserrat', sans-serif;
            flex-direction: column;
            padding: 0.5rem;
          }

          .nav-links {
            width: 100%;
            justify-content: center;
          }

          nav button {
            padding: 0.8rem 1rem;
            font-size: 0.9rem;
          }
        }
      </style>

      <header>
        <h1>${gardenName}</h1>
      </header>

      <nav>
        <div class="nav-container">
          <div class="nav-links">
            <button id="homeBtn" class="${
              currentPage === "home" ? "active" : ""
            }">Inicio</button>
            <button id="modifyGardenBtn" class="${
              currentPage === "modifyGarden" ? "active" : ""
            }">Modificar Jardín</button>
            <button id="adminBtn" class="${
              currentPage === "admin" ? "active" : ""
            }">Modo Admin</button>
          </div>
        </div>
      </nav>

      <main>
        ${this.renderPage(currentPage)}
      </main>
    `;

    // Agregar event listeners a los botones de navegación
    const homeBtn = this.shadowRoot.querySelector("#homeBtn");
    const modifyGardenBtn = this.shadowRoot.querySelector("#modifyGardenBtn");
    const adminBtn = this.shadowRoot.querySelector("#adminBtn");

    if (homeBtn) {
      homeBtn.addEventListener("click", () => {
        StoreActions.navigate("home");
      });
    }

    if (modifyGardenBtn) {
      modifyGardenBtn.addEventListener("click", () => {
        StoreActions.navigate("modifyGarden");
      });
    }

    if (adminBtn) {
      adminBtn.addEventListener("click", () => {
        StoreActions.navigate("admin");
      });
    }
  }

  private renderPage(currentPage: string) {
    switch (currentPage) {
      case "home":
        return `
          <your-plants></your-plants>
        `;
      case "modifyGarden":
        return `<modify-garden></modify-garden>`;
      case "admin":
        return `<admin-modify-plants></admin-modify-plants>`;
      default:
        return `<p>Página no encontrada</p>`;
    }
  }
}

export default Root;
