var dataFromFile;
var width;
var height;
var outline;
var world;

function createHeight(width, outline, projection) {
    const [
        [x0, y0],
        [x1, y1]
    ] = d3.geoPath(projection.fitWidth(width, outline)).bounds(outline);
    const dy = Math.ceil(y1 - y0),
        l = Math.min(Math.ceil(x1 - x0), dy);
    projection.scale(projection.scale() * (l - 1) / l).precision(0.2);
    return dy;
}

function createChart(width, height, outline, location, world, data) {
    {
        const svg = d3.create("svg")
            .style("display", "block")
            .attr("viewBox", [0, 0, width, height]);

        const defs = svg.append("defs");

        defs.append("path")
            .attr("id", "outline")
            .attr("d", path(outline));

        defs.append("clipPath")
            .attr("id", "clip")
            .append("use")
            .attr("xlink:href", new URL("#outline", location));

        const g = svg.append("g")
            .attr("clip-path", `url(${new URL("#clip", location)})`);

        g.append("use")
            .attr("xlink:href", new URL("#outline", location))
            .attr("fill", "white");

        g.append("g")
            .selectAll("path")
            .data(countries.features)
            .join("path")
            .attr("fill", d => color(data.get(d.properties.iso)))
            .attr("d", path)
            .append("title")
            .text(d => `${d.properties.name}
      ${data.has(d.properties.iso) && data.get(d.properties.iso) != "-" ? data.get(d.properties.iso) : "N/A"}`);

        g.append("path")
            .datum(topojson.mesh(world, world.objects.countries, (a, b) => a !== b))
            .attr("fill", "none")
            .attr("stroke", "white")
            .attr("stroke-linejoin", "round")
            .attr("d", path);

        svg.append("use")
            .attr("xlink:href", new URL("#outline", location))
            .attr("fill", "none")
            .attr("stroke", "black");

//        svg.selectAll("path")
//            .data(countries)
//.console.log()

        return svg.node();
    }
}

async function fetchFiles() {
    world = await ((await fetch('countries-50m.json')).json());
    dataFromFile = await ((await fetch('../datasets/temperatures.json')).json());
    console.log(dataFromFile)
    dataFromFile = dataFromFile[1363].data;
    
    return [world, dataFromFile];
}

function test() {
    fetchFiles().then(([world, dataFromFile]) => {
        countries = topojson.feature(world, world.objects.countries);

        outline = ({
            type: "Sphere"
        })

        width = 975;

        projection = d3.geoMercator();

        height = createHeight(width, outline, projection);
        path = d3.geoPath(projection);

        // Data to show => transform json object to map with new names
        data = Object.assign(new Map(Object.entries(dataFromFile).map(([k, v]) => [k, v])), {
            title: "Healthy life expectancy (years)"
        })

        // Color to the graph
        color = d3.scaleSequential()
            .domain(d3.extent(Array.from(data.values())))
            //.interpolator(d3.interpolateYlGnBu)
            .range(["blue", "red"])
            .unknown("#ccc")

        chart = createChart(width, height, outline, "http://localhost:8080/", world, data);
        document.body.append(chart);
    })
}

function test2() {
    // Delete old map
    d3.select("svg").remove();

    // Change data
    newData = new Map();
    data.forEach((v, k) => {
        newData.set(k, v - 5);
    });

    // Show new data
    chart = createChart(width, height, outline, "http://localhost:8080/", world, newData);
    document.body.append(chart);
}
test();