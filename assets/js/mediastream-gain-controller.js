function GainController(stream) {
    this.gain = 1;
    var context = this.context = new AudioContext();
    this.microphone = context.createMediaStreamSource(stream);
    this.gainFilter = context.createGain();
    this.destination = context.createMediaStreamDestination();
    this.originalStream = stream;
    this.outputStream = this.destination.stream;
    // microphone > filter > output
    this.microphone.connect(this.gainFilter);
    this.gainFilter.connect(this.destination);
}

GainController.prototype.setGain = function(val) {
    this.gainFilter.gain.value = val;
    this.gain = val;
};

GainController.prototype.getGain = function() {
    return this.gain;
};

GainController.prototype.off = function() {
    return this.setGain(0);
};

GainController.prototype.on = function() {
    this.setGain(1);
};