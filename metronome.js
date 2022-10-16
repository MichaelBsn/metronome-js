const audioContext = new AudioContext()
const primaryGain = audioContext.createGain()
primaryGain.gain.setValueAtTime(0.05, 0)
primaryGain.connect(audioContext.destination)

let bpm = 120
let isRunning = false

// This Timer is not my own code, it's from musicandcode on Youtube
function Timer(callback, timeInterval, options) {
    this.timeInterval = timeInterval;

    // Add method to start timer
    this.start = () => {
        // Set the expected time. The moment in time we start the timer plus whatever the time interval is. 
        this.expected = Date.now() + this.timeInterval;
        // Start the timeout and save the id in a property, so we can cancel it later
        this.theTimeout = null;

        if (options.immediate) {
            callback();
        }

        this.timeout = setTimeout(this.round, this.timeInterval);
        console.log('Timer Started');
    }
    // Add method to stop timer
    this.stop = () => {

        clearTimeout(this.timeout);
        console.log('Timer Stopped');
    }
    // Round method that takes care of running the callback and adjusting the time
    this.round = () => {
        console.log('timeout', this.timeout);
        // The drift will be the current moment in time for this round minus the expected time..
        let drift = Date.now() - this.expected;
        // Run error callback if drift is greater than time interval, and if the callback is provided
        if (drift > this.timeInterval) {
            // If error callback is provided
            if (options.errorCallback) {
                options.errorCallback();
            }
        }
        callback();
        // Increment expected time by time interval for every round after running the callback function.
        this.expected += this.timeInterval;
        console.log('Drift:', drift);
        console.log('Next round time interval:', this.timeInterval - drift);
        // Run timeout again and set the timeInterval of the next iteration to the original time interval minus the drift.
        this.timeout = setTimeout(this.round, this.timeInterval - drift);
    }
}

function beep() {
    const noteOsc = audioContext.createOscillator();
    noteOsc.frequency.setValueAtTime(440, 0)
    noteOsc.connect(primaryGain);
    noteOsc.start();
    noteOsc.stop(audioContext.currentTime + 0.25)
}

const metronome = new Timer(beep, 60000 / bpm, { immediate: true });


const playPause = document.querySelector(".play-pause")
playPause.addEventListener('click', () => {
    if (!isRunning) {
        metronome.start()
        isRunning = true
    } else {
        metronome.stop()
        isRunning = false
    }

})