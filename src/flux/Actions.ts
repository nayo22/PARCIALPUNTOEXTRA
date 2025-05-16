import { AppDispatcher } from "./Dispatcher";
import { State } from "./Store";
import getPlants from "../services/Plants";

export const AddActionTypes = {
  TOGGLE_ADD: "TOGGLE_ADD",
};

export const StoreActionTypes = {
  LOAD_STATE: "LOAD_STATE",
  UPDATE_GARDEN_NAME: "UPDATE_GARDEN_NAME",
  LOAD_PLANTS: "LOAD_PLANTS",
  NAVIGATE: "NAVIGATE",
};

export const AddActions = {
  toggleLike: (plantId: string) => {
    AppDispatcher.dispatch({
      type: AddActionTypes.TOGGLE_ADD,
      payload: plantId,
    });
  },
};

export const StoreActions = {
  loadState: (state: State) => {
    AppDispatcher.dispatch({
      type: StoreActionTypes.LOAD_STATE,
      payload: state,
    });
  },
  updateGardenName: (name: string) => {
    AppDispatcher.dispatch({
      type: StoreActionTypes.UPDATE_GARDEN_NAME,
      payload: name,
    });
  },
  navigate: (page: string) => {
    AppDispatcher.dispatch({
      type: StoreActionTypes.NAVIGATE,
      payload: page,
    });
  },
  loadPlants: async () => {
    try {
      const plants = await getPlants();
      AppDispatcher.dispatch({
        type: StoreActionTypes.LOAD_PLANTS,
        payload: plants,
      });
      return plants;
    } catch (error) {
      console.error("Error loading plants:", error);
      return [];
    }
  },
};
