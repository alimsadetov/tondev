const AuthDebotContract = {
    abi: {
        "ABI version": 2,
        "header": [
            "pubkey",
            "time",
            "expire"
        ],
        "functions": [
            {
                "name": "start",
                "inputs": [],
                "outputs": []
            },
            {
                "name": "getDebotInfo",
                "id": "0xDEB",
                "inputs": [],
                "outputs": [
                    {
                        "name": "name",
                        "type": "bytes"
                    },
                    {
                        "name": "version",
                        "type": "bytes"
                    },
                    {
                        "name": "publisher",
                        "type": "bytes"
                    },
                    {
                        "name": "key",
                        "type": "bytes"
                    },
                    {
                        "name": "author",
                        "type": "bytes"
                    },
                    {
                        "name": "support",
                        "type": "address"
                    },
                    {
                        "name": "hello",
                        "type": "bytes"
                    },
                    {
                        "name": "language",
                        "type": "bytes"
                    },
                    {
                        "name": "dabi",
                        "type": "bytes"
                    },
                    {
                        "name": "icon",
                        "type": "bytes"
                    }
                ]
            },
            {
                "name": "getRequiredInterfaces",
                "inputs": [],
                "outputs": [
                    {
                        "name": "interfaces",
                        "type": "uint256[]"
                    }
                ]
            },
            {
                "name": "auth",
                "inputs": [
                    {
                        "name": "id",
                        "type": "bytes"
                    },
                    {
                        "name": "otp",
                        "type": "bytes"
                    },
                    {
                        "name": "pinRequired",
                        "type": "bool"
                    },
                    {
                        "name": "callbackUrl",
                        "type": "bytes"
                    },
                    {
                        "name": "warningText",
                        "type": "bytes"
                    }
                ],
                "outputs": []
            },
            {
                "name": "setConfirm",
                "inputs": [
                    {
                        "name": "value",
                        "type": "bool"
                    }
                ],
                "outputs": []
            },
            {
                "name": "getPublicKey",
                "inputs": [
                    {
                        "name": "value",
                        "type": "bytes"
                    }
                ],
                "outputs": []
            },
            {
                "name": "setPk",
                "inputs": [
                    {
                        "name": "value",
                        "type": "uint256"
                    }
                ],
                "outputs": []
            },
            {
                "name": "setSigningBoxHandle",
                "inputs": [
                    {
                        "name": "handle",
                        "type": "uint32"
                    }
                ],
                "outputs": []
            },
            {
                "name": "setSignature",
                "inputs": [
                    {
                        "name": "signature",
                        "type": "bytes"
                    }
                ],
                "outputs": []
            },
            {
                "name": "setEncode",
                "inputs": [
                    {
                        "name": "base64",
                        "type": "bytes"
                    }
                ],
                "outputs": []
            },
            {
                "name": "setResponse",
                "inputs": [
                    {
                        "name": "statusCode",
                        "type": "int32"
                    },
                    {
                        "name": "retHeaders",
                        "type": "bytes[]"
                    },
                    {
                        "name": "content",
                        "type": "bytes"
                    }
                ],
                "outputs": []
            },
            {
                "name": "getInvokeMessage",
                "inputs": [
                    {
                        "name": "id",
                        "type": "bytes"
                    },
                    {
                        "name": "otp",
                        "type": "bytes"
                    },
                    {
                        "name": "pinRequired",
                        "type": "bool"
                    },
                    {
                        "name": "callbackUrl",
                        "type": "bytes"
                    },
                    {
                        "name": "warningText",
                        "type": "bytes"
                    }
                ],
                "outputs": [
                    {
                        "name": "message",
                        "type": "cell"
                    }
                ]
            },
            {
                "name": "noop",
                "inputs": [
                    {
                        "name": "value",
                        "type": "bytes"
                    }
                ],
                "outputs": []
            },
            {
                "name": "upgrade",
                "inputs": [
                    {
                        "name": "state",
                        "type": "cell"
                    }
                ],
                "outputs": []
            },
            {
                "name": "getDebotOptions",
                "inputs": [],
                "outputs": [
                    {
                        "name": "options",
                        "type": "uint8"
                    },
                    {
                        "name": "debotAbi",
                        "type": "bytes"
                    },
                    {
                        "name": "targetAbi",
                        "type": "bytes"
                    },
                    {
                        "name": "targetAddr",
                        "type": "address"
                    }
                ]
            },
            {
                "name": "setABI",
                "inputs": [
                    {
                        "name": "dabi",
                        "type": "bytes"
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
    tvc: "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",
    code: "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",
    codeHash: "efef3bd2e33fbbc52e634ecc16a81378fc4de313a200cad3c8ace115b0d819dd",
};
module.exports = { AuthDebotContract };