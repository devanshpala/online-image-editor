
var app = new Vue({
    el: '#app',
    data: {
        state: true,
        main: ['crop', 'rotate', 'filter'],
        edits: ['Filters', 'Crop/Rotate', 'Flip','Resize'],
        editState: null,
        filterState: null,
        onloadState: false,
        file: null,
        addedFilters: [],
        scale: 0,
        appendFilter: '',
        filter: ['grayscale','invert','contrast','saturate','sepia'],
        },
    methods: {
        onSubmit() {
            if(this.validate(this.input)) {
                this.names.push(this.input);
                this.input = '';
                console.log('validated')
            }
            else {
                alert('Please input Name')
            }
        },
        validate(value) {
            if(value !== '')
                return true;
            else
                return false;
        },
        findName() {
             this.state = false;
             let loosername = this.names[Math.floor(Math.random() * this.names.length)]
             this.result = loosername;
             console.log(loosername, this.result)
        },
        startAgain() {
            this.names = []
            this.state = true;
        },
        onChange(event) {
            // console.log('onChange called')
            let src = URL.createObjectURL(event.target.files[0]);
            // console.log(src)
            this.file = src;
            this.onloadState = true;
        },
        changeEditState(val) {
            this.editState = val;
        },
        changeFilterState(val) {
            // let val = this.filterState;
            this.filterState = val;
            // let
            for(let item of this.addedFilters) {
                if(val === item) {
                    let idxOf = this.appendFilter.indexOf(val);
                    let len = val.length;
                    let carcode = this.appendFilter.charAt(idxOf+len+4);
                    if(carcode == '%') {
                            this.scale = 100
                            console.log(this.scale,'100 percent');
                            break;
                    } else {
                        let slc = 0
                        slc = this.appendFilter.slice(idxOf+len+1,idxOf+len+3);
                        this.scale = parseInt(slc);
                        console.log(this.scale);
                        break;
                    }
                } else {
                    this.scale = 0;
                }
                console.log('final scale',this.scale)
            }

        },
        filterChange() {
            let isAdded = false;
            let filt = this.filterState
            let result = ''+filt+'('+this.scale+'%)';
            // console.log(filt);

            for(let item of this.addedFilters) {
                if(item == filt) {
                    isAdded = true;
                }
            }

            if(!isAdded) {

                this.addedFilters.push(filt)
                this.appendFilter += result;
                // console.log('filter', this.addedFilters+' filter added');
                document.getElementById('imge').style.filter = this.appendFilter;

            } else {

                let idxOf = this.appendFilter.indexOf(filt);
                let len = filt.length;
                let carcode = this.appendFilter.charAt(idxOf+len+4);
                let sstore = ''

                if(carcode == '%') {
                        console.log('% called')
                        sstore = this.appendFilter.slice(idxOf,idxOf+len+6);
                } else {
                    console.log('% not called')
                    // console.log('99 percent', idxOf, len+5)
                        sstore = this.appendFilter.slice(idxOf,idxOf+len+5);
                }
                console.log(idxOf, sstore, len+5)
                this.appendFilter = this.appendFilter.replace(sstore,result)
                // console.log('2nd time called', this.appendFilter)
                document.getElementById('imge').style.filter = this.appendFilter;
            }
            console.log(this.appendFilter);
            // console.log(this.addedFilters)
        }
    }

});
