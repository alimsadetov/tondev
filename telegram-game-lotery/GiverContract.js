const GiverContract = {
    abi: {
        "ABI version": 2,
        "header": [
            "time",
            "expire"
        ],
        "functions": [
            {
                "name": "sendTransactionWithComission",
                "inputs": [
                    {
                        "name": "dest",
                        "type": "address"
                    },
                    {
                        "name": "value",
                        "type": "uint128"
                    }
                ],
                "outputs": []
            },
            {
                "name": "sendTransaction",
                "inputs": [
                    {
                        "name": "dest",
                        "type": "address"
                    },
                    {
                        "name": "value",
                        "type": "uint128"
                    }
                ],
                "outputs": []
            },
            {
                "name": "sendTransactionAndDeleteContract",
                "inputs": [
                    {
                        "name": "dest",
                        "type": "address"
                    }
                ],
                "outputs": []
            },
            {
                "name": "sendValue",
                "inputs": [
                    {
                        "name": "dest",
                        "type": "address"
                    },
                    {
                        "name": "value",
                        "type": "uint128"
                    }
                ],
                "outputs": []
            },
            {
                "name": "constructor",
                "inputs": [],
                "outputs": []
            }
        ],
        "data": [],
        "events": []
    },
    tvc: "te6ccgECFwEAAk4AAgE0AwEBAcACAEPQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgBCSK7VMg4wMgwP/jAiDA/uMC8gsUBQQWAogh2zzTAAGfgQIA1xgg+QFY+EL5EPKo3tM/AfhDIbnytCD4I4ED6KiCCBt3QKC58rT4Y9MfAfgjvPK50x8B2zz4R27yfAgGAToi0NcLA6k4ANwhxwDcIdcNH/K8Id0B2zz4R27yfAYCKCCCEFP0gOC74wIgghBotV8/uuMCCgcCKjD4Qm7jAPhG8nN/+GbR+ADbPH/4ZwgSAUTtRNDXScIBio4XcO1E0PQFgED0DvK91wv/+GJw+GNw+GbiCQAg7UTQ0//TP9IA0fhm+GP4YgRQIIIQLfhgRrrjAiCCEC5XcIS64wIgghBOxNxMuuMCIIIQU/SA4LrjAhEPDQsCODD6QZXU0dD6QN/XDX+V1NHQ03/f0ds84wB/+GcMEgAq+ABTAcjPhYjOAfoCgGvPQMlw+wBbAjgw+kGV1NHQ+kDf1w1/ldTR0NN/39HbPOMAf/hnDhIAKvgAUwHIz4WIzgH6AoBrz0DJcfsAWwI4MPpBldTR0PpA39cNf5XU0dDTf9/R2zzjAH/4ZxASACr4AFMByM+FCM4B+gKAa89AyXH7AFsCJDD6QZXU0dD6QN/R2zzjAH/4ZxMSACD4RvhD+ELIy//LP8oAye1UAEr4ACDIz4WIzo0ETD0JAAAAAAAAAAAAAAAAAABAzxbJgQCg+wAwAgr0pCD0oRYVABRzb2wgMC40Ny4wAAA=",
    code: "te6ccgECFAEAAiEABCSK7VMg4wMgwP/jAiDA/uMC8gsRAgETAogh2zzTAAGfgQIA1xgg+QFY+EL5EPKo3tM/AfhDIbnytCD4I4ED6KiCCBt3QKC58rT4Y9MfAfgjvPK50x8B2zz4R27yfAUDAToi0NcLA6k4ANwhxwDcIdcNH/K8Id0B2zz4R27yfAMCKCCCEFP0gOC74wIgghBotV8/uuMCBwQCKjD4Qm7jAPhG8nN/+GbR+ADbPH/4ZwUPAUTtRNDXScIBio4XcO1E0PQFgED0DvK91wv/+GJw+GNw+GbiBgAg7UTQ0//TP9IA0fhm+GP4YgRQIIIQLfhgRrrjAiCCEC5XcIS64wIgghBOxNxMuuMCIIIQU/SA4LrjAg4MCggCODD6QZXU0dD6QN/XDX+V1NHQ03/f0ds84wB/+GcJDwAq+ABTAcjPhYjOAfoCgGvPQMlw+wBbAjgw+kGV1NHQ+kDf1w1/ldTR0NN/39HbPOMAf/hnCw8AKvgAUwHIz4WIzgH6AoBrz0DJcfsAWwI4MPpBldTR0PpA39cNf5XU0dDTf9/R2zzjAH/4Zw0PACr4AFMByM+FCM4B+gKAa89AyXH7AFsCJDD6QZXU0dD6QN/R2zzjAH/4ZxAPACD4RvhD+ELIy//LP8oAye1UAEr4ACDIz4WIzo0ETD0JAAAAAAAAAAAAAAAAAABAzxbJgQCg+wAwAgr0pCD0oRMSABRzb2wgMC40Ny4wAAA=",
    codeHash: "50702290d655b1ccc8574be3baaad4d8dc082b9af2815a434ad5d53c2289cd39",
};
module.exports = { GiverContract };