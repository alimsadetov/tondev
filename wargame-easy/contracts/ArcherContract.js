const ArcherContract = {
    abi: {
        "ABI version": 2,
        "version": "2.1",
        "header": [
            "time",
            "expire"
        ],
        "functions": [
            {
                "name": "getAttackPower",
                "inputs": [
                    {
                        "name": "val",
                        "type": "uint256"
                    }
                ],
                "outputs": []
            },
            {
                "name": "getProtectionPower",
                "inputs": [
                    {
                        "name": "val",
                        "type": "uint256"
                    }
                ],
                "outputs": []
            },
            {
                "name": "attack",
                "inputs": [
                    {
                        "name": "gameobj",
                        "type": "address"
                    }
                ],
                "outputs": []
            },
            {
                "name": "takeAttack",
                "inputs": [
                    {
                        "name": "attackerPower",
                        "type": "uint256"
                    },
                    {
                        "name": "attacker",
                        "type": "address"
                    }
                ],
                "outputs": []
            },
            {
                "name": "death",
                "inputs": [
                    {
                        "name": "attacker",
                        "type": "address"
                    }
                ],
                "outputs": []
            },
            {
                "name": "constructor",
                "inputs": [],
                "outputs": []
            },
            {
                "name": "hp",
                "inputs": [],
                "outputs": [
                    {
                        "name": "hp",
                        "type": "int256"
                    }
                ]
            },
            {
                "name": "attackPower",
                "inputs": [],
                "outputs": [
                    {
                        "name": "attackPower",
                        "type": "uint256"
                    }
                ]
            },
            {
                "name": "protectionPower",
                "inputs": [],
                "outputs": [
                    {
                        "name": "protectionPower",
                        "type": "uint256"
                    }
                ]
            }
        ],
        "data": [],
        "events": [],
        "fields": [
            {
                "name": "_pubkey",
                "type": "uint256"
            },
            {
                "name": "_timestamp",
                "type": "uint64"
            },
            {
                "name": "_constructorFlag",
                "type": "bool"
            },
            {
                "name": "hp",
                "type": "int256"
            },
            {
                "name": "attackPower",
                "type": "uint256"
            },
            {
                "name": "protectionPower",
                "type": "uint256"
            }
        ]
    },
    tvc: "te6ccgECIAEAA7gAAgE0AwEBAcACAEPQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgBCSK7VMg4wMgwP/jAiDA/uMC8gsdBQQfApTtRNDXScMB+GYh2zzTAAGfgQIA1xgg+QFY+EL5EPKo3tM/AfhDIbnytCD4I4ED6KiCCBt3QKC58rT4Y9MfAfgjvPK50x8B2zzyPAgGA0rtRNDXScMB+GYi0NcLA6k4ANwhxwDjAiHXDR/yvCHjAwHbPPI8HBwGAzwgghA/s5Pyu+MCIIIQYH1lHLvjAiCCEGi1Xz+64wIQCQcCIjD4Qm7jAPhG8nPR+ADbPPIACBYBYu1E0NdJwgGKjiZw7UTQ9AVw+Gpw+Gtw+GyAQPQO8r3XC//4YnD4Y3r4anD4a3D4bOIbBFAgghBDXmU6uuMCIIIQU6qwMLrjAiCCEF9/Ayy64wIgghBgfWUcuuMCDw0LCgFQMNHbPPhLIY4cjQRwAAAAAAAAAAAAAAAAOB9ZRyDIzsv/yXD7AN7yABsDKDD4RvLgTPhCbuMA0//R2zzbPPIAGwwWAAj4APhrAygw+Eby4Ez4Qm7jANP/0ds82zzyABsOFgAI+AD4bAFQMNHbPPhKIY4cjQRwAAAAAAAAAAAAAAAAMNeZTqDIzsr/yXD7AN7yABsEUCCCEApSGAO64wIgghAX3VcjuuMCIIIQNIWbDbrjAiCCED+zk/K64wIaFRMRAzYw+Eby4Ez4Qm7jAPpBldTR0PpA39HbPNs88gAbEhYARvgAyM+FiM6NBEw9CQAAAAAAAAAAAAAAAAAAQM8WyYEAoPsAAzYw+Eby4Ez4Qm7jAPpBldTR0PpA39HbPNs88gAbFBYAZPgA+Cj4S1jIz4WIzo0ETmJaAAAAAAAAAAAAAAAAAADAzxZZyM+QX3Vcjsv/zs3JcPsAAzow+Eby4Ez4Qm7jANP/+kGV1NHQ+kDf0ds82zzyABsXFgA6+Ez4S/hK+EP4QsjL/8s/z4PK/8v/AcjL/83J7VQBFPgAIfhMvI6A3lsYASj4SiK0//hMtP+htP+htP/4aiDbPBkAbPgA+ErBAY4sIPgoyM+FiM6NBE5iWgAAAAAAAAAAAAAAAAAAwM8WAcjPkP7OT8rOzclw+wDeMAFQMNHbPPhMIY4cjQRwAAAAAAAAAAAAAAAAIpSGAODIzsv/yXD7AN7yABsAPO1E0NP/0z/TADHS/9P/1NHQ0//R+Gz4a/hq+GP4YgAK+Eby4EwCCvSkIPShHx4AFHNvbCAwLjUwLjAAAA==",
    code: "te6ccgECHQEAA4sABCSK7VMg4wMgwP/jAiDA/uMC8gsaAgEcApTtRNDXScMB+GYh2zzTAAGfgQIA1xgg+QFY+EL5EPKo3tM/AfhDIbnytCD4I4ED6KiCCBt3QKC58rT4Y9MfAfgjvPK50x8B2zzyPAUDA0rtRNDXScMB+GYi0NcLA6k4ANwhxwDjAiHXDR/yvCHjAwHbPPI8GRkDAzwgghA/s5Pyu+MCIIIQYH1lHLvjAiCCEGi1Xz+64wINBgQCIjD4Qm7jAPhG8nPR+ADbPPIABRMBYu1E0NdJwgGKjiZw7UTQ9AVw+Gpw+Gtw+GyAQPQO8r3XC//4YnD4Y3r4anD4a3D4bOIYBFAgghBDXmU6uuMCIIIQU6qwMLrjAiCCEF9/Ayy64wIgghBgfWUcuuMCDAoIBwFQMNHbPPhLIY4cjQRwAAAAAAAAAAAAAAAAOB9ZRyDIzsv/yXD7AN7yABgDKDD4RvLgTPhCbuMA0//R2zzbPPIAGAkTAAj4APhrAygw+Eby4Ez4Qm7jANP/0ds82zzyABgLEwAI+AD4bAFQMNHbPPhKIY4cjQRwAAAAAAAAAAAAAAAAMNeZTqDIzsr/yXD7AN7yABgEUCCCEApSGAO64wIgghAX3VcjuuMCIIIQNIWbDbrjAiCCED+zk/K64wIXEhAOAzYw+Eby4Ez4Qm7jAPpBldTR0PpA39HbPNs88gAYDxMARvgAyM+FiM6NBEw9CQAAAAAAAAAAAAAAAAAAQM8WyYEAoPsAAzYw+Eby4Ez4Qm7jAPpBldTR0PpA39HbPNs88gAYERMAZPgA+Cj4S1jIz4WIzo0ETmJaAAAAAAAAAAAAAAAAAADAzxZZyM+QX3Vcjsv/zs3JcPsAAzow+Eby4Ez4Qm7jANP/+kGV1NHQ+kDf0ds82zzyABgUEwA6+Ez4S/hK+EP4QsjL/8s/z4PK/8v/AcjL/83J7VQBFPgAIfhMvI6A3lsVASj4SiK0//hMtP+htP+htP/4aiDbPBYAbPgA+ErBAY4sIPgoyM+FiM6NBE5iWgAAAAAAAAAAAAAAAAAAwM8WAcjPkP7OT8rOzclw+wDeMAFQMNHbPPhMIY4cjQRwAAAAAAAAAAAAAAAAIpSGAODIzsv/yXD7AN7yABgAPO1E0NP/0z/TADHS/9P/1NHQ0//R+Gz4a/hq+GP4YgAK+Eby4EwCCvSkIPShHBsAFHNvbCAwLjUwLjAAAA==",
    codeHash: "c218fa405e060fbad45838f017699c1908efe2775425a8bbdb4585c425d247e7",
};
module.exports = { ArcherContract };