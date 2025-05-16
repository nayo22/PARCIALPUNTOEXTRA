import { store } from "../flux/Store";
import { StoreActions } from "../flux/Actions";

class CardContainer extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  async connectedCallback() {
    store.subscribe(this.handleStateChange.bind(this));

    const state = store.getState();
    if (!state.plants || state.plants.length === 0) {
      await StoreActions.loadPlants();
    }

    this.render();
  }

  disconnectedCallback() {
    store.unsubscribe(this.handleStateChange.bind(this));
  }

  private handleStateChange = () => {
    this.render();
  };

  render() {
    if (!this.shadowRoot) return;

    const state = store.getState();
    const plants = state.plants || [];

    this.shadowRoot.innerHTML = `
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap');

        :host {
          --color-background: #121212;
          --color-surface: #1E1E1E;
          --color-surface-lighter: #2D2D2D;
          --color-green-dark: rgb(214, 107, 200);
          --color-green-medium:rgb(233, 143, 218);
          --color-green-light:rgb(186, 38, 149);
          --color-text-light: #FFFFFF;
          --color-text-secondary: #B3B3B3;
          --color-text-tertiary: #737373;
          --shadow-sm: 0 2px 8px rgba(0,0,0,0.3);
          --shadow-md: 0 4px 12px rgba(0,0,0,0.4);
        }

        * {
          font-family: 'Montserrat', sans-serif;
        }

        .container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
          gap: 1.5rem;
          padding: 2rem;
          max-width: 1400px;
          margin: 0 auto;
          background-color: var(--color-background);
        }

        .header {
          text-align: center;
          margin-bottom: 2.5rem;
          color: var(--color-green-light);
          padding: 2rem 1rem;
          background-color: var(--color-background);
        }

        .header h1 {
          font-size: 2.5rem;
          margin-bottom: 0.8rem;
          font-weight: 700;
        }

        .header p {
          font-size: 1.2rem;
          color: var(--color-text-secondary);
          max-width: 800px;
          margin: 0 auto;
          font-weight: 400;
        }

        @media (max-width: 768px) {
          .container {
            grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
            padding: 1rem;
          }
        }
      </style>
      <div class="header">
        <h1>Catálogo de Plantas</h1>
        <p>Explora nuestra colección de plantas y añade tus favoritas a tu jardín virtual</p>
      </div>
      <div class="container">
        ${plants
          .map((plant, index) => {
            const image = plant.img || "https://placehold.co/100x100.png";
            const name = plant.common_name || "Planta desconocida";
            return `
              <card-plants
                uuid="${index + 1}"
                image="${image}"
                name="${name}">
              </card-plants>
            `;
          })
          .join("")}
      </div>
    `;
  }
}

export default CardContainer;
