import { AddActionTypes, StoreActionTypes } from "../flux/Actions";
import { AppDispatcher, Action } from "./Dispatcher";
import { Plants } from "../types/ApiTypes";

export type State = {
  count: number;
  addedPlants: number[];
  gardenName: string;
  plants: Plants[];
  currentPage: string;
};

type Listener = (state: State) => void;

class Store {
  private _myState: State = {
    count: 0,
    addedPlants: [],
    gardenName: "Mi Jardín Virtual",
    plants: [],
    currentPage: "home",
  };

  private _listeners: Listener[] = [];

  constructor() {
    AppDispatcher.register(this._handleActions.bind(this));
    this.load();
  }

  load() {
    const savedState = localStorage.getItem("appState");
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        this._myState = {
          ...this._myState,
          ...parsedState,
        };
        this._emitChange();
      } catch (error) {
        console.error("Error loading state:", error);
      }
    }
  }

  getState(): State {
    return this._myState;
  }

  private _handleActions(action: Action): void {
    switch (action.type) {
      case AddActionTypes.TOGGLE_ADD:
        if (
          typeof action.payload === "string" ||
          typeof action.payload === "number"
        ) {
          const plantId = Number(action.payload);
          const currentPlants = this._myState.addedPlants || [];
          const plantIndex = currentPlants.indexOf(plantId);

          if (plantIndex === -1) {
            //añadir
            this._myState = {
              ...this._myState,
              addedPlants: [...currentPlants, plantId],
            };
          } else {
            
            this._myState = {
              ...this._myState,
              addedPlants: currentPlants.filter((id) => id !== plantId),
            };
          }
          this._emitChange();
        }
        break;

      case StoreActionTypes.LOAD_STATE:
        if (typeof action.payload === "object") {
          this._myState = {
            ...this._myState,
            ...action.payload,
          };
          this._emitChange();
        }
        break;

      case StoreActionTypes.UPDATE_GARDEN_NAME:
        if (typeof action.payload === "string") {
          this._myState = {
            ...this._myState,
            gardenName: action.payload,
          };
          this._emitChange();
        }
        break;

      case StoreActionTypes.LOAD_PLANTS:
        if (Array.isArray(action.payload)) {
          this._myState = {
            ...this._myState,
            plants: action.payload,
          };
          this._emitChange();
        }
        break;

      case StoreActionTypes.NAVIGATE:
        if (typeof action.payload === "string") {
          this._myState = {
            ...this._myState,
            currentPage: action.payload,
          };
          this._emitChange();
        }
        break;
    }
  }

  private _emitChange(): void {
    const state = this.getState();
    localStorage.setItem("appState", JSON.stringify(state));
    for (const listener of this._listeners) {
      listener(state);
    }
  }

  subscribe(listener: Listener): void {
    this._listeners.push(listener);
    listener(this.getState());
  }

  unsubscribe(listener: Listener): void {
    this._listeners = this._listeners.filter((l) => l !== listener);
  }
}

export const store = new Store();
