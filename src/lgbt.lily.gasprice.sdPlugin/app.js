$SD.on("connected", _ => {
    const getGasPrices = async (context, apiKey, silent = false) => {
        console.log("Fetching gas prices")
        if (!silent) $SD.api.setTitle(context, "Fetching\nGas Prices")
        const res = await fetch(`https://data-api.defipulse.com/api/v1/egs/api/ethgasAPI.json?api-key=${apiKey}`)
        if (!res.ok) return $SD.api.setTitle(context, "Invalid\nAPI Key")
        const json = await res.json()
        console.log(json)
        $SD.api.setTitle(context, `Gas Prices\nSafe: ${json.safeLow}\nAverage: ${json.average}\nFast: ${json.fast}\nFastest: ${json.fastest}`)
    }
    let intervalHandle
    const handleUpdate = ({ context, payload: { settings: { apiKey, updateInterval = 300 } } }) => {
        console.log({ apiKey, updateInterval, intervalHandle })
        clearInterval(intervalHandle)
        if (!apiKey) return $SD.api.setTitle(context, "No API Key")
        getGasPrices(context, apiKey)
        intervalHandle = setInterval(() => getGasPrices(context, apiKey, true), updateInterval * 1000)
    }
    $SD.on("lgbt.lily.gasprice.action.willAppear", handleUpdate)
    $SD.on("lgbt.lily.gasprice.action.keyUp", handleUpdate)
    $SD.on("lgbt.lily.gasprice.action.didReceiveSettings", handleUpdate)
})
