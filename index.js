#!/usr/bin/env node

const crypt = require('crypto-js')
const readline = require('readline')
const fs = require('fs')
const path = require('path')

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

rl.question('Encrypt or Decrypt? (e/d) ', answer => {
    if (answer === 'e') {
        rl.question('Enter the path to .txt file: ', pathFile => {

            rl.question('Enter the password: ', password => {
                rl.question('Enter the password again: ', password2 => {
                    if (password !== password2) {
                        console.error(`[ERROR] Passwords don't match!`)
                        process.exit()
                        return
                    }
                    rl.close()
                    encryptFile(pathFile, password)
                })
            })
        })
    } else if (answer === 'd') {
        rl.question('Enter the path to .crypt file: ', pathFile => {
            rl.question('Enter the password: ', password => {
                rl.close()
                decryptFile(pathFile, password)
            })
        })
    } else {
        process.exit()
    }
})



function encryptFile(pathFile, password) {
    const nameFile = path.basename(pathFile).split('.')[0] + '.crypt'

    fs.access(nameFile, error => {
        if (!error) {
            console.error(`[ERROR] File ${nameFile} already exist!`)
            process.exit()
        } else {
            fs.readFile(pathFile, 'utf8', (error,data) => {
                if(error) throw error
                const encryptContent = crypt.AES.encrypt(data, password).toString()
                fs.writeFile(nameFile, encryptContent, error => {
                    if(error) throw error
                    console.info(`[INFO] The file was encrypted`)
                    process.exit()
                })
            })
        }
    })
}

function decryptFile(pathFile, password) {
    const nameFile = path.basename(pathFile).split('.crypt')[0] + '.txt'
    fs.access(nameFile, error => {
        if (!error) {
            console.error(`[ERROR] File ${nameFile} already exist!`)
            process.exit()
        } else {
            fs.readFile(pathFile, 'utf8', (error,data) => {
                if(error) throw error
                const bytes = crypt.AES.decrypt(data, password)
                const decryptContent = bytes.toString(crypt.enc.Utf8)
                fs.writeFile(nameFile, decryptContent, error => {
                    if(error) throw error
                    console.info(`[INFO] The file was decrypted`)
                    process.exit()
                })
            })
        }
    })
}
