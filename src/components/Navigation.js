import React, { useState } from 'react';
import { ethers } from 'ethers';

const Navigation = () => {
    const [walletAddress, setWalletAddress] = useState('');
    const [currentChain, setCurrentChain] = useState('');

    const chains = {
        'Ethereum': '0x1', // Ethereum Mainnet
        'Polygon': '0x89', // Polygon Mainnet
        'zkSync': '0xa' // zkSync chain ID (example, may change)
    };

    const connectWallet = async (chainId) => {
        if (!window.ethereum) {
            alert('Please install MetaMask!');
            return;
        }

        try {
            // Request wallet connection
            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts',
            });

            // Request to switch or add the network
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId }],
            });

            setWalletAddress(accounts[0]);
            setCurrentChain(chainId);
        } catch (error) {
            console.error('Error connecting to wallet:', error);
        }
    };

    return (
        <nav>
            <h1>My Crypto Portfolio</h1>
            <div>
                {Object.entries(chains).map(([name, chainId]) => (
                    <button key={chainId} onClick={() => connectWallet(chainId)}>
                        Connect to {name}
                    </button>
                ))}
            </div>
            {walletAddress && (
                <div>
                    <p>Connected Wallet: {walletAddress}</p>
                    <p>Current Chain: {currentChain}</p>
                </div>
            )}
        </nav>
    );
};

export default Navigation;
