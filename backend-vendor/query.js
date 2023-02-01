'use strict';

const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');

let ccp;
let wallet;

async function initialize() {
    try {
        // load the network configuration
        const ccpPath = path.resolve(__dirname, '..', '..', 'fabric-samples', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
        ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get('vendor');
        if (!identity) {
            console.log('An identity for the user "vendor" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }
    } catch (error) {
        console.error(`Failed to initialize: ${error}`);
        process.exit(1);
    }
}

async function viewUnsold() {
    try {
        // create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'vendor', discovery: { enabled: true, asLocalhost: true } });

        // get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // get the contract from the network.
        const contract = network.getContract('estore');

        // evaluate the specified transaction.
        //const result = await contract.submitTransaction('releaseProduct', 'tplink', 'router', '100', 'tplink', false);
        const result = await contract.evaluateTransaction('viewUnsoldProducts');
        //const result = await contract.evaluateTransaction('viewProduct', 'tplink', 'router');
        console.log(`Transaction has been evaluated. Result is: ${result.toString()}`);

        await gateway.disconnect();

        return result;
    } catch (error) {
        console.error(`viewUnsold: Failed to evaluate transaction: ${error}`);
        return error;
    }
}

async function viewProduct(vendor, name) {
    try {
        // create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'vendor', discovery: { enabled: true, asLocalhost: true } });

        // get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // get the contract from the network.
        const contract = network.getContract('estore');

        // evaluate the specified transaction.
        const result = await contract.evaluateTransaction('viewProduct', vendor, name);
        console.log(`Transaction has been evaluated. Result is: ${result.toString()}`);

        await gateway.disconnect();

        return result;
    } catch (error) {
        console.error(`viewProduct: Failed to evaluate transaction: ${error}`);
        return error
    }
}

async function releaseProduct(vendor, name, price) {
    try {
        // create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'vendor', discovery: { enabled: true, asLocalhost: true } });

        // get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // get the contract from the network.
        const contract = network.getContract('estore');

        // evaluate the specified transaction.
        const result = await contract.submitTransaction('releaseProduct', vendor, name, price, vendor, false);
        console.log(`Transaction has been evaluated. Result is: ${result.toString()}`);

        await gateway.disconnect();

        return result;
    } catch (error) {
        console.error(`releaseProduct: Failed to evaluate transaction: ${error}`);
        return error;
    }
}

exports.initialize = initialize;
exports.viewUnsold = viewUnsold;
exports.viewProduct = viewProduct;
exports.releaseProduct = releaseProduct;
