import { Plants } from "../types/ApiTypes";

async function getPlants(): Promise<Plants[]> {
  try {
    const localData = localStorage.getItem("plants_backup");
    if (localData) {
      const plants: Plants[] = JSON.parse(localData);
      return plants;
    }

    const response = await fetch("/data/api.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const responseData: Plants[] = await response.json();
    return responseData;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

export default getPlants;

export async function addPlantToGarden(plantId: string): Promise<boolean> {
  console.log(`Añadiendo planta con ID: ${plantId}`);
  return true;
}

export async function removePlantFromGarden(plantId: string): Promise<boolean> {
  console.log(`Eliminando planta con ID: ${plantId}`);
  return true;
}

export async function updatePlant(plant: Plants): Promise<boolean> {
  try {
    console.log(`Actualizando planta: ${plant.common_name}`);

    const localData = localStorage.getItem("plants_backup");
    if (localData) {
      const plants: Plants[] = JSON.parse(localData);

      const index = plants.findIndex(
        (p) =>
          p.id === plant.id ||
          (p.common_name === plant.common_name &&
            p.scientific_name === plant.scientific_name)
      );

      if (index !== -1) {
        plants[index] = plant;
        localStorage.setItem("plants_backup", JSON.stringify(plants));
      }
    }

    return true;
  } catch (error) {
    console.error("Error al actualizar la planta:", error);
    return false;
  }
}

export async function getUserGarden(): Promise<string[]> {
  return ["1", "2", "3"];
}
