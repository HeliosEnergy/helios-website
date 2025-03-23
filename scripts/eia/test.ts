

const API_URL = "https://api.eia.gov/v2/electricity/operating-generator-capacity/data"
    + "?api_key=8EZBDmU1ZWDXD9aF3cVfT1zrn2YSx2A4xGmAw5aC"
    + "&offset=12501"
    + "&length=2500"
    + "&data[0]=county"
    + "&data[1]=latitude"
    + "&data[2]=longitude"
    + "&data[3]=nameplate-capacity-mw"
    + "&data[4]=net-summer-capacity-mw"
    + "&data[5]=net-winter-capacity-mw"
    + "&data[6]=operating-year-month"
    + "&frequency=monthly"
    + "&sort[0][column]=period"
    + "&sort[0][direction]=desc";

async function main() {
    const response = await fetch(API_URL);
    const data = await response.json();
    console.log(JSON.stringify(data, null, 4));
}

main();