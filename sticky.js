(function( win, $, undefined ) {
  'use strict';

  $.fn.sticky = function(options) {

    // ------------------------------------------------------------
    //  * Settings
    // ------------------------------------------------------------

    var defaults = {
      offset: 0,
      scrollRate: 100
    };
    var settings = $.extend( {}, defaults, options );

    // ------------------------------------------------------------
    //  * Define Variables
    // ------------------------------------------------------------

    var winTop = 0;
    var stickyZoneTop = 0;
    var stickyZoneBottom = 0;

    var isScrolling = false;
    var elState = null;

    // Cache elements
    var $win = $(win);
    var $el = $(this);
    var $parent = $el.parent();
    var $stickyWrapper = $('<div class="sticky-wrapper" style></div>');

    // The $el
    var elHeight = $el.outerHeight(true);
    var elWidth = $el.outerWidth(true);
    var elTop = $el.offset().top;

    // The $parent
    var parentHeight = $parent.height();
    var parentTop = $parent.offset().top;
    var parentBottom = parentTop + parentHeight;

    // Set sticky wrapper height
    $stickyWrapper.css({ height: elHeight + 'px' });

    // ------------------------------------------------------------
    //  * Scrolling
    // ------------------------------------------------------------

    var scrolling = function() {

      winTop = $win.scrollTop();
      stickyZoneTop = elTop - settings.offset;
      stickyZoneBottom = parentBottom - settings.offset;

      // Scrolling above the sticky zone
      if ( winTop < stickyZoneTop ) {
        makeElementNotSticky();
        return;
      }

      // Scrolling in the sticky zone
      if ( winTop >= stickyZoneTop && winTop <= stickyZoneBottom ) {
        makeElementSticky();
        return;
      }

      // Scrolling below the sticky zone (the stuck zone)
      if ( winTop > stickyZoneBottom ) {
        makeElementStuck();
        return;
      }

    };

    // ------------------------------------------------------------
    //  * Make Not Sticky
    // ------------------------------------------------------------

    var makeElementNotSticky = function() {
      if ( elState !== null ) {
        $el.unwrap($stickyWrapper);
        $el.removeClass('sticky');
        elState = null;
      }
    };

    // ------------------------------------------------------------
    //  * Make Sticky
    // ------------------------------------------------------------

    var makeElementSticky = function() {
      if ( elState !== 'sticky' ) {
        if ( elState === null ) {
          $el.wrap($stickyWrapper);
        }
        $el.removeClass('stuck').addClass('sticky');
        $el.css({ width: elWidth + 'px', top: settings.offset + 'px' });
        elState = 'sticky';
      }
    };

    // ------------------------------------------------------------
    //  * Make Stuck
    // ------------------------------------------------------------

    var makeElementStuck = function() {
      if ( elState !== 'stuck' ) {
        $el.addClass('stuck').removeClass('sticky').css({ top: parentBottom + 'px'});
        elState = 'stuck';
      }
    };

    // ------------------------------------------------------------
    //  * Throttled Scroll Event
    // ------------------------------------------------------------

    $(window).scroll(function() {
      isScrolling = true;
    });

    setInterval(function() {
      if ( isScrolling ) {
        isScrolling = false;
        scrolling();
      }
    }, settings.scrollRate );

  };

})(window, jQuery);

$(document).ready(function() {
  $('.stick-this').sticky({ offset: 20 });
});

