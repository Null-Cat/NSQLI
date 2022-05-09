const sleep = (milliseconds) => { //Sleep Boilerplate
    return new Promise(resolve => setTimeout(resolve, milliseconds))
***REMOVED***

async function reload() {
    await sleep(10000)
    location.reload()
***REMOVED***

reload()