import Catalogue from './src/Catalogue';
import cardsReducer from './src/redux/CardsReducer';
import commonService from './src/services/common.service';

export default Catalogue;
export { cardsReducer };
export function setCatalogueCommonService(options) {
  Object.keys(options).map(key => (commonService[key] = options[key]));
}
