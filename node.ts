
//----const output = [900, 295];
// const balances = [1000, 1500];

// const requests = [   "withdraw 1613327630 2 480",    // w=> 1020  9 ---- cb=> 1029                   // 86400 (24h in seconds)
//                      "withdraw 1613327644 2 800",   // w=>  229   16 -----cb=> 242
//                      "withdraw 1614105244 1 100", 
//                      "deposit  1614108844 2 200", 
//                      "withdraw 1614108845 2 150" 
//                  ]
//--------------------------------------------------
//const output = [0, 1000, 900, 40, 90] [-userid]
const balances =[20, 1000, 500, 40, 90]
const requests = [
                     "deposit  1613327630 3 400",
                     "withdraw 1613327635 1 20",
                     "withdraw 1613327651 1 50",
                 ]
//-------------------------------------------------

let bad_request:number= 0;
let request_id_Counter=0;
function bank_Requests_Daily_Cashback(balances:number[], requests:any[])
{
  
      const requests_object = fomat_requests(requests);
      
      // if withdraw true .. call cashback
      // withra > balance rfuse request
      // of request is invaled return [- holder_id]
      // if withrwas then cashback -calculate cahsbak timestamp (withd-request-timestamp+86400)< last-req-timestamp then update balance 
      // else cahsbak timestamp  >  ( last-request-timestamp ) then igonore cahsback
     // console.log(requests_object)
     let last_request_timeStamp = requests_object.slice(-1).map(last_request_timeStamp =>{
         return Number(last_request_timeStamp.time_stamp);
     });

      requests_object.forEach( request => {
        request_id_Counter++;
       if(request.operation_type == 'withdraw')
         {
           if(withdraw(Number(request.account_id), Number(request.amount)))
           {
                if(valid_cashback(Number(request.time_stamp),  Number(last_request_timeStamp)))
                {
                  let cashback_amout = Math.floor(2*(Number(request.amount))/100)
                  cashback(Number(request.account_id), cashback_amout)   //  withdraw amount of money from the account.
                }
               else
                {
                        return;
                }
           }
         else
            {
              // bad_request.push(-Number(request_id));
                 return bad_request
            }
         }

       if(request.operation_type == 'deposit')
         {
          deposit(Number(request.account_id), Number(request.amount)) 
         }
      })
     return bad_request == 0? balances:[bad_request] 
    // return balances
    // return bad_request
}
//---------------------------====================================================================
function withdraw(holder_id: Number, amount: Number)   //  withdraw amount of money from the account. 
{
    if(valid_withdraw_request(Number(holder_id), amount))
    {
      let account_balance = balances[Number(holder_id)-1] - Number(amount);
      balances[Number(holder_id)-1] = account_balance;
      return balances;
    }
  return bad_request;
}

function deposit(holder_id: Number, amount: Number)     //  deposit amount of money to account. 
{
 // every depost pushes to array of account (balances) and  return it 
 let account_balance = balances[Number(holder_id)-1] + Number(amount);
 balances[Number(holder_id)-1] = account_balance;
 return balances;
}

function cashback(holder_id: Number, cashback_amout: Number)   //  withdraw amount of money from the account. 
{
  let account_balance = balances[Number(holder_id)-1] + Number(cashback_amout) ;
      balances[Number(holder_id)-1] = account_balance;
      return balances;

}

function valid_cashback(request_time_stampt:Number, last_request_timeStamp:Number )
{ 
// calculate cahsbak timestamp (withd-request-timestamp+86400)< last-req-timestamp then true
// else cahsbak timestamp  >  ( last-request-timestamp ) then igonore cahsback
  let cashback_timeStamp = Number(request_time_stampt)+86400
  if (cashback_timeStamp <= last_request_timeStamp)
  {
    return true;
  }
 return false;
}

function valid_withdraw_request(holder_id:Number, amount:Number)
{
  let total_balance:number = (balances[Number(holder_id)-1]) - Number(amount); 
   if (total_balance >= 0)
    {
      return true;
    }
    bad_request= -Number(request_id_Counter);
   return false;
}

function fomat_requests ( requests:string[])
{
    let withdraw_operations = [];
    let deposit_operations = [];
    let requests_object = [];

    for (let i = 0; i < requests.length; i++)
    {
        // split on space and remove empty arrays
      let arr = requests[i].split(" ").filter( (request: string)=>  { return request != ''}  );
          
              let schema = { 
                              operation_type : arr[0],
                              time_stamp: arr[1],
                              account_id:arr[2],
                              amount: arr[3]
                           }
              requests_object.push(schema) ;           
                 
    }
  return requests_object

}

console.log(bank_Requests_Daily_Cashback(balances, requests));
//ank_Requests_Daily_Cashback(balances, requests)
