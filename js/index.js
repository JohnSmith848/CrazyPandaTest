let rowsInTable=50;
let sortTableName=0;//0 is no sorting, 1 is an ascending sorting, -1 is a descending sorting
let sortTableChars=0;
let sortTablePrice=0;
let filterTableName="";
let filterTableChars="";
let filterTablePrice="";
let curIndexForm;
let curIndexTo;

$(function(){
	//1. The colors changing block code
	let curColorNoBack=false;
	let curBackground=[239,240,255,1];//"#eff0ff"
	let curColor=[130,0,255,1];//"#8200ff"
	//1.1 The sliders initializing
	$('.color-slider').slider({
		min:0,
		max:256,
		change:changeColor,
	}).filter('.color-slider_red').slider('option','value','240').end(
	).filter('.color-slider_green').slider('option','value','242').end(
	).filter('.color-slider_blue').slider('option','value','255').end();
	function changeColor(){
		if (curColorNoBack){
			if ($(this).hasClass('color-slider_red')){
				curColor[0]=$(this).slider("value");
			}
			if ($(this).hasClass('color-slider_green')){
				curColor[1]=$(this).slider("value");
			}
			if ($(this).hasClass('color-slider_blue')){
				curColor[2]=$(this).slider("value");
			}
			$('.text-box').css("color","rgba("+curColor+")");

		}else{//Change the page background-color
			if ($(this).hasClass('color-slider_red')){
				curBackground[0]=$(this).slider("value");
			}
			if ($(this).hasClass('color-slider_green')){
				curBackground[1]=$(this).slider("value");
			}
			if ($(this).hasClass('color-slider_blue')){
				curBackground[2]=$(this).slider("value");
			}
			$('.text-box').css("background-color","rgba("+curBackground+")");
		}
	};
	//1.2 The buttons clicking handler code
	$('#buttonColor, #buttonBackground').click(function(){
		if (!$(this).hasClass('btn_clicked')){
			$('.btn').toggleClass('btn_clicked');
			curColorNoBack?curColorNoBack=false:curColorNoBack=true;
			let t=$(this)[0]==$('#buttonColor')[0]?curColor:curBackground;
			$('.color-slider_red').slider("option","value", t[0]);
			$('.color-slider_green').slider("option","value", t[1]);
			$('.color-slider_blue').slider("option","value", t[2]);
		}
	});

	//2 The table block code
	//2.1 Reading origin table rows
	let curTableRows,origTableRows=$('.main').data('table-rows');
	//let sortTableRows=$('.main').data('table-rows');
	let sortTableRows=[];
	sortTableRows=sortTableRows.concat(origTableRows);
	//console.log(sortTableRows.concat(origTableRows));
	tableRenew();
	function tableRenew(){
		tableResort();
		tableFiltering();
	}

	//2.2 Sorting table rows
	function tableResort(){
		sortTableChars
		if(sortTableName||sortTableChars||sortTablePrice){
			sortTableRows.sort(tableSorting);
			curTableRows=sortTableRows;
		}else{
			sortTableRows=[];
			sortTableRows=sortTableRows.concat(origTableRows);
		}
		curTableRows=sortTableRows;
	}
	function tableSorting(a,b){
		if (sortTableName){
			if (sortTableName>0){
				if(a.name>b.name) return 1;
				if(a.name<b.name) return -1;
			}else{
				if(a.name>b.name) return -1;
				if(a.name<b.name) return 1;
			}
		}
		if (sortTableChars){
			if (sortTableChars>0){
				if(a.chars>b.chars) return 1;
				if(a.chars<b.chars) return -1;
			}else{
				if(a.chars>b.chars) return -1;
				if(a.chars<b.chars) return 1;
			}
		}
		if (sortTablePrice){
			if (sortTablePrice>0){
				if(a.price>b.price) return 1;
				if(a.price<b.price) return -1;
			}else{
				if(a.price>b.price) return -1;
				if(a.price<b.price) return 1;
			}
		}
		return 0
	}

	//2.3 Filtering table rows
	function tableFiltering(){
		let filterTableRows=sortTableRows.filter(function(item, index, array){
			if (filterTableName){
				if(!item.name.includes(filterTableName)) return false;
			}
			if (filterTableChars){
				if(!item.chars.includes(filterTableChars)) return false;
			}
			if (filterTablePrice){
				if(!item.price.includes(filterTablePrice)) return false;
			}
			return true;
		});
		curTableRows=filterTableRows;
		tableRepagination();
	}
	
	//2.4 Create pagination
	function tableRepagination(){
		//Delete old page labels
		$('.table__pagination').children().remove();
		if(curTableRows.length>rowsInTable){
			//Create page labels
			for(let i=0;i<Math.ceil(curTableRows.length/rowsInTable);i++){
				let indexTo=curTableRows.length>rowsInTable*(i+1)?rowsInTable*(i+1):rowsInTable*(i)+curTableRows.length%rowsInTable;
				$('.table__pagination').append('<div class="table__page-btn" data-index-from='+rowsInTable*i+' data-index-to='+indexTo+'>'+rowsInTable*i+'-'+indexTo+'<div>');
			}
			//Dynamic event handler for page labels
			$('.table__page-btn').click(function(){
				curIndexForm=$(this).data('index-from');
				curIndexTo=$(this).data('index-to');
				tableRedraw(curTableRows,curIndexForm,curIndexTo);
			});
			//Display the first page of the table
			curIndexTo=rowsInTable;
		}else{
			curIndexTo=curTableRows.length;
		}	
		curIndexForm=0;
		tableRedraw(curTableRows,curIndexForm,curIndexTo);			
	}

	function tableRedraw(tableRowArray,indexFrom,indexTo){
		//1. delete old rows
		$('.table tbody').children().remove();
		//2. create new rows
		if(tableRowArray.length>indexFrom){
			let tmplCounter=indexFrom+1;
			let tmplOpt={
				rowNumber:function(){return tmplCounter;},
				rowCounter:function(){tmplCounter++;return '';},
			}
			// Form indexFrom to indexTo-1, indexTo don't include to the table
			$('#mbTableRow').tmpl(tableRowArray.slice(indexFrom,indexTo),tmplOpt).appendTo($('.table tbody'));
		}
	};

	// The sorter clicking event handler
	$('.table__head-filter').change(function(){
		if ($(this).siblings("span").text()=="Name"){
			filterTableName=$(this).val();
		}else if($(this).siblings("span").text()=="Characters"){
			filterTableChars=$(this).val();
		}else{
			filterTablePrice=$(this).val();
		}
		tableRenew();
	});

	// The sorter clicking event handler
	$('.table__head-sorter').click(function(){
		let t;
		if($(this).hasClass('table__head-sorter_asc')){//Make be _desc
			$(this).toggleClass('table__head-sorter_asc');//remove class
			$(this).toggleClass('table__head-sorter_desc');//add class
			t=-1;
		}else if($(this).hasClass('table__head-sorter_desc')){//Make be no _desc and _asc
			$(this).toggleClass('table__head-sorter_desc');//remove class
			t=0;
		}else{//Make be _asc
			$(this).toggleClass('table__head-sorter_asc');//add class			
			t=1;
		}
		if ($(this).siblings("span").text()=="Name"){
			sortTableName=t;
		}else if($(this).siblings("span").text()=="Characters"){
			sortTableChars=t;
		}else{
			sortTablePrice=t;
		}
		tableRenew();
	});

});
