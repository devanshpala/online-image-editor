
var app = new Vue({
    el: '#app',
    data: {
        state: true,
        main: ['crop', 'rotate', 'filter'],
        edits: ['Filters', 'Crop/Rotate', 'Flip','Resize'],
        editState: null,
        filterState: null,
        rangeType: 0,
        onloadState: false,
        file: null,
        addedFilters: [],
        scale: 0,
        appendFilter: '',
        filter: ['grayscale','blur','opacity','hue-rotate','brightness','invert','contrast','saturate','sepia'],
        },
    methods: {

        getIndexOfScale(value) { // THIS METHOD CALLS TO FETCH THE PERCENTAGE
            let indxOf = this.appendFilter.indexOf(value);
            let len = value.length;
            let carcode = this.appendFilter.charAt(indxOf+len+4);
            let obj = {indxOf, len, carcode};
            return obj;
        },

        onChange(event) { // THIS METHOD CALLS WHEN IMAGE IS LOADED
            let src = URL.createObjectURL(event.target.files[0]);
            this.file = src;
            this.onloadState = true;
        },

        changeEditState(val) { // THIS METHOD CALLS WHENEVER
            this.editState = val;
        },

        changeFilterState(val) { // THIS METHOD CALLS WHENEVER ANY FILTER IS CHANGED

            this.filterState = val;
            let tmp = this.filterState

            // IF CONDITIONS FOR SETTING RANGETYPE
            if(tmp === "brightness" || tmp === "contrast") {
                this.rangeType = 2;

            } else if( tmp === "invert" || tmp === "grayscale" || tmp === "sepia" || tmp === "opacity") {
                this.rangeType = 1;

            } else if(tmp === "saturate" || tmp === "hue-rotate") {
                this.rangeType = 3;
            } else {
                this.rangeType = 4;
            }

            // FORLOOP FOR SETTING SCALE AT SPECIFIC position FOR SPECIFIC FILTER
            for(let item of this.addedFilters) {
                if(this.filterState == item) {

                    let lastChar = this.getIndexOfScale(this.filterState);
                    let slc = 0;

                    if(lastChar.carcode == '%' || lastChar.carcode == 'd' ||lastChar.carcode == 'p') {

                        slc = this.appendFilter.slice(lastChar.indxOf+lastChar.len+1,
                                                      lastChar.indxOf+lastChar.len+4);
                        this.scale = parseInt(slc)
                        break;
                    } else {
                        slc = this.appendFilter.slice(lastChar.indxOf+lastChar.len+1,
                                                      lastChar.indxOf+lastChar.len+3);
                        this.scale = parseInt(slc);
                        break;
                    }
                } else {

                    if(this.rangeType == 1) {
                        this.scale = 0;

                    } else {
                        this.scale = 100;

                    }
                }
            }

            //THIS CONDITION USED TO SET SCALE AT DEFAULT VALUE WHEN THERE ARE NO FILTERS APPENDED YET
            if(this.addedFilters.length == 0) {
                console.log('zero length added filter called')
                if(this.rangeType == 1 || this.rangeType == 4) {
                    this.scale = 0;
                } else {
                    this.scale = 100;
                }
            }

        },
        filterChange() { // THIS METHOD CALLS WHENEVER SCALE OF THE FILTER CHANGES
            let isAdded = false;
            let filt = this.filterState
            let result =''
            if(filt == "hue-rotate") {
                result = ''+filt+'('+this.scale+'deg)';
            }
            else if(filt == "blur") {
                result = ''+filt+'('+this.scale+'px)';
            }
            else {
                result = ''+filt+'('+this.scale+'%)';
            }

            console.log('filter change called')
            // THIS LOOP CHECKS WHETHER ACTIVE FILTER IS ALREADY USED OR NOT
            for(let item of this.addedFilters)  {
                if(item == filt) {
                    isAdded = true;
                }
            }

            // IF THE FILTER IS NOT USED BEFORE, IT APPENDS TO ADDEDFILTERS ARRAY
            if(!isAdded) {
                this.addedFilters.push(filt)
                this.appendFilter += result;
                document.getElementById('imge').style.filter = this.appendFilter;
                console.log('addedfilter', this.addedFilters);

            } else {

                let lastchar = this.getIndexOfScale(filt);
                let sstore = ''
                if(lastchar.carcode == '%' || lastchar.carcode == 'd' || lastchar.carcode == 'p') {
                        if(filt == 'blur') {
                            console.log(lastchar.indxOf,lastchar.indxOf+lastchar.len+7)
                            sstore = this.appendFilter.slice(lastchar.indxOf,
                                                    lastchar.indxOf+lastchar.len+7);
                        }
                        else if(filt == 'hue-rotate') {
                            sstore = this.appendFilter.slice(lastchar.indxOf,
                                                    lastchar.indxOf+lastchar.len+8);
                        } else {
                            console.log('last else called',lastchar.indxOf,
                                lastchar.indxOf+lastchar.len+6)
                            sstore = this.appendFilter.slice(lastchar.indxOf,
                                lastchar.indxOf+lastchar.len+6);
                        }

                } else {
                    if(filt == 'blur') {
                        sstore = this.appendFilter.slice(lastchar.indxOf,
                                                lastchar.indxOf+lastchar.len+6);
                    }
                    else if(filt == 'hue-rotate') {
                        sstore = this.appendFilter.slice(lastchar.indxOf,
                                                lastchar.indxOf+lastchar.len+7);
                    } else {
                        sstore = this.appendFilter.slice(lastchar.indxOf,
                                                lastchar.indxOf+lastchar.len+5);
                    }

                }

                this.appendFilter = this.appendFilter.replace(sstore,result)
                document.getElementById('imge').style.filter = this.appendFilter;
            }
            console.log('appendfilter', this.appendFilter);
        }
    }

});
