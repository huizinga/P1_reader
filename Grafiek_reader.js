        var DELAY = 10000; // delay in ms to add new data points

        var strategy = document.getElementById("strategy");

        // create a graph2d with an (currently empty) dataset
        var container = document.getElementById("visualization");
        var dataset = new vis.DataSet();

        var options = {
            start: vis.moment().add(-1000, "seconds"), // changed so its faster
            end: vis.moment(),
            dataAxis: {
                left: {
                    range: {
                        min: -10,
                        max: 50
                    }
                }
            },
            drawPoints: {
                style: "circle" // square, circle
            }
        };
        var graph2d = new vis.Graph2d(container, dataset, options);

        function renderStep() {
            // move the window (you can think of different strategies).
            var now = vis.moment();
            var range = graph2d.getWindow();
            var interval = range.end - range.start;

            //     graph2d.setWindow(now - interval, now, { animation: false }); //contnuous
            //      requestAnimationFrame(renderStep);

            //      graph2d.setWindow(now - interval, now, { animation: false }); //discrete

            // move the window 90% to the left when now is larger than the end of the window
            if (now > range.end) {
                graph2d.setWindow(now - 0.1 * interval, now + 0.9 * interval);
            }
            setTimeout(renderStep, DELAY);
        }
        renderStep();

        /**
         * Add a new datapoint to the graph
         */
        function addDataPoint() {
            // add a new data point to the dataset
            var now = vis.moment();

 //           $.getJSON("HTTP://192.168.0.151/api", function(data) {
                $.get("/api").done(function (data) {
                console.log(data);        
                dataset.add({
                    x: now,
                    y: data.T
                });
            });

            // remove all data points which are no longer visible
            var range = graph2d.getWindow();
            var interval = range.end - range.start;
            var oldIds = dataset.getIds({
                filter: function(item) {
                    return item.x < range.start - interval;
                }
            });
            dataset.remove(oldIds);

            setTimeout(addDataPoint, DELAY);
        }
        addDataPoint();

