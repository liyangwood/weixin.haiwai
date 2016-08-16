
import KG from './base.jsx';
import _ from 'underscore';
import moment from 'moment';

//notice here
import { FS } from 'meteor/cfs:base-package';
import DataMan from 'meteor/cfs:data-man';

if(Meteor.isServer){
	KG.SyncedCron = require('./lib/Synced-cron.jsx');
}

export {
	KG,
	Meteor,
	_,
	moment,
	FS,
	DataMan
};
