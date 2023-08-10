class ImageDataCrap {
    static key = " ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    /**
     * @deprecated Uses classic encoding style
     * @param {string} data Base64 data string
     */
    static encode(data) {
        console.log(data);
        const key = this.key;
        const canvas = this.createCanvas();
        const ctx = canvas.getContext("2d");
        for (let x = 0; x < data.length; x++) {
            const value = key.indexOf(data.substring(x, x + 1));
            console.log(value);
            console.log(data.substring(x, x+1));
            this.editPixel(ctx, x, 0, 0, value, 0, 255);
        }
        return new Promise((resolve) => {
            canvas.toBlob(blobby => {
                canvas.remove();
                resolve(blobby);
            }, "image/png", 1);
        });
    }
    /**
     * 
     * @param {Blob} blob 
     * @returns 
     */
    static async encodeBlob(blob) {
        // return await this.encode(await (this.blobToBase64(blob)));
        const data = new Uint8ClampedArray(await blob.arrayBuffer());
        const first = data.byteLength%4; //Amount of bytes from the last pixel that are valid
        const store = new Uint8ClampedArray(new ArrayBuffer(data.byteLength+4+(4-first)));
        store.set([first, 0, 0, 0], 0);
        store.set(data, 4);
        const width = store.length/4;
        const canvas = this.createCanvas();
        canvas.width = width;
        const ctx = canvas.getContext("2d", {alpha: false});
        const imgstore = new ImageData(store, width, 1);
        console.log(data);
        console.log(store);
        ctx.putImageData(imgstore, 0, 0);
        return await new Promise((resolve) => {
            canvas.toBlob(blobby => {
                canvas.remove();
                console.log(URL.createObjectURL(blobby));
                resolve(blobby);
            }, "image/png", 1);
        });
    }
    static blobToBase64(blob) {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        return new Promise(resolve => {
            reader.onloadend = () => {
                resolve(reader.result.split("base64,")[1]);
            };
        });
    }
    static async base64ToBlob(b64Data, contentType = 'application/octet-stream') {
        console.log(b64Data);
        const blob = await (await fetch(`data:${contentType};base64,${b64Data}`)).blob();
        return blob;
    }

    static async decodeBlob(imageblob) {
        const bitmap = await createImageBitmap(imageblob);
        const canvas = this.createCanvas();
        canvas.width = bitmap.width;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(bitmap, 0, 0);
        const whole = ctx.getImageData(0, 0, canvas.width, 1).data;
        console.log(whole);
        const first = whole[0];
        console.log(first);
        const file = whole.slice(4, whole.length - (4 - first));
        console.log(file);
        canvas.remove();
        return new Blob([file], {type: "application/octet-stream"});    
    }

    /**
     * @deprecated Uses classic encoding style
     * @param {Blob} imageblob 
     * @returns 
     */
    static async decode(imageblob) {
        const bitmap = await createImageBitmap(imageblob);
        const canvas = this.createCanvas();
        const ctx = canvas.getContext("2d");
        const key = this.key;
        let base64ret = "";
        ctx.drawImage(bitmap, 0, 0);
        for (let x = 0; x < canvas.width; x++) {
            let id = ctx.getImageData(x, 0, 1, 1);
            id = id.data[1];
            const conv = key.substring(id, id + 1);
            console.log(conv);
            if (conv !== " ") {
                base64ret += key.substring(id, id + 1);
            }
        }
        canvas.remove();
        return base64ret;

    }
    static editPixel(ctx, x, y, r, g, b, a) {
        ctx.fillStyle = "rgbA(" + r + "," + g + "," + b + ","+(a/255)+")";
        ctx.fillRect(x, y, 1, 1);
    }
    static createCanvas() {
        const canvas = document.createElement("canvas");
        canvas.width = "6200000";
        canvas.height = "1";
        document.body.append(canvas);
        return canvas;
    }
}
export default ImageDataCrap;