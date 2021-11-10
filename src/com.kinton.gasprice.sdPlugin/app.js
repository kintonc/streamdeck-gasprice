const UUID = "com.kinton.ethgasprice"
const toGwei = x => Math.round(x / 10)

$SD.on("connected", _ => {
    const getGasPrices = async (context, apiKey, silent = false) => {
        if (!silent) $SD.api.setTitle(context, "Fetching\nGas Prices")
        const res = await fetch(`https://ethgasstation.info/api/ethgasAPI.json?api-key=${apiKey}`)
        if (!res.ok) return $SD.api.setTitle(context, "Invalid\nAPI Key")
        const { safeLow, average, fast, fastest } = await res.json()
        $SD.api.setTitle(context, [
            `ETH Gas`,
            `${toGwei(average)}`,
        ].join("\n"))
    }
    let intervalHandle
    const handleUpdate = ({ context, payload: { settings: { apiKey, updateInterval = 300 } } }) => {
        clearInterval(intervalHandle)
        if (!apiKey) return $SD.api.setTitle(context, "No API Key")
        getGasPrices(context, apiKey)
        intervalHandle = setInterval(() => getGasPrices(context, apiKey, true), updateInterval * 1000)
    }
    $SD.on(`${UUID}.willAppear`, handleUpdate)
    $SD.on(`${UUID}.keyUp`, handleUpdate)
    $SD.on(`${UUID}.didReceiveSettings`, handleUpdate)
})
