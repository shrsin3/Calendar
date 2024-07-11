// require("dotenv").config()

let date = new Date();
date = date.toLocaleString("en-CA", {
    timeZone: "America/Vancouver",
    timeZoneName: "long",
});
const eventList = [{"appName": "Calendar", "date": date}];


window.addEventListener("click", (event) => {
    let x = event.pageX;  // Horizontal
    let y = event.pageY;  // Vertical
    let time = event.timeStamp
    eventList.push({"x": x, "y": y, "timeStamp": time})
    console.log(x,y, time);
    console.log(event.target);
    console.log(eventList);
    const myValue = process.env.MY_VALUE
    console.log(myValue)
});

document.addEventListener("visibilitychange", ()=>{
    if (document.hidden) {
        const myValue = process.env.MY_VALUE
        fetch(myValue,{
            method: "post",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({ eventList }),
            keepalive: true
        })

        localStorage.clear();

    }
})