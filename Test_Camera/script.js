document.addEventListener('DOMContentLoaded', (event) => {
    const videoElement = document.getElementById('videoElement');
    const startRecordButton = document.getElementById('startRecord');
    const stopRecordButton = document.getElementById('stopRecord');
    let mediaRecorder;
    let recordedChunks = [];

    navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
            videoElement.srcObject = stream;
            mediaRecorder = new MediaRecorder(stream);

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    recordedChunks.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(recordedChunks, { type: 'video/webm' });
                const formData = new FormData();
                formData.append('video', blob, 'recorded.webm');

                fetch('save.php', {
                    method: 'POST',
                    body: formData
                })
                .then(response => {
                    console.log('Video uploaded successfully');
                })
                .catch(error => {
                    console.error('Error uploading video:', error);
                });

                recordedChunks = [];
            };
        })
        .catch((error) => {
            console.error('Error accessing webcam:', error);
        });

    startRecordButton.addEventListener('click', () => {
        mediaRecorder.start();
        startRecordButton.disabled = true;
        stopRecordButton.disabled = false;
    });

    stopRecordButton.addEventListener('click', () => {
        mediaRecorder.stop();
        startRecordButton.disabled = false;
        stopRecordButton.disabled = true;
    });
});
