'use strict'; // ES5+ to report undeclared variables.


/*
// checkbox_elem1.indeterminate = true; // can set this indeterminate property via JavaScript (it cannot be set using an HTML attribute):


// Aug 2023: To select multiple checkboxes using shift key:  from: https://gist.github.com/aaemnnosttv/30fc91338c71e5b9ed31a7378d23983d
const boxes = Array.from(document.querySelectorAll('.inbox .item [type="checkbox"]'));
let lastChecked;

function changeBox(event) {
  if (event.shiftKey && this != lastChecked) {
    checkIntermediateBoxes(lastChecked, this);
  }

  lastChecked = this;
}
boxes.forEach(item => item.addEventListener('click', changeBox));

function checkIntermediateBoxes(first, second) {
  if (boxes.indexOf(first) > boxes.indexOf(second)) {
    [second, first] = [first, second];
  }

  intermediateBoxes(first, second).forEach(box => box.checked = true);
}

function intermediateBoxes(start, end) {
  return boxes.filter((item, key) => {
    return boxes.indexOf(start) < key && key < boxes.indexOf(end);
  });
}
*/


function set_tooltip_click_outside_details_event() {
  // From: https://css-tricks.com/exploring-what-the-details-and-summary-elements-can-do/ 
  // const tooltip = document.querySelector(".tooltip");

  // const tooltips = document.querySelectorAll(".tooltip"); // Using querySelectorAll() as querySelector() just selects the first one.

  var tooltips = document.getElementsByTagName("DETAILS");

  console.log("tooltips:", tooltips);

  //alert(tooltip);

  document.addEventListener("click", function (e) {
    //alert("document.addEventListener()");
    for (var i = 0; i < tooltips.length; i++) {
      // alert(tooltip);
      var tooltip = tooltips[i];

      if (tooltip.hasAttribute("open") && !tooltip.contains(e.target)) tooltip.removeAttribute("open");

      //    var insideTooltip = tooltip.contains(e.target);
      //    if (!insideTooltip) {
      //        alert("document.addEventListener() !insideTooltip"); 
      //      tooltip.removeAttribute("open");
    }
  });
}


// Global vars:
var j_gene_id, j_fc, j_pvalue, j_pct1, j_pct2, // Columns in input files.
  celltypes, fc_amounts, times, logfcs, logpvs, pct1s, pct2s, logsort, head1, head2, num_fc_in_cols, // arrays. The first row of logfcs contains the column headings, and first column contains the gene-name 
  gene_dict, // gene name dictionary used when reading in multiple files.
  num_cols, fc_min, fc_max,
  has_pct12_columns = false, has_pvalues_columns = false,
  num_files, num_files_read, num_files_for_parsing, // For reading multiple files. 
  taxid = "", ensembl_id = "", gprofiler_id = "", organism_text = "",
  num_files_with_unknown_headings,
  show_fold_change_or_pvalue = "fold_change",
  lightRed = "#FF6666", red = "red", green = "green", greenYellow = "greenyellow", yellow = "yellow", blue = "blue", lightBlue = "lightblue";

// was: var taxid, organism, organism_text;


// eg: 
// times = ["EARLY","MID","LATE"]; // or ["E","M","L"]; // to fit more in.
// celltypes = ["Amacrine","Astrocyte","Bipolar","Cone","Endothelial","Horizontal","Microglia","Muller Glia","Pericyte","RGC","Rod","RPE"];

// logfcs cols: headings = ["Gene","Amacrine_1:EARLY","Amacrine_1:MID","Amacrine_1:LATE","Amacrine_2:EARLY","Amacrine_2:MID","Amacrine_2:LATE","Amacrine_3:EARLY","Amacrine_3:MID","Amacrine_3:LATE","Amacrine_4:EARLY","Amacrine_4:MID","Amacrine_4:LATE","Amacrine_5:EARLY","Amacrine_5:MID","Amacrine_5:LATE","Amacrine_6:EARLY","Amacrine_6:MID","Amacrine_6:LATE","Amacrine_7:EARLY","Amacrine_7:MID","Amacrine_7:LATE","Amacrine_8:EARLY","Amacrine_8:MID","Amacrine_8:LATE","Amacrine_9:EARLY","Amacrine_9:MID","Amacrine_9:LATE","Amacrine_10:EARLY","Amacrine_10:MID","Amacrine_10:LATE","Amacrine_11:EARLY","Amacrine_11:MID","Amacrine_11:LATE","Amacrine_12:EARLY","Amacrine_12:MID","Amacrine_12:LATE","Amacrine_13:EARLY","Amacrine_13:MID","Amacrine_13:LATE","Amacrine_14:EARLY","Amacrine_14:MID","Amacrine_14:LATE","Amacrine_15:EARLY","Amacrine_15:MID","Amacrine_15:LATE","Amacrine_16:EARLY","Amacrine_16:MID","Amacrine_16:LATE","Amacrine_17:EARLY","Amacrine_17:MID","Amacrine_17:LATE","Astrocyte:EARLY","Astrocyte:MID","Astrocyte:LATE","Bipolar_1:EARLY","Bipolar_1:MID","Bipolar_1:LATE","Bipolar_2:EARLY","Bipolar_2:MID","Bipolar_2:LATE","Bipolar_3:EARLY","Bipolar_3:MID","Bipolar_3:LATE","Bipolar_5:EARLY","Bipolar_5:MID","Bipolar_5:LATE","Bipolar_6:EARLY","Bipolar_6:MID","Bipolar_6:LATE","Bipolar_7:EARLY","Bipolar_7:MID","Bipolar_7:LATE","Bipolar_8:EARLY","Bipolar_8:MID","Bipolar_8:LATE","Bipolar_9:EARLY","Bipolar_9:MID","Bipolar_9:LATE","Bipolar_10:EARLY","Bipolar_10:MID","Bipolar_10:LATE","Bipolar_11:EARLY","Bipolar_11:MID","Bipolar_11:LATE","Bipolar_12:EARLY","Bipolar_12:MID","Bipolar_12:LATE","Bipolar_13:EARLY","Bipolar_13:MID","Bipolar_13:LATE","Bipolar_14:EARLY","Bipolar_14:MID","Bipolar_14:LATE","Bipolar_15:EARLY","Bipolar_15:MID","Bipolar_15:LATE","Bipolar_16:EARLY","Bipolar_16:MID","Bipolar_16:LATE","Bipolar_17:EARLY","Bipolar_17:MID","Bipolar_17:LATE","Bipolar_18:EARLY","Bipolar_18:MID","Bipolar_18:LATE","Bipolar_19:EARLY","Bipolar_19:MID","Bipolar_19:LATE","Bipolar_20:EARLY","Bipolar_20:MID","Bipolar_20:LATE","Bipolar_21:EARLY","Bipolar_21:MID","Bipolar_21:LATE","Bipolar_22:EARLY","Bipolar_22:MID","Bipolar_22:LATE","Bipolar_23:EARLY","Bipolar_23:MID","Bipolar_23:LATE","Bipolar_24:EARLY","Bipolar_24:MID","Bipolar_24:LATE","Bipolar_25:EARLY","Bipolar_25:MID","Bipolar_25:LATE","Cone_1:EARLY","Cone_1:MID","Cone_1:LATE","Cone_2:EARLY","Cone_2:MID","Cone_2:LATE","Cone_3:EARLY","Cone_3:MID","Cone_3:LATE","Endothelial:EARLY","Endothelial:MID","Endothelial:LATE","Horizontal:EARLY","Horizontal:MID","Horizontal:LATE","Microglia:EARLY","Microglia:MID","Microglia:LATE","Muller Glia_1:EARLY","Muller Glia_1:MID","Muller Glia_1:LATE","Muller Glia_2:EARLY","Muller Glia_2:MID","Muller Glia_2:LATE","Muller Glia_3:EARLY","Muller Glia_3:MID","Muller Glia_3:LATE","Muller Glia_4:EARLY","Muller Glia_4:MID","Muller Glia_4:LATE","Pericyte:EARLY","Pericyte:MID","Pericyte:LATE","RGC_1:EARLY","RGC_1:MID","RGC_1:LATE","RGC_2:EARLY","RGC_2:MID","RGC_2:LATE","RPE:EARLY","RPE:MID","RPE:LATE","Rod_1:EARLY","Rod_1:MID","Rod_1:LATE","Rod_2:EARLY","Rod_2:MID","Rod_2:LATE","Rod_3:EARLY","Rod_3:MID","Rod_3:LATE","Rod_4:EARLY","Rod_4:MID","Rod_4:LATE","Rod_5:EARLY","Rod_5:MID","Rod_5:LATE","Rod_6:EARLY","Rod_6:MID","Rod_6:LATE"];


//missing = ["RPE:EARLY","RPE:MID","RPE:LATE"];
// or: 
// missing = ["Amacrine_10:M","Bipolar_3:M","Bipolar_8:M","Bipolar_10:E","Bipolar_10:M","Bipolar_10:L","Bipolar_12:M","Bipolar_16:E","Bipolar_16:M","Bipolar_17:M","Bipolar_21:M","RGC_2:M","RPE:M","RPE:L"];


//  logfcs = [
// ["1190005I06Rik",0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
// or: 
// ["1110004F10Rik",0,0.5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
//];

//// var numcols=187, min = -7.100000, max = 4.600000;

function isOnLine() {
  return window.navigator.onLine;
}


function onLoadPage() { // Is called in the '<body ...> tag below using: onload="onLoadPage()" 
  // Get DeviceId:
  //if (typeof(Storage) === "undefined") return;  
  //device_id  = localStorage.getItem("{{ app }}_device_id");  if (device_id===null)  device_id ="";
  //device_key = localStorage.getItem("{{ app }}_device_key"); if (device_key===null) device_key="";

  //document.getElementById('cluster_type_in_title').innerHTML = FINE ? ' Fine ' : ' Coarse ';
  //show_heatmap_scale();
  //set_filter_menu_options();
  //show_heatmap();

  set_tooltip_click_outside_details_event();

  document.getElementById('display_options_help_tab_instructions').innerHTML = tab_instructions; // To add these instructions to the Display Options tab Help.

  // Could give an optional 'url' param to data files on a webserver:
  var searchParams = new URLSearchParams(window.location.search),
    url_param = searchParams.get('url'),
    url_to_read_input = document.getElementById("url_to_read");

  if (url_param) url_to_read_input.value = url_param.trim();
  //alert("Set url_param="+url_param);

  enable_read_from_url_button(url_to_read_input); // Will always run this.

  if (url_param) url_to_read_clicked(); // So will load the heatmap without needing to click the button.
}





function onBeforeUnloadPage() {  // Can be called in the '<body ...> tag below using: onbeforeunload="return onBeforeUnloadPage();"
  //if (data_needs_saving()) {
  //    return "Do you really want to leave this Heatmap webpage?";   // Browsers give their own general message.
  //} else {
  return;
  //}
}


function guess_identifier_type_and_species(gene_id) {
  // Full regexp's for gene ids, eg: Ensembl: https://registry.identifiers.org/registry/ensembl
  var id_type = "GENE_SYMBOL"; // Default : Gene symbol (eg: VEGFA)
  if (/^ENS[A-Z]{0,3}G\d+/.test(gene_id)) id_type = "ENSEMBL_GENE_ID"; // Ensembl Gene Id, (eg: ENSG00000112715 or: ENSMUSG00000023951)
  else if (/^ENS[A-Z]{0,3}T\d+/.test(gene_id)) id_type = "ENSEMBL_TRANSCRIPT_ID"; // Ensembl Transcript Id (eg: ENST00000672860.3 or ENSMUST00000142351.9)
  else if (/^ENS[A-Z]{0,3}P\d+/.test(gene_id)) id_type = "ENSEMBL_PROTEIN_ID"; // Ensembl Protein Id (eg: ENSP00000500082.3 or ENSMUSP00000115883.3)
  else if (/^\d+$/.test(gene_id)) id_type = "ENTREZ_GENE_ID"; // Entrez Gene Id (eg: 7422)
  //  else if (          /^[PQ]\d+/.test(gene_id)) id_type = "UNIPROT_ID"; // UniProt Protein Id (eg: P15692 or Q00731 or Q99PS1). 
  else if (/[OPQ][0-9][A-Z0-9]{3}[0-9]|[A-NR-Z][0-9]([A-Z][A-Z0-9]{2}[0-9]){1,2}/.test(gene_id)) id_type = "UNIPROT_ID"; // UniProt Protein Id (eg: P15692 or Q00731 or Q99PS1 or A0A023GPI8). This RegExp is from https://www.uniprot.org/help/accession_numbers

  // alert("guess_identifier_type_and_species() id_type="+id_type);
  document.getElementById("gene_symbol_type").value = id_type;
  //alert("guess_identifier_type_and_species("+gene_id+") = "+id_type);
}


function enable_sjb_tab(idfrom, idto, enable) {
  // eg: enable_sjb_tab('2','2',true);
  for (var id = idfrom; id <= idto; id++)
    document.getElementById("sjb_tab" + id).disabled = !enable;
}



function fold_change_or_pvalue_changed() {
  // NOT USED AS ALWAYS SHOWING P-VALUES IF AVAILABLE

  var fold_change_or_pvalue_select = document.getElementById("fold_change_or_pvalue_select");

  show_fold_change_or_pvalue = fold_change_or_pvalue_select.value; // Is global and is initialised above in var declaration to "fold_change", and title is also initialised to "Fold change" - alternatively call this fold_change_or_pvalue_changed() function in page onload?

  document.getElementById("fold_change_or_pvalue_title").innerHTML = fold_change_or_pvalue_select.text; // Intialised to Fold change. was: = (show_fold_change_or_pvalue === "fold_change") ? "Fold change" : "P-values for fold-change";

  alert("fold_change_or_pvalue_changed() to:" + show_fold_change_or_pvalue);
}


function other_organism_species_changed() {
  var tax_ensembl_gprofiler_ids = document.getElementById("other_organism_species").value.trim().split(':');

  if (tax_ensembl_gprofiler_ids.length !== 3) {
    taxid = ensembl_id = gprofiler_id = organism_text = ""; // Global variables.
    // alert("You need to enter other species in the format: 'tax_id : ensembl_name : gprofiler_organism_name' You have entered: "+tax_ensembl_gprofiler_ids); // Better to just give a message not an alert.
    set_stringdb_and_gprofiler_species_text("Select species details above");
    return;
  }

  // These are global variables:
  taxid = tax_ensembl_gprofiler_ids[0].trim();
  ensembl_id = tax_ensembl_gprofiler_ids[1].trim();
  gprofiler_id = tax_ensembl_gprofiler_ids.length > 2 ? tax_ensembl_gprofiler_ids[2].trim() : ''; // some have no gprofiler_id, so split() doesn't include value after the last ':'
  organism_text = ensembl_id.split('_'); // Global

  set_stringdb_and_gprofiler_species_text(tax_ensembl_gprofiler_ids.join(' : '));
  enable_stringdb_buttons();
  enable_gprofiler_button();
  enable_david_button();

  console.log("other_organism_species_changed():  Taxid=" + taxid + "    Ensembl_id=" + ensembl_id + "   gProfiler_id=" + gprofiler_id + "   Organism_text=" + organism_text);
}


function organism_species_changed() {
  // Set organism for G:Profiler and StringDB
  var taxid_organism_elem = document.getElementById("organism_species"),
    other_organism_div = document.getElementById("other_organism_species_div"),
    tax_ensembl_gprofiler_ids = taxid_organism_elem.value.trim().split(':');

  taxid = tax_ensembl_gprofiler_ids[0]; // This tax_id is a Global variable.

  if (taxid === "OTHER") { // taxid_organism is "OTHER:OTHER"
    other_organism_div.style.display = ''; // show the OTHER input box and label.
    other_organism_species_changed(); // As may have previously entered another organism.
  } else {
    other_organism_div.style.display = 'none'; // hide OTHER species input box.

    // Global variables:
    ensembl_id = tax_ensembl_gprofiler_ids[1].trim();
    gprofiler_id = tax_ensembl_gprofiler_ids.length > 2 ? tax_ensembl_gprofiler_ids[2].trim() : ''; // some have no gprofiler_id, so split() doesn't include value after the last ':'
    organism_text = taxid_organism_elem.text;

    set_stringdb_and_gprofiler_species_text(tax_ensembl_gprofiler_ids.join(' : '));
    enable_stringdb_buttons();
    enable_gprofiler_button();
    enable_david_button();
  }

  console.log("other_organism_species_changed():  Taxid=" + taxid + "    Ensembl_id=" + ensembl_id + "   gProfiler_id=" + gprofiler_id + "   Organism_text=" + organism_text);
}


function set_organism_species_selected(species_param) {
  var taxid_organism_elem = document.getElementById("organism_species"),
    other_organism_div = document.getElementById("other_organism_species_div"),
    options = taxid_organism_elem.options;

  if (options.length === 0) alert("set_organism_species_selected(): options.length is zero");

  var found = false;
  for (var i = 0; i < options.length; i++) {
    if (options[i].value === species_param) {
      options[i].selected = true; // or: taxid_organism_elem.selectedIndex = i;
      found = true;
    }
  }

  if (!found) {
    taxid_organism_elem.value = "OTHER";
    other_organism_div.value = species_param;
  }

  organism_species_changed(); // This sets global vars and show/hides the 'other' input box, and calls other_organism_species_changed();
}



var fc_hue_factor_red, fc_hue_factor_blue; // set in show_heatmap_scale().  Also used in show_heatmap()

function hsl_color(fc) {
  // I changed so that, red is positive, blue is negative:
  // +3   : red    (hsl(  0, 100%, 50%))
  // >0   : yellow (hsl( 60, 100%, 50%))
  // 0    : green  (hsl(120, 100%, 50%))
  // <0   : cyan   (hsl(180, 100%, 50%))
  // -3   : blue   (hsl(240, 100%, 50%))

  var h;

  // if (fc == null) ....
  if (fc == 0) h = 120; // green.
  else if (fc > 0) h = Math.max(0, 60 - fc_hue_factor_red * fc); // the 15 assumes fc range 0 to +4, or 30 assumes fc range 0 to +2, 20 is fc range 0 to +3
  else h = Math.min(240, 180 - fc_hue_factor_blue * fc); // if (fc < 0)  // the 30 assumes fc range 0 to -2.  20 is fc range 0 to -3

  // could increase the 'L' to make the blue and yellow lighter near zero.
  var l = Math.round(90 - 40 * Math.min(1, Math.abs(fc))); // so will be 60% at 1, 80% near zero, 
  // return [h,l]; // keeping s=100%
  // https://riptutorial.com/html5-canvas/example/13472/fillstyle--a-path-styling-attribute-
  return 'hsl(' + h + ', 100%, ' + l + '%)';
}

function show_heatmap_scale() {
  var html = "";

  // or aim:  1.2 -> 2 and -1.2 -> -2
  //var fc_min_lower  = fc_min > 0 ? Math.ceil(fc_min) : Math.floor(fc_min),  // was -3 in test
  //    fc_max_higher = fc_max > 0 ? Math.ceil(fc_max) : Math.floor(fc_max),  // was +3 in test
  //    fc_step = 0.5;

  // We want to organise it so '0' is included when stepping below:
  if (fc_min > fc_max) { alert("ERROR: show_heatmap_scale(): fc_min=" + fc_min + " > fc_max=" + fc_max); return; }

  var fc_range = fc_max - fc_min; // range might even be zero.

  // BUT This isn't good for small ranges: 
  var fc_min_lower = Math.floor(fc_min), // was -3 in test
    fc_max_higher = Math.ceil(fc_max);  // was +3 in test
  // if bpth are -0.17 then fc_min_lower = -1  fc_max_higher = -0

  var fc_step = (fc_max_higher) / 6; // = 0/6
  var fc_step_temp = (-fc_min_lower) / 6; // = 1/6
  if (fc_step_temp > fc_step) fc_step = fc_step_temp; // = 1/6
  if (fc_step === 0) alert("show_heatmap_scale(): fc_step=" + fc_step + "  fc_step_temp=" + fc_step_temp);

  console.log("show_heatmap_scale(): fc_max:", fc_max, fc_max_higher, "  fc_min:", fc_min, "  fc_min_lower:", fc_min_lower, "  fc_max_higher:", fc_max_higher, "  (fc_max_higher - fc_min_lower)/12:", (fc_max_higher - fc_min_lower) / 12, "  fc_step_temp:", fc_step_temp, "  fc_step:", fc_step);

  // Round the step:
  fc_step = (fc_step > 2) ? Math.round(fc_step) : (fc_step > 0.2) ? Math.round(10 * fc_step) / 10.0 : Math.round(100 * fc_step) / 100.0;  // was: 0.5

  //alert("fc_step="+fc_step);

  // Math.floor(1.4)  gives: 1
  // Math.floor(-1.4) gives: -2

  // Math.ceil(1.4)   gives: 2
  // Math.ceil(-1.4)  gives: -1
  var fc_min_lower_minus_half_step = fc_min_lower - 0.9 * fc_step; // increasing min by half step as otherwise rounding error in fc_step means fc can be slightly larger than fc_min_lower eg. +000000.
  var fc_max_higher_plus_half_step = fc_max_higher + 0.9 * fc_step; // increasing min by half step as otherwise rounding error in fc_step means fc can be slightly larger than fc_min_lower eg. +000000.

  //console.log("show_heatmap_scale(): 1 : fc_min="+fc_min+"  fc_max="+fc_max+"  fc_min_lower="+fc_min_lower+"  fc_max_higher="+fc_max_higher+"  fc_step="+fc_step, "  fc_min_lower_minus_half_step=",fc_min_lower_minus_half_step,"  fc_max_higher_plus_half_step=",fc_max_higher_plus_half_step);

  var fc_list = [], fc;

  for (fc = 0; fc >= fc_min_lower_minus_half_step; fc -= fc_step) { console.log("fc=" + fc, " >= fc_min_lower_minus_half_step", fc_min_lower_minus_half_step); fc_list.push(fc); }
  //console.log("show_heatmap_scale(): 1.1");

  fc_list.reverse(); // reverses and overwrites the original array, so most negative should be first in the new list.

  for (fc = 0; fc <= fc_max_higher_plus_half_step; fc += fc_step) if (fc !== 0) { console.log("fc=" + fc); fc_list.push(fc); } // don't include zero twice.

  //console.log("show_heatmap_scale(): 1.2");
  fc_hue_factor_red = 60 / fc_max_higher;
  fc_hue_factor_blue = -60 / fc_min_lower;
  //console.log("show_heatmap_scale(): 1.3");
  // OLD: for (var fc = fc_min_lower; fc <= fc_max_higher; fc += fc_step) {
  for (var i = 0; i < fc_list.length; i++) {
    var fc = fc_list[i];

    //if (fc == 0) html += '<td> &nbsp; 0 &nbsp; </td>';
    //else {
    // old: var h = (5 - fc)* 24;

    //console.log("show_heatmap_scale",i,fc);

    var fc_rounded = Math.round(100 * fc) / 100; // to two decimal places.
    html += '<td style="background-color: ' + hsl_color(fc_rounded) + ';"> &nbsp; ' + fc_rounded + ' &nbsp; </td>';
    //}
  }
  //console.log("show_heatmap_scale(): 2");
  document.getElementById("heatmap_scale_tbody").innerHTML = '<tr><td style="border:0;"><b>Heatmap log2fc colour scale:</b></td>' + html + '</tr>';

  console.log("show_heatmap_scale(): finished");

}






var fc_amounts_options_signed = true;
function set_fc_amount_options_old() { // pre Aug 2023.
  var html = '<option value="Any" selected>Any fold-change</option>', i, val;

  if (fc_amounts_options_signed) {

    //for (var i=0; i<fc_amounts.length; i++) // Absolute 
    //  html += '<option value="a'+fc_amounts[i]+'">&ge;&plus;'+fc_amounts[i]+' or &le;&minus;'+fc_amounts[i]+'</option>\n'; // lowercase 'a' here for absolute,  as Any is uppercase a

    // for .. of ... in ES6+
    for (val of fc_amounts)
      html += '<option value="A' + val + '">&ge;&plus;' + val + ' or &le;&minus;' + val + '</option>\n'; // uppercase 'A' here for absolute,  as Any is uppercase a

    //for (var i=0; i<fc_amounts.length; i++)
    //  html += '<option value="+'+fc_amounts[i]+'">&ge; &plus; '+fc_amounts[i]+'</option>\n';

    for (val of fc_amounts)
      html += '<option value="+' + val + '">&ge; &plus;' + val + '</option>\n';


    //for (var i=0; i<fc_amounts.length; i++)
    //  html += '<option value="-'+fc_amounts[i]+'">&le; &minus; '+fc_amounts[i]+'</option>\n';

    for (val of fc_amounts)
      html += '<option value="-' + val + '">&le; &minus;' + val + '</option>\n';

    document.getElementById('fc_more_or_less').style.display = 'none'; // hide the sign select

  } else {

    //for (var i=0; i<fc_amounts.length; i++)
    //  html += '<option value="'+fc_amounts[i]+'">'+fc_amounts[i]+'</option>\n';

    for (val of fc_amounts)
      html += '<option value="' + val + '">' + val + '</option>\n';

    document.getElementById('fc_more_or_less').style.display = '';  // show the sign select
  }

  document.getElementById('fc_amount').innerHTML = html;
}



// Alternative 

function set_fc_amount_options() {
  var i, val, html;

  html = '<optgroup label="Any fold-change ...">' +
    ' <option value="Any" selected>Any fold-change</option>' +
    '</optgroup>\n';

  html += '<optgroup label="fold-change GREATER THAN ... (ie. increased expression)">';
  for (val of fc_amounts)
    html += '<option value="+' + val + '">fold-change &ge; &plus;' + val + '</option>\n';
  /*
   <option value="+0.5">fold-change &ge; &plus;0.5</option>
   <option value="+1.0">fold-change &ge; &plus;1.0</option>
   <option value="+1.5">fold-change &ge; &plus;1.5</option>
   <option value="+2.0">fold-change &ge; &plus;2.0</option>
   <option value="+3.0">fold-change &ge; &plus;3.0</option>
   <option value="+4.0">fold-change &ge; &plus;4.0</option>
   <option value="+5.0">fold-change &ge; &plus;5.0</option>
  */
  html += '</optgroup>\n';

  html += '<optgroup label="fold-change LESS THAN ... (ie. reduced expression)">\n';

  for (val of fc_amounts)
    html += '<option value="-' + val + '">fold-change &le; &minus;' + val + '</option>\n';
  /*
   <option value="-0.5">fold-change &le; &minus;0.5</option> 
   <option value="-1.0">fold-change &le; &minus;1.0</option>
   <option value="-1.5">fold-change &le; &minus;1.5</option>
   <option value="-2.0">fold-change &le; &minus;2.0</option>
   <option value="-3.0">fold-change &le; &minus;3.0</option>
   <option value="-4.0">fold-change &le; &minus;4.0</option>
   <option value="-5.0">fold-change &le; &minus;5.0</option>
  */
  html += '</optgroup>\n';

  html += '<optgroup label="Absolute(fold-change) .... (so ignore sign - ie. increased OR decreased expression)">\n';
  for (val of fc_amounts)
    html += '<option value="A' + val + '">Absolute(fold-change) &ge; ' + val + ' (ie. &ge;&plus;' + val + ' or &le;&minus;' + val + ')</option>\n'; // uppercase 'A' here for absolute > ...,  but Any is uppercase a
  /*
   <option value="A0.5">Absolute(fold-change) &ge; 0.5 (ie. &ge; &plus;0.5 OR &le; &minus;0.5)</option>
   <option value="A1.0">Absolute(fold-change) &ge; 1.0 (ie. &ge; &plus;1.0 OR &le; &minus;1.0)</option>
   <option value="A1.5">Absolute(fold-change) &ge; 1.5 (ie. &ge; &plus;1.5 OR &le; &minus;1.5)</option>
   <option value="A2.0">Absolute(fold-change) &ge; 2.0 (ie. &ge; &plus;2.0 OR &le; &minus;2.0)</option>
   <option value="A3.0">Absolute(fold-change) &ge; 3.0 (ie. &ge; &plus;3.0 OR &le; &minus;3.0)</option>
   <option value="A4.0">Absolute(fold-change) &ge; 4.0 (ie. &ge; &plus;4.0 OR &le; &minus;4.0)</option>
   <option value="A5.0">Absolute(fold-change) &ge; 5.0 (ie. &ge; &plus;5.0 OR &le; &minus;5.0)</option>
  */
  html += '</optgroup>\n';

  html += '<optgroup label="Absolute(fold-change) is SMALL or zero ...">\n';
  for (val of [0.5, 0.3, 0.1, 0.01])
    html += '<option value="a' + val + '">Absolute(fold-change) &le; ' + val + ' (ie. &le;&plus;' + val + ' AND &ge;&minus;' + val + ')</option>\n'; // lowercase 'a' here for absolute < ...,  but Any is uppercase a

  /*
   <option value="a0.5">Absolute(fold-change) &le; 0.5 (ie. &le; &plus;0.5 AND &ge; &minus;0.5)</option>
   <option value="a0.3">Absolute(fold-change) &le; 0.3 (ie. &le; &plus;0.3 AND &ge; &minus;0.3)</option>
   <option value="a0.1">Absolute(fold-change) &le; 0.1 (ie. &le; &plus;0.1 AND &ge; &minus;0.1)</option>
   <option value="a0.01">Absolute(fold-change) &le; 0.01 (ie. &le; &plus;0.01 AND &ge; &minus;0.01)</option>
  */
  html += '</optgroup>\n';

  document.getElementById('fc_amount').innerHTML = html;
  document.getElementById('venn_fc_threshold').innerHTML = html;
}


function set_pvalue_menu_options() {
  var html = '<option value="Any">Any p-value/FDR/q-value</option>\n' +
    '<option value="0.5">&le; 0.5</option>\n' +
    '<option value="0.1">&le; 0.1</option>\n' +
    '<option value="0.05">&le; 0.05</option>\n' +
    '<option value="0.01">&le; 0.01</option>\n' +
    '<option value="0.005">&le; 0.005</option>\n' +
    '<option value="0.001">&le; 0.001</option>\n' +
    '<option value="0.001">&le; 0.0005</option>\n';

  document.getElementById('pvalue_less_than').innerHTML = html;
  document.getElementById('pvalue_less_than').value = '0.5';

  document.getElementById('venn_pvalue').innerHTML = html;
  document.getElementById('venn_pvalue').value = 'Any';
}


function show_pvalue_select_on_filter(show) {
  document.getElementById("pvalue_less_than_label").style.display = document.getElementById("pvalue_less_than").style.display = document.getElementById("p_show_all_pvalues_in_row").style.display = show ? '' : 'none';
  document.getElementById("pvalue_less_than_message").innerHTML = show ? '' : 'Cannot filter on p-value as the Input data has no p-value/FDR/q-value columns defined, which is okay.';
}


function hide_show_celltype_times_checkboxes() {
  var fc_amount = document.getElementById('fc_amount').value,
    pv_less_than = document.getElementById('pvalue_less_than').value;
  document.getElementById('fc_separate_celltype_times_checkboxes_fieldset').style.display = (fc_amount === 'Any' && pv_less_than === 'Any') ? 'none' : '';
}




function fc_amount_changed() {
  hide_show_celltype_times_checkboxes();

  // hide_show_all_pvalues_in_row();
  hide_show_all_pvalues();
  //  document.getElementById("p_show_all_foldchanges_in_row").style.display =  document.getElementById("fc_amount").value === 'Any' ? 'none' : '';
  show_heatmap();
}

function pvalue_less_than_changed() {
  hide_show_all_pvalues();
  hide_show_celltype_times_checkboxes();
  show_heatmap();
}


/*
Not used:
function clickCheckbox(id_cb) {
  document.getElementById(id_cb).click();
}
*/

function set_fc_in_celltype_options() {
  var html = '<option value="Any" selected>Any</option>\n<option value="All">All</option>', val;
  //  for (var i=0; i<celltypes.length; i++) 
  //    html += '<option value="'+celltypes[i]+'">'+celltypes[i]+'</option>\n';

  for (val of celltypes)
    html += '<option value="' + val + '">' + val + '</option>\n';

  var e = document.getElementById('fc_in_celltype');
  e.innerHTML = html;
  e.size = celltypes.length + 2; // +2 for All and Any
}



function set_fc_at_time_options() {
  var html = '<option value="Any" selected>Any</option>\n<option value="All">All</option>', val;

  //  for (var i=0; i<times.length; i++)
  //    html += '<option value="'+times[i]+'">'+times[i]+'</option>\n';
  for (val of times)
    html += '<option value="' + val + '">' + val + '</option>\n';

  // eg: <option value="EARLY">EARLY</option>

  var e = document.getElementById('fc_at_time');
  e.innerHTML = html;
  e.size = times.length + 1; // +2 for All and Any
}



function checkIntermediateBoxes(id_prefix, cb1, cb2) {
  var i1 = Number(cb1.id.substring(id_prefix.length)),
    i2 = Number(cb2.id.substring(id_prefix.length));
  if (i1 > i2) { var temp = i1; i1 = i2; i2 = temp; } // sawp first and second order. 
  for (var i = i1 + 1; i < i2; i++) { // correctly i1 +1 to < i2
    var cb = document.getElementById(id_prefix + i);
    cb.checked = cb1.checked;
    cb.indeterminate = false;
  }
  cb2.checked = cb1.checked; // correctly using i<i2 above then setting cb2 separately here as when cb1 (clicked first) is below cb2 in checkbox list.
}

function enable_all_none_checkbox_buttons(checkboxes_name) {
  var all_none_checked = all_or_none_CheckboxChecked(checkboxes_name);
  //alert("enable_all_none_checkbox_buttons(): "+checkboxes_name+'_all_button  all_none_checked='+all_none_checked);
  document.getElementById(checkboxes_name + '_all_button').disabled = all_none_checked === 'all';
  document.getElementById(checkboxes_name + '_none_button').disabled = all_none_checked === 'none';
}


var celltype_lastChecked;
function fc_in_celltype_checkbox_clicked(this_cb, event) {
  event.stopPropagation(); // To enable clicking on the table cell and on checkbox this is needed. Also to prevent the label propagating to cell the label has inline onclick="event.stopPropagation();"
  // event.stopImmediatePropagation();
  // alert("celltype_checkbox_clicked() cb="+this_cb);
  if (typeof this_cb === 'string') { this_cb = document.getElementById(this_cb); this_cb.checked = !this_cb.checked; } // As on clicking the table cell I send the cb id string. 
  if (event.shiftKey && this_cb != celltype_lastChecked) {
    checkIntermediateBoxes('fc_in_celltype_cb_', celltype_lastChecked, this_cb);
  }
  celltype_lastChecked = this_cb;
  enable_all_none_checkbox_buttons('fc_in_celltype_checkboxes');
  set_head_checkboxes_to_match_celltype_time_checkboxes();
  show_heatmap();
  // return false; false would prevent the checkbox checked stae changing.
}

var time_lastChecked;
function fc_at_time_checkbox_clicked(this_cb, event) {
  event.stopPropagation(); // To enable clicking on the table cell and on checkbox this is needed. Also to prevent the label propagating to cell the label has inline onclick="event.stopPropagation();"
  // event.stopImmediatePropagation();
  // alert("time_checkbox_clicked() cb="+this_cb);

  // "Say you have multiple events on the same element. If you use event.stopPropagation(), sure it will stop any parent events from firing. But if you have multiple events on the same element, they will still all fire.
  // To prevent other events on the same element from firing, use event.stopImmediatePropagation() instead. It will stop both parents and the same element events from firing.
  // If you are in a situation where event.stopPropagation() doesn’t work for you, try event.stopImmediatePropagation() instead.
  if (typeof this_cb === 'string') { this_cb = document.getElementById(this_cb); this_cb.checked = !this_cb.checked; } // As on clicking the table cell I send the cb id string. 
  if (event.shiftKey && this_cb != time_lastChecked) {
    checkIntermediateBoxes('fc_at_time_cb_', time_lastChecked, this_cb);
  }
  time_lastChecked = this_cb;
  enable_all_none_checkbox_buttons('fc_at_time_checkboxes');
  set_head_checkboxes_to_match_celltype_time_checkboxes();
  /*
  var fc_in_celltypes = getSelectedCheckboxValues('fc_in_celltype_checkboxes'), // WAS: getSelectedValues( document.getElementById('fc_in_celltype') ),
      fc_at_times     = getSelectedCheckboxValues('fc_at_time_checkboxes'),     // WAS: getSelectedValues( document.getElementById('fc_at_time') ),
      fc_in_celltype_and_time = getSelectedCheckboxValues('fc_in_celltype_and_time_checkboxes'), // <-- this is numbers (the indexes of the head1[] array) as strings. Added 19 Aug 2023.
      k = fc_in_celltypes_and_times_to_head_index_array(fc_in_celltypes, fc_at_times); // 19 Aug 2023
  console.log("fc_at_time_checkbox_clicked()  fc_in_celltypes:", fc_in_celltypes, "  fc_at_times:",fc_at_times, "  k:",k, "  fc_in_celltype_and_time:",fc_in_celltype_and_time);
  */
  show_heatmap();
  // return false; // if I used onclick="return fc_at_time_checkbox_clicked(this,event);">' (ie. onclick="return...", then returning false would prevent the checkbox checked stae changing.
}

function set_fc_in_celltype_checkboxes() {
  var html = '';
  for (var j = 0; j < celltypes.length; j++) { // j correctly starts at zero here.  Default td padding is padding: 5px 10px;
    html += ' <tr><td style="text-align:left; border-radius:0; padding: 3px 5px;" onclick="fc_in_celltype_checkbox_clicked( \'fc_in_celltype_cb_' + j + '\',event);">\n' +
      '  <input type="checkbox" id="fc_in_celltype_cb_' + j + '" name="fc_in_celltype_checkboxes" value="' + celltypes[j] + '" checked onclick="fc_in_celltype_checkbox_clicked(this,event);">' +
      '<label for="fc_in_celltype_cb_' + j + '" onclick="event.stopPropagation();" style="user-select:none; cursor:pointer;">' + celltypes[j] + '</label>' +
      ' </td></tr>\n';
  }
  document.getElementById('celltypes_tbody').innerHTML = html;
  enable_all_none_checkbox_buttons('fc_in_celltype_checkboxes');
}

function set_fc_at_time_checkboxes() {
  var html = '';
  for (var j = 0; j < times.length; j++) { // j correctly starts at zero here.  Default td padding is padding: 5px 10px;
    html += ' <tr><td style="text-align:left; border-radius:0; padding: 3px 5px;" onclick="fc_at_time_checkbox_clicked( \'fc_at_time_cb_' + j + '\', event);">\n' +
      '  <input type="checkbox" id="fc_at_time_cb_' + j + '" name="fc_at_time_checkboxes" value="' + times[j] + '" checked onclick="fc_at_time_checkbox_clicked(this,event);">' +
      '<label for="fc_at_time_cb_' + j + '" onclick="event.stopPropagation();" style="user-select:none; cursor:pointer;">' + times[j] + '</label>\n' +
      ' </td></tr>\n';
  }
  document.getElementById('times_tbody').innerHTML = html;
  enable_all_none_checkbox_buttons('fc_at_time_checkboxes');
}


function set_celltype_time_checkboxes_to_match_head_checkboxes() {
  // There's probably an shorter way to do this:

  // 'i'; // for indeterminate.
  // 'c'; // for checked.
  // 'n'; // for not checked.

  // Using these arrays as dict with empty head2 key could cause a problem.
  var celltypes_checked = new Array(celltypes.length),
    times_checked = new Array(times.length);

  for (var j = 1; j < head1.length; j++) { // correctly j=1 as head starts at 'Gene' at j=0
    var elem = document.getElementById('fc_in_celltype_and_time_cb_' + j),
      checked = elem.checked ? 'c' : 'n',
      pos1 = celltypes.indexOf(head1[j]),
      pos2 = times.indexOf(head2[j]);

    //console.log("checked:",checked,"  pos1:",pos1," pos2:",pos2,"  celltypes_checked[pos1]=",celltypes_checked[pos1], "  times_checked[pos2]=",times_checked[pos2]);

    // if (head1[j]+' : '+head2[j] !== elem.text) {alert("ERROR: Mismatch j="+j+" : head1[j]+' : '+head2[j]="+head1[j]+' : '+head2[j]+"  !==  elem.text="+elem.text); return false;}

    if (elem.value !== j.toString()) { alert("ERROR: Mismatch j=" + j + "  !==  elem.value=" + elem.value); return false; }

    if (pos1 === -1 || pos2 === -1) { alert("ERROR: pos1 === -1 || pos2 === -1"); return false; }

    if (typeof celltypes_checked[pos1] === 'undefined') celltypes_checked[pos1] = checked;
    else if (celltypes_checked[pos1] !== checked && celltypes_checked[pos1] !== 'i') celltypes_checked[pos1] = 'i'; // for indeterminate.

    if (typeof times_checked[pos2] === 'undefined') times_checked[pos2] = checked;
    else if (times_checked[pos2] !== checked && times_checked[pos2] !== 'i') times_checked[pos2] = 'i'; // for indeterminate.
  }
  //console.log("celltypes:",celltypes," celltypes_checked:",celltypes_checked);
  //console.log("times:",times," times_checked:",times_checked);

  // Now set the celltypes checkboxes to match: 
  for (j = 0; j < celltypes.length; j++) { // correctly j=0
    elem = document.getElementById('fc_in_celltype_cb_' + j);
    if (celltypes[j] !== elem.value) { alert("ERROR: Mismatch j=" + j + " : celltypes[j]=" + celltypes[j] + "  !==  elem.value=" + elem.value); return false; }
    checked = celltypes_checked[j];
    elem.indeterminate = (checked === 'i');
    elem.checked = (checked === 'c'); // if 'i' set to unchecked so clicking will make it checked.   || checked === 'i'); // set indefinite as checked but I could be set to unchecked.
  }

  // Now set the times checkboxes to match: 
  for (j = 0; j < times.length; j++) { // correctly j=0
    elem = document.getElementById('fc_at_time_cb_' + j);
    if (times[j] !== elem.value) { alert("ERROR: Mismatch j=" + j + " : times[j]=" + times[j] + "  !==  elem.value=" + elem.value); return false; }
    checked = times_checked[j];
    elem.indeterminate = (checked === 'i');
    elem.checked = (checked === 'c'); // if 'i' set to unchecked so clicking will make it checked.   || checked === 'i'); // set indefinite as checked but I could be set to unchecked.
  }

  enable_all_none_checkbox_buttons('fc_in_celltype_checkboxes');
  enable_all_none_checkbox_buttons('fc_at_time_checkboxes');

  return true;
}


function set_head_checkboxes_to_match_celltype_time_checkboxes() {
  // This is the reverse of the above.

  for (var j = 1; j < head1.length; j++) { // correctly j=1 as head starts at 'Gene' at j=0
    var pos1 = celltypes.indexOf(head1[j]),
      pos2 = times.indexOf(head2[j]);

    if (pos1 === -1 || pos2 === -1) { alert("ERROR: pos1 === -1 || pos2 === -1"); return false; }

    var celltype_elem = document.getElementById('fc_in_celltype_cb_' + pos1),
      time_elem = document.getElementById('fc_at_time_cb_' + pos2);

    if (celltype_elem.indeterminate || time_elem.indeterminate) continue; // as we don't if elem should checked or unchecked.

    var elem = document.getElementById('fc_in_celltype_and_time_cb_' + j),
      checked = celltype_elem.checked && time_elem.checked; // both the celltype and time need to be checked.

    if (elem.value !== j.toString()) { alert("ERROR: Mismatch j=" + j + "  !==  elem.value=" + elem.value); return false; }

    if (elem.checked !== checked) elem.checked = checked;
  }

  enable_all_none_checkbox_buttons('fc_in_celltype_and_time_checkboxes');

  return true;
}



// checkbox_elem1.indeterminate = true;  // can set this indeterminate property via JavaScript (it cannot be set using an HTML attribute):





var celltype_and_time_lastChecked;
function fc_in_celltype_and_time_checkbox_clicked(this_cb, event) {
  event.stopPropagation(); // To enable clicking on the table cell and on checkbox this is needed. Also to prevent the label propagating to cell the label has inline onclick="event.stopPropagation();"
  // event.stopImmediatePropagation();
  if (typeof this_cb === 'string') { this_cb = document.getElementById(this_cb); this_cb.checked = !this_cb.checked; } // As on clicking the table cell I send the cb id string. 
  // If you are in a situation where event.stopPropagation()doesn’t work for you, try event.stopImmediatePropagation()instead.
  if (event.shiftKey && this_cb != celltype_and_time_lastChecked) {
    checkIntermediateBoxes('fc_in_celltype_and_time_cb_', celltype_and_time_lastChecked, this_cb);
  }
  celltype_and_time_lastChecked = this_cb;
  enable_all_none_checkbox_buttons('fc_in_celltype_and_time_checkboxes');
  set_celltype_time_checkboxes_to_match_head_checkboxes();
  show_heatmap();
  // return false; false would prevent the checkbox checked stae changing.
}

function set_fc_in_celltype_and_time_checkboxes() {
  var html = "";
  for (var j = 1; j < head1.length; j++) {
    // <tr><td ... onclick="fc_in_celltype_and_time_checkbox_clicked(\'fc_in_celltype_and_time_cb_'+j+'\') 
    html += ' <input type="checkbox" id="fc_in_celltype_and_time_cb_' + j + '" name="fc_in_celltype_and_time_checkboxes" value="' + j + '" checked onclick="fc_in_celltype_and_time_checkbox_clicked(this,event);">' +
      '<label for="fc_in_celltype_and_time_cb_' + j + '" onclick="event.stopPropagation();" style="user-select:none; cursor:pointer;">' + head1[j] + ' : ' + head2[j] + '</label><br>\n';

  }  // or should I use 'onchange=' instead of onclick=...
  document.getElementById("fc_in_celltype_and_time_checkboxes_td").innerHTML = html;
  enable_all_none_checkbox_buttons('fc_in_celltype_and_time_checkboxes');
}



/*
OLD:
function set_min_num_fc_for_gene2_options() {

  var html = '<optgroup id="noneOptGroup" label="No columns...">\n' +
             ' <option value="none" selected>No column</option>\n';

  html += '<optgroup id="anyOptGroup" label="Any columns...">\n' +
          ' <option value="any1" selected>Any 1 column</option>\n';
  for (var j=2; j<head1.length-1; j++) html += ' <option value="any'+j+'">Any '+j+' columns</option>\n'; // eg: <option value="any2">Any 2 columns</option>
  html += '</optgroup>\n';
  // head1[0] is Gene column.
  // j<head1.length-1 as j<=head1.length-1 would give ALL columns which is ALL columns below.

  html += '<optgroup id="allOptGroup" label="All columns:">\n' + 
          ' <option value="all">ALL '+(head1.length-1)+' columns</option>\n' +
          '</optgroup>\n';

  html += '<optgroup id="anySelectedOptGroup" label="Selected column(s)...">\n' +
          ' <option value="selectedAny1">Any 1 of the column(s) that I select (eg: column2 OR column3 OR column4)</option>\n';
  for (var j=2; j<head1.length-1; j++) html += ' <option value="selectedAny'+j+'">Any '+j+' of the column(s) that I select (eg: [column2 AND column3] OR [column2 AND column4] ...)</option>\n'; // eg: <option value="selectedAny2">Any 2 of the column(s) that I select (eg: column2 AND column3)</option>
  // head1[0] is Gene column.
  // j<head1.length-1 as j<=head1.length-1 would give ALL columns which is ALL columns below.
  html += '</optgroup>\n';
  
  // <option value="selectedAny2">Any 2 of the column(s) that I select (eg: column2 AND column3)</option>
  // <option value="selectedAny3">Any 3 of the column(s) that I select (eg: column2 AND column3 AND column4)</option>

  html += '<optgroup id="allSelectedOptGroup" label="All Selected column(s)...">\n' +
          ' <option value="selectedAll">ALL of the column(s) that I select (eg: column2 AND column3 AND column4 ....)</option>\n' + // '+(head1.length-1)+
          '</optgroup>\n';

  var e = document.getElementById('min_num_fc_for_gene2');
  e.innerHTML = html;
}
*/



function set_min_num_fc_for_gene2_options() {

  var html = ' <option value="any1" selected>Any 1 column of my selected \'Heatmap columns\' below</option>\n';

  for (var j = 2; j < head1.length - 1; j++) html += ' <option value="any' + j + '">Any ' + j + ' columns of my selected \'Heatmap columns\' below</option>\n'; // eg: <option value="any2">Any 2 columns</option>
  // head1[0] is Gene column.
  // j<head1.length-1 as j<=head1.length-1 would give ALL columns which is ALL columns below.

  html += ' <option value="all">ALL my selected \'Heatmap columns\' below</option>\n'; // '+(head1.length-1)+'

  var e = document.getElementById('min_num_fc_for_gene2');
  e.innerHTML = html;
}


function show_celltype_times_checkboxes_fieldset(single_or_separate) {
  document.getElementById('fc_single_celltype_times_checkboxes_fieldset').style.display = single_or_separate === 'single' ? '' : 'none';
  document.getElementById('fc_separate_celltype_times_checkboxes_fieldset').style.display = single_or_separate !== 'single' ? '' : 'none'; // to show.

  document.getElementById('show_fc_single_celltype_times_checkboxes_fieldset_button').style.display = single_or_separate !== 'single' ? '' : 'none';
  document.getElementById('show_fc_separate_celltype_times_checkboxes_fieldset_button').style.display = single_or_separate === 'single' ? '' : 'none';
}



function set_filter_menu_options() {

  console.log("set_filter_menu_options():", celltypes, times);

  //alert("set_filter_menu_options");

  set_fc_amount_options();
  set_pvalue_menu_options(); // <-- This sets: venn_pvalue.value = "Any"; and:  pvalue_less_than.value = "0.5"; to reduce time to first display the heatmap.

  show_pvalue_select_on_filter(logpvs.length > 1 && has_pvalues_columns); // probably just need to test logpvs.length > 1 without the has_pvalues_columns.
  set_fc_in_celltype_options();
  set_fc_at_time_options();
  set_fc_in_celltype_and_time_checkboxes();
  set_fc_in_celltype_checkboxes();
  set_fc_at_time_checkboxes();

  // show_celltype_times_checkboxes_fieldset('separate'); // Not needed now as showing both together.

  set_min_num_fc_for_gene2_options();

  console.log("set_filter_menu_options():", "C");

  var pvalue_disabled, pvalue_msg;

  if (logpvs !== null && logpvs.length > 1) { // as logpvs will always have one heading row.
    pvalue_disabled = false;
    pvalue_msg = " for the fold-change(s)"; // msg_elem.innerHTML = " for at least one <i>p</i>-value in the row.";
  }
  else {
    pvalue_disabled = true;
    pvalue_msg = " No <i>p</i>-values were read from file(s) for this data.";
  }

  document.getElementById("pvalue_less_than").disabled = document.getElementById("venn_pvalue").disabled = pvalue_disabled;
  document.getElementById("pvalue_less_than_message").innerHTML = pvalue_msg;

  document.getElementById("logsort_select").value = 'none';

  hide_show_all_pvalues();

  console.log("set_filter_menu_options():", "finished");
}


function hide_show_all_pvalues() {
  var hide = (document.getElementById("pvalue_less_than").value === "Any" && document.getElementById("fc_amount").value === 'Any');
  document.getElementById("p_show_all_pvalues_in_row").style.display = hide ? 'none' : '';
}



function show_hide_pct12_columns_checkbox(show) {
  // Called after the dat ahs been read from input files, so has_pct12_columns is set.
  document.getElementById("p_show_pct12_values").style.display = show && has_pct12_columns ? '' : 'none';
  if (!show) document.getElementById("show_pct12_values").checked = false; // Don't change to false when showing after updating the heatmap table, only when hiding.
}

function show_hide_pvalue_columns_checkbox(show) {
  // Called after the dat ahs been read from input files, so has_pct12_columns is set.
  document.getElementById("p_show_pvalues").style.display = show && has_pvalues_columns ? '' : 'none';
  if (!show) document.getElementById("show_pvalues").checked = has_pvalues_columns; // Don't change to false when showing after updating the heatmap table, only when hiding.
}


//function show_sort_order_checkbox(show) {
//  document.getElementById("p_show_sort_order").style.display = show && has_pvalues_columns ? '' : 'none';  
//}

function show_hide_download_single_data_file_link(show) {
  document.getElementById('download_single_data_file_link_p').style.display = show ? '' : 'none';
}


function show_tool_tables(show) {
  var display = show ? '' : 'none';

  document.getElementById('filter_heatmap_table').style.display = display; // To show the filtering box.
  document.getElementById('display_options_table').style.display = display;
  /*
  document.getElementById('selected_genes_table').style.display = display; // To show the selected genes box.
  document.getElementById('copy_selected_genes_table').style.display = display; 
  document.getElementById('stringdb_table').style.display = display; // To show the top of the stringdb table.
  document.getElementById('gprofiler_table').style.display = display; 
  document.getElementById('david_table').style.display = display; 
  document.getElementById('heatmap_image_table').style.display = display;    
  */

  var tool_tables = document.getElementsByClassName("tool_table");
  // console.log("tool_tables:",tool_tables);

  for (var i = 0; i < tool_tables.length; i++) {
    if (tool_tables[i].id !== "feedback_table")
      tool_tables[i].style.display = display;
  }
  //  OR:  for (var val of tool_tables)
  //     tool_tables[i].style.display = display;
  // BUT is val a copy or pont to the original?

  document.getElementById('filter_heatmap_table_instructions').style.display = display;

  clear_and_shrink_canvas();
  clear_heatmap_show_image_size();
  show_hide_pvalue_columns_checkbox(show);
  show_hide_pct12_columns_checkbox(show);
}


var timer1 = null;


function show_heatmap_with_column_names_and_types() {
  //alert("show_heatmap_with_column_names_and_types(): num_files="+num_files);

  if (num_files === 1) { if (!parse_single_non_hive_file_after_column_headings_assigned()) return false; }

  else if (!parse_multiple_files_after_column_headings_assigned()) { return false; }

  disable_heatmap_with_column_names_and_types_button(true);

  // Not resetting sort order here: sort_data(null);

  show_heatmap();
  // disable_heatmap_with_column_names_and_types_button(false); // is reenabled in the timeout of show_heatmap() 

  set_select_ids_species_columns_tab_color('');  // to reset tab to normal color.
}



function disable_heatmap_with_column_names_and_types_button(disable) {
  document.getElementById("show_heatmap_with_column_names_and_types_button").disabled = disable;
}


function show_heatmap() {
  if (timer1) { clearTimeout(timer1); timer1 = null; }

  selected_gene_list = []; // to clear the list.

  filtered_row_list = []; // to clear the list.

  //alert("show_heatmap 1");
  enable_stringdb_buttons(true); // so disabled is true here as no genes selected.
  //alert("show_heatmap 2");

  enable_gprofiler_button();
  enable_david_button();
  enable_copy_genelist_buttons();

  show_selected_genes(); // to clear the displayed list.
  remove_stringdb_image();

  show_filter_heatmap_message("<b><i>Updating heatmap ...</i></b>", 'green');

  show_display_options_message("<b><i>Updating heatmap ...</i></b>", 'green');


  // Using this setTimeout so that the above message is displayed, before running the following. Works in Chrome, but doesn't work in Firefox.
  // The setTimeout() method calls a function after a number of milliseconds.
  timer1 = setTimeout(function () {
    if (!show_heatmap_thead()) { disable_heatmap_with_column_names_and_types_button(false); console.log("ERROR: Failed to show_heatmap_thead();"); return false; } // Need to redraw the thead here as otherwise it appears with some cell borders white.
    if (!show_heatmap_tbody()) { disable_heatmap_with_column_names_and_types_button(false); console.log("ERROR: Failed to show_heatmap_tbody();"); return false; }

    show_tool_tables(true);

    // show_hide_table_row('input_data_parameters',false); // false to hide table as finished with it now
    enable_sjb_tab(3, 10, true); // To enable tabs 3 to 10: - for non-HIVE files, not showing Display options until here after user sets column names & types and heatmap. 
    // 3 = 'Display options' tab.  
    // 4 = 'UpSet/Venn' tab.
    // 5 = 'Filter rows' tab.
    // 6 = 'Selected genes' tab.
    // 7 = 'g:Profiler' tab.
    // 8 = 'STRING' tab.
    // 9 = 'DAVID' tab.
    // 10 = 'Heatmap image' tab.


    //alert("show_heatmap(): E");  

    //show_num_filtered_rows(...); // is called in show_heatmap_thead() above

    show_validate_input_data_parameters_message('<b>The heatmap is displayed below</b>.', 'green'); // don't add the +tab_instructions here as +tab_instructions is displayed in 'loading_heatmap_message' just below this.
    // show_validate_input_data_parameters_message('<b>Column headings and data were read okay.</b>.', 'green'); // don't add the +tab_instructions here as +tab_instructions is displayed in 'loading_heatmap_message' just below this.

    timer1 = null;
    //alert("show_heatmap(): F");  
  }, 10); // end of the setTimeout(

}


function show_heatmap_thead() {
  // 'cols' is array of: ["Amacrine:EARLY", "....", .... ]  
  var html1 = '', html2 = ''; // top row of celltypes with colspan 3, then second row of times:EARLY/MID/LATE
  // var colspan = 0;

  /*
  for (var i=0; i<celltypes.length; i++) { // The first in the array is no-longer "Gene" here, but is stil genename in the logfcs array.
    if (html1 != '') html1 += '</th>';
    html1 += '<th colspan="3" style="border-bottom: 0; border-left: 2px solid black; border-right: 2px solid black;">' + celltypes[i].replace('_',' '); // so FINE number goes on second line to fit more into width of browser.

    for (var t=0; t<times.length; t++) { 
      //console.log(celltypes[i]+':'+times[t]);
      var style = (t==0) ? ' border-left: 2px solid black;' : ''; // not border-right: 2px solid black; here.
      //if (missing.indexOf(celltypes[i]+':'+times[t]) != -1) alert("Found missing: "+celltypes[i]+':'+times[t]);
      style += (missing.indexOf(celltypes[i]+':'+times[t]) != -1) ? ' color:#a0a0a0;' : ''; // gray M for eg: "Amacrine_10:MID"
      if (times[t]=='EARLY') style += ' font-size:90%;'; // so columns are similar widths.
      html2 += '<th style="border-top: 0;'+style+'">'+times[t]+'</th>';
    }
  }
  */

  // I could use this same logic to draw the header row in heatmap image download:
  var head1_last = null, head1_colspan, head2_style;
  if (head1.length != head2.length) { alert("show_heatmap_thead(): head1.length != head2.length"); show_reading_and_loading_messages("head1.length != head2.length", 'red'); return false; } // shouldn't ever happen anyway.

  // for (var i=1; i<head1.length; i++) console.log("i=",i,"  head1=",head1[i],"  head2=",head2[i]);


  for (var i = 1; i <= head1.length; i++) { // The first in the array is "Gene" here, but is still genename in the logfcs array.
    // Note the 'i<=' is to be sure to use the final head1_last column, then calls break before access head1[i]
    // for (var val of head1) { // The first in the array is "Gene" here, but is still genename in the logfcs array.

    if (i == head1.length || head1[i] !== head1_last) {
      if (head1_last !== null) html1 += '<th colspan="' + head1_colspan + '" style="border-bottom: 0; border-left: 2px solid black; border-right: 2px solid black;">' + head1_last + '</th>'; // so FINE number goes on second line to fit more into width of browser.
      if (i == head1.length) break;
      head1_last = head1[i]; // to use for the next heading cell.
      head1_colspan = 1;

      head2_style = ' border-left: 2px solid black;'; // not border-right: 2px solid black; here.            
    } else {
      head1_colspan++;
      head2_style = '';
    }
    // if (missing.indexOf(celltypes[i]+':'+times[t]) != -1) alert("Found missing: "+celltypes[i]+':'+times[t]);
    // head2_style += (missing.indexOf(celltypes[i]+':'+times[t]) != -1) ? ' color:#a0a0a0;' : ''; // gray M for eg: "Amacrine_10:MID"

    if ((i + 1) >= head1.length || head1[i] !== head1[i + 1]) head2_style += ' border-right: 2px solid black;'; // not border-right: 2px solid black; here.

    if (num_fc_in_cols[i] == 0) head2_style += ' color:#a0a0a0;'; // gray M for eg: "Amacrine_10:MID"
    if (head2[i].length > 3) head2_style += ' font-size:85%;'; // so columns are similar widths, eg: 'EARLY'.

    html2 += '<th style="border-top: 0;' + head2_style + '">' + head2[i] + '</th>';
  }

  var select_all_none_buttons = '<button onclick="select_genes(\'all\');">All</button><br><button onclick="select_genes(\'none\');">None</button>';
  document.getElementById('heatmap_thead').innerHTML = '<tr><th rowspan="2">' + select_all_none_buttons + '</th><th rowspan="2"><label id="genename_or_protein_heading" for="filter_genes_input_text">' + head1[0] + '</label> <span id="genename_filtering_progress" style="font-size:75%;"></span><br><input type="search" id="filter_genes_input_text" size="12" oninput="filter_genes_by_name();"></th>' + html1 + '<th rowspan="2" style="border-left: 2px solid black;">' + head1[0] + '</th></tr>\n<tr>' + html2 + '</tr>'; // head1[0] will be 'Gene' or 'Genename'

  return true;
}



function getSelectedValues(selectElem) {
  var options = selectElem.options, result = [];

  for (var i = 0; i < options.length; i++) {
    if (options[i].selected) result.push(options[i].value);
  }
  // Note that when there is no value attribute, then opt.value = opt.text.
  return result;

  // Or use the newer selectedOptions:
  // return Array.from(selectElem.selectedOptions).map(({ value }) => value);
}


function getSelectedCheckboxValues(checkboxesName) {
  var checkboxes = document.getElementsByName(checkboxesName), result = [];
  // or: var checkboxes = document.querySelectorAll('input[name="'+checkboxesName+'"]:checked'); // querySelectorAll() returns a NodeList 
  // for (var i=0; i<checkboxes.length; i++) result.push(checkboxes[i].value);
  // for (var cb of checkboxes.values()) result.push(cb.value);
  // for (var cb of checkboxes) result.push(cb.value);

  for (var i = 0; i < checkboxes.length; i++) {
    if (checkboxes[i].checked) result.push(checkboxes[i].value);
  }
  // Note that when there is no value attribute, then opt.value = opt.text.
  return result;

  // Or use the newer selectedOptions:
  // return Array.from(selectElem.selectedOptions).map(({ value }) => value);
}

function numCheckboxChecked(checkboxesName) {
  var checkboxes = document.getElementsByName(checkboxesName), count = 0;
  // return document.querySelectorAll('input[name="'+checkboxesName+'"]:checked').length; // querySelectorAll() returns a NodeList 

  for (var i = 0; i < checkboxes.length; i++) if (checkboxes[i].checked) count++;

  // Note that when there is no value attribute, then opt.value = opt.text.
  return count;
}

function all_or_none_CheckboxChecked(checkboxesName) {
  var checkboxes = document.getElementsByName(checkboxesName), count = 0;
  for (var i = 0; i < checkboxes.length; i++) if (checkboxes[i].checked) count++;
  if (count === 0) return 'none';
  if (count === checkboxes.length) return 'all';
  return count; // is int.
}


/*
Ripb1 - good marker for the cluster of 
Too few endothelial cells.
*/

function set_gene_link(this_link, genename) {

  var gene_symbol_type = document.getElementById('gene_symbol_type').value; // Not used here for stringdb
  if (gene_symbol_type === "") { alert("Please select the Gene/Protein symbol type using the drop-down menu near the top of this HIVE webpage."); this_link.target = "_self"; this_link.href = "#gene_symbol_type"; return false; }
  // Need to set this_link.target=""; otherwise will open a new empty tab above.

  // eg: 
  // <option value="ENSEMBL_GENE_ID">Ensembl Gene Id (eg: <b>ENS</b><b>G</b>ENSG00000112715 or: ENSMUSG00000023951)</option>
  // <option value="ENSEMBL_TRANSCRIPT_ID">Ensembl Transcript Id (eg: ENS<b>T</b>00000672860.3 or ENSMUST00000142351.9)</option>
  // ENSEMBL_PROTEIN_ID eg: ENSP00000500082.3
  // <option value="ENTREZ_GENE_ID">Entrez Gene Id (eg: 7422)</option>
  // <option value="GENE_SYMBOL" selected>Gene symbol (eg: VEGFA)</option>
  // <option value="UNIPROT_ID">UniProt Protein Id</option>

  // July 2024:
  // <option value="ENSEMBL_GENE_ID">Ensembl Gene Id (eg: ENSG00000112715 or: ENSMUSG00000023951)</option>
  // <option value="ENSEMBL_TRANSCRIPT_ID">Ensembl Transcript Id (eg: ENST00000672860.3 or ENSMUST00000142351.9)</option>
  // <option value="ENTREZ_GENE_ID">Entrez Gene Id (eg: 7422)</option>
  // <option value="GENE_SYMBOL" selected>Gene symbol (eg: VEGFA)</option>
  // <option value="TRANSCRIPT_SYMBOL">Transcript symbol (eg: ISG15-203)</option>  
  // <option value="ENSEMBL_PROTEIN_ID">Ensembl Protein Id (eg: ENSP00000500082.3 or ENSMUSP00000115883.3)</option>
  // <option value="UNIPROT_ID">UniProt Protein Id (eg: P15692 or or Q99PS1)</option>


  // https://www.ncbi.nlm.nih.gov/gene?term=(VEGFA%5BGene%20Name%5D)%20AND%2010090%5BTaxonomy%20ID%5D

  // or:  Mus%20musculus[orgn] 

  if (taxid === "") { alert("First: You need to select the Organism/Species using the drop-down menu near top of this HIVE webpage."); this_link.target = "_self"; this_link.href = "#organism_species"; return false; } // false cancel the action.

  var gene_or_protein_url = gene_symbol_type_is_gene_or_protein(); // was: ['ENSEMBL_PROTEIN_ID', 'REFSEQ_PROTEIN', 'UNIPROT_ID'].indexOf(gene_symbol_type) >= 0 ? 'protein' : 'gene'; 

  if (gene_symbol_type === "ENSEMBL_TRANSCRIPT_ID") {
    // var name_type = '[Gene/Protein Name]';
    var pos = genename.indexOf('.'); // To remove the version suffix
    if (pos !== -1) genename = genename.substr(0, pos);
    pos = genename.indexOf(':'); // To remove my position suffix for Nanocompore directRNA data.
    if (pos !== -1) genename = genename.substr(0, pos);
    this_link.href = 'https://www.ncbi.nlm.nih.gov/nuccore?term=' + encodeURIComponent(genename);
    // (refseq is a subset of nuccore)
  }
  else {
    // var name_type = '[Gene Name]';
    var name_type = '[Gene/Protein Name]';

    var pos = genename.indexOf(':'); // To remove my position suffix for Nanocompore directRNA data.
    if (pos !== -1) genename = genename.substr(0, pos);

    if (gene_symbol_type === "TRANSCRIPT_SYMBOL") {
      pos = genename.lastIndexOf('-'); // To remove my position suffix for Nanocompore directRNA data. (eg: ISG15-203)
      if (pos !== -1) genename = genename.substr(0, pos);
    }

    // this_link.href='https://www.ncbi.nlm.nih.gov/'+gene_or_protein_url+'?term=('+encodeURIComponent(genename + name_type +') AND ('+taxid+'[Taxonomy ID])');
    this_link.href = 'https://www.ncbi.nlm.nih.gov//search/all/?term=(' + encodeURIComponent(genename + name_type + ') AND (' + taxid + '[Taxonomy ID])');
  }
  this_link.target = "_blank";

  return true;
}


function disable_all_any_options(select_elem, disable) {
  var options = select_elem.options;
  for (var i = 0; i < options.length; i++) {
    var o = options[i];
    if (o.value === "All" || o.value === "Any") {
      o.disabled = disable;
      if (disable && o.selected) o.selected = false;
    }
  }
}


function select_all_options(select_elem_id, all_or_none) {
  //var options = select_elem.options;
  var options = document.getElementById(select_elem_id).options;
  for (var i = 0; i < options.length; i++) {
    var o = options[i];
    o.selected = all_or_none === 'all' && !o.disabled;
  }
}


function select_all_checkboxes(checkbox_name, all_or_none) {
  //var options = select_elem.options;
  var checkboxes = document.getElementsByName(checkbox_name), // is getElementsByName() NOT getElementById()
    checked = all_or_none === 'all'
  for (var i = 0; i < checkboxes.length; i++) {
    // var o = checkboxes[i];
    checkboxes[i].checked = checked; // && !o.disabled;
    checkboxes[i].indeterminate = false;
  }
  enable_all_none_checkbox_buttons(checkbox_name);

  if (checkbox_name === 'fc_in_celltype_checkboxes' || checkbox_name === 'fc_at_time_checkboxes') set_head_checkboxes_to_match_celltype_time_checkboxes();
  else if (checkbox_name === 'fc_in_celltype_and_time_checkboxes') set_celltype_time_checkboxes_to_match_head_checkboxes();
}


function min_num_fc_for_gene2_changed(this_select) {
  if (!this_select) this_select = document.getElementById("min_num_fc_for_gene2");

  /*
  // Aug 2023: This was for the old select type lists 
  // Not needed as using checkboxes instead of the select lists now:  
    var val = this_select.value,
        celltypes_select = document.getElementById('fc_in_celltype'), // using celltypes_select here (as celltypes is a global array).
        times_select     = document.getElementById('fc_at_time'),     // using times_select here (as times is a global array).
        disable   = false;
  
  //      fc_or_and       = document.getElementById('fc_or_and').value,
  //      pv_less_than    = document.getElementById('pvalue_less_than').value;
    
    // '<option value="Any" selected>Any</option>
  
    celltypes_select.disabled = times_select.disabled = (val === "all" || val.substring(0, 3) === "any"); // || val === "none" ?  
  
    if      (val === "none") {}
    else if (val === "all") {celltypes_select.value = times_select.value = "All"; disable=true;}
    else if (val.substring(0, 3) === "any") {celltypes_select.value = times_select.value = "Any";}
    else if (val.substring(0,11) === "selectedAny") {disable = true;}
    // {if (celltypes_select.value === "All" || celltypes_select.value === "Any") celltypes_select.selectedIndex = -1; if (times_select.value === "All" || times_select.value === "Any") times_select.selectedIndex = -1;}
    else if (val === "selectedAll") {}
    else {alert("Unexpected val="+val); return;}
  
    disable_all_any_options(celltypes_select, disable);
    disable_all_any_options(times_select, disable);
    
  */


  show_heatmap();
}


/*
  (a) Fold changes in at least:
<select id="min_num_fc_for_gene2">
<optgroup id="noneOptGroup" label="No columns...">
 <option value="none" selected>No column</option>

<optgroup id="anyOptGroup" label="Any columns...">
 <option value="any1" selected>Any 1 column</option>
 <option value="any2">Any 2 columns</option>
 <option value="any3">Any 3 columns</option>
</optgroup>

<optgroup id="allOptGroup" label="All columns:">
 <option value="all">ALL columns</option>
</optgroup>

<optgroup id="selectedOptGroup" label="Selected column(s)...">
 <option value="selectedAny1">Any 1 of the column(s) that I select (eg: column2 OR column3 OR column4)</option>
 <option value="selectedAny2">Any 2 of the column(s) that I select (eg: column2 AND column3)</option>
 <option value="selectedAny3">Any 3 of the column(s) that I select (eg: column2 AND column3 AND column4)</option>
 <option value="selectedAll">ALL of the column(s) that I select (eg: column2 AND column3 AND column4 and column5)</option>
</optgroup>
</select>
*/


function fc_in_celltypes_and_times_to_head_index_array(fc_in_celltypes, fc_at_times) {
  var k = []; // indexing positions into the logfc[] row arrays.
  for (var j = 1; j < head1.length; j++) { // Start at 1 as the as the first column in the headings and logfc arrays is the gene name
    if (fc_in_celltypes.indexOf(head1[j]) > -1 && fc_at_times.indexOf(head2[j]) > -1) k.push(j); // Not j+1
  }
  // if (!fc_in_celltypes_Any && fc_in_celltypes.indexOf(head1[j]) == -1) continue;
  // if (!fc_at_times_Any && fc_at_times.indexOf(head2[j]) == -1) continue;
  // k.push(j); // Not j+1
  return k;
}


function show_heatmap_tbody() {
  // alert("In show_heatmap_tbody()");

  if (logsort === null) sort_data(null); // null will set to file input order in logsort array.

  var err = "", fc_more_or_less, fc_amount_Any, fc_more_than, fc_less_than, fc_abs_more_than, fc_abs_less_than,
    fc_amount = document.getElementById('fc_amount').value;

  if (fc_amounts_options_signed) {
    if (fc_amount === 'Any') fc_more_or_less = "Any";
    else {
      var fc_sign = fc_amount[0];
      fc_more_or_less = (fc_sign === '+') ? 'more' : (fc_sign === '-') ? 'less' : (fc_sign === 'A') ? 'absMore' : (fc_sign === 'a') ? 'absLess' : 'unknown';      // Otherwise is 'A' for Absolute value >=
      fc_amount = fc_amount.slice(1); // Skip the starting '+' or '-' or 'A'
    }
  } else {
    fc_more_or_less = document.getElementById('fc_more_or_less').value; // less/
  }

  fc_amount_Any = (fc_amount === 'Any'); // and above: (fc_more_or_less === "Any");
  fc_more_than = (fc_more_or_less === "more");
  fc_less_than = (fc_more_or_less === "less");
  fc_abs_more_than = (fc_more_or_less === "absMore");
  fc_abs_less_than = (fc_more_or_less === "absLess");

  if (!fc_amount_Any && !fc_more_than && !fc_less_than && !fc_abs_more_than && !fc_abs_less_than) { alert("ERROR: fc_more_or_less=" + fc_more_or_less); return false; }

  // OLD: if fc_more_or_less==="more_or_less" then both the above are false


  // var fc_at_time = document.getElementById('fc_at_time').value;
  // var fc_in_celltype = document.getElementById('fc_in_celltype').value;

  // Multiple select enabled now for 'fc_in_celltypes' and 'fc_at_times', so using 'getSelectedValues()', but NOT multiple for 'fc_or_and':
  var fc_in_celltypes = getSelectedCheckboxValues('fc_in_celltype_checkboxes'), // WAS: getSelectedValues( document.getElementById('fc_in_celltype') ),
    fc_at_times = getSelectedCheckboxValues('fc_at_time_checkboxes'),     // WAS: getSelectedValues( document.getElementById('fc_at_time') ),
    fc_in_celltype_and_time = getSelectedCheckboxValues('fc_in_celltype_and_time_checkboxes'); // <-- this is numbers (the indexes of the head1[] array) as strings. Added 19 Aug 2023.
  // fc_or_and       = document.getElementById('fc_or_and').value; // fc_or_and is set below now


  // Better to set a message, instead of using the alert() box:
  // if (fc_in_celltypes.length == 0) err += "You haven't selected any Cell-types. Please select 'Any' OR specific cell-types.\n";
  // if (fc_at_times.length     == 0) err += "You haven't selected any 'Time-point or condition'. Please select 'Any' OR specific timepoints.\n";

  // fc_in_celltypes and fc_at_times can have indeterminite checkboxes, which will have checked as false.
  // if (fc_in_celltypes.length == 0) err += "You haven't selected any 'Cell-type/cluster' Please select specific cell-types/clusters from the list above.<br>";
  // if (fc_at_times.length     == 0) err += "You haven't selected any 'Time-point or condition'. Please select specific timepoints from the list above.<br>";
  if (fc_in_celltype_and_time.length == 0) err += "You haven't selected any Heatmap Columns. Please select specific 'Cell-types/clusters' and 'Time-point or condition' or 'Heatmap columns' from the check-box lists above.<br>";

  if (err !== "") { show_filter_heatmap_message(err, 'red'); console.log(err); return false; }

  // This Any won't apply now I think:
  //if (fc_in_celltypes.length > 1 && fc_in_celltypes.indexOf('Any') != -1) err += "For '<i>Cell-type/cluster</i>' you have selected '<i>Any</i>' and specific cell-types.<br>Please select '<i>Any</i>' <u>OR</u> specific cell-type(s)/cluster(s).";
  //if (fc_at_times.length     > 1 && fc_at_times.indexOf('Any')     != -1) err += "For '<i>timepoint or condition</i>' you have selected '<i>Any</i>' and specific timepoints.<br>Please select '<i>Any</i>' <u>OR</u> specific timepoint(s)/condition(s).";
  //if (err !== "") {show_filter_heatmap_message(err,'red'); alert(err); return false;}


  //alert('fc_in_celltype='+fc_in_celltype);
  //console.log("show_heatmap_tbody(): min_cols=",min_cols);

  var show_pct12_values = has_pct12_columns && document.getElementById("show_pct12_values").checked,
    show_pvalues = has_pvalues_columns && document.getElementById("show_pvalues").checked,
    html = '';

  // col logfc[0] is the genename
  //var h = (1.0 - value) * 240; // To normalise +5 then divide by 10, as input range is -4 to + 5

  // "in general the border of the right cells will overwrite the border of their left siblings. Same goes for bottom cells overwriting the border of top "siblings" (not really siblings here, I know, but you get the picture ...)."

  //...."border-top: 1px solid black; border-left: 1px solid black;"



  // times = ["EARLY","MID","LATE"];
  // celltypes = ["Amacrine","Astrocyte","Bipolar","Cone","Endothelial","Horizontal","Microglia","Muller Glia","Pericyte","RGC","Rod","RPE"];

  //var_fc_absolute  =

  var fc_in_celltypes_Any = (fc_in_celltypes.indexOf('Any') > -1),
    fc_at_times_Any = (fc_at_times.indexOf('Any') > -1),
    // fc_not_all_Any = !(fc_amount_Any && fc_in_celltypes_Any && fc_at_times_Any), // Not used now as using check-boxes with Any option.
    fc_amount_float = fc_amount_Any ? 0.0 : parseFloat(fc_amount);

  var pv_less_than = document.getElementById('pvalue_less_than').value,
    pv_Any = (pv_less_than === 'Any'),
    pv_less_than_float = pv_Any ? 10 : parseFloat(pv_less_than); // Just assigning 10 here, but could be any value of 1 or more.

  // pre 20 Aug 2023: var show_all_pvalues_in_row = pv_Any || logpvs.length < 2 || document.getElementById("show_all_pvalues_in_row").checked;

  //var show_all_foldchanges_in_row = fc_amount_Any || document.getElementById("show_all_foldchanges_in_row").checked, // Not used yet.
  //    show_all_pvalues_in_row = (pv_Any || document.getElementById("show_all_pvalues_in_row").checked) && logpvs !== null && logpvs.length > 1; 

  // Simplified this so applies to both pvalue and fold-change:
  var show_all_pvalues_in_row = document.getElementById("show_all_pvalues_in_row").checked; //) && logpvs !== null && logpvs.length > 1; 


  var k = []; // indexing positions into the logfc[] row arrays.
  // Math.trunc() is Javascript ES6, so using Math.floor(): 
  // (j % times.length) is same as (j - times.length*Math.floor(j/times.length))

  /* OLD:
  if (fc_not_all_Any) { // then build an array of the columns I need to test:
    for (var j = 0; j < celltypes.length*times.length; j++) {
      if (!fc_in_celltypes_Any && fc_in_celltypes.indexOf(celltypes[Math.floor(j/times.length)]) == -1) continue;
      if (!fc_at_times_Any && fc_at_times.indexOf(times[j % times.length]) == -1) continue; 

      k.push(j+1); // Need to use j+1, as the as the first column in the logfc array is the gene name.    
    }
  }
  */



  // from 20 Aug 2023 - changed to using this fc_in_celltype_and_time_checkboxes
  //if (false) { // If using fc_in_celltype_and_time
  for (var j = 0; j < fc_in_celltype_and_time.length; j++) {
    k.push(Number(fc_in_celltype_and_time[j])); // is indexes of head1 array.
  }
  //}

  /* pre-20 Aug 2023:
  if (fc_not_all_Any) { // then build an array of the columns I need to test:
    k = fc_in_celltypes_and_times_to_head_index_array(fc_in_celltypes, fc_at_times); // 19 Aug 2023
    
    // 19 Aug 2023 don't need: fc_in_celltypes_Any  and fc_at_times_Any
    // for (var j = 1; j < head1.length; j++) { // Start at 1 as the as the first column in the headings and logfc arrays is the gene name
    //   if (!fc_in_celltypes_Any && fc_in_celltypes.indexOf(head1[j]) == -1) continue;
    //   if (!fc_at_times_Any && fc_at_times.indexOf(head2[j]) == -1) continue;
    //   k.push(j); // Not j+1
    // }
  }
  */

  console.log("k=", k);

  var kLength = k.length; // will be zero when fc_not_all_Any===false

  // var min_cols = parseInt(document.getElementById('min_num_fc_for_gene').value); // returned 0 to 9, with default 1 selected.

  var min_num_fc_cols = document.getElementById('min_num_fc_for_gene2').value,
    min_cols = 0; // OR is same as Any

  //  if      (min_num_fc_cols === "none") {min_cols = 0;}
  if (min_num_fc_cols === "all") { min_cols = kLength; } // celltypes_select.value = times_select.value = "All"; disable=true;}
  else if (min_num_fc_cols.substring(0, 3) === "any") { min_cols = parseInt(min_num_fc_cols.substring(3)); } // celltypes_select.value = times_select.value = "Any";}

  //else if (min_num_fc_cols.substring(0,11) === "selectedAny") {min_cols = parseInt(min_num_fc_cols.substring(11)); if (min_cols > kLength) alert("You have Any selected min_cols="+min_cols+" which is greater that selected columns kLength="+kLength);} // disable=true;}
  // {if (celltypes.value === "All" || celltypes.value === "Any") celltypes.selectedIndex = -1; if (times.value === "All" || times.value === "Any") times.selectedIndex = -1;}
  //else if (min_num_fc_cols === "selectedAll") {min_cols = kLength; fc_or_and = 'AND';} // 

  else { alert("Unexpected min_num_fc_cols=" + min_num_fc_cols); return false; }

  if (!(fc_amount_Any && pv_Any) && min_cols > kLength) { err += "You have asked for Any " + min_cols + " columns, but that is more that the " + kLength + " 'Heatmap Columns' that you have selected.<br>Please either reduce the 'Any ... selected columns' selection, or select more 'Cell-types/clusters' and 'Time-point or condition' or 'Heatmap columns' from the check-box lists above.<br>"; show_filter_heatmap_message(err, 'red'); return false; }

  // ===

  console.log("show_heatmap_tbody(): min_num_fc_cols=" + min_num_fc_cols + "  min_cols=" + min_cols + "  kLength=" + kLength);

  var row_count = 0, i;

  if (logsort.length !== logfcs.length - 1) { alert("logsort.length=" + logsort.length + " !== logfcs.length-1=" + (logfcs.length - 1)); return false; }

  // for (var i=1; i<logfcs.length; i++) { // for each row. Start at i=1 as i=0 is the column headings.
  // logsort starts at logfcs[1] so var k = 0....  
  for (var m = 0; m < logsort.length; m++) { // for each row. Start at i=1 as i=0 is the column headings.
    // Using 'm' as k is used above and l is usewd below.
    var i = logsort[m][0],
      j,
      l,
      found = 0,
      logfc = logfcs[i],
      logpv = (logpvs !== null && logpvs.length > i) ? logpvs[i] : null; // optional pvalues row - not present in my single file format yet.

    /*
    if (min_cols>1) { // assume all genes have at least one fc
      var cnt = 0;
      for (j=1; j<logfc.length; j++) {
        if (logfc[j] !== null && logfc[j] != 0) cnt++;
      }
      if (cnt < min_cols) continue;
    }
    */
    //if (fc_not_all_Any) { // then test the appropriate columns:

    if (fc_amount_Any && pv_Any) {
      // Skip rows that are all null:
      for (j = 1; j < logfc.length; j++) {
        if (logfc[j] !== null) { found++; break; } // && logfc[j] != 0) cnt++;
      }
      if (found === 0) continue;
    }
    else {
      for (var l = 0; l < kLength; l++) { // for each column
        j = k[l];
        // is a ref faster ? eg. val = logfc[j];
        if (logfc[j] === null) continue;  // will allow: || logfc[j] === 0

        if (!fc_amount_Any) {
          if (fc_more_than) { if (logfc[j] < fc_amount_float) continue; } // so >= accepted
          else if (fc_less_than) { if (logfc[j] > -fc_amount_float) continue; } // so <= accepted
          else if (fc_abs_more_than) { if (Math.abs(logfc[j]) < fc_amount_float) continue; }
          else if (fc_abs_less_than) { if (Math.abs(logfc[j]) > fc_amount_float) continue; } // Must be fc_abs_less_than so don't need to test here.
          else { alert("ERROR: unexpected fc_more_than ...."); return false; }
          // These same tests need to be in the test below too to draw the cell - or could have a show values array then test it below.
        }

        if (!pv_Any && logpv !== null && (logpv[j] === null || logpv[j] > pv_less_than_float)) continue; // Added 18 Aug 2023.

        found++;
        if (found > min_cols) break; // as only need to find min_cols matches in the row when set to 'OR', otherwise need to test all kLength selected columns in the row.
        // if (fc_or_and === 'OR') break; // as only need to find one match in the row when set to 'OR', otherwise need to test all kLength selected columns in the row.
      } // end of for each column:  for (var l=0; l<kLength; l++) ....
      // if ((fc_or_and === 'OR' && found === 0) || fc_or_and === 'AND' && found < kLength) continue; // if (!found) continue;
      if (found < min_cols) continue;
    }


    /*
    else if (!pv_Any && logpv !== null) { // fc is Any, but pv isn't Any.
      var found = 0; // false;
      for (var l=0; l<kLength; l++) { // for each column
        j=k[l];

        if (logpv[j] === null || logpv[j] > pv_less_than_float) {continue;} // Added 18 Aug 2023.
        found++; // = true;

        if (found > min_cols) break; // as only need to find min_cols matches in the row when set to 'OR', otherwise need to test all kLength selected columns in the row.
        // if (fc_or_and === 'OR') break; // as only need to find one match in the row when set to 'OR', otherwise need to test all kLength selected columns in the row.
      } // end of for each column.
      if (found < min_cols) continue; // if (!found) continue;
      // if ((fc_or_and === 'OR' && found === 0) || fc_or_and === 'AND' && found < kLength) continue; // if (!found) continue;
    */

    /*
    // pre-18 Aug 2023: Filter on at least one pvalue in row less than the: pv_less_than_float. (Now checking the pvalue for the fold-change above.)
    if (!pv_Any && logpv !== null) {
      var found = false;
      for (j=1; j<logfc.length; j++) {
        if (logpv[j] !== null && logpv[j] <= pv_less_than_float) {found=true; break;}
      }
      if (!found) continue;
    }
    */




    /*
        //if (fc_amount != 'Any' || fc_at_time != 'Any' || fc_in_celltype != 'Any') {
        if (fc_amount != 'Any' || fc_at_times.indexOf('Any')==-1 || fc_in_celltypes.indexOf('Any')==-1) {
          
          startAt=1, step=3;
          if      (fc_at_time == 'Any')   step = 1; // So tests each.
          else if (fc_at_time == 'EARLY') startAt = 1; // 0 is the gene name column.
          else if (fc_at_time == 'MID')   startAt = 2;
          else if (fc_at_time == 'LATE')  startAt = 3;
          else {alert("Unexpected fc_at_time="+fc_at_time); return;}
          
    //      for (var j=startAt; j<logfc.length; j+=step) {
    
          var found=false
          for (var k=0; k<alength; k++) {
            j=a[k];
    
            if (fc_amount == 'Any') {
              if (logfc[j] != 0) {found=true; break;}
            } else {
              if (logfc[j] >= fc_amount_float || logfc[j] <= -fc_amount_float)) ) {found=true; break;}
            }
          
            if (  ( (fc_amount === 'Any' && logfc[j] != 0) || (fc_amount !== 'Any' && (logfc[j] >= fc_amount_float || logfc[j] <= -fc_amount_float)) )
                && (fc_in_celltypes.indexOf('Any') > -1 || fc_in_celltypes.indexOf(celltypes[Math.floor((j-1)/3)]) > -1 ) 
                
                
    //            && (fc_in_celltype=='Any' || celltypes[Math.floor((j-1)/3)] == fc_in_celltype) 
               ) {found=true; break;}}
          // console.log(celltypes[Math.floor((j-1)/3)]); 
          // Eg. for Coarse: celltypes = ["Amacrine","Astrocyte","Bipolar","Cone","Endothelial","Horizontal","Microglia","Muller Glia","Pericyte","RGC","Rod","RPE"];
          
          if (!found) continue;
        } // end of: if (fc_at_time != 'Any') {
    */

    filtered_row_list.push(i); // List of rows used to draw the heatmap image later.

    var genename = logfc[0];
    // GeneCards is Human only: var buff = '<tr><td><a href="http://www.genecards.org/cgi-bin/carddisp.pl?'+genename+'" target="_blank">'+genename+'</a></td>';    

    var gene_link_td = '<a href="#" onclick="set_gene_link(this, \'' + genename + '\');">' + genename + '</a>'; // target="_blank" 

    // Using the logfcs row as the checkbox id (not the 'genename' which might have an invalid characters for html ids.)
    var buff = '<tr id="r' + i + '"><td><input type="checkbox" id="c' + i + '" onchange="select_gene(this);"></td><td>' + gene_link_td + '</td>';
    // http://www.informatics.jax.org/marker/summary?nomen=Aamp

    // I changed so that, red is positive, blue is negative:
    // +3   : red    (hsl(  0, 100%, 50%))
    // >0   : yellow (hsl( 60, 100%, 50%))
    // 0    : green  (hsl(120, 100%, 50%))
    // <0   : cyan   (hsl(180, 100%, 50%))
    // -3   : blue   (hsl(240, 100%, 50%))

    // if (fc == null) ....
    //if (fc == 0) h = 120; // green.
    //else if (fc > 0) h = Math.max(0, 60 - 20*fc); // the 15 assues range 0 to +4, or 30 assumes range 0 to +2, 20 is range 0 to +3
    //else h = Math.min(240, 180 - 20*fc); // the 30 assumes range 0 to -2. // if (fc < 0)

    // could perhaps increase the 'L' to make the blue lighter , or change the alpha/transparency to make lighter. 

    // html += '<td style="background-color:hsl('+h+', 100%, 50%);"> &nbsp; '+fc+' &nbsp; </td>';
    //}

    for (j = 1; j < logfc.length; j++) {

      var border = (j - 1) % 3 == 0 ? ' border-left: 2px solid black;' : '';
      var fc = logfc[j], h, l;

      // TO add: (!show_all_foldchanges_in_row

      if (fc === null) { // show_all_pvalues_in_row is false if logpv===null or logpv.length<=1
        buff += '<td style="' + border + '"></td>';
      }
      else {
        // Set background colour for the cell:
        if (fc === 0) {
          h = 120; // green.
          l = 90;
        }
        else {
          if (fc > 0) h = Math.max(0, 60 - fc_hue_factor_red * fc); // fc_hue_factor_red 30 assumes range 0 to +2.
          else h = Math.min(240, 180 - fc_hue_factor_blue * fc);    // fc_hue_factor_blue 30 assumes range 0 to -2. // if (fc < 0)
          //var h = (5 - logfc[j])* 24;
          //if (h<0) h=0; // in case is below the -5 range.
          //else if (h>240) h=240; // in case is above the +5 range.
          // My hack to make near-zero values lighter:
          l = Math.round(90 - 40 * Math.min(1, Math.abs(fc)));   // so will be 60% at 1, 80% near zero, 
        }
        var color = 'background-color:hsl(' + h + ', 100%, ' + l + '%);';

        var show_values = true;
        if (!show_all_pvalues_in_row) {
          if (!pv_Any && logpv !== null && logpv[j] !== null && logpv[j] > pv_less_than_float) show_values = false;
          if (!fc_amount_Any) {
            if (fc_more_than) { if (logfc[j] < fc_amount_float) show_values = false; } // so >= accepted
            else if (fc_less_than) { if (logfc[j] > -fc_amount_float) show_values = false; } // so <= accepted
            else if (fc_abs_more_than) { if (Math.abs(logfc[j]) < fc_amount_float) show_values = false; }
            else if (fc_abs_less_than) { if (Math.abs(logfc[j]) > fc_amount_float) show_values = false; } // Must be fc_abs_less_than so don't need to test here.
          }
        }

        if (show_values) {
          var pvalue_html = (!show_pvalues || logpv === null || logpv[j] === null) ? '' : (logpv[j] <= 0.05) ? 'p=<b>' + logpv[j] + '</b>' : (logpv[j] <= 0.9) ? 'p=' + logpv[j] : '<span font-size="75%">p=' + logpv[j] + '</span>',
            pct12_html = (!show_pct12_values || pct1s[i] === null || pct1s[i][j] === null) ? '' : " pct1=" + pct1s[i][j] + " pct2=" + pct2s[i][j],
            pvalue_pct12_html = (pvalue_html === '' && pct12_html === '') ? '' : ' &nbsp; <span style="font-size:80%;">' + pvalue_html + pct12_html + '</span>';

          if (fc === 0) buff += '<td style="' + color + border + 'font-size:60%;">0' + pvalue_pct12_html + '</td>';  // maybe put a small '0' here
          else buff += '<td style="' + color + border + '">' + fc + pvalue_pct12_html + '</td>';   // Must be same as above if (fc === 0) case.
          //console.log(buff);
        }
        else buff += '<td style="' + color + border + '"></td>';  // end of: if (show_values)....

      } // end of: if (fc === null) { } else ....
    }
    html += (buff + '<td style="border-left: 2px solid black;">' + gene_link_td + '</td></tr>');
    row_count += 1;
  }     // end of for each row.

  document.getElementById('heatmap_tbody').innerHTML = html;

  show_filter_heatmap_message(row_count + " genes (from total of " + (logfc.length - 1) + ") are listed in the heatmap below."); // -1 as first row in logfc is the column headings.
  show_num_filtered_rows(row_count);

  show_display_options_message("");
  show_validate_input_data_parameters_message("");

  show_heatmap_title('Fold-change', head1.join(', '));

  disable_heatmap_with_column_names_and_types_button(false); // to allow redisplay of heatmap with updated column name or types.

  return true;
}




/* 
   https://stackoverflow.com/questions/12875486/what-is-the-algorithm-to-create-colors-for-a-heatmap      
   A general approach is to interpolate colors. You decided that

0: 0 0 255 (or any blue)
0.5: 0 255 0 (or any green)
1: 255 0 0 (or any red)
You simply do a linear interpolation of the RGB. Between 2 reference values (eg t between 0 and 0.5), the interpolated color C is like

C = (1 - t) * c0 + t * c1

OR:
def genColorMap(self):
    points = [(255,0,0), (255,255,0), (0,255,0), (0,255,255), (0,0,255)]
    cm = {}
    for i in range(0, 256):
        p0 = int(numpy.floor((i/256.0)/len(points)))
        p1 = int(numpy.ceil((i/256.0)/len(points)))
        rgb = map(lambda x: x[0]*max(0,(i-p0)) + x[1]*max(0,(i-p1)), zip(points[p0], points[p1]))
        cm[i] = QtGui.qRgb(rgb[0], rgb[1], rgb[2])
    return cm
OR:
  
  function heatMapColorforValue(value){
  var h = (1.0 - value) * 240
  return "hsl(" + h + ", 100%, 50%)";
}

0    : blue   (hsl(240, 100%, 50%))
0.25 : cyan   (hsl(180, 100%, 50%))
0.5  : green  (hsl(120, 100%, 50%))
0.75 : yellow (hsl(60, 100%, 50%))
1    : red    (hsl(0, 100%, 50%))

I could modify to do:
   >0 -> +2 cyan to blue
   0 = blank or green
   <0 -> -2 yellow to red

if ==0

else if (logfc[j]>0) {h = Math.min(240, 180 + 30*logfc[j];} // the 30 assumes range 0 to +2.
else {h = Math.max(0, 60 + 30*logfc[j];} // the 30 assumes range 0 to -2. // if (logfc[j]<0)

eg: Math.max(..., 0)
eg: Math.min(..., 240)

*/



/*
function pearson(a,b) {
  // It assumes that both variables follow a normal distribution, otherwise a rank correlation measure needs to be calculated instead - eg: kendallsTau() 
  //    https://thisancog.github.io/statistics.js/inc/correlation.html
  
  var x = logfcs[a];
  var y = logfcs[b];

  var n = x.length;
   
  //if (n == 0) return 0;

  var meanX = 0, meanY = 0;
  for (var i = 0; i < n; i++) {
    meanX += x[i] / n;
    meanY += y[i] / n;
  }
  //or: meanX = meanX/n; meanY = meanY/n;

  var num = 0, den1 = 0, den2 = 0;
  for (var i = 0; i < n; i++) {
    var dx = (x[i] - meanX);
    var dy = (y[i] - meanY);
    num  += dx * dy;
    den1 += dx * dx;
    den2 += dy * dy;
  }

  var den = Math.sqrt(den1) * Math.sqrt(den2);

  if (den == 0) return 0;

  return num / den;
}



///function pearson(a,b) {
  // It assumes that both variables follow a normal distribution, otherwise a rank correlation measure needs to be calculated instead - eg: kendallsTau() 
  //    https://thisancog.github.io/statistics.js/inc/correlation.html
  
  var x = logfcs[a];
  var n = x.length;

  var meanX = 0, num_fc = 0;
  for (var i = 0; i < n; i++) {
    if (x[i] == 0) continue; // **** or null in future!!!
    num_fc++; 
    meanX += x[i] / n;
  }
  //or: meanX = meanX/n;

  if (num_fc < 2) {alert("For Pearson correlation you need to select a gene with at least 2 fold-change values."); return false;}

  var denXX = 0;
  for (var i = 0; i < n; i++) {
    if (x[i] == 0) continue; // **** or null in future!!!
    var dx = (x[i] - meanX); // or could store in an array for reuse below:
    denXX += dx * dx;
  } 


  for each other gene .....{

    var y = logfcs[b];

    var meanY = 0, num_fc = 0;

    for (var i = 0; i < n; i++) {
      if (y[i] == 0) continue; // **** or null in future!!!
      num_fc++; 
      meanY += y[i] / n;
    }
    //or: meanY = meanY/n;
    
    // if (num_fc < 2) {hide this gene; continue;}

    var num = 0, denYY = 0, num_fc = 0;
    for (var i = 0; i < n; i++) {
      if (x[i] == 0 || y[i] == 0) continue; // **** *** or null in future!!!
      num_fc++;
      var dx = (x[i] - meanX);
      var dy = (y[i] - meanY);
      num  += dx * dy;
      denYY += dy * dy;
    }

    // if (num_fc < 2) {hide this gene; continue;}
    
    var den = Math.sqrt(denXX) * Math.sqrt(denYY);

    if (den == 0) {hide this gene; continue;} // then hide this table row.

    correlation = num / den;
    if (correlation < ....) // hide this table row.
    // else show row - if correlate with all - ????
    }

}



add copy selected genes to clipboard with separater ....
<label>Separate genes in the copied list with a:<select id="">
<option value="newline">New-line</option>
<option value="comma">Comma</option>
<option value="commaspace">Comma and Space</option>
<option value="semicolon">Semi-colon</option>
<option value="tab">Tab</option>
<option value="space">Space</option>
</select>
</label>

switch
"newline" div = "\n";
"comma" div = ","
"commaspace" div = ", "
"semicolon" div=";"
"tab" div="\t"
"space" div=" "
invalid 

  join(div);
 
 
*/


/* Maybe email David re diabetes - re mitochondria: https://youtu.be/0mD-wupqvQE?t=2603  */

function set_filtering_progress(msg) {
  var elem = document.getElementById('genename_filtering_progress');
  if (elem) elem.innerHTML = msg;
}

var timer2 = null;
function filter_genes_by_name() {
  set_filtering_progress(" <i>Working...</i>");

  var filter_text = document.getElementById('filter_genes_input_text').value.trim().toUpperCase(); // or: toLowerCase();
  var tbody = document.getElementById('heatmap_tbody');
  var num_rows = tbody.rows.length;

  // Using this setTimeout so that the above message is displayed, before running the following. Works in Chrome, but doesn't work in Firefox.
  // The setTimeout() method calls a function after a number of milliseconds.
  timer2 = setTimeout(function () {
    var i;
    if (filter_text == "") { // clear the hidden for any hidden cells:
      for (var i = 0; i < num_rows; i++) tbody.rows[i].style.display = '';
    }
    else {
      for (var i = 0; i < num_rows; i++) {
        var row = tbody.rows[i];

        var irow = Number(row.id.substring(1)), // The row has id="r'+i" where i is the row in the logfcs array.
          genename = logfcs[irow][0];

        row.style.display = (genename.toUpperCase().indexOf(filter_text) == -1) ? 'none' : '';
      }

      //To loop through the table cells in the row:
      // var cellLength = row.cells.length;
      //for (var y=0; y<cellLength; y+=1){
      //  var cell = row.cells[y];
      //do something with every cell here
      //}
    }
    set_filtering_progress("");
    timer2 = null;
  }, 10); // end of the setTimeout(

}




/*  FROM: String API Help: https://string-db.org/help/api/
Please be considerate and wait one second between each call, so that our server won't get overloaded.
Although STRING understands a variety of identifiers and does its best to disambiguate your input it is recommeded to map your identifier first (see: mapping). Querying the API with a disambiguated identifier (for example 9606.ENSP00000269305 for human TP53) will guarantee much faster server response.
Another way to guarantee faster server response is to specify from which species your proteins come from (see 'species' parameter). In fact API will reject queries for networks larger than 10 proteins without the specified organism.
When developing your tool use default STRING address (https://string-db.org), but when your code is ready, you should link to a specific STRING version (for example "https://version-11-5.string-db.org"), which will ensure that for the same query you will always get the same API response, even after STRING or API gets updated. To see the current STRING version and its URL prefix click here
STRING understands both GET and POST requests. GET requests, although simpler to use, have a character limit, therefore it is recommended to use POST whenever possible.
When calling our API from your website or tools please identify yourself using the caller_identity parameter.


Mapping identifiers
You can call our STRING API with common gene names, various synonyms or even UniProt identifiers and accession numbers. However, STRING may not always understand them which may lead to errors or inconsistencies. Before using other API methods it is always advantageous to map your identifiers to the ones STRING uses. In addition, STRING will resolve its own identifiers faster, therefore your tool/website will see a speed benefit if you use them. For each input protein STRING places the best matching identifier in the first row, so the first line will usually be the correct one.
- see the example Python code.
*/


//https://string-db.org/api/[output-format]/get_link?identifiers=[your_identifiers]&[optional_parameters]


var selected_gene_list = [], filtered_row_list = [];

var stringdb_caller_identity = 'qub.ac.uk'; // Temporary.  // *** Also set in: <input hidden id="form_stringdb_caller_identity" name="" value="qub.ac.uk">


function stringdb(embedded_or_in_newtab) {
  //var gene_list_uppercase = [];
  //for (var i=0; i<selected_gene_list.length; i++) gene_list_uppercase.push(selected_gene_list.toUpperCase());
  console.log("stringdb()");


  // STRING understands both GET and POST requests. GET requests, although simpler to use, have a character limit, therefore it is recommended to use POST whenever possible.
  //  var url = 'https://string-db.org/api/tsv-no-header/get_link?identifiers='+ encodeURIComponent(selected_gene_list.slice(0,300).join('\r')) + '&network_flavor='+network_flavor + '&show_query_node_labels=1' + '&required_score='+required_score + '&additional_network_nodes='+additional_network_nodes + '&caller_identity='+stringdb_caller_identity;
  // I'll change this to POST in future.

  // "Reason: CORS header ‘Access-Control-Allow-Origin’ missing - Explains the Cross-Origin Resource Sharing(CORS) error message to allow cross-origin requests and shows how to resolve it for Apache and Nginx web servers."
  //  https://html5.tutorials24x7.com/blog/reason-cors-header-access-control-allow-origin-missing




  //var species = '10090'; // Initially assume Mouse selected.
  //if (document.getElementById('stringdb_species_human').checked) species = '9606';  // Human
  //else if (!document.getElementById('stringdb_species_mouse').checked) {show_loading_message("ERROR: stringdb: Unexpected species selected", 'red'); return false;}
  // http://www.uniprot.org/taxonomy

  var msg = "";

  if (taxid === "") { msg = "NOTE: stringdb: Species not selected"; show_loading_message(msg, 'red'); show_stringdb_message(msg, 'red'); alert(msg); location.href = "#gene_symbol_type"; return false; } // scrolling to gene_symbol_type as if scroll to #organism_species it's hidden by the floating table head row.

  var gene_symbol_type = document.getElementById('gene_symbol_type').value; // Not used here for stringdb

  if (selected_gene_list.length === 0) { msg = "NOTE: stringdb: You need to select genes, using the checkboxes at left of the heatmap table below"; show_loading_message(msg, 'red'); show_stringdb_message(msg, 'red'); alert(msg); return false; } // location.href="#organism_species"; table...

  var required_score = document.getElementById('stringdb_required_score').value;
  //alert('stringdb_required_score: '+required_score);

  // limit = Maximum number of nodes to return, e.g 10
  // required_score = Threshold of significance to include a interaction, a number between 0 and 1000
  // additional_network_nodes = Number of additional nodes in network (ordered by score), e.g. 10
  // network_flavor = The style of edges in the network. evidence for colored multilines. Confidence for singled lines where hue correspond to confidence score. (actions for stitch only)
  // network_flavor	the style of edges in the network: evidence, confidence (default), actions

  var additional_network_nodes = document.getElementById('stringdb_additional_network_nodes').value;
  var network_flavor = document.getElementById('stringdb_network_flavor').value;

  console.log("stringdb(): starting getSTRING()");

  if (embedded_or_in_newtab === 'embedded') {
    show_stringdb_message("Fetching StringDB image....", 'blue');
    // Just using the first 300 identifiers:
    var result = getSTRING('https://string-db.org', { 'species': taxid, 'identifiers': selected_gene_list.slice(0, 2000), 'network_flavor': network_flavor, 'show_query_node_labels': '1', 'required_score': required_score, 'additional_network_nodes': additional_network_nodes, 'caller_identity': stringdb_caller_identity });
    //console.log("stringdb result=",result); result is undefined.

    enable_stringdb_buttons(false); // false means not disabled.

  } else if (embedded_or_in_newtab === 'in_newtab') {

    // See: https://string-db.org/cgi/help.pl?subpage=api%23linking-to-the-network-on-string-webpage

    show_stringdb_message("Fetching StringDB link to new webpage....", 'blue');

    // NOTE: No ? or & at start of this:
    var stringdb_options = 'species=' + encodeURIComponent(taxid) + '&network_flavor=' + network_flavor + '&show_query_node_labels=1' + '&required_score=' + required_score + '&additional_network_nodes=' + additional_network_nodes + '&caller_identity=' + encodeURIComponent(stringdb_caller_identity);

    // STRING understands both GET and POST requests. GET requests, although simpler to use, have a character limit, therefore it is recommended to use POST whenever possible.
    // https://string-db.org/cgi/help.pl?subpage=api%23linking-to-the-network-on-string-webpage
    var stringdb_getlink_url = 'https://string-db.org/api/tsv-no-header/get_link'; // or: "https://version-11-5.string-db.org/api"


    // identifiers : required parameter for multiple items, e.g. DRD1_HUMAN%0dDRD2_HUMAN
    // "%0d" is carriage return: \r
    // whereas "%0a" is newline: \n
    // https://en.wikipedia.org/wiki/Newline

    // if (url.length > 2028) {url = url.substring(0,2048);} - but I should really trim genelist rather than just cutting string.

    // https://stackoverflow.com/questions/247483/http-get-request-in-javascript
    //var useGET = true;
    var useGET = false; // to use POST. Works okay with my 200 gene subset, but gives a CORS error with the full 2000 genes.

    if (useGET) {
      var xhr = new XMLHttpRequest();
      try {
        // Just the first 300 here: - does start with & here:
        var stringdb_identifiers = '&identifiers=' + encodeURIComponent(selected_gene_list.slice(0, 300).join('\r'));
        var url = stringdb_getlink_url + '?' + stringdb_options + stringdb_identifiers;
        xhr.open("GET", url, false); // false for synchronous request
        // xhr.setRequestHeader(); // To overcome the same origin restriction. must be after open() and before send() 
        // xhr.setRequestHeader('Content-Type', 'text/plain');
        xhr.send(null);
        alert(xhr.responseText);
        enable_stringdb_buttons(false); // false means they're not disabled.
        var url = xhr.responseText;
        show_stringdb_message('get: Retrieved the StringDB link okay.<br>If your browser doesn\'t automatically open String in a new tab, then click this link: <a href="' + url + '" target="_blank">' + url + '</a>', 'green');

        //alert(url);

        //////        window.open(url, '_blank'); // .focus(); // open may be blocked by popup blocker.
        document.getElementById("stringdb_in_newtab_anchor_link").href = url;

        // http_request.withCredentials = true;
      } catch (err) {
        msg = "get: Request for StringDB link failed: '" + err.message + "'\nThis is probably due to blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.";
        show_stringdb_message(msg.substr(0, 200), 'red');
        alert(msg);
        enable_stringdb_buttons(false); // false means they're not disabled.
        //return false;
      }
      // Currently getting error about:
      //     "Access to XMLHttpRequest at .... from origin 'null' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.

    } else { // So use POST as useGET is false


      // https://string-db.org/cgi/input.pl?input_page_active_form=organisms

      // Or better to use an async request:     
      // synchronous requests are discouraged and will generate a warning along the lines of:
      // Note: Starting with Gecko 30.0 (Firefox 30.0 / Thunderbird 30.0 / SeaMonkey 2.27), synchronous requests on the main thread have been deprecated due to the negative effects to the user experience.
      // You should make an asynchronous request and handle the response inside an event handler.
      // function httpGetAsync(theUrl, callback) {
      //    var xmlHttp = new XMLHttpRequest();
      //    xmlHttp.onreadystatechange = function() { 
      //    if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
      //       callback(xmlHttp.responseText);
      //    }
      //    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
      //    xmlHttp.send(null);
      // }

      // For gProfiler is:  var url = 'https://biit.cs.ut.ee/gprofiler/gost?organism='+gprofiler_id+'&query=' + encodeURIComponent(selected_gene_list.join("%0A")); 
      // '%0A' will be the URL-encoding of a newline. eg: https://biit.cs.ut.ee/gprofiler/gost?organism=mmusculus&query=VEGFA%0AVEGFB


      // POST isn't limited to first 300 here:
      var stringdb_identifiers = '&identifiers=' + encodeURIComponent(selected_gene_list.slice(0, 1000).join('\r'));

      // I'll change this to POST in future.

      //    escape() will not encode: @*/+
      //    encodeURI() will not encode: ~!@#$&*()=:/,;?+'
      //    encodeURIComponent() will not encode: ~!*()'


      // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/send

      //var useAsync = true;
      var useAsync = false;
      var xhr = new XMLHttpRequest();
      try {
        xhr.open("POST", stringdb_getlink_url, useAsync); // true means async.

        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"); // Send the proper header information along with the request.
        // For JSON data use: xhr.setRequestHeader('Content-Type', 'application/json');

        // For sync:
        if (!useAsync)
          xhr.onload = function () {
            var url = this.responseText;
            document.getElementById("stringdb_in_newtab_anchor_link").href = url;
            //alert("onload(): "+url);
            show_stringdb_message('post onload(): Retrieved the StringDB link okay.<br>If your browser doesn\'t automatically open String in a new tab, then click this liink: <a href="' + url + '" target="_blank">' + url + '</a>', 'green');
          };

        // Async:  'onreadystatechange' should not be used with synchronous requests and must not be used from native code.
        if (useAsync)
          xhr.onreadystatechange = function () { // Call a function when the state changes.
            if (xhr.readyState === XMLHttpRequest.DONE) {  // DONE is 4
              // In local files, status is 0 upon success in Mozilla Firefox so could test: const status = xhr.status;   if (status === 0 || (status >= 200 && status < 400)) {
              if (xhr.status === 200) {
                // Request finished successfully. Do processing here.
                var url = xhr.responseText;
                console.log(url);
                alert("POST response=" + url);

                enable_stringdb_buttons(false); // false means they're not disabled.
                show_stringdb_message('post onreadystatechange(): Retrieved the StringDB link okay.<br>If your browser doesn\'t automatically open String in a new tab, then click this liink: <a href="' + url + '" target="_blank">' + url + '</a>', 'green');

                //document.getElementById("form_stringdb").action = url;
                //document.getElementById("stringdb_in_newtab_anchor_link").href = url;
                //              document.getElementById("form_stringdb_to").value = url;  // As using async then too late to set the href for the anchor.

                window.open(url, '_blank'); // .focus();  // Chrome give Popup blocked message in address bar.

              } else {
                console.log("status:", xhr.status, "  responseText:", xhr.responseText);

                //var msg = "Request for StringDB link failed: '"+err.message+"'\nThis is probably due to blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.";
                //show_stringdb_message(msg.substr(0,200),'red');
                //alert(msg);
                enable_stringdb_buttons(false); // false means they're not disabled.

                alert("status: " + xhr.status + "  responseText: " + xhr.responseText);
              }
            }
          }; // end of: xhr.onreadystatechange = function() {....

        xhr.send(stringdb_options + stringdb_identifiers); // eg: "foo=bar&lorem=ipsum");

        // xhr.send(new Int8Array());
        // xhr.send(document);

      } catch (err) {
        msg = "POST Request for StringDB link failed: '" + err.message + "'\nThis is probably due to blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.";
        show_stringdb_message(msg.substr(0, 200), 'red');
        alert(msg);
        enable_stringdb_buttons(false); // false means they're not disabled.
        //return false;
      }
    } // end of if (useGET) {...} else {...
    /*
    ========
    // or can use FormData: https://developer.mozilla.org/en-US/docs/Web/API/FormData 
    // https://devsheet.com/code-snippet/xhr-post-request-with-form-data-javascript/
    var data = new FormData();
    data.append('username', 'username');
    data.append('email', 'email');
    
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'api_url', true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.onload = function () {
        // YOU WILL FIND RESPONSE HERE
        console.log(this.responseText);
    };
    xhr.send(data);
    */





  } else alert("stringdb(): Unexpected param value: " + embedded_or_in_newtab);

  enable_stringdb_buttons(false);
  // Don't disable the enable_stringdb_species_radio_group();
}


function gene_symbol_type_is_gene_or_protein(propercase) {
  var gene_symbol_type = document.getElementById('gene_symbol_type').value,
    gene_or_protein = ['ENSEMBL_PROTEIN_ID', 'REFSEQ_PROTEIN', 'UNIPROT_ID'].indexOf(gene_symbol_type) >= 0 ? 'protein' : 'gene';

  if (propercase) gene_or_protein = gene_or_protein.charAt(0).toUpperCase() + gene_or_protein.substr(1); // Make first lettre of gene or Protein a capital.
  return gene_or_protein;
}


function gene_symbol_type_changed() {
  var gene_or_protein = gene_symbol_type_is_gene_or_protein(true), // true for proper case: Gene or Protein.
    genename_or_protein_heading = document.getElementById('genename_or_protein_heading');

  // BUT when reading HIVE format this heatmap isn't displayed until later and this heading will already have been set when saving the single HIVE format file. 
  // so genename_or_protein_heading, logfcs, and head1 are all undefined or null. 

  if (genename_or_protein_heading) genename_or_protein_heading.innerHTML = gene_or_protein; // The top left Gene' heading in the Heatmap table. 

  if (logfcs && logfcs.length > 0 && logfcs[0].length > 0) logfcs[0][0] = gene_or_protein;
  if (head1 && head1.length > 0) head1[0] = gene_or_protein;
}



// DAVID Bioinformatics Resources - Laboratory of Human Retrovirology and Immunoinformatics (LHRI)
//   https://david.ncifcrf.gov/content.jsp?file=DAVID_API.html
// https://david.ncifcrf.gov/content.jsp?file=documentation.html#LargeList


function DAVID() {

  var gene_symbol_type = document.getElementById('gene_symbol_type').value, // Not used here for DAVID.
    david_tool_name = document.getElementById('david_tool_name').value;

}

/*
For "tool" tag:
<label for="david_tool_name">DAVID Tool name:</label>
<select id ="david_tool_name"">
<option value="gene2gene">Gene Functional Classification</option>
<option value="term2term">Funtional Annotation Clustering</option>
<option value="summary">Functional Annotation Summary</option>
<option value="chartReport">Functional Annotation Chart</option>
<option value="annotationReport">Functional Annotation Table</option>
<option value="list">Show Gene List Names in Batch</option>
<option value="geneReport">Gene Report</option>
<option value="geneReportFull">Gene Full Report</option>
</select>
*/


/* DAVID  For "type" tag:
Valid Values
 AFFYMETRIX_3PRIME_IVT_ID
 AFFYMETRIX_EXON_GENE_ID
 AFFYMETRIX_SNP_ID
 AGILENT_CHIP_ID
 AGILENT_ID
 AGILENT_OLIGO_ID
 ENSEMBL_GENE_ID
 ENSEMBL_TRANSCRIPT_ID
 ENTREZ_GENE_ID
 FLYBASE_GENE_ID
 FLYBASE_TRANSCRIPT_ID
 GENBANK_ACCESSION
 GENPEPT_ACCESSION
 GENOMIC_GI_ACCESSION
 PROTEIN_GI_ACCESSION
 ILLUMINA_ID
 IPI_ID
 MGI_ID
 GENE_SYMBOL  <-- now is OFFICIAL_GENE_SYMBOL ?
 PFAM_ID
 PIR_ACCESSION
 PIR_ID
 PIR_NREF_ID
 REFSEQ_GENOMIC
 REFSEQ_MRNA
 REFSEQ_PROTEIN
 REFSEQ_RNA
 RGD_ID
 SGD_ID
 TAIR_ID
 UCSC_GENE_ID
 UNIGENE
 UNIPROT_ACCESSION
 UNIPROT_ID
 UNIREF100_ID
 WORMBASE_GENE_ID
 WORMPEP_ID
 ZFIN_ID
 */



function elem(id) {
  return document.getElementById(id);
}


function swap_classes(elem, class1, class2) {
  // Returns:  1 if change to class2, 
  //      or: -1 if change to class1
  //      or:  0 if elem has neither class1 nor class2

  var result = 0;

  if (!elem) { alert("swap_classes() elem not defined."); return 0; }

  // element.classList needs:  Chrome 22, Edge 16, Firefox 3.6, Safari 7, etc: https://developer.mozilla.org/en-US/docs/Web/API/Element/classList#browser_compatibility 
  // For older browsers fallback to using elem.className:  https://codereview.stackexchange.com/questions/235353/classlist-fallback-ie-older-browsers

  if ('classList' in elem) { // or: if (classList' in Element.prototype) ...
    // Use elem.classList:
    if (elem.classList.contains(class1)) {
      elem.classList.remove(class1);
      elem.classList.add(class2);
      result = 1;
    } else if (elem.classList.contains(class2)) {
      elem.classList.remove(class2);
      elem.classList.add(class1);
      result = -1;
    }
  }
  else {
    // Use elem.className:

    // Previously: alert("You need at least:\nChrome version 22\nor Edge 16\nor Firefox 3.6\n or Safari 7\netc\nhttps://developer.mozilla.org/en-US/docs/Web/API/Element/classList#browser_compatibility"); return;}

    var list = elem.className.split(/\s/),
      index = list.indexOf(class1);

    if (index >= 0) {
      list[index] = class2;
      elem.className = list.join(" ");
      result = 1;
    }
    else {
      index = list.indexOf(class2);
      if (index >= 0) {
        list[index] = class1;
        elem.className = list.join(" ");
        result = -1;
      }
    }
  } // end of: if ('classList' in elem.prototype) ...

  if (result === 0) alert("ERROR: swap_classes() elem_id: " + elem.id + " is missing: " + class1 + " and " + class2);

  return result;
}



function show_hide_table_row(name, show) {
  // To show or hide the stringdb, gprofiler, etc tables.
  // var td = document.getElementById(name+'_table_row'),

  var table = document.getElementById(name + '_table'),
    button = document.getElementById('show_hide_' + name + '_table_button');

  if (typeof show !== 'undefined' && ((show && button.innerHTML === "Hide") || (!show && button.innerHTML === "Show"))) return; // As no change needed.

  var result = swap_classes(table, "tool_table_hide_td", "tool_table_show_td"); // returns 1 if change to tool_table_show_td, or -1 if change to tool_table_hide_td

  if (result !== 0) button.innerHTML = result > 0 ? "Hide" : "Show";

  /* 
    if (!('classList' in table.prototype)) {
      // alert("You need at least:\nChrome version 22\nor Edge 16\nor Firefox 3.6\n or Safari 7\netc\nhttps://developer.mozilla.org/en-US/docs/Web/API/Element/classList#browser_compatibility"); return;}
      // element.classList needs:  Chrome 22, Edge 16, Firefox 3.6, Safari 7, etc: https://developer.mozilla.org/en-US/docs/Web/API/Element/classList#browser_compatibility 
      // For older browsers could fallback to using: className:  https://codereview.stackexchange.com/questions/235353/classlist-fallback-ie-older-browsers
       var classList = table.className.split(/\s/),
            index = classList.indexOf("tool_table_hide_td");
       
       if (index >= 0) {
         classList[index] = "tool_table_show_td";
         button.innerHTML = "Hide";
       }
       else {
          index = classList.indexOf("tool_table_show_td");
          if (index >= 0) {
            classList[index] = "tool_table_hide_td";
            button.innerHTML = "Show";
          }
          else {alert("ERROR: show_hide_table_row() table "+table.id+" is missing tool_table_hide_td or tool_table_show_td"); return;}
       }
       table.className = classList.join(" ");
    }
  
    // else using table.classList:
    if (table.classList.contains("tool_table_hide_td")) {
      table.classList.remove("tool_table_hide_td");
      table.classList.add("tool_table_show_td");
      // td.style.display = '';
      button.innerHTML = "Hide";
    } else if (table.classList.contains("tool_table_show_td")) {
      table.classList.remove("tool_table_show_td");
      table.classList.add("tool_table_hide_td");
      // td.style.display = 'none';
      button.innerHTML = "Show";
    }
    else {alert("ERROR: show_hide_table_row() table "+table.id+" is missing tool_table_hide_td or tool_table_show_td"); return;}
    // or use:  ....toggle("tool_table_hide_td") ....toggle("tool_table_show_td")
  */

}


function show_hide_select_column_checkboxes() {
  document.getElementById("heatmap_image_select_columns_span").style.display = (document.getElementById("heatmap_images_rows_select").value === "selectedcolumns") ? '' : 'none';
}


//function enable_stringdb_buttons(disabled=false) { // default param value only in Javascript version ES 6
function enable_stringdb_buttons(disabled) {
  //alert("enable_stringdb_buttons() "+disabled);

  var button_class = (selected_gene_list.length === 0 || taxid === "" || disabled) ? "" : "big_red"; // blue or red.

  document.getElementById('stringdb_embedded_button').class = document.getElementById('stringdb_in_newtab_button').class = button_class;

  //  document.getElementById('stringdb_embedded_button').style.backgroundColor = document.getElementById('stringdb_in_newtab_button').style.backgroundColor = bgcolor;


  // could change class from red to blue ???
  //if (selected_gene_list.length===0 || taxid==="" || disabled) {
  //document.getElementById('stringdb_embedded_button').setAttribute("disabled", "disabled");
  //document.getElementById('stringdb_in_newtab_button').setAttribute("disabled", "disabled");
  // document.getElementById('form_stringdb_in_newtab_submit_button').setAttribute("disabled", "disabled");
  //} else {
  //document.getElementById('stringdb_embedded_button').removeAttribute("disabled");
  //document.getElementById('stringdb_in_newtab_button').removeAttribute("disabled");
  // document.getElementById('form_stringdb_in_newtab_submit_button').removeAttribute("disabled");
  //} 

}


function enable_copy_genelist_buttons(disabled) {
  if (selected_gene_list.length == 0 || disabled) {
    document.getElementById('copy_genelist_button').setAttribute("disabled", "disabled");
    document.getElementById('copy_genelist_button_for_david').setAttribute("disabled", "disabled");
  }
  else {
    document.getElementById('copy_genelist_button').removeAttribute("disabled");
    document.getElementById('copy_genelist_button_for_david').removeAttribute("disabled");
  }
}

function enable_gprofiler_button(disabled) {
  // alert("enable_gprofiler_button");
  if (selected_gene_list.length === 0 || taxid === "" || disabled) document.getElementById('submit_gprofiler_button').setAttribute("disabled", "disabled");
  else document.getElementById('submit_gprofiler_button').removeAttribute("disabled");
}


function enable_david_button(disabled) {
  // alert("enable_david_button");
  if (selected_gene_list.length === 0 || taxid === "" || disabled) document.getElementById('submit_david_button').setAttribute("disabled", "disabled");
  else document.getElementById('submit_david_button').removeAttribute("disabled");
}


function set_stringdb_and_gprofiler_species_text(stringdb_organism_text) {
  document.getElementById('stringdb_species_text').innerHTML = stringdb_organism_text;
  document.getElementById('gprofiler_organism_text').innerHTML = stringdb_organism_text;
}



function enable_stringdb_species_radio_group() {
  if (selected_gene_list.length == 0) {
    //document.getElementById('stringdb_species_mouse').setAttribute("disabled", "disabled");
    //document.getElementById('stringdb_species_human').setAttribute("disabled", "disabled");
    document.getElementById('stringdb_required_score').setAttribute("disabled", "disabled");
    document.getElementById('stringdb_additional_network_nodes').setAttribute("disabled", "disabled");
    document.getElementById('stringdb_network_flavor').setAttribute("disabled", "disabled");
  } else {
    //document.getElementById('stringdb_species_mouse').removeAttribute("disabled");
    //document.getElementById('stringdb_species_human').removeAttribute("disabled");
    document.getElementById('stringdb_required_score').removeAttribute("disabled");
    document.getElementById('stringdb_additional_network_nodes').removeAttribute("disabled");
    document.getElementById('stringdb_network_flavor').removeAttribute("disabled");
  }
}


function show_num_filtered_rows(row_count) {
  document.getElementById("sjb_tab5_label").innerHTML = '<span style="font-size: 80%">(5)</span> Filter rows:' + row_count;
}


function show_selected_genes() {
  var num = selected_gene_list.length;
  document.getElementById('sjb_tab6_label').innerHTML = '<span style="font-size: 80%">(6)</span> Selected genes:' + num;
  document.getElementById('num_selected_genes').innerHTML = num;
  document.getElementById('stringdb_num_selected_genes').innerHTML = num;
  document.getElementById('gprofiler_num_selected_genes').innerHTML = num;
  document.getElementById('david_num_selected_genes').innerHTML = num;
  document.getElementById('selected_genes').innerHTML = selected_gene_list.join(', ');
}

function remove_stringdb_image() {
  document.getElementById('stringEmbedded').innerHTML = "";
}

function show_genes_list_and_enable_stringdb_options() {
  show_selected_genes();
  enable_stringdb_buttons(false);
  enable_gprofiler_button();
  enable_david_button();
  enable_copy_genelist_buttons();

  enable_stringdb_species_radio_group();
}

function select_gene(checkbox) {
  var irow = Number(checkbox.id.substring(1)), // The checkbox has id="c'+i" where i is the row in the logfcs array.
    genename = logfcs[irow][0];

  if (checkbox.checked) selected_gene_list.push(genename);
  else {
    var pos = selected_gene_list.indexOf(genename);
    if (pos == -1) { show_loading_message('ERROR: select_gene() gene=' + genename + ' not in list: ' + selected_gene_list.join(', '), 'red'); }
    else selected_gene_list.splice(pos, 1); // removed the elem without leaving an undefined that delete(pos) would. See: https://www.w3schools.com/js/js_array_methods.asp 
  }
  show_genes_list_and_enable_stringdb_options();
}



var timer3 = null;
function select_genes(all_or_none) {
  // Called by the All or None buttons.
  set_filtering_progress(" <i>Working...</i>");


  // Using this setTimeout so that the above message is displayed, before running the following. Works in Chrome, but doesn't work in Firefox.
  // NOTE: document.getElementById('cbox').checked = false; to change the checked property; NOT .removeAttribute("checked");
  // As onclick="select_gene(this);" is used for the checkbox, then directly changing the checked property below shouldn't call select_gene
  // The setTimeout() method calls a function after a number of milliseconds.

  //alert("selected_gene_list.length="+selected_gene_list.length);

  if (selected_gene_list.length > 0 && selected_gene_list.length < document.getElementById('heatmap_tbody').rows.length && !confirm('Clear the existing selected gene list?\n\n(These ' + selected_gene_list.length + ' genes are currently selected: ' + selected_gene_list.splice(0, 50).join(', ') + '...)')) { return; }

  timer3 = setTimeout(function () {

    // Empty selected list:
    selected_gene_list = [];

    if (all_or_none == 'none') { // clear the selected genes:
      // for (var i=0; i<selected_gene_list.length; i++) document.getElementById('c'+selected_gene_list[i]).checked = false;
      console.log("NONE clicked...");

      for (var i = 1; i < logfcs.length; i++) {
        var cb = document.getElementById('c' + i); // 'c' + row in the logfcs array.
        if (cb) cb.checked = false;
      }

    } else if (all_or_none == 'all') {
      console.log("ALL clicked...");

      /*
      //        for (var i=0; i<selected_gene_list.length; i++) document.getElementById('c'+selected_gene_list[i]).checked = false;
               for (var i=1; i<logfcs.length; i++) { // starts at 1 as the first row is header.
                  var cb = document.getElementById('c'+i);
                  if (cb) cb.checked = false;
               }
              selected_gene_list = [];
            }
      */
      //      alert("ALL clicked...");

      for (var i = 1; i < logfcs.length; i++) {
        var tr = document.getElementById('r' + i);
        if (tr && tr.style.display !== 'none') {
          var cb = document.getElementById('c' + i); // 'c' + row in the logfcs array.
          cb.checked = true; // Not testing for 'if (cb) ...' as cb should exist if tr exists.
          selected_gene_list.push(logfcs[i][0]);
        }
      }


      /*
      Old method: 
       var tbody = document.getElementById('heatmap_tbody');
       var num_rows = tbody.rows.length;
       for (var i=0; i<num_rows; i++) {
         var row = tbody.rows[i];
         if (row.style.display == 'none') continue;
 
         var irow = Number(row.id.substring(1)), // The row has id="r'+i" where i is the row in the logfcs array.
             genename = logfcs[irow][0];
 
         if (selected_gene_list.indexOf(genename) !== -1) {
            if (document.getElementById('c'+irow).checked === false) {alert("ERROR: genename="+genename+" is in the selected_gene_list, but it's checkbox isn't checked."); return false;}
            continue; // This gene is already selected manually.
         }           
         // if (selected_gene_list.length >= 300) break; // As Stringdb won't use more
 
         document.getElementById('c'+irow).checked = true;
 
         selected_gene_list.push(genename);
       } // end of for(var i=...) loop
     */

    }
    else { alert("ERROR: select_genes(): all_or_none param is invalid: " + all_or_none); return false; }

    //To loop through the table cells in the row:
    // var cellLength = row.cells.length;
    //for (var y=0; y<cellLength; y+=1){
    //  var cell = row.cells[y];
    //do something with every cell here
    //}
    show_genes_list_and_enable_stringdb_options();
    set_filtering_progress("");
    timer3 = null;
  }, 10); // end of the setTimeout(

}

function get_selected_gene_row_numbers() {
  var selected_gene_rows = [];

  for (var i = 1; i < logfcs.length; i++) { // correctly starst at i=1, not 0 as first row is headings.
    var cb = document.getElementById('c' + i);
    if (cb && cb.checked) selected_gene_rows.push(i);
  }

  return selected_gene_rows;
}


function show_read_input_data_message(msg, color, append) {
  // Eg: To show the loading table message.

  console.log("A: show_read_input_data_message()", msg, color);

  var elem = document.getElementById('read_input_data_message');

  if (append) elem.innerHTML += msg;
  else elem.innerHTML = msg;

  if (msg == "") elem.style.display = 'none'; // To hide the loading table message.
  else {
    if (elem.style.display === 'none') elem.style.display = '';
    if (color) elem.style.color = color;
  }

  console.log("B: show_read_input_data_message()", msg, color);

  // if do this within a timeout then should show the message instead of waiting until processing has finished.
}




function show_loading_message(msg, color, append) {
  // Eg: To show the loading table message.

  console.log("show_loading_message()", msg, color);

  var elem = document.getElementById('loading_heatmap_message');

  if (append) elem.innerHTML += msg;
  else elem.innerHTML = msg;

  if (msg == "") elem.style.display = 'none'; // To hide the loading table message.
  else {
    if (elem.style.display === 'none') elem.style.display = '';
    if (color) elem.style.color = color;
  }

  console.log("show_loading_message()", msg, color);

  // if do this within a timeout then should show the message instead of waiting until processing has finished.
}


function show_reading_and_loading_messages(msg, color, append) {
  // Show message on both tabs 1 and 2:
  show_read_input_data_message(msg, color, append);
  show_loading_message(msg, color, append);
}



function show_stringdb_message(msg, color) {
  // Eg: To show the loading table message.

  console.log("show_stringdb_message()", msg, color);

  var elem = document.getElementById('stringdb_message');
  elem.innerHTML = msg;
  if (msg == "") elem.style.display = 'none'; // To hide the loading table message.
  else {
    if (elem.style.display === 'none') elem.style.display = '';
    if (color) elem.style.color = color;
  }
  console.log("show_stringdb_message()", msg, color);

  // if do this within a timeout then should show the message instead of waiting until processing has finished.
}



var timer4 = null;
function show_read_input_data_message_now(msg, color) {
  // Show show message immediately when the script is busy loading data.
  // setTimeout(show_loading_message, 0, msg,color); // no brackets after show_loading_message

  // Using this setTimeout so that the above message is displayed, before running the following. Works in Chrome, but doesn't work in Firefox.  
  // The setTimeout() method calls a function after a number of milliseconds.
  timer4 = setTimeout(function () {
    show_read_input_data_message(msg, color);
    timer4 = null;
  }, 10); // end of the setTimeout(
}


var timer5 = null;
function show_loading_message_now(msg, color) {
  // Show show message immediately when the script is busy loading data.
  // setTimeout(show_loading_message, 0, msg,color); // no brackets after show_loading_message

  // Using this setTimeout so that the above message is displayed, before running the following. Works in Chrome, but doesn't work in Firefox.  
  // The setTimeout() method calls a function after a number of milliseconds.
  timer5 = setTimeout(function () {
    show_loading_message(msg, color);
    timer5 = null;
  }, 10); // end of the setTimeout(
}



function start_loading_files(e) {
  var filename = document.getElementById("file_to_read").files[0].name;
  // Jan 2023: show_loading_message("Reading heatmap from file '"+filename+"'. (May take 10+ seconds) ...", 'green'); // Show show message even when busy
  //  - using "+delim_name+" as the column separator
  // BUT the 'show_loading_message' won't update the browser display which script is busy, unless use setTimeout(): https://stackoverflow.com/questions/1257924/page-not-updating-during-busy-javascript-code
}

function show_loading_progress(e) {
  if (e.lengthComputable) {
    //var filename = document.getElementById("file_to_read").files[0].name;
    //console.log("show_loading_progress()",e.loaded, e.total);
    // When downloading a resource using HTTP, this only counts the body of the HTTP message, and doesn't include headers and other overhead.
    //show_loading_message("Reading heatmap from file '"+filename+": " +e.loaded+ " of " +e.total+ " ...", 'green'); // Show show message even when busy
  }
}


function end_loading_files(e) {
  // Is called even if load fails.
  console.log("end_loading_files()", e.loaded, e.total);
}




function valid_file_content(data) {
  if (data.trim() === "") { show_read_input_data_message("This file is empty. Please select another file.", 'red'); return false; }
  if (data.indexOf('"') > -1) { show_read_input_data_message("The file contains quotes (\") so need to use the Vanillaes/csv parser.", 'red'); return false; }
  if (data.indexOf('\\,') > -1) { show_read_input_data_message("The file contains escaped commas (eg: \\,) so need to use the Vanillaes/csv parser.", 'red'); return false; }
  if (data.indexOf('\\\t') > -1) { show_read_input_data_message("The file contains escaped tabs (eg: \\tabcharacter) so need to use the Vanillaes/csv parser.", 'red'); return false; }
  // maybe test for \newline ??

  return true;
}


function get_data_deliminator(line) {
  var delim = ',', delim_name = 'comma'; // could optionally use other characters for the delimiter
  if (line.indexOf('\t') > -1) {
    delim = '\t'; delim_name = 'tab-character';
  } else {
    var num_comma = line.split(',') - 1;  // Number of commas in header line.
    // var num_tab    = line.split('\t') - 1; // Number of tabs in header line.
    var num_semicolon = line.split(';') - 1;  // Number of semi-colons in header line.
    // var num_space     = line.split(' ') - 1;  // Number of spaces in header line.
    if (num_semicolon > num_comma) { delim = ';'; delim_name = 'semi-colon'; }
  }
  return [delim, delim_name];
}



function initialise_global_data(headings) {
  // Code below changes the global variables, so removes the existing data:
  // so headings parm is array: ['Gene'] or ['Protein']

  num_cols = 0; // or 1? // num_cols is global variable.
  logfcs = [headings]; logpvs = [headings];
  pct1s = [headings]; pct2s = [headings];

  logsort = null; // For optional sorting of the heatmap.

  has_pct12_columns = has_pvalues_columns = false;

  fc_amounts = ['0.3', '0.5', '1', '1.5', '2', '2.5', '3', '4', '5'];
  times = []; celltypes = []; // empty the global arrays

  head1 = [headings[0]]; // The "Gene" or "Genename" column.
  head2 = [""];

  gene_dict = {}; // short for: ... = new Object(); used when reading multiple files.

  show_num_filtered_rows(0);
}


function set_fc_min_max_and_num_fc_in_cols() {
  // Initialise to MAX_VALUE (or can use: fc_min = Number.POSITIVE_INFINITY; fc_max = Number.NEGATIVE_INFINITY;)
  fc_min = Number.MAX_VALUE;
  fc_max = - Number.MAX_VALUE;

  num_fc_in_cols = [null]; // number of non-zero fold-changes in each column. Set the zero index value to null as that is the Genename column.

  var num_cols = logfcs[1].length;

  console.log("set_fc_min_max_and_num_fc_in_cols():  num_cols=" + num_cols);

  for (var i = 1; i < logfcs.length; i++) {
    num_fc_in_cols.push(0); // initialise the fold-change count for each column to zero.
    for (var j = 1; j < num_cols; j++) {
      var val = logfcs[i][j];
      //console.log(i,j," val=",val);
      if (val === null) continue;
      if (val < fc_min) fc_min = val;
      if (val > fc_max) fc_max = val;
      if (val != 0) num_fc_in_cols[j]++;
    }
  }
  console.log("set_fc_min_max_and_num_fc_in_cols():  fc_min=" + fc_min + "  fc_max=" + fc_max);
}


function set_celltypes_and_times(head1, head2) {
  console.log(head1, head2);
  for (var i = 1; i < head1.length; i++) { // start at i=1 as first is the 'Gene' col
    if (celltypes.indexOf(head1[i]) === -1) celltypes.push(head1[i]); // top row of headings.
  }

  for (var i = 1; i < head2.length; i++)
    if (times.indexOf(head2[i]) === -1) times.push(head2[i]); // second row of headings, ie. sub-headings.     
}


// Example file from Sara's email:
// "","p_val","avg_log2FC","pct.1","pct.2","p_val_adj"
// "CXCL8",5.2476816314673e-100,-3.16033832258014,0.055,0.686,1.23661617645527e-95
// "CCL4",1.89608153548613e-80,-1.6759541988392,0.072,0.635,4.46811613837307e-76
// "CCL3",8.0617792193165e-76,-2.39341945476018,0.032,0.556,1.89975827303193e-71
// "IL1B",1.08369197998738e-71,-2.54180493284885,0.015,0.496,2.55372015084026e-67



// ** Available fast csv reading libraries: 
// PapaParse is faster as can use worker thread, etc: https://github.com/mholt/PapaParse
// and CSV: https://github.com/vanillaes/csv 


/*
Reading CSV files that have quoted text, containing the deliminator:

// Aug 2022:
Joining - not so efficient as then need to remove the quotes at start and end too:

iCurrent = 
val=c[iCurrent];

iNext = ...

val=c[iCurrent];

startQuote = (charAt(0) === '"');

for (iNext = iCurrent; i< ....; i++)

  endQuote = (charAt(val.length-1) == '"')

if (startQuote && !endQuote) {
  iNext ++;
} // Join with next - could have more than one 

else if (!startQuote && endQuote) {
  error: 
}


==========================================================================================

Character by character walk:

after searching a subset of rows ....

for (i=... to ....)

  lastWasQuote=false; ???
  
  c = charAt(i);
  
  switch (c) {
    case sep: ',' or ';' or '\t'

    case '"':
      if (inQuote) {inQuote=false; lastWasQuote=true}
      else { ?? val[] = substr(.....) }

    case '\n': ....

    case '\r': just ignore .....
    default: val += c; 
  }

  if (c == '"') {}
  else if (c == inQuote) {
  
  }
  
  
  read header and first three rows then ask which is the correct column to use ....
  and confirm the deliminator if any question .... - like Excel import csv does.
==========================================================================================
*/

/*
Copied from my python script:


From: https://gpdb.docs.pivotal.io/6-4/admin_guide/load/topics/g-escaping-in-csv-formatted-files.html
"Escaping in CSV Formatted Files: By default, the escape character is a " (double quote) for CSV-formatted files. If you want to use a different escape character, use the ESCAPE clause of COPY, CREATE EXTERNAL TABLE or gpload to declare a different escape character. In cases where your selected escape character is present in your data, you can use it to escape itself."
"Note: In CSV mode, all characters are significant. A quoted value surrounded by white space, or any characters other than DELIMITER, includes those characters. This can cause errors if you import data from a system that pads CSV lines with white space to some fixed width. In this case, preprocess the CSV file to remove the trailing white space before importing the data into Greenplum Database.

RFC-4180, paragraph "If double-quotes are used to enclose fields, then a double-quote appearing inside a field must be escaped by preceding it with another double quote."

InPHP: "Note: Usually an enclosure character is escaped inside a field by doubling it; however, the escape character can be used as an alternative. So for the default parameter values "" and \" have the same meaning. Other than allowing to escape the enclosure character the escape character has no special meaning; it isn't even meant to escape itself."
https://www.php.net/manual/en/function.fgetcsv.php

Note:
The locale settings are taken into account by this function. If LC_CTYPE is e.g. en_US.UTF-8, strings in one-byte encodings may be read wrongly by this function.
https://www.php.net/manual/en/function.str-getcsv.php


According to RFC 4180 fields may contain CRLF which will cause any line reader to break the CSV file. Here is an updated version that parses CSV string:
https://stackoverflow.com/questions/8493195/how-can-i-parse-a-csv-string-with-javascript-which-contains-comma-in-data

// So in the following code: l is current letter, p is previous letter, r is index array or rows??, s means not inside quotes, i is the column in the 'row' array.
'use strict';
function csvToArray(text) {
    let p = '', row = [''], ret = [row], i = 0, r = 0, s = !0, l;
    for (l of text) {
        if ('"' === l) {
            if (s && l === p) row[i] += l; // so is an escaped double-quote ie: ""
            s = !s;  // switch from inside quotes
        }
        else if (',' === l && s) l = row[++i] = '';  // start next column
        else if ('\n' === l && s) { 
            if ('\r' === p) row[i] = row[i].slice(0, -1); // to remove the carriage-return character
            row = ret[++r] = [l = '']; i = 0;
        }
        else row[i] += l; // append this letter
        p = l;
    }
    return ret; // I assume 'ret' containts reference to row rather than a copy of row.
};

let test = '"one","two with escaped """" double quotes""","three, with, commas",four with no quotes,"five with CRLF\r\n"\r\n"2nd line one","two with escaped """" double quotes""","three, with, commas",four with no quotes,"five with CRLF\r\n"';
console.log(csvToArray(test));


===
Alternatively:
function csv2arr(str: string) {
    let line = ["",];
    const ret = [line,];
    let quote = false;

    for (let i = 0; i < str.length; i++) {
        const cur = str[i];
        const next = str[i + 1];

        if (!quote) {
            const cellIsEmpty = line[line.length - 1].length === 0;
            if (cur === '"' && cellIsEmpty) quote = true;
            else if (cur === ",") line.push("");
            else if (cur === "\r" && next === "\n") { line = ["",]; ret.push(line); i++; }
            else if (cur === "\n" || cur === "\r") { line = ["",]; ret.push(line); }
            else line[line.length - 1] += cur;
        } else {
            if (cur === '"' && next === '"') { line[line.length - 1] += cur; i++; }
            else if (cur === '"') quote = false;
            else line[line.length - 1] += cur;
        }
    }
    return ret;
}
// This should be top answer imho. I tested with a large dataset and this function perfoms about twice as fast compared to the current top answer by @ridgerunner. Plus it returns a 2D array and it doesn't rely on regex which makes it much easier to debug and less finicky about data input. – 
// what about supporting a CSV where the first row are the names of the columns?

====
//So Here's a non-regex solution:

function csvRowToArray(row, delimiter = ',', quoteChar = '"'){
    let nStart = 0, nEnd = 0, a=[], nRowLen=row.length, bQuotedValue;
    while (nStart <= nRowLen) {
        bQuotedValue = (row.charAt(nStart) === quoteChar);
        if (bQuotedValue) {
            nStart++;
            nEnd = row.indexOf(quoteChar + delimiter, nStart)
        } else {
            nEnd = row.indexOf(delimiter, nStart)
        }
        if (nEnd < 0) nEnd = nRowLen;
        a.push(row.substring(nStart,nEnd));
        nStart = nEnd + delimiter.length + (bQuotedValue ? 1 : 0)
    }
    return a;
}
// How it works:
// (1) Pass in the csv string in row.
// (2) While the start position of the next value is within the row, do the following:
//        If this value has been quoted, set nEnd to the closing quote.
//        Else if value has NOT been quoted, set nEnd to the next delimiter.
//        Add the value to an array.
//        Set nStart to nEnd plus the length of the delimeter.
// Sometimes it's good to write your own small function, rather than use a library. Your own code is going to perform well and use only a small footprint. In addition, you can easily tweak it to suit your own needs.
============
*/


var test = '"one","two with escaped """" double quotes""","three, with, commas",four with no quotes,"five with CRLF\r\n"\r\n"2nd line one","two with escaped """" double quotes""","three, with, commas",four with no quotes,"five with CRLF\r\n"';


//uncomment Sep 2022:
//From: https://stackoverflow.com/questions/8493195/how-can-i-parse-a-csv-string-with-javascript-which-contains-comma-in-data

//function csvToArray(text) {
function csvToArray(text, delim) {
  var p = '', row = [''], ret = [row], i = 0, r = 0, s = !0, l; // was 'let p =... but that needs ES6
  for (l of text) {
    if ('"' === l) {
      if (s && l === p) row[i] += l;
      s = !s;
    }
    //      else if (',' === l && s) l = row[++i] = '';
    else if (delim === l && s) l = row[++i] = '';
    else if ('\n' === l && s) {
      if ('\r' === p) row[i] = row[i].slice(0, -1);
      row = ret[++r] = [l = '']; i = 0;
    }
    else row[i] += l;
    p = l;
  }
  return ret;
}

//console.log("csvToArray:\n",csvToArray(test));


/*
=====
'use strict';

function csvToArray(text) {
    var p = '', row = [''], ret = [row], i = 0, r = 0, s = !0, l;  // was 'let p =... but that needs ES6
    for (l of text) {
        if ('"' === l) {
            if (s && l === p) row[i] += l;
            s = !s;
        } else if (';' === l && s) l = row[++i] = '';
        else if ('\n' === l && s) {
            if ('\r' === p) row[i] = row[i].slice(0, -1);
            row = ret[++r] = [l = '']; i = 0;
        } else row[i] += l;
        p = l;
    }
    return ret;
};

let test = '"one";"two with escaped """" double quotes""";"three; with; commas";four with no quotes;"five with CRLF\r\n"\r\n"2nd line one";"two with escaped """" double quotes""";"three, with; commas and semicolons";four with no quotes;"five with CRLF\r\n"';

console.log(csvToArray(test));
// ================
*/


//uncomment Sep 2022:

// function csv2arr(str: string) {
//function csv2arr(str) {
function csv2arr(str, delim) {
  let line = ["",];
  const ret = [line,];
  let quote = false;

  for (let i = 0; i < str.length; i++) {
    const cur = str[i];
    const next = str[i + 1];

    if (!quote) {
      const cellIsEmpty = line[line.length - 1].length === 0;
      if (cur === '"' && cellIsEmpty) quote = true;
      //            else if (cur === ",") line.push("");
      else if (cur === delim) line.push("");
      else if (cur === "\r" && next === "\n") { line = ["",]; ret.push(line); i++; }
      else if (cur === "\n" || cur === "\r") { line = ["",]; ret.push(line); }
      else line[line.length - 1] += cur;
    } else {
      if (cur === '"' && next === '"') { line[line.length - 1] += cur; i++; }
      else if (cur === '"') quote = false;
      else line[line.length - 1] += cur;
    }
  }
  return ret;
}

//console.log("csv2arr:\n",csv2arr(test, ','));


// ================
//uncomment Sep 2022:
// From: https://stackoverflow.com/questions/8493195/how-can-i-parse-a-csv-string-with-javascript-which-contains-comma-in-data

function csvRowToArray(row, delimiter = ',', quoteChar = '"') {
  let nStart = 0, nEnd = 0, a = [], nRowLen = row.length, bQuotedValue;
  while (nStart <= nRowLen) {
    bQuotedValue = (row.charAt(nStart) === quoteChar);
    if (bQuotedValue) {
      nStart++;
      nEnd = row.indexOf(quoteChar + delimiter, nStart);
    } else {
      nEnd = row.indexOf(delimiter, nStart);
    }
    if (nEnd < 0) nEnd = nRowLen;
    a.push(row.substring(nStart, nEnd));
    nStart = nEnd + delimiter.length + (bQuotedValue ? 1 : 0);
  }
  return a;
}

// How it works:
// 1. Pass in the csv string in row.
// 2. While the start position of the next value is within the row, do the following:
//    - If this value has been quoted, set nEnd to the closing quote.
//    - Else if value has NOT been quoted, set nEnd to the next delimiter.
//    - Add the value to an array.
//    - Set nStart to nEnd plus the length of the delimeter.

// Sometimes it's good to write your own small function, rather than use a library. Your own code is going to perform well and use only a small footprint. In addition, you can easily tweak it to suit your own needs.
// ==============


function set_heatmap_image_select_columns_checkboxes() { // param was 'headings', but using global head1, head2 now.
  // For selecting columns to plot downloadable heatmap image:
  var checkbox_html = "";
  if (head1.length !== head2.length) { alert("set_heatmap_image_select_columns_checkboxes(): head1.length !== head2.length"); return false; }
  for (var i = 1; i < head1.length; i++) {
    var val = head1[i] + ':' + head2[i];
    checkbox_html += '<input type="checkbox" id="' + i + '" name="headmap_image_select_columns" value="' + val + '">';
  }
  document.getElementById("heatmap_image_select_columns_span").innerHTML = checkbox_html;
}


function parse_single_file(evt, thefilename) {
  console.log("parse_single_file(): ", evt);

  var filename = document.getElementById("file_to_read").files[0].name;

  // This doesn't get get updated, even using setTimeout(..,0) inside show_read_input_data_message_now(..)
  // show_read_input_data_message_now("Reading heatmap from file '"+filename+"' - using "+delim_name+" as the column separator. (May take 10+ seconds) ...", 'green'); // Show show message even when busy

  // var data = e.target.result;

  return parse_single_file_data(evt.target.result, thefilename);
}



//var tab_instructions = 'You can use the above \'<span style="color: black;">(3) Display options\', \'(4) Filter rows\', \'(5) Selected genes</span>\', to browse this heatmap,<br> and the \'<span style="color: black;">(7) g:Profiler\', \'(8) STRING\' or \'(9) DAVID</span>\' tabs to send your selected genes to those servers,<br>and \'<span style="color: black;">(10) Heatmap image</span>\' tab to download the heatmap as an png or jpg image.';
var tab_instructions = "You can use the above tabs:" +
  '<ol start="3" style="text-align:left; list-style: none;">' +
  "<li> (3) '<b>Display options</b>' to show p-values/FDR on the heatmap, and set the row ordering, etc" +
  "<li> (4) '<b>UpSet/Venn</b>' to optionally view an overview UpSet/Venn-diagram-type table," +
  "<li> (5) '<b>Filter rows</b>' to filter the heatmap rows on fold-change and p-value/FDR," +
  "<li> (6) '<b>Selected genes</b>' to select genes/proteins of interest," +
  "<li> (7) '<b>g:Profiler</b>' to send your selected genes to g:Profiler website for functional enrichment analysis," +
  "<li> (8) '<b>STRING</b>' to send your selected genes to STRING website to display Interaction Networks," +
  "<li> (9) '<b>DAVID</b>' to send your selected genes to DAVID website for functional interpretation," +
  "<li> (10) '<b>Heatmap image</b>' to download the heatmap as an png or jpg image," +
  "<li> (11) '<b>Help/Feedback</b>' for help links and sending feedback." +
  "</ol>";

//                        to send your selected genes to those servers



function parse_single_file_data(data, thefilename) {

  if (data.substr(0, 5) !== 'HIVE:') {
    return parse_single_non_hive_file_data(data, thefilename);
    // return parse_multiple_file_data(data, thefilename); // As this is only one file parse_single_file_data
  }

  // Test if selected only one diff gene expression file:
  // if (data.indexOf('avg_log2FC') !== -1 || data.indexOf('avg_logFC')  !== -1 || data.indexOf('p_val_adj')  !== -1 || data.indexOf('p_val') !== -1 ) 

  var lines = data.split(/\r\n|\n/); // windows or linux newlines.
  if (lines.length == 0) { show_read_input_data_message("The file '" + thefilename + "' doesn't contain any lines of data.", 'red'); return false; }
  if (lines.length <= 3) { show_read_input_data_message("The file '" + thefilename + "' contains only one line of data, perhaps the lines need to be separated with new-line characters?", 'red'); return false; }

  if (!valid_file_content(data)) { show_read_input_data_message("This is NOT a valid 'HIVE:' format FILE", 'red', true); return false; } // test if file contains double-quoites or escaped commas

  var delim_info = get_data_deliminator(lines[0]); // check the first line for deliminator - for my HIVE format it will be a tab.
  var delim = delim_info[0], delim_name = delim_info[1];


  //console.log("Loading message");

  //alert("Pausing");

  // lines[0] = lines[0].substr(5); // To remove the starting 'HIVE:' which we've tested for above.

  var hive_parms = lines[0].split(delim); // lines[0] is hive params: HIVE:    Gene_symbol    species/organism.

  if (hive_parms[0] !== 'HIVE:') { alert("ERROR: Expected HIVE formatted input file to start with 'HIVE:'"); return; }

  // Set the gene symbol select:
  document.getElementById('gene_symbol_type').value = hive_parms[1]; // gene/protein symbol.
  gene_symbol_type_changed();

  // Set the species/organism selection, or OTHER:
  set_organism_species_selected(hive_parms[2]); // organism/species. - could be form select list or OTHER.

  var headings = lines[1].split(delim); // lines[1] is the column headings)

  if (headings.length < 2) { show_read_input_data_message("You need at least two columns in your file - eg. gene_name,value1,value2", 'red'); return false; }

  if (['gene', 'genename', 'gene_name', 'protein'].indexOf(headings[0].toLowerCase()) == -1 && !confirm("Expected the first column in the first line to be 'Gene' or 'Genename' or 'Gene_name' or 'Protein'. Continue?")) return false;

  console.log("parse_single_file(): A");

  initialise_global_data(headings); // To empty the global arrays: head1, head2, logfcs, logpvs.

  num_cols = headings.length; // num_cols is global variable.

  console.log("parse_single_file(): B1");

  for (var i = 1; i < num_cols; i++) {
    var c = headings[i].split(':'); // Using a limit 2 would exclude any more any extra ':' are just included in c[1]
    head1.push(c[0]);
    head2.push(c.length > 2 ? c.slice(1).join(':') : c.length > 1 ? c[1] : ""); // so using slice and join to include any extra ':', also Javascript will have c.length = 1 if string has nothing after the ':', eg: 'Retina:'
  }
  console.log("parse_single_file_data(): head1=", head1);
  console.log("parse_single_file_data(): head2=", head2);


  console.log("parse_single_file(): B2");

  // Number() is stricter than parseFloat(): https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseFloat
  // Set by initialise_global_data(): fc_min = Number.MAX_VALUE; fc_max = - Number.MAX_VALUE; // set to max value, or use: fc_min = Number.POSITIVE_INFINITY; fc_max = Number.NEGATIVE_INFINITY;



  // April 2023: Look at line 1 to get number of cols. :::
  // then. if (file_has_pvalues) pv .....
  //if (file_has_pct12) .....  

  // Global:

  // Already checked above for if (lines.length <= 2)  return. and (headings.length < 2)

  has_pvalues_columns = has_pct12_columns = false;

  var f, c = lines[2].split(delim); // lines[2] is the first line of actual values (as [0] is hive params, and [1] is the column headings)
  for (var j = 1; j < c.length; j++) {
    f = c[j].trim().split(':');
    if (f.length > 1) {
      has_pvalues_columns = true;
      if (f.length > 3) has_pct12_columns = true;
    }
  }

  // *** In JS: "Objects and arrays are pushed as a pointer to the original object. Built-in primitive types like numbers or booleans are pushed as a copy."
  // So need to create new Array(num_cols)'s for each line of the input data.
  var fc_row, pv_row, pct1_row, pct2_row;

  for (var i = 2; i < lines.length; i++) { // lines[2] is the first line of actual values (as [0] is hive params, and [1] is the column headings)
    if (lines[i].trim() == "") continue; // skip empty lines, eg. the final line is often empty.
    // if (lines[i].charAt(0) == "#") continue; // optionally ignore comment lines, that start with '#'?

    c = lines[i].split(delim);
    if (c.length != num_cols) { show_reading_and_loading_messages("At line " + (i + 1) + " in the csv file, the number of columns is " + c.length + ", but there are " + num_cols + " headings in the first line:\n" + lines[i], 'red'); return false; }

    fc_row = new Array(num_cols); fc_row[0] = c[0].replace(/</g, '&lt;').replace(/>/g, '&gt;'); // c[0] is the gene_name. Remove any html tag start or end characters from the gene name.
    // Leave this gene column undefined in the pvalue and pct arrays to reduce memory usage. In future I'll put gene into a separate array:
    if (has_pvalues_columns) { pv_row = new Array(num_cols); } // pv_row[0] = c[0];}
    if (has_pct12_columns) {
      pct1_row = new Array(num_cols); // pct1_row[0] = c[0];
      pct2_row = new Array(num_cols); // pct2_row[0] = c[0];
    }

    for (var j = 1; j < c.length; j++) {
      c[j] = c[j].trim();

      if (c[j] === "" || c[j] === "NA") {
        fc_row[j] = null; // So missing values are set to null, not zero. Or could just leave as undefined.
        if (has_pvalues_columns) pv_row[j] = null;
        if (has_pct12_columns) { pct1_row[j] = pct2_row[j] = null; }
      }
      else {
        f = c[j].split(':'); // So can optionally have foldchange:pvalue:pct1:pct2
        // if (f[0] === "") {fc_row[j] = pv_row[j] = pct1_row[j] = pct2_row[j] = null;} // So missing values are set to null, not zero.
        fc_row[j] = Number(f[0]);
        if (isNaN(fc_row[j])) { show_reading_and_loading_messages("ERROR: invalid number: '" + f[0] + "' in " + c[j] + " in line " + (i + 1) + " column " + (j + 1) + ": " + lines[i], 'red'); return false; }
        // console.log("f",i,j,f);

        if (has_pvalues_columns) pv_row[j] = f[1] === "" ? null : Number(f[1]);

        if (has_pct12_columns) {
          pct1_row[j] = f[2] === "" ? null : Number(f[2]);
          pct2_row[j] = f[3] === "" ? null : Number(f[3]);
        }
        // f[0] = f[0].trim();
        //           var val = Number(c[j]); // Number(value) has stricter parsing (than parseFloat(value)), as converts to NaN for arguments with invalid characters anywhere.
        //           c[j] = val;
      }
    }
    //console.log("fc_row:",i,fc_row);       
    logfcs.push(fc_row); // alternatively could first initialise the rows array to the number of (lines.length - 1), then at the end delete any excess lines due to empty lines.

    if (has_pvalues_columns) logpvs.push(pv_row); // p-values and pct1/2 added now to my single-file format.

    if (has_pct12_columns) {
      pct1s.push(pct1_row);
      pct2s.push(pct2_row);
    }

  } // end of: for (var i = 1; i < lines.length; i++) { ...


  console.log("logfcs.length=" + logfcs.length);
  console.log("logpvs.length=" + logpvs.length);

  //for (var i=0; i< logfcs.length; i++) console.log("logfcs:",logfcs[i]);
  //for (var i=0; i< logpvs.length; i++) console.log("logpvs:",logpvs[i]);

  //alert("parse_single_file_data(): A");
  console.log("parse_single_file(): D");

  set_fc_min_max_and_num_fc_in_cols(); // Needs to before show_heatmap()

  set_celltypes_and_times(head1, head2);

  set_heatmap_image_select_columns_checkboxes(); // was headings, but using global head1,head2 now.


  //alert("parse_single_file_data(): B");
  show_heatmap_scale(); // between fc_min and fc_max.
  //alert("parse_single_file_data(): C");
  set_filter_menu_options(); // the fc_amount between fc_min and fc_max
  sort_data(null);

  console.log("parse_single_file_data(): D");

  var thefilename_formatted = "'<i>" + thefilename + "</i>'";
  if (thefilename.indexOf('https://') > -1 || thefilename.indexOf('http://') > -1 || thefilename.indexOf('ftp://') > -1) {
    try {
      var url = new URL(thefilename);
      thefilename_formatted = "'<i>" + url.pathname.substring(url.pathname.lastIndexOf('/') + 1) + "</i>' from: '<i>" + url.origin + "</i>'";
    } catch (err) {
      console.log("Invalid URL format: " + thefilename + " : " + err);
    }
  }

  show_heatmap();

  enable_sjb_tab(2, 3, true); // where tab 2 = 'Select ids/species/columns' tab, and 3 = 'Display options' tab - this Display options tab is shown now for HIVE file.
  enable_sjb_tab(4, 10, false); // To disable the rest of the tabs, as may be opening another set of files after previously loading files.

  //  set_select_ids_species_columns_tab_color('red'); // don't set tab to red for the HIVE data file as HIVE contains the column details.

  show_reading_and_loading_messages("File: " + thefilename_formatted + " read successfully,<br>and <b>Heatmap is shown further below</b>.<br><br>Use the '<b><span style=\"color: white; background-color:red;\">(2) Select ids/species/columns</span></b>' tab (above) to check or select: (a) Gene/Protein identifier type, and (b) Species/Organism.<br><br>" + tab_instructions, 'green');
  show_display_options_message(tab_instructions, 'green');

  // document.getElementById("unknown_column_types_tbody").innerHTML = buff;

  // show is: names_div_types_div or names_types_div or none

  show_select_column_names_and_types_div('none');

  show_input_data_parameters_table(true); // although show_headmap() is inside a timer.


  console.log("parse_single_file_data(): E");
  // show_heatmap_show_image_size();
}






// === 24 July 2023  => Start of edited:


function show_data_still_to_parse_headings_to_user_for_non_hive_single_file(filename, headings) {
  // was: show_data_still_to_non_hive_parse_single_file_headings_to_user
  // Column types - find best for each one:

  //alert("Skipping: show_data_still_to_parse_headings_to_user_for_non_hive_single_file()");
  //return;


  var buff = "";

  for (var i = 0; i < headings.length; i++) {

    var name = headings[i].trim(),
      name_lc = name.toLowerCase(),
      name_split = name.split(/[:\s\-]+/), // using a limit of 2 would ignore any third part. Split on ':' or '-' or space. Not using split on comma here as may be a csv file separated by commas.
      name_split1 = name_split[0].replace(/_/g, ' ').trim(),
      name_split2 = name_split.length < 2 ? "" : name_split.slice(1).join(' ').replace(/_/g, ' ').trim(), // empty for now. BUT can be the part after - as "Items after the limit are excluded."
      type = 'none';

    // Using lowercase:
    if (name_lc.indexOf('protein') > -1) {
      type = 'id';
      name_split1 = 'Protein';
      name_split2 = '';
    }

    else if (name_lc.indexOf('gene') > -1 || name_lc.indexOf('transcript') > -1 || name_lc.indexOf('name') > -1 || name_lc.indexOf('id') > -1) {
      type = 'id';
      name_split1 = 'Gene';
      name_split2 = '';
    }

    else if (name_lc.indexOf('log2fc') > -1 || name_lc.indexOf('logfc') > -1) {
      type = 'fc';
      // Remove the LogFC so that it won't appear in the sub-name column.
      name_split1 = name_split1.replace(/\s*(log2fc|logfc)\s*/i, '');
      name_split2 = name_split2.replace(/\s*(log2fc|logfc)\s*/i, '');
    }

    else if (name_lc.indexOf('p_val_adj') > -1 || name_lc.indexOf('padj') > -1 || name_lc.indexOf('p_val') > -1 || name_lc.indexOf('p_value') > -1 || name_lc.indexOf('pvalue') > -1 || name_lc.indexOf('pv') > -1 || name_lc.indexOf('fdr') > -1) {
      type = 'pv';
      name_split1 = name_split1.replace(/\s*(p_val_adj|p_val|p_value|pv|fdr)\s*/i, '');
      name_split2 = name_split2.replace(/\s*(p_val_adj|p_val|p_value|pv|fdr)\s*/i, '');
    }

    else if ('pct.1' === name_lc) type = 'pct1'; // pct.1 : The percentage of cells where the feature is detected in the first group
    else if ('pct.2' === name_lc) type = 'pct2'; // pct.2 : The percentage of cells where the feature is detected in the second group
    else type = 'none';

    var input_main_name = '<input type="text" id="heading_main_name_' + (i + 1) + '" value="' + name_split1 + '"' + ((type == 'none') ? ' disabled' : '') + '>',
      input_sub_name = '<input type="text" id="heading_sub_name_' + (i + 1) + '" value="' + name_split2 + '"' + ((type == 'none' || type === 'id') ? ' disabled' : '') + '>';

    // input_main_name = input_main_name.replace(':LogFC','').replace(':FDR','').replace(': LogFC','').replace(': FDR',''); // This is done above now. replace is for the Diurnal_duplicates_removed.txt test file.

    // Nov 2023: Not disabling the gene column now: if (type === 'id') {input_main_name = input_main_name.replace('<input','<input disabled'); input_sub_name = input_sub_name.replace('<input','<input disabled');} // As gene id applies to all columns.

    // Nov 2023: The 'disable_input_main_name_and_sub_name()' is disabling the Gene/Protein subname input now:
    var select_type = '<select id="heading_type_' + (i + 1) + '" onchange="disable_input_main_name_and_sub_name(this,' + (i) + ')"> ' +
      '<option value="none"' + (type === 'none' ? ' selected' : '') + '>Don\'t use this column</option> ' +
      '<option value="id"' + (type === 'id' ? ' selected' : '') + '>Gene/Protein ID</option> ' +
      '<option value="fc"' + (type === 'fc' ? ' selected' : '') + '>Fold-change</option> ' +
      '<option value="pv"' + (type === 'pv' ? ' selected' : '') + '>P-value/FDR/q-value</option> ' +
      '<option value="pct1"' + (type === 'pct1' ? ' selected' : '') + '>pct.1: percentage of cells where feature is detected in the first group</option> ' +
      '<option value="pct2"' + (type === 'pct2' ? ' selected' : '') + '>pct.2: percentage of cells where feature is detected in the second group</option> ' +
      '</select>'; //  <option value="other">Other</option> 


    buff += '<tr id="unknown_column_names_and_types_tr_' + (i + 1) + '" draggable="true" ondragstart="dragstart()" ondragover="dragover()" ondragend="dragend()" ondrop="drop()">' +
      '<td style="text-align:left;"> (' + (i + 1) + ')&nbsp; ' + (name === '' ? '<i>[No Heading for this column]</i>' : '<b>' + name + '</b>') + '</td>' +
      '<td>' + input_main_name + '</td>' +
      '<td>' + input_sub_name + '</td> ' +
      '<td>' + select_type + '</td>' +
      '</tr>';
  }

  // Needs: <tr >  <td>......</td> </tr>

  document.getElementById("unknown_column_types_tbody").innerHTML = "";
  document.getElementById("unknown_filenames_tbody").innerHTML = ""; // as only one input file.


  //console.log("unknown_column_names_and_types_tbody:",buff);
  //alert("Not setting unknown_column_names_and_types_tbody");
  document.getElementById("unknown_column_names_and_types_tbody").innerHTML = buff;  // table has style: user-select: none; -webkit-user-select: none; // Safari   maybe:  -ms-user-select: none; /* IE 10+ and Edge */

  // column_column_names_and_types_message

  // show is: names_div_types_div or names_types_div or none

  show_select_column_names_and_types_div('names_types_div');

  show_input_data_parameters_table(true);
}


function disable_input_main_name_and_sub_name(this_select, i) {
  // Nov 2023: The 'disable_input_main_name_and_sub_name()' isn't disabling the Gene/Protein input now:
  document.getElementById("heading_main_name_" + (i + 1)).disabled = (this_select.value === 'none');
  document.getElementById("heading_sub_name_" + (i + 1)).disabled = (this_select.value === 'none' || this_select.value === 'id');
}




var MAX_LINES_TO_READ = 500000; // 5 million rows for now as need to paginate for more. (and 1GBytes in size below)

function parse_single_non_hive_file_data(data, thefilename) {
  // called by: parse_single_file_data(...)


  //  console.log("parse_multiple_files() event=",evt);
  //  var data = evt.target.result;

  // Get the columns names from the filename:
  //var match = filename_regex.exec(thefilename); // whereas filename_regex.test(..) just returns true/false

  // if (match === null && !confirm("This file '"+filename+"' doesn't end with .csv, .tsv or .txt.\nAre you sure you have selected the correct file?\nFilename: '"+filename+"'\n(Press 'Yes' to continue, or 'No' to select another file.)") ) return false;

  //var thefilename_without_extn = (match === null) ? thefilename : match[1];

  // var filename_parts = thefilename_without_extn.split('-'); // using a limit of 2 would ignore any third part.

  //var head1_name = filename_parts[0],
  //    head2_name = filename_parts.length >1 ? filename_parts.slice(1).join('-') : ""; // empty for now. BUT can be the part after - as "Items after the limit are excluded."


  //alert("Skipping parse_single_non_hive_file_data()");
  //enable_sjb_tab(2, 10, true); // the 'Select ids/species/columns' tab
  //return;


  filenames_array.push(thefilename);

  // Get the data in the file:  

  // Format eg: DGEA-Results/uninfectedvsvirus1.csv
  //   "","p_val","avg_log2FC","pct.1","pct.2","p_val_adj"
  //   "MT-ATP6",2.49340207491595e-257,0.491379025422126,0.999,0.979,5.87570198953944e-253
  //   "MT-ND1",1.84459695034627e-171,0.478291215931857,0.986,0.931,4.34679271349099e-167


  // if (!valid_file_content(data)) return false;

  /*
  var lines = data.split(/\r\n|\n/); // windows or linux newlines.
  if (lines.length == 0) {show_loading_message("The file doesn't contain any lines of data.",'red'); return false;}
  if (lines.length == 1) {show_loading_message("The file contains only one line of data, perhaps the lines need to be separated with new-line characters?",'red'); return false;}
  */

  // var delim, delim_name;

  // var delim = '\t'; // Just use tab or comma for now.
  // alert(data.substr(0,500));

  var delim_info = get_data_deliminator(data.substr(0, 500));
  var delim = delim_info[0], delim_name = delim_info[1];
  // alert("delim is: "+delim+" "+delim_name+ " for file: "+thefilename);

  //var arr = csvToArray(data, delim);
  var arr = csv2arr(data, delim); // returns A single empty row if no data: [["",],]
  if (arr.length === 0 || (arr.length === 1 && arr[0].length < 2)) { show_reading_and_loading_messages("ERROR: parse_single_non_hive_file_data(): File is empty: " + thefilename, 'red'); return false; }

  var headings = arr[0]; // should be:

  j_gene_id = 0; // global.

  // Test if selected only one diff gene expression file:
  // if (data.indexOf('avg_log2FC') !== -1 || data.indexOf('avg_logFC')  !== -1 || data.indexOf('p_val_adj')  !== -1 || data.indexOf('p_val') !== -1 ) 

  var err = "";

  // Test if this guess is working okay:

  if (arr.length > 1 && arr[1].length >= 1) {
    var gene_id = arr[1][j_gene_id];
    guess_identifier_type_and_species(gene_id);  // BUT THIS ASSUMES COLUMN 0 is GENE or PROTEIN.
  }


  if (err !== "") {
    show_reading_and_loading_messages(err, 'red', true);
    num_files_with_unknown_headings += 1;

    // If read all files, then ask user to identify unknown headings:

    // if (num_files_with_unknown_headings > 0 && (num_files_read + num_files_with_unknown_headings === num_files)) 

    //     return false;
  }


  // initialise_data_still_to_parse(); // clear file_data_arrays, etc to [] - is already called in read_files() or read_from_url()

  add_to_file_data_still_to_parse(arr, headings);
  // Store the file data and column names to parse later after user tells us which columns to use: 
  // file_data_arrays.push(arr);
  // file_heading_arrays.push(headings);


  // April 2023: Not needed here now:
  //  var j_pct1 = headings.indexOf('pct.1');  // pct.1 : The percentage of cells where the feature is detected in the first group
  //  var j_pct2 = headings.indexOf('pct.2');  // pct.2 : The percentage of cells where the feature is detected in the second group


  // Apr 2023: if (num_files_read === num_files && num_files_with_unknown_headings === 0) .... so has finished reading files.
  // So can directly call: parse_multiple_files_after_column_headings_assigned

  //num_files_read ++; // Global - should only be 1 here.
  //num_files = 1;
  // if (num_files_read !== num_files) {alert("parse_multiple_files(): num_files_read !== num_files"); } // num_files_read (and similar to num_cols + 1) is global is number of files.

  show_data_still_to_parse_headings_to_user_for_non_hive_single_file(thefilename, headings);

  enable_sjb_tab(2, 2, true); // the 'Select ids/species/columns' tab
  // enable_sjb_tab(3, 3, false); // the 'Display options' tab. - for non-HIVE files, not showing Display options until after user sets column names & types and heatmap.  
  enable_sjb_tab(3, 10, false); // To disable the rest of the tabs, as may be opening another set of files after previously loading files.

  show_read_input_data_message('<br>&nbsp;<br>File read successfully.<br>&nbsp;<br>Now <b>click the \'<span style="color: white; background-color:red;">(2) Select ids/species/columns</span>\' tab</b> above.', 'green', true);

  set_select_ids_species_columns_tab_color('red');
}



function set_select_ids_species_columns_tab_color(colour) {
  document.getElementById("sjb_tab2_label").style.backgroundColor = colour;
}



var jfc_cols = [], jpv_cols = [], jpct1_cols = [], jpct2_cols = [];
function validate_single_non_hive_file_input_data_parameters() {

  var err1 = "", msg = "", last_main_name = "", last_sub_name = "", // same_name_as_previous_column = false,
    jfc_dict = {}, jpv_dict = {}, jpct1_dict = {}, jpct2_dict = {},
    names = [], // Local and different from headings array.
    types = [],
    names_to_head_index = [],
    rows = document.getElementById("unknown_column_names_and_types_tbody").rows;

  jfc_cols = []; jpv_cols = []; jpct1_cols = []; jpct2_cols = []; j_gene_id = -1;

  if (taxid === "") err1 = "Select the Organism/Species using the drop-down menu above.";
  document.getElementById("organism_species_message").innerHTML = err1; // even if err1 is  empty set to empty.

  //jfc = -1, jpv = -1, jpct1 = -1, jpct2 = -1,

  // Reset these global dictionaries:

  //alert("file_heading_arrays="+file_heading_arrays);

  var headings = file_heading_arrays[0];
  if (rows.length !== headings.length) { alert("ERROR: rows.length !== headings.length"); } // headings isn't used below, just using the rwo ordering now.

  //  for (var i=0; i < headings.length; i++ ) {

  // Using the row ordering now, as user can reorder the rows by dragging them:
  // <tr id="unknown_column_names_and_types_tr_'+(i+1)" ...
  var tr_id_prefix_len = "unknown_column_names_and_types_tr_".length;
  for (var r = 0; r < rows.length; r++) {
    var row = rows[r],
      i = Number(row.id.substring(tr_id_prefix_len)) - 1; // Need -1 as starts ids are (i+1)

    var main_name = document.getElementById("heading_main_name_" + (i + 1)).value.trim(),
      sub_name = document.getElementById("heading_sub_name_" + (i + 1)).value.trim(),
      type = document.getElementById("heading_type_" + (i + 1)).value;

    if (main_name.indexOf(':') > -1) { msg = "Column main name must not contain a colon (':'), but column (" + (i + 1) + ") does: '" + main_name + "'"; alert(msg); show_reading_and_loading_messages(msg, 'red'); return false; } // or I could convert colon to comma, etc.

    if (type === 'select') { msg = "Please select a column type for column (" + (i + 1) + ")"; alert(msg); show_reading_and_loading_messages(msg, 'red'); return false; }

    else if (type === 'none') continue;

    else if (type === 'id') {
      if (j_gene_id !== -1) { msg = "You have selected two columns: (" + (j_gene_id + 1) + ") and (" + (i + 1) + ") for 'Gene/Protein ID'. Please just select one column."; alert(msg); show_reading_and_loading_messages(msg, 'red'); return false; }
      j_gene_id = i;
    }

    else {

      if (main_name == "") {
        if (last_main_name === "") { msg = "You need to set the column name for column (" + (i + 1) + ")"; alert(msg); show_reading_and_loading_messages(msg, 'red'); return false; }
        main_name = last_main_name;
        if (sub_name == "") {
          sub_name = last_sub_name;
          document.getElementById("heading_sub_name_" + (i + 1)).value = sub_name;
        }
        // else {msg = "You need to set the main-column name for column ("+(i+1)+")"; alert(msg); return false;} // OR could assume this main name is same as previous column, ie:  
        // same_name_as_previous_column = true;
        document.getElementById("heading_main_name_" + (i + 1)).value = main_name;
      }

      else if (main_name.toLowerCase() === last_main_name.toLowerCase() && sub_name.toLowerCase() === last_sub_name.toLowerCase()) { // Same sample as previous column:
        console.log("validate_single_non_hive_file_input_data_parameters(): column (" + (i + 1) + ") is same as the previous column.");
        // same_name_as_previous_column = true;
      }

      else {  // Not same sample as previous column, so reset column indexes:
        // same_name_as_previous_column = false; 
        // if (last_main_name)
        // Update the last name/subname:
        last_main_name = main_name;
        last_sub_name = sub_name;
        // but columns don't need to be in order - ie. could have the 4 fold changes, then the four p-values.
        // jfc = jpv = jpct1 = jpct2 = -1; // but don't reset jid
      }
      var key = main_name.toLowerCase() + ':' + sub_name.toLowerCase(); // better to maybe use a different symbol than ':' or check for this symbol
      if (names.indexOf(key) === -1) { names.push(key); types.push(type); names_to_head_index.push(head1.length); head1.push(main_name); head2.push(sub_name); }

      if (type === 'fc') { if (key in jfc_dict) { msg = "At column (" + (i + 1) + "): 'Fold-change' already selected at column (" + (jfc_dict[key] + 1) + ") for this sample"; } jfc_dict[key] = i; }
      else if (type === 'pv') { if (key in jpv_dict) { msg = "At column (" + (i + 1) + "): 'P-value/FDR/q-value' already selected at column (" + (jpv_dict[key] + 1) + ") for this sample"; } jpv_dict[key] = i; }
      else if (type === 'pct1') { if (key in jpct1_dict) { msg = "At column (" + (i + 1) + "): 'pct.1: percentage of cells ....' already selected at column (" + (jpct1_dict[key] + 1) + ") for this sample"; } jpct1_dict[key] = i; }
      else if (type === 'pct2') { if (key in jpct2_dict) { msg = "At column (" + (i + 1) + "): 'pct.2: percentage of cells ....' already selected at column (" + (jpct2_dict[key] + 1) + ") for this sample"; } jpct2_dict[key] = i; }
      else { msg = "Unexpected column type=" + type + " for column (" + (i + 1) + ")"; }
      if (msg !== "") { alert(msg); show_reading_and_loading_messages(msg, 'red'); return false; }
    }

  } // end of: for (var i=0; i < file_heading_arrays.length; i++ ) ...

  // Check all columns have same set of column types
  // has_pct12_columns = false, has_pvalues_columns = false; Are initialised to false already in initialise_global_data()
  if (names.length === 0) { msg = "Please enter columns names, as column names.length === 0"; alert(msg); show_reading_and_loading_messages(msg, 'red'); return false; }
  if (names.length !== types.length) { msg = "ERROR: names.length !== types.length"; alert(msg); show_reading_and_loading_messages(msg, 'red'); return false; }


  //console.log("names:",names);
  //console.log("head1:",head1);
  //console.log("head2:",head2);
  //alert("names");

  var key = names[0], // This 'names' does NOT contain the gene id column, whereas head1 does start with 'Gene' (or 'Protein'), and head2 starts with ''
    key_in_jfc_dict = (key in jfc_dict),
    key_in_jpv_dict = (key in jpv_dict),
    key_in_jpct1_dict = (key in jpct1_dict),
    key_in_jpct2_dict = (key in jpct2_dict);

  if (!key_in_jfc_dict) { msg = "Please select a 'Fold-change' for " + head1[0] + " : " + head2[0]; alert(msg); show_reading_and_loading_messages(msg, 'red'); return false; }

  if (key_in_jpct1_dict !== key_in_jpct2_dict) { msg += "For column (1): pct.1: != pct.2\n\n"; }
  //copy_selected_genes_table_row
  for (var j = 1; j < names.length; j++) {
    var key = names[j], // This 'names' does NOT contain the gene id column, whereas head1 does start with 'Gene' (or 'Protein'), and head2 starts with ''
      type = types[j], // type is not used below at present.
      head_index = names_to_head_index[j]; // head_index should be j+1

    //alert("key="+key);
    if (!(key in jfc_dict)) msg += "You need to set 'Fold-change'\n" + head1[head_index] + " : " + head2[head_index] + " Please select that, or check spelling of name and main name as consistent:\n key: '" + key + "' NOT in " + Object.keys(jfc_dict).toString() + "\n";
    if ((key in jpv_dict) !== key_in_jpv_dict) msg += " 'P-value/FDR/q-value' selected for " + head1[head_index] + " : " + head2[head_index] + " doesn't match first column: '" + head1[1] + "' : '" + head2[1] + "'\n\n";
    if ((key in jpct1_dict) !== key_in_jpct1_dict) msg += " 'pct.1: percentage of cells ....' selected for " + head1[head_index] + " : " + head2[head_index] + " doesn't match that for first column: " + head1[1] + " : " + head2[1] + "\n\n";
    if ((key in jpct2_dict) !== key_in_jpct2_dict) msg += " 'pct.2: percentage of cells ....' selected for " + head1[head_index] + " : " + head2[head_index] + " doesn't match that for first column: " + head1[1] + " : " + head2[1] + "\n\n";
  }


  show_reading_and_loading_messages(msg.replace(/\n/g, '<br>'), 'red'); // even if msg is empty so reset to empty

  if (err1 !== "" || msg !== "") {
    show_validate_input_data_parameters_message("Please correct the data input parameters, as explained above.", 'red');
    alert("Please correct the data input parameters, as explained in red text, for:" + (err1 === "" ? "" : "\n  (b) Organism/Species.") + (msg === "" ? "" : "\n  (c) Column names."));

    if (err1 !== "") document.getElementById("organism_species_anchor").scrollIntoView(); // using this anchor as otherwise the select is hidden behind the table headder
    return false;
  }



  for (var j = 0; j < names.length; j++) { // This 'names' does NOT contain the gene id column,.
    var key = names[j];
    jfc_cols.push(jfc_dict[key]);
    if (key_in_jpv_dict) jpv_cols.push(jpv_dict[key]);
    if (key_in_jpct1_dict) jpct1_cols.push(jpct1_dict[key]);
    if (key_in_jpct2_dict) jpct2_cols.push(jpct2_dict[key]);
  }

  has_pvalues_columns = key_in_jpv_dict;
  has_pct12_columns = key_in_jpct1_dict && key_in_jpct2_dict;

  console.log("jpv_dict:", jpv_dict, "  jpv_cols:", jpv_cols);
  return true;
}



function parse_single_non_hive_file_after_column_headings_assigned() {

  //  file_data_arrays.push(arr);
  //  file_heading_arrays.push(headings);

  show_reading_and_loading_messages("Checking column names and types, and drawing the heatmap ...\n", 'blue');

  initialise_global_data([gene_symbol_type_is_gene_or_protein(true)]); // so parm is ['Gene'] or ['Protein']

  if (!validate_single_non_hive_file_input_data_parameters()) return false; // validate_single_non_hive_file_input_data_parameters() gives error message and alert box.

  if (j_gene_id === -1) { alert("Gene/Protein column is NOT assigned."); return false; }
  // if (j_fc === -1) {alert("Fold-change column is NOT assigned"); return false;}


  if (num_files_read !== 1 || num_files !== 1) { alert("parse_single_non_hive_file_after_column_headings_assigned(): num_files_read(=" + num_files_read + ") != 1  OR  num_files=" + num_files + " != 1"); return false; } // num_files_read (and similar to num_cols + 1) is global is number of files.

  // Don't really need these for the single non hive file:
  if (num_files !== file_data_arrays.length) { alert("num_files !== file_data_arrays.length"); return false; }
  if (file_data_arrays.length !== file_heading_arrays.length) { alert("file_data_arrays.length !== file_heading_arrays.length"); return false; }

  // Just initialises logfc,logpvs,etc to [['Gene',],] or [['Protein',]]  
  // num_cols is global is number of the current file being read.


  /*
  // The above initialise_global_data([gene_symbol_type_is_gene_or_protein(true)]); does:
  function initialise_global_data(headings) {
    // Code below changes the global variables, so removes the existing data:
  
    num_cols = 0; // or 1? // num_cols is global variable.
    logfcs=[headings]; logpvs=[headings];
    pct1s=[headings];  pct2s=[headings];
    
    has_pct12_columns = has_pvalues_columns = false;
      
    fc_amounts = ['0.3', '0.5', '1.0', '1.5', '2.0', '2.5', '3.0'];
    times=[]; celltypes=[]; // empty the global arrays
  
    head1 = [headings[0]]; // The "Gene" or "Genename" column.
    head2 = [""];
  
    gene_dict = {}; // short for: ... = new Object(); used when reading multiple files.
  
  } 
  */



  //alert("parse_multiple_files_after_column_headings_assigned(): head1="+head1);

  // num_files_read = 0; // global var is reset to zero here.

  // var col_num = 0; // for reading multiple files into the array columns.



  // jheadings is different from file_heading_arrays
  for (var j = 1; j < head1.length; j++) { // j correctly starts at 1 here as logfcs[0][0] is already set to Gene, and head1[0] is already set to Gene by the above initialise_global_data(...)
    logfcs[0].push(head1[j] + (head2[j] === "" ? "" : ':' + head2[j])); // To match the format for single my file data, so we can easily write data in my single-file format.
  }
  // var key = head1[j] + ':' + head2[j];


  // col_num++;  // incremented here so is ifile+1. col_num is global, and set to zero by initialise_global_data above. Is correctly incremented here before logfcs[0].push(head1[col_num] as head1[col_num] is 'Gene' which is already in 

  // BUT logfcs[0][0] is already set to 'Gene' and head1[0] is also 'Gene' so will get logfcs[0]= ['Gene','Gene', ..], so need to use ifile+1 ie:  logfcs[0].push(head1[ifile+1]

  var lines = file_data_arrays[0],
    thefilename = filenames_array[0];

  // returns A single empty row if no data: [["",],]


  // *** In JS: "Objects and arrays are pushed as a pointer to the original object. Built-in primitive types like numbers or booleans are pushed as a copy."
  // So need to create new Array(num_cols)'s for each line of the input data.

  var num_cols_in_file = lines[0].length,
    num_cols = head1.length,
    num_fc_cols = jfc_cols.length,
    fc_row, pv_row, pct1_row, pct2_row;

  if (num_fc_cols !== num_cols - 1) alert("num_fc_cols=" + num_fc_cols + " !== num_cols-1=" + (num_cols - 1));

  for (var i = 1; i < lines.length; i++) { // arr[1] is the first line of actual values (as arr[0] is the column headings)
    // if (lines[i].trim() == "") continue; // skip empty lines, eg. the final line is often empty.
    // if (lines[i].charAt(0) == "#") continue; // optionally ignore comment lines, that start with '#'?

    if (i > MAX_LINES_TO_READ) { alert("parse_single_non_hive_file_after_column_headings_assigned(): file contains " + lines.length + " lines, BUT parsed MAX_LINES_TO_READ=" + MAX_LINES_TO_READ); break; }

    var c = lines[i]; // is already split into an array. .split(delim);
    if (c.length != num_cols_in_file) {
      if (c.length === 1 && c[0].trim() === "") continue; // As is an empty line - can happen at end of the input file, eg: file: Diurnal_duplicates_removed.txt.
      show_reading_and_loading_messages("At line " + (i + 1) + " in the input file, the number of columns is " + c.length + ", but there are " + num_cols_in_file + " headings in the first line:\n" + c, 'red');
      return false;
    }

    fc_row = new Array(num_cols); fc_row[0] = c[j_gene_id].replace(/</g, '&lt;').replace(/>/g, '&gt;'); // c[0] is the gene_name. Remove any html tag start or end characters from the gene name.
    // Leave this gene column undefined in the pvalue and pct arrays to reduce memory usage. In future I'll put gene into a separate array:
    if (has_pvalues_columns) { pv_row = new Array(num_cols); } // pv_row[0] = fc_row[0];}
    if (has_pct12_columns) {
      pct1_row = new Array(num_cols); // pct1_row[0] = fc_row[0];
      pct2_row = new Array(num_cols); // pct2_row[0] = fc_row[0];
    }

    for (var j = 0; j < num_fc_cols; j++) {

      // console.log(j,"jfc_cols=",jfc_cols,"  jfc=",jfc, c, "  c[jfc]=",c[jfc]);
      //alert("j="+j);
      var jfc = jfc_cols[j],
        fc = c[jfc].trim();

      if (fc === "" || fc === "NA") { // DeSeq2 R uses NA 
        fc_row[j + 1] = null; // So missing values are set to null, not zero. Or could just leave as undefined.
        if (has_pvalues_columns) pv_row[j + 1] = null;
        if (has_pct12_columns) { pct1_row[j + 1] = pct2_row[j + 1] = null; }
      }
      else {
        // f = c[j].split(':'); // So can optionally have foldchange:pvalue:pct1:pct2
        // if (f[0] === "") {fc_row[j] = pv_row[j] = pct1_row[j] = pct2_row[j] = null;} // So missing values are set to null, not zero.
        fc_row[j + 1] = Number(fc); // The j+1 is becuase the first col is gene name.
        if (isNaN(fc_row[j + 1])) { show_reading_and_loading_messages("ERROR: invalid number: '" + fc + "' in line " + (i + 1) + " column " + (jfc + 1) + ": " + lines[i], 'red'); return false; }
        // console.log("f",i,j,f);
        //console.log("j=",j,"  jpv_cols[j]=",jpv_cols[j], "c=",c);
        if (has_pvalues_columns) { var jpv = jpv_cols[j]; pv_row[j + 1] = c[jpv] === "" ? null : Number(c[jpv]); }

        if (has_pct12_columns) {
          var jpct1 = jpct1_cols[j]; pct1_row[j + 1] = c[jpct1] === "" ? null : Number(c[jpct1]);
          var jpct2 = jpct2_cols[j]; pct2_row[j + 1] = c[jpct2] === "" ? null : Number(c[jpct2]);
        }
        // f[0] = f[0].trim();
        //           var val = Number(c[j]); // Number(value) has stricter parsing (than parseFloat(value)), as converts to NaN for arguments with invalid characters anywhere.
        //           c[j] = val;
      }
    }
    //console.log("fc_row:",i,fc_row);       

    //       console.log("fc_row",i,fc_row);

    logfcs.push(fc_row); // alternatively could first initialise the rows array to the number of (lines.length - 1), then at the end delete any excess lines due to empty lines.

    if (has_pvalues_columns) logpvs.push(pv_row); // p-values and pct1/2 added now to my single-file format.

    if (has_pct12_columns) {
      pct1s.push(pct1_row);
      pct2s.push(pct2_row);
    }

  } // end of: for (var i = 1; i < lines.length; i++) ...


  set_fc_min_max_and_num_fc_in_cols(); // Needs to before show_heatmap()

  set_celltypes_and_times(head1, head2);

  set_heatmap_image_select_columns_checkboxes(); // was headings, but using the global head1,head2 arrays now.

  show_heatmap_scale(); // between fc_min and fc_max.
  set_filter_menu_options(); // the fc_amount between fc_min and fc_max
  sort_data(null);

  show_heatmap();

  show_hide_download_single_data_file_link(true); // I show this later if read multiple DGE files.

  show_reading_and_loading_messages(tab_instructions, 'green');
  show_display_options_message(tab_instructions, 'green');

  // draw_heatmap_show_image_size();
  //  }
  //  else if (col_num > num_files) {alert("ERROR: parse_multiple_files(): col_num="+col_num+" > num_files="+num_files); return false;}
  //  else {alert("ERROR: num_files_read(="+num_files_read+") !== num_files(="+num_files+")"); return false;} // This shouldn't happen.


  return true; // for success.
}


// === 24 July 2023  => first End of edited.


// === 24 July 2023  => End of edited.





var file_data_arrays, filenames_array, file_heading_arrays, unknown_column_types_array, unknown_column_types_file_indexes, unknown_column_types_column_indexes;

function initialise_data_still_to_parse() {
  console.log("initialise_data_still_to_parse()");
  file_data_arrays = [];
  filenames_array = [];
  file_heading_arrays = [];
  unknown_column_types_array = [];
  unknown_column_types_file_indexes = [];
  unknown_column_types_column_indexes = [];
}

//   filenames_array.push(filename); - read-add this later.
function add_to_file_data_still_to_parse(arr, headings) {
  // Store the file data and column names to parse later after user tells us which columns to use: 
  file_data_arrays.push(arr);
  file_heading_arrays.push(headings);
  var file_index = file_data_arrays.length - 1;

  for (var i = 0; i < headings.length; i++) {
    var pos = unknown_column_types_array.indexOf(headings[i]);
    if (pos === -1) {
      unknown_column_types_array.push(headings[i]); // the column heading text
      unknown_column_types_column_indexes.push([i]); // index of this column in heading array.
      unknown_column_types_file_indexes.push([file_index]); // index of the file containing this heading.
    }
    else {
      unknown_column_types_column_indexes[pos].push(i); // index of this column in heading array.
      unknown_column_types_file_indexes[pos].push(file_index); // index of the file containing this heading.
    }
  }
  console.log("unknown_column_types_array:", unknown_column_types_array, "  unknown_column_types_file_indexes", unknown_column_types_file_indexes, "  unknown_column_types_column_indexes:", unknown_column_types_column_indexes);
}


function array_unique_items(arr) {
  var unique = [];
  for (var i = 0; i < arr.length; i++)
    if (unique.indexOf(arr[i]) === -1)
      unique.push(arr[i])

  // or EJ6: return arr.filter( function (value, index, array) {return array.indexOf(value) === index;} ); // returning true to filter keeps the item in the resulting array.

  return unique;
}


function array_increment_items_and_join(arr, sep, use_brackets) {
  var arr2 = [];
  if (use_brackets)
    for (var i = 0; i < arr.length; i++) arr2.push('(' + (arr[i] + 1) + ')');
  else
    for (var i = 0; i < arr.length; i++) arr2.push(arr[i] + 1);

  return arr2.join(sep);
}


function array_contents_differ(a, b) {
  if (a.length !== b.length) return true;
  var as = sort(a), bs = sort(b);
  for (var i = 0; i < as.length; i++)
    if (as[i] !== bs[i]) return true;

  return false;
}
/*  
  var unique_file_heading_array_indexes = [0];
  
  for (var i=1; i<file_heading_arrays.length; i++) { // start at i=1 as 0 will always be unique as is the first.

    for (var j=0; j<unique_file_heading_array_indexes.length; j++) { // start at j=0
      if (array_contents_differ( file_heading_arrays[i], file_heading_arrays[unique_file_heading_array_indexes[j]] ) 
        unique_file_heading_array_indexes.push(j);
    }
  }
*/


function show_data_still_to_parse_headings_to_user_for_multiple_files() {

  // Column types - find best for each one:
  var types = [];


  for (var i = 0; i < unknown_column_types_array.length; i++) {

    var name = unknown_column_types_array[i].toLowerCase(),
      type;

    // Using lowercase, as name is sert to lowercase above:
    if (['', 'gene_id', 'protein_id', 'genesymbol', 'id', 'row.names'].indexOf(name) > -1) type = 'id';
    else if (['avg_log2fc', 'avg_logfc', 'log2fc', 'logfc', 'log2foldchange'].indexOf(name) > -1) type = 'fc';
    else if (['p_val_adj', 'padj', 'p_val', 'p_value', 'pvalue', 'fdr'].indexOf(name) > -1) {
      type = 'pv';
      // BUT give preference to using 'p_val_adj' instead of the unadjusted 'p_val'
      if (name === 'p_val_adj' && types.indexOf('pv') > -1) types[types.indexOf('pv')] = 'none';
    }
    else if ('pct.1' === name) type = 'pct1'; // pct.1 : The percentage of cells where the feature is detected in the first group
    else if ('pct.2' === name) type = 'pct2'; // pct.2 : The percentage of cells where the feature is detected in the second group
    else type = 'none';
    types.push(type);
  }


  // if (j_gene_id < 0) j_gene_id = 0; // global set to 0.

  // Test if selected only one diff gene expression file:
  // if (data.indexOf('avg_log2FC') !== -1 || data.indexOf('avg_logFC')  !== -1 || data.indexOf('p_val_adj')  !== -1 || data.indexOf('p_val') !== -1 ) 


  //  if (j_fc < 0) warn = "Warning: Neither 'avg_log2FC' [average log2-fold-change], nor 'avg_logFC' [average log-fold-change] columns were found in the file headings of '"+thefilename+"'.<br>";
  //  else if (j_fc === 0) warn += "Warning: parse_multiple_files(): Expected Gene or Protein as the first column heading of file: '"+thefilename+"', but found column heading is: "+headings[j_fc]+"<br>";

  //  if (j_pvalue < 0) warn += "Warning: p-value/FDR/q-value column 'p_val_adj' or 'p_val' or 'p_value' NOT found in the file headings of file: '"+thefilename+"'";
  //  else if (j_pvalue === 0) warn += "Warning: parse_multiple_files(): Expected Gene or Protein as the first column heading of file: '"+thefilename+"', but found column heading is: "+headings[j_pvalue];


  // Test if this guess is working okay:
  // if (num_files_read===0 && arr.length > 1 && arr[1].length >= 1) {
  //   var gene_id = arr[1][j_gene_id];
  //   guess_identifier_type_and_species(gene_id);  // BUT THIS ASSUMES COLUMN 0 is GENE or PROTEIN.
  // }


  var buff = "";
  for (var i = 0; i < unknown_column_types_array.length; i++) {

    var name = unknown_column_types_array[i],
      type = types[i],
      in_files,
      in_cols = array_increment_items_and_join(array_unique_items(unknown_column_types_column_indexes[i]), ',', false);

    if (unknown_column_types_file_indexes[i].length !== filenames_array.length) { // so column only occurs in some of the input files, not all. 
      in_files = array_increment_items_and_join(unknown_column_types_file_indexes[i], ',', true); // don't need to do unique as the file indexes will be unique. true adds () arround each integer.
    }
    else in_files = "All";

    var select_type = '<select id="heading_type_' + (i + 1) + '" data-in_files="' + in_files + '" data-in_cols="' + in_cols + '" data-name="' + name + '"> ' +
      '<option value="none"' + (type === 'none' ? ' selected' : '') + '>Don\'t use this column</option> ' +
      '<option value="id"' + (type === 'id' ? ' selected' : '') + '>Gene/Protein ID</option> ' +
      '<option value="fc"' + (type === 'fc' ? ' selected' : '') + '>Fold-change</option> ' +
      '<option value="pv"' + (type === 'pv' ? ' selected' : '') + '>P-value/FDR/q-value</option> ' +
      '<option value="pct1"' + (type === 'pct1' ? ' selected' : '') + '>pct.1: percentage of cells where feature is detected in the first group</option> ' +
      '<option value="pct2"' + (type === 'pct2' ? ' selected' : '') + '>pct.2: percentage of cells where feature is detected in the second group</option> ' +
      '</select>'; //  <option value="other">Other</option> 

    if (in_files !== "") in_files = " in files: " + in_files;
    buff += '<tr><td> ' + (in_cols + in_files) + ' </td>' +
      '<td style="text-align:left;">' + (name === '' ? '<i>[No Heading for this column]</i>' : '<b>' + name + '</b>') + '</td>' +
      '<td>' + select_type + '</td></tr>';

    // <span id="heading_type_name_'+(i+1)+'">' +name+ '</span> - using data-name instead now.
  }
  document.getElementById("unknown_column_types_tbody").innerHTML = buff;



  // File names-> Column name & sub-name:
  buff = "";
  for (var i = 0; i < filenames_array.length; i++) {
    //    var unknown_column_types_array[i].split('_')

    // Get the columns names from the filename:

    var filename = filenames_array[i].trim();

    var match = filename_regex.exec(filename); // whereas filename_regex.test(..) just returns true/false
    // if (match === null && !confirm("This file '"+filename+"' doesn't end with .csv, .tsv or .txt.\nAre you sure you have selected the correct file?\nFilename: '"+filename+"'\n(Press 'Yes' to continue, or 'No' to select another file.)") ) return false;
    var thefilename_without_extn = (match === null) ? filename : match[1];

    var filename_parts = thefilename_without_extn.split(/[\s\-]+/); // using a limit of 2 would ignore any third part.

    //console.log("show_data_still_to_parse_headings_to_user_for_multiple_files",thefilename_without_extn," parts:",filename_parts);

    var head1_name = filename_parts[0].replace('_', ' '),
      head2_name = filename_parts.length > 1 ? (filename_parts.slice(1).join('-').replace('_', ' ')) : ""; // empty for now. BUT can be the part after - as "Items after the limit are excluded."

    var input_main_name = '<input type="text" id="heading_main_name_' + (i + 1) + '" value="' + head1_name + '" size="30">',
      input_sub_name = '<input type="text" id="heading_sub_name_' + (i + 1) + '" value="' + head2_name + '" size="30">';

    buff += '<tr id="unknown_filenames_tr_' + (i + 1) + '" draggable="true" ondragstart="dragstart()" ondragover="dragover()" ondragend="dragend()" ondrop="drop()">' +
      '<td style="text-align:left;"> (' + (i + 1) + ')&nbsp; <b>' + filenames_array[i].trim() + '</b></td>' +
      '<td>' + input_main_name + '</td><td>' + input_sub_name + '</td></tr>';
  }
  document.getElementById("unknown_filenames_tbody").innerHTML = buff;  // table has style: user-select: none; -webkit-user-select: none; // Safari   maybe:  -ms-user-select: none; /* IE 10+ and Edge */

  document.getElementById("unknown_column_names_and_types_tbody").innerHTML = "";

  // show is: names_div_and_types_div or names_types_div or none

  show_select_column_names_and_types_div('names_div_and_types_div');

  show_input_data_parameters_table(true);

  //alert("2 num_files_read="+num_files_read);
}




function show_select_column_names_and_types_div(show) {
  // show is: names_div_types_div or names_types_div or none
  if (['names_div_and_types_div', 'names_types_div', 'none'].indexOf(show) === -1) { alert("show_select_column_names_and_types_div(): Unexpected show=" + show); return; }
  document.getElementById("select_column_names_div").style.display = show === 'names_div_and_types_div' ? '' : 'none';
  document.getElementById("select_column_types_div").style.display = show === 'names_div_and_types_div' ? '' : 'none';
  document.getElementById("select_column_names_and_types_div").style.display = show === 'names_types_div' ? '' : 'none';
  document.getElementById("show_heatmap_with_column_names_and_types_button").style.display = show !== 'none' ? '' : 'none';
}


function show_input_data_parameters_table(show) {
  document.getElementById("input_data_parameters_table").style.display = show ? '' : 'none';
}



function validate_input_data_parameters_for_multiple_files() {

  var err1 = ""
  if (taxid === "") err1 = "Select the Organism/Species using the drop-down menu above.";

  document.getElementById("organism_species_message").innerHTML = err1;

  // File names-> Column name & sub-name:
  var err2 = "", names = [];

  // head1 and head2 are global arrays, and are already initialised to ["Gene",], ["Gene",]. (or "Protein")

  j_gene_id = j_fc = j_pvalue = j_pct1 = j_pct2 = -1; // Global. Set to -1, as 0 is first column.


  var rows = document.getElementById("unknown_filenames_tbody").rows; // not .rows()

  if (rows.length !== filenames_array.length) { alert("ERROR: rows.length=" + rows.length + " !== filenames_array.length=" + filenames_array.length); } // headings isn't used below, just using the rwo ordering now.


  // for (var i=0; i<filenames_array.length; i++) {
  // //   var unknown_column_types_array[i].split('_')

  var tr_id_prefix_len = "unknown_filenames_tr_".length; // AS: <tr id="unknown_filenames_tr_'+(i+1)+'" ....
  // Using the row ordering now, as user can reorder the rows by dragging them:
  for (var r = 0; r < rows.length; r++) {

    // There shouldn't be any duplicates...
    var row = rows[r],
      i = Number(row.id.substring(tr_id_prefix_len)) - 1, // Need -1 as starts ids are (i+1)
      filename = filenames_array[i],
      main_name = document.getElementById('heading_main_name_' + (i + 1)).value.trim(),
      sub_name = document.getElementById('heading_sub_name_' + (i + 1)).value.trim();

    if (main_name === "") { err2 += "Main name is EMPTY for file: " + filename + "<br>"; continue; }

    var name = main_name + ':' + sub_name;

    var j = names.indexOf(name);
    if (j >= 0) { err2 += name + " for file: " + filename + " is also assigned to file: " + filenames_array[j] + "<br>"; continue; }

    names.push(name);
    head1.push(main_name);
    head2.push(sub_name);
  }
  document.getElementById("column_names_message").innerHTML = err2;

  //alert("4 num_files_read="+num_files_read);

  var err3 = "", types = [];

  for (i = 0; i < unknown_column_types_array.length; i++) {
    var type_elem = document.getElementById('heading_type_' + (i + 1)),
      type = type_elem.value,
      type_text = type_elem.options[type_elem.selectedIndex].text,
      name = type_elem.getAttribute('data-name'),
      in_files = type_elem.getAttribute('data-in_files'),
      in_cols = type_elem.getAttribute('data-in_cols'),
      col_index = i;

    if (in_cols.indexOf(',') > -1) { err3 += "'" + name + "' occurs in more than one column index: " + in_cols + "<br>"; continue; }
    col_index = Number(in_cols) - 1;

    // Set the global column number variables:
    if (type !== "none" && types.indexOf(type) >= 0 && in_files === "All") { err3 += "'" + type_text + "' type is used twice. You can only assign it to one column.<br>"; continue; }
    // 'none' can be used for several columns.

    if (type === 'id') { if (j_gene_id !== -1 && j_gene_id !== col_index) { err3 += "Gene/Protein ID has two different column indexes.<br>"; continue; } else { j_gene_id = col_index; } }
    else if (type === 'fc') { if (j_fc !== -1 && j_fc !== col_index) { err3 += "Fold-change has two different column indexes.<br>"; continue; } else { j_fc = col_index; } }
    else if (type === 'pv') { if (j_pvalue !== -1 && j_pvalue !== col_index) { err3 += "P-value has two different column indexes.<br>"; continue; } else { j_pvalue = col_index; } }
    else if (type === 'pct1') { if (j_pct1 !== -1 && j_pct1 !== col_index) { err3 += "pct.1 has two different column indexes.<br>"; continue; } else { j_pct1 = col_index; } }
    else if (type === 'pct2') { if (j_pct2 !== -1 && j_pct2 !== col_index) { err3 += "pct.2 has two different column indexes.<br>"; continue; } else { j_pct2 = col_index; } }
    else if (type !== 'none') { err3 += "Unexpected column type='" + type + "'<br>"; continue; }

    types.push(type);
  }

  if (j_gene_id === -1) err3 += "You need to set one column to type: 'Gene/Protein ID'<br>";
  if (j_fc === -1) err3 += "You need to set one column to type: 'Fold-change'<br>";

  document.getElementById("column_types_message").innerHTML = err3;


  if (err1 !== "" || err2 !== "" && err3 !== "") {
    show_validate_input_data_parameters_message("Please correct the data input parameters, as explained above.", 'red');
    alert("Please correct the data input parameters, as explained in red text, for:" + (err1 === "" ? "" : "\n  (b) Organism/Species.") + (err2 === "" ? "" : "\n  (c) Column names.") + (err3 === "" ? "" : "\n  (d) Column types."));

    if (err1 !== "") document.getElementById("organism_species_anchor").scrollIntoView(); // using this anchor as otherwise the select is hidden behind the table headder
    return false;
  }

  show_validate_input_data_parameters_message("Creating/Updating the heatmap below....", 'green');

  show_reading_and_loading_messages(tab_instructions, 'green');
  show_display_options_message(tab_instructions, 'green');

  return true;
}




function parse_multiple_files(evt, thefilename) {
  // console.log("parse_multiple_files() event=",evt);
  // var data = evt.target.result;
  parse_multiple_file_data(evt.target.result, thefilename);
}


function parse_multiple_file_data(data, thefilename) {
  //  console.log("parse_multiple_files() event=",evt);
  //  var data = evt.target.result;

  // Get the columns names from the filename:
  var match = filename_regex.exec(thefilename); // whereas filename_regex.test(..) just returns true/false
  // if (match === null && !confirm("This file '"+filename+"' doesn't end with .csv, .tsv or .txt.\nAre you sure you have selected the correct file?\nFilename: '"+filename+"'\n(Press 'Yes' to continue, or 'No' to select another file.)") ) return false;
  var thefilename_without_extn = (match === null) ? thefilename : match[1];

  var filename_parts = thefilename_without_extn.split(/[\s\-]+/); // using a limit of 2 would ignore any third part.

  //var head1_name = filename_parts[0],
  //    head2_name = filename_parts.length >1 ? filename_parts.slice(1).join('-') : ""; // empty for now. BUT can be the part after - as "Items after the limit are excluded."

  filenames_array.push(thefilename);

  // Get the data in the file:  

  // Format eg: DGEA-Results/uninfectedvsvirus1.csv
  //   "","p_val","avg_log2FC","pct.1","pct.2","p_val_adj"
  //   "MT-ATP6",2.49340207491595e-257,0.491379025422126,0.999,0.979,5.87570198953944e-253
  //   "MT-ND1",1.84459695034627e-171,0.478291215931857,0.986,0.931,4.34679271349099e-167


  // if (!valid_file_content(data)) return false;

  /*
  var lines = data.split(/\r\n|\n/); // windows or linux newlines.
  if (lines.length == 0) {show_loading_message("The file doesn't contain any lines of data.",'red'); return false;}
  if (lines.length == 1) {show_loading_message("The file contains only one line of data, perhaps the lines need to be separated with new-line characters?",'red'); return false;}
  */

  // var delim, delim_name;

  // var delim = '\t'; // Just use tab or comma for now.
  // alert(data.substr(0,500));

  var delim_info = get_data_deliminator(data.substr(0, 500));
  var delim = delim_info[0], delim_name = delim_info[1];
  // alert("delim is: "+delim+" "+delim_name+ " for file: "+thefilename);

  //var lines = csvToArray(data, delim);
  var lines = csv2arr(data, delim); // returns A single empty row if no data: [["",],]
  if (lines.length === 0 || (lines.length === 1 && lines[0].length < 2)) { show_reading_and_loading_messages("ERROR: parse_multiple_files(): File is empty: " + thefilename, 'red'); return false; }

  var headings = lines[0]; // headings should be:   ["","p_val","avg_log2FC","pct.1","pct.2","p_val_adj"]
  var headings_lc = new Array(headings.length);
  for (var j = 0; j < headings.length; j++) headings_lc[j] = headings[j].toLowerCase();

  // alert(headings_lc); // eg: row.names,log2foldchange,pvalue

  j_gene_id = -1; // global set to -1



  /*
    The following is moved into: show_data_still_to_parse_headings_to_user_for_multiple_files()
    
    if (j_gene_id < 0) j_gene_id = headings_lc.indexOf('genesymbol');
    if (j_gene_id < 0) j_gene_id = headings_lc.indexOf('genename');
    if (j_gene_id < 0) j_gene_id = headings_lc.indexOf('proteinname');
    if (j_gene_id < 0) j_gene_id = headings_lc.indexOf('id');
    if (j_gene_id < 0) j_gene_id = 0; // global set to 0.
  
    // Test if selected only one diff gene expression file:
    // if (data.indexOf('avg_log2FC') !== -1 || data.indexOf('avg_logFC')  !== -1 || data.indexOf('p_val_adj')  !== -1 || data.indexOf('p_val') !== -1 ) 
  
    var warn="", err = "";
  
    Doing this test in 
    // These 'j_fc', etc are gobal now.
    j_fc = headings_lc.indexOf('avg_log2fc'); // avg_log2FC check for alternative names for this column.
    if (j_fc < 0) j_fc = headings_lc.indexOf('avg_logfc'); // avg_logFC
    if (j_fc < 0) j_fc = headings_lc.indexOf('logfc'); // avg_logFC
    if (j_fc < 0) j_fc = headings_lc.indexOf('log2fc'); // avg_logFC
    if (j_fc < 0) j_fc = headings_lc.indexOf('log2foldchange');
    if (j_fc < 0) warn = "Warning: Neither 'avg_log2FC' [average log2-fold-change], nor 'avg_logFC' [average log-fold-change] columns were found in the file headings of '"+thefilename+"'.<br>";
    else if (j_fc === 0) warn += "Warning: parse_multiple_files(): Expected Gene or Protein as the first column heading of file: '"+thefilename+"', but found column heading is: "+headings[j_fc]+"<br>";
  
    var j_pvalue = headings.indexOf('p_val_adj');
    if (j_pvalue < 0) j_pvalue = headings_lc.indexOf('p_val');
    if (j_pvalue < 0) j_pvalue = headings_lc.indexOf('p_value');
    if (j_pvalue < 0) j_pvalue = headings_lc.indexOf('pvalue');
    if (j_pvalue < 0) warn += "Warning: p-value/FDR/q-value column 'p_val_adj' or 'p_val' or 'p_value' NOT found in the file headings of file: '"+thefilename+"'";
    else if (j_pvalue === 0) warn += "Warning: parse_multiple_files(): Expected Gene or Protein as the first column heading of file: '"+thefilename+"', but found column heading is: "+headings[j_pvalue];
  
  */
  // Test if this guess is working okay:

  add_to_file_data_still_to_parse(lines, headings);
  num_files_for_parsing++;

  //alert("Here .....num_files_read="+num_files_read+"  num_files_for_parsing="+num_files_for_parsing+" lines.length="+lines.length+" lines[1].length="+lines[1].length);

  // num_files_read will be 2 (or the number of files, so need )
  if (num_files_for_parsing === 1 && lines.length > 1 && lines[1].length >= 1) { // so first file as num_files_read===1
    var gene_id = lines[1][0];  // BUT THIS ASSUMES COLUMN 0 is GENE or PROTEIN.
    guess_identifier_type_and_species(gene_id);
  }

  //alert("j_gene_id="+j_gene_id+"  j_fc="+j_fc+"  j_pvalue="+j_pvalue);



  /*
    if (warn !== "" || err !== "") {
  
       show_reading_and_loading_messages(warn + "<br>" + err, 'red');
       num_files_with_unknown_headings += 1;
  
       // If read all files, then ask user to identify unknown headings:
  
       // if (num_files_with_unknown_headings > 0 && (num_files_read + num_files_with_unknown_headings === num_files)) 
   //     return false;
    }
  */


  // April 2023: Not needed here now:
  //  var j_pct1 = headings.indexOf('pct.1');  // pct.1 : The percentage of cells where the feature is detected in the first group
  //  var j_pct2 = headings.indexOf('pct.2');  // pct.2 : The percentage of cells where the feature is detected in the second group


  // Apr 2023: if (num_files_read === num_files && num_files_with_unknown_headings === 0) .... so has finished reading files.
  // So can directly call: parse_multiple_files_after_column_headings_assigned

  // num_files_read ++; // Global.

  // if (num_files_read !== num_files) {alert("parse_multiple_files(): num_files_read !== num_files"); } // num_files_read (and similar to num_cols + 1) is global is number of files.

  if (num_files_for_parsing === num_files) {
    show_data_still_to_parse_headings_to_user_for_multiple_files();
    enable_sjb_tab(2, 2, true); // the 'Select ids/species/columns' tab
    // enable_sjb_tab(3, 3, false); // the 'Display options' tab. - for non-HIVE files, not showing Display options until after user sets column names & types and heatmap.  
    enable_sjb_tab(3, 10, false); // To disable the rest of the tabs, as may be opening another set of files after previously loading files.

    show_read_input_data_message('<br>&nbsp;<br>Files read successfully.<br>&nbsp;<br>Now <b>click the \'<span style="color: white; background-color:red;">(2) Select ids/species/columns</span>\' tab</b> above.', 'green', true);
    set_select_ids_species_columns_tab_color('red');

    //alert("num_files_read="+num_files_read);
  }
}


function parse_multiple_files_after_column_headings_assigned() {

  //  file_data_arrays.push(arr);
  //  file_heading_arrays.push(headings);

  initialise_global_data([gene_symbol_type_is_gene_or_protein(true)]); // so parm is ['Gene'] or ['Protein']

  if (!validate_input_data_parameters_for_multiple_files()) return false; // validate_input_data_parameters_for_multiple_files() gives error message and alert box.

  if (j_gene_id === -1) { alert("Gene/Protein column is NOT assigned."); return false; }
  if (j_fc === -1) { alert("Fold-change column is NOT assigned"); return false; }

  //alert("5 num_files_read="+num_files_read);

  if ((num_files_read + num_files_with_unknown_headings) !== num_files) { alert("parse_multiple_files_after_column_headings_assigned(): num_files_read(=" + num_files_read + ") + num_files_with_unknown_headings(=" + num_files_with_unknown_headings + ")  !== num_files=" + num_files); return false; } // num_files_read (and similar to num_cols + 1) is global is number of files.

  if (num_files !== file_data_arrays.length) { alert("num_files !== file_data_arrays.length"); return false; }
  if (file_data_arrays.length !== file_heading_arrays.length) { alert("file_data_arrays.length !== file_heading_arrays.length"); return false; }


  // Just initialises logfc,logpvs,etc to [['Gene',],] or [['Protein',]]  
  // num_cols is global is number of the current file being read.



  /*
  // The above initialise_global_data([gene_symbol_type_is_gene_or_protein(true)]); does:
  function initialise_global_data(headings) {
    // Code below changes the global variables, so removes the existing data:
  
    num_cols = 0; // or 1? // num_cols is global variable.
    logfcs=[headings]; logpvs=[headings];
    pct1s=[headings];  pct2s=[headings];
    
    has_pct12_columns = has_pvalues_columns = false;
      
    fc_amounts = ['0.3', '0.5', '1.0', '1.5', '2.0', '2.5', '3.0'];
    times=[]; celltypes=[]; // empty the global arrays
  
    head1 = [headings[0]]; // The "Gene" or "Genename" column.
    head2 = [""];
  
    gene_dict = {}; // short for: ... = new Object(); used when reading multiple files.
  
  } 
  */

  //alert("parse_multiple_files_after_column_headings_assigned(): head1="+head1);

  // num_files_read = 0; // global var is reset to zero here.
  var num_files_parsed = 0;  // better to use this local variable instead of num_files_read

  var col_num = 0; // for reading multiple files into the array columns.


  for (var ifile = 0; ifile < file_data_arrays.length; ifile++) {

    var arr = file_data_arrays[ifile],
      thefilename = filenames_array[ifile];
    // returns A single empty row if no data: [["",],]

    col_num++;  // incremented here so is ifile+1. col_num is global, and set to zero by initialise_global_data above. Is correctly incremented here before logfcs[0].push(head1[col_num] as head1[col_num] is 'Gene' which is already in 

    logfcs[0].push(head1[col_num] + (head2[col_num] === "" ? "" : ':' + head2[col_num])); // To match the format for single my file data, so we can easily write data in my single-file format.
    // BUT logfcs[0][0] is already set to 'Gene' and head1[0] is also 'Gene' so will get logfcs[0]= ['Gene','Gene', ..], so need to use ifile+1 ie:  logfcs[0].push(head1[ifile+1]


    // The j_gene j_pvalue are set in 'validate_input_data_parameters_for_multiple_files()'
    has_pvalues_columns = j_pvalue >= 0;
    // alert("has_pvalues_columns="+has_pvalues_columns);
    has_pct12_columns = (j_pct1 >= 0 && j_pct2 >= 0); // Needs to be after initialise_global_data(..) which sets this to false.

    // Start at row 1 of array, as 0 is the header row:
    for (var i = 1; i < arr.length; i++) {
      if (arr[i].length < 2 && arr[i][0] === '') { console.log("arr[" + i + "] is EMPTY for file " + thefilename + " at line " + (i + 1) + " : '" + arr[i] + "'"); continue; } // at end of some files.

      var gene = arr[i][j_gene_id]; // There seems to be a blank line at end so skip this:
      if (gene.trim() === "") { alert("gene is EMPTY for file " + thefilename + " at line " + (i + 1) + " : '" + arr[i] + "'"); continue; }


      //if (gene.startsWith("CLCN5")) alert(arr[i]);

      var fc = arr[i][j_fc], pvalue, pct1, pct2;
      if (fc === "NA") {    // ??  || fc === "NA") { // DeSeq2 R writes:  NA
        // So missing values are set to null, not zero. Or could just leave as undefined.
        fc = null;
        if (has_pvalues_columns) pvalue = null;
        if (has_pct12_columns) { pct1 = pct2 = null; }
      }
      else {
        fc = Number(arr[i][j_fc]);
        if (isNaN(fc)) { show_reading_and_loading_messages("ERROR: invalid 'avg_log2FC' number: col_num=" + col_num + " :" + arr[i][j_fc] + " in line " + (i + 1) + " column " + (j_fc + 1) + ": '" + arr[i] + "'", 'red'); return false; }
        fc = Math.round(100 * fc) / 100; // round to 2 decimal places.

        if (has_pvalues_columns) {
          // Can have a fc value, but a NA for padj, eg: ERROR: invalid pvalue number: col_num=1 :NA in line 26 column 7: 'CLCN5|ENSG00000171365.17,3.79426708186472,5.28255166062205,1.63487990130427,3.23115579095916,0.00123290720478543,NA'      
          pvalue = arr[i][j_pvalue];
          if (pvalue === "NA") pvalue = null; // 1 or 'NA', or NaN ? // null;
          else {
            pvalue = Number(arr[i][j_pvalue]);
            if (isNaN(pvalue)) { show_reading_and_loading_messages("ERROR: invalid pvalue number: col_num=" + col_num + " :" + arr[i][j_pvalue] + " in line " + (i + 1) + " column " + (j_pvalue + 1) + ": '" + arr[i] + "'", 'red'); return false; }
            // pvalue = (pvalue > 0.001) ? Math.round(10000*pvalue)/10000 : (pvalue > 0.000001) ? Math.round(10000000*pvalue)/10000000 : pvalue; // really want significant places.
            pvalue = Number(pvalue.toPrecision(3)); // toPrecision() converts to string
          }
        }

        if (has_pct12_columns) {
          pct1 = arr[i][j_pct1];
          pct2 = arr[i][j_pct2];
        }
      }

      //if (gene.startsWith("CLCN5")) alert("Passed 1: "+arr[i]);
      // or: parseFloat(number.toPrecision(precision))
      // or: Number( my_number.toPrecision(3) )

      // If a row is all NA (ie. null) then don't want to add this row to reduce memory use:

      // var i_row = gene_dict[gene]; i_row will be undefined so just just check for that.
      if (fc === null && !(gene in gene_dict)) continue;

      //if (gene.startsWith("CLCN5")) alert("Passed 2: "+arr[i]);

      // Find the row for this gene in the logfcs array (and logpvs array):
      var i_row;

      if (col_num === 1 || !(gene in gene_dict)) {
        logfcs.push([gene]);
        if (has_pvalues_columns) logpvs.push([gene]);
        // alert("logpvs.push(["+gene+"]);");
        if (has_pct12_columns) { pct1s.push([gene]); pct2s.push([gene]); } // alert("pct1s.push(["+gene+"])");}

        // old: row = logfcs[];
        i_row = logfcs.length - 1; // The index of the row.
        gene_dict[gene] = i_row;    // if (col_num>1) also add: new Array(col_num-1).fill(null);
      }
      else i_row = gene_dict[gene];


      //if (gene.startsWith("CLCN5")) alert("CLCN5: i_row="+i_row);


      var fc_row = logfcs[i_row];

      // Append the fc value to the row: 
      if (fc_row.length > col_num) { var msg = "ERROR: Gene '" + gene + "' occurs more than once in file: " + thefilename; show_reading_and_loading_messages(msg, 'red'); alert(msg); return false; }

      var pv_row;
      if (has_pvalues_columns) pv_row = logpvs[i_row];

      while (fc_row.length < col_num) { // To fill any empty columns:
        fc_row.push(null);
        if (has_pvalues_columns) pv_row.push(null);
      }
      if (fc_row.length !== col_num) { alert("fc_row.length !== col_num"); return false; }
      fc_row.push(fc); // logfcs.
      if (has_pvalues_columns) pv_row.push(pvalue);

      if (has_pct12_columns) {
        var pct1_row = pct1s[i_row],
          pct2_row = pct2s[i_row];
        while (pct1_row.length < col_num) { pct1_row.push(null); pct2_row.push(null); } // To fill any empty columns.
        pct1_row.push(pct1); // Not converting to a number as we're not doing any filtering on these numbers.
        pct2_row.push(pct2);
      }

      //   console.log("gene_dict[gene="+gene+"]=",gene_dict[gene]);
      //  else {
      //  var msg="ERROR: parse_multiple_files(): At col_num="+col_num+", the Gene '"+gene+"' is MISSING from previous file(s)/column(s)"; show_loading_message(msg,'red'); alert(msg); return false;
      //  }


    }
    // Note: This 'in' works for an Object. But beware using the 'in' operator on Array to find data instead of keys:
    //    ("true" in ["true", "false"]) gives false (Because the keys of the above Array are actually 0 and 1)

    num_files_parsed++;



  } // end of:  for (var i=0; i < file_data_arrays.length; i++ ) {




  if (num_files_parsed === num_files) {  // num_files_parsed is local var in this function. // num_files_read (and similar to num_cols + 1) is global is number of files.
    if (num_files_parsed !== num_files_read) { alert("num_files_parsed=" + num_files_parsed + " !== num_files_read=" + num_files_read); }

    for (var i = 1; i < logfcs.length; i++) { // To append any values missing from end of rows:
      var fc_row = logfcs[i],
        pv_row = logpvs[i];
      while (fc_row.length <= col_num) { fc_row.push(null); pv_row.push(null); } // To fill any empty columns at end of the rows.

      if (has_pct12_columns) {
        var pct1_row = pct1s[i],
          pct2_row = pct2s[i];
        while (pct1_row.length <= col_num) { pct1_row.push(null); pct2_row.push(null); }
      }
    }

    if (num_files_parsed !== col_num) { alert("num_files_parsed !== col_num"); }
    num_cols = num_files_parsed + 1;  // +1 as first col is genename

    set_fc_min_max_and_num_fc_in_cols(); // Needs to before show_heatmap()
    set_celltypes_and_times(head1, head2);


    set_heatmap_image_select_columns_checkboxes(); // was headings, but using the global head1,head2 arrays now.

    show_heatmap_scale(); // between fc_min and fc_max.

    set_filter_menu_options(); // the fc_amount between fc_min and fc_max
    sort_data(null);

    /*
    ???
      enable_sjb_tab(2, 3, true); // where tab 2 = 'Select ids/species/columns' tab, and 3 = 'Display options' tab - this Display options tab is shown now for HIVE file.
      enable_sjb_tab(4, 10, false); // To disable the rest of the tabs, as may be opening another set of files after previously loading files.
    */

    console.log("parse_multiple_files_after_column_headings_assigned():", "showing heatmap...");

    show_heatmap();
    show_hide_download_single_data_file_link(true); // I show this later if read multiple DGE files.

    // But the show_heatmap() is delayed so can overwrite the following messages:
    show_reading_and_loading_messages(tab_instructions, 'green');
    show_display_options_message(tab_instructions, 'green');

    console.log("parse_multiple_files_after_column_headings_assigned():", "finished");
    // draw_heatmap_show_image_size();
  }
  else if (col_num > num_files) { alert("ERROR: parse_multiple_files(): col_num=" + col_num + " > num_files=" + num_files); return false; }
  else { alert("ERROR: num_files_parsed(=" + num_files_parsed + ") !== num_files(=" + num_files + ")"); return false; } // This shouldn't happen.


  return true; // for success.
}


function enable_read_from_url_button(this_url_input) {
  if (!this_url_input) this_url_input = document.getElementById("url_to_read");
  document.getElementById("read_from_url_button").disabled = this_url_input.value.trim() === '';
}




function url_to_read_clicked(this_button) {
  var url_to_read = document.getElementById("url_to_read").value.trim(),
    url,
    msg = "";

  show_reading_and_loading_messages(""); // to clear messages.
  show_validate_input_data_parameters_message("");

  if (url_to_read.indexOf('www.') === 0) url_to_read = 'https://' + url_to_read; // or 'http://' BUT www.dropbox fails if just use http:// need https:// Alternatively could first try http:// and if that fails then try https://

  // alert("url_to_read: "+url_to_read);

  if (url_to_read.indexOf('http://') === -1 && url_to_read.indexOf('https://') === -1 && url_to_read.indexOf('ftp://') === -1 && url_to_read.indexOf('ftps://') === -1) {
    msg = "The URL must start with 'http://' or 'https://' and if your web-browser supports 'ftp://' or 'ftps://'";
    show_read_input_data_message(msg, 'red');
    alert(msg);
    return;
  }

  // Test if this URL has valid format:
  try {
    url = new URL(url_to_read);
  } catch (err) {
    msg = "Invalid URL format: " + url_to_read + " : " + err;
    show_read_input_data_message(msg, 'red');
    alert(msg);
    return;
  }

  url_to_read = convert_share_link_to_download_link(url_to_read); // or pass the 'url' instead of this string.
  show_read_input_data_message("Reading from URL: " + url_to_read + " ....", 'blue');

  var url_to_share = window.location.href;

  // or replace the 'url=' link:
  if (url_to_share.indexOf('?url=') === -1 && url_to_share.indexOf('&url=') === -1) url_to_share += (url_to_share.indexOf('?') === -1 ? '?' : '&') + 'url=' + encodeURIComponent(url_to_read);

  var url_to_share_and_copy_button = '<span id="url_to_share_link_to_copy">' + url_to_share + '</span><br><button onclick="copy_url_to_share_link(this);"><b>Optionally</b> copy this link to your Win/Mac clipboard - if you wish to paste this link into email or document</button><span id="url_to_share_link_to_copy_progress" style="color:green;"></span>';

  document.getElementById("url_to_share_message").innerHTML = "URL with 'url=' parameter url-encoded so you can easily share with your team:<br>" + url_to_share_and_copy_button;


  show_heatmap_title('', '');

  initialise_data_still_to_parse(); // If files have unknown headings.

  show_read_input_data_message("Reading file from web url (May take 5+ seconds) ...", 'green', false); // Should show message even when busy

  read_data_from_url(url_to_read); // <-- This is async so need to read the data within that function.
}


// Is global filename_regex now var regex = /^([a-zA-Z0-9\s_\\.\-:]+)(.csv|.tsv|.txt)$/i; // i=case-insensitive. Or:  regex=RegExp('.....','i')
var filename_regex = /([a-zA-Z0-9\s_.\-:\(\)]+)(.csv|.tsv|.txt)$/i; // i=case-insensitive. Or:  regex=RegExp('.....','i')
// when download file again it will contain: (1)
// not including "\\" as filename_to_read on my Mac is: C:\fakepath\retina_dge_coarse_clusters_first_200_genes.csv C:\fakepath\retina_dge_coarse_clusters_first_200_genes.csv


function file_to_read_clicked(this_elem) {
  this_elem.value = ''; // To clear the files  selected. Otherwise if I try to reload the same files as last time the oninput (which calls read_files()) isn't fired in Chrome at least.
  // alert("file_to_read_clicked().....");
}



// If file has commas within quoted text, or escaped commas, then use the vanillaes/csv parser: https://github.com/vanillaes/csv/blob/main/index.js
function read_files(this_elem) {

  // alert("read_files().....");
  show_reading_and_loading_messages(""); // to clear messages.
  show_validate_input_data_parameters_message("");

  show_tool_tables(false);
  show_hide_download_single_data_file_link(false); // I show this later if read multiple DGE files.

  //alert("Skipping read_files()");
  //return;


  if (typeof (FileReader) === "undefined") { show_reading_and_loading_messages("Sorry: This web-browser doesn't support HTML5, so cannot read the data file. Please use a more recent browser version, eg: Chrome 6+, Edge 12+, Firefox 3.6+, IE 10+, Opera 11+, Safari 6+, Vivaldi, or Brave, etc.", 'red'); return false; }
  // For older webrowsers that don't support this RileReader (File System Access API), could use:
  //        browser-fs-access:  https://github.com/GoogleChromeLabs/browser-fs-access
  //    OR: native-file-system-adapter:  https://github.com/jimmywarting/native-file-system-adapter/
  // The FileReader.readAsText is supported by all recent browser versions (from Chrome 6, IE 10, Safari 6, etc): https://developer.mozilla.org/en-US/docs/Web/API/FileReader/readAsText

  var file_to_read = document.getElementById("file_to_read"), // or:  = this_elem; is also used at end of this function to start reading in the file.
    filename_to_read = file_to_read.value.trim();

  num_files = file_to_read.files.length; // num_files is global.


  if (filename_to_read == "" || num_files == 0) { show_read_input_data_message("No file was selected. Please select at least one file.", 'red'); return false; }
  // else if (file_to_read.files.length >1) {read_multiple_files(file_to_read); return;}   // should only happen if specify 'multiple' in the input element 

  // {alert("More than one file was selected"); return;}
  // {show_loading_message("More than one file was selected",'red'); return false;} // should only happen if specify 'multiple' in the input element 
  num_files_with_unknown_headings = 0;
  num_files_read = 0;  // Global
  num_files_for_parsing = 0; // Global

  show_heatmap_title('', '');

  clear_venn_diagram(); // clear the upset/venn table.

  initialise_data_still_to_parse(); // If files have unknown headings.

  show_read_input_data_message("Reading file(s) (May take 10+ seconds) ...", 'green', false); // Should show message even when busy

  var filenames_for_title = "";
  for (var i = 0; i < num_files; i++) {
    var currentfile = file_to_read.files[i],
      filename = currentfile.name,
      filesize = currentfile.size, // The size of the file in bytes.
      file_lastmodified = currentfile.lastModified; // A number specifying the date and time at which the file was last modified, in milliseconds since the UNIX epoch (January 1, 1970 at midnight).

    console.log(i + ": filename_to_read=" + filename_to_read + "\nfilename=" + filename + "\nfilesize=" + filesize + " bytes\nfile_lastmodified=" + file_lastmodified);

    if (filesize > 1024 * 1024 * 1024) { show_reading_and_loading_messages("This file '" + filename + "' too large - as is larger than 1 GBytes (1024 MBytes).", 'red'); return false; }

    var match = filename_regex.exec(filename); // whereas filename_regex.test(..) just returns true/false
    // filename_to_read (fromfile_to_read.value): "If multiple files are selected, the string represents the first selected file. JavaScript can access the other files through the input's files property.
    // If no file is yet selected, the string is "" (empty).
    // The string is prefixed with C:\fakepath\, to prevent malicious software from guessing the user's file structure."

    if (match === null && !confirm("This file '" + filename + "' doesn't end with .csv, .tsv or .txt.\nAre you sure you have selected the correct file?\nFilename: '" + filename + "'\n(Press 'Yes' to continue, or 'No' to select another file.)")) return false;
    console.log("match=", match[0], match[1]);

    if (filenames_for_title !== '') filenames_for_title += ", ";
    filenames_for_title += (match === null) ? filename : match[1];

    num_files_read++; // Global.

    var reader = new FileReader();

    // Not used from June 2022: var file_to_read_input_button = document.getElementById("file_upload_button");

    // As need to access the 'reader.error' then keeping this within this 'read_files()' function
    reader.onerror = function (evt) { var msg = "ERROR: An error occurred while reading file:\n" + reader.error.message; show_reading_and_loading_messages(msg, 'red'); alert(msg); /*file_to_read_input_button.disabled = false;*/ return; }; // needs semi-colon here as starts with:  read.onerror = function (e) {...

    reader.onabort = function (evt) { var msg = "ERROR: Aborted reading of the file:\n" + reader.error.message; show_reading_and_loading_messages(msg, 'red'); alert(msg); /*file_to_read_input_button.disabled = false;*/ return; }; // needs semi-colon here as starts with:  read.onabort = function (e) {...

    reader.onloadstart = start_loading_files;
    reader.onprogress = show_loading_progress;
    reader.onloadend = end_loading_files;

    // if (num_files===1) reader.onload = parse_single_file; // This should pass the event param to parse_single_file function.
    // BUT will also pass the filename to the parse_single_file, so can call parse_multiple_files ?
    if (num_files === 1) {
      reader.onload = (function (thefilename) {
        return function (evt) {
          return parse_single_file(evt, thefilename);
        };
      })(filename);
    } else {
      reader.onload = (function (thefilename) { // from: https://stackoverflow.com/questions/16937223/pass-a-parameter-to-filereader-onload-event
        //var fileName = theFile.name;
        return function (evt) {
          console.log("thefilename:", thefilename);
          console.log("evt.target.result.substring(0,200):", evt.target.result.substring(0, 200));
          return parse_multiple_files(evt, thefilename);
        };
      })(filename);
    }


    /*
    // Also can use: https://stackoverflow.com/questions/44331850/how-to-show-filereader-load-progress-or-loading-icon
    
    reader.onloadstart = function(event) {
        ShowLoadingBar();
    };
    reader.onprogress = function(event) {
        if (event.lengthComputable) {
            if (LoadingBarVisible)
                ShowLoadingBar();
            AddProgress();
        }
    };
    reader.onloadend = function(event) {
        LoadingBarComplete();
    };
    
    // Also reader.onabort = ....
    
    */

    console.log("Reading: " + currentfile);

    // var filename = document.getElementById("file_to_read").files[0].name;
    // The 'true' below should append filename to list
    //    show_loading_message("<br>Reading heatmap from file '"+currentfile.name+"'. (May take 10+ seconds) ...", 'green', true); // Show show message even when busy

    show_reading_and_loading_messages("<br> &nbsp; &nbsp; &nbsp; &nbsp; " + currentfile.name, 'green', true); // true=append. Should show message even when busy

    // Calling inside setTimeout so that the browser will update. See: https://stackoverflow.com/questions/8493195/how-can-i-parse-a-csv-string-with-javascript-which-contains-comma-in-data
    // The setTimeout() method calls a function after a number of milliseconds.
    setTimeout(reader.readAsText(currentfile), 20); // maybe this changes any \r\n to \n ? A second optional 'encoding' parmeter defaults to UTF-8 
    // "JavaScript automatically reads and strips any BOM [byte order mark, which indicates the file's Unicode encoding, eg: "utf-8-sig"] from files read as text with FileReader.readAsText(). 
    // This is true for current versions of Firefox, Chrome and Edge. UTF-8 characters will be correctly decode, whether or not a BOM is found. 
    // Whereas if the file is read with FileReader.readAsBinaryString() the BOM is retained and UTF-8 characters are not decoded."

    // reader.readAsDataURL(currentfile);

  } // end of:  for (var i=0; i<file_to_read.files.length; i++) { ...


  document.getElementById("open_multiple_files_message").style.display = 'none';

  // Not used from June 2022: file_to_read_input_button.disabled = true;
}



function convert_share_link_to_download_link(url) {

  // CORS: server needs to set: Access-Control-Allow-Origin: *
  // DropBox does, but OneDrive doesn't. Not tested with Google drive yet 

  // Try to convert share/copy links to download links: 

  // Could add Box.com, although direct file links to Box need a paid account.

  if (url.indexOf('dropbox.com') > -1 || url.indexOf('dropboxusercontent.com') > -1) {
    url = url.replace('www.dropbox.com', 'dl.dropboxusercontent.com'); // Convert to a dropbox download link.
    if (url.indexOf('?dl=') > -1) url = url.replace('?dl=0', '?dl=1');
    else if (url.indexOf('&dl=') > -1) url = url.replace('&dl=0', '&dl=1');
    else if (url.indexOf('&amp;dl=') > -1) url = url.replace('&amp;dl=0', '&dl=1');
    else url += (url.indexOf('?') === -1 ? '?' : '&') + 'dl=1';
    url += '&raw=1';
    console.log("dropbox download link: " + url);
  }

  //else if (url.indexOf('dropboxusercontent.com') > -1) {
  //  if      (url.indexOf('?dl=') > -1) url = url.replace('?dl=0','?dl=1');
  //  else if (url.indexOf('&dl=') > -1) url = url.replace('&dl=0','&dl=1');
  //  else if (url.indexOf('&amp;dl=') > -1) url = url.replace('&amp;dl=0','&dl=1');
  //  else url += (url.indexOf('?') === -1  ? '?' : '&') + 'dl=1';
  //  url += '&raw=1';
  // }

  else if (url.indexOf('github.com') > -1) {
    // From:              https://github.com/QUB-Simpson-lab/HIVE_browser/blob/main/HIVE_data_21July2023_first50genes.tsv
    // To: https://raw.githubusercontent.com/QUB-Simpson-lab/HIVE_browser/main/HIVE_data_21July2023_first50genes.tsv
    url = url.replace('github.com', 'raw.githubusercontent.com').replace('/blob/', '/'); // Convert to raw.githubusercontent.com link.
  }

  else if (url.indexOf('sharepoint.com') > -1) {
    if (url.indexOf('download=1') === -1) { url += (url.indexOf('?') === -1 ? '?' : '&') + 'download=1'; }  // Convert OneDrive 'copy link' to download link: https://www.sharepointdiary.com/2020/05/sharepoint-online-link-to-document-download-instead-of-open.html
    console.log("onedrive sharepoint download link: " + url);
  }

  else if (url.indexOf('drive.google.com') > -1) {
    var match = url.match(/drive.google.com\/(file|spreadsheets|document)\/d\/([a-zA-Z0-9_\-]+)\//); // FileId is base64 encoded 42 characters. So just ignore the ending view?usp=sharing/
    if (match !== null) {
      var fileType = match[1], fileId = match[2];
      if (fileType !== 'file') alert("Warning: Expected a type 'file' for the google doc, but got: " + fileType);
      if (fileId.length !== 42) alert("Warning: google drive fileId should be 42 charcters, but got: " + fileId.length + " characters: " + fileId);
      url = 'https://drive.google.com/uc?export=download&id=' + fileId; // Google Drive 'share' link: https://drive.google.com/file/d/1Q......Zc4yaXF/view?usp=sharing to download link: https://drive.google.com/uc?export=download&id=1Q7.....aXF
    }
    console.log("google-drive download link: " + url);
  }

  else {
    console.log("Unrecognised download link, so not trying to convert the link format: " + url);
  }

  return url;
}







// https://learn.microsoft.com/en-us/onedrive/developer/rest-api/concepts/working-with-cors?view=odsp-graph-online

function read_data_from_url(url) {

  num_files = 1; // num_files is global.

  num_files_read = 0;
  num_files_for_parsing = 0;
  num_files_with_unknown_headings = 0;

  if (!isOnLine()) alert("Your webbrowser doesn't seem to have a connection to the internet, but will try downloading this file anyway.");

  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true); // true for async.

  // xhr.responseType = 'blob'; // BUT: "Failed to read 'responseText' property from 'XMLHttpRequest': The value is only accessible if the object's 'responseType' is '' or 'text' (was 'blob').
  // so will just use the default response type and convert to blob is needed.

  xhr.timeout = 30000; // time in milliseconds - the default value is 0, which means there is no timeout.

  xhr.onload = function (evt) {
    // var data = xhr.response;
    var contentType = xhr.getResponseHeader('Content-Type');
    //alert("onload(): contentType="+contentType);
    //       if (contentType.indexOf("text") !== 1) { blob ?
    //           return request.responseText;
    //       }   

    // eg: text/csv; charset=utf-8
    if (contentType.indexOf('text/tab-separated-values') === -1 && contentType.indexOf('text/csv') === -1 && contentType.indexOf('text/plain') === -1) {
      var msg = "<b>ERROR: Fetch from Web URL returned an unexpected contant type: " + contentType + " (should be 'text/tab-separated-values' (.tsv files) or 'text/csv' (.csv files) or 'text/plain' (or .txt files) : status=" + xhr.status + " : " + xhr.responseText + "</b>";
      show_read_input_data_message(msg, 'red');
      alert(msg);
      return;
    }

    num_files_read++;

    // if (data === null) return; // As failed to read the data from the web address.

    //console.log("xhr:",xhr);
    console.log("xhr.responseText:", xhr.responseText);

    // could parse the url to extract the filename: 
    // https://www.dropbox.com/scl/fi/oo7n9a9.......h/HIVE_data_19July2023.tsv?rlkey=b1zt8.........2u&dl=0
    var thefilename = url; // just use the url for now:
    parse_single_file_data(xhr.responseText, thefilename);
  };


  xhr.onerror = function (evt) { var msg = "<b>ERROR: Fetch from Web URL was FAILED : status=" + xhr.status + " : " + xhr.responseText + "</b>"; console.log("onerror:", xhr); show_read_input_data_message(msg, 'red'); alert(msg); }; // xhr.responseText
  // BUT: "Failed to read 'responseText' property from 'XMLHttpRequest': The value is only accessible if the object's 'responseType' is '' or 'text' (was 'blob').
  xhr.onabort = function (evt) { var msg = "<b>ERROR: Fetch from Web URL was Aborted : status=" + xhr.status + " : " + xhr.responseText + "</b>"; show_read_input_data_message(msg, 'red'); alert(msg); }; // + xhr.responseText
  xhr.ontimeout = function (evt) { var msg = "<b>ERROR: Fetch from Web URL Timed-Out : status=" + xhr.status + " : " + xhr.responseText + "</b>"; show_read_input_data_message(msg, 'red'); alert(msg); }; // + xhr.responseText

  // xhr.onprogress = function(evt) { var msg = .....; }

  // xhr.progress = function() { .... }
  // The above 'onerror' doesn't give the reason for the error, so using onreadystatechange event here:
  xhr.onreadystatechange = function () { // Call a function when the state changes.
    console.log("onreadystatechange", this.readyState);
    if (this.readyState === XMLHttpRequest.DONE) {  // DONE is 4
      // In local files, status is 0 upon success in Mozilla Firefox so could test: const status = xhr.status;   if (status === 0 || (status >= 200 && status < 400)) {
      // Informational responses (100 – 199)
      // Successful responses (200 – 299)
      // Redirection messages (300 – 399)
      // Client error responses (400 – 499)
      // Server error responses (500 – 599)
      console.log("onreadystatechange: XMLHttpRequest.DONE  status=" + this.status);

      if (this.status === 200) {
        console.log("onreadystatechange: status=200 : OK");

        // Request finished successfully. Do processing here.

        // var url = xhr.responseText;

        //              console.log(url);
        //              alert("POST response="+url);
      }
      else if (this.status === 204) {
        console.log("onreadystatechange 204 : No Content");
      }
      else {
        // List of https://en.wikipedia.org/wiki/List_of_HTTP_status_codes

        // if (status === 0 || (status >= 200 && status < 400)) { // The request has been completed successfully ... console.log(xhr.responseText);
        alert("ERROR: Request returned status-code=" + this.status + " : " + this.statusText + " : " + this.responseText);

        // 400 = Bad Request: The request cannot be fulfilled due to bad syntax.
        // 403 = Forbidden: The request was a valid request, but the server is refusing to respond to it.
        // 404 = Not Found: The requested page could not be found but may be available again in the future.
        // 408 = Request Timeout: The server timed out waiting for the request.
        // etc.
      }
    }
  }; // end of: xhr.onreadystatechange = function() .....

  /*
      var reader = new FileReader();
      reader.readAsDataURL(xhr.response);
      reader.onload =  function(e){
          console.log('DataURL:', e.target.result);
      };
  
  onload = function() {    
  
    };
    */

  try {
    xhr.send();
  } catch (err) {
    msg = "ERROR: Request to web-address failed for: " + url_to_read + " : " + err;
    show_read_input_data_message(msg, 'red');
    alert(msg);
    return false;
  }



  /*
  OR use fetch() with a async or promise:
  
  async function read_data_from_url(url) {
  let response = await fetch(url);
  let data = await response.blob();

  let metadata = {
    type: ' txt ....image/jpeg'
  };
  // Optionally convert blob to a file: let file = new File([data], "test.jpg", metadata);
  // ... do something with the file or return it
  */
}




/*
// Normalise between -4 to +5 (as is:  min= -3.839   max= 4.581 ) or: -5 to +5 

function heatMapColorforValue(value){
  var h = (1.0 - value) * 240
  return "hsl(" + h + ", 100%, 50%)";
}

HSL is:
  Hue is a degree on the color wheel from 0 to 360. 0 is red, 120 is green, 240 is blue.
  Saturation is a percentage value; 0% means a shade of gray and 100% is the full color.
  Lightness is also a percentage; 0% is black, 100% is white.

//This algorithm is based on the 5 color heatmap,
//In this algorithm, the colors corresponding with values are
 0    : blue   (hsl(240, 100%, 50%))
 0.25 : cyan   (hsl(180, 100%, 50%))
 0.5  : green  (hsl(120, 100%, 50%))
 0.75 : yellow (hsl(60, 100%, 50%))
 1    : red    (hsl(0, 100%, 50%))

// from: https://stackoverflow.com/questions/12875486/what-is-the-algorithm-to-create-colors-for-a-heatmap
//       http://www.andrewnoske.com/wiki/Code_-_heatmaps_and_color_gradients

['Amacrine_EARLY', 'Amacrine_MID', 'Amacrine_LATE', 
'Astrocyte_EARLY', 'Astrocyte_MID', 'Astrocyte_LATE', 
'"Bipolar_EARLY', '"Bipolar_MID', '"Bipolar_LATE', 
'Cone_EARLY', 'Cone_MID', 'Cone_LATE', 
'Endothelial_EARLY', 'Endothelial_MID', 'Endothelial_LATE', 
'Horizontal_EARLY', 'Horizontal_MID', 'Horizontal_LATE', 
'Microglia_EARLY', 'Microglia_MID', 'Microglia_LATE', 
'Muller Glia_EARLY', 'Muller Glia_MID', 'Muller Glia_LATE', 
'Pericyte_EARLY', 'Pericyte_MID', 'Pericyte_LATE', 
'RGC_EARLY', 'RGC_MID', 'RGC_LATE', 
'Rod_EARLY', 'Rod_MID', 'Rod_LATE', 
'RPE_EARLY', 'RPE_MID', 'RPE_LATE']

1110004F10Rik [
0, 0.475325809560861, 0, 
0, 0, 0, 
0, 0, 0, 
0, 0, 0, 
0, 0, 0, 
0, 0, 0, 
0, 0, 0, 
0, 0, 0, 
0, 0, 0, 
0, 0, 0, 
0, 0, 0, 
0, 0, 0]

*/


function enable_upload_button() {
  document.getElementById("file_upload_button").disabled = document.getElementById("file_to_read").value.trim() === "";
}



function old_copy_string_to_clipboard(str, msg_span, msg_success, msg_failure) {
  // From: https://techoverflow.net/2018/03/30/copying-strings-to-the-clipboard-using-pure-javascript/
  // See newer browser copy methods: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Interact_with_the_clipboard

  // This is SYNCRONOUS so will return result
  var el = document.createElement('textarea');  // Create new element
  el.style = { position: 'absolute', left: '-9999px' }; // and move outside of view

  //e1.style.position = 'fixed'; // prevent scroll from jumping to the bottom when focus is set on iOS. BUT this stops the script on my iPhone.
  document.body.appendChild(el);
  el.value = str;     // Set value (string to be copied)
  // Maybe add: 


  var result = false, device = "";
  if (navigator.userAgent.match(/ipad|ipod|iphone/i)) {
    // On iOS, Safari need extra settings: https://stackoverflow.com/questions/34045777/copy-to-clipboard-using-javascript-in-ios
    device = "iOS: ";
    //alert(device);
    // create a selectable range:
    var range = document.createRange();
    // convert to editable with readonly to stop iOS keyboard opening??  el.contentEditable = true; el.readOnly = true;
    el.contentEditable = true;  // Maybe:  "contenteditable=true" only belongs to divs. And for <textarea> is not applicable? OR: "If the element holding the text is not inside a <form>, then it must be contenteditable.
    el.readOnly = false;
    range.selectNodeContents(el);

    // select the range
    var s = window.getSelection();
    s.removeAllRanges();
    s.addRange(range);
    el.setSelectionRange(0, str.length); // or a big number, 999999, to cover anything that could be inside the element. or:  e1.value.length fails on my iPhone in safari.
    // The following isn't necessary:
    el.contentEditable = false;
    el.readOnly = true;
  }
  else { // on Android, etc
    el.setAttribute('readonly', '');     // Set non-editable to avoid focus. My note: But on iOS needs to be editable  
    el.select();  // Select text inside element
  }

  try {
    result = document.execCommand('copy');     // Copy text to clipboard
    // returns false if the command is not supported or enabled. 
    // We wrap execCommand() in a try and catch since the 'cut' and 'copy' commands can throw an error in a few scenarios ( https://developers.google.com/web/updates/2015/04/cut-and-copy-commands )
    // In Microsoft Edge (which was fixed in Nov 2017) that: "document.execCommand("copy") always returns false" https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/14080262/ 
    console.log("old_copy_string_to_clipboard():", result);
  }
  catch (err) {
    console.log("FAILED: old_copy_string_to_clipboard():", err);
    result = false;
  }
  // Note: If the user selected anything when you ran the function, this selection will be cleared. If you need to preserve the selection, see this Hackernoon article for a more elaborate solution..
  // Because the execCommand() call is inside a click event handler, you don't need any special permissions here.

  document.body.removeChild(el);    // Remove temporary element

  // Manual copy fallback using prompt:
  //if (!result) {
  //  var isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  //  var copyHotkey = isMac ? '⌘C' : 'CTRL+C';
  //  result = prompt(`Press ${copyHotkey}`, string); // eslint-disable-line no-alert
  //}

  if (msg_span) { msg_span.innerHTML = result ? device + "<span style='color:" + green + "'>" + msg_success + "</span>" : msg_span.innerHTML = device + "<span style='color:" + red + "'>" + msg_failure + "</span>"; }
  return result;
}



/*
This function causes script to fail to run on my Moto G phone (preventing the whole app from running) which has an older version of the Chrome browser
It works okay on my newer Moto Z phone.  
function new_copy_string_to_clipboard(str, msg_span, msg_success, msg_failure) {
  // Is ASYNC and only supported on https: 
  // From: https://developers.google.com/web/updates/2018/03/clipboardapi

   // Alternatively use the newer Clipboard API which is async: https://developers.google.com/web/updates/2018/03/clipboardapi
   // As with many new APIs, navigator.clipboard is only supported for pages served over HTTPS. To help prevent abuse, clipboard access is only allowed when a page is the active tab. Pages in active tabs can write to the clipboard without requesting permission, but reading from the clipboard always requires permission.
   // To make things easier, two new permissions for copy & paste have been added to the Permissions API. The clipboard-write permission is granted automatically to pages when they are the active tab.
  
  // (location.protocol !== 'https:') ||   // navigator.clipboard also works in local "file:" pages.
  if (!navigator.clipboard) {old_copy_string_to_clipboard(str, msg_span, msg_success, msg_failure); return;}

  // This new clipboard API is ASYNC, and using a promise: 
  navigator.clipboard.writeText(str)
    .then(() => {
      console.log('New Clipboard API: Text copied to clipboard');
      msg_span.innerHTML = msg_success;
    })
    .catch(err => {  // This can happen if the user denies clipboard permissions:
      console.error('New Clipboard API: Could NOT copy text, so trying old method now: ', err);
      old_copy_string_to_clipboard(str, msg_span, msg_success, msg_failure); // So try the old method.
      // msg_span.innerHTML = msg_failure;
    });
  // As this is ASYNC then cannot return success or failure from the above writeText() functon call.
  }
*/

/* 
// This also causes error preventing the whole app from running, on my Moto G phone Chrome browser:
// Similarly, we can write this as an async function, then await the return of writeText():
async function new2_copy_string_to_clipboard(str, msg_span, msg_success, msg_failure) {
  // From: https://developers.google.com/web/updates/2018/03/clipboardapi
  // This new clipboard API is ASYNC, so using await:
  if (!navigator.clipboard) {old_copy_string_to_clipboard(str, msg_span, msg_success, msg_failure);}
  try {
    await navigator.clipboard.writeText(str);
    console.log('New Clipboard API: Text copied to clipboard');
    msg_span.innerHTML = msg_success;
  } catch (err) {   // This can happen if the user denies clipboard permissions:
    console.error('New Clipboard API: Could NOT copy text (maybe no permissions, or not using https), so trying old method now: ', err);
    old_copy_string_to_clipboard(str, msg_span, msg_success, msg_failure); // So try the old method.
    // msg_span.innerHTML = msg_failure;
  }
}
*/


function copy_param(param, msg_span_id) {
  var msg_span = document.getElementById(msg_span_id); // msg_span_id is eg: 'myparam_copied_progress'
  return old_copy_string_to_clipboard(param, msg_span, "Copied to clipboard", "Failed to copy to clipboard");
}


function copy_url_to_share_link(this_button) {
  var url = document.getElementById("url_to_share_link_to_copy").innerHTML.trim(),
    msg_span = document.getElementById("url_to_share_link_to_copy_progress"),
    success_msg = "<br>Successfully copied the share url to you clipboard.<br>You can now paste this into an email or Word document, etc, by pressing [Ctrl] V, or right clicking and select 'paste'",
    error_msg = "ERROR: Failed to copy the share url gene to the clipboard - you need to use the mouse to manually select the link text, then either: press [Ctrl] C OR right click and select 'copy' from the popup menu.";

  if (url.indexOf('file://') > -1) success_msg += "<br><b>Note:</b> This link uses the local 'file://' protocol, so needs changed to the web address to share."

  return old_copy_string_to_clipboard(url, msg_span, success_msg, error_msg);
}


function copy_selected_genenames_to_clipboard(this_button) {

  //alert("copy_selected_genenames_to_clipboard");
  // *** Not used at present....*** as just asking people to contact office for details to encourage payment by Skipe.

  // returns false if the copy fails.
  //var buff_names = "SONG NAMES, formatted as: (EasyWorshipSongId) Title [Author]\n";
  //var buff_words = "\n\n\nSONG WORDS:\n";  
  //for (var j=0; j<songs_saved.length; j++) {
  //  var i = songs_saved[j], song_name, song_words;    
  //  if (i<0) {
  //    song_name = 'Song ('+ (-i) + ') NOT found in updated EasyWorship songs list.';
  //    song_words = '';
  //  } else {
  //    song_name = '('+songs[i][0]+')  '+songs[i][1]+ ( songs[i][2]=='' ? '' : '  ['+songs[i][2]+']' );
  //    song_words = songs[i][3]+'\n\n';
  //    }
  //  buff_names += '\n'+song_name+'\n';
  //  buff_words += '\n'+song_name+'\n\n'+song_words;
  //  }


  var msg_span = (this_button.id === "copy_genelist_button_for_david") ? document.getElementById("copy_selected_genenames_message_for_david") : document.getElementById("copy_selected_genenames_message");
  // copy_genelist_button_for_david button is on the DAVID tab.  

  if (selected_gene_list.length == 0) {
    var msg = "No genes are currently selected. Please select genes first.";
    show_progress(msg_span, msg, 'red');
    alert(msg);
    return false;
  }

  var sep = document.getElementById("copy_separator").value;  // space( ), comma(, ), new-line(nl)
  if (sep === "nl") sep = "\n";
  else if (sep === "tab") sep = "\t";

  var buff = selected_gene_list.join(sep);

  // if (selected_gene_list.length > 0 && confirm('Clear the existing selected gene list first?\n\n(These '+selected_gene_list.length+' genes are currently selected: '+selected_gene_list.splice(0,30).join(', ')+'...)')) { // Empty selected list first.

  return old_copy_string_to_clipboard(buff, msg_span, "Successfully copied the " + selected_gene_list.length + " selected genes to clipboard.<br>You can now paste this into another website textarea, or Word document, etc, by pressing [Ctrl] V, or right clicking and select 'paste'", "ERROR: Failed to copy the select gene to the clipboard - you need to use the mouse to manually select this list of genes, then either: press [Ctrl] C OR right click and select 'copy' from the popup menu.");
}




var gprofiler_gost_url = "https://biit.cs.ut.ee/gprofiler/gost";

function gprofiler(this_elem) {
  // Using form post below instead as the length of a get query is limited to 2048 characters, so a post query is better for long list of genes - but POST to gprofiler gives a "405 Not Allowed"
  // "If you are using the GET method, you are limited to a maximum of 2,048 characters, minus the number of characters in the actual path. However, the POST method is not limited by the size of the URL for submitting name/value pairs.
  if (selected_gene_list.length == 0) { alert("You need to select genes first."); return false; }

  // TODO : Nov 2022 : get the 'gprofiler_id' species from select box here.

  var url = gprofiler_gost_url + '?organism=' + gprofiler_id + '&query=' + encodeURIComponent(selected_gene_list.join("\n")); // '%0A' will be the URL-encoding of a newline. eg: https://biit.cs.ut.ee/gprofiler/gost?organism=mmusculus&query=VEGFA%0AVEGFB


  //var url = 'https://biit.cs.ut.ee/gprofiler/gost?organism='+gprofiler_id+'&query=' + encodeURIComponent(selected_gene_list.join("\n")); // '%0A' will be the URL-encoding of a newline. eg: https://biit.cs.ut.ee/gprofiler/gost?organism=mmusculus&query=VEGFA%0AVEGFB
  if (url.length > 2028) { url = url.substring(0, 2048); }
  this_elem.href = url;



  // OR: - see function below: set_gprofiler_genelist()
  // Could set the form fields: <input type="hidden" id="gprofiler_organism" name="organism" value="">
  //                       and: <input type="hidden" id="gprofiler_query_genelist" name="query" value="">
  // Then submit as an http post request:

  // document.getElementById("gprofiler_organism").value = gprofiler_id;
  // document.getElementById("gprofiler_query_genelist".value = selected_gene_list.join("\n");

  return true;
}

/*
Although this url length limit may not apply in newer browsers, eg: https://stackoverflow.com/questions/417142/what-is-the-maximum-length-of-a-url-in-different-browsers
Browser     Address bar   document.location
                          or anchor tag
------------------------------------------
Chrome          32779           >64k
Android          8192           >64k
Firefox          >64k           >64k
Safari           >64k           >64k
IE11             2047           5120
Edge 16          2047          10240
*/




function set_organism_and_genelist(this_button, gprofiler_or_david) {
  // The organism is set by the organism select change event, as the text name needs to be visible before clicking the gprofiler button.
  if (selected_gene_list.length === 0) { alert("You need to select genes first."); return false; }
  if (taxid === "") { alert("You need to select Organism/Species first."); return false; }

  if (gprofiler_or_david === 'gprofiler') {

    document.getElementById("gprofiler_query_genelist").value = selected_gene_list.join("\n");  // DON'T USE AS OTHERWISE %0A APPEARS IN THE GPROFILER FORM:  encodeURIComponent(SELCETC_GENE_LIS...)
    document.getElementById("gprofiler_organism").value = gprofiler_id;

    // As can no longer use POST for gprofiler, then check the url length:

    var progress_elem = document.getElementById("gprofiler_progress"),
      this_form = document.getElementById("gprofiler_form"), // as the this_form above is actually the submit button on the form.
      url = gprofiler_gost_url + '?organism=' + gprofiler_id + '&query=' + encodeURIComponent(selected_gene_list.join("\n")); // '%0A' will be the URL-encoding of a newline. eg: https://biit.cs.ut.ee/gprofiler/gost?organism=mmusculus&query=VEGFA%0AVEGFB

    //var url = 'https://biit.cs.ut.ee/gprofiler/gost?organism='+gprofiler_id+'&query=' + encodeURIComponent(selected_gene_list.join("\n")); // '%0A' will be the URL-encoding of a newline. eg: https://biit.cs.ut.ee/gprofiler/gost?organism=mmusculus&query=VEGFA%0AVEGFB
    if (url.length > 2028) {
      this_form.target = '_self';
      this_form.action = '#gprofiler_table'; // empty reloads the page.
      progress_elem.innerHTML = 'The number of genes selected exceeds the 2028 character limit of a get url.<br>You can use the "Copy selected genes to clipboard" button above (selecting "new-line" to separate the genes)<br>then go to: <a href="' + gprofiler_gost_url + '" target="_blank">' + gprofiler_gost_url + '</a><br>and paste the gene list (using [Ctrl]-V or mouse right-click) into G:Profiler';
      progress_elem.style.color = 'red';
      return false;
    }

    progress_elem.innerHTML = "Redirecting to G:Profiler in a new tab ...";
    progress_elem.style.color = 'green';

    document.getElementById("gprofiler_organism").value = gprofiler_id;
    document.getElementById("gprofiler_query_genelist").value = selected_gene_list.join("\n"); // should be white-space separated. This form field will be encoded by the browser. 

    this_form.target = '_blank';
    this_form.action = gprofiler_gost_url;
    return true;

    // *** BUT: 405 Not Allowed, even with encodeURIComponent(...)

    // So I've set the form method to GET (instead of POST).
    // This form currently opens in a new browser tab. 
    // Alternatively, to open in a new browser window could use:
    //  <form method="post" 
    //      target="print_popup" 
    //      action="/myFormProcessorInNewWindow.aspx"
    //      onsubmit="window.open('about:blank','print_popup','width=1000,height=800');">
    // or:
    // <form action="..." ... onsubmit="window.open('google.html', '_blank', 'scrollbars=no,menubar=no,height=600,width=800,resizable=yes,toolbar=no,status=no');return true;"> 

  }
  else if (gprofiler_or_david === 'david') {



    //https://david.ncifcrf.gov/helps/list_manager.html#list

    //If the gene identifiers are official gene symbols, you will need to enter the species name or Taxon ID (step 2a, this option is not available for other identifiers). At step 3, you will choose the usage of the uploaded gene list ("Gene List" or "Background") followed by submission in step 4.

    //https://david.ncifcrf.gov/api.jsp?type=OFFICIAL_GENE_SYMBOL&ids=MALAT1,VEGFA,FRAT1&tool=summary

    //https://reactome.org/PathwayBrowser/#TOOL=AT

    //https://tools.dice-database.org/

    //https://guides.ucsf.edu/bistats/pathenrich



    // DAVID APIs (alpha) allow other bioinformatics web sites to directly link to DAVID tools and functions ONLY for light-duty jobs (i.e. a gene list with no more than 400 genes).

    // https://david.ncifcrf.gov/api.jsp?type=ENTREZ_GENE_ID&ids=2919,6347,6348,6364&tool=summary
    // https://david.ncifcrf.gov/api.jsp?type=OFFICIAL_GENE_SYMBOL&ids=Prkca%2CH3f3b%2CH2bu2&tool=summary

    // https://david.ncifcrf.gov/api.jsp?type=OFFICIAL_GENE_SYMBOL&ids=VEGFA&tool=summary  (EGR1) MALAT1 ERBB4

    // https://david.ncifcrf.gov/api.jsp?type=OFFICIAL_GENE_SYMBOL&ids=EGR1%2CMALAT1%2CVEGFA%2CEGFR&tool=summary  

    // https://david.ncifcrf.gov/api.jsp?type=ENTREZ_GENE_ID&ids=2919,6347,6348,6364&tool=summary

    //https://david.ncifcrf.gov/api.jsp?type=OFFICIAL_GENE_SYMBOL&ids=H3F3B,CSLC35C2,CPDE7B,CLRI&tool=summary

    //alert("In set_organism_and_genelist(): gprofiler_or_david="+gprofiler_or_david);


    var david_url = "https://david.ncifcrf.gov",
      david_api_url = david_url + "/api.jsp",
      gene_symbol_type = document.getElementById('gene_symbol_type').value,
      david_tool = "summary",
      // david_annot = "",
      progress_elem = document.getElementById("david_progress"),
      msg = "";

    if (gene_symbol_type === "") { alert("Please select the Gene/Protein symbol type using the drop-down menu on the '<span style=\"color: white; background-color:red;\">(2) Select ids/species/columns</span>' tab."); return false; } // this_link.target="_self"; // this_link.href="#gene_symbol_type"; return false;}
    if (gene_symbol_type == "GENE_SYMBOL") gene_symbol_type = "OFFICIAL_GENE_SYMBOL"; // DAVID no longer accepts just "GENE_SYMBOL"
    // add "TRANSCRIPT_SYMBOL"   (eg: ISG15-203)

    // **** Browser will remove any query param eg: ?=..... from the form action: https://stackoverflow.com/questions/1116019/when-submitting-a-get-form-the-query-string-is-removed-from-the-action-url
    // so cannot use this for the : 
    var url = david_api_url + '?type=' + gene_symbol_type + '&tool=' + david_tool + '&ids=' + encodeURIComponent(selected_gene_list.slice(0, 400).join(",").toUpperCase()); // DAVID uses a comma to separate the genes.
    // Not using: + '&annot='+david_annot

    if (selected_gene_list.length > 400) {
      msg += "The number of genes selected exceeds 400 gene limit set by the DAVID API. So *not* all the selected genes will be sent to DAVID webserver.";
    }
    if (url.length > 2028) {
      url = url.substring(0, 2048); // then remove to the final '\n' character.
      msg += 'The number of genes selected exceeds the 2028 character limit of a get url.<br>You can use the "Copy selected genes to clipboard" button above (selecting "new-line" to separate the genes)<br>then go to: <a href="' + david_url + '" target="_blank">' + david_url + '</a><br>and paste the gene list (using [Ctrl]-V or mouse right-click) into DAVID';
    }

    progress_elem.innerHTML = msg !== "" ? msg : "Going to the DAVID website now...";
    if (msg !== "") alert(msg);

    document.getElementById("david_tool").value = "summary";
    document.getElementById("david_gene_type").value = gene_symbol_type;

    document.getElementById("david_ids_genelist").value = selected_gene_list.slice(0, 400).join(",").toUpperCase(); // Comma-separated. This form field will be encoded by the browser.

    var this_form = document.getElementById("david_form"); // as the this_form above is actually the submit button on the form.

    //this_form.method = 'GET';
    //this_form.target = '_blank';
    //this_form.target = '_self';

    this_form.action = david_api_url; // ie. without the params.

    // alert("Setting form action to: "+this_form.action);

    return true;
    // <form method="get" target="_blank" action="?type=xxxxx&ids=XXXXX,XXXXX,XXXXXX,&tool=xxxx&annot=xxxxx,xxxxxx,xxxxx," onclick="set_organism_and_genelist(this, 'david');">
  }

  else { alert("set_organism_and_genelist() Unexpected gprofiler_or_david=" + gprofiler_or_david); return false; }

}

/*
TO FINISH:

==

<!-- (A) DRAW DUMMY CANVAS -->
<canvas id="demo" width="200" height="200"></canvas>
<script>
let ctx = document.getElementById("demo").getContext("2d");
ctx.beginPath();  
ctx.fillRect(0, 0, 100, 100);
ctx.fillRect(50, 50, 100, 100);



==
function candown (target, type) {
  // (B1) GET CANVAS
  let canvas = document.getElementById(target);
 
   // (B2) CREATE LINK
  let anchor = document.createElement("a");
  anchor.download = "download." + type;
  anchor.href = canvas.toDataURL("image/" + type);
 
  // (B3) "FORCE DOWNLOAD"
  anchor.click();
  anchor.remove();
 
  // (B4) SAFER ALTERNATIVE - LET USER CLICK ON LINK
  // anchor.innerHTML = "Download";
  // document.body.appendChild(anchor);
}

=====

  var link = document.getElementById('link');
  link.setAttribute('download', 'MintyPaper.png');
  link.setAttribute('href', canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"));
  link.click();
  
======

From: https://stackoverflow.com/questions/10673122/how-to-save-canvas-as-an-image-with-canvas-todataurl

<canvas width="100" height="100"></canvas>
<div><a href="#" download="image.png">download image</a></div>

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
const anchor = document.querySelector('a');
const rand = i=>Math.random()*i<<0
const fileName = `image${100+rand(100)}.png`;

drawOntoCanvas();
anchor.addEventListener('click', onClickAnchor);

function onClickAnchor(e) {
  if (window.navigator.msSaveBlob) {
    window.navigator.msSaveBlob(canvas.msToBlob(), fileName);
    e.preventDefault();
  } else {
    anchor.setAttribute('download', fileName);
    anchor.setAttribute('href', canvas.toDataURL());
  }
}

function drawOntoCanvas(){
  const size = 100;
  context.fillStyle = 'rgba(255,0,0,0.4)';
  let i = 10;
  while (i--) {
    context.fillRect(rand(size),rand(size),rand(size),rand(size));
  }
}
===== 
*/


function clear_heatmap_show_image_size() {

  document.getElementById("draw_heatmap_show_image_size_text").innerHTML = "";

  /*
  
  var margin = draw_margin;

  // Global:
  draw_col_width  = Number(document.getElementById("download_heatmap_col_width").value);      // 200
  draw_font_size  = Number(document.getElementById("download_heatmap_font_size").value);      // 16
  draw_text_padding = Number(document.getElementById("download_heatmap_text_padding").value); // 7
  draw_row_height = draw_text_padding + draw_font_size + draw_text_padding -1;

 
  if (typeof logfcs === 'undefined' || logfcs === null) {alert("logfcs null"); return;}

  var rows_to_draw = document.getElementById("download_heatmap_rows_to_draw").value;
    
  // Get array of indexes of the rows in draw
  var num_rows = (rows_to_draw === "byfilter") ? filtered_row_list.length : (rows_to_draw === "bycheckbox") ? selected_gene_list.length : (rows_to_draw === "all") ? logfcs.length-1 : -999;
  num_rows += 2; // Add the 2 header (head1 and head2) rows.

  var num_cols = logfcs[0].length,
      iwidth   = num_cols * draw_col_width  + 2 * margin, // Image Width
      iheight  = num_rows * draw_row_height + 2 * margin; // Image Height

      document.getElementById("draw_heatmap_show_image_size").innerHTML = "Image size: &nbsp; Width "+iwidth+" pixels, &nbsp; Height: "+iheight+ " pixels";
*/
}


function show_heatmap_title(fold_change_type, cluster_type) {
  document.getElementById('fold_change_or_pvalue_title').innerHTML = fold_change_type;
  document.getElementById('cluster_type_in_title').innerHTML = cluster_type;  // title = match[1];
  document.getElementById('heatmap_title_text').style.display = (cluster_type || fold_change_type) ? '' : 'none';
}


function show_filter_heatmap_message(msg, color) {
  // The setTimeout() method calls a function after a number of milliseconds.
  //setTimeout(function() {
  var progress_text = document.getElementById("filter_heatmap_message");
  progress_text.innerHTML = msg;
  if (color) progress_text.style.color = color;
  // }, 0.1);
}


function show_display_options_message(msg, color) {
  // The setTimeout() method calls a function after a number of milliseconds.
  //setTimeout(function() {
  var progress_text = document.getElementById("display_options_message");
  progress_text.innerHTML = msg;
  if (color) progress_text.style.color = color;
  // }, 0.1);
}


function show_draw_progress(msg, color) {
  var progress_text = document.getElementById("draw_heatmap_image_progress");
  progress_text.innerHTML = msg;
  if (color) progress_text.style.color = color;
}


function show_validate_input_data_parameters_message(msg, color) {
  var progress_text = document.getElementById("show_validate_input_data_parameters_progress");
  progress_text.innerHTML = msg;
  if (color) progress_text.style.color = color;
}


function show_image_download_progress(msg, color) {
  var progress_text = document.getElementById("download_heatmap_image_progress");
  progress_text.innerHTML = msg;
  if (color) progress_text.style.color = color;
}


function show_download_single_data_file_progress(msg, color) {
  var progress_elem = document.getElementById("download_single_data_file_progress");
  progress_elem.innerHTML = msg;
  if (color) progress_elem.style.color = color;
}


function show_progress(progress_elem_or_id, msg, color) {
  // generic show progress/result message. 
  // progress_elem_or_id can be the id (as a string) or the element ref.
  var progress_elem = (typeof progress_elem_or_id === 'string') ? document.getElementById(progress_elem_or_id) : progress_elem_or_id;
  progress_elem.innerHTML = msg;
  if (color) progress_elem.style.color = color;
  if (progress_elem.style.display === 'none') progress_elem.style.display = '';
}




function draw_heatmap_button_clicked() {
  show_draw_progress("Drawing heatmap image...", 'blue');

  setTimeout(draw_heatmap(), 40); // To let the browser display the above message.
}


function clear_and_shrink_canvas() {
  var canvas = document.getElementById("my_heatmap_canvas"),
    c = canvas.getContext('2d');
  c.clearRect(0, 0, canvas.width, canvas.height);
  canvas.height = canvas.width = 0;
}



var max_canvas_height = 32767;
// In my test on MacAir: On Chrome: 65535 works, but 66000 fails; On Firefox 32767 works, but 33000 causes an 'Uncaught NS_ERROR_FAILURE'.
// This max canvas size is from: https://github.com/jhildenbiddle/canvas-size#test-results and: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas#maximum_canvas_size
// but is lower on Mobile phones/tablets.
function cal_max_heatmap_rows_for_canvas(margin_size, row_height) {
  var num_rows = Math.floor((max_canvas_height - 2 * margin_size) / row_height);
  return num_rows;
}



function draw_heatmap() {
  // This function is partly based on Sanjay Mahto's code:  https://wacky-sam.medium.com/making-table-in-canvas-e453a5e7fb7d

  // (An alternative to this code, is this canvas-table js library: https://github.com/el/canvas-table )
  // Maybe: https://gist.github.com/asimihsan/9275527

  if (typeof logfcs === 'undefined' || logfcs === null || logfcs.length < 2) { var msg = "You need to load data before drawing the heatmap image."; show_draw_progress(msg, 'red'); alert(msg); return false; }
  //alert("draw_and_download_heatmap() 3 ....");  



  // Or use this tiny TEST data:
  if (typeof logfcs === 'undefined' || logfcs === null || logfcs.length < 2) {
    logfcs = [['Gene', 'Early', 'Mid', 'Late'], ['ABC', 5.4, -3, 0], ['DEFG', 1, -4.2, null], ['VEGF', 3.2, -1.8, 3]];
    var fc_min_lower = -5, fc_max_higher = 6;
    fc_hue_factor_red = 60 / fc_max_higher;
    fc_hue_factor_blue = -60 / fc_min_lower;
    // draw_heatmap_show_image_size();
  }

  // for logfcs[0] = ['ABC', 12,56,67], this Object.keys(logfcs[0]) gives: ['0', '1', '2', '3']
  // let bh = (logfcs.length + 1) * 40; // Calculating Border Height Me: The +1 was because original used Object.keys(...) for heading row above.


  // Get array of indexes of the rows in logfcs to draw the headmap image:
  var draw, rows_to_draw = document.getElementById("download_heatmap_rows_to_draw").value;

  if (rows_to_draw === "byfilter") { // Selected by the 'Filter genes'
    draw = filtered_row_list;
    if (draw.length === 0) { var msg = "There are no rows to draw. You need to set the filters above in the 'Filter rows (eg: genes)' box to have some rows to draw."; show_draw_progress(msg, 'red'); alert(msg); return; }
  }
  else if (rows_to_draw === "bycheckbox") { // Selected by the check-boxed rows in the table
    draw = get_selected_gene_row_numbers();
    if (draw.length === 0) { var msg = "You need to select rows to plot using the checkboxes at left of the table below."; show_draw_progress(msg, 'red'); alert(msg); return; }
  }
  else if (rows_to_draw === "all") { // All rows in logfcs
    var n = logfcs.length;
    draw = new Array(n - 1); // create empty array, the -1 is to ignore the header row. 
    for (var i = 1; i < n; i++) draw[i - 1] = i;
    if (draw.length === 0) { var msg = "There are no rows to draw. You need to read the input data files first."; show_draw_progress(msg, 'red'); alert(msg); return; }
  }

  else { var msg = "Unexpected value selected for rows_to_draw=" + rows_to_draw; show_draw_progress(msg, 'red'); alert(msg); return; }

  //  var num_rows = (rows_to_draw === "byfilter") ? filtered_row_list.length : (rows_to_draw === "bycheckbox") ? selected_gene_list.length : (rows_to_draw === "all") ? logfcs.length-1 : -999;

  //Logic to find border width and border height:
  //let bw = (Object.keys(data[0]).length) * 200; //Calculating Border Width

  var margin = Number(document.getElementById("download_heatmap_margin_size").value), // Margin in pixels around the table. default is 7.
    col_width = Number(document.getElementById("download_heatmap_col_width").value),      // 200
    font_size = Number(document.getElementById("download_heatmap_font_size").value),      // 16
    text_padding = Number(document.getElementById("download_heatmap_text_padding").value), // 7
    background_colour = document.getElementById("heatmap_background_colour").value,
    draw_fc_numbers = document.getElementById("draw_fc_numbers").checked,
    row_height = text_padding + font_size + text_padding - 1,
    num_cols = logfcs[0].length, // or head1.length
    num_rows = draw.length + 2,  // Add the 2 header (head1 and head2) rows. 'draw' has no header rows. 'logfcs' includes one header row, but we want head1 and head2 rows so add 1 for num_rows in table.
    bw = num_cols * col_width,   // Border Width
    bh = num_rows * row_height,  // Border Height
    canvas_width = bw + 2 * margin, // Image Width
    canvas_height_needed = bh + 2 * margin, // Image Height
    canvas_height = canvas_height_needed,
    canvas = document.getElementById("my_heatmap_canvas"),
    c = canvas.getContext('2d'),
    msg = "";

  // A rectangle, with a black stroke for borders.
  // vertical and horizontal lines for creating rows and columns in that rectangle.


  if (canvas_height_needed > max_canvas_height) {
    //alert("canvas_height="+canvas_height+" > max_canvas_height="+max_canvas_height+" so reducing num_rows from "+num_rows);
    var original_num_rows = num_rows;
    num_rows = Math.floor((max_canvas_height - 2 * margin) / row_height);
    //alert("so reduced num_rows="+num_rows);
    bh = num_rows * row_height;
    canvas_height = bh + 2 * margin; // Image Height
    msg = "Only drawing " + num_rows + " of the " + original_num_rows + " as otherwise the canvas height needed of " + canvas_height_needed + " pixels exceeds the maximum canvas height " + max_canvas_height + " pixels allowed by the web-browser.";
  }

  canvas.height = canvas_height; // Image Height
  canvas.width = canvas_width;  // Image Width

  msg = "Image size: &nbsp; Width " + canvas.width + " pixels, &nbsp; Height: " + canvas.height + " pixels.<br>" + msg;

  document.getElementById("draw_heatmap_show_image_size_text").innerHTML = msg;

  // alert("w="+canvas.width+ " h="+canvas.height);
  // In the above logic, based on the CSV data that has been passed, I have parsed that data into the JSON format first. after that, calculate the number of keys in a single object and multiplied it by 200 (can be any value based upon your choice) to find the border width. similarly, calculated the length of the object of arrays and added 1 more row as header, and multiplied it with 40 (can be any value based upon your choice) to find the border height. and assigned a variable P = 10 (as a margin).

  //alert("draw_and_download_heatmap() 4 ....");

  // Clear the canvas before drawing or redrawing the Table:
  c.fillStyle = background_colour; // "white";
  // c.clearRect(0, 0, canvas.width, canvas.height);

  // The clearRect() method sets the pixels in a rectangular area to transparent black (rgba(0,0,0,0)).

  c.beginPath();

  c.fillRect(0, 0, canvas.width, canvas.height);

  // Setting properties for the border lines in the table drawn:
  c.strokeStyle = "black";

  // Drawing row borders for the table:
  //  for (var y = 0;  y <= bh;  y += row_height) {
  //    c.moveTo(m,  m + 0.5 + y);
  //    c.lineTo(m + bw,  m + 0.5 + y);
  //if (y<100) console.log("row: ",m,  m + 0.5 + y, " To: ", m + bw,  m + 0.5 + y)
  //  }

  for (var i = 0, y = margin + 0.5; i <= num_rows; i++, y += row_height) {
    c.moveTo(margin, y);
    c.lineTo(margin + bw, y);
    // if (y<100) console.log(i,"row: ",margin, y, " To: ", margin + bw, y)
  }


  // Drawing column borders for the table:
  //for (var x = 0;  x <= bw;  x += col_width) {
  //  c.moveTo(m + 0.5 + x,  m);
  //  c.lineTo(m + 0.5 + x,  m + bh);
  //}
  for (var i = 0, x = margin + 0.5; i <= num_cols; i++, x += col_width) { // y <= bh 
    c.moveTo(x, margin);
    c.lineTo(x, margin + bh);
  }

  // Draw the lines: 
  c.stroke();
  c.closePath();


  // let keys = Object.keys(data[0]); // finding keys in each JSON object

  // To print the values in the Table Excluding Header:

  // let i count is used to track the number of rows to be filled.
  // let j keyCount is used to track the number of columns to be filled.

  // Could rotate the headings to be vertical to save space: https://stackoverflow.com/questions/3167928/drawing-rotated-text-on-a-html5-canvas 
  // To Print the Header:

  // Options: ctx.textAlign = 'center'; ctx.textBaseline = "bottom"; Etc.

  c.beginPath();

  c.font = "bold " + font_size + "px Verdana"; // bold text
  c.fillStyle = "black";
  y = margin + row_height;

  var max_text_width = col_width - text_padding;
  for (var j = 0, x = margin + 0.5; j < num_cols; j++, x += col_width) { // x < bw
    c.fillText(head1[j], x + text_padding, y - text_padding, max_text_width); // y-axis zero is at top so subtract text_padding. 
    c.fillText(head2[j], x + text_padding, y - text_padding + row_height, max_text_width);
    // c.fillText(logfcs[0][j],  x + text_padding,  y - text_padding, col_width);  
  }

  //console.log("draw[0]=",draw[0]);
  //alert("draw[0]="+draw[0]);

  c.font = "normal " + font_size + "px Verdana";
  // y = m + row_height; // y is already set above for headings.
  for (var i = 1, y = margin + 3 * row_height; i <= draw.length; i++, y += row_height) { // y <= bh // using logfcs.length instead of num_rows here (as num_rows includes the extra head2 row.)
    x = margin;
    c.fillStyle = "black";
    var idraw = draw[i - 1]; // As the draw array starts at draw[0]
    c.fillText(logfcs[idraw][0], 0.5 + x + text_padding, y - text_padding, max_text_width); // Gene name.   // text_padding was 5
    for (var j = 1; j < num_cols; j++) { // x < bw
      x += col_width; // x is set to 'margin' above okay.

      var fc = logfcs[idraw][j];

      if (fc === null) continue;
      c.fillStyle = hsl_color(fc); // Heat map color, HSL can be used directly in canvas: https://riptutorial.com/html5-canvas/example/13472/fillstyle--a-path-styling-attribute-
      c.fillRect(x + 1, y, col_width - 1, 1 - row_height); // +1 is to start after border.

      if (draw_fc_numbers) {
        c.fillStyle = "black";
        c.fillText(fc, 0.5 + x + text_padding, y - text_padding, max_text_width);  // text_padding was 5. Here col_width is the maxWidth of the text
      }
    }
  } // NOTE: fillRect draws directly to the canvas without modifying the current path, so any subsequent fill() or stroke() calls will have no effect on it.
  // width : The rectangle's width. Positive values are to the right, and negative to the left.
  // height : The rectangle's height. Positive values are down, and negative are up.

  c.closePath();

  c.save(); // Save the context into the Stack.

  show_draw_progress("Finished drawing the heatmap image below.", 'green');

  set_image_download_types();

  document.getElementById("download_image_type_label_and_select").style.display = '';
  document.getElementById("download_heatmap_image_link").style.display = ''; // Show the download link.

  show_hide_table_row('download_heatmap_image', true);

  document.getElementById("preview_heatmap_button").scrollIntoView(true);
}



function download_heatmap(evt, this_elem) {

  show_image_download_progress("Downloading image...", 'blue');

  // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a#using_the_download_attribute_to_save_a_canvas_as_a_png

  // if (window.navigator.msSaveBlob) {
  // 	window.navigator.msSaveBlob(canvas.msToBlob(), fileName);
  //   e.preventDefault();
  // } else {

  // convert canvas content to data-uri for link. When download
  //   attribute is set the content pointed to by link will be
  //   pushed as "download" in HTML5 capable browsers
  // evt.target.href = c.toDataURL('image/png;base64'); // default is image/png

  var image_type = document.getElementById("download_image_type").value;  // 'png'; // or jpeg  png=Higher quality, jpg=Smaller file size.
  console.log("download_heatmap() image_type=", image_type);
  if (image_type === "") { alert("download_heatmap(): ERROR: No image_type selected"); return; }

  var filename = "hive_heatmap." + (image_type === 'jpeg' ? 'jpg' : image_type);
  this_elem.download = filename;

  var canvas = document.getElementById("my_heatmap_canvas");
  // alert('canvas.toDataURL(): image/'+image_type); // removed:    +';base64'
  this_elem.href = canvas.toDataURL('image/' + image_type); // default is image/png, the jpg is image/jpeg

  // Safari doesn't support: "image/webp"

  show_image_download_progress("Downloading this Heatmap image.<br>(The '" + filename + "' image file will be in your computer browser's Downloads folder. The filename may have include a number if downloaded a second time, eg: '" + filename + " (2)' )", 'green');
  // return true or false??
}



function set_image_download_types() {
  // All should support: image/png.
  // If your dataUri now contains the same string JPEG is supported. Otherwise the string will be image/png.

  var canvas = document.getElementById("my_heatmap_canvas"),
    html = '';

  if (canvas.toDataURL('image/png').match('image/png')) html += '<option value="png" selected>PNG = Higher quality (Usually the best option)</option>';
  if (canvas.toDataURL('image/jpeg').match('image/jpeg')) html += '<option value="jpeg">JPEG/JPG = Larger file size for this heatmap (although is smaller for photos, etc)</option>';
  if (canvas.toDataURL('image/webp').match('image/webp')) html += '<option value="webp">WebP = Newer google (more compact) file for webpages</option>';
  if (canvas.toDataURL('image/jxl').match('image/jxl')) html += '<option value="jxl">JPEG XL = Newer more compressed file for webpages</option>';
  if (canvas.toDataURL('image/avif').match('image/avif')) html += '<option value="avif">AVIF = Newer more compressed file for webpages</option>';
  if (canvas.toDataURL('image/gif').match('image/gif')) html += '<option value="gif">Gif = Older format, Small file size for this heatmap</option>';

  document.getElementById("download_image_type").innerHTML = html;

  // toData(type, quality) quality is optional  
}

// JPEG XL generally has better compression than WebP, JPEG, PNG and GIF and is designed to supersede them. 
// JPEG XL competes with AVIF which has similar compression quality but fewer features overall.


function download_single_data_file(evt, this_elem) {
  // alert("Download this DGE data as single data file isn't fully implemented yet."); return false;

  if (logfcs.length < 2) { var msg = "LogFC array is empty. Please open the input data files first."; show_download_single_data_file_progress(msg, 'red'); alert(msg); return false; }
  if (logfcs[0].length != logfcs[1].length) { var msg = "WARNING: The number of columns in the header=" + logfcs[0].length + " is different from the number of data columns=" + logfcs[1].length; show_download_single_data_file_progress(msg, 'red'); alert(msg); }

  show_download_single_data_file_progress("Starting to create and download this data as a single file ...", 'blue');

  var gene_symbol_type = document.getElementById('gene_symbol_type').value,
    taxid_organism_elem = document.getElementById("organism_species"),
    other_organism_div = document.getElementById("other_organism_species_div");

  var tax_ensembl_gprofiler_ids = (taxid_organism_elem.value === "OTHER") ? other_organism_div.value.trim() : taxid_organism_elem.value;

  // The hive params line:
  var buff = 'HIVE:\t' + gene_symbol_type + '\t' + tax_ensembl_gprofiler_ids + '\n'; // Add the HIVE prefix to the first column header, (WAS 'HIVE:Gene' or 'HIVE:Protein') which indicates the filetype in my function parse_single_file(..)

  buff += logfcs[0].join('\t') + '\n'; // header row.

  var write_pvs = logpvs.length > 1;
  var write_pct12s = pct1s.length > 1 || pct2s.length > 1;

  for (var i = 1; i < logfcs.length; i++) {
    if (logfcs[i][j] !== null) buff += logfcs[i][0] + '\t'; // The gene name column.

    for (var j = 1; j < logfcs[i].length; j++) {
      if (logfcs[i][j] !== null) {
        buff += logfcs[i][j];

        if (write_pvs) {
          buff += ':';
          if (logpvs[i][j] !== null) buff += logpvs[i][j];
        } // end of: if (write_pvs)

        if (write_pct12s) {
          buff += ':';
          if (pct1s[i][j] !== null) buff += pct1s[i][j];
          buff += ':';
          if (pct2s[i][j] !== null) buff += pct2s[i][j];
        } // end of: if (write_pct12s)
      }

      if (j < logfcs[i].length - 1) buff += '\t';
    }
    buff += '\n';
  }

  // Add the date time so OS won't added a (1), (2) etc....
  var filename = "hive_data.tsv";
  this_elem.download = filename;
  this_elem.href = "data:text/plain;charset=utf-8," + encodeURIComponent(buff);

  // Or using a Blob:
  //  var blob = new Blob([buff], { type: 'text/plain' });    
  //  this_elem.setAttribute('download', filename);
  //  this_elem.setAttribute('href', window.URL.createObjectURL(blob));


  show_download_single_data_file_progress("Downloading this data as a single file.<br>(The '" + filename + "' file will be in your computer's browser Downloads folder.<br>If a file with that name already exists, then a number will be added, eg:<br> 'hive_data<b>-2</b>.tsv' on Safari browser, or 'hive_data.tsv <b>(2)</b>' on Chrome browser)", 'green');
}




function sort_data(this_select) {
  // var logsort = null; - is initialised in 

  if (this_select) show_display_options_message("<b><i>Sorting heatmap rows ...</i></b>", 'green');

  var sort_on = this_select === null ? 'none' : this_select.value,
    logfcs_len = logfcs.length; // Note: the -1 is because the first row is the heading, which is always first.

  if (logsort === null) {
    logsort = new Array(logfcs_len - 1);
    for (var i = 1; i < logfcs_len; i++) logsort[i - 1] = new Array(2);
  }

  if (logsort.length !== logfcs.length - 1) alert("sort_data(): logsort.length=" + logsort.length + " !== logfcs.length-1=" + (logfcs.length - 1));


  for (var i = 1; i < logfcs_len; i++) {
    logsort[i - 1][0] = i; // The i-1 is because the first row of logfcs is the heading, which is always first.

    if (sort_on === 'none') logsort[i - 1][1] = i;

    else if (sort_on === 'gene_id') logsort[i - 1][1] = logfcs[i][0].toUpperCase();

    else if (sort_on === 'fc_max' || sort_on === 'fc_min') {
      var c = logfcs[i], max = null; // or:  min = 0, max = 0; 
      for (var j = 1; j < c.length; j++) { // start at j=1 as 0 is the gene name
        if (c[j] === null) continue;
        else if (max === null || Math.abs(c[j]) > max) max = Math.abs(c[j]);
      }
      logsort[i - 1][1] = max === null ? -1 : max; // setting rows with no fold-changes to -1 so will be at end.
    }

    else if (sort_on === 'fc_range') {
      var c = logfcs[i], min = null, max = null; // or:  min = 0, max = 0; 
      for (var j = 1; j < c.length; j++) { // start at j=1 as 0 is the gene name
        if (c[j] === null) continue;
        else if (min === null || c[j] < min) min = c[j];
        else if (max === null || c[j] > max) max = c[j];
      }
      var range = (max === null ? 0 : max) - (min === null ? 0 : min);
      // var range = max - min;
      logsort[i - 1][1] = Math.abs(range);
    }

    else if (sort_on === 'p_value') {
      if (!has_pvalues_columns) { alert("sort_data(): THsi data doesn't have p-values/FDR/q-values, so cannot sort on p-values/FDR/q-values"); return; }

      var c = logpvs[i], min = null; // or:  min = 1.1;
      for (var j = 1; j < c.length; j++) { // start at j=1 as 0 is the gene name
        if (c[j] === null) continue;
        else if (min === null || c[j] < min) min = c[j];
      }
      logsort[i - 1][1] = min === null ? 1.1 : min; // setting rows with no p-value to 1.1 so will be at end, as p is probability so won't be over 1.
    }

    else { alert("Unexpected sort_on=" + sort_on); return; }
  }

  if (logsort.length !== logfcs.length - 1) alert("sort_data(): logsort.length=" + logsort.length + " !== logfcs.length-1=" + (logfcs.length - 1));

  // Sort this array:
  if (sort_on === 'none') return; // as just keep natural order.
  else if (sort_on === 'gene_id') { // Alphabetic:
    //    logsort.sort( function(a, b) { a[1].localeCompare(b[1]); } );
    logsort.sort(function (a, b) { return (a[1] > b[1]) ? 1 : (a[1] < b[1]) ? -1 : 0; }); // Should return -ive, 0 or +ive so NOT using: a[1] > b[1];
  }

  else if (sort_on === 'fc_min') { // Numeric - putting smallest at start:
    logsort.sort(function (a, b) {
      if (a[1] > b[1]) return 1;
      if (a[1] < b[1]) return -1;
      return 0;
    });
  }

  else if (sort_on === 'fc_max' || sort_on === 'fc_range') { // Numeric - putting largest at start:
    logsort.sort(function (a, b) {
      if (a[1] < b[1]) return 1;
      if (a[1] > b[1]) return -1;
      return 0;
    });
    // OR: logsort.sort( function(a, b) { return (a[1] < b[1]) ? 1 : (a[1] > b[1]) ? -1 : 0; };
    // OR: logsort.sort((a, b) => a[1] - b[1]);
  }

  else if (sort_on === 'p_value') { // Numeric - putting smallest at start:
    logsort.sort(function (a, b) {
      if (a[1] > b[1]) return 1;
      if (a[1] < b[1]) return -1;
      return 0;
    });
  }

  else { alert("Unexpected sort_on=" + sort_on); return; }
  // To sort in alphabetics order: 
  // logsort.sort((a,b) => a[1].toUpperCase().localeCompare(b[1].toUpperCase()));
  // logsort.sort((a,b) => a[1].localeCompare(b[1]));
  // where:
  // const arr = [
  //   [500, 'Foo'],
  //   [600, 'bar'],
  //   [700, 'Baz']
  // ];  
}



function clear_venn_diagram() {
  document.getElementById("venn_diagram").innerHTML = "";
  document.getElementById("venn_diagram_message").innerHTML = "";
}




var venn_genes = {}; // for the "Select" buttons is index of gene in the logfcs[index][0] array
function count_venn_diagram() {
  // This is an UpSet like plot rotated 90 degrees clockwise.
  // Using '.' to separate the indexes as otherwise 12 would be same 1.2
  // so will be eg: '.1.3.8.'
  // alternatively could use binary as 1 or 0 at each position.... but integers are 32 bits (signed integer or 64) so limits. 
  venn_genes = {}; // empty the existing lists.

  var venn_fc_threshold_select = document.getElementById("venn_fc_threshold"),
    fc_threshold_text = venn_fc_threshold_select.options[venn_fc_threshold_select.selectedIndex].text, //the venn_fc_threshold_select.text is also used below 
    fc_threshold = venn_fc_threshold_select.value,
    fc_sign = (fc_threshold === 'Any') ? 'Any' : fc_threshold.charAt(0), // is '+' or '-' or 'A' for > or < or Abs()> or a for Abs()< 
    pvalue = document.getElementById("venn_pvalue").value, //e g: 'Any' or 0.5 to 0.001
    counts = {},
    fc_sums = {},
    r_data = [], r_order_by, r_order_decreasing, r_nsets = head1.length - 1, r_nintersects = 0,  // To produce image using UpsetR in R.
    j;

  if (!has_pvalues_columns) pvalue = 'Any'; // To force it to any pvalue as none available.

  fc_threshold = Number(fc_threshold.substring(1));
  if (fc_sign === '-') fc_threshold = -fc_threshold;
  else if (['Any', '+', 'A', 'a'].indexOf(fc_sign) === -1) { alert("count_venn_diagram(): Unexpected fc_sign=" + fc_sign); return; }

  if (pvalue !== 'Any') pvalue = Number(pvalue);

  for (var i = 1; i < logfcs.length; i++) {
    var fc_row = logfcs[i],
      key = '.', // setting empty to . as cannot use '' as index.
      pv_row;

    if (pvalue !== 'Any') pv_row = logpvs[i];

    // First get the key for this row, eg: '.02.04.07.' so is columns 2,4,7 
    // Below (fc_threshold === 'Any') is same as (fc_sign === 'Any')
    for (j = 1; j < fc_row.length; j++) { // starting at j=1 as 0 is gene name.
      if (fc_row[j] !== null
        && (pvalue === 'Any' || pv_row[j] <= pvalue)
        && ((fc_sign === 'Any') ||
          (fc_sign === '+' && fc_row[j] >= fc_threshold) ||
          (fc_sign === '-' && fc_row[j] <= fc_threshold) ||
          (fc_sign === 'A' && Math.abs(fc_row[j]) >= fc_threshold) ||
          (fc_sign === 'a' && Math.abs(fc_row[j]) <= fc_threshold)
        )
      )
        key += ((j < 10 ? '0' : '') + j.toString() + '.'); // Using j<10 .. as padStart(2,'0') not supported in older browsers;
    }


    var fc_sum;
    if (key in counts) {
      counts[key] += 1;
      venn_genes[key].push(i);
      fc_sum = fc_sums[key]; // fc_sum is a reference, not a copy.
    }
    else {
      counts[key] = 1;
      venn_genes[key] = [i]; // index of the gene.
      fc_sum = fc_sums[key] = new Array(head1.length);
      for (j = 1; j < fc_sum.length; j++) fc_sum[j] = 0; // or .fill(0);
    }
    if (key !== '.') { // a key of '.' means has no cells over the threshold fold-change so nothing to add here:
      for (j = 1; j < fc_row.length; j++)
        if (fc_row[j] !== null
          && (pvalue === 'Any' || pv_row[j] <= pvalue)
          && ((fc_sign === 'Any') ||
            (fc_sign === '+' && fc_row[j] >= fc_threshold) ||
            (fc_sign === '-' && fc_row[j] <= fc_threshold) ||
            (fc_sign === 'A' && Math.abs(fc_row[j]) >= fc_threshold) ||
            (fc_sign === 'a' && Math.abs(fc_row[j]) <= fc_threshold)
          )
        )

          fc_sum[j] += (fc_sign === 'Any' || fc_sign === 'A' || fc_sign === 'a') ? Math.abs(fc_row[j]) : fc_row[j]; // Using abs for teh Absolute threshold, here as otherwise could average to zero below?

    }
  } // end of: for i=1; .... 


  var venn_sort_by = document.getElementById("venn_sort_by").value,
    keys = Object.keys(counts);

  //console.log("keys:",keys);

  if (venn_sort_by === 'num_genes_decreasing') {
    keys.sort(function (a, b) { return counts[b] - counts[a] || b.length - b.length || b.localeCompare(a) });
    r_order_by = '"freq"'; r_order_decreasing = 'T';  // This has different effect: r_order_by = 'c("freq", "degree")'; r_order_decreasing = 'c(T,F)';
  }
  else if (venn_sort_by === 'num_genes_increasing') {
    keys.sort(function (a, b) { return counts[a] - counts[b] || a.length - b.length || a.localeCompare(b) });
    r_order_by = '"freq"'; r_order_decreasing = 'F';  // This has different effect: r_order_by = 'c("freq", "degree")'; r_order_decreasing = 'c(F,F)';
  }
  else if (venn_sort_by === 'num_venn_groups_increasing') {
    // sort keys by length then by alphabetically. The dot (. and also comma) is before 0 in ascii table so '.01.02.' will correctly come before '.12.'
    keys.sort(function (a, b) { return a.length - b.length || a.localeCompare(b) });
    r_order_by = '"degree"'; r_order_decreasing = 'F';  // This has different effect: r_order_by = 'c("degree", "freq")'; r_order_decreasing = 'c(F,F)';
  }
  else if (venn_sort_by === 'num_venn_groups_decreasing') {
    // sort keys by length then by alphabetically. The dot (. and also comma) is before 0 in ascii table so '.01.02.' will correctly come before '.12.'
    keys.sort(function (a, b) { return a.length - b.length || a.localeCompare(b) });
    r_order_by = '"degree"'; r_order_decreasing = 'T';  // This has different effect: r_order_by = 'c("degree", "freq")'; r_order_decreasing = 'c(T,F)';
  }
  else alert("Unexpected sort order: " + venn_sort_by);


  var title = '<p style="font-size: 90%;">This is a kind of UpSet plot (rotated 90 degrees) + HeatMap combined for:<br>' + fc_threshold_text +
    '<br>The number (and colour) in each table-cell below is the ' + (fc_sign === 'Any' || fc_sign === 'A' || fc_sign === 'a' ? 'Average(Absolute(fold-change) where "Absolute()" means negative fold-changes are counted as positive' : 'Average(fold-change)') + '</p>';

  var html = '<table>\n<tr><th>Num columns</th><th>' + head1.slice(1).join('</th><th>') + '</th><th>Num genes</th><th>Action</th></tr>\n' +
    '<tr><th></th><th>' + head2.slice(1).join('</th><th>') + '</th><th></th><th></th></tr>\n';

  var counts_sum = 0;

  for (var k = 0; k < keys.length; k++) {
    var key = keys[k],
      num_cols = Math.floor(key.length / 3), // as each col will eg: '.02.03.'   OR: (key.length-1)/3
      count = counts[key],
      fc_sum = fc_sums[key],
      style,
      r_names = [];
    //console.log(key, " count=",count,"  fc_sum=",fc_sum);

    html += '<tr><td>' + num_cols + '</td>'; // could use black square to make simple bar chart: &#9632;

    for (j = 1; j < head1.length; j++) { // Find the heading that this part of the key corresponds to, eg: .03.
      var j_in_key = '.' + (j < 10 ? '0' : '') + j.toString() + '.';
      //console.log(key,  "  j_in_key=",j_in_key);
      if (key.indexOf(j_in_key) > -1) {
        var fc_mean = fc_sum[j] / count;
        style = ' style="background-color: ' + hsl_color(fc_mean) + ';"'; // eg: is '.03.' in '.01.03.08.10'
        html += '<td' + style + '>' + (Math.round(10 * fc_mean) / 10.0) + '</td>';
        r_names.push((head1[j] + ' ' + head2[j]).replace(/&/g, '_').trim()); // Need to replace any '&' as used to join these names in R below.
      }
      else html += '<td> </td>';
    }
    html += '<td style="text-align:left;">' + count + '</td><td> <button onclick="select_venn_genes(\'' + key + '\');">Select</button><span id="select_venn_genes_progress_' + key.replace(/\./g, '_') + '"></span><button onclick="copy_venn_genes(\'' + key + '\');">Copy</button><span id="copy_venn_genes_progress_' + key.replace(/\./g, '_') + '"> </td></tr>\n';
    counts_sum += count;

    if (r_names.length === 1) r_data.push('"' + r_names[0] + '" = ' + count); // No quotes unless contains spaces, eg: M.acuminata = 759,
    else if (r_names.length > 1) r_data.push('"' + r_names.join('&') + '" = ' + count); // Needs quotes, eg:  "O.sativa&M.acuminata" = 29,
    // else {r_data.push( '"None" = ' + count ); r_nsets++;} // The UpsetR doesn't plot genes not in any set, although I could add this 'None' time/condition.
    // This upset still works if a tissuetype alone has zero genes, but it + another tissuetype have several genes.
  }
  html += '<tr><td colspan="' + head1.length + '" style="text-align:right;">Total number of genes:</td><td colspan="2" style="text-align:left;">' + counts_sum + '</td></tr>';
  html += '</table>\n';

  document.getElementById("venn_diagram").innerHTML = title + html;

  // Show the R upsetR command:
  // Alternatively could use complex upset: https://jokergoo.github.io/ComplexHeatmap-reference/book/upset-plot.html
  r_nintersects = r_data.length;
  document.getElementById("upset_r_command_textarea").value =
    '# install.packages("UpSetR")\nlibrary(UpSetR)\n\n'
    + 'data <- c(\n' + r_data.join(',\n') + '\n)\n\n'
    + 'p <- upset(fromExpression(data), nsets = ' + r_nsets + ', nintersects = ' + r_nintersects + ',\n'
    + '        order.by = ' + r_order_by + ', decreasing = ' + r_order_decreasing + ',\n'
    + '        number.angles = 0, text.scale = 1.9,\n'
    + '        point.size = 5.8, matrix.color = "blue", line.size = 0.7, mb.ratio = c(0.6, 0.4),\n'
    + '        sets.x.label = "Genes in Tissue/Condition", mainbar.y.label = "Genes in Intersection"\n'
    + '     )\n\n'
    + '# png("my_upset.png", units="px", width=1000, height=800)\n' // units can be: px, in, mm, cm, and can set eg: res=300
    + 'print(p)\n'
    + '# dev.off()\n\n'
    + '# If upsetR is NOT already installed, remove the "#" before the above "install.packages("UpSetR")"\n'
    + '# To write the Upset image to a .png file remove the "#" before the above "png(...)" and "dev.off()" lines.\n'
    + '# For full upset params, see: https://www.rdocumentation.org/packages/UpSetR/versions/1.4.0/topics/upset  and: https://cran.r-project.org/web/packages/UpSetR/UpSetR.pdf\n\n';
  document.getElementById("div_upset_r_command_textarea").style.display = '';

  // Also:
  // set.metadata
  // group.by = "degree",
  // keep.order = F
  // etc..
  // empty.intersections = NULL

  /*
        queries = list(list(query = intersects, params = list("significant_in_COPD", 
                                                              "enriched_in_COPD"), color = "darkred", active = T), 
                       list(query = intersects, params = list("significant_in_COPD"), color = "darkred", active = T), 
                       list(query = intersects, params = list("enriched_in_COPD"),color = "darkred", active = T),
                       list(query = intersects, params = list("significant_in_control", 
                                                              "enriched_in_control"), color = "steelblue4", active = T), 
                       list(query = intersects, params = list("significant_in_control"), color = "steelblue4", active = T), 
                       list(query = intersects, params = list("enriched_in_control"),color = "steelblue4", active = T))
  */

  if (counts_sum !== logfcs.length - 1) { alert('counts_sum=' + counts_sum + ' !== logfcs.length-1=' + (logfcs.length - 1)); return; }
  show_progress("venn_diagram_message", "UpSet/Venn table drawn okay.", 'green');
}



/*      
========

# Import Upset plot library
install.packages("UpSetR")
library(UpSetR)

# Dataset
inputData <- c(

  M.acuminata = 759,
  P.dactylifera = 769,
  A.thaliana = 1187,
  O.sativa = 1246,
  S.bicolor = 827,
  B.distachyon = 387,
  "P.dactylifera&M.acuminata" = 467,
  "O.sativa&M.acuminata" = 29,
  "A.thaliana&O.sativa" = 6,
  "S.bicolor&A.thaliana" = 9,
  "O.sativa&P.dactylifera" = 32,
  "S.bicolor&P.dactylifera" = 49,
  "S.bicolor&M.acuminata" = 49,
  "B.distachyon&O.sativa" = 547,
  "S.bicolor&O.sativa" = 1151,
  "B.distachyon&A.thaliana" = 10,
  "B.distachyon&M.acuminata" = 9,
  "B.distachyon&S.bicolor" = 402,
  "M.acuminata&A.thaliana" = 155,
  "A.thaliana&P.dactylifera" = 105,
  "B.distachyon&P.dactylifera" = 25,
  "S.bicolor&O.sativa&P.dactylifera" = 42,
  "B.distachyon&O.sativa&P.dactylifera" = 12,
  "S.bicolor&O.sativa&B.distachyon" = 2809,
  "B.distachyon&O.sativa&A.thaliana" = 18,
  "S.bicolor&O.sativa&A.thaliana" = 40,
  "S.bicolor&B.distachyon&A.thaliana" = 14,
  "O.sativa&B.distachyon&M.acuminata" = 28,
  "S.bicolor&B.distachyon&M.acuminata" = 13,
  "O.sativa&M.acuminata&P.dactylifera" = 35,
  "M.acuminata&S.bicolor&A.thaliana" = 21,
  "B.distachyon&M.acuminata&A.thaliana" = 7,
  "O.sativa&M.acuminata&A.thaliana" = 13,
  "M.acuminata&P.dactylifera&A.thaliana" = 206,
  "P.dactylifera&A.thaliana&S.bicolor" = 4,
  "O.sativa&A.thaliana&P.dactylifera" = 6,
  "S.bicolor&O.sativa&M.acuminata" = 64,
  "S.bicolor&M.acuminata&P.dactylifera" = 19,
  "B.distachyon&A.thaliana&P.dactylifera" = 3,
  "B.distachyon&M.acuminata&P.dactylifera" = 12,
  "B.distachyon&S.bicolor&P.dactylifera" = 23,
  "M.acuminata&B.distachyon&S.bicolor&A.thaliana" = 54,
  "P.dactylifera&S.bicolor&O.sativa&M.acuminata" = 62,
  "B.distachyon&O.sativa&M.acuminata&P.dactylifera" = 18,
  "S.bicolor&B.distachyon&O.sativa&A.thaliana" = 206,
  "B.distachyon&M.acuminata&O.sativa&A.thaliana" = 29,
  "O.sativa&M.acuminata&A.thaliana&S.bicolor" = 71,
  "M.acuminata&O.sativa&P.dactylifera&A.thaliana" = 28,
  "B.distachyon&M.acuminata&O.sativa&A.thaliana" = 7,
  "B.distachyon&S.bicolor&P.dactylifera&A.thaliana" = 11,
  "B.distachyon&O.sativa&P.dactylifera&A.thaliana" = 5,
  "A.thaliana&P.dactylifera&S.bicolor&O.sativa" = 21,
  "M.acuminata&S.bicolor&P.dactylifera&A.thaliana" = 23,
  "M.acuminata&B.distachyon&S.bicolor&P.dactylifera" = 24,
  "M.acuminata&O.sativa&S.bicolor&B.distachyon" = 368,
  "P.dactylifera&B.distachyon&S.bicolor&O.sativa" = 190,
  "P.dactylifera&B.distachyon&S.bicolor&O.sativa&A.thaliana" = 258,
  "P.dactylifera&M.acuminata&S.bicolor&B.distachyon&O.sativa" = 685,
  "M.acuminata&S.bicolor&B.distachyon&O.sativa&A.thaliana" = 1458,
  "S.bicolor&M.acuminata&P.dactylifera&O.sativa&A.thaliana" = 149,
  "B.distachyon&M.acuminata&P.dactylifera&O.sativa&A.thaliana" = 80,
  "M.acuminata&S.bicolor&B.distachyon&P.dactylifera&A.thaliana" = 113,
  "M.acuminata&S.bicolor&B.distachyon&P.dactylifera&O.sativa&A.thaliana" = 7674
)

# Plot
upset(fromExpression(input), 
      nintersects = 40, # Number of intersections to plot. If set to NA, all intersections will be plotted.
      nsets = 6,  # Number of sets to look at
      order.by = "freq",  # "freq" or "degree", or both in any order.
      decreasing = T,  # "freq" is decreasing (greatest to least) and "degree" is increasing (least to greatest)
      mb.ratio = c(0.6, 0.4),
      number.angles = 0, 
      text.scale = 1.1, 
      point.size = 2.8, 
      line.size = 1
      )

====

upset(data, nsets = 5, nintersects = 40, sets = NULL,
  keep.order = F, set.metadata = NULL, intersections = NULL,
  matrix.color = "gray23", main.bar.color = "gray23",
  mainbar.y.label = "Intersection Size", mainbar.y.max = NULL,
  sets.bar.color = "gray23", sets.x.label = "Set Size",
  point.size = 2.2, line.size = 0.7, mb.ratio = c(0.7, 0.3),
  expression = NULL, att.pos = NULL, att.color = main.bar.color,
  order.by = c("freq", "degree"), decreasing = c(T, F),
  show.numbers = "yes", number.angles = 0, group.by = "degree",
  cutoff = NULL, queries = NULL, query.legend = "none",
  shade.color = "gray88", shade.alpha = 0.25, matrix.dot.alpha = 0.5,
  empty.intersections = NULL, color.pal = 1, boxplot.summary = NULL,
  attribute.plots = NULL, scale.intersections = "identity",
  scale.sets = "identity", text.scale = 1, set_size.angles = 0,
  set_size.show = FALSE, set_size.numbers_size = NULL,
  set_size.scale_max = NULL)
  
From: https://www.rdocumentation.org/packages/UpSetR/versions/1.4.0/topics/upset

*/


function select_venn_genes(key) {

  console.log("select_venn_genes(): key=", key);

  if (key in venn_genes) {
    // alert('This selecting of genes/proteins is not enabled here yet.');

    var iList = venn_genes[key];
    if (iList.length === 0) alert("ERROR: List venn_genes[key] is empty but shouldn't be empty.");

    var clear_currently_selected = false;
    if (selected_gene_list.length > 0 && confirm('Clear the existing selected gene list first?\n(as ' + selected_gene_list.length + ' genes are currently selected: ' + selected_gene_list.splice(0, 10).join(', ') + '...)')) {
      // Empty selected list - would be more efficient to unselect just the currently selected gene checkboxes before emptying this list, then select only the selected, but selected_gene_list is gene ids not locfcs array indexes. 
      clear_currently_selected = true;
      selected_gene_list = [];
    }
    // maybe also: && selected_gene_list.length < document.getElementById('heatmap_tbody').rows.length 

    // Optionally use a timer so can update progress message: timer3 = setTimeout(function() { ...},...)

    // for (var i=0; i<selected_gene_list.length; i++) document.getElementById('c'+selected_gene_list[i]).checked = false;
    var num_selected = 0, num_already_selected = 0, num_without_checkboxes = 0;
    for (var i = 1; i < logfcs.length; i++) {
      // Not testing for 'if (tr is visible) ...' as cb should exist if tr exists.
      var cb = document.getElementById('c' + i); // 'c' + row in the logfcs array.
      if (cb) { // the current filter might hide some genes so cannot select them.       
        if (iList.indexOf(i) > -1) {
          if (!clear_currently_selected && cb.checked) num_already_selected++;
          else {
            cb.checked = true;
            // if (clear_currently_selected && selected_gene_list.indexOf(logfcs[i][0])===-1) error: ......
            // if clear_currently_selected if false then this gene might already be in this selected_gene_list list, but could test: if (!cb.checked)....
            selected_gene_list.push(logfcs[i][0]);
            num_selected++;
          }
          // else if (selected_gene_list.indexOf(logfcs[i][0]) === -1) {alert("ERROR: Gene "+logfcs[i][0]+" is checked but is not in the selected_gene_list");}
        }
        else if (clear_currently_selected && cb.checked) cb.checked = false;
      }
      else num_without_checkboxes++;
    }
    var msg = "Selected " + num_selected + " genes.";
    if (num_already_selected > 0) msg += " " + num_already_selected + " were already selected."
    if (num_without_checkboxes > 0) msg += " " + num_without_checkboxes + " are not visible to select due to your current '<i>(5) Filter rows</i>' setting."

    show_progress('select_venn_genes_progress_' + key.replace(/\./g, '_'), " " + num_selected + " selected [see note below] ", 'green');

    console.log("select_venn_genes(): msg=", msg);

    show_progress("venn_diagram_message", msg, 'green');
    show_genes_list_and_enable_stringdb_options();
  }
  else { var msg = 'ERROR: key="' + key + '" is NOT in the venn_genes data'; show_progress("venn_diagram_message", msg, 'red'); alert(msg); return false; }
}


function copy_venn_genes(key) {
  var progress_elem = document.getElementById("venn_diagram_message");

  if (key in venn_genes) {
    var iList = venn_genes[key];
    if (iList.length === 0) alert("ERROR: List venn_genes[key] is empty but shouldn't be empty.");

    var gList = [];
    // as iList[i] is the index of the gene in the logfcs[index]
    for (var i = 0; i < iList.length; i++) gList.push(logfcs[iList[i]][0]);

    // var sep = document.getElementById("copy_separator").value;  // space( ), comma(, ), new-line(nl)
    // if (sep === "nl") sep="\n";
    // else if (sep === "tab") sep="\t";

    var buff = gList.join('\n'); // newline as default separater.

    var result = old_copy_string_to_clipboard(buff, progress_elem, "Successfully copied the " + iList.length + " genes to your Windows/MacOS clipboard.<br>You can now paste this into another website textarea, or Word document, etc, by pressing [Ctrl] V, or right clicking and select 'paste'", "ERROR: Failed to copy the select gene to the clipboard - you need to use the mouse to manually select this list of genes below, then either: press [Ctrl] C OR right click and select 'copy' from the popup menu:");

    show_progress('copy_venn_genes_progress_' + key.replace(/\./g, '_'), result ? " Copied [see note below]" : ' Failed', result ? 'green' : 'red');

  }

  else { var msg = 'ERROR: key="' + key + '" is NOT in the venn_genes data'; show_progress("venn_diagram_message", msg, 'red'); alert(msg); return false; }
}




/*
Venn diagrams:
samples: 1

samples: 1 2
 then:  12

samples: 1 2 3
 then:  12 13 23 ( num=3x2x1/2)
  123

samples: 1 2 3 4
 then:  12 13 14 23 24 34 (n=4x3x2x/2 = )
  123 124 134 234 
  1234

samples: 1 2 3 4 5
 then:  12 13 14 15 23 24 25 34 35 45
  123 124 125 134 135 145 234 235 245 345
  1234 1235 1245 1345
  12345
*/



// Drag the column name table rows - based on: https://www.therogerlab.com/sandbox/pages/how-to-reorder-table-rows-in-javascript?s=0ea4985d74a189e8b7b547976e7192ae.4122809346f6a15e41c9a43f6fcb5fd5
// and: https://web.dev/drag-and-drop/
// Needs: <tr draggable="true" ondragstart="dragstart()" ondragover="dragover()" ondragend="dragend()">  <td>......</td> </tr>
var dragrow;

function color_table_row(tr, colour) {
  var cells = tr.cells;
  for (var i = 0; i < cells.length; i++) {
    cells[i].style.backgroundColor = colour;
  }
}

function dragstart() {
  // fired when the user starts dragging an element or text selection.
  dragrow = event.target;
  dragrow.style.opacity = '0.4'; // td cells should inherit this row opacity
  // dragrow.style.background = 'rgba(0,0,0,0.4)'; // maybe
  dragrow.style.backgroundColor = 'red'; // need to also set the cell color.
  console.log
  color_table_row(dragrow, 'PaleGreen');
}

function dragover() {
  // fired when an element or text selection is being dragged over a valid drop target (every few hundred milliseconds).
  var e = event;
  e.preventDefault();

  console.log("e.target.parentNode:", e.target.parentNode);

  if (e.target.parentNode.tagName !== 'TR') return; // As can drag tr into a td element which gives the error below about: The new child element contains the parent.

  let children = Array.from(e.target.parentNode.parentNode.children);

  // or mytable.rows.item .....

  // Uncaught DOMException: Failed to execute 'after' on 'Element': The new child element contains the parent.
  //  at dragover (HIVE_browser_July2023.html:5495:25) [  this line is:  e.target.parentNode.after(dragrow);  ]
  //  at HTMLTableRowElement.ondragover (HIVE_browser_July2023.html:1:1)

  if (children.indexOf(e.target.parentNode) > children.indexOf(dragrow))
    e.target.parentNode.after(dragrow);
  else
    e.target.parentNode.before(dragrow);
}

function dragend() {
  // fired when a drag operation is being ended (by releasing a mouse button or hitting the escape key).
  dragrow.style.opacity = ''; // reset to default for class? or '1' ?
  // dragrow = null; // ??
  color_table_row(dragrow, '');
}

function drop() {
  // fired when an element or text selection is dropped on a valid drop target. 
  // To ensure that the drop event always fires as expected, you should always include a preventDefault() call in the part of your code which handles the dragover event.
  // prevent default action (open as link for some elements)
  event.preventDefault();

}




var ctx = document.getElementById('myChart').getContext('2d');
var chartData = {
  labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
  datasets: [{
    label: '# of Votes',
    data: [12, 19, 3, 5, 2, 3], // Change this array to [] to test no data scenario
    backgroundColor: [
      'rgba(255, 99, 132, 0.2)',
      'rgba(54, 162, 235, 0.2)',
      'rgba(255, 206, 86, 0.2)',
      'rgba(75, 192, 192, 0.2)',
      'rgba(153, 102, 255, 0.2)',
      'rgba(255, 159, 64, 0.2)'
    ],
    borderColor: [
      'rgba(255, 99, 132, 1)',
      'rgba(54, 162, 235, 1)',
      'rgba(255, 206, 86, 1)',
      'rgba(75, 192, 192, 1)',
      'rgba(153, 102, 255, 1)',
      'rgba(255, 159, 64, 1)'
    ],
    borderWidth: 1
  }]
};

if (chartData.datasets[0].data.length > 0) {
  document.getElementById('noData').style.display = 'none';
  document.getElementById('myChart').style.display = 'block';
  var myChart = new Chart(ctx, {
    type: 'bar', // or 'line', 'pie', etc.
    data: chartData,
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  })}

  document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.tool-button');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const url = button.getAttribute('data-url');
            if (url) {
                window.open(url, '_blank');
            }
        });
    });

    // Data for the Volcano plot (example data)
    const data = [
        { x: -2.2, y: 3 }, { x: -1.5, y: 2 }, { x: -0.5, y: 1 },
        { x: 0, y: 0.5 }, { x: 0.5, y: 1 }, { x: 1.5, y: 2 }, { x: 2.2, y: 3 }
    ];

    const width = 800;
    const height = 500;
    const margin = { top: 20, right: 30, bottom: 40, left: 50 };

    const svg = d3.select('#volcano-plot')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear()
        .domain([-3, 3])
        .range([0, width]);

    const y = d3.scaleLinear()
        .domain([0, 4])
        .range([height, 0]);

    svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x));

    svg.append('g')
        .call(d3.axisLeft(y));

    svg.append('text')
        .attr('text-anchor', 'end')
        .attr('x', width / 2 + margin.left)
        .attr('y', height + margin.top + 20)
        .text('log2(fold change)');

    svg.append('text')
        .attr('text-anchor', 'end')
        .attr('transform', 'rotate(-90)')
        .attr('y', -margin.left + 20)
        .attr('x', -margin.top - height / 2 + 20)
        .text('-log10(p-value)');

    svg.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', d => x(d.x))
        .attr('cy', d => y(d.y))
        .attr('r', 5)
        .style('fill', 'blue');
});
