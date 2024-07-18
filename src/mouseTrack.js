
setTimeout(async () => {
    await savingData();
}, 300000);

let date = new Date();
date = date.toLocaleString("en-CA", {
    timeZone: "America/Vancouver",
    timeZoneName: "long",
});
const eventList = [{"appName": "Calendar", "date": date}];


window.addEventListener("click", (event) => {
    pushToEventList(event)
});

window.addEventListener("dblclick", (event) => {
    pushToEventList(event)
});

window.addEventListener('contextmenu', (event) => {
    pushToEventList(event)
});

window.addEventListener("mousedown", (event) => {
    pushToEventList(event)
});

window.addEventListener("mouseup", (event) => {
    pushToEventList(event)
});


window.addEventListener("mouseenter", (event) => {
    pushToEventList(event)
});

window.addEventListener("mouseleave", (event) => {
    pushToEventList(event)
});

window.addEventListener("keydown", (event) => {
    pushToEventList(event)
});

window.addEventListener("keyup", (event) => {
    pushToEventList(event)
});

let MouseMoveData;

window.addEventListener("mousemove", (event) => {
    getMouseMoveData(event)
});

setInterval(pushMouseMoveData, 1000);

function pushToEventList(event){
    let x = event.pageX;  // Horizontal
    let y = event.pageY;  // Vertical
    let time = event.timeStamp
    eventList.push({"type": event.type, "PageX": x, "PageY": y, "timeStamp": time,
        "Id": event.target.id,
        "class": event.target.className,
        "tagName": event.target.tagName,
        "BoundingX": event.target.getBoundingClientRect().x,
        "BoundingY": event.target.getBoundingClientRect().y,
        "clientX": event.clientX,
        "clientY": event.clientY,
        "clientLeft": event.target.clientLeft,
        "clientTop": event.target.clientTop,
        "clientWidth": event.target.clientWidth,
        "clientHeight": event.target.clientHeight,
        "EleScrollHeight": event.target.scrollHeight,
        "EleScrollWidth": event.target.scrollWidth,
        "EleScrollTop": event.target.scrollTop,
        "EleScrollLeft": event.target.scrollLeft,
        "QueryStr": generateQueryStr(event.target),
        "XPath": getElementXPath(event.target),
        "XPath2": getXPath(event.target),
        "classPath": getElementTreeClassPath(event.target),
        "button": event.button,
        "ctrlKey": event.ctrlKey,
        "shiftKey": event.shiftKey,
        "altKey": event.altKey,
        "metaKey": event.metaKey,
        "key": event.key? event.key: null,
        "code": event.code? event.code: null,})
    console.log(x,y, time);
    console.log(event.target);
    console.log(eventList);
}

function getMouseMoveData(event){
    let x = event.pageX;  // Horizontal
    let y = event.pageY;  // Vertical
    let time = event.timeStamp
    MouseMoveData = {"type": event.type, "PageX": x, "PageY": y, "timeStamp": time,
        "Id": event.target.id,
        "class": event.target.className,
        "tagName": event.target.tagName,
        "BoundingX": event.target.getBoundingClientRect().x,
        "BoundingY": event.target.getBoundingClientRect().y,
        "clientX": event.clientX,
        "clientY": event.clientY,
        "clientLeft": event.target.clientLeft,
        "clientTop": event.target.clientTop,
        "clientWidth": event.target.clientWidth,
        "clientHeight": event.target.clientHeight,
        "EleScrollHeight": event.target.scrollHeight,
        "EleScrollWidth": event.target.scrollWidth,
        "EleScrollTop": event.target.scrollTop,
        "EleScrollLeft": event.target.scrollLeft,
        "QueryStr": generateQueryStr(event.target),
        "XPath": getElementXPath(event.target),
        "XPath2": getXPath(event.target),
        "classPath": getElementTreeClassPath(event.target),
        "button": event.button,
        "ctrlKey": event.ctrlKey,
        "shiftKey": event.shiftKey,
        "altKey": event.altKey,
        "metaKey": event.metaKey,
        "key": event.key? event.key: null,
        "code": event.code? event.code: null,}
}

function pushMouseMoveData(){
    eventList.push(MouseMoveData);
    console.log(eventList);
}

async function uploadToS3(){

    const url = process.env.MY_CONSTANT
    const response = await fetch(url)
    const resp =  await response.json()

    try {
        const result = await fetch(resp.message, {
            method: "put",
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify(eventList)
        })
        return result
    } catch (error) {
        throw new Error(`Upload failed: ${error.message}`);
    }

}

async function savingData() {
    document.getElementById('loadingOverlay').style.display = 'flex';

    try {
        const uploadResult = await uploadToS3();
        alert('Upload successful!');
    } catch (error) {
        console.error('Error uploading data:', error);
        alert('Failed to upload data.');
    } finally {
        document.getElementById('loadingOverlay').style.display = 'none';
        document.getElementById('nextOverlay').style.display = 'flex';
        localStorage.clear();
    }

}

document.getElementById('save-data').addEventListener('click', async ()=>{
    await savingData();
})

document.addEventListener("visibilitychange", async ()=>{
    if (document.hidden) {
        localStorage.clear();
    }
});

function getXPath(node){
    if(node.hasAttribute("id")){
        return '//' + node.tagName + '[@id="' + node.id + '"]';
    }

    if(node.hasAttribute("class")){
        return '//' + node.tagName + '[@class="' + node.getAttribute("class") + '"]';
    }

    var old = '/' + node.tagName;
    var new_path = this.xpath(node.parentNode) + old;

    return new_path;
}

// This code is inspired from https://codepen.io/jraoult/pen/nRexpM?editors=1111
function getElementXPath(element)
{
    if (element && element.id)
        return '//*[@id="' + element.id + '"]';
    else
        return getElementTreeXPath(element);
};

function getElementTreeXPath(element)
{
    var paths = [];

    // Use nodeName (instead of localName) so namespace prefix is included (if any).
    for (; element && element.nodeType == 1; element = element.parentNode)
    {
        var index = 0;
        for (var sibling = element.previousSibling; sibling; sibling = sibling.previousSibling)
        {
            // Ignore document type declaration.
            if (sibling.nodeType == Node.DOCUMENT_TYPE_NODE)
                continue;

            if (sibling.nodeName == element.nodeName)
                ++index;
        }

        var tagName = element.nodeName.toLowerCase();
        var pathIndex = (index ? "[" + (index+1) + "]" : "");
        paths.splice(0, 0, tagName + pathIndex);
    }

    return paths.length ? "/" + paths.join("/") : null;
}

function getElementTreeClassPath(element)
{
    var paths = [];

    // Use nodeName (instead of localName) so namespace prefix is included (if any).
    for (; element && element.nodeType == 1; element = element.parentNode)
    {
        var index = 0;
        for (var sibling = element.previousSibling; sibling; sibling = sibling.previousSibling)
        {
            // Ignore document type declaration.
            if (sibling.nodeType == Node.DOCUMENT_TYPE_NODE)
                continue;

            if (sibling.className == element.className)
                ++index;
        }

        var tagName = element.className;
        var pathIndex = (index ? "[" + (index+1) + "]" : "");
        paths.splice(0, 0, tagName + pathIndex);
    }

    return paths.length ? "/" + paths.join("/") : null;
}

// This code is inspired from https://github.com/muitanprasert/HelpCall-extension

const includedAttr = ['role', 'aria-label', 'name', 'type']
const interactive_nodes = {
    'a':{ name:'', attr:'href'}, // could be button or link, too confusing
    'audio':{ name:'audio player', attr:'controls'},
    'video':{ name:'video player', attr:'controls'},
    'button':{ name:'button' },
    'details':{ name:'' },
    'embed':{ name:'embedded content' },
    'iframe':{ name:'embedded content' },
    'img':{ name:'image', attr: 'usemap'},
    'input':{ name:'$[type] field' }, // type != hidden
    'select':{ name: 'drop-down list'},
    'textarea':{ name: 'textbox' }
}
function generateQueryStr(node){
    let parent = findInteractiveRole(node).elm;
    if(parent && parent.tagName != "BODY")
        node = parent;
    let queryStr = " || ";
    let attrs = includedAttr;

    // start with textContent if the node has it
    if(node.textContent != '' && node.textContent.length < 50){
        queryStr = " || " + node.textContent;
    }

    // exception cases
    else if(window.location.href.includes("whenisgood") && node.tagName=='IMG' && node.hasAttribute('onclick')){
        if(node.getAttribute("onclick").includes("startDate"))
            queryStr = " || " + "$DATE:startDate";
        else if(node.getAttribute("onclick").includes("endDate"))
            queryStr = " || " + "$DATE:endDate";
    }
    else if(window.location.href.includes("mail.google"))

        if(window.location.href.includes("expedia")){
            attrs.pop("aria-label");
            attrs.push("data-stid");
        }
        else if(window.location.href.includes("whenisgood")){
            attrs.push("class");
        }

    // append the selector
    while(node.parentElement != null){
        let tempStr = node.nodeName.toLowerCase();
        attrs.forEach(attr =>{
            if(node.hasAttribute(attr) && typeof node.getAttribute(attr) == "string")
                tempStr += '['+attr+'="'+node.getAttribute(attr)+'"]';
        });

        queryStr = tempStr + ' ' + queryStr;
        node = node.parentElement;
    }
    //console.log(queryStr);
    return queryStr;
}

function findInteractiveRole(el, initEl){
    if(el == null || el.parentNode == null) // stop before document
        return { elm: document.body, role:''};  // return body to just use the click's location directly

    // check by role (explicit)
    includedAttr.forEach(attr => {
        if(el.hasAttribute(attr)){
            return { elm: el, role: el.getAttribute(attr) };
        }
    })

    // check by nodeName (implicit)
    nodeName = el.nodeName.toLowerCase();
    if(nodeName in interactive_nodes){
        if ('attr' in interactive_nodes[nodeName]){
            if(!el.hasAttribute(interactive_nodes[nodeName]['attr']))
                return { elm: initEl, role:''};
        }
        if(nodeName == 'input'){
            if(!el.hasAttribute('type') || el['type']=="text")
                return { elm: el, role:'textbox'};
            if(el['type'] == 'hidden')
                return { elm: initEl, role:''};
            return { elm: el, role: el['type'] + ' input field' };
        }
        return { elm: el, role: interactive_nodes[nodeName]['name'] };
    }

    // check parent recursively
    return findInteractiveRole(el.parentNode, initEl);
}
