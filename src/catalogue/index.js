import Catalogue from './src/Catalogue';
import Card from './src/Card';
import Filters from './src/Filters';
import Sort from './src/Sort';
import cardsReducer from './src/redux/CardsReducer';
import commonService from './src/services/common.service';

export { Catalogue, Card, Filters, Sort, cardsReducer };
export function setCatalogueCommonService(options) {
  Object.keys(options).map(key => (commonService[key] = options[key]));
}
