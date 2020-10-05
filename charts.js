function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}


// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array.
    var samplesArray = data.samples;

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = samplesArray.filter(sampleObj => sampleObj.id == sample);

    //  5. Create a variable that holds the first sample in the array.
    var result = resultArray[0];
    console.log(result)

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var ids = result.otu_ids
    var labels = result.otu_labels
    var sv = result.sample_values

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order
    //  so the otu_ids with the most bacteria are last.
    var sortedSamples = sv.sort((a,b) => a - b).reverse();
    var topTenSamples = sortedSamples.slice(0,10);
    //var topTenIds = topTenSamples.map(sampl => parseInt(sampl.otu_ids))
    //console.log(topTenSamples);
    var topTenIds = ids.slice(0,10);
    //console.log(topTenIds)

    //var samples = sv.filter(sampl => sampl.otu_ids == topTenSamples)
    //var top_values = sample_values.map(value => sample_values.value)

    var yticks = topTenIds.map(id => 'OTU ' + id)

    // 8. Create the trace for the bar chart.
    var barData = [{
        x: topTenSamples,
        y: yticks,
        type: 'bar',
        orientation: 'h',
        text: labels
    }];

    // 9. Create the layout for the bar chart.
    var barLayout = {
        title: 'Top 10 Bacteria Cultures Found',
        yaxis: {autorange: "reversed"},
        hovermode: 'closest'
    };

    // 10. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bar", barData, barLayout);


      // 1. Create the trace for the bubble chart.
    var bubbleData = [{
        x: ids,
        y: sv,
        mode: 'markers',
        text: labels,
        marker: {
    color: ids,
    size: sv,
    colorscale: 'Portland',
    hoverinfo: "labels"
        }
    }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
        title: 'Bacteria Cultures Per Sample',
        hovermode: 'closest',
        xaxis: {title: 'OTU ID'}
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble', bubbleData, bubbleLayout);

    var meta = data.metadata
    var washingArray = meta.filter(obj => obj.id == sample)
    var washingFreqResult = washingArray[0]
    var washingFreq = washingFreqResult.wfreq
    var wfreq = parseFloat(washingFreq)

    var gaugeData = [{
        domain: { x: [0, 1], y: [0, 1] },
        value: wfreq,

        type: "indicator",
        mode: "gauge+number",
        gauge: {
            bar: { color: "#000000"},
            axis: { range: [null,10]},
            steps: [ {range: [0,10], color: '#FFFFFF'},
                     {range: [0,2], color: '#FF0000'},
                     {range: [2,4], color: '#FF7700'},
                     {range: [4,6], color: '#FFFF00'},
                     {range: [6,8], color: '#77FF00'},
                     {range: [8,10], color: '#228B22'}],
            threshold: {
                       line: { color: 'black'}
            }

                }
        }
    ];

    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { width: 500,
                        height: 400,
                        margin: { t: 0, b: 0 },
                        title: "<br><b>Belly Button Washing Frequency</b><br>Scrubs per Week" }

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge', gaugeData, gaugeLayout);


  });
}



