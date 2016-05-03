module.exports = {
  selectors: [ { name: 'osc1',
                 labelName: 'Oscillator 1',
                 optionsNames: ['Square', 'Sine', 'Triangle', 'Sawtooth'],
                 options: ['square', 'sine', 'triangle', 'sawtooth'] },
               { name: 'osc2',
                 labelName: 'Oscillator 2',
                 optionsNames: ['Square', 'Sine', 'Triangle', 'Sawtooth'],
                 options: ['square', 'sine', 'triangle', 'sawtooth'] },
               { name: 'filterType',
                 labelName: 'Filter Type',
                 optionsNames: ['Lowpass', 'Highpass', 'Bandpass'],
                 options: ['lowpass', 'highpass', 'bandpass'] }
               ],
      sliders: [ { name: 'attack',
                   labelName: 'Attack' },
                 { name: 'release',
                   labelName: 'Release' },
                 { name: 'filterCutoff',
                   labelName: 'Filter Cutoff' },
                 { name: 'osc1Detune',
                   labelName: 'Oscillator 1 Detune' },
                 { name: 'osc2Detune',
                   labelName: 'Oscillator 2 Detune' } ]

}
