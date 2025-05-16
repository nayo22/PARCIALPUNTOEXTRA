import Root from "./Root/Root";
import CardContainer from "./components/CardContainer";
import CardPlants from "./components/CardPlants";
import YourPlants from "./components/YourPlants";
import ModifyGarden from "./components/ModifyGarden";
import AdminModifyPlants from "./components/AdminModifyPlants";

customElements.define("root-element", Root);
customElements.define("card-container", CardContainer);
customElements.define("card-plants", CardPlants);
customElements.define("your-plants", YourPlants);
customElements.define("modify-garden", ModifyGarden);
customElements.define("admin-modify-plants", AdminModifyPlants);
