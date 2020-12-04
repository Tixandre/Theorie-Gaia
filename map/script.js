var dataFromFile;
var width;
var height;
var world;
var countries;

// Color to the graph
const colorScale = d3.scaleSequential()
    .domain(d3.extent([-30, 60] /*Array.from(data.values())*/ ))
    //.interpolator(d3.interpolateYlGnBu)
    .range(["blue", "red"])
    .unknown("#ccc");

const outline = ({
    type: "Sphere"
});

const projection = d3.geoMercator();
const path = d3.geoPath(projection);

function createHeight(width) {
    const [
        [x0, y0],
        [x1, y1]
    ] = d3.geoPath(projection.fitWidth(width, outline)).bounds(outline);
    const dy = Math.ceil(y1 - y0),
        l = Math.min(Math.ceil(x1 - x0), dy);
    projection.scale(projection.scale() * (l - 1) / l).precision(0.2);
    return dy;
}

function createChart(width, height, world, data) {
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

        const g = svg.append("g")

        g.append("use")
            .attr("fill", "white");

        g.append("g")
            .selectAll("path")
            .data(countries.features)
            .join("path")
            .attr("fill", d => colorScale(data.get(d.properties.iso)))
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
            .attr("fill", "none")
            .attr("stroke", "black");

        return svg.node();
    }
}


function getData(date) {
    dataFromFile = getTemperaturesByMonth(date);

    // Data to show => transform json object to map with new names
    data = Object.assign(new Map(Object.entries(dataFromFile).map(([k, v]) => [k, v])), {
        title: "Healthy life expectancy (years)"
    })
    return data;
}

function showLegend() {
    var svg = d3.select("svg");

    svg.append("g")
        .attr("class", "legendLinear")
        .attr("transform", "translate(0,20)");

    var legendLinear = d3.legendColor()
        .title("Temperature hue [°C]")
        .labelFormat(d3.format("d"))
        .labelOffset(3)
        .shapeWidth(15)
        .shapeHeight(8)
        .cells(10)
        .orient('horizontal')
        .scale(colorScale);

    svg.select(".legendLinear")
        .call(legendLinear);
}

function init() {
    fetch('countries-50m.json').then(x => x.json()).then(x => {

        world = x;
        countries = topojson.feature(world, world.objects.countries);
        width = 975;

        height = createHeight(width, projection);

        let data = getData("1900-01-01");
        chart = createChart(width, height, world, data);
        document.body.append(chart);
        showLegend();
    })
}

function update() {
    // Delete old map
    d3.select("svg").remove();

    let annee = document.getElementById("annee").value;

    let data = getData(annee + "-01-01");

    // Show new data
    chart = createChart(width, height, world, data);
    document.body.append(chart);
    showLegend();
}
init();