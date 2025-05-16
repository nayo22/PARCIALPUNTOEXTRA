import { Plants } from "../types/ApiTypes";
import { AddActions } from "../flux/Actions";
import { store } from "../flux/Store";

class CardPlants extends HTMLElement {
  private plants: Plants[] = [];

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  async connectedCallback() {
    try {
      this.render();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  private handleAddClick = () => {
    const uuid = this.getAttribute("uuid");
    if (uuid) {
      AddActions.toggleLike(uuid);
    }
  };

  render() {
    const image =
      this.getAttribute("image") || "https://placehold.co/100x100.png";
    const name = this.getAttribute("name") || "Coso desconocido";
    const uuid = this.getAttribute("uuid");
    const state = store.getState();
    const isAdded = uuid ? state.addedPlants.includes(Number(uuid)) : false;

    if (!this.shadowRoot) return;

    this.shadowRoot.innerHTML = `
         <style>
           @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap');

           :host {
             display: block;
             --color-background: #121212;
             --color-surface: #1E1E1E;
             --color-surface-lighter: #2D2D2D;
             --color-green-dark:rgb(203, 67, 191);
             --color-green-medium:rgb(218, 121, 195);
             --color-green-light:rgb(189, 17, 123);
             --color-accent: ${isAdded ? "#e53935" : "#8BC34A"};
             --color-accent-hover: ${isAdded ? "#c62828" : "#689F38"};
             --color-text-light: #FFFFFF;
             --color-text-secondary: #B3B3B3;
             --shadow-sm: 0 2px 8px rgba(0,0,0,0.3);
             --shadow-md: 0 4px 12px rgba(0,0,0,0.4);
           }

           * {
             font-family: 'Montserrat', sans-serif;
           }

           .container {
             display: flex;
             flex-direction: column;
             height: 100%;
             border-radius:50px;
             overflow: hidden;
             background: rgba(30, 30, 30, 0.5);
             box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
             backdrop-filter: blur(5px);
             -webkit-backdrop-filter: blur(5px);
             border: 1px solid rgba(80, 80, 80, 0.3);
             transition: transform 0.3s ease, box-shadow 0.3s ease;
           }

           .container:hover {
             transform: translateY(-8px);
             box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
           }

           .img-container {
             position: relative;
             height: 220px;
             overflow: hidden;
           }

           img {
             width: 100%;
             height: 100%;
             object-fit: cover;
             transition: transform 0.5s ease;
           }

           .container:hover img {
             transform: scale(4);
           }

           .content {
             padding: 1.2rem;
             display: flex;
             flex-direction: column;
             flex-grow: 1;
           }

           .plant-name {
             margin: 0 0 0.8rem 0;
             font-size: 1.3rem;
             font-weight: 600;
             color: var(--color-text-light);
           }

           button {
             margin-top: auto;
             padding: 0.7rem 1rem;
             background-color: var(--color-accent);
             color: var(--color-text-light);
             border: none;
             border-radius: 40px;
             cursor: pointer;
             transition: all 0.3s ease;
             font-weight: 600;
             font-family: 'Montserrat', sans-serif;
             font-size: 1rem;
           }

           button:hover {
             background-color: var(--color-accent-hover);
             transform: translateY(-2px);
           }

           button:active {
             transform: translateY(0);
           }

           .status {
             position: absolute;
             top: 10px;
             right: 10px;
             background-color: var(--color-accent);
             color: var(--color-text-light);
             padding: 0.3rem 0.8rem;
             border-radius: 20px;
             font-size: 0.8rem;
             font-weight: 600;
             opacity: ${isAdded ? "1" : "0"};
             transform: ${isAdded ? "translateY(0)" : "translateY(-10px)"};
             transition: opacity 0.3s ease, transform 0.3s ease;
           }
         </style>
         <div class="container">
           <div class="img-container">
             <img src="${image}" alt="${name}">
             <span class="status">${isAdded ? "En tu jardín" : ""}</span>
           </div>
           <div class="content">
             <h3 class="plant-name">${name}</h3>
             <button id="addbtn">${
               isAdded ? "Quitar del jardín" : "Añadir a mi jardín"
             }</button>
           </div>
         </div>
        `;

    const addButton = this.shadowRoot.querySelector("#addbtn");
    if (addButton) {
      addButton.addEventListener("click", this.handleAddClick);
    }
  }
}

export default CardPlants;
