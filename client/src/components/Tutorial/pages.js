import Hosting from "./Pages/Hosting";
import Navigation from "./Pages/Navigation";
import Snakegame from "./Pages/Snakegame";
import Introduction from './Pages/Introduction';
import Contact from './Pages/Contact';

export const contact = {
  topic: Contact.topic,
  component: Contact
};

export const hosting = {
  topic: Hosting.topic,
  component: Hosting
};

export const navigation = {
  component: Navigation,
  topic: Navigation.topic
}
export const snakegame = {
  component: Snakegame,
  topic: Snakegame.topic
}
export const introduction = {
  component: Introduction,
  topic: Introduction.topic
}