var app = new Vue({
    el: '#app',
    data: {
        rangeType: 0,
        main: ['crop', 'rotate', 'filter'],
        edits: ['Filters', 'Rotate', 'Flip','Resize'],
        editState: null,
        filterState: null,
        appendFilter: '',
        filter: ['grayscale','blur','opacity','hue-rotate','brightness','invert','contrast','saturate','sepia'],
        onloadState: false,
        file: null,
        addedFilters: [],
        scale: 0,
        imgWidth:0,
        statwidth:0,
        stathei:0,
        imgHeight:0,
        flpX: true,
        flpY: true,
        addedFlips:[],
        appendFlips: '',
        flips: ['flipX','flipY'],
        rotates:['left','right'],
        rotateDegree:1,
        },

    methods: {

        getIndexOfScale(value) { // THIS METHOD CALLS TO FETCH THE PERCENTAGE
            let indxOf = this.appendFilter.indexOf(value);
            let len = value.length;
            let carcode = this.appendFilter.charAt(indxOf+len+4);
            let obj = {indxOf, len, carcode};
            return obj;
        },

        updatewidth() { // THIS METHOD GETS CALLED WHILE RESIZIG IMAGE'S WIDTH
            if(this.imgWidth < this.statwidth) {
                document.getElementById('imge').width  = this.imgWidth;
                console.log(this.statwidth, this.imgWidth)
                console.log(document.getElementById('imge').width)
                // console.log('if condition',this.statwidth)
            } else {
                console.log('else condition',this.statwidth)
                document.getElementById('imge').width = this.statwidth;
            }
        },

        updateheight() { // THIS METHOD GETS CALLED WHILE RESIZIG IMAGE'S HEIGHT

            console.log('update height')
            if(this.imgHeight < this.stathei) {
                document.getElementById('imge').height  = this.imgHeight;
                console.log('if condition',this.stathei)
            } else {
                // console.log(this.im'else condition',this.stathei)
                document.getElementById('imge').height = this.stathei;
            }

        },

        scaleImage() { // THIS METHOD IS CALLED WHEN IMAGE IS LOADED
                console.log('scale image called')
                this.imgWidth = document.getElementById('imge').width;
                this.imgHeight = document.getElementById('imge').height;
                if(this.imgHeight > 450) {
                    this.aspectratio(this.imgHeight, this.imgWidth)
                } else {
                    document.getElementById('imge').height = this.imgHeight
                    this.stathei = document.getElementById('imge').height;
                    this.statwidth = document.getElementById('imge').width;
                }
                console.log(document.getElementById('imge').height)
                console.log(document.getElementById('imge').width)
        },

        aspectratio (height, width) { // THIS METHOD IS USED TO SET ASPECT RATIO OF IMAGE WHILE RESIZING
            let ratio = width / height;
            document.getElementById('imge').width = ratio * 450;
            document.getElementById('imge').height = 450;
            this.stathei = document.getElementById('imge').height;
            this.statwidth = document.getElementById('imge').width;
        },

        tempLoop(value, appendtype) {// THIS LOOP IS USED FOR FILTER/FLIP PORTION
            let tempstr = '';
            console.log(value, appendtype)
            for(let i = value; i < appendtype.length; i++) {
                tempstr += appendtype[i]
                // console.log(tempstr )
                if(appendtype[i] === ')') {
                    break;
                }
                // console.log(tempstr)
            }
            return tempstr;
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

            console.log('scale called')
            this.imgWidth = document.getElementById('imge').width;
            this.imgHeight = document.getElementById('imge').height;

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

                    if(this.rangeType == 1|| this.rangeType == 4) {
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
                let indxOf = this.appendFilter.indexOf(filt);
                let lastchar = this.tempLoop(indxOf, this.appendFilter);
                console.log('last char',lastchar);
                this.appendFilter = this.appendFilter.replace(lastchar,result)
                document.getElementById('imge').style.filter = this.appendFilter;
            }
            console.log('appendfilter', this.appendFilter);
        },

        flipChange(val) { // THIS METHOD CALLS WHENEVER FLIP IMAGE ACTION CALLS

            let condVal = 1;
            let tempval = '';
            let mainRes = '';
            let isFlipAdded = false;

            for(let item of this.addedFlips)  {
                if(item === val) {
                    isFlipAdded = true;
                }
            }


            if(val == 'flipX') {
                this.flpX = !this.flpX;
                tempval = 'scaleX'
                mainRes = this.flpX ? 'scaleX(1)' : 'scaleX(-1)';
                console.log('x called')
            } else {
                this.flpY = !this.flpY;
                mainRes = this.flpY ? 'scaleY(1)' : 'scaleY(-1)';
                tempval = 'scaleY'

            }

            if(!isFlipAdded) {
                // console.log('not added yet')
                this.addedFlips.push(val);
                this.appendFlips += mainRes;
            } else {
                // console.log('already added!')
                let replaceString = '';
                let indxOf = this.appendFlips.indexOf(tempval);
                // console.log(tempval,indxOf,this.appendFlips, '1')
                replaceString = this.tempLoop(indxOf, this.appendFlips);
                // console.log(replaceString, mainRes)
                this.appendFlips = this.appendFlips.replace(replaceString,mainRes)
            }
            console.log(mainRes, val)
            document.getElementById('imge').style.webkitTransform = this.appendFlips;
             // console.log(this.appendFlips, this.flpX, this.flpY)
        },

        rotateChange(val,direction) {
            let value = 0;
            let degree = 0;
            if(direction == 'right' && val == 1) {
                value = 4;
            } else if(direction == 'right') {
                value = val - 1;
            }

            if(direction == 'left' && val == 4) {
                value = 1;
            } else if(direction == 'left') {
                value = val + 1;
            }

            if(value == 1) {
                degree = 0;
            } else if(value == 2){
                degree = 90;
            } else if(value == 3){
                degree = 180;
            } else {
                degree = 270;
            }

            this.rotateDegree = value;
            console.log(this.rotateDegree)
            document.getElementById('imge').style.webkitTransform = 'rotate('+degree+'deg)'

        }

    }

});
