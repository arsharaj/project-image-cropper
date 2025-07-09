jQuery(function () {
    let cropper;

    $('#image').on('change', function (e) {
        let file = e.target.files[0];
        if (file) {
            let reader = new FileReader();
            reader.onload = function (event) {
                $('#selected-image').attr('src', event.target.result);
                $('#image-preview').removeClass('d-none');
                $('#crop-button').removeClass('d-none');
                $('#reset-button').removeClass('d-none');
                if (cropper) {
                    cropper.destroy();
                    cropper = null;
                }
                cropper = new Cropper(document.getElementById('selected-image'), {
                    viewMode: 3,
                    dragMode: 'move',
                    aspectRatio: 1,
                    center: true,
                    minCropBoxWidth: 50,
                    minCropBoxHeight: 50
                });
            }
            reader.readAsDataURL(file);
        }
    });

    $('#crop-button').on('click', function () {
        let croppedCanvas = cropper.getCroppedCanvas({
            fillColor: '#fff'
        });
        $('#cropped-image').attr('src', croppedCanvas.toDataURL());
        $('#cropped-preview').removeClass('d-none');
        $('#download-button').removeClass('d-none');
    });

    $('#download-button').on('click', function () {
        let imageLink = $('#cropped-image').attr('src');
        let fileName = 'image.png';
        const downloadLink = document.createElement('a');
        downloadLink.href = imageLink;
        downloadLink.download = fileName;
        downloadLink.click();
    });
})