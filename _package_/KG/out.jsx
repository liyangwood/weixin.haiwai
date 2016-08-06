
import KG from './base.jsx';
import _ from 'underscore';
import moment from 'moment';

if(Meteor.isServer){

	KG.SyncedCron = require('./lib/Synced-cron.jsx');
}



export {
	KG,
	Meteor,
	_,
	moment
};