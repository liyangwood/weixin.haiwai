import config from './lib/config.jsx';
import {KG} from 'meteor/kg:base';
import Wenda from './schema/Wenda.jsx';

let Base = KG.getClass('Base');
KG.define(config.Wenda, class extends Base{
	defineDBSchema(){
		return Wenda;
	}

	defineMeteorMethod(){
		let self = this;

		return {
			getAllByQuery(query={}, option={}){
				query = KG.util.setDBQuery(query);
				option = KG.util.setDBOption(option);

				let list = self._db.find(query, option).fetch();
				list = _.map(list, (item)=>{
					item.assignGroup = _.map(item.assignGroup, (l)=>{
						return KG.Qun.getDB().findOne({_id : l});
					});
					return item;
				});

				return {
					list : list,
					count : self._db.find(query).count()
				};
			}
		};
	}
});
