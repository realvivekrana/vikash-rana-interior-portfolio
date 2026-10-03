import {
  FaPencilRuler, FaHome, FaCouch, FaPaintRoller, FaBed, FaUtensils,
  FaLightbulb, FaBuilding, FaTools, FaRulerCombined, FaDraftingCompass,
  FaHammer, FaPalette, FaCube, FaShoppingBag,
} from 'react-icons/fa';

// Admin panel ke icon picker mein yehi dikhte hain. Naya icon chahiye to yahan add karo.
export const SERVICE_ICONS = {
  FaPencilRuler, FaHome, FaCouch, FaPaintRoller, FaBed, FaUtensils,
  FaLightbulb, FaBuilding, FaTools, FaRulerCombined, FaDraftingCompass,
  FaHammer, FaPalette, FaCube, FaShoppingBag,
};

export const getServiceIcon = (name) => SERVICE_ICONS[name] || FaPencilRuler;