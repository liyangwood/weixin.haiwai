
import KG from './base.jsx';
import _ from 'underscore';
import moment from 'moment';
import {FileCollection} from 'meteor/vsivsi:file-collection';

if(Meteor.isServer){

	KG.SyncedCron = require('./lib/Synced-cron.jsx');
}


export {
	KG,
	Meteor,
	_,
	moment,
	FileCollection
};