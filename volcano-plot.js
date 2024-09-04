document.addEventListener("DOMContentLoaded", function () {
    const fileInput = document.getElementById('file-upload');
    const plotCanvas = document.getElementById('dynamic-volcano-plot');
    const dynamicPlotSection = document.getElementById('dynamic-plot-section');

    fileInput.addEventListener('change', handleFileUpload);

    function handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) {
            showMessage("No file selected. Please upload a file.", true);
            return;
        }

        // Display upload success message
        showMessage("Upload successful, parsing file... Please wait for up to 10 seconds.");

        const reader = new FileReader();
        reader.onload = function (e) {
            const content = e.target.result;
            
            // Get the file extension and convert it to lowercase
            const fileType = file.name.split('.').pop().toLowerCase();

            // Attempt to parse the file based on its type
            setTimeout(() => {
                let data;
                if (fileType === 'csv' || fileType === 'tsv' || fileType === 'txt') {
                    const delimiter = fileType === 'tsv' ? '\t' : ',';
                    data = parseData(content, delimiter);
                } else {
                    showMessage("Unsupported file type. Please upload a CSV, TSV, or TXT file.", true);
                    return;
                }

                if (data.logFoldChanges.length > 0 && data.pValues.length > 0) {
                    // Generate the plot after successful parsing
                    createVolcanoPlot(data);
                } else {
                    // Display parse failure message if no data was parsed
                    showMessage("Parse failed, please try again or reload the page.", true);
                }
            }, 1000); // Simulated delay of 1 second
        };

        reader.onerror = function() {
            showMessage("Error reading file. Please try again.", true);
        };

        reader.readAsText(file);
    }

    function parseData(content, delimiter) {
        console.log("Parsing data with delimiter:", delimiter); // Debugging output
        const rows = content.split('\n');
        const logFoldChanges = [];
        const pValues = [];

        rows.forEach((row, index) => {
            const columns = row.split(delimiter);
            if (columns.length >= 2 && !isNaN(columns[0]) && !isNaN(columns[1])) {
                logFoldChanges.push(parseFloat(columns[0]));
                pValues.push(parseFloat(columns[1]));
            }
        });

        console.log("Parsed data:", { logFoldChanges, pValues }); // Debugging output
        return { logFoldChanges, pValues };
    }

    function createVolcanoPlot(data) {
        const { logFoldChanges, pValues } = data;
        const negLogPValues = pValues.map(p => -Math.log10(p));

        // Destroy the previous chart if it exists
        if (window.dynamicChart) {
            window.dynamicChart.destroy();
        }

        // Create the chart
        const ctx = plotCanvas.getContext('2d');
        window.dynamicChart = new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Dynamic Volcano Plot',
                    data: logFoldChanges.map((fc, i) => ({ x: fc, y: negLogPValues[i] })),
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                    pointRadius: 5,
                }]
            },
            options: {
                scales: {
                    x: { title: { display: true, text: 'Log2 Fold Change' } },
                    y: { title: { display: true, text: '-Log10(p-value)' } }
                }
            }
        });

        showMessage("Plot generated successfully.");
    }

    function showMessage(message, isError = false) {
        let messageElement = document.getElementById('upload-message');
        if (!messageElement) {
            messageElement = document.createElement('p');
            messageElement.id = 'upload-message';
            dynamicPlotSection.appendChild(messageElement);
        }
        messageElement.textContent = message;
        messageElement.style.color = isError ? 'red' : 'green';
        console.log(message); // Debugging output
    }
});
