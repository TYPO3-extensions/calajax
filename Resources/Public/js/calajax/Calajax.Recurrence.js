Calajax.Recurrence = {
	recurringEvent : function (event){
		var eventStart = event.startObject;
		var eventEnd = event.endObject;
		this.filterFalseCombinations(event);
		this.checkRecurringSettings(event);

		var master_array = [];
		var until = new Date(event.until.getTime() + 86399000);
		
		var rrule_array = event.getRecurringRule();
		var count = parseInt(event.cnt,10);

		if(Calajax.MonthView.viewEnd.getTime() < until.getTime()) {
			until = Calajax.MonthView.viewEnd;
		}
		var byyear = [];
		var i = eventStart.getFullYear();
		if(event.freq == 'year' ){
			i = parseInt(until.getFullYear(),10) - ((until.getFullYear() - eventStart.getFullYear()) % event.intrval) ;
		}

		for(i; i < parseInt(until.getFullYear(),10)+1; i++){
			byyear.push(i);
		}
		
		var added = 0;
		
		/*
		 * If starttime is before or at the same time as the event date, add the
		 * event
		 */
		if(!(eventStart.getTime() > Calajax.MonthView.viewEnd.getTime()) || event.freq == 'none') {
			event.start = event.startObject;
			event.end = event.endObject;
			master_array.push(event);
			added++;
		}

		var maxRecurringEvents = count;

		var counter = 1;
		var total = 1;
		
		// if the 'parent' event is still in future, set $added to 1 (true),
		// because we already have one instance of this event
		
		var nextOccuranceTime = new Date();
		nextOccuranceTime.setTime(event.startObject.getTime()+86400000);
		
		if(event.rdatetype != undefined && event.rdatetype!='none'){
			this.getRecurringDate(master_array, event, added);
		}

		switch (event.freq) {
			case 'day':
				counter = this.findDailyWithin(master_array, event, nextOccuranceTime, until, event.byday, count, counter, total, added, maxRecurringEvents);
				break;
			case 'week':
			case 'month':
			case 'year':
				var bymonth = event.bymonth;
				var byday = event.byday;
				var hour = eventStart.format('HH');
				var minute = eventStart.format('MM');
				// 2007, 2008...
				for(var x=0; x < byyear.length; x++){
					var year = byyear[x];
					if(counter < count && until.getTime() > nextOccuranceTime.getTime() && added < maxRecurringEvents){
						// 1,2,3,4,5,6,7,8,9,10,11,12
						for(var y=0; y < bymonth.length; y++){
							var month = bymonth[y];
							if(counter < count && until.getTime() > nextOccuranceTime.getTime() && parseInt(year+""+this.pad(month),10) >= parseInt(nextOccuranceTime.format('yyyymm'),10) && added < maxRecurringEvents){
								var bymonthday = this.getMonthDaysAccordingly(event, month, year);
								// 1,2,3,4....31
								for(var z=0; z < bymonthday.length; z++){
									var day = bymonthday[z];
									nextOccuranceTime.setHours(hour);
									nextOccuranceTime.setMinutes(minute);
									nextOccuranceTime.setSeconds(0);
									nextOccuranceTime.setDate(day);
									nextOccuranceTime.setMonth(month-1);
									nextOccuranceTime.setFullYear(year);
									
									if(counter < count && until.getTime() >= nextOccuranceTime.getTime() && added < maxRecurringEvents){
										var currentUntil = new Date(nextOccuranceTime.getTime() + 86399000);
										if(parseInt(nextOccuranceTime.getMonth()+1,10) == month && eventStart.getTime() <= nextOccuranceTime.getTime()){
											counter = this.findDailyWithin(master_array, event, nextOccuranceTime, currentUntil, byday, count, counter, total, added, maxRecurringEvents);
										}else{
											continue;
										}
									}else{
										return master_array;
									}
								}
							}
						}
					}else{
						return master_array;
					}
				}
				break; // switch-case break
		}
		return master_array;
	},
	
	getRecurringDate : function(master_array, event, addedCount){
		switch(event.rdatetype){
			case 'date':
				var rdateValues = event.getRdateValues();
				for(var i=0; i < rdateValues.length; i++){
					var new_event = this.clone(event);
					var start = new_event.startObject;
					var end = new_event.endObject;
					var diff = end.getTime() - start.getTime();
					
					var year = parseInt(rdateValues[i].substr(0,4),10);
					var month = parseInt(rdateValues[i].substr(4,2),10);
					var day = parseInt(rdateValues[i].substr(6,2),10);
					start.setDate(day);
					start.setMonth(month-1);
					start.setFullYear(year);
					
					new_event.endObject = new Date(start.getTime() + diff);
					
					if (end.getTime() > Calajax.MonthView.viewStart.getTime() && start.getTime() < Calajax.MonthView.viewEnd.getTime()) {
						new_event.start = new_event.startObject;
						new_event.end = new_event.endObject;
						master_array.push(new_event);
						addedCount++;
					}
				}
				break;
			case 'period':
				var rdateValues = event.getRdateValues();
				for(var i=0; i < rdateValues; i++){
					
					// TODO: still need to convert this part to javascript
					/*
					 * preg_match('/([0-9]{4})(-?([0-9]{2})((-?[0-9]{2})(T([0-9]{2}):?([0-9]{2})(:?([0-9]{2})(\.([0-9]+))?)?(Z|(([-+])([0-9]{2}):([0-9]{2})))?)?)?)?/',
					 * $rdateValue, $dateArray); preg_match
					 * ('/\/P((\d+)Y)?((\d+)M)?((\d+)W)?((\d+)D)?T((\d+)H)?((\d+)M)?((\d+)S)?/',
					 * $rdateValue, $durationArray); $new_event =
					 * $event->cloneEvent(); $start = &$new_event->getStart();
					 * $end = &$new_event->getStart(); $diff = 0;
					 * $start->setDay($dateArray[5]);
					 * $start->setMonth($dateArray[3]);
					 * $start->setYear($dateArray[1]);
					 * $start->setHour($dateArray[7]);
					 * $start->setMinute($dateArray[8]);
					 * $start->setSecond($dateArray[10]);
					 * $new_event->setStart($start); $new_event->setEnd($start);
					 * $end = $new_event->getEnd(); if($durationArray[2]){
					 * //Year
					 * $end->setYear($end->getYear()+intval($durationArray[2])); }
					 * if($durationArray[4]){ //Month
					 * $end->setMonth($end->getMonth()+intval($durationArray[4])); }
					 * if($durationArray[6]){ //Week $diff +=
					 * intval($durationArray[6])*60*60*24*7; }
					 * if($durationArray[8]){ //Day $diff +=
					 * intval($durationArray[8])*60*60*24; }
					 * if($durationArray[10]){ //Hour $diff +=
					 * intval($durationArray[10])*60*60; }
					 * if($durationArray[12]){ //Minute $diff +=
					 * intval($durationArray[12])*60; } if($durationArray[14]){
					 * //Second $diff += intval($durationArray[14]); }
					 * 
					 * $end->addSeconds($diff); $new_event->setEnd($end);
					 * 
					 * if ($end->after($this->starttime) &&
					 * $start->before($this->endtime)) {
					 * if($new_event->isAllday()){
					 * $master_array[$start->format('%Y%m%d')]['-1'][$new_event->getUid()] =
					 * $new_event; }else{
					 * $master_array[$start->format('%Y%m%d')][$start->format('%H%M')][$new_event->getUid()] =
					 * $new_event; } $addedCount++; }
					 */
				}
				break;
			default:
				//TODO: still need to convert this part to javascript
				/*
				 * foreach($event->getRdateValues() as $rdateValue){
				 * preg_match('/([0-9]{4})(-?([0-9]{2})((-?[0-9]{2})(T([0-9]{2}):?([0-9]{2})(:?([0-9]{2})(\.([0-9]+))?)?(Z|(([-+])([0-9]{2}):([0-9]{2})))?)?)?)?/',
				 * $rdateValue, $dateArray); $new_event = $event->cloneEvent();
				 * $start = &$new_event->getStart(); $end =
				 * &$new_event->getEnd(); $diff = $end->getTime() -
				 * $start->getTime(); $start->setDay($dateArray[5]);
				 * $start->setMonth($dateArray[3]);
				 * $start->setYear($dateArray[1]);
				 * $start->setHour($dateArray[7]);
				 * $start->setMinute($dateArray[8]);
				 * $start->setSecond($dateArray[10]);
				 * $new_event->setStart($start); $new_event->setEnd($start);
				 * $end = $new_event->getEnd(); $end->addSeconds($diff);
				 * $new_event->setEnd($end); if ($end->after($this->starttime) &&
				 * $start->before($this->endtime)) { if($new_event->isAllday()){
				 * $master_array[$start->format('%Y%m%d')]['-1'][$new_event->getUid()] =
				 * $new_event; }else{
				 * $master_array[$start->format('%Y%m%d')][$start->format('%H%M')][$new_event->getUid()] =
				 * $new_event; } $addedCount++; } }
				 */
				break;
		}
		return addedCount;
	},
	
	checkRecurringSettings : function(event){
		this.checkFrequency(event);
		this.checkUntil(event);
		if(event.freq == 'none'){
			return;
		}
		this.checkInterval(event);
		this.checkByMonth(event);
		this.checkByWeekno(event);
		this.checkByYearday(event);
		this.checkByMonthday(event);
		this.checkByDay(event);
		this.checkByHour(event);
		this.checkByMinute(event);
		this.checkBySecond(event);
		this.checkBySetpos(event);
		this.checkCount(event);
		this.checkWkst(event);
	},

	filterFalseCombinations : function(event){
		switch (event.freq){
			case '':
			case 'none':
				break;
			case 'day':
				event.bymonth = '';
				event.byweekno = '';
				event.byyearday = '';
				event.bymonthday = '';
				event.byday = '';
				break;
			case 'week':
				event.bymonth = '';
				event.byweekno = '';
				event.byyearday = '';
				event.bymonthday = '';
				break;
			case 'month':
				event.bymonth = '';
				event.byweekno = '';
				event.byyearday = '';
				break;
			case 'year':
				if(event.bymonth!=''){
					event.byweekno = '';
					event.byyearday = '';
				}else if(event.byweekno != ''){
					event.byyearday = '';
				}else if(event.byyearday != ''){
					event.bymonthday = '';
				}else if(event.bymonthday != ''){
					event.byday = '';
				}
				break;
		}
	},

	checkFrequency : function(event){
		var allowedValues = {'second':1,'minute':1,'hour':1,'day':1,'week':1,'month':1,'year':1};
		if(allowedValues[event.freq] == undefined){
			event.freq = 'none';
		}
	},

	checkInterval : function(event){
		if(event.intrval == undefined || event.intrval < 1){
			event.intrval = 1;
		}
	},

	checkCount : function(event){
		if(event.cnt == undefined || event.cnt < 1){
			event.cnt = 9999999;
		}
	},

	checkUntil : function(event){
		if(event.until == undefined || event.until == 0){
			event.until = this.cloneDate(Calajax.MonthView.viewEnd);
		} else if(typeof event.until == 'string'){
			event.until = Calajax.Util.getDateFromYYYYMMDD(event.until);
		}
	},

	checkBySecond : function(event){
		if(parseInt(event.bysecond,10) < 0 || parseInt(event.bysecond,10) > 59){
			event.bysecond = event.startObject.getSeconds();
		}
	},

	checkByMinute : function(event){
		if(parseInt(event.byminute,10) < 0 || parseInt(event.byminute,10) > 59){
			event.byminute = event.startObject.getMinutes();
		}
	},

	checkByHour : function(event){
		if(parseInt(event.byhour,10) < 0 || parseInt(event.byhour,10) > 23){
			event.byhour = event.startObject.getHours();
		}
	},

	checkByDay : function(event){
		var byday_arr = [];
		var allowedValues = [];
		var allowedWeekdayValues = {'MO':'MO','TU':'TU','WE':'WE','TH':'TH','FR':'FR','SA':'SA','SU':'SU'};
		// example: -2TU -> 2nd last Tuesday
		// +1TU -> 1st Tuesday
		// WE,FR -> Wednesday and Friday
		var byDayArray = event.byday;
		if(typeof byDayArray == 'string'){
			byDayArray = byDayArray.split(',');
		}
		if(event.freq=='day'){
			event.byday = allowedWeekdayValues;
			return;
		}
		for(var i=0; i < byDayArray.length; i++){
			byDayArray[i] = byDayArray[i].toUpperCase();
			var byDaySplit = byDayArray[i].match('([-\+]{0,1})?([0-9]{1})?([A-Z]{2})');
			if(byDaySplit){
				if(allowedWeekdayValues[byDaySplit[3]] == undefined){
					continue;
				}else if (!(byDaySplit[2]>0 &&  (event.freq=='month' || event.freq=='year'))){
					// n-th values are not allowed for monthly and yearly
					delete byDaySplit[1];
					delete byDaySplit[2];
				}
				delete byDaySplit[0];
				delete byDaySplit['index'];
				delete byDaySplit['input'];
				allowedValues.push(byDaySplit.join(''));
			}else{
				// the current byday setting is not valid
			}
		}
		if(allowedValues.length==0){
			if(event.freq=='week'){
				allowedValues.push(event.startObject.format('dd'));
			}else{
				allowedValues = this.clone(allowedWeekdayValues);
			}
		}
		event.byday = allowedValues;
	},

	checkByMonth : function(event){
		var byMonth = event.bymonth;
		if(!typeof( byMonth) == "object" || byMonth.length == 0){
			if(event.freq=='year'){
				event.bymonth = [event.startObject.getMonth()+1];
			}else{
				event.bymonth = [1,2,3,4,5,6,7,8,9,10,11,12];
			}
			return;
		}
		var allowedValues = [];
		for(var i = 0; i < byMonth.length; i++){
			var month = byMonth[i];
			if(month > 0 && month < 13){
				allowedValues.push(month);
			}
		}
		event.bymonth = this.unique(allowedValues).sort(this.numSort);
	},
	
	numSort : function(a, b){
		return parseInt(a) - parseInt(b);
	},

	checkByMonthday : function(event){
		/* If there's not a monthday set, pick a default value */
		if(event.bymonthday.length==0){

			/**
			 * If there's no day of the week either, assume that we only want
			 * to recur on the event start day.  If there is a day of the
			 * week, assume that we want to recur anytime that day of the week
			 * occurs.
			 */
			if(event.byday.length==0) {
				event.bymonthday = [event.startObject.getDate()];
			} else {
				event.bymonthday = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
			}
		}else{
			if(typeof event.bymonthday == 'string'){
				event.bymonthday = event.bymonthday.split(',');
			}
			var allowedValues = [];
			for(var i = 0; i < event.bymonthday.lenght; i++){
				if(this.getInbetweenMonthValues(event.bymonthday[i])){
					allowedValues.push(event.bymonthday[i]);
				}
			}
			event.bymonthday = allowedValues;
		}
	},

	checkByYearday : function(event){
		if(event.byyearday.length==0){
			// nothing
		}else{
			var allowedValues = [];
			for(var i = 0; i < event.byyearday.lenght; i++){
				if(this.getInbetweenYearValues(event.byyearday[i])){
					allowedValues.push(event.byyearday[i]);
				}
			}
			event.byyearday = allowedValues;
		}
	},

	checkByWeekno : function(event){
		if(event.freq=='yearly'){
			var allowedValues = [];
			for(var i = 0; i < event.byweekno.lenght; i++){
				if(this.getInbetweenWeekValues(event.byweekno[i])){
					allowedValues.push(event.byweekno[i]);
				}
			}
			event.byweekno = allowedValues;
		}else{
			event.byweekno = '';
		}
	},

	checkWkst : function(event){
		var allowedWeekdayValues = {'MO':1,'TU':1,'WE':1,'TH':1,'FR':1,'SA':1,'SU':1};
		var wkst = event.wkst.toUpperCase();
		if(allowedWeekdayValues[wkst] == undefined){
			wkst = '';
		}
		event.wkst = wkst;
	},

	checkBySetpos : function(event){
		event.bysetpos = parseInt(event.bysetpos,10);
	},

	findDailyWithin : function(master_array, event, startRange, endRange, weekdays, maxCount, currentCount, totalCount, addedCount, maxRecurringEvents){
		var nextOccuranceTime = startRange;
		while(currentCount < maxCount && nextOccuranceTime.getTime() <= endRange.getTime() && addedCount < maxRecurringEvents){
			if(nextOccuranceTime.getTime() != event.startObject.getTime()){
				if((totalCount % event.intrval) == 0){
					var nextOccuranceEndTime = new Date(nextOccuranceTime.getTime() + (event.endObject.getTime() - event.startObject.getTime()));
					if(Calajax.MonthView.viewStart.getTime() <= nextOccuranceEndTime.getTime() || Calajax.MonthView.viewStart.getTime() == nextOccuranceTime.getTime()){
						var new_event = this.clone(event);
						new_event.startObject = this.cloneDate(nextOccuranceTime);
						new_event.endObject = this.cloneDate(nextOccuranceEndTime);
						new_event.start = new_event.startObject;
						new_event.end = new_event.endObject;
						master_array.push(new_event);
						addedCount++;
					}
					currentCount++;
				}
				totalCount++;
			}
			nextOccuranceTime = new Date(nextOccuranceTime.getTime() + 86400000);
		}
		return currentCount;
	},

	getMonthDaysAccordingly : function(event, month, year){
		var byDayArray = event.byday;
		var byMonthDays = event.bymonthday;
		var resultDays = [];
		if(byDayArray.length==0){
			return [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
		}
		for(var i=0; i < byDayArray.length; i++){
			byDaySplit = byDayArray[i].match('([-\+]{0,1})?([0-9]{1})?([A-Z]{2})');
			if(byDaySplit){
				var dayOfWeekday = this.two2threeCharDays(byDaySplit[3], false);
				var monthStartTime = new Date(year,month-1,1,0,0,0);
				var monthEndTime = new Date(year,month,1,0,0,-1);
				if(byDaySplit[2]>0){
					//TODO: translate to javascript
					/*
					 * if(byDaySplit[1]=='-'){ monthTime = new
					 * tx_cal_date(Date_Calc::prevDayOfWeek($dayOfWeekday,$monthEndTime->getDay(),$monthEndTime->getMonth(),$monthEndTime->getYear(),'%Y%m%d',true));
					 * $monthTime->setTZbyId('UTC');
					 * $monthTime->subtractSeconds(($byDaySplit[2]-1)*604800);
					 * }else{ $monthTime = new
					 * tx_cal_date(Date_Calc::nextDayOfWeek($dayOfWeekday,$monthStartTime->getDay(),$monthStartTime->getMonth(),$monthStartTime->getYear(),'%Y%m%d',true));
					 * $monthTime->setTZbyId('UTC');
					 * $monthTime->addSeconds(($byDaySplit[2]-1)*604800); } if
					 * (($monthTime->getMonth()==$month) &&
					 * in_array($monthTime->getDay(),$byMonthDays)) {
					 * $resultDays[] = $monthTime->getDay(); }
					 */
				} else {
					var monthTime = new Date(this.prevDayOfWeek(dayOfWeekday,monthStartTime.getDate(),monthStartTime.getMonth()+1,monthStartTime.getFullYear(),true));
					if(monthTime.getTime() < monthStartTime.getTime()){
						monthTime = new Date(monthTime.getTime() + 604800000);
					}
					while(monthTime.getTime() < monthEndTime.getTime()){
						resultDays.push(monthTime.getDate());
						monthTime = new Date(monthTime.getTime() + 604800000);
					}
				}
			}
		}

		resultDays = this.array_intersect(resultDays, event.bymonthday);
		return resultDays.sort(this.numSort);
	},
	
	getInbetweenMonthValues : function(value){
		value = parseInt(value,10);
		if(value < -31 || value > 31 || value == 0 ){
			return false;
		}
		return true;
	},

	getInbetweenYearValues : function(value){
		value = parseInt(value,10);
		if(value < -366 || value > 366 || value == 0 ){
			return false;
		}
		return true;
	},

	getInbetweenWeekValues : function(value){
		value = parseInt(value,10);
		if(value < -53 || value > 53 || value == 0 ){
			return false;
		}
		return true;
	},
	
	two2threeCharDays : function(day, txt) {
		switch(day) {
			case 'SU': return (txt ? 'sun' : '0');
			case 'MO': return (txt ? 'mon' : '1');
			case 'TU': return (txt ? 'tue' : '2');
			case 'WE': return (txt ? 'wed' : '3');
			case 'TH': return (txt ? 'thu' : '4');
			case 'FR': return (txt ? 'fri' : '5');
			case 'SA': return (txt ? 'sat' : '6');
		}
	},
	
	/**
     * Returns date of the previous specific day of the week
     * from the given date
     *
     * @param int day of week, 0=Sunday
     * @param int    $day     the day of the month, default is current local day
     * @param int    $month   the month, default is current local month
     * @param int    $year    the year in four digit format, default is current local year
     * @param bool   $onOrBefore  if true and days are same, returns current day
     *
     * @return string  the date in the desired format
     *
     * @access public
     * @static
     */
    prevDayOfWeek : function(dow, day, month, year, onOrBefore)
    {
        var days = this.dateToDays(day, month, year);
        var curr_weekday = this.dayOfWeek(day, month, year);
        if (curr_weekday == dow) {
            if (!onOrBefore) {
                days -= 7;
            }
        } else if (curr_weekday < dow) {
            days -= 7 - (dow - curr_weekday);
        } else {
            days -= curr_weekday - dow;
        }
        return this.daysToDate(days);
    },
    
    /**
     * Converts a date to number of days since a distant unspecified epoch
     *
     * @param int    $day     the day of the month
     * @param int    $month   the month
     * @param int    $year    the year.  Use the complete year instead of the
     *                         abbreviated version.  E.g. use 2005, not 05.
     *                         Do not add leading 0's for years prior to 1000.
     *
     * @return integer  the number of days since the Date_Calc epoch
     *
     * @access public
     * @static
     */
    dateToDays : function(day, month, year)
    {
        var century = parseInt((year+"").substr(0, 2),10);
        var year = parseInt((year+"").substr(2, 2),10);
        if (month > 2) {
            month -= 3;
        } else {
            month += 9;
            if (year) {
                year--;
            } else {
                year = 99;
                century --;
            }
        }

        return (Math.floor((146097 * century) / 4 ) +
                Math.floor((1461 * year) / 4 ) +
                Math.floor((153 * month + 2) / 5 ) +
                day + 1721119);
    },
    
    /**
     * Converts number of days to a distant unspecified epoch
     *
     * @param int    $days    the number of days since the Date_Calc epoch
     * @param string $format  the string indicating how to format the output
     *
     * @return string  the date in the desired format
     *
     * @access public
     * @static
     */
    daysToDate : function(days) {
        days   -= 1721119;
        var century = Math.floor((4 * days - 1) / 146097);
        days    = (4 * days) - 1 - (146097 * century);
        var day     = Math.floor(days / 4);

        var year    = Math.floor((4 * day +  3) / 1461);
        day     = (4 * day) +  3 - (1461 * year);
        day     = Math.floor((day +  4) / 4);

        var month   = Math.floor((5 * day - 3) / 153);
        day     = (5 * day) - 3 - (153 * month);
        day     = Math.floor((day +  5) /  5);

        if (month < 10) {
            month +=3;
        } else {
            month -=9;
            if (year++ == 99) {
                year = 0;
                century++;
            }
        }

        century = this.pad(century);
        year    = this.pad(year);
        return new Date(century+""+year, month-1, day);
    },
     
     /**
      * Returns day of week for given date (0 = Sunday)
      *
      * @param int    $day     the day of the month, default is current local day
      * @param int    $month   the month, default is current local month
      * @param int    $year    the year in four digit format, default is current local year
      *
      * @return int  the number of the day in the week
      *
      * @access public
      * @static
      */
     dayOfWeek : function(day, month, year)
     {
         if (month > 2) {
             month -= 2;
         } else {
             month += 10;
             year--;
         }

         day = (Math.floor((13 * month - 1) / 5) +
                 day + (year % 100) +
                 Math.floor((year % 100) / 4) +
                 Math.floor((year / 100) / 4) - 2 *
                 Math.floor(year / 100) + 77);

         return day - 7 * Math.floor(day / 7);
     },
     
     array_intersect : function() {
		// http://kevin.vanzonneveld.net
		// + original by: Brett Zamir (http://brett-zamir.me)
		// % note 1: These only output associative arrays (would need to be
		// % note 1: all numeric and counting from zero to be numeric)
		// * example 1: $array1 = {'a' : 'green', 0:'red', 1: 'blue'};
		// * example 1: $array2 = {'b' : 'green', 0:'yellow', 1:'red'};
		// * example 1: $array3 = ['green', 'red'];
		// * example 1: $result = array_intersect($array1, $array2, $array3);
		// * returns 1: {0: 'red', a: 'green'}
		 
		    var arr1 = arguments[0], retArr = [];
		    var k1 = '', arr = {}, i = 0, k = '';
		
		arr1keys:
		for (k1 in arr1) {
		    arrs:
		    for (i=1; i < arguments.length; i++) {
		        arr = arguments[i];
		        for (k in arr) {
		            if (arr[k] === arr1[k1]) {
		                if (i === arguments.length-1) {
		                    retArr[k1] = arr1[k1];
		                }
		                // If the innermost loop always leads at least once to an equal value, continue the loop until done
		                continue arrs;
		            }
		        }
	        // If it reaches here, it wasn't found in at least one array, so try next value
	            continue arr1keys;
	        }
	    }
		 
	    return retArr;
	},
	
	unique : function(array) {
	    // http://kevin.vanzonneveld.net
	    // +   original by: Carlos R. L. Rodrigues (http://www.jsfromhell.com)
	    // +      input by: duncan
	    // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	    // +   bugfixed by: Nate
	    // +      input by: Brett Zamir (http://brett-zamir.me)
	    // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	    // +   improved by: Michael Grier
	    // %          note 1: the second argument, sort_flags is not implemented
	    // *     example 1: array_unique(['Kevin','Kevin','van','Zonneveld','Kevin']);
	    // *     returns 1: ['Kevin','van','Zonneveld']
	    // *     example 2: array_unique({'a': 'green', 0: 'red', 'b': 'green', 1: 'blue', 2: 'red'});
	    // *     returns 2: {'a': 'green', 0: 'red', 1: 'blue'}
	    
	    var key = '', tmp_arr1 = {}, tmp_arr2 = {};
	    var val = '';
	    tmp_arr1 = array;
	    
	    var __array_search = function (needle, haystack) {
	        var fkey = '';
	        for (fkey in haystack) {
	            if ((haystack[fkey] + '') === (needle + '')) {
	                return fkey;
	            }
	        }
	        return false;
	    };
	 
	    for (key in tmp_arr1) {
	        val = tmp_arr1[key];
	        if (false === __array_search(val, tmp_arr2)) {
	            tmp_arr2[key] = val;
	        }
	        
	        delete tmp_arr1[key];
	    }
	    
	    return tmp_arr2;
	},
	
	cloneDate : function(d) {
		return new Date(+d);
	},
	
	clone : function(obj) {
		return eval(uneval(obj));
	},
	
	pad : function(n) {
		return (n < 10 ? '0' : '') + n;
	}
}