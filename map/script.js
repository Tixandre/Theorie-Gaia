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
            .attr("fill", d => color(data.get(d.properties.name)))
            .attr("d", path)
            .append("title")
            .text(d => `${d.properties.name}
      ${data.has(d.properties.name) && data.get(d.properties.name) != "-" ? data.get(d.properties.name) : "N/A"}`);

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

        return svg.node();
    }
}

async function fetchFiles() {
    world = await ((await fetch('countries-50m.json')).json());
    dataFromFile = await ((await fetch('hale.json')).json());
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

        // Array to rename from old to new name
        // New name => name from country-50m.json
        rename = new Map([
            ["Antigua and Barbuda", "Antigua and Barb."],
            ["Bolivia (Plurinational State of)", "Bolivia"],
            ["Bosnia and Herzegovina", "Bosnia and Herz."],
            ["Brunei Darussalam", "Brunei"],
            ["Central African Republic", "Central African Rep."],
            ["Cook Islands", "Cook Is."],
            ["Democratic People's Republic of Korea", "North Korea"],
            ["Democratic Republic of the Congo", "Dem. Rep. Congo"],
            ["Dominican Republic", "Dominican Rep."],
            ["Equatorial Guinea", "Eq. Guinea"],
            ["Iran (Islamic Republic of)", "Iran"],
            ["Lao People's Democratic Republic", "Laos"],
            ["Marshall Islands", "Marshall Is."],
            ["Micronesia (Federated States of)", "Micronesia"],
            ["Republic of Korea", "South Korea"],
            ["Republic of Moldova", "Moldova"],
            ["Russian Federation", "Russia"],
            ["Saint Kitts and Nevis", "St. Kitts and Nevis"],
            ["Saint Vincent and the Grenadines", "St. Vin. and Gren."],
            ["Sao Tome and Principe", "São Tomé and Principe"],
            ["Solomon Islands", "Solomon Is."],
            ["South Sudan", "S. Sudan"],
            ["Swaziland", "eSwatini"],
            ["Syrian Arab Republic", "Syria"],
            ["The former Yugoslav Republic of Macedonia", "Macedonia"],
            // ["Tuvalu", ?],
            ["United Republic of Tanzania", "Tanzania"],
            ["Venezuela (Bolivarian Republic of)", "Venezuela"],
            ["Viet Nam", "Vietnam"]
        ])

        // Data to show => transform json object to map with new names
        data = Object.assign(new Map(Object.entries(dataFromFile).map(([k, v]) => [rename.get(k) || k, v])), {
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