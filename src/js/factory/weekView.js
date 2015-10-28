/**
 * @fileoverview Factory module for WeekView
 * @author NHN Ent. FE Development Team <dl_javascript@nhnent.com>
 */
'use strict';

var domutil = require('../common/domutil');

// Parent views
var Week = require('../view/week/week');

// Sub views
var DayName = require('../view/week/dayname');
var TimeGrid = require('../view/week/timeGrid');
var Allday = require('../view/week/allday');

// Handlers
var AlldayCreation = require('../handler/allday/creation');
var AlldayMove = require('../handler/allday/move');
var AlldayResize = require('../handler/allday/resize');
var TimeClick = require('../handler/time/click');
var TimeCreation = require('../handler/time/creation');
var TimeMove = require('../handler/time/move');
var TimeResize = require('../handler/time/resize');

// Base Templates
var weekViewTmpl = require('../view/template/factory/weekView.hbs');

module.exports = function(baseController, layoutContainer, dragHandler, options) {
    var weekView,
        dayNameView,
        alldayView,
        timeGridView,
        alldayCreationHandler,
        alldayMoveHandler,
        alldayResizeHandler,
        timeClickHandler,
        timeCreationHandler,
        timeMoveHandler,
        timeResizeHandler;

    weekView = new Week(null, options.week, layoutContainer);
    weekView.container.innerHTML = weekViewTmpl();

    /**********
     * 일자표기 (상단 일월화수...)
     **********/
    dayNameView = new DayName(null, domutil.find('.schedule-view-dayname-layout', weekView.container));
    weekView.addChild(dayNameView);

    /**********
     * 종일일정
     **********/
    alldayView = new Allday(options.week, domutil.find('.schedule-view-allday-layout', weekView.container));
    weekView.addChild(alldayView);
    alldayCreationHandler = new AlldayCreation(dragHandler, alldayView, baseController);
    alldayMoveHandler = new AlldayMove(dragHandler, alldayView, baseController);
    alldayResizeHandler = new AlldayResize(dragHandler, alldayView, baseController);

    /**********
     * 시간별 일정
     **********/
    timeGridView = new TimeGrid(options.week, domutil.find('.schedule-view-timegrid-layout', weekView.container));
    weekView.addChild(timeGridView);
    timeClickHandler = new TimeClick(dragHandler, timeGirdView);
    timeCreationHandler = new TimeCreation(dragHandler, timeGridView, baseController);
    timeMoveHandler = new TimeMove(dragHandler, timeGridView, baseController);
    timeResizeHandler = new TimeResize(dragHandler, timeGridView, baseController);

    weekView.handlers = {
        allday: {
            creation: alldayCreationHandler,
            move: alldayMoveHandler,
            resize: alldayResizeHandler
        },
        time: {
            click: timeClick,
            creation: timeCreationHandler,
            move: timeMoveHandler,
            resize: timeResizeHandler
        }
    };

    // add controller
    weekView.controller = baseController.Week;

    // add destroy
    weekView._beforeDestroy = function() {
        util.forEach(weekView.handlers, function(group) {
            util.forEach(group, function(handler) {
                handler.off();
                handler.destroy();
            });
        });
    };

    return weekView;
};
