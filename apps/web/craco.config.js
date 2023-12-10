const path = require('path')
const fs = require('fs')
const cracoBabelLoader = require('craco-babel-loader')

// manage relative paths to packages
const appDirectory = fs.realpathSync(process.cwd()+'/../..')
console.log("AAAA", appDirectory)
const resolvePackage = relativePath => path.resolve(appDirectory, relativePath)

module.exports = {
    plugins: [
        {
            plugin: cracoBabelLoader,
            options: {
                includes: [
                    resolvePackage('packages/user'),
                ],
            },
        },
    ],
}
