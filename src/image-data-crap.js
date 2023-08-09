class ImageDataCrap {
    static key = " ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    /**
     * 
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
    static async encodeBlob(blob) {
        return await this.encode(await (this.blobToBase64(blob)));
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
        return await this.base64ToBlob(await this.decode(imageblob));
    }

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
        ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";//","+(a/255)+")";
        ctx.fillRect(x, y, 1, 1);
    }
    static createCanvas() {
        const canvas = document.createElement("canvas");
        canvas.width = "100000";
        canvas.height = "1";
        document.body.append(canvas);
        return canvas;
    }
}
export default ImageDataCrap;