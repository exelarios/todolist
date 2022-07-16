import { useState, useEffect, useCallback, useMemo } from "react";
import { ethers } from "ethers";

import abi from "./artifacts/abi.json";

function Task(props) {
  const { content, done } = props;

  const styles = {
    display: "flex"
  }

  return (
    <div style={styles}>
      <input type="checkbox" checked={done}/>
      <p>{content}</p>
    </div>
  );
}

function App() {
  const [hasWallet, setHasWallet] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [tasks, setTasks] = useState([]);

  const fetchContract = async () => {
    if (!window.ethereum) return;

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contractAddress = "0x352D8a9ca6e4bfc1BfEDF3304dfbc3DC3e3253Ed";

    console.log(abi);

    const contract = new ethers.Contract(contractAddress, abi, provider);

    setProvider(provider);
    setContract(contract);
  }

  useEffect(() => {
    fetchContract();
  }, []);

  const getTaskFromContract = async () => {
    // console.log(await contract.taskCount());
    const amountOfTasks = await contract.taskCount();
    const output = [];
    for (let i = 1; i <= amountOfTasks.toNumber(); i++) {
      output.push(contract.tasks(i));
    }
    setTasks(await Promise.all(output));
  }

  useEffect(() => {
    if (!contract) return;
    getTaskFromContract();

    contract.on("TaskCreated", (id, content, done) => {
      setTasks([...tasks, {
        id,
        content,
        done
      }])
    });
  }, []);

  const handleConnectWallet = useCallback(async () => {
    try {
      const ethereum = window.ethereum;
      if (!ethereum) {
        alert("Please install MetaMask extension via your browser.");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts"
      });

      const balance = await provider.getBalance(accounts[0]);
      const formattedBalance = ethers.utils.formatEther(balance);
      console.log(formattedBalance);

      setWalletAddress(accounts[0]);
      setHasWallet(true);

    } catch(error) {
      setHasWallet(false);
    }
  }, [provider]);

  const authFlow = useMemo(() => {
    if (hasWallet) {
      return (
        <div>
          user: {walletAddress}
          {tasks?.map(data => {
            return (
              <Task key={data.id} {...data}/>
            )
          })}
        </div>
      );
    } else {
      return (
        <button onClick={handleConnectWallet}>Connect Wallet</button>
      );
    }
  }, [
    tasks,
    hasWallet, 
    walletAddress, 
    handleConnectWallet
  ]);

  return (
    <div className="App">
      <h1>Todo List</h1>
      <p>What's better than saving your shit in the block?</p>
      {authFlow}
    </div>
  );
}

export default App;
