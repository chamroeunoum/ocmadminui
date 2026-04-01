export const imgUrlToBase64 = (url, callback) => {
    var image = new Image();
    image.setAttribute('crossOrigin', 'anonymous'); // use it if you try in a different origin of your web
    image.onload = function () {
        var canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;

        canvas.getContext('2d').drawImage(this, 0, 0);

        canvas.toBlob(
            function(source) {
                var newImg = document.createElement("img"),
                url = URL.createObjectURL(source);

                newImg.onload = function() {
                    // no longer need to read the blob so it's revoked
                    URL.revokeObjectURL(url);
                };
                newImg.src = url;
            },
            "image/jpeg",
            1
        );

        // If you ever stumble at 18 DOM Exception, just use this code to fix it
        // let dataUrl = canvas.toDataURL("image/jpeg").replace("image/jpeg", "image/octet-stream");
        callback( 
            // DataURL
            canvas.toDataURL("image/jpeg") 
        );
    };
    image.src = url;
}