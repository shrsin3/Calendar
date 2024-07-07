const eventList = [];

window.addEventListener("click", (event) => {
    let x = event.pageX;  // Horizontal
    let y = event.pageY;  // Vertical
    let time = event.timeStamp
    eventList.push({"x": x, "y": y, "timeStamp": time})
    console.log(x,y, time);
    console.log(event.target);
    console.log(eventList);
});