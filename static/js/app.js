// Define the optionChanged function to avoid errors
function optionChanged(selectedID) {
  let selectedSample = data.samples.find(sample => sample.id === selectedID);
  let selectedMetadata = data.metadata.find(metadata => metadata.id.toString() === selectedID);
  
  // Update all the plots when a new sample is selected
  
  // Update Horizontal bar chart with a dropdown menu to display the top 10 OTUs
  let updatedValues = selectedSample.sample_values.slice(0, 10).reverse();
  let updatedIDs = selectedSample.otu_ids.slice(0, 10).reverse();
  let updatedLabels = selectedSample.otu_labels.slice(0, 10).reverse();

  Plotly.update("bar", {
    x: [updatedValues],
    y: [updatedIDs.map(id => `OTU ${id}`)],
    text: [updatedLabels]
  });

  // Update Bubble chart that displays each sample
  Plotly.update("bubble", {
    x: [selectedSample.otu_ids],
    y: [selectedSample.sample_values],
    text: [selectedSample.otu_labels],
    "marker.size": [selectedSample.sample_values],
    "marker.color": [selectedSample.otu_ids]
  });

  // Update the Display the sample metadata
  let metadataPanel = d3.select("#sample-metadata");
  metadataPanel.html("");
  Object.entries(selectedMetadata).forEach(([key, value]) => {
    metadataPanel.append("p").text(`${key}: ${value}`);
  });
}

// Declare the data variable in the global scope so it can be accessed by both the optionChanged function and the initial .then block.
let data;

// Use the D3 library to read in samples.json from the URL
d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json")
  .then(function(jsonData) {
    data = jsonData; 

    let dropdown = d3.select("#selDataset");

    data.names.forEach(function(name) {
      dropdown.append("option").text(name).property("value", name);
    });
    // Horizontal bar chart with a dropdown menu to display the top 10 OTUs
    let sampleValues = data.samples[0].sample_values.slice(0, 10).reverse();
    let otuIDs = data.samples[0].otu_ids.slice(0, 10).reverse();
    let otuLabels = data.samples[0].otu_labels.slice(0, 10).reverse();

    let trace1 = {
      x: sampleValues,
      y: otuIDs.map(id => `OTU ${id}`),
      text: otuLabels,
      type: "bar",
      orientation: "h"
    };

    let layout = {
      width: 900,
      bargap: 0.1
    };

    let barData = [trace1];

    Plotly.newPlot("bar", barData, layout);

    // Bubble chart that displays each sample
    let bubbleTrace = {
      x: data.samples[0].otu_ids,
      y: data.samples[0].sample_values,
      text: data.samples[0].otu_labels,
      mode: "markers",
      marker: {
        size: data.samples[0].sample_values,
        color: data.samples[0].otu_ids,
        colorscale: "Earth"
      }
    };

    let bubbleData = [bubbleTrace];

    let bubbleLayout = {
      xaxis: { title: "OTU ID" }
    };

    Plotly.newPlot("bubble", bubbleData, bubbleLayout);


    //Display the sample metadata    
    let metadata = data.metadata[0];
    let metadataPanel = d3.select("#sample-metadata");

    Object.entries(metadata).forEach(([key, value]) => {
      metadataPanel.append("p").text(`${key}: ${value}`);
    });

    d3.select("#selDataset").on("change", function() {
      optionChanged(this.value);
    });

    optionChanged(data.names[0]);
  })
  .catch(function(error) {
    console.log(error);
  });


