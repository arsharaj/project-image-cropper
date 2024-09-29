$(document).ready(function () {
    var cropper;

    $('#image').on('change', function (e) {
        var file = e.target.files[0];
        if (file) {
            var reader = new FileReader();
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
        var croppedCanvas = cropper.getCroppedCanvas({
            fillColor: '#fff'
        });
        $('#cropped-image').attr('src', croppedCanvas.toDataURL());
        $('#cropped-preview').removeClass('d-none');
        $('#save-button').removeClass('d-none');
        $('#download-button').removeClass('d-none');
    });

    $('#save-button').on('click', function () {
        $('#spinner').removeClass('d-none');

        cropper.getCroppedCanvas({
            fillColor: '#fff'
        }).toBlob(function (cropped) {
            const postUrl = 'https://file.io';
            const expiry = '1d';

            const formData = new FormData();
            formData.append('file', cropped);
            formData.append('expires', expiry);
            formData.append('name', 'image.png');
            formData.append('title', 'Image Cropper');
            formData.append('description', 'Cropped using Image Cropper');

            $.ajax({
                method: 'POST',
                url: postUrl,
                data: formData,
                processData: false,
                contentType: false,
                success(response) {
                    $('#spinner').addClass('d-none');
                    $('#upload-url').attr('href', response.link).text(response.link);
                    $('#upload-success').removeClass('d-none');
                },
                error(error) {
                    console.log(error);
                    $('spinner').addClass('d-none');
                    $('#upload-error').removeClass('d-none');
                }
            });
        });
    });

    $('#download-button').on('click', function () {
        var imageLink = $('#cropped-image').attr('src');
        var fileName = 'image.png';
        const downloadLink = document.createElement('a');
        downloadLink.href = imageLink;
        downloadLink.download = fileName;
        downloadLink.click();
    });
});