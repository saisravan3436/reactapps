import React from "react";
import "./App.css";
import { transactions } from "./dao";

const App = () => {

  const [state, setState] = React.useState(false)

  const calculateRewards = (user) => {
    let totalPoints = 0;
    transactions.map((transaction) => {
      if(transaction.userId==user.userId){
      totalPoints =
        totalPoints + calculateRewardForTransaction(transaction.amount);
    }
  })
    return totalPoints;
  };

  const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const handleState = () => {
   setState(!state);
}

  const calculateRewardForTransaction = (value) => {
    let totalPoints = 0;
    if (value <= 50) {
      totalPoints = 0;
    } else if (value > 50 && value <= 100) {
      totalPoints = (value - 50) * 1;
    } else if (value > 100) {
      totalPoints = (value - 100) * 2 + 50;
    }
    return totalPoints;
  };

  const getMonthlyDataOfUser = (user) => {
    let monthlyData = [];
      transactions.map((transaction) => {
      if (transaction.userId === user.userId) {
        let result = monthlyData.findIndex(
          ({ month }) => month === new Date(transaction.date).getMonth()
        );
        if (result===-1) {
          let monthObj = {};
          monthObj.month = new Date(transaction.date).getMonth();
          monthObj.amount = transaction.amount;
          monthlyData.push(monthObj);
        } else {
          monthlyData[result].amount =
          monthlyData[result].amount + transaction.amount;
        }
      }
    });
    return monthlyData;
  };

  const displayTransactions = (user) => {
    let res = getMonthlyDataOfUser(user);
    return getMonthlyDataOfUser(user).map((monthData) => {
      return (
        <tr key={user.userId+monthData.month} className="transactioncontent">
          <td>{monthNames[monthData.month]}</td>
          <td>{monthData.amount}</td>
          <td>{calculateRewardForTransaction(monthData.amount)}</td>
        </tr>
      );
    });
  };

  const getUserData = () => {
    let userData = [];
    transactions.map((transaction) => {
      let result = userData.find(({ userId }) => userId === transaction.userId);
      if (!result) {
        let userObj = {};
        userObj.userId = transaction.userId;
        userObj.name = transaction.name;
        userData.push(userObj);
      }
    });
    return userData;
  };

  const displayUserInfo = () => {
    return getUserData().map((user) => {
      return (
        <div class="userCard">
          <div>
            <h2>UserName: {user.name}</h2>
            <h4>TransactionDetails:</h4>
          </div>
          <div key={user.userId}>
            <table>
              <tr className="transactionheader">
                <td>Month</td>
                <td>Transaction Amt in Dollars in the month</td>
                <td>Reward Points Earned in the month</td>
              </tr>
              {displayTransactions(user)}
            </table>
            <div className="totalRewards">
              Total Rewards - <span>{calculateRewards(user)}</span>
            </div>
          </div>
        </div>
      );
    });
  };

  return <div>
    <h1>User Rewards</h1>
    {state ? <div className="rewardsMainContent">{displayUserInfo()}</div> :
    <button className= 'button'onClick={handleState}>calculate rewards of users</button>}
    </div>
};
export default App;
