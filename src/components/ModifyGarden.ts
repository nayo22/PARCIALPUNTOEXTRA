import { store } from "../flux/Store";
import { AddActions, StoreActions } from "../flux/Actions";

class ModifyGarden extends HTMLElement {
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

  private handleTogglePlant(plantId: string) {
    const scrollPosition = window.scrollY;

    AddActions.toggleLike(plantId);

    setTimeout(() => {
      window.scrollTo({
        top: scrollPosition,
        behavior: "auto",
      });
    }, 0);
  }

  async render() {
    if (!this.shadowRoot) return;

    const state = store.getState();
    const addedPlants = state.addedPlants || [];
    const plants = state.plants || [];

    this.shadowRoot.innerHTML = `
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap');

        :host {
          --color-background: #121212;
          --color-surface: #1E1E1E;
          --color-surface-lighter: #2D2D2D;
          --color-green-dark: rgb(214, 107, 200);
          --color-green-medium:rgb(189, 5, 146);
          --color-green-light:rgb(215, 132, 208);
          --color-green-pale:rgb(214, 165, 197);
          --color-text-light: #FFFFFF;
          --color-text-secondary: #B3B3B3;
          --color-text-tertiary: #737373;
          --shadow-sm: 0 2px 8px rgba(0,0,0,0.3);
          --shadow-md: 0 4px 12px rgba(0,0,0,0.4);
        }

        * {
          font-family: 'Montserrat', sans-serif;
        }

        .modify-garden-container {
          padding: 2rem;
          max-width: 1400px;
          margin: 0 auto;
          background-color: var(--color-background);
          border-radius: 20px;
          box-shadow: var(--shadow-sm);
        }

        .modify-garden-header {
          text-align: left;
          padding-bottom: 1.5rem;
        }

        .modify-garden-title {
          color: var(--color-green-light);
          font-size: 2.5rem;
          margin-bottom: 0.8rem;
          font-weight: 700;
          text-align: left;
        }

        .modify-garden-subtitle {
          color: var(--color-text-secondary);
          font-size: 1.2rem;
          max-width: 800px;
          margin: 0 auto 1 rem;
          font-weight: 400;

        }

        .plants-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
          gap: 2rem;
        }

        .plant-card {
          border-radius: 20px;
          overflow: hidden;
          background: rgba(30, 30, 30, 0.5);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(5px);
          -webkit-backdrop-filter: blur(5px);
          border: 1px solid rgba(80, 80, 80, 0.3);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          display: flex;
          flex-direction: column;
        }

        .plant-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
        }

        .plant-img-container {
          position: relative;
          height: 220px;
          overflow: hidden;
        }

        .plant-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .plant-card:hover .plant-img {
          transform: scale(1.05);
        }

        .plant-status {
          position: absolute;
          top: 10px;
          right: 10px;
          background-color: var(--color-green-medium);
          color: var(--color-text-light);
          padding: 0.3rem 0.8rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          opacity: 0;
          transform: translateY(-10px);
          transition: opacity 0.3s ease, transform 0.3s ease;
        }

        .plant-card[data-added="true"] .plant-status {
          opacity: 1;
          transform: translateY(0);
        }

        .plant-info {
          padding: 1.5rem;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
        }

        .plant-name {
          margin: 0 0 0.5rem 0;
          font-size: 1.3rem;
          color: var(--color-text-light);
          font-weight: 600;
        }

        .plant-scientific {
          margin: 0 0 0.8rem 0;
          font-size: 0.9rem;
          color: var(--color-text-secondary);
          font-style: italic;
        }

        .plant-details {
          margin: 0 0 1rem 0;
          font-size: 0.9rem;
          color: var(--color-text-secondary);
          flex-grow: 1;
        }

        .plant-detail {
          margin-bottom: 0.4rem;
        }

        .plant-detail span {
          font-weight: 600;
          color: var(--color-text-light);
        }

        .plant-button {
          padding: 0.8rem 1rem;
          border: none;
          border-radius: 15px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 600;
          font-size: 1rem;
          margin-top: auto;
        }

        .plant-button.add {
          background-color: var(--color-green-medium);
          color: var(--color-text-light);
        }

        .plant-button.remove {
          background-color: #e53935;
          color: var(--color-text-light);
        }

        .plant-button:hover {
          transform: translateY(-3px);
          opacity: 0.9;
        }

        .back-button {
          display: inline-block;
          padding: 0.8rem 1.5rem;
          background-color: var(--color-green-medium);
          color: var(--color-text-light);
          border: none;
          border-radius: 15px;
          cursor: pointer;
          text-decoration: none;
          font-weight: 600;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .back-button:hover {
          background-color: var(--color-green-dark);
          transform: translateY(-3px);
        }

        @media (max-width: 768px) {
          .plants-grid {
            grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
            gap: 1.5rem;
          }
          .modify-garden-container {
            padding: 1.5rem;
          }
        }
      </style>

      <div class="modify-garden-container">
        <button class="back-button" id="backBtn">Atrás</button>
        <div class="modify-garden-header">
          <h2 class="modify-garden-title">Edita tus plantitas</h2>
          <p class="modify-garden-subtitle">Agrega o retira plantitas de tu Jardinnnn🐝</p>
        </div>
        <div class="plants-grid">
          ${plants
            .map((plant, index) => {
              const plantId = index + 1;
              const isAdded = addedPlants.includes(plantId);
              return `
              <div class="plant-card" data-added="${isAdded}">
                <div class="plant-img-container">
                  <img class="plant-img" src="${plant.img}" alt="${
                plant.common_name
              }">
                  <span class="plant-status">En tu jardín</span>
                </div>
                <div class="plant-info">
                  <h3 class="plant-name">${plant.common_name}</h3>
                  <p class="plant-scientific">${plant.scientific_name}</p>
                  <div class="plant-details">
                    <p class="plant-detail"><span>Tipo:</span> ${plant.type}</p>
                    <p class="plant-detail"><span>Origen:</span> ${
                      plant.origin
                    }</p>
                    <p class="plant-detail"><span>Riego:</span> ${
                      plant.watering
                    }</p>
                  </div>
                  <button class="plant-button ${
                    isAdded ? "remove" : "add"
                  }" data-id="${plantId}">
                    ${isAdded ? "Quitar del jardín" : "Añadir al jardín"}
                  </button>
                </div>
              </div>
            `;
            })
            .join("")}
        </div>
      </div>
    `;

    this.shadowRoot.querySelectorAll("button[data-id]").forEach((button) => {
      button.addEventListener("click", (e) => {
        const plantId = (e.target as HTMLElement).getAttribute("data-id");
        if (plantId) {
          this.handleTogglePlant(plantId);
        }
      });
    });

    const backBtn = this.shadowRoot.querySelector("#backBtn");
    if (backBtn) {
      backBtn.addEventListener("click", () => {
        StoreActions.navigate("home");
      });
    }
  }
}

export default ModifyGarden;
