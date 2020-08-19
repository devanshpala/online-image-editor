var app = new Vue({
    el: '#app',
    data: {
        rangeType: 0,
        main: ['crop', 'rotate', 'filter'],
        edits: ['Filters', 'Rotate','Flip','Resize','compress', 'image conversion','download image'],
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
        basicHeight:0,
        basicWidth:0,
        ftype: '',
        appendFlips: '',
        xflip:1,
        yflip:1,
        flips: ['flipX','flipY'],
        rotationDegree:0,
        tempfile: null,
        isrotated: false,
        },

    methods: {

        // addborderRadius() {
        //     console.log('border radius called')
        //     document.getElementById('imge').style.borderRadius = this.scale+"px"
        // },

        downloadImage() { // THIS FUNCTION CONVERTS IMAGE TO CANVAS TO SAVE ALL THE EFFECTS AND EDITS


            // console.log('download image is called')
            const imagee = document.getElementById('imge')
            const img = new Image();
            img.src = this.file


            const elem1 = document.createElement('canvas');
            const width = img.width

            elem1.width = this.imgWidth
            elem1.height = this.imgHeight

            const ctx1 = elem1.getContext('2d');

            ctx1.filter = this.appendFilter

            // this part is for flipping image
            ctx1.translate(0 + width/2, 0 + width/2);
            ctx1.scale(this.xflip, this.yflip)

            // end of the flipping image
            ctx1.translate(-(0 + width/2), -(0 + width/2));
            ctx1.drawImage(img, 0, 0, width, img.height);
            // const dataURI = elem1.toDataURL(this.ftype)
            // this.tempfile = dataURI
            // ctx1.clearRect(0, 0, this.imgWidth, this.imgHeight)


            // repeating 2nd time because flipping image and rotating image was conflicting
            // ROTATION PART
            // img.src = this.tempfile
            // ctx1.height = this.imgHeight
            // ctx1.width = this.imgWidth
            //
            // ctx1.translate(img.width/2,img.height/2)
            // ctx1.rotate(this.rotationDegree * Math.PI / 180)
            // ctx1.drawImage(img, -(img.width/2), -(img.height/2), this.imgWidth, this.imgHeight)

            let filetype = this.ftype == 'image/jpeg' ? 'jpeg' : 'png'

            ctx1.canvas.toBlob((blob) => {
                var fil = new File([blob], 'dev-image-editor-'+new Date().valueOf()+'.'+filetype, {
                    type: this.ftype,
                    lastModified: Date.now(),
                });
                    var imageUrl = URL.createObjectURL(fil);
                    console.log(imageUrl)
                    this.tempfile = imageUrl
                    // document.getElementById('downloadit').click()
            }, this.ftype, 1);

            // this.tempFunction();
            setTimeout(()=> {
                document.getElementById('downloadit').click(),
                this.appendFilter = "",
                this.appendFlips = "",
                this.rotationDegree = 0
                // this.file = this.tempfile
            },1000)
        },

        compressImage() { // THIS FUNCTION COMPRESSES IMAGE AND REDUCES PIXELS
              const img = new Image();
              img.src = this.file
              console.log(img.src)

                          const elem = document.createElement('canvas');
                          const width = 600
                          const scaleFactor = width / img.width;

                          elem.width = width;
                          elem.height = img.height * scaleFactor;

                          const ctx = elem.getContext('2d');
                          ctx.drawImage(img, 0, 0, width, img.height * scaleFactor);

                          ctx.canvas.toBlob((blob) => {
                              var fil = new File([blob], 'random', {
                                  type: this.ftype,
                                  lastModified: Date.now(),
                              });
                                  var imageUrl = URL.createObjectURL(fil);
                                  console.log(imageUrl)
                                  this.file = imageUrl
                          }, this.ftype, 0.5);


       },

        convertImageType() { // THIS FUNCTION CONVERTS JPG TO PNG AND PNG TO JPG VISE-VERSA

           const img = new Image();
           img.src = this.file


           const elem = document.createElement('canvas');
           const width = img.width
           // const scaleFactor = width / img.width;

           elem.width = width
           elem.height = img.height

           const ctx = elem.getContext('2d');
           ctx.drawImage(img, 0, 0, width, img.height);


           console.log(img.width, img.height)
           // ctx.drawImage(img,0,0);
           ctx.canvas.toBlob((blob)=> {
               if(this.ftype == 'image/jpeg') {
                   const dataURI = elem.toDataURL()
                   this.ftype = 'image/png'
                   this.file = dataURI
               } else {
                   const dataURI = elem.toDataURL('image/jpeg')
                   this.ftype = 'image/jpeg'
                   this.file = dataURI
               }
               // console.log('blob action called')
           })
           // this.file = dataURI;

           //
           // if(this.ftype == 'image/jpeg') {
           //      console.log('jpeg called')
           // } else {
           //     console.log('jpeg called')
           //     const dataURI = elem.toDataURL('image/jpeg')
           //     this.file = dataURI;
           // }
       },

        onChange(event) { // THIS METHOD CALLS WHEN IMAGE IS LOADED
            let src = URL.createObjectURL(event.target.files[0]);
            this.file = src;
            this.ftype = event.target.files[0].type
            this.onloadState = true;
            // this.compressImage(event)
        },

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
                // console.log('scale image called')
                this.imgWidth = document.getElementById('imge').width;
                this.imgHeight = document.getElementById('imge').height;
                this.basicWidth = this.imgWidth
                this.basicHeight = this.imgHeight
                if(this.imgHeight > 400) {
                    this.aspectratio(this.imgHeight, this.imgWidth)
                } else {
                    document.getElementById('imge').height = this.imgHeight
                    this.stathei = document.getElementById('imge').height;
                    this.statwidth = document.getElementById('imge').width;
                }
                // console.log(document.getElementById('imge').height)
                // console.log(document.getElementById('imge').width)






    },

        aspectratio (height, width) { // THIS METHOD IS USED TO SET ASPECT RATIO OF IMAGE WHILE RESIZING
            let ratio = width / height;
            document.getElementById('imge').width = ratio * 400;
            document.getElementById('imge').height = 400;
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

        changeEditState(val) { // THIS METHOD CALLS WHENEVER MAIN EDIT STATE CHANGES
            this.editState = val;
            if(val === 'compress') {
                this.compressImage()
            } else if(val === 'image conversion') {
                this.convertImageType()
            } else if(val === 'download image') {
                this.downloadImage()
            }
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
            this.xflip = this.flpX ? 1 : -1;
            this.yflip = this.flpY ? 1 : -1;
            // console.log(this.flpY)
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
            // console.log(mainRes, val)
            document.getElementById('imge').style.webkitTransform = this.appendFlips;
             // console.log(this.appendFlips, this.flpX, this.flpY)



        },

        rotateChange(val) {
            if(val == 'right') {
                if(this.rotationDegree != 0) {
                    this.rotationDegree = -90
                } else {
                    this.rotationDegree = 270
                }
            } else {
                if(this.rotationDegree == 360) {
                    this.rotationDegree = 90
                } else {
                    this.rotationDegree = 90
                    // console.log('tesr')
                }
            }
            console.log()
            console.log(val,this.rotationDegree)
            // document.getElementById('imge').style.webkitTransform = 'rotate('+this.rotationDegree+'deg)'



            const img = new Image();
            img.src = this.file

            const canElem = document.createElement('canvas');
            canElem.width = this.imgWidth
            canElem.height = this.imgHeight
            console.log(canElem.width, canElem.height)
            const ctxCan = canElem.getContext('2d');

            img.onload = () => {


                ctxCan.height = this.imgHeight
                ctxCan.width = this.imgWidth
                // if(this.imgHeight < this.imgWidth) {
                //         if(!this.isrotated) {
                //
                //             ctxCan.width = this.imgHeight
                //             ctxCan.height = this.imgWidth
                //
                //             console.log('false console called')
                //             ctxCan.translate(img.height/2,img.width/2)
                //             ctxCan.rotate(this.rotationDegree * Math.PI / 180)
                //             ctxCan.drawImage(img,-(img.height/2), -(img.width/2) , img.height, img.width)
                //             ctxCan.translate(-(img.width/2),-(img.height/2))
                //             this.isrotated = !this.isrotated
                //         } else {
                //
                //             ctxCan.translate(img.width/2,img.height/2)
                //             ctxCan.rotate(this.rotationDegree * Math.PI / 180)
                //             ctxCan.drawImage(img, -(img.width/2), -(img.height/2), img.width, img.height)
                //             ctxCan.translate(-(img.width/2),-(img.height/2))
                //
                //             console.log('true console called')
                //             this.isrotated = !this.isrotated
                //         }
                //
                // } else {

                    ctxCan.translate(img.width/2,img.height/2)
                    ctxCan.rotate(this.rotationDegree * Math.PI / 180)
                    ctxCan.drawImage(img, -(img.width/2), -(img.height/2), img.width, img.height)
                    ctxCan.translate(-(img.width/2),-(img.height/2))
                // }
                const datauri  = canElem.toDataURL(this.ftype)
                setTimeout(()=> {
                    this.file = datauri
                    const hei = document.getElementById('imge').height
                    const wid = document.getElementById('imge').width
                    console.log(this.rotationDegree, canElem.height, canElem.width)

                },1000)
            }
        }

    }

});
