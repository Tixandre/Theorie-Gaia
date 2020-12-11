var dataFromFile;
var width;
var height;
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

function createChart(width, height, data, disasters) {
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


        g.append("g")
            .selectAll("path")
            .data(countries.features)
            .join("path")
            .attr("fill", d => colorScale(data.get(d.properties.iso)))
            .attr("d", path)
            .attr("iso", d => d.properties.iso)
            .attr("cursor", "pointer")
            .on("click", clicked)
            .append("title")
            .text(d => `${d.properties.name}
      ${data.has(d.properties.iso) && data.get(d.properties.iso) != "-" ? data.get(d.properties.iso).toFixed(2) + "°C" : "N/A"}
      ${d.properties.iso in disasters ? disasters[d.properties.iso].length + " disaster(s)" : ""}`);

        g.append("path")
            .datum(topojson.mesh(world, world.objects.countries, (a, b) => a !== b))
            .attr("fill", "none")
            .attr("stroke", "white")
            .attr("stroke-linejoin", "round")
            .attr("d", path);

        svg.append("use")
            .attr("fill", "none")
            .attr("stroke", "black");

        // add circles to svg

        let coords = [];
        for (k in disasters) {
            if (isoToCoord[k])
                coords.push(isoToCoord[k])
        }
        svg.selectAll("circle")
            .data(coords).enter()
            .append("circle")
            .attr("cx", function (d) {

                // console.log(projection(d));
                return projection(d)[0];
            })
            .attr("cy", function (d) {
                return projection(d)[1];
            })
            .attr("r", "3px")
            .attr("fill", "black")
        return svg.node();
    }
}

function clicked(event, d) {
    console.log(d);
    location.href = "tendance.html?iso=" + d.properties.iso;
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
        .attr("transform", "translate(10,20)");

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

    svg.append("g")
        .attr("class", "legendOrdinal")
        .attr("transform", "translate(15,80)");

    var ordinal = d3.scaleOrdinal()
        .domain(["Country with disaster"])
        .range(["black"]);

    var legendOrdinal = d3.legendColor()
        .shape("path", d3.symbol().type(d3.symbolCircle).size(80)())
        .scale(ordinal);

    svg.select(".legendOrdinal")
        .call(legendOrdinal);
}

function init() {
    countries = topojson.feature(world, world.objects.countries);
    width = 975;
    height = createHeight(width, projection);

    update(true);
}

var lastYear = 1900;
var lastMonth = 1;

function update(change = false) {
    let year = slider.getValue();
    let month = sliderMonth.getValue();

    if (lastYear != year || lastMonth != month || change) {
        // Delete old map
        d3.select("svg").remove();


        let data = getData(year + "-" + month + "-01");
        let filters = createFilterArray($('#filters'));
        let disasters = getDisastersByMonth(year + "-" + month + "-01", undefined, filters);
        // Show new data
        chart = createChart(width, height, data, disasters);
        $('#temp_cata').append(chart);
        showLegend();
        lastYear = year;
        lastMonth = month;
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


var animationInProgress = false;
async function mapAnimation() {
    if (animationInProgress) {
        $("#btnAnim").text("Launch the timelapse");
        animationInProgress = false;
    } else {
        $("#btnAnim").text("Pause the timelapse");
        animationInProgress = true;
        for (let year = slider.getValue(); year < 2013 && animationInProgress; ++year) {
            slider.setValue(year, true);
            await sleep(1);
        }
    }

}

function refresh() {
    let country = $("#country").val() !== "" ? $("#country").val() : "WRD";
    location.href = "tendance.html?iso=" + country;
}
var slider = $("#ex2").slider()
    .on('slide', () => update())
    .data('slider');

var sliderMonth = $("#month").slider()
    .on('slide', () => update())
    .data('slider');

generateFilterNav($('#filters'), () => update(true));

init();