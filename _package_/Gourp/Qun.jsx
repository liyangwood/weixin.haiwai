import config from './lib/config.jsx';
import {KG} from 'meteor/kg:base';
import {Qun} from './schema/qun.jsx';

let Base = KG.getClass('Base');
KG.define(config.Qun, class extends Base{
	defineDBSchema(){
		return Qun;
	}

	defineMeteorMethod(){
		let self = this;

		return {
			deleteById(id){

				KG.Content.getDB().update({assignGroup : id}, {$pull : {
					assignGroup : id
				}}, false, true);
				KG.Event.getDB().update({assignGroup : id}, {$pull : {
					assignGroup : id
				}}, false, true);
				KG.Wenda.getDB().update({assignGroup : id}, {$pull : {
					assignGroup : id
				}}, false, true);
				KG.ZhiBoGroup.getDB().update({qunID : id}, {$set : {
					isRemoved : true
				}}, false, true);

				KG.Qun.getDB().update({_id : id}, {
					$set : {
						isRemoved : true
					}
				});

				return true;

			}
		};
	}
});


KG.define(config.TmpQun, class extends Base{
	defineDBSchema(){
		return Qun;
	}

});