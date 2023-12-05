import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { ethers } from 'ethers';
import config from '../config.json';

// Define the ERC20 contract interface
const erc20Abi = [
    "function balanceOf(address owner) view returns (uint256)"
];

const PortfolioValueChart = ({ walletAddress }) => {
    const [portfolioData, setPortfolioData] = useState([]);

    const fetchPortfolioData = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const wallet = provider.getSigner();
    
        // Fetch token balances from the wallet
        const balances = await Promise.all(config.tokens.map(async (tokenAddress) => {
            const tokenContract = new ethers.Contract(tokenAddress, erc20Abi, wallet);
            const balance = await tokenContract.balanceOf(walletAddress);
            return balance;
        }));
    
        // Fetch historical prices for each token
        const prices = await Promise.all(config.tokens.map(async (tokenAddress) => {
            const response = await fetch(`https://api.coingecko.com/api/v3/coins/${tokenAddress}/market_chart?vs_currency=usd&days=30`);
            const data = await response.json();
            return data.prices;
        }));
    
        // Calculate portfolio value for each time frame
        const portfolioData = [];
        for (let i = 0; i < prices[0].length; i++) {
            let value = 0;
            for (let j = 0; j < config.tokens.length; j++) {
                value += ethers.utils.formatEther(balances[j]) * prices[j][i][1];
            }
            portfolioData.push({
                time: prices[0][i][0],
                value: value
            });
        }
    
        // Set the portfolioData state with the calculated values
        setPortfolioData(portfolioData);
    };

    useEffect(() => {
        if (walletAddress) {
            fetchPortfolioData();
        }
    }, [walletAddress]);

    const data = portfolioData.map(data => ({
        time: new Date(data.time).toLocaleDateString(),
        value: data.value
    }));

    const options = {
        scales: {
            xAxes: [{
                type: 'time',
                time: {
                    unit: 'day'
                }
            }],
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        },
    };

    return (
        <LineChart
            width={500}
            height={300}
            data={data}
            margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
            }}
        >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
    );
};

export default PortfolioValueChart;


