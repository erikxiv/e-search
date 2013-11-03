/**
 * Cursor Functions
 *
 * Used for setting and getting text cursor position within an input
 * and textarea field. Also used to get and set selection range.
 * 
 * @author Branden Cash
 * @email brandencash@crutzdesigns.com
 */

(function( $ ){

  /* Quick and dirty add-on for tab selection. Only supports a single input element */
  // Markers = start/length of tab-stops
  var markers = [ {start:10,length:2}, {start:14,length:1}];
  var index = 0;
  var that = this;
  var element = null;

  var act = function(e) {
    // alert("Done");
    if (e.which === 9) { /// tab key
      index = index + 1;
      $(this).setSelection(markers[index].start, markers[index].start+markers[index].length);
      e.stopPropagation();
      e.preventDefault();
      if (markers.length <= index+1)
        $(this).off("keydown", act);
    }
    else if (e.which === 32 || // space
      e.which === 8 || // backspace
      e.which === 16 || // shift
      e.which === 18 || // alt
      e.which === 188 || // ,
      e.which === 189 || // -
      e.which === 190 || // .
      (e.which >= 48 && e.which <= 57) || // 1-9
      (e.which >= 96 && e.which <= 105) || // 1-9 numpad
      (e.which >= 65 && e.which <= 90) // a-z
       ) {
      // Ignore
    }
    else {
      // jump out
      $(this).off("keydown", act);
    }
  };

  var generate_markers = function(pattern) {
    markers = [];
    var re = /\${(\d+):([^}]+)}/;
    while (re.test(pattern)) {
      m = re.exec(pattern);
      marker_index = m[1]-1;
      marker_start = m.index;
      marker_length = m[2].length;
      markers[marker_index] = {start:marker_start,length:marker_length};
      // $('body').append(pattern+":"+marker_index+":"+marker_start+":"+marker_length+"<br/>");
      pattern = pattern.replace(re, "$2");
    }
    return pattern;
  };

  jQuery.fn.addTabStops = function(s) {
    element = this;
    s = generate_markers(s);
    $(this).typeahead('setQuery', s); 
    $(this).setSelection(markers[index].start, markers[index].start+markers[index].length);
    if (markers.length > index+1)
      $(this).on("keydown", act);
    return s;
  };

  // End of quick and dirty section

  jQuery.fn.getCursorPosition = function(){
    if(this.length === 0) return -1;
    return $(this).getSelectionStart();
  };
 
  jQuery.fn.setCursorPosition = function(position){
    if(this.length === 0) return this;
    return $(this).setSelection(position, position);
  };
 
  jQuery.fn.getSelection = function(){
    if(this.length === 0) return -1;
    var s = $(this).getSelectionStart();
    var e = $(this).getSelectionEnd();
    return this[0].value.substring(s,e);
  };
 
  jQuery.fn.getSelectionStart = function(){
    if(this.length === 0) return -1;
    input = this[0];
 
    var pos = input.value.length;
 
    if (input.createTextRange) {
      var r = document.selection.createRange().duplicate();
      r.moveEnd('character', input.value.length);
      if (r.text === '') 
        pos = input.value.length;
      pos = input.value.lastIndexOf(r.text);
    } else if(typeof(input.selectionStart)!="undefined")
      pos = input.selectionStart;
 
    return pos;
  };
 
  jQuery.fn.getSelectionEnd = function(){
    if(this.length === 0) return -1;
    input = this[0];
 
    var pos = input.value.length;
 
    if (input.createTextRange) {
      var r = document.selection.createRange().duplicate();
      r.moveStart('character', -input.value.length);
      if (r.text === '') 
        pos = input.value.length;
      pos = input.value.lastIndexOf(r.text);
    } else if(typeof(input.selectionEnd)!="undefined")
      pos = input.selectionEnd;
 
    return pos;
  };
 
  jQuery.fn.setSelection = function(selectionStart, selectionEnd) {
    if(this.length === 0) return this;
    input = this[0];
 
    if (input.createTextRange) {
      var range = input.createTextRange();
      range.collapse(true);
      range.moveEnd('character', selectionEnd);
      range.moveStart('character', selectionStart);
      range.select();
    } else if (input.setSelectionRange) {
      input.focus();
      input.setSelectionRange(selectionStart, selectionEnd);
    }
 
    return this;
  };
})( jQuery );