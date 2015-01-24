var lame = require('lame');
var Speaker = require('speaker');
var fs = require('fs');
var util = require('util');
var serialport = require('serialport');
var SerialPort = serialport.SerialPort;
var currentTag;
var stream;

// Tags and Tracks
var tags = {
    '431F629AA4': 'mp3/beastie-boys.mp3',
    'C388629AB3': 'mp3/led-zeppelin.mp3'
};

// Serial Port Data
var myPort = new SerialPort("/dev/tty.usbmodem1421", {
    parser: serialport.parsers.readline("\r\n")
});

// Read from serial
myPort.on("open", function() {
    console.log('open');
    myPort.on("data", function(data) {
        tag = data.toString();
        playSong(tag);
    })
});

playSong = function(tag) {

    console.log('Tag: ' + tag);
    console.log('Current Tag: ' + currentTag);

    // If tag is new
    if (tag != currentTag) {
        // Reset the current tag
        currentTag = tag;

        // If stream is already running stop
        if (typeof(stream) != 'undefined') {
            stream.end();
        }

        // Start stream
        stream = fs.createReadStream(tags[tag])
            .pipe(new lame.Decoder)
            .on('format', console.log)
            .pipe(new Speaker);

    }

};